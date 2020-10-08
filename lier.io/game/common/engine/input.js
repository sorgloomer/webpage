export class EngineInput {
    constructor(other) {
        this.moveLeft = other?.moveLeft ?? false;
        this.moveRight = other?.moveRight ?? false;
        this.jump = other?.jump ?? false;
        this.squat = other?.squat ?? false;
        this.fire = other?.fire ?? false;
        this.hook = other?.hook ?? false;
        this.aimx = other?.aimx ?? 0;
        this.aimy = other?.aimy ?? 0;
    }

    clone() {
        return new EngineInput(this);
    }

    pack(out) {
        if (out == null) {
            out = [];
        }
        out.length = 8;
        out[0] = this.moveLeft ? 1 : 0;
        out[1] = this.moveRight ? 1 : 0;
        out[2] = this.jump ? 1 : 0;
        out[3] = this.squat ? 1 : 0;
        out[4] = this.fire ? 1 : 0;
        out[5] = this.hook ? 1 : 0;
        out[6] = this.aimx * 100;
        out[7] = this.aimy * 100;
        return out;
    }
    unpack(v) {
        this.moveLeft = !!v[0];
        this.moveRight = !!v[1];
        this.jump = !!v[2];
        this.squat = !!v[3];
        this.fire = !!v[4];
        this.hook = !!v[5];
        this.aimx = +v[6] / 100;
        this.aimy = +v[7] / 100;
    }

    dumpJson(out) {
        if (out != null) {
            out.l = this.moveLeft ? 1 : 0;
            out.r = this.moveRight ? 1 : 0;
            out.j = this.jump ? 1 : 0;
            out.s = this.squat ? 1 : 0;
            out.f = this.fire ? 1 : 0;
            out.h = this.hook ? 1 : 0;
            out.x = this.aimx;
            out.y = this.aimy;
            return out;
        }
        return {
            l: this.moveLeft ? 1 : 0,
            r: this.moveRight ? 1 : 0,
            j: this.jump ? 1 : 0,
            s: this.squat ? 1 : 0,
            f: this.fire ? 1 : 0,
            h: this.hook ? 1 : 0,
            x: this.aimx,
            y: this.aimy,
        };
    }

    loadJson(obj) {
        this.moveLeft = !!obj.l;
        this.moveRight = !!obj.r;
        this.jump = !!obj.j;
        this.squat = !!obj.s;
        this.fire = !!obj.f;
        this.hook = !!obj.h;
        this.aimx = +obj.x;
        this.aimy = +obj.y;
    }

    static dumpJson(input, out) {
        return input.dumpJson(out);
    }
    static loadJson(json, out) {
        if (out == null) {
            out = new EngineInput();
        }
        out.loadJson(json);
        return out;
    }
}
