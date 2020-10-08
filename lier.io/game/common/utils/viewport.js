import {Transform} from "./math.js";
import * as vec2 from "./vec2.js";


const { min } = Math;
export class Viewport {
    constructor({center, height, aspect, screenSize}) {
        screenSize = screenSize == null ? vec2.xy(1920, 1080) : vec2.copy(screenSize);
        if (aspect == null) {
            aspect = 1920 / 1080;
        }
        if (height == null) {
            height = 1;
        }
        center = vec2.copy(center);
        this.center = center;
        this.height = height;
        this.aspect = aspect;
        this.screenSize = screenSize;
        this.transform = new Transform();
        this.inverse = new Transform();
    }

    refreshTransform() {
        const out = this.transform;
        const viewportHeight = this.height;
        const viewportWidth = this.height * this.aspect;
        const zoomX = this.screenSize.x / viewportWidth;
        const zoomY = this.screenSize.y / viewportHeight;
        const scale = min(zoomX, zoomY);
        out.setIdentity();
        out.translate(this.screenSize.x / 2, this.screenSize.y / 2);
        out.scaleXY(scale, -scale)
        out.translate(-this.center.x, -this.center.y);
        this.inverse.setInverse(out);
        return out;
    }
}
