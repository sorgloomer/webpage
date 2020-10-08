import {clamp, lerp, lerpAngle, lerpV, lexpV} from "./utils/math.js";
import {GAME_SECONDS_PER_FRAME} from "./engine/simconf.js";

import * as vec2 from "./utils/vec2.js";


export const InterpolationMode = {
    nearest: "nearest",
    extrapolate: "extrapolate",
    interpolate: "interpolate",
};

export class LinearMotionSnapshot {
    constructor() {
        this.position = vec2.zero();
        this.linearVelocity = vec2.zero();
        this.angle = 0;
        this.angularVelocity = 0;
    }
    set(other) {
        this.position.set(other.position);
        this.linearVelocity.set(other.linearVelocity);
        this.angle = other.angle;
        this.angularVelocity = other.angularVelocity;
    }

    static move(src, out) {
        if (src == null) {
            return null;
        }
        if (out == null) {
            out = new LinearMotionSnapshot();
        }
        out.set(src);
        return out;
    }
}

class Buffer {
    constructor(factory) {
        this.items = [];
        this.idx = 0;
        this.factory = factory;
    }
    next() {
        const i = this.idx++;
        const v = this.items[i];
        if (v != null) {
            return v;
        }
        return this.items[i] = this.factory();
    }
    reset() {
        this.idx = 0;
    }
}

function newLinearMotionSnapshot() {
    return new LinearMotionSnapshot();
}

export class BodyInterpolator {
    constructor({
        mode=InterpolationMode.interpolate,
        blendNetwork=true,
    }) {
        this.simulated = new SnapshotTriplet();
        this.obsolete = new SnapshotTriplet();
        this.drawable = null;

        this.lastObsoleteTimestamp = 0;
        this.obsoleteInterpolationRatio = 0;
        this.interFrameRatio = 0;
        this.gameTimeSinceLastSimulatedFrame = 0;
        this.gameTimestamp = 0;
        this.realTimestamp = 0;

        this.mode = mode;
        this.blendNetwork = blendNetwork;

        this._vectors = new Buffer(vec2);
        this._snapshots = new Buffer(newLinearMotionSnapshot);
    }


    interpolate(body, gameTimeSinceLastSimulatedFrame, gameTimestamp, realTimestamp, tag) {
        this._vectors.reset();
        this._snapshots.reset();

        this.drawable = null;

        const bodyIdentity = body.getUserData().identity;

        this.interFrameRatio = clamp(gameTimeSinceLastSimulatedFrame / GAME_SECONDS_PER_FRAME);
        this.gameTimeSinceLastSimulatedFrame = gameTimeSinceLastSimulatedFrame;
        this.gameTimestamp = gameTimestamp;
        this.realTimestamp = realTimestamp;

        this._frameBlendBody(body, this.simulated);
        return this._blendNetworkUpdate(bodyIdentity, tag);
    }

    updateSnapshot(body, realTimestamp) {
        this._vectors.reset();
        this._snapshots.reset();

        const simulatedUD = body.getUserData();
        const bodyIdentity = simulatedUD.identity;
        const obsoleteBody = bodyIdentity.obsoleteBody;

        if (obsoleteBody == null) {
            return;
        }

        const obsoleteUD = obsoleteBody.getUserData();
        const lastObsolete = obsoleteUD.drawingSnapshot;
        const lastSimulated = simulatedUD.drawingSnapshot;
        if (lastObsolete == null || lastSimulated == null) {
            this._infuseBody(this._snapshotBody(body), obsoleteBody);
            return;
        }

        const obsoleteInterpolationRatio = this._calcObsoleteInterpolationRatio(bodyIdentity, realTimestamp);
        this.obsoleteInterpolationRatio = obsoleteInterpolationRatio;

        if (obsoleteInterpolationRatio >= 1) {
            this._infuseBody(this._snapshotBody(body), obsoleteBody);
            lastObsolete.set(lastSimulated);
            return;
        }

        const currSimulated = this._snapshotBody(body);
        const currObsolete = this._snapshotBody(obsoleteBody);
        const currBetween = this._lerpSnapshots(obsoleteInterpolationRatio, currObsolete, currSimulated);
        const lastBetween = this._lerpSnapshots(obsoleteInterpolationRatio, lastObsolete, lastSimulated);

        lastObsolete.set(lastBetween);
        this._infuseBody(currBetween, obsoleteBody);
    }

