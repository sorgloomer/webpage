import {planck as pl} from '../lib/planck.js';
import {InputRegistry} from './client/inputregistry.js';

import {Peer} from "../lib/peerjs.js";
import {Engine, forEachBodyOfEngine} from "./common/engine/engine.js";
import * as snapshots from "./common/engine/snapshots.js";
import {getTimestamp} from "./common/utils/utils.js";
import {Display} from "./client/display.js";
import {GameServerWorker} from "./server/worker.js";
import {
    FRAMES_PER_REAL_SECOND,
    GAME_SECONDS_PER_FRAME,
    GAME_SECONDS_PER_REAL_SECONDS
} from "./common/engine/simconf.js";
import {EngineInput} from "./common/engine/input.js";
import {Timestamps} from "./stuff.js";

const {Vec2} = pl;


const SIMULATE_NETWORK = false;
const SIMULATED_NETWORK_DELAY = SIMULATE_NETWORK ? 25 : 0;
const SIMULATED_NETWORK_JITTER = SIMULATED_NETWORK_DELAY;
const SIMULATED_NETWORK_LOSS = SIMULATE_NETWORK ? 0.2 : 0;

function simulateBadNetwork(fn) {
    if (Math.random() >= SIMULATED_NETWORK_LOSS) {
        setTimeout(() => {
            fn();
        }, SIMULATED_NETWORK_DELAY + Math.random() * SIMULATED_NETWORK_JITTER);
    }
}


class RememberingAccumulator {
    constructor() {
        this._accumulator = 0;
        this.sample = 0;
    }
    accumulate(x) {
        this._accumulator += this._size(x);
    }
    _size(x) {
        return JSON.stringify(x).length;
    }
    flush() {
        this.sample = this._accumulator;
        this._accumulator = 0;
    }
}

function inputdiff(a, b, opts) {
    var res = null;
    function _field(f) {
        if (a[f] !== b[f]) {
            (res = (res || {}))[f] = b[f];
        }
    }
    _field("moveLeft");
    _field("moveRight");
    _field("jump");
    _field("fire");
    _field("aimx");
    _field("aimy");
    return res;
}

