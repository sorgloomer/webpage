import {Transform} from "../common/utils/math.js";
import {BodyInterpolator, copySnapshot, InterpolationMode} from "../common/interpolation.js";
import {Viewport} from "../common/utils/viewport.js";
import {planck as pl} from '../../lib/planck.js';
import * as vec2 from "../common/utils/vec2.js";
import {
    forEachBodyOfEngine,
    forEachContactEdgeOfBody,
    forEachFixtureOfBody,
    forEachJointOfEngine,
    WorldManifold
} from "../common/engine/engine.js";
import {ROPE_MIN_LENGTH} from "../common/engine/player.js";
import {Caternary2} from "./caternary.js";

const {min, max, abs, cosh, sinh, sign} = Math;
const { Vec2 } = pl;

export class Display {
    constructor({
        engine,
        canvas,
        debugView=false,
        interpolationMode=InterpolationMode.nearest,
        playerNumber=0,
    }) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext("2d");
        this.engine = engine;
        this._playerNumber = playerNumber;
        this._transformTemp = new Transform();
        this.color = "#000000";
        this.debug = {
            manifolds: true,
            frameInterpolation: debugView,
            networkInterpolation: debugView,
        };
        this._interpolator = new BodyInterpolator({mode: interpolationMode, blendNetwork: true});

