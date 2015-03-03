define('App', [
    'utils.imgConvert', 'utils.imgLoad', 'utils.utils', 'utils.Interval', 'utils.StringMap',
    'app.drawing',
    'planning.maps', 'planning.RrtInc', 'planning.RrtVoronoi', 'planning.Prm',
    'math.NBox'
], function(
    imgConvert, imgLoad, utils, Interval, StringMap,
    drawing,
    maps, RrtInc, RrtVoronoi, Prm,
    NBox
) {
    var CYCLE_SPEED = 10;
    var algorithms = {
        'rrt-inc': RrtInc,
        'rrt-voronoi': RrtVoronoi,
        'prm': Prm
    };

    function App(imageUrl) {
        var SelectedAlgorithm = Prm;

        if (imageUrl === undefined) imageUrl = 'img/map1.png';

        var screencanvas = document.getElementById("maincanvas");
        screencanvas.width = 640;
        screencanvas.height = 480;
        var screenctx = imgConvert.canvasToContext(screencanvas);
        screenctx.lineWidth = 1;


        var target = [620, 20];
        var start = [20, 460];

        var mazeCtx = null;

        var drawingMouse = null;
        var solver = null;
        var reddots = [];
        var samplesTook = 0;
        var solution = null;

        function putRedDot(dot) {
            reddots.push(dot);
        }

        function reset() {
            solution = null;
            reddots.length = 0;
            samplesTook = 0;

            var mazeMapFn = maps.fromCanvas(mazeCanvas, mazeCtx).fn;
            function sampler(dot) {
                samplesTook++;
                return mazeMapFn(dot[0], dot[1]);
            }
            solver = new SelectedAlgorithm({
                sampler: sampler,
                start: start,
                target: target,
                resolution: 10,
                nbox: new NBox([0, 0], [640, 480])
            });
            solver.wrongSampleCallback = putRedDot;
        }

        var mazeCanvas = null;

        function loadMapFromUrl(url, cb) {
            mazeCanvas = imgLoad.asCanvas(url, function (pCanvas, pCtx) {
                screencanvas.width = screenctx.width = pCanvas.width;
                screencanvas.height = screenctx.height = pCanvas.height;
                mazeCtx = pCtx;
                drawingMouse = drawing.attach(mazeCtx);
                if (cb) cb();
            });
        }

        loadMapFromUrl(imageUrl);


        function update(time) {
            if (!solution) {
                reddots.length = 0;
                for (var i = 0; i < CYCLE_SPEED; i++) {
                    solver.iterate();
                }
                if (solver.hasSolution) {
                    solution = solver.getSolution();
                    document.getElementById('solutionCost').textContent = '' + solution.cost.toFixed(2);
                    endCycle();
                }
            }
        }


        function clear() {
            screenctx.clearRect(0, 0, screencanvas.width, screencanvas.height);
        }

        function draw(time) {
            clear();
            screenctx.drawImage(mazeCanvas, 0, 0);
            // drawTree(quad.root);
            screenctx.fillStyle = "blue";

            if (solver) {
                screenctx.lineWidth = 1;
                screenctx.strokeStyle = "black";

                solver.samples.forEach(function (item) {
                    drawDot(item.pos);
                });
                screenctx.beginPath();
                solver.edges.forEach(function (item) {
                    enqueueLine(screenctx, item[0].pos, item[1].pos);
                });
                screenctx.stroke();
            }

            if (reddots) {
                screenctx.fillStyle = "red";
                reddots.forEach(drawDot);
            }

            if (drawingMouse && drawingMouse.isin) {
                screenctx.lineWidth = 1;
                screenctx.strokeStyle = "black";
                drawCircle(screenctx, drawingMouse.x, drawingMouse.y, 10);
            }

            if (solution) {
                screenctx.lineWidth = 2;
                screenctx.strokeStyle = 'red';
                drawLineStrip(screenctx, solution.path);
                redrawer.start(50);
            }
        }

        function drawCircle(ctx, cx, cy, r) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 360);
            ctx.stroke();
        }


        function enqueueLine(ctx, st, en) {
            ctx.moveTo(st[0], st[1]);
            ctx.lineTo(en[0], en[1]);
        }
        function drawLineStrip(ctx, arr) {
            ctx.beginPath();
            ctx.moveTo(arr[0][0], arr[0][1]);
            for (var i = 1, mi = arr.length; i < mi; i++) {
                ctx.lineTo(arr[i][0], arr[i][1]);
            }
            ctx.stroke();
        }
        function drawLine(ctx, st, en) {
            ctx.beginPath();
            enqueueLine(ctx, st, en);
            ctx.stroke();
        }

        function drawDot(dot) {
            var x = dot[0];
            var y = dot[1];
            screenctx.fillRect(x - 1, y - 1, 3, 3);
        }

        function onRedraw() {
            var time = Date.now() * 0.001;
            draw(time);
        }
        var redrawer = new Interval(onRedraw, 20);
        redrawer.start(50);


        function onUpdate() {
            var time = Date.now() * 0.001;
            if (solver) {
                update(time);

                document.getElementById('samplesTook').textContent = '' + samplesTook;
                document.getElementById('samplesGenerated').textContent = '' + solver.samplesGenerated;
            }
        }
        var updater = new Interval(onUpdate, 50);

        function doStart() {
            if (updater.running || !solver) reset();
            updater.start();
            redrawer.start();
        }
        function doStop() {
            updater.stop();
        }
        function doReset() {
            if (updater.running) {
                reset();
            } else {
                solver = null;
            }
        }

        function selectMap(imgUrl) {
            var running = updater.running;
            doStop();
            loadMapFromUrl(imgUrl, function() {
                doReset();
                if (running) doStart();
            });
        }

        function selectAlgorithm(algorithmId) {
            SelectedAlgorithm = StringMap.get(algorithms, algorithmId);
            doReset();
        }



        var samplesLeft = 0;
        var samplesArr = [];


        function nextTick(fn) {
            setTimeout(fn, 1);
        }
        function endCycle() {
            if (samplesLeft > 0) {
                samplesLeft--;
                samplesArr.push({
                    took: samplesTook,
                    generated: solver.samplesGenerated,
                    cost: solution.cost
                });
                nextTick(continueSamples);
            } else {
                console.log("SAMPLES");
                console.log(samplesArr);
            }
        }
        function continueSamples() {
            doReset();
            doStart();
        }
        function collectSamples(count) {
            CYCLE_SPEED = 200;
            samplesLeft = count;
            samplesArr = [];
            continueSamples();
        }


        this.collectSamples = collectSamples;
        this.doStart = doStart;
        this.doStop = doStop;
        this.doReset = doReset;
        this.selectMap = selectMap;
        this.selectAlgorithm = selectAlgorithm;
    }


    return App;
});

