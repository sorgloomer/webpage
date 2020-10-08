import {planck as pl} from "../../../lib/planck.js";
const { Vec2 } = pl;
export function rectangle(w, h) {
    return pl.Polygon([
        Vec2(-w/2, -h/2),
        Vec2(-w/2, h/2),
        Vec2(w/2, h/2),
        Vec2(w/2, -h/2),
    ]);
}
