import { planck as pl } from "../../../lib/planck.js";
import * as planckutils from "./planckutils.js";
import * as vec2 from "../utils/vec2.js";
import {clamp} from "../utils/math.js";

const { Vec2 } = pl;
const { min } = Math;

const PLAYER_FIXDEF = {
    friction: 0,
    restitution: 0,
};
const PLAYER_FOOT_FIXDEF = {
    friction: 3,
    restitution: 0,
};
const FOOT_RADIUS = 0.3;

export class Player {
    constructor(engine, idx) {
        this.engine = engine;
        this.footRadius = FOOT_RADIUS;
        this.index = idx;


        var playerX = -1 + idx;
        this.body = engine._createBody({
            id: `players[${idx}].body`,
            type: 'dynamic',
            position: Vec2(playerX, 2.25),
            linearDamping: 1.1,
        });
        this.body.setMassData({
            I: 0,
            center: Vec2(0, 0),
            mass: 0.5,
        });
        this.body.createFixture(planckutils.rectangle(0.55, 0.5), PLAYER_FIXDEF);
        this.body.createFixture(pl.Circle(Vec2(0, 0.25), FOOT_RADIUS), PLAYER_FIXDEF);
        this.foot = engine._createBody({
            id: `players[${idx}].foot`,
            type: 'dynamic',
            position: Vec2(playerX, 2),
            linearDamping: 1.1,
        });
        this.foot.setMassData({
            I: 0,
            center: Vec2(0, 0),
            mass: 0.5,
        });
        this.footFixture = this.foot.createFixture(pl.Circle(FOOT_RADIUS), PLAYER_FOOT_FIXDEF);

        this.engine.world.createJoint(pl.RevoluteJoint({
            collideConnected: false,
        }, this.foot, this.body, this.foot.getPosition()));
        this.hook = new Hook();

    }
}


class Hook {
    constructor() {
        this.releasing = false;
        this.hooked = false;
        this.body = null;
        this.localAnchor = Vec2();
        this._worldAnchor = Vec2();
        this._v0 = vec2.zero();
        this._v1 = vec2.zero();
    }

    detach() {
        this.hooked = false;
        this.body = null;
    }
    attach(body, w) {
        this.body = body;
        this.localAnchor = body.getLocalPoint(w);
        this.hooked = true;
    }

    getWorldAnchor() {
        if (!this.hooked) {
            return null;
        }
        if (this.body == null) {
            return this.localAnchor;
        }
        return this.body.getWorldPoint(this.localAnchor);
    }

    applyForces(player) {
        if (!this.hooked) {
            return;
        }
        const wa = this.getWorldAnchor();
        const playerBody = player.body;
        const rope = vec2.sub(playerBody.getPosition(), wa, this._v0);
        const d = vec2.len(rope);
        if (d < 0.01) {
            return;
        }
        const fsize = ROPE_MIN_FORCE + clamp((d - ROPE_MIN_LENGTH) / (ROPE_MAX_LENGTH - ROPE_MIN_LENGTH)) * (ROPE_MAX_FORCE - ROPE_MIN_FORCE);
        const f = vec2.mul(rope, fsize / d, this._v1);
        this.body.applyForce(f, wa, true);
        playerBody.applyForceToCenter(vec2.neg(f), true);
    }
}

export const ROPE_MAX_LENGTH = 8;
export const ROPE_MIN_LENGTH = 4;
export const ROPE_MAX_FORCE = 70;
export const ROPE_MIN_FORCE = 0.2;