async function main() {
    var canvas = document.querySelector(".game-canvas");
    var args = new URLSearchParams(window.location.hash.substr(1));
    const debugView = !!args.get("display.debugView");
    const interpolationMode = args.get("display.interpolationMode") || undefined;
    const HOST_PEER_ID_PARAM = "hostid";
    const peerId = args.get(HOST_PEER_ID_PARAM);
    var engine = new Engine();
    var engine2 = new Engine();
    var fps = 0, fpsCounter = 0;
    forEachBodyOfEngine(engine2, body2 => {
        const body1 = engine.fromId(engine2.idOf(body2));
        const ud = body1.getUserData();
        const iden = ud.identity;
        body2.getUserData().identity = iden;
        iden.newestBody = body1;
        iden.obsoleteBody = body2;
    });

    const playerNumber = peerId ? 1 : 0;
    var display = new Display({engine, canvas, debugView, interpolationMode, playerNumber});

    var inputManager = new InputRegistry(canvas, window);
    var playerInputs = [new EngineInput(),new EngineInput()];
    var myOldInputs = new EngineInput();
    var signalingHost = args.get("peerserver") || undefined;

    var realTimestamp = getTimestamp();
    var simulatedFrameCount = _expectedSimulatedFrame(realTimestamp);

    const serverWorker = peerId ? null : makeLocalGameServer();

    updateCanvasResolution();
    window.addEventListener("resize", () => {
        updateCanvasResolution();
    });


    const upstreamBandwidth = new RememberingAccumulator();
    const downstreamBandwidth = new RememberingAccumulator();
    setInterval(() => {
        upstreamBandwidth.flush();
        downstreamBandwidth.flush();
        fps = fpsCounter;
        fpsCounter = 0;
    }, 1000);



    var connection;

    var peer = new Peer(null, getpeeropts(signalingHost));

    peer.on('open', function (id) {
        console.log('peer.id: ' + peer.id);
        var clienturl = new URL(window.location);

        var params = new URLSearchParams(window.location.hash.substr(1));
        params.set(HOST_PEER_ID_PARAM, peer.id);
        clienturl.hash = params.toString();

        myclientlink.href = clienturl.href;

        if (peerId) {
            gotConnection(peer.connect(peerId, {
                reliable: true,
            }));
        }
    });

    peer.on("error", e => {
        console.error("peer error", e);
    });
    peer.on('close', function() {
        console.log('Connection destroyed');
    });
    peer.on('disconnected', function() {
        console.log('Peer disconnected');
    });
    peer.on('connection', conn => {
        if (serverWorker) {
            gotConnection(conn);
        } else {
            console.error("Clients do not expect connections!");
            setTimeout(() => { conn.close(); }, 100);
        }
    });

    function gotConnection(conn) {
        connection = conn;
        conn.on('open', () => {
            console.log("connected");
        });
        conn.on('error', e => {
            console.error("PeerJS connection error", e);
        });
        conn.on('close', e => {
            console.error("PeerJS connection closed", e);
        });

        conn.on('data', e => {
            if (serverWorker) {
                const remotePlayerId = 1;
                if (e.type === "input") {
                    serverWorker.updateInput(remotePlayerId, e.diff);
                }
            } else {
                if (e.type === "update") {
                    handleUpdates(e.updates);
                }
            }
        });
    }

    function handleUpdates(updates) {
        const timestamps = deriveTimestamps();
        updates?.bodies?.forEach(u => {
            snapshots.infuse(engine, u, timestamps.realTimestamp, timestamps.gameTimestamp, timestamps.gameTimeAfterLastSimulatedFrame, display._interpolator);
        });
        updates?.inputs?.forEach(packedinput => {
            const playernumber = packedinput.shift();
            var sti = playerInputs[playernumber];
            if (sti == null) {
                sti = new EngineInput();
                playerInputs[playernumber] = sti;
            }
            sti.unpack(packedinput);
        });
    }

    function send(x) {
        if (connection?.open ?? false){
            connection.send(x);
        }
    }


    setInterval(() => {
        handleInputs();
    }, 10);

    function handleInputs() {
        var aim = display.screenToWorld(inputManager.mouse, Vec2());
        var newInputs = new EngineInput();
        newInputs.jump = inputManager.pressed(" ") || inputManager.pressed("ArrowUp") || inputManager.pressed("w");
        newInputs.squat = inputManager.pressed("ArrowDown") || inputManager.pressed("s");
        newInputs.moveLeft = inputManager.pressed("ArrowLeft") || inputManager.pressed("a");
        newInputs.moveRight = inputManager.pressed("ArrowRight") || inputManager.pressed("d");
        newInputs.fire = inputManager.pressed("MouseButton0");
        newInputs.hook = inputManager.pressed("MouseButton2");
        newInputs.aimx = aim.x;
        newInputs.aimy = aim.y;


        myOldInputs = newInputs;

        setTimeout(() => {
            playerInputs[playerNumber] = newInputs;
        }, SIMULATED_NETWORK_DELAY + SIMULATED_NETWORK_JITTER * 0.5); // simulate averaged halfway delay

        const inputDiff = newInputs.pack();
        if (inputDiff) {
            var msg = {type: "input", diff: inputDiff};
            upstreamBandwidth.accumulate(msg);
            if (serverWorker != null) {
                simulateBadNetwork(() => {
                    serverWorker.updateInput(playerNumber, inputDiff);
                });
            } else {
                send(msg);
            }
        }
    }

    function _expectedSimulatedFrame(realTimestamp) {
        return Math.floor(realTimestamp * FRAMES_PER_REAL_SECOND);
    }

    function handleSimulateFramePrediction() {
        const expectedSimulatedFrame = _expectedSimulatedFrame(realTimestamp);
        const simulateFrameCount = Math.min(20, expectedSimulatedFrame - simulatedFrameCount);
        for (let i = 0; i < simulateFrameCount; i++) {
            engine.step(playerInputs);
            engine2.step(playerInputs);
            simulatedFrameCount += 1;
        }
    }

    const _timestamps = new Timestamps();
    function deriveTimestamps(out) {
        if (out == null) {
            out = _timestamps;
        }
        const gameTimestamp = realTimestamp * GAME_SECONDS_PER_REAL_SECONDS;
        const lastFrameGameTimestamp = simulatedFrameCount * GAME_SECONDS_PER_FRAME;
        const gameTimeAfterLastSimulatedFrame = Math.min(gameTimestamp - lastFrameGameTimestamp, GAME_SECONDS_PER_FRAME);
        out.lastFrameGameTimestamp = lastFrameGameTimestamp;
        out.gameTimeAfterLastSimulatedFrame = gameTimeAfterLastSimulatedFrame;
        out.realTimestamp = realTimestamp;
        out.gameTimestamp = gameTimestamp;
        out.simulatedFrameCount = simulatedFrameCount;
        return out;
    }

    function handleDrawFrame() {
        fpsCounter++;
        const timestamps = deriveTimestamps();
        display.clear();
        display.draw(timestamps.gameTimeAfterLastSimulatedFrame, timestamps.gameTimestamp, timestamps.realTimestamp);
        display.infos([
            `FPS: ${fps}`,
            `client upstream bandwidth: ${upstreamBandwidth.sample * 8 / 1000} kbits/sec`,
            `client downstream bandwidth: ${downstreamBandwidth.sample * 8 / 1000} kbits/sec`,
            `gameTimeAfterLastSimulatedFrame: ${Math.round(timestamps.gameTimeAfterLastSimulatedFrame*100)/100} gamesecs`,
            `lastFrameGameTimestamp: ${Math.round(timestamps.lastFrameGameTimestamp*100)/100} gamesecs`,
            `gameTimestamp: ${Math.round(timestamps.gameTimestamp*100)/100} gamesecs`,
            `realTimestamp: ${Math.round(timestamps.realTimestamp*100)/100} gamesecs`,
            `simulatedFrameCount: ${timestamps.simulatedFrameCount} frames`,
        ]);
    }

    function iterateAnimationFrame() {
        realTimestamp = getTimestamp();
        handleSimulateFramePrediction();
        handleDrawFrame();
    }

    scheduleFrame();
    function loop() {
        scheduleFrame();
        iterateAnimationFrame();
    }
    function scheduleFrame() {
        window.requestAnimationFrame(loop);
    }

    function updateCanvasResolution() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    function makeLocalGameServer() {
        return new GameServerWorker({
            update(updates) {
                downstreamBandwidth.accumulate(updates);
                simulateBadNetwork(() => handleUpdates(updates));
                send({type:"update", updates});
            }
        });
    }

    function getpeeropts(signalingHost) {
        if (signalingHost === "peerjs") {
            return undefined;
        }
        return {
            host: signalingHost || "localhost",
            port: 9000,
        }
    }


}

window.addEventListener("load", () => {
    main().catch(console.error);
});

