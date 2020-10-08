
const {sqrt, abs} = Math;

export class Vector2 {
    constructor(x=0, y=0) {
        this.x = +x;
        this.y = +y;
    }
    set(src) {
        return this.setXY(src.x, src.y);
    }
    setXY(x, y) {
        this.x = +x;
        this.y = +y;
        return this;
    }
}


export function move(src, dst) {
    if (dst == null) {
        dst = zero();
    }
    dst.x = +src.x;
    dst.y = +src.y;
    return dst;
}

export function zero(out) {
    return xy(0, 0, out);
}

export function xy(x, y, out) {
    if (out == null) {
        return new Vector2(+x, +y);
    }
    out.x = +x;
    out.y = +y;
    return out;
}

export function copy(v, out) {
    if (out == null) {
        out = zero();
    }
    if (v == null) {
        out.x = 0;
        out.y = 0;
        return out;
    }
    out.x = +v.x;
    out.y = +v.y;
    return out;
}

export function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}

export function len2(v) {
    return dot(v, v);
}

export function len(v) {
    return sqrt(len2((v)));
}

export function dist2(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx*dx + dy*dy;
}

export function dist(a, b) {
    return sqrt(dist2(a, b));
}

export function add(a, b, out) {
    if (out == null) {
        out = zero();
    }
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
}
export function addmul(a, b, s, out) {
    if (out == null) {
        out = zero();
    }
    out.x = a.x + b.x * s;
    out.y = a.y + b.y * s;
    return out;
}
export function sub(a, b, out) {
    if (out == null) {
        out = zero();
    }
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
}
export function mul(a, x, out) {
    if (out == null) {
        out = zero();
    }
    out.x = a.x * x;
    out.y = a.y * x;
    return out;
}

export function neg(a, out) {
    if (out == null) {
        out = zero();
    }
    out.x = -a.x;
    out.y = -a.y;
    return out;
}

export function norm(a, out) {
    if (out == null) {
        out = zero();
    }
    const d = len(a);
    const x = d < EPSILON ? 0 : 1 / d;
    return mul(a, x, out);
}


export function lerp(x, a, b, out) {
    return combine2(1 - x, a, x, b, out);
}

export function combine2(a0, v0, a1, v1, out) {
    if (out == null) {
        out = zero();
    }
    const outx = a0 * v0.x + a1 * v1.x;
    const outy = a0 * v0.y + a1 * v1.y;
    out.x = outx;
    out.y = outy;
    return out;
}


export function solve(vx, vy, tt, out) {
    if (out == null) {
        out = zero();
    }
    const a = vx.x;
    const b = vy.x;
    const c = vx.y;
    const d = vy.y;
    const det = a * d - b * c;
    if (abs(det) < EPSILON) {
        return null;
    }
    const idet = 1 / det;
    const ia = d * idet;
    const ib = -b * idet;
    const ic = -c * idet;
    const id = a * idet;
    const ccx = tt.x;
    const ccy = tt.y;
    out.x = ia * ccx + ib * ccy;
    out.y = ic * ccx + id * ccy;
    return out;
}

export const EPSILON = 0.0002;
