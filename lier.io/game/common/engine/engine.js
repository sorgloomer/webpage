import {planck as pl} from "../../../lib/planck.js";
import {Player} from "./player.js";
import * as planckutils from "./planckutils.js";
import {linkedForEach, linkedForEach2, moveForceFraction} from "../utils/utils.js";
import {GAME_SECONDS_PER_SIMULATION_STEP, SIMULATION_STEPS_PER_FRAME} from "./simconf.js";
import * as vec2 from "../utils/vec2.js";
import {LinearMotionSnapshot} from "../interpolation.js";
import {rectangle} from "./planckutils.js";


const { Vec2 } = pl;

const GRAVITY = 40;

const JUMP_SPEED = 30;
const JUMP_TIME = 0.10;
const JUMP_ACCELERATION = JUMP_SPEED / JUMP_TIME * 2; // *2 so that we are sure we can reach terminal velocity.
// Jumping is limited both in time and velocity, and I think velocity limit is more important. By having double the
// necessary JUMP_ACCELERATION we can be sure that we reach JUMP_SPEED in the given time.

const GROUND_DECELERATION_RATIO = 10;
const MOVE_ACCELERATION = 40; // ? unused since player has wheel
const MOVE_ACCELERATION_AIR = 25;
const MOVE_SPEED = 5;
const PROJECTILE_SPEED = 60;

const WALL_FIXDEF = {
    friction: 0.8,
    restitution: 0,
};

const BOX_COUNT = 30;
const BALL_COUNT = 2;


class SimulatedObjectIdentity {
    constructor(id) {
        this.id = id;
        this.newestBody = null;
        this.obsoleteBody = null;
        this.networkRefreshTimestamp = 0;
        this.networkRefreshInterval = 1;
        this.networkInterpolationSpan = 1;
        this.networkInterpolationRatio = 0;
        this.lastSentPosition = vec2.zero();
        this.priorityAccumulator = 1;
        this.networkSnapshot = null;
    }
}

class UserData {
    constructor(id) {
        this.lastFrameDrawingSnapshot = null;
        this.currentDrawingSnapshot = new LinearMotionSnapshot();
        this.identity = new SimulatedObjectIdentity(id);
    }
}

const BOX_FIXDEF = {
    friction: 1.5,
    restitution: 0.5,
};


export class Engine {

    constructor() {
        this.boxes = [];
        this.players = [];
        this._ballCounter = 0;

        this.world = pl.World({
            gravity: Vec2(0, -GRAVITY),
        });
        this._bodies = new Map();
        this._wallCounter = 0;
        this._dynamicCounter = 0;
        this._worldManifold = new WorldManifold();


        for (let i = 1; i < 15; i++) {
            this._createWall(1.5, 0.5, -26 + i * 2, -20 + i * 3, (i % 5 - 2) * 2);

            this._createWall(1.5, 0.5, 26 - i * 2, -20 + i * 3, (i % 5 - 2) * 2);
        }

        this._createWall(32, 1.5, -15, 20, 1);
        this._createWall(32, 1.5, 15, 20, -2);

        this._createWall(32, 1.5, -15, -20, 0);
        this._createWall(32, 1.5, 15, -20, 1);

        this._createWall(1.5, 32, -26, 15, 1);
        this._createWall(1.5, 32, -26, -15, -1);

        this._createWall(1.5, 32, 26, 15, 0);
        this._createWall(1.5, 32, 26, -15, 1);

        this._createBoxes(BOX_COUNT);
        this._createBall(1.5);
        this._createBall(0.6);

        this.players.push(new Player(this, 0));
        this.players.push(new Player(this, 1));

        var balance1Pin = this._createBody({
            id: "balance1Pin",
            position: Vec2(8, -15.5),
        });
        this.balance1 = this._createBody({
            id: "balance1",
            type: 'dynamic',
            position: Vec2(balance1Pin.getPosition()).add(Vec2(0, 0.5)),
            linearDamping: 1.1,
        });
        this.balance1.setMassData({
            I: 7,
            center: Vec2(0, 0),
            mass: 0,
        });
        this.balance1.createFixture(planckutils.rectangle(4, 0.2), WALL_FIXDEF);

        this.world.createJoint(pl.RevoluteJoint({}, balance1Pin, this.balance1, balance1Pin.getPosition()));

        var balance2Pin = this._createBody({
            id: "balance2Pin",
            position: Vec2(-12, -19),
        });
        this.balance2 = this._createBody({
            id: "balance2",
            type: 'dynamic',
            position: balance2Pin.getPosition(),
            linearDamping: 1.1,
        });
        this.balance2.setMassData({
            I: 5,
            center: Vec2(0, 0),
            mass: 0,
        });
        this.balance2.createFixture(pl.Polygon([
            Vec2(0, 0),
            Vec2(5, 1),
            Vec2(-5, 1),
        ]), WALL_FIXDEF);

        this.world.createJoint(pl.RevoluteJoint({}, balance2Pin, this.balance2, balance2Pin.getPosition()));

        for (let i = 0; i < 8; i++) {
            this._createSling(-12 + 6 * i, 0, 5, 1.3, 0.3);
        }


        this._v0 = Vec2(0, 0);
        this._jumpTimer = 0;
        this._rayCastHit = new RayCastHit();
    }

