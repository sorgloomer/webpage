define('planning.Prm', [
    'utils.utils',
    'math.vec', 'math.NBoxTree', 'math.NBox',
    'planning.helper',
    'utils.UnionFind', 'utils.MultiMap'
], function(
    utils,
    vec, NBoxTree, NBox,
    helper,
    UnionFind, MultiMap
) {

    function Prm(map) {
        var self = this;

        var dims = map.nbox.dims();
        var boxTree = new NBoxTree(map.nbox);
        var resolution = map.resolution;
        // Use hypersphere 4 times the volume of the resolution sphere
        var connectResolution = resolution * Math.pow(4, 1.0 / dims);

        var connectedSets = new UnionFind();
        var neighboursMap = new MultiMap();
        var edges = [];
        var samples = [];

        var startNode = vec.copy(map.target);
        var endNode = vec.copy(map.start);

        putDot(startNode);
        putDot(endNode);

        function makeNeighbours(a, b) {
            neighboursMap.put(a, b);
            neighboursMap.put(b, a);
            connectedSets.union(a, b);
            edges.push([{pos:a}, {pos:b}]);
            if (connectedSets.same(startNode, endNode)) {
                self.hasSolution = true;
            }
        }

        function putDot(dot) {
            boxTree.putDot(dot);
            samples.push({pos:dot});

            boxTree.enumerateInRange(dot, connectResolution, function(dotInTree, knownDistance2) {
                var dist = Math.sqrt(knownDistance2);
                var hitsWall = helper.checkLine(map.sampler, dot, dotInTree, 1, dist);
                if (!hitsWall) {
                    makeNeighbours(dot, dotInTree);
                }
            });
        }


        function putRandomDot() {
            var newDot = vec.alloc(dims);
            helper.randomDotInBox(map.nbox, newDot, dims);
            self.samplesGenerated++;
            var nearest = boxTree.nearest(newDot);
            var goodSample = false;
            if (nearest) {
                var knownDistance = vec.dist(nearest, newDot);
                if (knownDistance > resolution) {
                    if (!map.sampler(newDot)) {
                        goodSample = true;
                        putDot(newDot, nearest);
                    }
                }
            }
            if (!goodSample && self.wrongSampleCallback) {
                self.wrongSampleCallback(newDot);
            }
        }

        function iterate(trialCount) {
            helper.iterate(self, putRandomDot, trialCount);
        }

        function getSolution() {
            var parentMap = helper.dijkstra(startNode, endNode, neighboursMap, vec.dist);
            return helper.pathToRoot(parentMap, endNode, vec.dist);
        }

        this.samplesGenerated = 0;
        this.hasSolution = false;
        this.continueForever = false;
        this.wrongSampleCallback = null;
        this.edges = edges;
        this.samples = samples;
        this.iterate = iterate;
        this.getSolution = getSolution;
    }
    return Prm;
});
