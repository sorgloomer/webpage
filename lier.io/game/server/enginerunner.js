import {Engine} from "../common/engine/engine.js";
import {StateSynchronizer} from "./statesync.js";
import {EngineInput} from "../common/engine/input.js";
import {GAME_MS_PER_FRAME, FRAMES_PER_REAL_MS} from "../common/engine/simconf.js";

const {min, floor} = Math;


const MAX_CATCHUP = 20;

export class EngineServlet {
    constructor(callbacks) {
        this.engine = null;
        this.callbacks = callbacks;
    }
    send(msg) {
        switch (msg.type) {
            case "create":
                this.engine = new EngineRunner(this);
                this.engine.start();
                return;
            case "close":
                this.engine?.close();
                this.engine = null;
                this.callbacks.close();
                return;
            case "input":
                this.engine.do__input(msg.id, msg.diff);
                return;
        }
    }

    updates(data) {
        this.callbacks.emit({type:"updates", updates:data});
    }
}

class EngineRunner {
    constructor(callbacks) {
        this.engine = new Engine();
        this.lastFrameIndex = 0;

        this.inputs = [new EngineInput(), new EngineInput()];
        this._packedInputs = [];

        this.callbacks = callbacks;
        this.synchronizer = new StateSynchronizer(this.engine);
        this.loop = null;
    }

    close() {
        this.stop();
    }

    start() {
        if (this.loop == null) {
            this.loop = new EngineLoop(this);
        }
    }
    stop() {
        this.loop?.close();
        this.loop = null;
    }

    do__input(playerId, diff) {
        this.inputs[playerId].unpack(diff);
    }

    step() {
        this.lastFrameIndex++;
        this.engine.step(this.inputs);
        const bodies = this.synchronizer.step();
        this._packInputs();
        this.callbacks.updates({
            frame: this.lastFrameIndex,
            bodies,
            inputs: this._packedInputs
        });
    }
    _packInputs() {
        this._packedInputs.length = this.inputs.length;
        this.inputs.forEach((inp, idx) => {
            const temp = inp.pack(this._packedInputs[idx]);
            temp.unshift(idx);
            this._packedInputs[idx] = temp;
        });
        return this._packedInputs;
    }
}

class EngineLoop {
    constructor(state) {
        this.state = state;
        this.continued = getTimestampMS();
        const alreadySimulated = state.lastFrameIndex * GAME_MS_PER_FRAME;
        this.epoch = this.continued - alreadySimulated;

        this.intervalId = setInterval(() => this.wake(), GAME_MS_PER_FRAME);
    }

    wake() {
        const currentTimestamp = getTimestampMS();
        const expectedFrameIndex = floor((currentTimestamp - this.epoch) * FRAMES_PER_REAL_MS);
        const stepsToRun = min(expectedFrameIndex - this.state.lastFrameIndex, MAX_CATCHUP);
        this.state.lastWakeTimestamp = currentTimestamp;
        for (let i = 0; i < stepsToRun; i++) {
            this.state.step();
        }
    }

    close() {
        clearInterval(this.intervalId);
    }
}

function getTimestampMS() {
    return performance.now();
}