    _createSling(px, py, rodsize, seatsize, thickness) {
        const ctr = ++this._dynamicCounter;
        const body = this._createBody({
            id: "sling" + ctr,
            type: "dynamic",
            position: Vec2(px, py - rodsize - seatsize),
            linearDamping: 0.1,
            angularDamping: 0.4,
        });
        body.setMassData({
            I: 3,
            center: Vec2(0, 0),
            mass: 1,
        });
        body.createFixture(rectangle(seatsize, thickness), WALL_FIXDEF);
        const pin = this._createBody({
            id: "slingpin" + ctr,
            type: "static",
            position: Vec2(px, py),
        });
        this.world.createJoint(pl.DistanceJoint({}, pin, body, pin.getPosition(), Vec2(px, py - rodsize)));
        return body;
    }

    _createBall(r) {
        var i = this._ballCounter++;
        var name = "ball" + i;
        var body = this._createBody({
            id: name,
            type: 'dynamic',
            position: Vec2(-6 + (i % 5) * 1, 3.1 + (i / 5) * 1),
            linearDamping: 1.1,
        });
        body.setMassData({
            I: r ** 4 * 0.5,
            center: Vec2(0, 0),
            mass: 0.2 * r * r,
        });
        body.createFixture(pl.Circle(Vec2(0, 0), r), BOX_FIXDEF);
    }
    _createBoxes(n) {
        for (var i = 0; i < n; i++) {
            var name = "box" + i;
            var body = this._createBody({
                id: name,
                type: 'dynamic',
                position: Vec2(-1 + (i % 10) * 0.5, -5 + (i / 10) * 0.5),
                linearDamping: 1.1,
            });
            this.boxes.push(body);
            body.setMassData({
                I: 0.05,
                center: Vec2(0, 0),
                mass: 0.4,
            });
            body.createFixture(planckutils.rectangle(0.4, 0.4), BOX_FIXDEF);
        }
    }

    idOf(body) {
        return body.getUserData().identity.id;
    }

    fromId(id) {
        return this._bodies.get(id);
    }

    _createBody(bodydef) {
        const id = bodydef.id;
        delete bodydef.id;
        bodydef.userData = new UserData(id);
        var body = this.world.createBody(bodydef);
        this._bodies.set(id, body);
        return body;
    }

    _createWall(w, h, px, py, a) {
        var name = "wall" + (this._wallCounter++);
        var wall = this._createBody({
            id: name,
            type: 'static',
            position: Vec2(px, py),
            angle: a * Math.PI / 180,
        });
        wall.createFixture(planckutils.rectangle(w, h), WALL_FIXDEF);
        return wall;
    }

    step(inputs) {
        this.world.step(0); // this force updates contacts, needed by footOnGround detection after network updates
        this._updateDrawingSnapshots();
        for (let i = 0; i < SIMULATION_STEPS_PER_FRAME; i++) {
            this._controlPlayers(inputs);
            this.world.step(GAME_SECONDS_PER_SIMULATION_STEP);
        }
    }

    _controlPlayers(inputList) {
        this.players.forEach(player => {
            this._controlPlayer(player, inputList[player.index]);
        });
    }
    _updateDrawingSnapshots() {
        linkedForEach(this.world.getBodyList(), body => {
            const ud = body.getUserData();
            ud.lastFrameDrawingSnapshot = createBodySnapshot(body, ud.lastFrameDrawingSnapshot);
        });
    }

