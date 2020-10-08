const {Float64Array} = self;
const {cos, sin} = Math;


export class Transform {
    constructor() {
        this.m = new Float64Array(6);
        this.setIdentity();
    }

    reset() {
        return this.setIdentity();
    }

    setIdentity() {
        const m = this.m;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 1;
        m[4] = 0;
        m[5] = 0;
        return this;
    }

    setRotation(a) {
        const { m } = this;
        a = +a;
        var cosa = cos(a);
        var sina = sin(a);
        m[0] = cosa;
        m[1] = sina;
        m[2] = -sina;
        m[3] = cosa;
        m[4] = 0;
        m[5] = 0;
        return this;
    }

    setScaling(s) {
        s = +s;
        const { m } = this;
        m[0] = s;
        m[1] = 0;
        m[2] = 0;
        m[3] = s;
        m[4] = 0;
        m[5] = 0;
        return this;
    }

    setInverse(t) {
        var m = t.m;
        var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
        var idt = 1 / (m0 * m3 - m1 * m2);
        var n = this.m;
        n[0] = m3 * idt;
        n[1] = -m1 * idt;
        n[2] = -m2 * idt;
        n[3] = m0 * idt;
        n[4] = (m2 * m5 - m3 * m4) * idt;
        n[5] = (m1 * m4 - m0 * m5) * idt;
        return this;
    }

    invert(out=this) {
        return out.setInverse(this);
    }

    rotate(a, out=this) {
        return this.multiply(_temp.setRotation(a), out);
    }

    scale(s, out=this) {
        return this.scaleXY(s, s, out);
    }

    scaleXY(x, y, out=this) {
        const m = this.m;
        const n = out.m;
        n[0] = m[0] * x;
        n[1] = m[1] * x;
        n[2] = m[2] * y;
        n[3] = m[3] * y;
        n[4] = m[4];
        n[5] = m[5];
        return out;
    }

    translate(tx, ty, out=this) {
        const m = this.m;
        const n = out.m;
        const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
        n[0] = m0;
        n[1] = m1;
        n[2] = m2;
        n[3] = m3;
        n[4] = m0 * tx + m2 * ty + m4;
        n[5] = m1 * tx + m3 * ty + m5;
        return out;
    }

    translateV(v, out=this) {
        return this.translate(v.x, v.y, out);
    }

    multiply(right, out=this) {
        const a = this.m;
        const b = right.m;
        const o = out.m;
        const m0 = a[0] * b[0] + a[2] * b[1];
        const m1 = a[1] * b[0] + a[3] * b[1];
        const m2 = a[0] * b[2] + a[2] * b[3];
        const m3 = a[1] * b[2] + a[3] * b[3];
        const m4 = a[0] * b[4] + a[2] * b[5] + a[4];
        const m5 = a[1] * b[4] + a[3] * b[5] + a[5];
        o[0] = m0;
        o[1] = m1;
        o[2] = m2;
        o[3] = m3;
        o[4] = m4;
        o[5] = m5;
        return out;
    }

    set(mx) {
        this.m.set(mx.m);
        return this;
    }

    transform(v, out={x:0,y:0}) {
        const m = this.m;
        const x = m[0] * v.x + m[2] * v.y + m[4];
        const y = m[1] * v.x + m[3] * v.y + m[5];
        out.x = +x;
        out.y = +y;
        return out;
    }
}

const _temp = new Transform();
