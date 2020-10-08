import {lerp} from "../utils/math.js";
import {MAX_NETWORK_INTERPOLATION_SPAN_REAL_SECONDS} from "./simconf.js";
import {LinearMotionSnapshot} from "../interpolation.js";

const { max, min } = Math;

export function extract(engine, body) {
    var p = body.getPosition(), v = body.getLinearVelocity(), a = body.getAngle(), av = body.getAngularVelocity();
    return {
        name: engine.idOf(body),
        px: p.x,
        py: p.y,
        vx: v.x,
        vy: v.y,
        a: a,
        av: av,
    };
}

export function infuse(engine, msg, realTimestamp, gameTimestamp, afterFrameGameTimespan, interpolator) {
    infuseBody(
        engine.fromId(msg.name),
        msg,
        realTimestamp,
        gameTimestamp,
        afterFrameGameTimespan,
        interpolator,
    );
}

function infuseBody(body, msg, realTimestamp, gameTimestamp, afterFrameGameTimespan, interpolator) {
    interpolator.updateSnapshot(body, realTimestamp);
    const bodyIdentity = body.getUserData().identity;
    const p = body.getPosition();
    const v = body.getLinearVelocity();
    p.x = +msg.px;
    p.y = +msg.py;
    v.x = +msg.vx;
    v.y = +msg.vy;
    const a = +msg.a;
    const av = +msg.av;
    body.setPosition(p);
    body.setLinearVelocity(v);
    body.setAngle(a);
    body.setAngularVelocity(av);
    const empiricIntervalSample = realTimestamp - bodyIdentity.networkRefreshTimestamp;
    bodyIdentity.networkInterpolationRatio = interpolator.obsoleteInterpolationRatio;
    bodyIdentity.networkRefreshTimestamp = realTimestamp;

    bodyIdentity.networkRefreshInterval = _nextNetworkRefreshInterval(bodyIdentity.networkRefreshInterval, empiricIntervalSample);
    bodyIdentity.networkInterpolationSpan = clampBetween(bodyIdentity.networkRefreshInterval * 0.8, 0.001, MAX_NETWORK_INTERPOLATION_SPAN_REAL_SECONDS);
}

function _nextNetworkRefreshInterval(oldValue, empiricSample) {
    return empiricSample < oldValue ? empiricSample : lerp(0.2, oldValue, empiricSample);
}

function clampBetween(x, xmin, xmax) {
    return +min(xmax, max(xmin, x));
}

function infuseSnapshotToBody(snapshot, body) {
    body.setPosition(snapshot.position);
    body.setLinearVelocity(snapshot.linearVelocity);
    body.setAngle(snapshot.angle);
    body.setAngularVelocity(snapshot.angularVelocity);
}
