import * as vec2 from "../common/utils/vec2.js";

export class Caternary2 {
    constructor(s) {
        this.ps = [];
        this.rs = [];
        this.vs = [];
        this.g = vec2.xy(0, -1);
        const points = 10;
        const segments = points - 1;
        for (let i = 0; i < points; i++) {
            this.ps.push(vec2.zero());
            this.rs.push(vec2.zero());
            this.vs.push(vec2.zero());
        }
        this.u = this.ps[0];
        this.v = this.ps[this.ps.length - 1];
        this.sl = s / segments;
        this._v0 = vec2.zero();
        this._v1 = vec2.zero();
        this._v2 = vec2.zero();
        this.initialized = false;
        this.dt = 0.02;
        this.tension = 2;
        this.attenuation = 0.98;
        this.rounds = 3;
        this.positionRounds = 3;
    }

    solve(s, ux, uy, vx, vy, init) {
        this.u.setXY(ux, uy);
        this.v.setXY(vx, vy);
        const n = this.ps.length;
        if (init || !this.initialized) {
            for (let i = 0; i < n; i++) {
                vec2.lerp(i / (n - 1), this.u, this.v, this.ps[i]);
            }
            this.initialized = true;
        }
        for (let rounds = 0; rounds < this.rounds; rounds++) {
            for (let i = 1; i < n - 1; i++) {
                const accel = this._tensionDir(i, this._v0);
                vec2.addmul(accel, this.g, this.dt, accel);
                vec2.combine2(this.attenuation, this.vs[i], this.tension, accel, this.vs[i]);
            }
            for (let i = 1; i < n - 1; i++) {
                vec2.addmul(this.ps[i], this.vs[i], this.dt, this.ps[i]);
            }
            for (let pp = 0; pp < this.positionRounds; pp++) {
                for (let i = 1; i < n - 1; i++) {
                    vec2.copy(this.ps[i], this.rs[i]);
                }
                for (let i = 1; i < n - 1; i++) {
                    const accel = this._tensionDir(i, this._v0);
                    vec2.addmul(this.rs[i], accel, 0.33, this.rs[i]);
                }
                for (let i = 1; i < n - 1; i++) {
                    vec2.copy(this.rs[i], this.ps[i]);
                }
            }
        }
    }


    _tensionDir(i, out) {
        const accel = vec2.zero(out);
        {
            const d = vec2.sub(this.ps[i], this.ps[i - 1], this._v1);
            const l0 = vec2.len(d);
            vec2.addmul(accel, d, (this.sl - l0) / l0, accel);
        }
        {
            const d = vec2.sub(this.ps[i], this.ps[i + 1], this._v1);
            const l0 = vec2.len(d);
            vec2.addmul(accel, d, (this.sl - l0) / l0, accel);
        }
        return accel;
    }
}



class Caternary {
    constructor() {
        this.a = 0;
        this.x0 = 0;
        this.y0 = 0;
        this.s0 = 0;


        this.s = 1;
        this.dx = 0;
        this.dy = 0;
        this.vx = 0;
        this.vy = 0;
        this.ux = 0;
        this.uy = 0;
        this.ovx = 0;
        this.ovy = 0;
        this.oux = 0;
        this.ouy = 0;

        this._v = vec2.zero();
    }

    solve(s, vx, vy, ux, uy) {
        this.ovx = vx;
        this.ovy = vy;
        this.oux = ux;
        this.ouy = uy;
        this.s = s;
        if (vx <= ux) {
            this.vx = vx;
            this.vy = vy;
            this.ux = ux;
            this.uy = uy;
        } else {
            this.vx = ux;
            this.vy = uy;
            this.ux = vx;
            this.uy = vy;
        }
        this.dx = ux - vx;
        this.dy = uy - vy;
        if (vx === ux) {
            return;
        }

        this.x0 = (vx + ux) / 2;
        this.y0 = (vy + uy) / 2;
        this.s0 = s / 2;
        this.a = 1;

        let spd = 1;
        let lasterr = this._err();
        for (let ii = 0; ; ii++) {
            const gradx0 = this._gradat(1, 0, spd);
            const grada0 = this._gradat(0, 1, min(spd, this.a / 2));


            const oldx0 = this.x0;
            const olda = this.a;
            this.x0 -= spd * gradx0;
            this.a -= spd * grada0;
            const err = this._err();
            if (err < lasterr && this.a > 0) {
                spd *= 1.2;
                lasterr = err;
            } else {
                spd *= 0.5;
                this.x0 = oldx0;
                this.a = olda;
            }
            if (err < 0.00001) {
                break; // converged
            }
            if (spd < 0.000001) {
                break; // local minimum
            }
            if (ii > 50000) {
                break; // did not converge
            }
        }
        this.s0 = this.a * sinh(abs(this.x0 - this.vx) / this.a);
        this.y0 = this._y0();
    }

    _err() {
        this.y0 = this._y0();
        const diffvy2 = this.y0 + this.a * cosh((this.vx - this.x0) / this.a) - this.vy;
        const diffuy2 = this.y0 + this.a * cosh((this.ux - this.x0) / this.a) - this.uy;

        const s2 = this.a * sinh((this.ux - this.x0) / this.a) - this.a * sinh((this.vx - this.x0) / this.a);
        const diffs2 = s2 - this.s;
        return diffvy2 * diffvy2 + diffuy2 * diffuy2 + diffs2 * diffs2;
    }
    _gradat(dx0, da, eps) {
        return (
            this._errat(+eps * dx0, +eps * da) -
            this._errat(-eps * dx0, -eps * da)
        ) / eps;
    }
    _errat(dx0, da) {
        const oldx0 = this.x0;
        const olda = this.a;
        const oldy0 = this.y0;
        this.x0 += dx0;
        this.a += da;
        const result = this._err();
        this.x0 = oldx0;
        this.y0 = oldy0;
        this.a = olda;
        return result;
    }

    _y0() {
        const yyv = this.a * cosh((this.vx - this.x0) / this.a);
        const yyu = this.a * cosh((this.ux - this.x0) / this.a);
        return (this.vy + this.uy - yyv - yyu) / 2;
    }

    pat(s1, out) {
        if (out == null) {
            out = this._v;
        }
        if (this.ovx > this.oux) {
            s1 = this.s - s1;
        }

        if (abs(this.dx) < 0.01) {
            out.x = this.ovx + this.dx * s1 / this.s;
            out.y = max(this.ovy - s1, this.ouy - this.s + s1);
            return out;
        }
        const dx = this._dxForDs(s1 - this.s0);
        const dy = this.a * cosh(dx / this.a);
        out.x = this.x0 + dx;
        out.y = this.y0 + dy;
        return out;
    }

    _dxForDs(ds) {
        let xmax = 100 * abs(ds), xmin = -xmax;
        return bisect(tx => this.a * sinh(tx / this.a) - ds, xmin, xmax);
    }
}

function bisect(fn, rmin, rmax, eps) {
    if (eps == null) eps = 0.0002;
    let xmin = min(rmin, rmax);
    let xmax = max(rmin, rmax);
    const fnxmin = fn(xmin);
    const fnxmax = fn(xmax);
    const dir = sign(fnxmax - fnxmin);
    for (let guard = 0;; guard++) {
        const xmid = (xmin + xmax) / 2;
        if (xmax < xmin + eps) {
            return xmid;
        }
        if (!(xmin < xmax) || guard > 50) { // this check !(xmin < xmax) accounts for NaN-s too
            throw Error();
        }
        const ymid = fn(xmid);
        if (ymid * dir < 0) {
            xmin = xmid;
        } else {
            xmax = xmid;
        }
    }
}
