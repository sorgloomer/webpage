define('planning.RrtVoronoi', [
    'utils.utils',
    'math.vec', 'math.NBoxTree', 'math.NBox',
    'planning.helper'
], function(
    utils,
    vec, NBoxTree, NBox,
    helper
) {

    function RrtVoronoi(map) {
        var self = this;

        var dims = map.nbox.dims();
        var boxTree = new NBoxTree(map.nbox);
        var resolution = map.resolution;
        var resolution2 = resolution * resolution;
        var greediness = 0.25;

        var tempDot = vec.alloc(dims);

        var solutionNode = null;
        var parentMap = new Map();
        var edges = [];
        var samples = [];

        putDot(map.start, null);


        function putDot(dot, parent) {
            boxTree.putDot(dot);
            var len2 = vec.dist2(map.target, dot);
            if (len2 < resolution2) {
                solutionNode = dot;
                self.hasSolution = true;
            }
            if (parent) {
                parentMap.set(dot, parent);
                edges.push([{pos: parent},{pos: dot}]);
                samples.push({ pos: dot, parent: parent });
            }
        }

        function stepInDirectionTo(outp, from, to, maxDistance, knownDistance) {
            if (knownDistance === undefined) knownDistance = vec.dist(from, to);
            vec.lerpTo(outp, from, to, maxDistance / knownDistance);
        }

        function stepLimitedInDirectionTo(outp, from, to, maxDistance, knownDistance) {
            if (knownDistance === undefined) knownDistance = vec.dist(from, to);
            if (knownDistance > maxDistance) {
                vec.lerpTo(outp, from, to, maxDistance / knownDistance);
            } else if (outp !== to) vec.copyTo(outp, to);
        }

        function putRandomDot() {
            if (Math.random() < greediness) {
                vec.copyTo(tempDot, map.target);
            } else {
                helper.randomDotInBox(map.nbox, tempDot, dims);
                self.samplesGenerated++;
            }
            var nearest = boxTree.nearest(tempDot);
            var knownDistance = vec.dist(nearest, tempDot);
            var goodSample = false;

            if (knownDistance > resolution) {
                stepInDirectionTo(tempDot, nearest, tempDot, resolution, knownDistance);

                var hitsWall = helper.checkLine(map.sampler, nearest, tempDot, 1, resolution);
                if (!hitsWall) {
                    goodSample = true;
                    putDot(vec.copy(tempDot), nearest);
                }
            }

            if (!goodSample && self.wrongSampleCallback) {
                self.wrongSampleCallback(vec.copy(tempDot));
            }
        }

        function iterate(trialCount) {
            helper.iterate(self, putRandomDot, trialCount);
        }

        function getSolution() {
            return helper.pathToRoot(parentMap, solutionNode, vec.dist);
        }

        this.samplesGenerated = 0;
        this.continueForever = false;
        this.edges = edges;
        this.samples = samples;
        this.wrongSampleCallback = null;
        this.iterate = iterate;
        this.hasSolution = false;
        this.getSolution = getSolution;
    }


    return RrtVoronoi;
});