        this._viewport = new Viewport({ height: 20 });
        this._worldManifold = new WorldManifold();
        this._vs = [vec2.zero()];
        this._caternary = new Caternary2(ROPE_MIN_LENGTH);

    }

    screenToWorld(screen, out) {
        return this._viewport.inverse.transform(screen, out);
    }

    clear() {
        const ctx = this._ctx;
        const canvasW = this._canvas.width;
        const canvasH = this._canvas.height;
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvasW, canvasH);
    }
    draw(gameTimeSinceLastFrame, gameTimestamp, realTimestamp) {
        this._refreshViewTransform();
        forEachBodyOfEngine(this.engine, body => {
            this._calculateDrawPosition(body, gameTimeSinceLastFrame, gameTimestamp, realTimestamp);
        });

        forEachJointOfEngine(this.engine, joint => {
            this._drawJoint(joint, gameTimeSinceLastFrame, gameTimestamp, realTimestamp);
        });

        forEachBodyOfEngine(this.engine, body => {
            this._drawBody(body, gameTimeSinceLastFrame, gameTimestamp, realTimestamp);
        });

        this.engine.players.forEach(player => {
            this._drawHook(player);
        });
    }

    _refreshViewTransform() {
        const canvasW = this._canvas.width;
        const canvasH = this._canvas.height;
        const viewport = this._viewport;
        const thisPlayer = this.engine.players[this._playerNumber];
        viewport.center.set(thisPlayer.body.getPosition());
        viewport.screenSize.setXY(canvasW, canvasH);
        viewport.refreshTransform();
    }

    _calculateDrawPosition(body, gameTimeSinceLastSimulatedFrame, gameTimestamp, realTimestamp) {
        const iplt = this._interpolator;
        const drawable = iplt.interpolate(body, gameTimeSinceLastSimulatedFrame, gameTimestamp, realTimestamp);
        copySnapshot(drawable, body.getUserData().currentDrawingSnapshot);
    }
    _setSnapshotViewTransform(snapshot) {
        setContextTransform(this._ctx, this._getSnapshotViewTransform(snapshot, this._transformTemp));
    }

    _getSnapshotViewTransform(snapshot, out) {
        if (out == null) {
            out = this._transformTemp;
        }
        return out.set(this._viewport.transform)
        .translate(snapshot.position.x, snapshot.position.y)
        .rotate(snapshot.angle);
    }
    _getSnapshotTransform(snapshot, out) {
        if (out == null) {
            out = this._transformTemp;
        }
        return out.setIdentity()
            .translate(snapshot.position.x, snapshot.position.y)
            .rotate(snapshot.angle);
    }

    _drawBody(body, gameTimeSinceLastSimulatedFrame, gameTimestamp, realTimestamp) {
        const iplt = this._interpolator;
        const drawable = iplt.interpolate(body, gameTimeSinceLastSimulatedFrame, gameTimestamp, realTimestamp); // TODO: currently it is calculated here again so we can print debug info

        const ctx = this._ctx;

        if (this.debug.networkInterpolation) {
            this._drawBodyDirect(body, iplt.obsolete.curr, "#ff4444");
            const identity = body.getUserData().identity;
            ctx.font = '12px monospace';
            setContextTransform(this._ctx, this._transformTemp
                .set(this._viewport.transform)
                .translate(drawable.position.x, drawable.position.y)
                .scaleXY(0.02, -0.02)
            );
            ctx.fillText(`nx: ${Number(iplt.obsoleteInterpolationRatio).toFixed(2)}`, 5, 0);
            ctx.fillText(`lt: ${Number(iplt.lastObsoleteTimestamp).toFixed(2)}`, 5, 12);
            ctx.fillText(`nir: ${Number(identity.networkInterpolationRatio).toFixed(2)}`, 5, 24);
        }
        if (this.debug.frameInterpolation) {
            this._drawBodyDirect(body, iplt.simulated.last, "#8888ff");
            this._drawBodyDirect(body, iplt.simulated.curr, "#4444ff");
            this._drawBodyDirect(body, iplt.simulated.next, "#0000ff");
        }
        if (this.debug.frameInterpolation && this.debug.networkInterpolation) {
            this._drawBodyDirect(body, iplt.obsolete.last, "#ff8888");
            this._drawBodyDirect(body, iplt.obsolete.next, "#ff0000");
        }
        const storedDrawable = body.getUserData().currentDrawingSnapshot;
        this._drawBodyDirect(body, storedDrawable, this.color);
        if (this.debug.manifolds) {
            this._drawManifoldsForBody(body);
        }
    }

    _drawManifoldsForBody(body) {
        const ctx = this._ctx;
        setContextTransform(ctx, this._viewport.transform);
        forEachContactEdgeOfBody(body, contactEdge => {
            const manifold = contactEdge.contact.getWorldManifold(this._worldManifold);

            if (manifold) {
                const n = manifold.normal;
                for (let p of manifold.points) {
                    ctx.strokeStyle = "#ff0000";
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + 0.2 * n.x, p.y + 0.2 * n.y);
                    ctx.stroke();
                }
            }
        });
    }

    _drawBodyDirect(body, snapshot, color) {
        this._setSnapshotViewTransform(snapshot);
        const ctx = this._ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.02;

        let fixtureCount = 0;
        forEachFixtureOfBody(body, fixture => {
            this._drawFixture(fixture);
            fixtureCount++;
        });
        if (fixtureCount === 0) {
            this._drawFixtureless(body);
        }
    }

    _drawFixture(fixture) {
        const shape = fixture.getShape();
        const type = fixture.getType();
        switch (type) {
            case 'polygon':
                this._drawPloygon(shape);
                return;
            case 'circle':
                this._drawCircle(shape);
                return;
        }
    }

    _drawPloygon(shape) {
        const ctx = this._ctx;
        var verts = shape.m_vertices, v;
        ctx.beginPath();
        v = verts[0];
        ctx.moveTo(v.x, v.y);
        for (let i = 1; i < verts.length; i++) {
            v = verts[i];
            ctx.lineTo(v.x, v.y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    _drawCircle(shape) {
        const ctx = this._ctx;
        const radius = shape.getRadius();
        const p = shape.getCenter();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, radius, 0, 2*Math.PI);
        ctx.stroke();
    }
    _drawFixtureless() {
        const ctx = this._ctx;
        const radius = 0.1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, 2*Math.PI);
        ctx.stroke();
    }
    infos(lines) {
        this._ctx.resetTransform();
        lines.forEach((line, i) => {
            this._ctx.font = '12px monospace';
            this._ctx.fillText(line, 10, 50 + i * 14);
        });
    }

    _drawJoint(joint) {
        const ctx = this._ctx;
        setContextTransform(ctx, this._viewport.transform);
        switch (joint.getType()) {
            case "distance-joint":
                ctx.strokeStyle = "#008800";
                ctx.beginPath();
                ctx.moveTo(joint.getAnchorA().x, joint.getAnchorA().y);
                ctx.lineTo(joint.getAnchorB().x, joint.getAnchorB().y);
                ctx.stroke();
                break;
        }

    }

    _drawHook(player) {
        const hook = player.hook;
        const ctx = this._ctx;
        if (!hook.hooked) {
            return;
        }

        setContextTransform(ctx, this._viewport.transform);

        const snap = hook.body.getUserData().currentDrawingSnapshot;
        const a = player.body.getPosition();
        const bt = this._getSnapshotTransform(snap);
        const b = bt.transform(hook.localAnchor, this._vs[0]);

        ctx.strokeStyle = "#009888";
        if (vec2.dist(a, b) < ROPE_MIN_LENGTH && false) {
            this._caternary.solve(ROPE_MIN_LENGTH, a.x, a.y, b.x, b.y, false);
            ctx.strokeStyle = "#009888";
            ctx.beginPath();

            const ps = this._caternary.ps;
            ctx.moveTo(ps[0].x, ps[0].y);
            for (let i = 1; i < ps.length; i++) {
                ctx.lineTo(ps[i].x, ps[i].y);
            }
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        setContextTransform(ctx, this._viewport.transform.multiply(bt, bt));
        this._drawHookCross(ctx, hook);
    }

    _drawHookCross(ctx, hook) {
        ctx.beginPath();
        ctx.moveTo(hook.localAnchor.x + 0.1, hook.localAnchor.y + 0.1);
        ctx.lineTo(hook.localAnchor.x - 0.1, hook.localAnchor.y - 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(hook.localAnchor.x - 0.1, hook.localAnchor.y + 0.1);
        ctx.lineTo(hook.localAnchor.x + 0.1, hook.localAnchor.y - 0.1);
        ctx.stroke();
    }
}


function setContextTransform(context, transform) {
    context.setTransform(...transform.m);
}
