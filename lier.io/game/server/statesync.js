import * as snapshots from "../common/engine/snapshots.js";
import {linkedForEach} from "../common/utils/utils.js";

const {sqrt} = Math;


const SYNC_BODY_PER_FRAME_COUNT = 20;

export class StateSynchronizer {
    constructor(engine) {
        this.engine = engine;
        this._stepCounter = 0;
        this.bodyPerFrameCount = SYNC_BODY_PER_FRAME_COUNT;
    }

    step() {
        this._stepCounter++;
        const engine = this.engine;

        let bodies = [];
        linkedForEach(this.engine.world.getBodyList(), body => {
            if (body.getUserData()) {
                bodies.push(body);
            }
        });

        bodies.forEach(b => {
            meta(b).priorityAccumulator += priority(b, engine);
        });
        bodies.sort(comparing(b => -meta(b).priorityAccumulator));
        // bodies = bodies.slice(0, this.bodyPerFrameCount);
        bodies = bodies.filter(b => meta(b).priorityAccumulator >= 0.99);
        bodies.forEach(b => {
            meta(b).priorityAccumulator = 0;
        });
        return bodies.map(b => snapshots.extract(engine, b));
    }
}

function meta(body) {
    return body.getUserData().identity;
}

function comparing(fn) {
    return (a, b) => {
        a = fn(a);
        b = fn(b);
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    };
}

function priority(body, engine) {
    var result = 0;
    engine.players.forEach(p => {
        result += _priorityForPlayer(body, p);
    });
    return result;
}

function _priorityForPlayer(body, player) {
    const a = body.getPosition();
    const b = player.foot.getPosition();
    const dst = dist(a, b);
    return 0.01 + 0.99 / (1 + dst);
}

function dist(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}
