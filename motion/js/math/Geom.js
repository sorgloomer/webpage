/**
 * Created by Hege on 2014.09.27..
 */

define('math.Geom', [], function() {
    function dist2(x0, y0, x1, y1) {
        var dx = x1 - x0, dy = y1 - y0;
        return dx * dx + dy * dy;
    }
    function intersects(circle, rect) {
        var r = circle.rad;
        var dx, dy, r2 = r * r, x2, y2;

        dx = Math.max(rect.x0 - circle.x, circle.x - rect.x1);
        dy = Math.max(rect.y0 - circle.y, circle.y - rect.y1);

        x2 = Math.max(dx, 0);
        y2 = Math.max(dy, 0);
        if (x2 * x2 + y2 * y2 < r2) {
            x2 = dx + rect.x1 - rect.x0;
            y2 = dy + rect.y1 - rect.y0;
            return x2 * x2 + y2 * y2 > r2;
        } else {
            return false;
        }
    }
    function Circle(rad, x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.rad = rad || 50;
    }
    Circle.prototype.contains = function(dot) {
        return dist2(this.x, this.y, dot[0], dot[1]) <= this.rad * this.rad;
    };
    function Rect(x0, y0, x1, y1) {
        this.x0 = x0 || 0;
        this.x1 = x1 || 0;
        this.y0 = y0 || 0;
        this.y1 = y1 || 0;
    }
    Rect.prototype.contains = function(dot) {
        var dx = dot[0], dy = dot[1];
        return dx >= this.x0 && dx <= this.x1 && dy >= this.y0 && dy <= this.y1;
    };

    Rect.prototype.width = function() {
        return this.x1 - this.x0;
    };

    Rect.prototype.height = function() {
        return this.y1 - this.y0;
    };
    return {
        Rect: Rect,
        Circle: Circle,
        intersects: intersects
    }
});
