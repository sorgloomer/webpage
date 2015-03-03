define('planning.helper', [
    'utils.utils', 'utils.Heap', 'math.vec'
], function(utils, Heap, vec) {
    var temp1 = new Array(4);

    function checkLine(sampler, start, end, step, knownDistance) {
        if (step === undefined) step = 1;
        temp1.length = vec.dims(start);

        if (knownDistance === undefined) knownDistance = vec.dist(start, end);

        var inters = true;
        var inc = step / knownDistance;
        for (var i = inc; i < 1; i += inc) {
            vec.lerpTo(temp1, start, end, i);
            if (sampler(temp1)) {
                inters = false;
                break;
            }
        }
        return !inters || sampler(end);
    }

    function randomDotInBox(nbox, dot, dims) {
        for (var i = 0; i < dims; i++) {
            dot[i] = Math.random() * nbox.width(i) + nbox.min[i];
        }
        return dot;
    }

    function identity(x) {
        return x;
    }

    function pathToRoot(parentMap, aNode, costFn, mapperFn) {
        var parentFn = parentMap;
        if (typeof parentMap !== 'function') {
            parentFn = function(item) {
                return parentMap.get(item)
            };
        }
        if (mapperFn === undefined) mapperFn = identity;
        var p = aNode;
        if (p) {
            var path = [];
            var totalLength = 0;
            for(;;) {
                path.unshift(mapperFn(p));
                var parent = parentFn(p);
                if (!parent) break;
                totalLength += costFn(p, parent);
                p = parent;
            }
            return {
                cost: totalLength,
                path: path
            };
        } else {
            return null;
        }
    }

    function fnOrMap(fnOrMap) {
        return typeof(fnOrMap) === 'function'
            ? fnOrMap
            : function mapGetter(key) { return fnOrMap.get(key); };
    }

    function dijkstra(startNode, endNode, neighboursFnOrMap, distFn) {
        var item;
        var queue = new Heap();
        var parentMap = new Map();
        neighboursFnOrMap = fnOrMap(neighboursFnOrMap);
        queue.push(0, [null, startNode]);

        while (item = queue.pop()) {
            var current = item.value[1];
            if (!parentMap.has(current)) {
                parentMap.set(current, item.value[0]);
                if (current === endNode) {
                    break;
                } else {
                    var total = item.key;
                    if (!item) break;

                    neighboursFnOrMap(current).forEach(function (neigh) {
                        var dist = distFn(current, neigh);
                        queue.push(total + dist, [current, neigh]);
                    });
                }
            }
        }
        return parentMap;
    }

    function iterate(self, fn, trialCount) {
        if (trialCount === undefined) trialCount = 20;
        for (var i = 0; i < trialCount && (!self.hasSolution || self.continueForever); i++) {
            fn();
        }
    }

    return {
        checkLine: checkLine,
        randomDotInBox: randomDotInBox,
        pathToRoot: pathToRoot,
        iterate: iterate,
        fnOrMap: fnOrMap,
        dijkstra: dijkstra
    };
});