    _frameBlendBody(body, out) {
        const bodyUserData = body.getUserData();
        const interFrameRatio = this.interFrameRatio;
        const gameTimeSinceLastSimulatedFrame = this.gameTimeSinceLastSimulatedFrame;

        switch (this.mode) {
            case InterpolationMode.extrapolate: {
                const last = this._snapshotBody(body);
                const curr = this._lexpSnapshot(last, gameTimeSinceLastSimulatedFrame);
                return out.set(last, curr, null);
            }
            case InterpolationMode.interpolate: {
                const last = bodyUserData.drawingSnapshot;
                const next = this._snapshotBody(body);
                const curr = last == null ? next : this._lerpSnapshots(interFrameRatio, last, next);
                return out.set(last, curr, next);
            }
            default:
                return out.set(null, this._snapshotBody(body), null);
        }
    }

    _lexpSnapshot(snapshot, dt, out) {
        if (out == null) {
            out = this._snapshots.next();
        }
        lexpV(dt, snapshot.position, snapshot.linearVelocity, out.position);
        out.linearVelocity.set(snapshot.linearVelocity);
        out.angle = snapshot.angle + dt * snapshot.angularVelocity;
        out.angularVelocity = snapshot.angularVelocity;
        return out;
    }

    _lerpSnapshots(ratio, s0, s1, out) {
        if (out == null) {
            out = this._snapshots.next();
        }
        lerpV(ratio, s0.position, s1.position, out.position);
        lerpV(ratio, s0.linearVelocity, s1.linearVelocity, out.linearVelocity);
        out.angle = lerpAngle(ratio, s0.angle, s1.angle);
        out.angularVelocity = lerp(ratio, s0.angularVelocity, s1.angularVelocity);
        return out;
    }

    _calcObsoleteInterpolationRatio(bodyIdentity, realTimestamp) {
        return clamp((realTimestamp - bodyIdentity.networkRefreshTimestamp) / bodyIdentity.networkInterpolationSpan);
    }

    _blendNetworkUpdate(bodyIdentity) {
        let drawable = this.simulated.curr;
        if (!this.blendNetwork) {
            return this.drawable = drawable;
        }
        const lastObsoleteTimestamp = bodyIdentity.networkRefreshTimestamp;
        const realTimestamp = this.realTimestamp;
        const obsoleteInterpolationRatio = this._calcObsoleteInterpolationRatio(bodyIdentity, realTimestamp);
        if (obsoleteInterpolationRatio < 1) {
            const obsolete = this._frameBlendBody(bodyIdentity.obsoleteBody, this.obsolete);
            drawable = this._lerpSnapshots(obsoleteInterpolationRatio, obsolete.curr, this.simulated.curr);
        } else {
            this.obsolete.set(null, null, null);
        }
        this.drawable = drawable;
        this.lastObsoleteTimestamp = lastObsoleteTimestamp;
        this.obsoleteInterpolationRatio = obsoleteInterpolationRatio;
        return drawable;
    }

    _snapshotBody(body, out) {
        if (out == null) {
            out = this._snapshots.next();
        }
        out.position.set(body.getPosition());
        out.linearVelocity.set(body.getLinearVelocity());
        out.angle = +body.getAngle();
        out.angularVelocity = +body.getAngularVelocity();
        return out;
    }
    _infuseBody(snapshot, body) {
        infuseBody(snapshot, body);
    }

    _copySnapshot(snapshot, out) {
        if (snapshot == null) {
            return null;
        }
        if (out == null) {
            out = this._snapshots.next();
        }
        return copySnapshot(snapshot, out);
    }
}

class SnapshotTriplet {
    constructor() {
        this.last = null;
        this.curr = null;
        this.next = null;
    }
    set(last, curr, next) {
        this.last = last;
        this.curr = curr;
        this.next = next;
        return this;
    }
}

export function infuseBody(snapshot, body) {
    body.setPosition(snapshot.position);
    body.setLinearVelocity(snapshot.linearVelocity);
    body.setAngle(snapshot.angle);
    body.setAngularVelocity(snapshot.angularVelocity);
}

export function snapshotBody(body, snapshot) {
    if (snapshot == null) {
        snapshot = new LinearMotionSnapshot();
    }
    snapshot.position.set(body.getPosition());
    snapshot.linearVelocity.set(body.getLinearVelocity());
    snapshot.angle = +body.getAngle();
    snapshot.angularVelocity = +body.getAngularVelocity();
    return snapshot;
}

export function copySnapshot(snapshot, out) {
    if (out == null) {
        out = new LinearMotionSnapshot();
    }
    out.position.set(snapshot.position);
    out.linearVelocity.set(snapshot.linearVelocity);
    out.angle = +snapshot.angle;
    out.angularVelocity = +snapshot.angularVelocity;
    return snapshot;
}