    _controlPlayer(player, inputs) {
        const v = player.foot.getLinearVelocity();
        const m = player.foot.getMass();
        var movedirx = 0;
        var accelerationx = 0;
        var accelerationy = 0;
        const footOnGround = this._footOnGround(player);
        if (inputs.moveLeft) {
            movedirx -= 1;
        }
        if (inputs.moveRight) {
            movedirx += 1;
        }
        if (inputs.jump && footOnGround) {
            this._jumpTimer = JUMP_TIME;
        }
        if (this._jumpTimer > 0) {
            if (inputs.jump) {
                accelerationy = JUMP_ACCELERATION;
            }
            this._jumpTimer -= GAME_SECONDS_PER_SIMULATION_STEP;
        }

        const footspeed = inputs.squat ? 0 : movedirx * -MOVE_SPEED / player.footRadius;

        player.foot.setAngularVelocity(footspeed);


        if (inputs.fire) {
            let projectile = this.boxes[player.index];
            let playerP = player.foot.getPosition();
            let projectileP = projectile.getPosition();
            let projectileV = projectile.getLinearVelocity();
            projectileV.x = inputs.aimx;
            projectileV.y = inputs.aimy;
            projectileV.sub(playerP);
            projectileV.normalize();
            projectileP.set(playerP);
            projectileP.addMul(1, projectileV);
            projectileV.mul(PROJECTILE_SPEED);
            projectile.setLinearVelocity(projectileV);
            projectile.setPosition(projectileP);
        }

        if (movedirx !== 0 && (!footOnGround || inputs.squat)) {
            accelerationx = movedirx * MOVE_ACCELERATION_AIR;
        }

        if (false) {
            if (movedirx !== 0) {
                if (footOnGround) {
                    accelerationx = moveForceFraction(v.x, movedirx * MOVE_SPEED) * MOVE_ACCELERATION;
                } else {
                    accelerationx = movedirx * MOVE_ACCELERATION_AIR;
                }
            } else if (footOnGround) {
                accelerationx = -GROUND_DECELERATION_RATIO * v.x;
            }
        }

        const force = this._v0;
        force.x = accelerationx * m;
        force.y = accelerationy * m;
        player.foot.applyForceToCenter(force, true);

        if (inputs.hook) {
            if (inputs.fire) {
                player.hook.detach();
                player.hook.releasing = true;
            }
            if (!player.hook.releasing) {
                const bp = vec2.copy(player.body.getPosition());
                const aimTarget = vec2.xy(inputs.aimx, inputs.aimy);
                const aimDir = vec2.norm(vec2.sub(aimTarget, bp));
                const rayEnd = vec2.add(bp, vec2.mul(aimDir, 10000));

                const hit = this._rayCast(bp, rayEnd, player);
                if (hit != null) {
                    player.hook.attach(hit.body, hit.point);
                }
            }
        } else {
            if (player.hook.releasing) {
                player.hook.releasing = false;
            }
        }
        player.hook.applyForces(player);
    }

    _rayCast(ray0, ray1, player) {
        const result = this._rayCastHit;
        let found = false;
        this.world.rayCast(ray0, ray1, (fixture, point, normal, fraction) => {

            const body = fixture.getBody();
            if (body === player.foot || body === player.body) {
                return fraction;
            }
            found = true;
            result.fixture = fixture;
            result.point.set(point);
            result.normal.set(normal);
            return fraction;
        });
        if (!found) {
            return null;
        }
        result.body = result.fixture.getBody();
        return result;
    }

    _footOnGround(player) {
        let result = false;
        forEachContactEdgeOfBody(player.foot, edge => {
            const manifold = edge.contact.getWorldManifold(this._worldManifold);
            if (manifold != null && manifold.normal.y > 0.5) {
                return result = true;
            }
        });
        return result;
    }

}

function createBodySnapshot(body, snapshot) {
    if (snapshot == null) {
        snapshot = new LinearMotionSnapshot();
    }
    snapshot.angle = body.getAngle();
    snapshot.angularVelocity = body.getAngularVelocity();
    snapshot.position.set(body.getPosition());
    snapshot.linearVelocity.set(body.getLinearVelocity());
    return snapshot;
}

export function WorldManifold() {
    this.normal = Vec2();
    this.points = []; // [maxManifoldPoints]
    this.separations = []; // float[maxManifoldPoints]
}

export function forEachFixtureOfBody(body, fn) {
    linkedForEach(body.getFixtureList(), fn);
}
export function forEachContactEdgeOfBody(body, fn) {
    linkedForEach2(body.getContactList(), fn);
}

export function forEachBodyOfEngine(engine, fn) {
    linkedForEach(engine.world.getBodyList(), fn);
}
export function forEachJointOfEngine(engine, fn) {
    linkedForEach(engine.world.getJointList(), fn);
}


class RayCastHit {
    constructor() {
        this.body = null;
        this.fixture = null;
        this.point = vec2.zero();
        this.normal = vec2.zero();
    }
}
