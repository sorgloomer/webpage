/**
 * Created by Hege on 2014.09.28..
 */

define('math.NBox', ['math.vec'], function(vec) {
    function NBox(min, max) {
        this.min = min;
        this.max = max;
    }
    var Proto = NBox.prototype;
    Proto.contains = function(dot) {
        var min = this.min, max = this.max;
        for (var i = 0, mi = min.length; i < mi; i++) {
            var x = dot[i];
            if (x < min[i] || x > max[i]) return false;
        }
        return true;
    };
    Proto.width = function(dim) {
        return this.max[dim] - this.min[dim];
    };
    Proto.split = function(dim) {
        var min = this.min, max = this.max;
        var minmid = vec.copy(min);
        var maxmid = vec.copy(max);
        var mid = (min[dim] + max[dim]) * 0.5;
        minmid[dim] = maxmid[dim] = mid;
        return [
            new NBox(min, maxmid),
            new NBox(minmid, max)
        ];
    };
    Proto.size = function() {
        return vec.sub(this.max, this.min);
    };
    Proto.sizeTo = function(to) {
        return vec.subTo(to, this.max, this.min);
    };
    Proto.dist2 = function(p) {
        var q = vec.copy(p), min = this.min, max = this.max;
        for (var i = 0, mi = p.length; i < mi; i++) {
            if (q[i] < min[i]) {
                q[i] = min[i];
            } else if (q[i] > max[i]) {
                q[i] = max[i];
            }
        }
        return vec.dist2(p, q);
    };
    Proto.dist = function(p) {
        return Math.sqrt(this.dist2(p));
    };
    Proto.dims = function() {
        return this.min.length;
    };
    return NBox;
});



