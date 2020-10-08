import {GAME_SECONDS_PER_REAL_SECONDS} from "../engine/simconf.js";

const {sign} = Math;

export function moveForceFraction(velocity, target) {
    const frac = velocity / target;
    return sign(target) * clamp(2 - 2 * frac);
}

export function getTimestamp() {
    return performance.now() * 0.001;
}

export function getGameTimestamp() {
    return getTimestamp() * GAME_SECONDS_PER_REAL_SECONDS;
}

export function linkedForEach(i, fn) {
    while (i) {
        const r = fn(i);
        if (r !== void 0) {
            return r;
        }
        i = i.getNext();
    }
}

export function linkedForEach2(i, fn) {
    while (i) {
        const r = fn(i);
        if (r !== void 0) {
            return r;
        }
        i = i.next;
    }
}
