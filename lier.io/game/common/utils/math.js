
export {Transform} from './transform.js';

const {min, max, floor} = Math;

export function lerp(x, a, b) {
    return a + (b - a) * x;
}

export function lerpAngle(x, a, b) {
    var r = oddMod(b - a, 2 * Math.PI);
    return a + r * x;
}

function oddMod(a, b) {
    return oddFrac(a / b) * b;
}

function oddFrac(a) {
    return a - Math.round(a);
}

export function lerpV(x, a, b, out) {
    var outx = a.x + (b.x - a.x) * x;
    var outy = a.y + (b.y - a.y) * x;
    out.x = outx;
    out.y = outy;
    return out;
}

export function lexpV(x, p, v, out) {
    var outx = p.x + v.x * x;
    var outy = p.y + v.y * x;
    out.x = outx;
    out.y = outy;
    return out;
}

export function fmod(a, b) {
    return a - floor(a / b) * b;
}

export function clamp(x) {
    return min(1, max(0, x));
}
