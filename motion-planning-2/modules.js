const MODULES = new Map();

function define(name, deps, factory) {
    if (MODULES.has(name)) {
        throw { name: 'AmdError', code: 'RedefinedModule', message: name };
    }
    MODULES.set(name, { n: name, d: deps, e: null, f: factory });
}

function require(name) {
    const module = MODULES.get(name);
    if (!module) {
        throw { name: 'AmdError', code: 'ModuleNotFound', message: name };
    }
    if (!module.e) {
        try {
            module.e = {};
            module.f.apply(null, module.d.map(req));
        } catch (e) {
            throw { name: 'AmdError', code: 'ModuleInitFailed', inner: e };
        }
    }
    return module.e;

    function req(name) {
        return name === 'exports' ? module.e : require(name);
    }
}

"use strict";

define("/algorithm/Heap", ["exports"], function (exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function swap(l, i, j) {
        var tmp = l[i];
        l[i] = l[j];
        l[j] = tmp;
    }

    var KeyValue = function KeyValue(key, value) {
        _classCallCheck(this, KeyValue);

        this.key = key;
        this.value = value;
    };

    var Heap = (function () {
        function Heap() {
            _classCallCheck(this, Heap);

            this.list = [];
        }

        _createClass(Heap, [{
            key: "push",
            value: function push(key, value) {
                var list = this.list;
                var index = list.length,
                    parent = 0;
                var cursor = new KeyValue(key, value);
                list.push(cursor);

                while (index > 0) {
                    parent = Math.floor((index - 1) / 2);
                    var pitem = list[parent];

                    if (cursor.key < pitem.key) {
                        list[index] = pitem;
                        index = parent;
                    } else break;
                }

                list[index] = cursor;
            }
        }, {
            key: "popEntry",
            value: function popEntry() {
                var list = this.list;
                var result = list[0];

                if (list.length > 1) {
                    list[0] = list.pop();
                    var length = list.length;
                    var index = 0;

                    for (;;) {
                        var left = index * 2 + 1;
                        var right = left + 1;
                        var smallest = index;

                        if (left < length && list[left].key < list[smallest].key) {
                            smallest = left;
                        }

                        if (right < length && list[right].key < list[smallest].key) {
                            smallest = right;
                        }

                        if (smallest !== index) {
                            swap(list, index, smallest);
                            index = smallest;
                        } else {
                            break;
                        }
                    }
                } else if (list.length > 0) {
                    list.length = 0;
                }

                return result;
            }
        }, {
            key: "popValue",
            value: function popValue() {
                return this.popEntry().value;
            }
        }, {
            key: "peek",
            value: function peek() {
                return this.list[0];
            }
        }, {
            key: "has",
            value: function has() {
                return this.list.length > 0;
            }
        }]);

        return Heap;
    })();

    exports.default = Heap;
    ;
});

"use strict";

define("/algorithm/MultiMap", ["exports"], function (exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    var MapClass = Map;

    var MultiMap = (function () {
        function MultiMap() {
            _classCallCheck(this, MultiMap);

            this._map = new MapClass();
        }

        _createClass(MultiMap, [{
            key: "put",
            value: function put(key, value) {
                var myMap = this._map;
                var mySet = myMap.get(key);

                if (!mySet) {
                    mySet = new Set();
                    myMap.set(key, mySet);
                }

                mySet.add(value);
                return mySet;
            }
        }, {
            key: "get",
            value: function get(key) {
                return this._map.get(key) || [];
            }
        }]);

        return MultiMap;
    })();

    exports.default = MultiMap;
});

"use strict";

define("/algorithm/UnionFind", ["exports"], function (exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _Math = Math;
    var max = _Math.max;

    var UnionFindItem = function UnionFindItem(item) {
        _classCallCheck(this, UnionFindItem);

        this.parent = null;
        this.height = 1;
        this.item = item;
    };

    function findRoot(item) {
        var root = item,
            temp;

        while (root.parent !== null) {
            root = root.parent;
        }

        while (item.parent !== null) {
            temp = item.parent;
            item.parent = root;
            item = temp;
        }

        return root;
    }

    var UnionFind = (function () {
        function UnionFind() {
            _classCallCheck(this, UnionFind);

            this.metaMap = new Map();
            this.count_unions = 0;
            this.count_items = 0;
        }

        _createClass(UnionFind, [{
            key: "_getMeta",
            value: function _getMeta(item) {
                var metaMap = this.metaMap;
                var meta = metaMap.get(item);

                if (!meta) {
                    this.count_items++;
                    meta = new UnionFindItem(item);
                    metaMap.set(item, meta);
                }

                return meta;
            }
        }, {
            key: "find",
            value: function find(item) {
                return findRoot(this._getMeta(item));
            }
        }, {
            key: "_unionMeta",
            value: function _unionMeta(meta1, meta2) {
                meta1 = findRoot(meta1);
                meta2 = findRoot(meta2);

                if (meta1 !== meta2) {
                    if (meta1.height > meta2.height) {
                        meta2.parent = meta1;
                    } else {
                        meta1.parent = meta2;
                        meta1.height = max(meta1.height, meta2.height + 1);
                    }

                    this.count_unions++;
                    return true;
                }

                return false;
            }
        }, {
            key: "union",
            value: function union(item1, item2) {
                return this._unionMeta(this._getMeta(item1), this._getMeta(item2));
            }
        }, {
            key: "same",
            value: function same(item1, item2) {
                return this.find(item1) === this.find(item2);
            }
        }]);

        return UnionFind;
    })();

    exports.default = UnionFind;
});


"use strict";

define("/entry/AnimationHelper", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _bin_search(items, selector, value, left, right) {
    for (;;) {
      if (left > right) return right;
      var midi = Math.floor((left + right) / 2);
      var midval = selector(items[midi]);

      if (value >= midval) {
        left = midi + 1;
      } else {
        right = midi - 1;
      }
    }
  }

  function time_bin_search(items, time) {
    return _bin_search(items, function (x) {
      return x.cost;
    }, time, 0, items.length - 1);
  }

  function clamp_to_index(i, arr) {
    return Math.max(0, Math.min(i, arr.length - 1));
  }

  function process_animation_at(to_config, animT, solution, MyConfigSpace) {
    var solution_path = solution.path;
    var anim_index = time_bin_search(solution_path, animT);
    var anim_index0 = clamp_to_index(anim_index, solution_path);
    var anim_index1 = clamp_to_index(anim_index + 1, solution_path);
    var p0 = solution_path[anim_index0];
    var p1 = solution_path[anim_index1];

    if (p1.cost > p0.cost) {
      MyConfigSpace.lerpTo(to_config, p0.config, p1.config, (animT - p0.cost) / (p1.cost - p0.cost));
    } else {
      MyConfigSpace.copyTo(to_config, p0.config);
    }
  }

  function process_animation(to_config, animationTotal, solution, MyConfigSpace) {
    var animT = Math.min(Date.now() * 0.002 % (animationTotal + 2), animationTotal);
    return process_animation_at(to_config, animT, solution, MyConfigSpace);
  }

  exports.default = {
    time_bin_search: time_bin_search, process_animation: process_animation, process_animation_at: process_animation_at
  };
});

'use strict';

define('/entry/Common', ['exports', '/utils/dicts', '/planning/algorithm/RrtVoronoi', '/planning/algorithm/RrtInc', '/planning/algorithm/Prm'], function (exports, _dicts, _RrtVoronoi, _RrtInc, _Prm) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ALGORITHMS = undefined;

  var _RrtVoronoi2 = _interopRequireDefault(_RrtVoronoi);

  var _RrtInc2 = _interopRequireDefault(_RrtInc);

  var _Prm2 = _interopRequireDefault(_Prm);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var ALGORITHMS = exports.ALGORITHMS = (0, _dicts.default_dict)(_RrtVoronoi2.default, {
    prm: _Prm2.default,
    rrt_voronoi: _RrtVoronoi2.default,
    rrt_inc: _RrtInc2.default
  });
});

"use strict";

define("/entry/Config", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var DEBUG = false;
  var RELEASE = true;
  exports.default = {
    MEASURE_SOLVING_TIMEOUT: 120,

    DEBUG_GREEDY: true,

    SHOW2D_SAMPLE_COUNT: 500,

    SHOW2D_TREE_FULL: false,
    SHOW2D_TREE_PART: DEBUG,

    SHOW2D_AGENT: RELEASE,
    SHOW2D_AGENT_SHADOW: RELEASE,
    SHOW2D_SAMPLES: RELEASE,
    SHOW2D_WALLS: true,

    SHOW3D_TREE_PART: DEBUG,
    SHOW3D_SOLUTION_KEYFRAME_COUNT: 5,

    FRAME_TIME: 50
  };
});

'use strict';

define('/entry/Index2D', ['exports', '/utils/query', '/math/NBox', '/experiments_old/experiment/curved_piano/CurvedPianoExperiment', '/experiments_old/experiment/arm/ArmExperiment4', '/experiments_old/experiment/arm/ArmExperiment6', '/experiments_old/experiment/arm/ArmExperiment12', '/experiments_old/experiment/parking/ParkingExperiment', '/experiments_old/experiment/parking_physics/PhParkingExperiment', '/utils/dicts', '/utils/MeasureHelper', '/entry/Common', '/entry/Config', '/view/DataContainer', '/experiments_old/visual/CssViewModel', '/experiments_old/visual/CssView', '/entry/AnimationHelper'], function (exports, _query, _NBox, _CurvedPianoExperiment, _ArmExperiment, _ArmExperiment3, _ArmExperiment5, _ParkingExperiment, _PhParkingExperiment, _dicts, _MeasureHelper, _Common, _Config, _DataContainer, _CssViewModel, _CssView, _AnimationHelper) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _query2 = _interopRequireDefault(_query);

  var _NBox2 = _interopRequireDefault(_NBox);

  var _CurvedPianoExperiment2 = _interopRequireDefault(_CurvedPianoExperiment);

  var _ArmExperiment2 = _interopRequireDefault(_ArmExperiment);

  var _ArmExperiment4 = _interopRequireDefault(_ArmExperiment3);

  var _ArmExperiment6 = _interopRequireDefault(_ArmExperiment5);

  var _ParkingExperiment2 = _interopRequireDefault(_ParkingExperiment);

  var _PhParkingExperiment2 = _interopRequireDefault(_PhParkingExperiment);

  var _MeasureHelper2 = _interopRequireDefault(_MeasureHelper);

  var _Config2 = _interopRequireDefault(_Config);

  var _DataContainer2 = _interopRequireDefault(_DataContainer);

  var _CssViewModel2 = _interopRequireDefault(_CssViewModel);

  var _CssView2 = _interopRequireDefault(_CssView);

  var _AnimationHelper2 = _interopRequireDefault(_AnimationHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var EXPERIMENTS = (0, _dicts.default_dict)(_CurvedPianoExperiment2.default, {
    curved: _CurvedPianoExperiment2.default,
    park: _ParkingExperiment2.default,
    park2: _PhParkingExperiment2.default,
    arm4: _ArmExperiment2.default,
    arm6: _ArmExperiment4.default,
    arm12: _ArmExperiment6.default
  });

  function main() {
    var params = _query2.default.get_params();

    var SelectedAlgorithm = _Common.ALGORITHMS.get(params.get('alg'));

    var Experiment = EXPERIMENTS.get(params.get('exp'));
    var totalTime = 0;
    var view, viewport, viewmodel;
    var MyConfigSpace = null;
    var config = null;
    var experiment, solver, solution;
    var animationTotal = 0;
    var measurer = null;
    var current_measure = null;
    var shown_measurement = {
      time: 0,
      samples: 0,
      storage: 0
    };
    var measure_restart = !!params.get('measure');

    function measureSample() {
      return {
        samples: experiment.sampler.getSampleCount(),
        storage: solver.samples.length,
        cost: solution ? solution.cost : 0
      };
    }

    function setupMeasure() {
      measurer = new _MeasureHelper2.default(measureSample);
      current_measure = measurer.start();
    }

    function setupModel() {
      viewport = document.getElementById('viewport');
      experiment = new Experiment();
      MyConfigSpace = experiment.Configuration;
      setupView();
      config = MyConfigSpace.create();
    }

    function setupView() {
      viewmodel = new _CssViewModel2.default(experiment.model, experiment.Configuration);
      view = new _CssView2.default(viewmodel, viewport, experiment.sampler.model);
    }

    function teardownView() {
      view.dispose();
    }

    function restart() {
      totalTime = 0;
      solution = null;
      experiment.sampler.restart();
      solver = new SelectedAlgorithm(experiment);
      teardownView();
      setupView();
      startMeasureSafe();
    }

    function last(a, def) {
      return a && a.length > 0 ? a[a.length - 1] : def;
    }

    function restartLater() {
      setTimeout(restart, 10);
    }

    function _timedCycle() {
      var mark = Date.now() + _Config2.default.FRAME_TIME;

      do {
        solver.iterate();
      } while (!solver.hasSolution && Date.now() < mark);
    }

    function onSolution() {
      solution = solver.getSolution();
      animationTotal = last(solution.path).cost;
      console.log('solved');
      console.log(solution);
      update_measure_viewmodel();
      var measurement = current_measure.end();

      _DataContainer2.default.appendDataToTable(measurement);

      if (measure_restart) {
        restartLater();
      }
    }

    function update_measure_viewmodel() {
      current_measure.inspectTo(shown_measurement);
    }

    function cycle() {
      var elapsedTimespan = current_measure.timespan();
      update_measure_viewmodel();

      _DataContainer2.default.setCurrentData(shown_measurement);

      if (measure_restart && elapsedTimespan > _Config2.default.MEASURE_SOLVING_TIMEOUT) {
        var measurement = current_measure.endTimeout();

        _DataContainer2.default.appendDataToTable(measurement);

        console.log('timeout');
        current_measure = null;
        restartLater();
      }

      if (!solution) {
        _timedCycle();

        if (solver.hasSolution) {
          onSolution();
        }

        viewmodel.pullSolver(solver, MyConfigSpace);
      } else {
        _AnimationHelper2.default.process_animation(config, animationTotal, solution, MyConfigSpace);

        viewmodel.pullAnim(solver, config, MyConfigSpace);
      }

      view.setHighlighted(experiment.sampler.model.isValid());
      view.update();
    }

    function startUp() {
      setupModel();
      setupMeasure();
      scheduleCycle();
      solver = new SelectedAlgorithm(experiment);
      startMeasureSafe();
    }

    function cycleIteration() {
      scheduleCycle();
      cycle();
    }

    function scheduleCycle() {
      setTimeout(cycleIteration, 50);
    }

    function startMeasureSafe() {
      current_measure = measurer.start();
    }

    startUp();
    self.restart = restart;
  }

  exports.default = { main: main };
});

'use strict';

define('/entry/Index3D', ['exports', '/utils/query', '/utils/loaded', '/utils/dicts', '/entry/Common', '/experiments_new/visual/VisualModel3D', '/experiments_new/visual/BabylonVisual', '/experiments_new/experiment/drone/DronePianoExperiment', '/experiments_new/experiment/drone/DronePhysicsExperiment', '/experiments_new/experiment/test/TestExperiment1'], function (exports, _query, _loaded, _dicts, _Common, _VisualModel3D, _BabylonVisual, _DronePianoExperiment, _DronePhysicsExperiment, _TestExperiment) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _query2 = _interopRequireDefault(_query);

  var _loaded2 = _interopRequireDefault(_loaded);

  var _VisualModel3D2 = _interopRequireDefault(_VisualModel3D);

  var _BabylonVisual2 = _interopRequireDefault(_BabylonVisual);

  var _DronePianoExperiment2 = _interopRequireDefault(_DronePianoExperiment);

  var _DronePhysicsExperiment2 = _interopRequireDefault(_DronePhysicsExperiment);

  var _TestExperiment2 = _interopRequireDefault(_TestExperiment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var EXPERIMENTS = (0, _dicts.default_dict)(_DronePianoExperiment2.default, {
    drone1: _DronePianoExperiment2.default,
    drone2: _DronePhysicsExperiment2.default,
    test1: _TestExperiment2.default
  });

  function main() {
    var params = _query2.default.get_params();

    (0, _loaded2.default)(function () {
      var canvas = document.getElementById("render-canvas");
      var Experiment = EXPERIMENTS.get(params.get('exp'));

      var Algorithm = _Common.ALGORITHMS.get(params.get('alg'));

      var experiment = new Experiment();
      var model = new _VisualModel3D2.default(experiment, Algorithm, !!params.get('measure'));
      var visual = new _BabylonVisual2.default(canvas, experiment, model);
      visual.init(Date.now());
      visual.run(function () {
        model.update();
        visual.render(Date.now());
      });
    });
  }

  exports.default = { main: main };
});

'use strict';

define('/entry/IndexTest', ['exports', '/utils/query', '/math/NBox', '/math/VecN', '/math/NBoxTree', '/utils/dicts'], function (exports, _query, _NBox, _VecN, _NBoxTree, _dicts) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _query2 = _interopRequireDefault(_query);

  var _NBox2 = _interopRequireDefault(_NBox);

  var _VecN2 = _interopRequireDefault(_VecN);

  var _NBoxTree2 = _interopRequireDefault(_NBoxTree);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function randomDotInNBox(nbox) {
    var vec = _VecN2.default.copy(nbox.min);

    for (var i = 0; i < vec.length; i++) {
      vec[i] = nbox.min[i] + Math.random() * (nbox.max[i] - nbox.min[i]);
    }

    return vec;
  }

  function test_nbox() {
    var bounds = _NBox2.default.make([-1, -1, -1, -1], [1, 1, 1, 1]);

    var nboxtree = new _NBoxTree2.default(bounds);

    var target = _VecN2.default.create(4);

    var bestdist = 2000;

    for (var i = 0; i < 2000; i++) {
      var newvec = randomDotInNBox(bounds);
      nboxtree.putDot(newvec);
      var nearest = nboxtree.nearest(target);

      var dist = _VecN2.default.dist(nearest, target);

      if (dist > bestdist) {
        return false;
      }
    }

    return nboxtree.check();
  }

  function main() {
    for (var i = 1; i < 11; i++) {
      var res = test_nbox();
      console.log('test_nbox #' + i + ': ' + (res ? 'SUCC' : 'FAIL'));
    }
  }

  exports.default = { main: main };
});




"use strict";

define("/experiments_new/collision/obb3/Obb3", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var Obb = (function () {
    function Obb() {
      _classCallCheck(this, Obb);

      this._buffer = new Float32Array(15);
      this.hsize = this._buffer.subarray(0, 3);
      this.transform = this._buffer.subarray(3, 15);
    }

    _createClass(Obb, [{
      key: "volume",
      value: function volume() {
        return 8 * this.hsize[0] * this.hsize[1] * this.hsize[2];
      }
    }, {
      key: "copy",
      value: function copy(other) {
        this._buffer.set(other._buffer, 0);
      }
    }, {
      key: "clone",
      value: function clone() {
        var r = new Obb();
        r.copy(this);
        return r;
      }
    }]);

    return Obb;
  })();

  exports.default = Obb;
});

'use strict';

define('/experiments_new/collision/obb3/Obb3Collider', ['exports', '/math/Vec3', '/math/Sim3', '/experiments_new/collision/obb3/Obb3'], function (exports, _Vec, _Sim, _Obb) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Obb2 = _interopRequireDefault(_Obb);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _Math = Math;
  var min = _Math.min;
  var sqrt = _Math.sqrt;

  function minBoundByDirXYZ(vertices, dx, dy, dz) {
    var res = _Vec2.default.dotXYZ(vertices[0], dx, dy, dz);

    for (var i = 1; i < vertices.length; i++) {
      var curr = _Vec2.default.dotXYZ(vertices[i], dx, dy, dz);

      res = min(res, curr);
    }

    return res;
  }

  function maxBoundByDirXYZ(vertices, dx, dy, dz) {
    return -minBoundByDirXYZ(vertices, -dx, -dy, -dz);
  }

  function minBoundByDir(vertices, d) {
    return minBoundByDirXYZ(vertices, d[0], d[1], d[2]);
  }

  function maxBoundByDir(vertices, d) {
    return maxBoundByDirXYZ(vertices, d[0], d[1], d[2]);
  }

  function _getBoxVertices(to, box) {
    var hsize = box.hsize,
        transform = box.transform;
    var sx = hsize[0],
        sy = hsize[1],
        sz = hsize[2];
    var mv = _Sim2.default.mulVecIP,
        st = _Vec2.default.setXYZ;
    mv(st(to[0], -sx, -sy, -sz), transform);
    mv(st(to[1], -sx, -sy, +sz), transform);
    mv(st(to[2], -sx, +sy, +sz), transform);
    mv(st(to[3], -sx, +sy, -sz), transform);
    mv(st(to[4], +sx, +sy, -sz), transform);
    mv(st(to[5], +sx, +sy, +sz), transform);
    mv(st(to[6], +sx, -sy, +sz), transform);
    mv(st(to[7], +sx, -sy, -sz), transform);
  }

  var OBoxCollider = (function () {
    function OBoxCollider() {
      _classCallCheck(this, OBoxCollider);

      this._verticesA = _Vec2.default.array(8);
      this._verticesB = _Vec2.default.array(8);
      this._tempVec1 = _Vec2.default.create();
      this._tempVec2 = _Vec2.default.create();
    }

    _createClass(OBoxCollider, [{
      key: 'collide',
      value: function collide(ba, bb) {
        return penetration(ba, bb) > 0;
      }
    }, {
      key: 'maxBoxBoundByDir',
      value: function maxBoxBoundByDir(box, dir) {
        var verticesA = this._verticesA;

        _getBoxVertices(verticesA, box);

        return maxBoundByDir(verticesA, dir);
      }
    }, {
      key: 'minBoxBoundByDir',
      value: function minBoxBoundByDir(box, dir) {
        var verticesA = this._verticesA;

        _getBoxVertices(verticesA, box);

        return minBoundByDir(verticesA, dir);
      }
    }, {
      key: 'penetration',
      value: function penetration(ba, bb) {
        var temp1 = this._tempVec1;
        var temp2 = this._tempVec2;
        var transA = ba.transform;
        var transB = bb.transform;
        var verticesA = this._verticesA;
        var verticesB = this._verticesB;
        var minPenetration = 0;

        _getBoxVertices(verticesA, ba);

        _getBoxVertices(verticesB, bb);

        _Sim2.default.getX(temp1, transA);

        minPenetration = distDir();

        _Sim2.default.getY(temp1, transA);

        aggregate();

        _Sim2.default.getZ(temp1, transA);

        aggregate();

        _Sim2.default.getX(temp1, transB);

        aggregate();

        _Sim2.default.getY(temp1, transB);

        aggregate();

        _Sim2.default.getZ(temp1, transB);

        aggregate();
        maybeAggregateCross(_Sim2.default.getX(temp1, transA), _Sim2.default.getX(temp2, transB));
        maybeAggregateCross(_Sim2.default.getX(temp1, transA), _Sim2.default.getY(temp2, transB));
        maybeAggregateCross(_Sim2.default.getX(temp1, transA), _Sim2.default.getZ(temp2, transB));
        maybeAggregateCross(_Sim2.default.getY(temp1, transA), _Sim2.default.getX(temp2, transB));
        maybeAggregateCross(_Sim2.default.getY(temp1, transA), _Sim2.default.getY(temp2, transB));
        maybeAggregateCross(_Sim2.default.getY(temp1, transA), _Sim2.default.getZ(temp2, transB));
        maybeAggregateCross(_Sim2.default.getZ(temp1, transA), _Sim2.default.getX(temp2, transB));
        maybeAggregateCross(_Sim2.default.getZ(temp1, transA), _Sim2.default.getY(temp2, transB));
        maybeAggregateCross(_Sim2.default.getZ(temp1, transA), _Sim2.default.getZ(temp2, transB));
        return minPenetration;

        function maybeAggregateCross(ref_a, b) {
          _Vec2.default.crossIP(ref_a, b);

          var l2 = _Vec2.default.len2(ref_a);

          if (l2 > 1e-5) {
            _Vec2.default.scaleIP(ref_a, 1 / sqrt(l2));

            aggregate();
          } else {}
        }

        function distDir() {
          var maxa = maxBoundByDir(verticesA, temp1);
          var mina = minBoundByDir(verticesA, temp1);
          var maxb = maxBoundByDir(verticesB, temp1);
          var minb = minBoundByDir(verticesB, temp1);
          return Math.min(maxa - minb, maxb - mina);
        }

        function aggregate() {
          var curr = distDir();

          if (curr < minPenetration) {
            minPenetration = curr;
          }
        }
      }
    }]);

    return OBoxCollider;
  })();

  exports.default = OBoxCollider;
  ;
});

'use strict';

define('/experiments_new/collision/obb3/Obb3TreeBuilder', ['exports', '/math/Vec3', '/math/Sim3', '/experiments_new/collision/obb3/Obb3', '/experiments_new/collision/obb3/Obb3Collider', '/utils/lists', '/experiments_new/collision/obb3/Obb3TreeNode'], function (exports, _Vec, _Sim, _Obb, _Obb3Collider, _lists, _Obb3TreeNode) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Obb2 = _interopRequireDefault(_Obb);

  var _Obb3Collider2 = _interopRequireDefault(_Obb3Collider);

  var _lists2 = _interopRequireDefault(_lists);

  var _Obb3TreeNode2 = _interopRequireDefault(_Obb3TreeNode);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _Math = Math;
  var random = _Math.random;
  var sqrt = _Math.sqrt;
  var max = _Math.max;
  var min = _Math.min;
  var floor = _Math.floor;

  function randomUnitVec3() {
    var result = arguments.length <= 0 || arguments[0] === undefined ? _Vec2.default.create() : arguments[0];

    for (var i = 0; i < 16; i++) {
      result[0] = random() * 2 - 1;
      result[1] = random() * 2 - 1;
      result[2] = random() * 2 - 1;

      var lenSq = _Vec2.default.len2(result);

      if (lenSq >= 0.001 && lenSq <= 1) {
        return _Vec2.default.scaleIP(result, 1 / sqrt(lenSq));
      }
    }

    return _Vec2.default.setXYZ(result, 1, 0, 0);
  }

  var temp_randomRot3 = _Vec2.default.array(3);

  function randomRot3() {
    var result = arguments.length <= 0 || arguments[0] === undefined ? _Sim2.default.create() : arguments[0];
    var v1 = randomUnitVec3(temp_randomRot3[0]);
    var v2 = randomUnitVec3(temp_randomRot3[1]);

    var v3 = _Vec2.default.crossTo(temp_randomRot3[2], v1, v2);

    _Vec2.default.crossTo(v2, v3, v1);

    _Vec2.default.normalizeIP(v1);

    _Vec2.default.normalizeIP(v2);

    _Vec2.default.normalizeIP(v3);

    return _Sim2.default.setRotationVecs(result, v1, v2, v3);
  }

  var BoxTreeBuilder = (function () {
    function BoxTreeBuilder() {
      _classCallCheck(this, BoxTreeBuilder);

      this._random_rots = _lists2.default.generate(64, function () {
        return randomRot3();
      });
      this._box_collider = new _Obb3Collider2.default();
    }

    _createClass(BoxTreeBuilder, [{
      key: '_calcEnclosingBox',
      value: function _calcEnclosingBox(boxes, rot) {
        var result = new _Obb2.default();

        var v = _Vec2.default.create();

        var collider = this._box_collider;

        _Sim2.default.getX(v, rot);

        var xmin = _lists2.default.selectMin(boxes, function (b) {
          return collider.minBoxBoundByDir(b, v);
        });

        var xmax = _lists2.default.selectMax(boxes, function (b) {
          return collider.maxBoxBoundByDir(b, v);
        });

        _Sim2.default.getY(v, rot);

        var ymin = _lists2.default.selectMin(boxes, function (b) {
          return collider.minBoxBoundByDir(b, v);
        });

        var ymax = _lists2.default.selectMax(boxes, function (b) {
          return collider.maxBoxBoundByDir(b, v);
        });

        _Sim2.default.getZ(v, rot);

        var zmin = _lists2.default.selectMin(boxes, function (b) {
          return collider.minBoxBoundByDir(b, v);
        });

        var zmax = _lists2.default.selectMax(boxes, function (b) {
          return collider.maxBoxBoundByDir(b, v);
        });

        _Sim2.default.setTranslationXYZ(result.transform, (xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2);

        _Sim2.default.mulIP(result.transform, rot);

        result.hsize[0] = (xmax - xmin) / 2;
        result.hsize[1] = (ymax - ymin) / 2;
        result.hsize[2] = (zmax - zmin) / 2;
        return result;
      }
    }, {
      key: '_splitByRot',
      value: function _splitByRot(boxes, rot) {
        var dir = _Sim2.default.getX(_Vec2.default.create(), rot);

        var collider = this._box_collider;

        var sorted = _lists2.default.sortedBy(boxes, function (b) {
          return collider.maxBoxBoundByDir(b, dir);
        });

        var mid = floor(boxes.length / 2);
        var list1 = sorted.slice(0, mid);
        var list2 = sorted.slice(mid);

        var bbox1 = this._calcEnclosingBox(list1, rot);

        var bbox2 = this._calcEnclosingBox(list2, rot);

        var bboxa = this._calcEnclosingBox(boxes, rot);

        var volume1 = bbox1.volume();
        var volume2 = bbox2.volume();
        var maxVolume = max(volume1, volume2);
        var splitNegScore = 0.02 * (volume1 + volume2) + maxVolume;
        if (list1.length < 1 || list2.length < 1) throw new Error("BoxTreeBuilder._splitByRot:1");
        return {
          parts: [list1, list2],
          bboxa: bboxa,
          splitNegScore: splitNegScore
        };
      }
    }, {
      key: 'buildBoxTree',
      value: function buildBoxTree(boxes) {
        var _this = this;

        if (boxes.length < 2) {
          return new _Obb3TreeNode2.default(boxes[0], null);
        } else {
          var splitData = _lists2.default.minBy(this._random_rots.map(function (rot) {
            return _this._splitByRot(boxes, rot);
          }), function (i) {
            return i.splitNegScore;
          });

          return new _Obb3TreeNode2.default(splitData.bboxa, splitData.parts.map(function (bs) {
            return _this.buildBoxTree(bs);
          }));
        }
      }
    }]);

    return BoxTreeBuilder;
  })();

  exports.default = BoxTreeBuilder;
});

'use strict';

define('/experiments_new/collision/obb3/Obb3TreeCollider', ['exports', '/experiments_new/collision/obb3/Obb3Collider', '/math/Sim3', '/math/Sim3Etc', '/utils/lists', '/experiments_new/collision/obb3/Obb3TreeNode', '/experiments_new/collision/obb3/Obb3'], function (exports, _Obb3Collider, _Sim, _Sim3Etc, _lists, _Obb3TreeNode, _Obb) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Obb3Collider2 = _interopRequireDefault(_Obb3Collider);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Sim3Etc2 = _interopRequireDefault(_Sim3Etc);

  var _lists2 = _interopRequireDefault(_lists);

  var _Obb3TreeNode2 = _interopRequireDefault(_Obb3TreeNode);

  var _Obb2 = _interopRequireDefault(_Obb);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _Math = Math;
  var sqrt = _Math.sqrt;

  var BoxTreeCollider = (function () {
    function BoxTreeCollider() {
      _classCallCheck(this, BoxTreeCollider);

      this._obox_collider = new _Obb3Collider2.default();
      this._temp_obox = new _Obb2.default();
      this._hit_coins = 0;
    }

    _createClass(BoxTreeCollider, [{
      key: '_node_penetration',
      value: function _node_penetration(node1, node2, sim) {
        var obox1 = node1.obox,
            obox2 = this._temp_obox;
        obox2.copy(node2.obox);

        _Sim2.default.mulIP(obox2.transform, sim);

        var dist2 = _Sim3Etc2.default.getTDist2(obox1.transform, obox2.transform);

        var radsum = node1.radius + node2.radius;

        if (dist2 < radsum * radsum) {
          return this._obox_collider.penetration(obox1, obox2);
        } else {
          return radsum - sqrt(dist2);
        }
      }
    }, {
      key: 'penetration',
      value: function penetration(nodeA, nodeB, simB) {
        var _this = this;

        var cases = (nodeA.volume > nodeB.volume ? 4 : 0) + (nodeA.children ? 2 : 0) + (nodeB.children ? 1 : 0);

        var pen = this._node_penetration(nodeA, nodeB, simB);

        if (pen > 0) {
          switch (cases) {
            case 0:
            case 4:
              nodeA._hit = nodeB._hit = true;
              return pen;

            case 1:
            case 3:
            case 5:
              this._hit_coins--;

              if (this._hit_coins === 0) {
                nodeB.children.forEach(function (n) {
                  return n._hit = true;
                });
              }

              return _lists2.default.selectMax(nodeB.children, function (n) {
                return _this.penetration(nodeA, n, simB);
              });

            case 2:
            case 6:
            case 7:
              this._hit_coins--;

              if (this._hit_coins === 0) {
                nodeA.children.forEach(function (n) {
                  return n._hit = true;
                });
              }

              return _lists2.default.selectMax(nodeA.children, function (n) {
                return _this.penetration(n, nodeB, simB);
              });
          }
        } else {
          return pen;
        }
      }
    }, {
      key: 'collide',
      value: function collide(nodeA, nodeB, simB) {
        return this.penetration(nodeA, nodeB, simB) > 0;
      }
    }]);

    return BoxTreeCollider;
  })();

  exports.default = BoxTreeCollider;
});

'use strict';

define('/experiments_new/collision/obb3/Obb3TreeNode', ['exports', '/math/Vec3', '/experiments_new/collision/obb3/Obb3'], function (exports, _Vec, _Obb) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Obb2 = _interopRequireDefault(_Obb);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var BoxTreeNode = (function () {
    function BoxTreeNode() {
      var obox = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var children = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      _classCallCheck(this, BoxTreeNode);

      var my_obox = obox ? obox.clone() : new _Obb2.default();
      this.obox = my_obox;
      this.volume = my_obox.volume();
      this.radius = _Vec2.default.len(my_obox.hsize);
      this.children = children;
      this._hit = false;
    }

    _createClass(BoxTreeNode, [{
      key: 'visit',
      value: function visit(cb) {
        cb(this);

        if (this.children) {
          this.children.forEach(function (c) {
            return c.visit(cb);
          });
        }
      }
    }, {
      key: 'set',
      value: function set(node) {
        this.obox.copy(node.obox);
        this.volume = node.volume;
        this.radius = node.radius;
        this.children = node.children;
      }
    }]);

    return BoxTreeNode;
  })();

  exports.default = BoxTreeNode;
});



'use strict';

define('/experiments_new/experiment/common/DefinitionHelper', ['exports', '/math/Sim3', '/math/Vec3', '/experiments_new/collision/obb3/Obb3', '/utils/lists', '/utils/math'], function (exports, _Sim, _Vec, _Obb, _lists, _math) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OBox_setPlacement = OBox_setPlacement;
  exports.OBox_makePlacement = OBox_makePlacement;
  exports.makeRing = makeRing;

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Obb2 = _interopRequireDefault(_Obb);

  var _lists2 = _interopRequireDefault(_lists);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _Math = Math;
  var sin = _Math.sin;
  var cos = _Math.cos;
  var tan = _Math.tan;

  function OBox_setPlacement(obox, sx, sy, sz, cx, cy, cz, rx, ry, rz, ang) {
    var angrad = ang * _math.DEG_TO_RAD;

    _Vec2.default.setXYZ(obox.hsize, sx / 2, sy / 2, sz / 2);

    _Sim2.default.setRotationAxisAngleXYZ(obox.transform, rx * angrad, ry * angrad, rz * angrad);

    _Sim2.default.translateXYZ(obox.transform, cx, cy, cz);
  }

  function OBox_makePlacement(sx, sy, sz, cx, cy, cz, rx, ry, rz, ang) {
    var r = new _Obb2.default();
    OBox_setPlacement(r, sx, sy, sz, cx, cy, cz, rx, ry, rz, ang);
    return r;
  }

  function makeRing(radius, thickness, segments) {
    var sim = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    var width = 2 * tan(_math.PI / segments) * (radius + thickness / 2);
    return _lists2.default.generate(segments, function (i) {
      var a = i / segments * _math.TWO_PI;
      var res = OBox_makePlacement(thickness, thickness, width, radius * cos(a), 0, radius * sin(a), 0, 1, 0, a * _math.RAD_TO_DEG);
      if (sim) _Sim2.default.mulIP(res.transform, sim);
      return res;
    });
  }

  exports.default = {
    OBox_setPlacement: OBox_setPlacement,
    OBox_makePlacement: OBox_makePlacement,
    makeRing: makeRing
  };
});

'use strict';

define('/experiments_new/experiment/common/random_boxes', ['exports', '/experiments_new/collision/obb3/Obb3', '/experiments_new/collision/obb3/Obb3TreeBuilder', '/utils/lists'], function (exports, _Obb, _Obb3TreeBuilder, _lists) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Obb2 = _interopRequireDefault(_Obb);

  var _Obb3TreeBuilder2 = _interopRequireDefault(_Obb3TreeBuilder);

  var _lists2 = _interopRequireDefault(_lists);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var boxList = _lists2.default.generate(15, function (i) {
    return _Obb2.default.makePlacement(0.4 + Math.random() * 0.4, 0.4 + Math.random() * 0.4, 0.4 + Math.random() * 0.4, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 360);
  });

  var boxTree = new _Obb3TreeBuilder2.default().buildBoxTree(boxList);
  exports.default = {
    boxTree: boxTree, boxList: boxList
  };
});


'use strict';

define('/experiments_new/experiment/drone/DroneBoxes', ['exports', '/experiments_new/experiment/common/DefinitionHelper', '/experiments_new/collision/obb3/Obb3TreeBuilder', '/utils/lists'], function (exports, _DefinitionHelper, _Obb3TreeBuilder, _lists) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Obb3TreeBuilder2 = _interopRequireDefault(_Obb3TreeBuilder);

  var _lists2 = _interopRequireDefault(_lists);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var boxList = [(0, _DefinitionHelper.OBox_makePlacement)(1, 0.3, 1, 0, 0, 0, 0, 1, 0, 0), (0, _DefinitionHelper.OBox_makePlacement)(4, 0.05, 0.2, 0, 0, 0, 0, 1, 0, 45), (0, _DefinitionHelper.OBox_makePlacement)(4, 0.05, 0.2, 0, 0, 0, 0, 1, 0, -45), (0, _DefinitionHelper.OBox_makePlacement)(1, 0.04, 1, 1.4, 0.045, 1.4, 0, 1, 0, 0), (0, _DefinitionHelper.OBox_makePlacement)(1, 0.04, 1, -1.4, 0.045, 1.4, 0, 1, 0, 0), (0, _DefinitionHelper.OBox_makePlacement)(1, 0.04, 1, -1.4, 0.045, -1.4, 0, 1, 0, 0), (0, _DefinitionHelper.OBox_makePlacement)(1, 0.04, 1, 1.4, 0.045, -1.4, 0, 1, 0, 0)];
  var boxTree = new _Obb3TreeBuilder2.default().buildBoxTree(boxList);
  exports.default = {
    boxTree: boxTree, boxList: boxList
  };
});

'use strict';

define('/experiments_new/experiment/drone/DronePhysicsExperiment', ['exports', '/experiments_new/experiment/drone/DroneBoxes', '/experiments_new/experiment/piano3d/Sampler3D', '/experiments_new/experiment/drone/PhysicsConfig', '/experiments_new/experiment/drone/PhysicsInput', '/experiments_new/experiment/common/DefinitionHelper', '/utils/math', '/math/Sim3', '/math/NBox'], function (exports, _DroneBoxes, _Sampler3D, _PhysicsConfig, _PhysicsInput, _DefinitionHelper, _math, _Sim, _NBox) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = DroneRingMapPhysics;

  var _DroneBoxes2 = _interopRequireDefault(_DroneBoxes);

  var _Sampler3D2 = _interopRequireDefault(_Sampler3D);

  var _PhysicsConfig2 = _interopRequireDefault(_PhysicsConfig);

  var _PhysicsInput2 = _interopRequireDefault(_PhysicsInput);

  var _DefinitionHelper2 = _interopRequireDefault(_DefinitionHelper);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _NBox2 = _interopRequireDefault(_NBox);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function Drone2Model() {
    this.agentBoxes = _DroneBoxes2.default.boxList;
    this.worldBoxes = [].concat(_DefinitionHelper2.default.makeRing(3.5, 0.5, 12, _Sim2.default.translateXYZ(_Sim2.default.rotationX(_math.PI / 2), 0, 0, 0)));
  }

  function DroneRingMapPhysics() {
    this.model = new Drone2Model();
    this.sampler = new _Sampler3D2.default(this.model);
    this.storeResolutionMax = 0.20;
    this.storeResolutionMin = 0.03;
    this.storeResolutionGradient = 0.2;
    this.checkResolution = 0.02;
    this.connectDistance = 1.5;
    this.targetDistance = 0.20;
    this.sampleBounds = _NBox2.default.make([-7, -5, -10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [7, 5, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    this.start = _PhysicsConfig2.default.make(-2.5, -1, -7, 1, 0, 0, 0);
    this.target = _PhysicsConfig2.default.make(-2.5, +1, +7, 1, 0, 0, 0);
    this.Configuration = _PhysicsConfig2.default;
    this.ConfigurationInput = _PhysicsInput2.default;
  }

  ;
});

'use strict';

define('/experiments_new/experiment/drone/DronePianoExperiment', ['exports', '/experiments_new/experiment/drone/DroneBoxes', '/experiments_new/experiment/piano3d/Sampler3D', '/experiments_new/experiment/piano3d/Piano3DConfig', '/experiments_new/experiment/piano3d/Piano3DInput', '/experiments_new/experiment/common/DefinitionHelper', '/utils/math', '/math/Sim3', '/math/NBox'], function (exports, _DroneBoxes, _Sampler3D, _Piano3DConfig, _Piano3DInput, _DefinitionHelper, _math, _Sim, _NBox) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = DroneRingMap;

  var _DroneBoxes2 = _interopRequireDefault(_DroneBoxes);

  var _Sampler3D2 = _interopRequireDefault(_Sampler3D);

  var _Piano3DConfig2 = _interopRequireDefault(_Piano3DConfig);

  var _Piano3DInput2 = _interopRequireDefault(_Piano3DInput);

  var _DefinitionHelper2 = _interopRequireDefault(_DefinitionHelper);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _NBox2 = _interopRequireDefault(_NBox);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function DroneRingModel() {
    this.agentBoxes = _DroneBoxes2.default.boxList;
    this.worldBoxes = [].concat(_DefinitionHelper2.default.makeRing(3.5, 0.5, 16, _Sim2.default.translateXYZ(_Sim2.default.rotationX(_math.PI / 2), 0, 0, +2))).concat(_DefinitionHelper2.default.makeRing(3.0, 0.5, 12, _Sim2.default.translateXYZ(_Sim2.default.rotationX(_math.PI / 2), 0, 0, 0))).concat(_DefinitionHelper2.default.makeRing(3.5, 0.5, 16, _Sim2.default.translateXYZ(_Sim2.default.rotationX(_math.PI / 2), 0, 0, -2)));
  }

  function DroneRingMap() {
    this.model = new DroneRingModel();
    this.sampler = new _Sampler3D2.default(this.model);
    this.storeResolutionMin = 0.02;
    this.storeResolutionMax = 0.05;
    this.storeResolutionGradient = 0.2;
    this.checkResolution = 0.04;
    this.connectDistance = 1.50;
    this.targetDistance = 0.15;
    this.sampleBounds = _NBox2.default.make([-7, -7, -7, -1, -1, -1, -1], [7, 7, 7, 1, 1, 1, 1]);
    this.start = _Piano3DConfig2.default.make(-2.5, -1, -5, 1, 0, 0, 0);
    this.target = _Piano3DConfig2.default.make(-2.5, +1, +5, 1, 0, 0, 0);
    this.Configuration = _Piano3DConfig2.default;
    this.ConfigurationInput = _Piano3DInput2.default;
  }

  ;
});

'use strict';

define('/experiments_new/experiment/drone/PhysicsConfig', ['exports', '/math/QuatEtc', '/math/Quat', '/math/VecN', '/math/Sim3'], function (exports, _QuatEtc, _Quat, _VecN, _Sim) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _QuatEtc2 = _interopRequireDefault(_QuatEtc);

  var _Quat2 = _interopRequireDefault(_Quat);

  var _VecN2 = _interopRequireDefault(_VecN);

  var _Sim2 = _interopRequireDefault(_Sim);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _Math = Math;
  var random = _Math.random;
  var sqrt = _Math.sqrt;

  var temp_quat = _Quat2.default.create();

  var temp_quat2 = _Quat2.default.create();

  var temp_sim = _Sim2.default.create();

  function rinterval(a, b) {
    return random() * (b - a) + a;
  }

  function create() {
    return new Float64Array(3 + 3 + 4 + 3);
  }

  function _store_quat(config, quat) {
    config[6] = quat[0];
    config[7] = quat[1];
    config[8] = quat[2];
    config[9] = quat[3];
  }

  function _load_quat(config, quat) {
    quat[0] = config[6];
    quat[1] = config[7];
    quat[2] = config[8];
    quat[3] = config[9];
  }

  function copyTo(to, a) {
    to.set(a, 0);
    return to;
  }

  function copy(a) {
    return copyTo(create(), a);
  }

  function lerp(a, b, t) {
    var to = arguments.length <= 3 || arguments[3] === undefined ? create() : arguments[3];
    return lerpTo(to, a, b, t);
  }

  function lerpTo(to, a, b, t) {
    var it = 1 - t;

    for (var i = 0; i < 6; i++) {
      to[i] = a[i] * it + b[i] * t;
    }

    _load_quat(a, temp_quat);

    _load_quat(b, temp_quat2);

    _Quat2.default.slerpIP(temp_quat, temp_quat2, t);

    _store_quat(to, temp_quat);

    for (var i = 10; i < 13; i++) {
      to[i] = a[i] * it + b[i] * t;
    }

    return to;
  }

  function initial() {
    var to = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];
    to[0] = 0;
    to[1] = 0;
    to[2] = 0;
    to[3] = 0;
    to[4] = 0;
    to[5] = 0;
    to[6] = 1;
    to[7] = 0;
    to[8] = 0;
    to[9] = 0;
    to[10] = 0;
    to[11] = 0;
    to[12] = 0;
    return to;
  }

  function to_sim3(sim, conf) {
    _load_quat(conf, temp_quat);

    _QuatEtc2.default.transformQXYZ(sim, temp_quat, conf[0], conf[1], conf[2]);

    return sim;
  }

  function make(tx, ty, tz, qw, qx, qy, qz) {
    var r = create();
    r[0] = tx;
    r[1] = ty;
    r[2] = tz;
    r[3] = 0;
    r[4] = 0;
    r[5] = 0;
    r[6] = qw;
    r[7] = qx;
    r[8] = qy;
    r[9] = qz;
    r[10] = 0;
    r[11] = 0;
    r[12] = 0;
    return r;
  }

  function randomize(config, nbox) {
    for (var i = 0; i < 6; i++) {
      config[i] = rinterval(nbox.min[i], nbox.max[i]);
    }

    _QuatEtc2.default.setRandomUnit(temp_quat);

    _store_quat(config, temp_quat);

    for (var i = 10; i < 13; i++) {
      config[i] = rinterval(nbox.min[i], nbox.max[i]);
    }

    return config;
  }

  exports.default = {
    initial: initial, create: create, randomize: randomize,
    copy: copy, copyTo: copyTo,
    lerp: lerp, lerpTo: lerpTo,

    dist: _VecN2.default.dist, dist2: _VecN2.default.dist2,
    to_sim3: to_sim3, make: make
  };
});

'use strict';

define('/experiments_new/experiment/drone/PhysicsInput', ['exports', '/math/QuatEtc', '/math/Quat', '/math/Vec3', '/math/Vec3Etc', '/math/Sim3'], function (exports, _QuatEtc, _Quat, _Vec, _Vec3Etc, _Sim) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _QuatEtc2 = _interopRequireDefault(_QuatEtc);

  var _Quat2 = _interopRequireDefault(_Quat);

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Vec3Etc2 = _interopRequireDefault(_Vec3Etc);

  var _Sim2 = _interopRequireDefault(_Sim);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

  var _Math = Math;
  var random = _Math.random;

  var _Quat$array = _Quat2.default.array(2);

  var _Quat$array2 = _slicedToArray(_Quat$array, 2);

  var temp_quat1 = _Quat$array2[0];
  var temp_quat2 = _Quat$array2[1];

  var temp_vec1 = _Vec2.default.create();

  var temp_vec2 = _Vec2.default.create();

  var temp_sim1 = _Sim2.default.create();

  var GRAVITY = 0.5;
  var MASS = 1.0;
  var THRUST_FORCE = MASS * GRAVITY;
  var THRUST_VARIANCE = 0.3;
  var ROTATION_TORQUE = 0.2;
  var ROTATION_TORQUE_Y = ROTATION_TORQUE * 0.1;
  var MOMENT_OF_INERTIA = 5.0;

  function create() {
    return new Float64Array(5);
  }

  function _store_quat(arr, idx, quat) {
    arr[idx + 0] = quat[0];
    arr[idx + 1] = quat[1];
    arr[idx + 2] = quat[2];
    arr[idx + 3] = quat[3];
  }

  function _load_quat(arr, idx, quat) {
    quat[0] = arr[idx + 0];
    quat[1] = arr[idx + 1];
    quat[2] = arr[idx + 2];
    quat[3] = arr[idx + 3];
  }

  function _store_vec(arr, idx, vec) {
    arr[idx + 0] = vec[0];
    arr[idx + 1] = vec[1];
    arr[idx + 2] = vec[2];
  }

  function _load_vec(arr, idx, vec) {
    vec[0] = arr[idx + 0];
    vec[1] = arr[idx + 1];
    vec[2] = arr[idx + 2];
  }

  function randomize() {
    var c = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];
    c[0] = 1.0 + (random() * 2 - 1) * THRUST_VARIANCE;

    _Vec3Etc2.default.uniformInSphere(c, 1, 1);

    c[0] *= THRUST_FORCE;
    c[1] *= ROTATION_TORQUE;
    c[2] *= ROTATION_TORQUE_Y;
    c[3] *= ROTATION_TORQUE;
    c[4] = 0.1 + random() * 1.9;
    return c;
  }

  function applyTo(dest, config, action) {
    var dt = action[4];

    _load_quat(config, 6, temp_quat1);

    _QuatEtc2.default.quat_to_sim(temp_sim1, temp_quat1);

    _load_vec(action, 1, temp_vec1);

    _Sim2.default.mulVecIP(temp_vec1, temp_sim1);

    _load_vec(config, 10, temp_vec2);

    _Vec2.default.scaleIP(temp_vec1, dt / MOMENT_OF_INERTIA);

    _Vec2.default.addIP(temp_vec2, temp_vec1);

    _store_vec(dest, 10, temp_vec2);

    _Quat2.default.setEulerScaleVS(temp_quat2, temp_vec2, dt);

    _Quat2.default.mulIP(temp_quat1, temp_quat2);

    _store_quat(dest, 6, temp_quat1);

    _QuatEtc2.default.quat_to_sim(temp_sim1, temp_quat1);

    _Vec2.default.setXYZ(temp_vec1, 0, -action[0], 0);

    _Sim2.default.mulVecIP(temp_vec1, temp_sim1);

    _load_vec(config, 3, temp_vec2);

    temp_vec1[1] -= GRAVITY * MASS;

    _Vec2.default.scaleIP(temp_vec1, dt / MASS);

    _Vec2.default.addIP(temp_vec2, temp_vec1);

    _store_vec(dest, 3, temp_vec2);

    _load_vec(config, 0, temp_vec1);

    _Vec2.default.scaleIP(temp_vec2, dt);

    _Vec2.default.addIP(temp_vec1, temp_vec2);

    _store_vec(dest, 0, temp_vec1);

    return dest;
  }

  function applyIP(config, action, opt_dt) {
    return applyTo(config, config, action, opt_dt);
  }

  function costOf(inp) {
    return inp[4];
  }

  exports.default = {
    create: create, randomize: randomize, applyTo: applyTo, applyIP: applyIP, costOf: costOf
  };
});


'use strict';

define('/experiments_new/experiment/piano3d/Piano3DConfig', ['exports', '/math/QuatEtc', '/math/Quat'], function (exports, _QuatEtc, _Quat) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _QuatEtc2 = _interopRequireDefault(_QuatEtc);

  var _Quat2 = _interopRequireDefault(_Quat);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _Math = Math;
  var random = _Math.random;
  var sqrt = _Math.sqrt;

  var temp_quat = _Quat2.default.create();

  var temp_quat2 = _Quat2.default.create();

  function rinterval(a, b) {
    return random() * (b - a) + a;
  }

  function create() {
    return new Float64Array(7);
  }

  function _store_quat(config, quat) {
    config[3] = quat[0];
    config[4] = quat[1];
    config[5] = quat[2];
    config[6] = quat[3];
  }

  function _load_quat(config, quat) {
    quat[0] = config[3];
    quat[1] = config[4];
    quat[2] = config[5];
    quat[3] = config[6];
  }

  function randomize(config, nbox) {
    config[0] = rinterval(nbox.min[0], nbox.max[0]);
    config[1] = rinterval(nbox.min[1], nbox.max[1]);
    config[2] = rinterval(nbox.min[2], nbox.max[2]);

    _QuatEtc2.default.setRandomUnit(temp_quat);

    _store_quat(config, temp_quat);

    return config;
  }

  function copyTo(to, a) {
    to.set(a, 0);
    return to;
  }

  function copy(a) {
    return copyTo(create(), a);
  }

  function dist2(a, b) {
    var x0 = b[0] - a[0];
    var x1 = b[1] - a[1];
    var x2 = b[2] - a[2];
    var x3 = b[3] - a[3];
    var x4 = b[4] - a[4];
    var x5 = b[5] - a[5];
    var x6 = b[6] - a[6];
    return x0 * x0 + x1 * x1 + x2 * x2 + x3 * x3 + x4 * x4 + x5 * x5 + x6 * x6;
  }

  function dist(a, b) {
    return sqrt(dist2(a, b));
  }

  function lerp(a, b, t) {
    var to = arguments.length <= 3 || arguments[3] === undefined ? create() : arguments[3];
    return lerpTo(to, a, b, t);
  }

  function lerpTo(to, a, b, t) {
    var it = 1 - t;
    to[0] = a[0] * it + b[0] * t;
    to[1] = a[1] * it + b[1] * t;
    to[2] = a[2] * it + b[2] * t;

    _load_quat(a, temp_quat);

    _load_quat(b, temp_quat2);

    _Quat2.default.slerpIP(temp_quat, temp_quat2, t);

    _store_quat(to, temp_quat);

    return to;
  }

  function initial() {
    var to = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];
    to[0] = 0;
    to[1] = 0;
    to[2] = 0;
    to[3] = 1;
    to[4] = 0;
    to[5] = 0;
    to[6] = 0;
    return to;
  }

  function to_sim3(sim, conf) {
    _load_quat(conf, temp_quat);

    _QuatEtc2.default.transformQXYZ(sim, temp_quat, conf[0], conf[1], conf[2]);

    return sim;
  }

  function make(tx, ty, tz, qw, qx, qy, qz) {
    var r = create();
    r[0] = tx;
    r[1] = ty;
    r[2] = tz;
    r[3] = qw;
    r[4] = qx;
    r[5] = qy;
    r[6] = qz;
    return r;
  }

  exports.default = {
    initial: initial, create: create, randomize: randomize,
    copy: copy, copyTo: copyTo,
    lerp: lerp, lerpTo: lerpTo,
    dist: dist, dist2: dist2,

    to_sim3: to_sim3, make: make
  };
});

'use strict';

define('/experiments_new/experiment/piano3d/Piano3DInput', ['exports', '/math/QuatEtc', '/math/Quat', '/math/Vec3Etc'], function (exports, _QuatEtc, _Quat, _Vec3Etc) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _QuatEtc2 = _interopRequireDefault(_QuatEtc);

  var _Quat2 = _interopRequireDefault(_Quat);

  var _Vec3Etc2 = _interopRequireDefault(_Vec3Etc);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

  var _Math = Math;
  var random = _Math.random;

  var _Quat$array = _Quat2.default.array(2);

  var _Quat$array2 = _slicedToArray(_Quat$array, 2);

  var temp_quat1 = _Quat$array2[0];
  var temp_quat2 = _Quat$array2[1];

  function create() {
    return new Float64Array(6);
  }

  function _store_quat(arr, idx, quat) {
    arr[idx + 0] = quat[0];
    arr[idx + 1] = quat[1];
    arr[idx + 2] = quat[2];
    arr[idx + 3] = quat[3];
  }

  function _load_quat(arr, idx, quat) {
    quat[0] = arr[idx + 0];
    quat[1] = arr[idx + 1];
    quat[2] = arr[idx + 2];
    quat[3] = arr[idx + 3];
  }

  function randomize() {
    var c = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];

    _Vec3Etc2.default.uniformInSphere(c, 0, 1);

    _Vec3Etc2.default.uniformInSphere(c, 3, 1);

    return c;
  }

  function applyTo(dest, config, action) {
    var dt = arguments.length <= 3 || arguments[3] === undefined ? 0.1 : arguments[3];
    dest[0] = config[0] + action[0] * dt * 3;
    dest[1] = config[1] + action[1] * dt * 3;
    dest[2] = config[2] + action[2] * dt * 3;

    _load_quat(config, 3, temp_quat1);

    _Quat2.default.setEulerScaleXYZS(temp_quat2, action[3], action[4], action[5], dt);

    _Quat2.default.mulIP(temp_quat1, temp_quat2);

    _store_quat(dest, 3, temp_quat1);

    return dest;
  }

  function applyIP(config, action, opt_dt) {
    return applyTo(config, config, action, opt_dt);
  }

  function costOf(inp) {
    return 0.2;
  }

  exports.default = {
    create: create, randomize: randomize, applyTo: applyTo, applyIP: applyIP, costOf: costOf
  };
});

'use strict';

define('/experiments_new/experiment/piano3d/Sampler3D', ['exports', '/experiments_new/collision/obb3/Obb3TreeBuilder', '/experiments_new/collision/obb3/Obb3TreeCollider', '/experiments_new/experiment/piano3d/Piano3DConfig', '/math/Sim3'], function (exports, _Obb3TreeBuilder, _Obb3TreeCollider, _Piano3DConfig, _Sim) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Obb3TreeBuilder2 = _interopRequireDefault(_Obb3TreeBuilder);

  var _Obb3TreeCollider2 = _interopRequireDefault(_Obb3TreeCollider);

  var _Piano3DConfig2 = _interopRequireDefault(_Piano3DConfig);

  var _Sim2 = _interopRequireDefault(_Sim);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var Sampler3D = (function () {
    function Sampler3D(model) {
      var builder = arguments.length <= 1 || arguments[1] === undefined ? new _Obb3TreeBuilder2.default() : arguments[1];

      _classCallCheck(this, Sampler3D);

      this.worldTree = builder.buildBoxTree(model.worldBoxes);
      this.agentTree = builder.buildBoxTree(model.agentBoxes);
      this.sim = _Sim2.default.create();
      this.collider = new _Obb3TreeCollider2.default();
      this.sampleCount = 0;
    }

    _createClass(Sampler3D, [{
      key: 'sample',
      value: function sample(config) {
        this.sampleCount++;

        _Piano3DConfig2.default.to_sim3(this.sim, config);

        return this.collider.collide(this.worldTree, this.agentTree, this.sim);
      }
    }, {
      key: 'restart',
      value: function restart() {
        this.sampleCount = 0;
      }
    }, {
      key: 'getSampleCount',
      value: function getSampleCount() {
        return this.sampleCount;
      }
    }]);

    return Sampler3D;
  })();

  exports.default = Sampler3D;
});


'use strict';

define('/experiments_new/experiment/test/TestExperiment1', ['exports', '/experiments_new/experiment/drone/DroneBoxes', '/experiments_new/experiment/piano3d/Sampler3D', '/experiments_new/experiment/piano3d/Piano3DConfig', '/experiments_new/experiment/piano3d/Piano3DInput', '/experiments_new/experiment/common/DefinitionHelper', '/utils/math', '/math/Vec3', '/math/Sim3', '/math/Quat', '/math/QuatEtc', '/math/Sim3Etc', '/experiments_new/collision/obb3/Obb3', '/math/NBox', '/utils/lists'], function (exports, _DroneBoxes, _Sampler3D, _Piano3DConfig, _Piano3DInput, _DefinitionHelper, _math, _Vec, _Sim, _Quat, _QuatEtc, _Sim3Etc, _Obb, _NBox, _lists) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = TestExperiment1;

  var _DroneBoxes2 = _interopRequireDefault(_DroneBoxes);

  var _Sampler3D2 = _interopRequireDefault(_Sampler3D);

  var _Piano3DConfig2 = _interopRequireDefault(_Piano3DConfig);

  var _Piano3DInput2 = _interopRequireDefault(_Piano3DInput);

  var _DefinitionHelper2 = _interopRequireDefault(_DefinitionHelper);

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Quat2 = _interopRequireDefault(_Quat);

  var _QuatEtc2 = _interopRequireDefault(_QuatEtc);

  var _Sim3Etc2 = _interopRequireDefault(_Sim3Etc);

  var _Obb2 = _interopRequireDefault(_Obb);

  var _NBox2 = _interopRequireDefault(_NBox);

  var _lists2 = _interopRequireDefault(_lists);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Configuration = _Piano3DConfig2.default;
  var ConfigurationInput = _Piano3DInput2.default;

  function TestModel1() {
    var temp_quat = _Quat2.default.identity();

    this.agentBoxes = [];
    this.worldBoxes = _lists2.default.generate(5, function (i) {
      var result = new _Obb2.default();

      _Vec2.default.setXYZ(result.hsize, 0.2 + Math.random() * 0.3, 0.2 + Math.random() * 0.3, 0.2 + Math.random() * 0.3);

      _QuatEtc2.default.setRandomUnit(temp_quat);

      _QuatEtc2.default.transformQXYZ(result.transform, temp_quat, Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3);

      return result;
    });
  }

  function TestExperiment1() {
    this.model = new TestModel1();
    this.sampler = new _Sampler3D2.default(this.model);
    this.storeResolution = 0.05;
    this.checkResolution = 0.02;
    this.connectDistance = 0.1;
    this.targetDistance = 0.30;
    this.sampleBounds = _NBox2.default.make([-7, -5, -10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [7, 5, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    this.start = Configuration.make(-2.5, -1, -7, 1, 0, 0, 0);
    this.target = Configuration.make(-2.5, +1, +7, 1, 0, 0, 0);
    this.Configuration = Configuration;
    this.ConfigurationInput = ConfigurationInput;
  }

  ;
});


'use strict';

define('/experiments_new/visual/BabylonVisual', ['exports', '/entry/Config', '/shim/babylon', '/utils/math', '/graphics/MeshHelper', '/math/Sim3', '/view/DataContainer'], function (exports, _Config, _babylon, _math, _MeshHelper, _Sim, _DataContainer) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Config2 = _interopRequireDefault(_Config);

  var _babylon2 = _interopRequireDefault(_babylon);

  var _MeshHelper2 = _interopRequireDefault(_MeshHelper);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _DataContainer2 = _interopRequireDefault(_DataContainer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var ExperimentScene = (function () {
    function ExperimentScene(scene, mat_agent, mesh_world, mesh_agent, mat_wireframe) {
      _classCallCheck(this, ExperimentScene);

      this.scene = scene;
      this.mat_agent = mat_agent;
      this.mesh_world = mesh_world;
      this.mesh_agent = mesh_agent;
      this.mat_wireframe = mat_wireframe;
      this.agent_keyframes = null;
    }

    _createClass(ExperimentScene, [{
      key: 'addKeyAgents',
      value: function addKeyAgents(sims, model) {
        var _this = this;

        this.agent_keyframes = new _MeshHelper2.default.CompoundMesh("agent_keyframes", this.scene, sims.map(function (sim, index) {
          var m = _MeshHelper2.default.meshFromOBoxList('agent_keyframes_items_' + index, _this.scene, model.agentBoxes, function (m) {
            m.material = _this.mat_wireframe;
          });

          _MeshHelper2.default.applyTransform(m, sim);

          return m;
        }));
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        this.scene.dispose();
      }
    }]);

    return ExperimentScene;
  })();

  function createScene(canvas, engine, model, experiment) {
    var scene = new _babylon2.default.Scene(engine);
    scene.clearColor = new _babylon2.default.Color3(0.7, 0.9, 1);
    var camera = new _babylon2.default.FreeCamera("camera1", new _babylon2.default.Vector3(0, 4, -8), scene);
    camera.speed = 0.4;
    camera.minZ = 1;
    camera.maxZ = 1000;
    camera.fov = 100 * _math.DEG_TO_RAD;
    camera.setTarget(_babylon2.default.Vector3.Zero());
    camera.attachControl(canvas, false);
    var light_dir = new _babylon2.default.DirectionalLight("dir01", new _babylon2.default.Vector3(-1, -2, -1), scene);
    light_dir.position = new _babylon2.default.Vector3(20, 40, 20);
    light_dir.intensity = .5;
    var light_sphere = new _babylon2.default.HemisphericLight("light1", new _babylon2.default.Vector3(0, 1, 0), scene);
    light_sphere.intensity = .3;
    light_sphere.diffuse = new _babylon2.default.Color3(0.95, 0.95, 0.95);
    light_sphere.specular = new _babylon2.default.Color3(0, 0, 0);
    light_sphere.groundColor = new _babylon2.default.Color3(0.5, 0.5, 0.5);
    var mat_agent = new _babylon2.default.StandardMaterial('mat_agent', scene);
    mat_agent.diffuseColor = new _babylon2.default.Color3(0.6, 0.9, 0.6);
    mat_agent.specularColor = new _babylon2.default.Color3(0, 0, 0);
    var mat_wireframe = new _babylon2.default.StandardMaterial("mat_wireframe", scene);
    mat_wireframe.diffuseColor = new _babylon2.default.Color3(1, 0.2, 0.2);
    mat_wireframe.specularColor = new _babylon2.default.Color3(0.5, 0.5, 0.5);
    mat_wireframe.wireframe = true;
    var mat_world = new _babylon2.default.StandardMaterial("mat_world", scene);
    mat_world.diffuseColor = new _babylon2.default.Color3(0.8, 0.6, 0.6);
    mat_world.specularColor = new _babylon2.default.Color3(0, 0, 0);
    var mat_ground = new _babylon2.default.StandardMaterial("mat_ground", scene);
    mat_ground.diffuseColor = new _babylon2.default.Color3(0.8, 0.8, 0.8);
    mat_ground.specularColor = new _babylon2.default.Color3(0, 0, 0);

    var mesh_agent = _MeshHelper2.default.meshFromOBoxList('agent', scene, model.agentBoxes, function (m) {
      return m.material = mat_agent;
    });

    var skybox = _babylon2.default.Mesh.CreateBox("skyBox", 500.0, scene);

    var skyboxMaterial = new _babylon2.default.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new _babylon2.default.CubeTexture("tex/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = _babylon2.default.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new _babylon2.default.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new _babylon2.default.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;

    var ground = _babylon2.default.Mesh.CreateGround("ground", 30, 30, 2, scene);

    ground.position.y = -5;
    ground.material = mat_ground;
    var shadowGenerator = new _babylon2.default.ShadowGenerator(1024, light_dir);
    shadowGenerator.usePoissonSampling = true;
    var allObjects = [];

    var mesh_world = _MeshHelper2.default.meshFromOBoxList('world', scene, model.worldBoxes, function (b) {
      return b.material = mat_world;
    });

    var shadowCasters = shadowGenerator.getShadowMap().renderList;
    allObjects.push.apply(allObjects, _toConsumableArray(mesh_agent.my_children));
    allObjects.push.apply(allObjects, _toConsumableArray(mesh_world.my_children));
    shadowCasters.push.apply(shadowCasters, allObjects);
    var tree_world = null;

    if (_Config2.default.SHOW3D_TREE_PART) {
      tree_world = _MeshHelper2.default.meshFromOBoxTreePart('tree_world', scene, experiment.sampler.worldTree, true, function (mesh, node) {
        return mesh.material = mat_wireframe;
      });
    }

    [ground].concat(allObjects).forEach(function (m) {
      m.receiveShadows = true;
    });
    return new ExperimentScene(scene, mat_agent, mesh_world, mesh_agent, mat_wireframe);
  }

  var BabylonVisual = (function () {
    function BabylonVisual(canvas, experiment, viewmodel) {
      _classCallCheck(this, BabylonVisual);

      this.canvas = canvas;
      this.experiment = experiment;
      this.scene = null;
      this.engine = null;
      this.startTime = 0;
      this.temp_sim = _Sim2.default.create();
      this.solution_loop_time = 7500;
      this.viewmodel = viewmodel;

      viewmodel.onData = function (data) {
        _DataContainer2.default.appendDataToTable(data);
      };
    }

    _createClass(BabylonVisual, [{
      key: 'init',
      value: function init(timestamp) {
        this.engine = new _babylon2.default.Engine(this.canvas, true);
        this.scene = createScene(this.canvas, this.engine, this.experiment.model, this.experiment);
        this.startTime = timestamp;
      }
    }, {
      key: 'run',
      value: function run(fn) {
        this.engine.runRenderLoop(fn);
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        this.scene.dispose();
        this.engine.dispose();
        this.scene = null;
        this.engine = null;
      }
    }, {
      key: '_preprocess_render',
      value: function _preprocess_render(model, time) {
        if (model.has_solution) {
          if (!this.scene.agent_keyframes) {
            this.scene.addKeyAgents(model.solution_keyframes, this.experiment.model);
          }

          model.solutionLerpTo(this.temp_sim, time * 0.001);

          _MeshHelper2.default.applyTransform(this.scene.mesh_agent, this.temp_sim);
        } else {
          _MeshHelper2.default.applyTransform(this.scene.mesh_agent, model.agent_transform);
        }
      }
    }, {
      key: '_do_render',
      value: function _do_render(model, time) {
        _DataContainer2.default.setCurrentData(model.shown_measurement);

        this.scene.scene.render();
      }
    }, {
      key: 'render',
      value: function render(timestamp) {
        var time = timestamp - this.startTime;

        this._preprocess_render(this.viewmodel, time);

        this._do_render(this.viewmodel, time);
      }
    }]);

    return BabylonVisual;
  })();

  exports.default = BabylonVisual;
});

'use strict';

define('/experiments_new/visual/VisualModel3D', ['exports', '/entry/Config', '/math/Sim3', '/utils/lists', '/entry/AnimationHelper', '/utils/MeasureHelper'], function (exports, _Config, _Sim, _lists, _AnimationHelper, _MeasureHelper) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Config2 = _interopRequireDefault(_Config);

  var _Sim2 = _interopRequireDefault(_Sim);

  var _lists2 = _interopRequireDefault(_lists);

  var _AnimationHelper2 = _interopRequireDefault(_AnimationHelper);

  var _MeasureHelper2 = _interopRequireDefault(_MeasureHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  function last(arr) {
    return arr[arr.length - 1];
  }

  function _solutionLerpTo(toSim, experiment, tempConf, solution, time) {
    var solution_path = solution.path;
    var animationTotal = last(solution_path).cost;

    _AnimationHelper2.default.process_animation_at(tempConf, time % (animationTotal + 1), solution, experiment.Configuration);

    experiment.Configuration.to_sim3(toSim, tempConf);
    return toSim;
  }

  var VisualModel3D = (function () {
    function VisualModel3D(experiment, Algorithm, measuring) {
      var _this = this;

      _classCallCheck(this, VisualModel3D);

      this.experiment = experiment;
      this.Algorithm = Algorithm;
      this.solver = new this.Algorithm(this.experiment);
      this.agent_transform = _Sim2.default.create();
      this.temp_sim = _Sim2.default.create();
      this.temp_configuration = this.experiment.Configuration.create();
      this._iterations = 5;
      this.iterations_time = _Config2.default.FRAME_TIME;
      this.solution = null;
      this.solution_keyframes = null;
      this.solution_keyframe_count = _Config2.default.SHOW3D_SOLUTION_KEYFRAME_COUNT;
      this.has_solution = false;
      this.solution_length = 0;
      this.onData = null;
      this.measurer = new _MeasureHelper2.default(function () {
        return _this._measure();
      });
      this.current_measure = this.measurer.start();
      this.measuring = measuring;
      this.shown_measurement = {
        time: 0,
        samples: 0,
        storage: 0
      };
    }

    _createClass(VisualModel3D, [{
      key: 'restart',
      value: function restart() {
        this.solution = null;
        this.solution_length = 0;
        this.solution_keyframes = null;
        this.has_solution = false;
        this.solver = new this.Algorithm(this.experiment);
        this.experiment.sampler.restart();
        this.current_measure = this.measurer.start();
      }
    }, {
      key: '_measure',
      value: function _measure() {
        return {
          samples: this.experiment.sampler.getSampleCount(),
          storage: this.solver.samples.length,
          cost: this.solution ? this.solution.cost : 0
        };
      }
    }, {
      key: '_iterate',
      value: function _iterate() {
        var mark = Date.now() + this.iterations_time;

        while (!this.solver.hasSolution) {
          this.solver.iterate(this._iterations);
          if (Date.now() >= mark) break;
        }
      }
    }, {
      key: 'update',
      value: function update() {
        if (!this.has_solution) {
          if (this.measuring && this.current_measure.timespan() > _Config2.default.MEASURE_SOLVING_TIMEOUT) {
            this._emit(this.current_measure.endTimeout());

            this.restart();
          } else {
            this._iterate();

            this.current_measure.inspectTo(this.shown_measurement);

            if (this.solver.hasSolution) {
              this._processSolution(this.solver.getSolution());
            } else {
              if (this.solver.conf_trial) {
                this.experiment.Configuration.to_sim3(this.agent_transform, this.solver.conf_trial);
              }
            }
          }
        }
      }
    }, {
      key: '_emit',
      value: function _emit(data) {
        if (this.onData) this.onData(data);
      }
    }, {
      key: '_processSolution',
      value: function _processSolution(solution) {
        var _this2 = this;

        this.solution = solution;

        if (this.measuring) {
          this._emit(this.current_measure.end());

          this.restart();
        } else {
          (function () {
            var COUNT = _this2.solution_keyframe_count;
            var FULL_TIME = solution.path[solution.path.length - 1].cost;
            _this2.solution_keyframes = _lists2.default.generate(COUNT, function (i) {
              return _solutionLerpTo(_Sim2.default.create(), _this2.experiment, _this2.temp_configuration, solution, i * FULL_TIME / (COUNT - 1));
            });
            _this2.has_solution = true;
            _this2.solution_length = solution.path.length - 1;
          })();
        }
      }
    }, {
      key: 'solutionLerpTo',
      value: function solutionLerpTo(toSim, time) {
        return _solutionLerpTo(toSim, this.experiment, this.temp_configuration, this.solution, time);
      }
    }]);

    return VisualModel3D;
  })();

  exports.default = VisualModel3D;
  ;
});




'use strict';

define('/experiments_old/collision/obb2/Obb2', ['exports', '/math/Vec2', '/math/Sim2'], function (exports, _Vec, _Sim) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Sim2 = _interopRequireDefault(_Sim);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _Math = Math;
  var max = _Math.max;
  var min = _Math.min;

  var TEMP_TEMP = _Vec2.default.array(10);

  var TEMP_VERTICES1 = TEMP_TEMP.slice(0, 4);
  var TEMP_VERTICES2 = TEMP_TEMP.slice(4, 8);
  var TEMP_VEC1 = TEMP_TEMP[8];
  var TEMP_VEC2 = TEMP_TEMP[9];

  function Obb2() {
    var arr = new Float32Array(6);
    this._buffer = arr;
    this.hsize = arr.subarray(0, 2);
    this.placement = arr.subarray(2, 6);
  }

  function vertices(_this, output) {
    var placement = _this.placement;
    var hsize = _this.hsize;
    var hw = hsize[0],
        hh = hsize[1];
    help(output[0], hw, hh);
    help(output[1], hw, -hh);
    help(output[2], -hw, -hh);
    help(output[3], -hw, hh);
    return _this;

    function help(v, px, py) {
      _Sim2.default.transform(_Vec2.default.setXY(v, px, py), placement);
    }
  }

  function set(output, other) {
    output._buffer.set(other._buffer, 0);

    return output;
  }

  function transform_(output, what, sim) {
    _Sim2.default.mul_(output.placement, what.placement, sim);

    _Vec2.default.set(output.hsize, what.hsize);

    return output;
  }

  function transform(what, sim) {
    return transform_(what, what, sim);
  }

  function dotvxy(point, dx, dy) {
    return point[0] * dx + point[1] * dy;
  }

  function wrapAll(_this, list, dir) {
    var min1 = 0,
        max1 = 0,
        min2 = 0,
        max2 = 0;
    var i,
        j,
        jitem,
        v1,
        v2,
        first = true;

    _Vec2.default.set(TEMP_VEC1, dir);

    _Vec2.default.right_(TEMP_VEC2, dir);

    for (i = 0; i < list.length; ++i) {
      vertices(list[i], TEMP_VERTICES1);

      for (j = 0; j < TEMP_VERTICES1.length; ++j) {
        jitem = TEMP_VERTICES1[j];
        v1 = _Vec2.default.dot(jitem, TEMP_VEC1);
        v2 = _Vec2.default.dot(jitem, TEMP_VEC2);

        if (first) {
          min1 = max1 = v1;
          min2 = max2 = v2;
          first = false;
        } else {
          min1 = min(min1, v1);
          max1 = max(max1, v1);
          min2 = min(min2, v2);
          max2 = max(max2, v2);
        }
      }
    }

    var mid1 = 0.5 * (min1 + max1),
        mid2 = 0.5 * (min2 + max2);
    _this.hsize[0] = 0.5 * (max1 - min1);
    _this.hsize[1] = 0.5 * (max2 - min2);
    _this.placement[0] = TEMP_VEC1[0];
    _this.placement[1] = TEMP_VEC1[1];

    _Vec2.default.cmul(_Vec2.default.setXY(TEMP_VEC2, mid1, mid2), TEMP_VEC1);

    _this.placement[2] = TEMP_VEC2[0];
    _this.placement[3] = TEMP_VEC2[1];
  }

  function penetrationByDir(points1, points2, dx, dy) {
    var min1, max1, min2, max2, i, curr;
    min1 = max1 = dotvxy(points1[0], dx, dy);

    for (i = 1; i < points1.length; ++i) {
      curr = dotvxy(points1[i], dx, dy);
      min1 = min(min1, curr);
      max1 = max(max1, curr);
    }

    min2 = max2 = dotvxy(points2[0], dx, dy);

    for (i = 1; i < points2.length; ++i) {
      curr = dotvxy(points2[i], dx, dy);
      min2 = min(min2, curr);
      max2 = max(max2, curr);
    }

    return min(max1 - min2, max2 - min1);
  }

  function min4(a, b, c, d) {
    return min(min(a, b), min(c, d));
  }

  function penetration(a, b) {
    vertices(a, TEMP_VERTICES1);
    vertices(b, TEMP_VERTICES2);
    var ap = a.placement,
        bp = b.placement;
    var ax = ap[0],
        ay = ap[1],
        bx = bp[0],
        by = bp[1];
    return min4(penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2, ax, ay), penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2, -ay, ax), penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2, bx, by), penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2, -by, bx));
  }

  function collide(a, b) {
    return penetration(a, b) >= 0;
  }

  function create(hw, hh, x, y, a) {
    var res = new Obb2();

    _Vec2.default.setXY(res.hsize, hw, hh);

    _Sim2.default.setXYA(res.placement, x, y, a);

    return res;
  }

  Obb2.create = create;
  Obb2.penetration = penetration;
  Obb2.collide = collide;
  Obb2.transform_ = transform_;
  Obb2.transform = transform;
  Obb2.set = set;
  Obb2.vertices = vertices;
  Obb2.wrapAll = wrapAll;
  exports.default = Obb2;
});

'use strict';

define('/experiments_old/collision/obb2/Obb2Tree', ['exports', '/math/Sim2', '/math/Vec2', '/experiments_old/collision/obb2/Obb2'], function (exports, _Sim, _Vec, _Obb) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Obb2 = _interopRequireDefault(_Obb);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var TEMP_OBOX = new _Obb2.default();

  function Obb2Tree() {
    this.box = new _Obb2.default();
    this.area = 0;
    this.children = null;
    this.leafCount = 0;
  }

  Obb2Tree.prototype.isLeaf = function _BoxTree_isLeaf() {
    return !this.children || this.children.length === 0;
  };

  Obb2Tree.prototype.process = function _BoxTree_process() {
    var box = this.box;
    var hsize = box.hsize;
    var leafCount = 0;

    if (this.children) {
      this.children.forEach(function (c) {
        leafCount += c.leafCount;
      });
    } else {
      leafCount = 1;
    }

    this.leafCount = leafCount;
    this.area = 4 * hsize[0] * hsize[1] * _Sim2.default.det(box.placement);
  };

  function collidesShallow(node1, node2, node2sim) {
    _Obb2.default.transform_(TEMP_OBOX, node2.box, node2sim);

    return _Obb2.default.collide(node1.box, TEMP_OBOX);
  }

  function collides(node1, node2, node2sim, inspectCb) {
    function bound(node1, node2) {
      if (!collidesShallow(node1, node2, node2sim)) return false;
      var disc = node1.area > node2.area ? 0 : 4;
      if (node1.isLeaf()) disc += 1;
      if (node2.isLeaf()) disc += 2;

      switch (disc) {
        case 0:
        case 2:
        case 6:
          return node1.children.some(bound2);

        case 1:
        case 4:
        case 5:
          return node2.children.some(bound1);

        case 3:
        case 7:
          return true;
      }

      function bound1(node2) {
        var res = bound(node1, node2);
        if (inspectCb) inspectCb(node2, 2, res);
        return res;
      }

      function bound2(node1) {
        var res = bound(node1, node2);
        if (inspectCb) inspectCb(node1, 1, res);
        return res;
      }
    }

    var res = bound(node1, node2);

    if (inspectCb) {
      inspectCb(node1, 1, res);
      inspectCb(node2, 2, res);
    }

    return res;
  }

  function boxOf(x) {
    return x.box;
  }

  function copyArr(a) {
    return a && a.slice(0);
  }

  function wrap(list, orientation, children) {
    var result = new Obb2Tree();
    result.children = copyArr(children || list);

    _Obb2.default.wrapAll(result.box, list.map(boxOf), orientation);

    result.process();
    return result;
  }

  Obb2Tree.collides = collides;
  Obb2Tree.wrap = wrap;

  Obb2Tree.prototype.collides = function (node2, node2sim) {
    return collides(this, node2, node2sim);
  };

  exports.default = Obb2Tree;
});

'use strict';

define('/experiments_old/collision/obb2/Obb2TreeBuilder', ['exports', '/math/Sim2', '/math/Vec2', '/experiments_old/collision/obb2/Obb2Tree', '/experiments_old/collision/obb2/Obb2'], function (exports, _Sim, _Vec, _Obb2Tree, _Obb) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Vec2 = _interopRequireDefault(_Vec);

  var _Obb2Tree2 = _interopRequireDefault(_Obb2Tree);

  var _Obb2 = _interopRequireDefault(_Obb);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var DIRARR = halfcircle(8);

  function halfcircle(slices) {
    var flts = new Float32Array(2 * slices);
    var res = [],
        a,
        i,
        j;

    for (i = 0, j = 0; i < slices; ++i, j += 2) {
      a = i * Math.PI / slices;
      flts[j] = Math.cos(a);
      flts[j + 1] = Math.sin(a);
      res.push(flts.subarray(j, j + 2));
    }

    return res;
  }

  function stratBy(list, by, strat) {
    if (list && list.length > 0) {
      var val = by(list[0]),
          item = list[0];

      for (var i = 1; i < list.length; i++) {
        var currItem = list[i];
        var currVal = by(currItem);

        if (strat(currVal, val)) {
          val = currVal;
          item = currItem;
        }
      }

      return item;
    }
  }

  function greater(a, b) {
    return a > b;
  }

  function smaller(a, b) {
    return a < b;
  }

  function maxBy(list, by) {
    return stratBy(list, by, greater);
  }

  function minBy(list, by) {
    return stratBy(list, by, smaller);
  }

  function nonEmpty(arr) {
    return arr && arr.length > 0;
  }

  function measure(separated) {
    if (separated && nonEmpty(separated[0]) && nonEmpty(separated[1])) {
      var dir = separated[2];

      var node1 = _Obb2Tree2.default.wrap(separated[0], dir);

      var node2 = _Obb2Tree2.default.wrap(separated[1], dir);

      var score = -_Obb2.default.penetration(node1.box, node2.box);
      return {
        score: score,
        node1: node1,
        node2: node2,
        dir: dir
      };
    }
  }

  function fromList(list) {
    var allLeaves = list.map(function (item) {
      var res = new _Obb2Tree2.default();

      _Obb2.default.set(res.box, item);

      res.process();
      return res;
    });

    function recurse(list) {
      if (!nonEmpty(list)) throw new Error('cant build tree from an empty list');

      if (list.length < 2) {
        return list[0];
      } else {
        var best = maxBy(DIRARR.map(function (dir) {
          return splitByDir(list, dir);
        }).map(measure).filter(boolify), scoreOf);

        if (best) {
          return _Obb2Tree2.default.wrap(list, best.dir, [recurse(best.node1.children), recurse(best.node2.children)]);
        } else {
          return minBy(DIRARR.map(function (dir) {
            return _Obb2Tree2.default.wrap(list, dir);
          }), areaOf);
        }
      }
    }

    return recurse(allLeaves);

    function scoreOf(x) {
      return x.score;
    }

    function areaOf(x) {
      return x.area;
    }

    function boolify(x) {
      return !!x;
    }
  }

  function dotSimilarTranslation(simi, dir) {
    return simi[2] * dir[0] + simi[3] * dir[1];
  }

  function compare(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  function byValue(a, b) {
    return compare(a.value, b.value);
  }

  function nodeOf(x) {
    return x.node;
  }

  function splitByDir(nodes, dir) {
    if (nodes && nodes.length > 1) {
      nodes = nodes.map(function (node) {
        return {
          value: dotSimilarTranslation(node.box.placement, dir),
          node: node
        };
      });
      nodes.sort(byValue);
      nodes = nodes.map(nodeOf);
      var mid = nodes.length >> 1;
      return [nodes.slice(0, mid), nodes.slice(mid), dir];
    }
  }

  exports.default = {
    fromList: fromList
  };
});



'use strict';

define('/experiments_old/experiment/arm/ArmConfig', ['exports', '/math/Sim2', '/math/VecN'], function (exports, _Sim, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (SEGMENTS, SEGMENT_SIZE) {

    var SIMILAR_INIT = _Sim2.default.create();
    _Sim2.default.setXYA(SIMILAR_INIT, 0, -10, 0);
    var SIMILAR_TEMP = _Sim2.default.create();
    var SIMILAR_TEMP2 = _Sim2.default.create();

    function create() {
      return new Float64Array(SEGMENTS);
    }

    function loadModel(config, model) {
      var agents = model.agents;
      return loadView(indexer, config);
      function indexer(i) {
        return i < 0 ? null : agents[i].placement;
      }
    }

    function loadSample(simil, config) {
      return loadView(indexer, config);
      function indexer(i) {
        return i < 0 ? simil : null;
      }
    }

    function loadView(indexer, config) {
      _Sim2.default.set(SIMILAR_TEMP, SIMILAR_INIT);
      var tmp;
      for (var i = 0; i < SEGMENTS; i++) {
        _Sim2.default.setRotateA(SIMILAR_TEMP2, config[i]);
        _Sim2.default.mul_(SIMILAR_TEMP, SIMILAR_TEMP2, SIMILAR_TEMP);
        tmp = indexer(i);
        if (tmp) _Sim2.default.set(tmp, SIMILAR_TEMP);

        _Sim2.default.setTranslateXY(SIMILAR_TEMP2, 0, SEGMENT_SIZE);
        _Sim2.default.mul_(SIMILAR_TEMP, SIMILAR_TEMP2, SIMILAR_TEMP);
      }
      tmp = indexer(-1);
      if (tmp) _Sim2.default.set(tmp, SIMILAR_TEMP);
      return config;
    }

    function rspan(x) {
      return (Math.random() * 2 - 1) * x;
    }

    function rint(a, b) {
      return Math.random() * (b - a) + a;
    }

    function lerpTo(to, a, b, t) {
      var it = 1 - t;
      for (var i = 0; i < SEGMENTS; i++) {
        to[i] = a[i] * it + b[i] * t;
      }
      return to;
    }

    function lerp(a, b, t) {
      var to = arguments.length <= 3 || arguments[3] === undefined ? create() : arguments[3];

      return lerpTo(to, a, b, t);
    }

    function randomize(config, nbox) {
      for (var i = 0; i < SEGMENTS; i++) {
        config[i] = rint(nbox.min[i], nbox.max[i]);
      }
      return config;
    }

    function make(angle) {
      var result = create();
      for (var i = 0; i < result.length; i++) {
        result[i] = angle;
      }return result;
    }

    function initial() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];

      return config;
    }

    return {
      initial: initial, create: create, randomize: randomize,
      copy: _VecN2.default.copy, copyTo: _VecN2.default.copyTo,
      lerp: lerp, lerpTo: lerpTo,
      dist: _VecN2.default.dist, dist2: _VecN2.default.dist2,

      loadModel: loadModel, loadSample: loadSample, loadView: loadView, make: make
    };
  };

  var _Sim2 = _interopRequireDefault(_Sim);

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});

'use strict';

define('/experiments_old/experiment/arm/ArmExperiment12', ['exports', '/experiments_old/experiment/arm/ArmExperimentT'], function (exports, _ArmExperimentT) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ArmExperiment12;

  var _ArmExperimentT2 = _interopRequireDefault(_ArmExperimentT);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ArmExperiment12() {
    _ArmExperimentT2.default.call(this, 12, 5);
  }

  ;
});

'use strict';

define('/experiments_old/experiment/arm/ArmExperiment4', ['exports', '/experiments_old/experiment/arm/ArmExperimentT'], function (exports, _ArmExperimentT) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ArmExperiment4;

  var _ArmExperimentT2 = _interopRequireDefault(_ArmExperimentT);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ArmExperiment4() {
    _ArmExperimentT2.default.call(this, 4, 8);
  }

  ;
});

'use strict';

define('/experiments_old/experiment/arm/ArmExperiment6', ['exports', '/experiments_old/experiment/arm/ArmExperimentT'], function (exports, _ArmExperimentT) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ArmExperiment5;

  var _ArmExperimentT2 = _interopRequireDefault(_ArmExperimentT);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ArmExperiment5() {
    _ArmExperimentT2.default.call(this, 6, 6);
  }

  ;
});

'use strict';

define('/experiments_old/experiment/arm/ArmExperimentT', ['exports', '/experiments_old/experiment/arm/ArmConfig', '/experiments_old/experiment/arm/ArmInput', '/experiments_old/experiment/arm/ArmWorld', '/math/NBox', '/experiments_old/experiment/common/PianoSampler', '/utils/utils'], function (exports, _ArmConfig, _ArmInput, _ArmWorld, _NBox, _PianoSampler, _utils) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ArmConfig2 = _interopRequireDefault(_ArmConfig);

  var _ArmInput2 = _interopRequireDefault(_ArmInput);

  var _ArmWorld2 = _interopRequireDefault(_ArmWorld);

  var _NBox2 = _interopRequireDefault(_NBox);

  var _PianoSampler2 = _interopRequireDefault(_PianoSampler);

  var _utils2 = _interopRequireDefault(_utils);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ArmExperiment(SEGMENTS, SEGMENT_SIZE) {
    var World = (0, _ArmWorld2.default)(SEGMENTS, SEGMENT_SIZE);
    var Config = (0, _ArmConfig2.default)(SEGMENTS, SEGMENT_SIZE);
    var Input = (0, _ArmInput2.default)(SEGMENTS, SEGMENT_SIZE);
    this.model = World;
    this.sampler = new _PianoSampler2.default(World, Config);
    this.storeResolutionMin = 0.10;
    this.storeResolutionMax = 0.20;
    this.storeResolutionGradient = 0.2;
    this.checkResolution = 0.05;
    this.connectDistance = 0.40;
    this.targetDistance = 0.20;
    this.sampleBounds = new _NBox2.default(_utils2.default.times(SEGMENTS, -1), _utils2.default.times(SEGMENTS, 1));
    this.start = Config.make(-1);
    this.target = Config.make(1);
    this.Configuration = Config;
    this.ConfigurationInput = Input;
    this.World = World;
  }

  exports.default = ArmExperiment;
});

"use strict";

define("/experiments_old/experiment/arm/ArmInput", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (SEGMENTS) {

    function rspan(x) {
      return (Math.random() * 2 - 1) * x;
    }

    function randomize(inp) {
      for (var i = 0; i < SEGMENTS; i++) {
        inp[i] = rspan(1.0);
      }
    }

    function applyTo(to, config, inp) {
      for (var i = 0; i < SEGMENTS; i++) {
        to[i] = config[i] + DT * inp[i];
      }return to;
    }

    function applyIP(config, inp) {
      return applyTo(config, config, inp);
    }

    function create() {
      return new Float64Array(SEGMENTS);
    }

    function costOf(inp) {
      return DT;
    }
    return {
      create: create, randomize: randomize,
      applyIP: applyIP, applyTo: applyTo,
      costOf: costOf
    };
  };

  var DT = 0.3;
});

'use strict';

define('/experiments_old/experiment/arm/ArmWorld', ['exports', '/utils/utils'], function (exports, _utils) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (SEGMENTS, SEGMENT_SIZE) {
    var HALF_SEGMENT_SIZE = SEGMENT_SIZE / 2;
    var SHAPE_WALLS = [{ size: [5, 10], pos: [0, 20], angle: 0 }, { size: [2, 2], pos: [-20, 0], angle: 0 }];

    var SHAPE_SEGMENT = [{ size: [1.5, HALF_SEGMENT_SIZE], pos: [0, HALF_SEGMENT_SIZE], angle: 0 }];

    return {
      walls: SHAPE_WALLS,
      agents: _utils2.default.times(SEGMENTS, SHAPE_SEGMENT),
      hsize: [60, 40]
    };
  };

  var _utils2 = _interopRequireDefault(_utils);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});


'use strict';

define('/experiments_old/experiment/common/PianoModel', ['exports', '/math/Sim2', '/experiments_old/collision/obb2/Obb2TreeBuilder', '/experiments_old/collision/obb2/Obb2'], function (exports, _Sim, _Obb2TreeBuilder, _Obb) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Sim2 = _interopRequireDefault(_Sim);

  var _Obb2TreeBuilder2 = _interopRequireDefault(_Obb2TreeBuilder);

  var _Obb2 = _interopRequireDefault(_Obb);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function defToOBox(def) {
    return _Obb2.default.create(def.size[0], def.size[1], def.pos[0], def.pos[1], def.angle);
  }

  function Agent(def) {
    this.placement = _Sim2.default.create();
    this.tree = _Obb2TreeBuilder2.default.fromList(def.map(defToOBox));
  }

  function newAgent(def) {
    return new Agent(def);
  }

  function PianoModel(def) {
    this.definition = def;
    this.wallsTree = _Obb2TreeBuilder2.default.fromList(def.walls.map(defToOBox));
    this.agents = def.agents.map(newAgent);
    this.reset();
  }

  PianoModel.prototype.reset = function reset() {
    this.agents.forEach(function (agent) {
      _Sim2.default.setIdentity(agent.placement);
    });
  };

  PianoModel.prototype.isValid = function isValid() {
    var walls = this.wallsTree;
    return this.agents.some(function (agent) {
      return walls.collides(agent.tree, agent.placement);
    });
  };

  exports.default = PianoModel;
});

'use strict';

define('/experiments_old/experiment/common/PianoSampler', ['exports', '/experiments_old/experiment/common/PianoModel'], function (exports, _PianoModel) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _PianoModel2 = _interopRequireDefault(_PianoModel);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var PianoSampler = (function () {
    function PianoSampler(model, config) {
      _classCallCheck(this, PianoSampler);

      this.config = config;
      this.model = new _PianoModel2.default(model);
      this.samplesTook = 0;
    }

    _createClass(PianoSampler, [{
      key: 'restart',
      value: function restart() {
        this.samplesTook = 0;
      }
    }, {
      key: 'sample',
      value: function sample(dot) {
        var model = this.model;
        this.samplesTook++;
        this.config.loadModel(dot, model);
        return model.isValid();
      }
    }, {
      key: 'getSampleCount',
      value: function getSampleCount() {
        return this.samplesTook;
      }
    }]);

    return PianoSampler;
  })();

  exports.default = PianoSampler;
});


'use strict';

define('/experiments_old/experiment/curved_piano/CurvedPianoConfig', ['exports', '/math/Sim2', '/math/VecN'], function (exports, _Sim, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Sim2 = _interopRequireDefault(_Sim);

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var DT = 0.2;
  var TWO_PI = Math.PI * 2;

  function create() {
    return new Float64Array(4);
  }

  function make(px, py, acos, asin) {
    var result = create();
    result[0] = px;
    result[1] = py;
    result[2] = acos;
    result[3] = asin;
    return result;
  }

  function loadModel(config, model) {
    return loadView(indexer, config);

    function indexer() {
      return model.agents[0].placement;
    }
  }

  function loadSample(simil, config) {
    return loadView(indexer, config);

    function indexer() {
      return simil;
    }
  }

  function loadView(indexer, config) {
    var tmp = indexer(0);

    if (tmp) {
      _Sim2.default.setXYCS(tmp, config[0] * 10, config[1] * 10, config[2], config[3]);
    }

    return config;
  }

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }

  function rint(a, b) {
    return Math.random() * (b - a) + a;
  }

  function lerpTo(to, a, b, t) {
    var it = 1 - t;
    var omega = Math.acos(a[2] * b[2] + a[3] * b[3]);
    var sinOmega = Math.sin(omega);
    var sinO1 = Math.sin(it * omega) / sinOmega;
    var sinO2 = Math.sin(t * omega) / sinOmega;
    to[0] = a[0] * it + b[0] * t;
    to[1] = a[1] * it + b[1] * t;
    to[2] = sinO1 * a[2] + sinO2 * b[2];
    to[3] = sinO1 * a[3] + sinO2 * b[3];
  }

  function lerp(a, b, t) {
    var to = arguments.length <= 3 || arguments[3] === undefined ? create() : arguments[3];
    return lerpTo(to, a, b, t);
  }

  function randomize(config, nbox) {
    config[0] = rint(nbox.min[0], nbox.max[0]);
    config[1] = rint(nbox.min[1], nbox.max[1]);
    var a = Math.random() * TWO_PI;
    config[2] = Math.cos(a);
    config[3] = Math.sin(a);
    return config;
  }

  function initial() {
    var to = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];
    to[0] = 0;
    return to;
  }

  exports.default = {
    initial: initial, create: create, randomize: randomize,
    copy: _VecN2.default.copy, copyTo: _VecN2.default.copyTo,
    lerp: lerp, lerpTo: lerpTo,
    dist: _VecN2.default.dist, dist2: _VecN2.default.dist2,

    loadModel: loadModel, loadView: loadView, loadSample: loadSample, make: make
  };
});

'use strict';

define('/experiments_old/experiment/curved_piano/CurvedPianoExperiment', ['exports', '/math/NBox', '/experiments_old/experiment/curved_piano/CurvedPianoConfig', '/experiments_old/experiment/curved_piano/CurvedPianoInput', '/experiments_old/experiment/curved_piano/CurvedWorld', '/experiments_old/experiment/common/PianoSampler'], function (exports, _NBox, _CurvedPianoConfig, _CurvedPianoInput, _CurvedWorld, _PianoSampler) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _NBox2 = _interopRequireDefault(_NBox);

  var _CurvedPianoConfig2 = _interopRequireDefault(_CurvedPianoConfig);

  var _CurvedPianoInput2 = _interopRequireDefault(_CurvedPianoInput);

  var _CurvedWorld2 = _interopRequireDefault(_CurvedWorld);

  var _PianoSampler2 = _interopRequireDefault(_PianoSampler);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function CurvedPianoExperiment() {
    this.model = _CurvedWorld2.default;
    this.sampler = new _PianoSampler2.default(_CurvedWorld2.default, _CurvedPianoConfig2.default);
    this.storeResolutionMin = 0.05;
    this.storeResolutionMax = 0.15;
    this.storeResolutionGradient = 0.2;
    this.checkResolution = 0.05;
    this.connectDistance = 0.50;
    this.targetDistance = 0.30;
    this.sampleBounds = new _NBox2.default([-5, -4, -1.1, -1.1], [5, 4, 1.1, 1.1]);
    this.start = _CurvedPianoConfig2.default.make(-2.6, -2.0, 1, 0);
    this.target = _CurvedPianoConfig2.default.make(2.6, -2.0, 1, 0);
    this.Configuration = _CurvedPianoConfig2.default;
    this.ConfigurationInput = _CurvedPianoInput2.default;
  }

  exports.default = CurvedPianoExperiment;
});

'use strict';

define('/experiments_old/experiment/curved_piano/CurvedPianoInput', ['exports', '/math/VecN'], function (exports, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var DT = 0.2;
  var TWO_PI = Math.PI * 2;

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }

  function rint(a, b) {
    return Math.random() * (b - a) + a;
  }

  function randomize(inp) {
    inp[0] = rspan(1.0);
    inp[1] = rspan(1.0);
    inp[2] = rspan(1.0);
  }

  function applyTo(to, config, inp) {
    var a = inp[2] * DT;
    var sina = Math.sin(a),
        cosa = Math.cos(a);
    var newx = config[2] * cosa + config[3] * sina;
    var newy = -config[2] * sina + config[3] * cosa;
    to[2] = newx;
    to[3] = newy;
    to[0] = config[0] + inp[0] * DT;
    to[1] = config[1] + inp[1] * DT;
    return to;
  }

  function applyIP(config, inp) {
    return applyTo(config, config, inp);
  }

  function create() {
    return new Float64Array(3);
  }

  function lerp(to, a, b, t) {
    var it = 1 - t;
    var omega = Math.acos(a[2] * b[2] + a[3] * b[3]);
    var sinOmega = Math.sin(omega);
    var sinO1 = Math.sin(it * omega) / sinOmega;
    var sinO2 = Math.sin(t * omega) / sinOmega;
    to[0] = a[0] * it + b[0] * t;
    to[1] = a[1] * it + b[1] * t;
    to[2] = sinO1 * a[2] + sinO2 * b[2];
    to[3] = sinO1 * a[3] + sinO2 * b[3];
  }

  function costOf(inp) {
    return 0.2;
  }

  exports.default = {
    create: create, applyTo: applyTo, applyIP: applyIP, randomize: randomize, costOf: costOf
  };
});

"use strict";

define("/experiments_old/experiment/curved_piano/CurvedWorld", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function arc(sx, sy, radx, rady, px, py, startdeg, enddeg, slices) {
    var res = [];

    for (var i = 0; i < slices; ++i) {
      var a = (startdeg + (enddeg - startdeg) * i / (slices - 1)) / 180 * Math.PI;
      res.push({
        size: [sx, sy],
        pos: [Math.cos(a) * radx + px, Math.sin(a) * rady + py],
        angle: a
      });
    }

    return res;
  }

  var SHAPE_U = arc(1, 1.5, 22, 22, 0, -22, 75, 105, 5);
  var SHAPE_WALLS = [{
    size: [5, 30],
    pos: [-40, 0],
    angle: 0
  }, {
    size: [5, 30],
    pos: [40, 0],
    angle: 0
  }, {
    size: [40, 5],
    pos: [0, -30],
    angle: 0
  }, {
    size: [40, 5],
    pos: [0, 30],
    angle: 0
  }, {
    size: [2, 18],
    pos: [-15, -10.7],
    angle: 0
  }, {
    size: [2, 18],
    pos: [15, -10.7],
    angle: 0
  }, {
    size: [2, 5],
    pos: [-15, 20.5],
    angle: 0
  }, {
    size: [2, 5],
    pos: [15, 20.5],
    angle: 0
  }].concat(arc(2, 2, 26, 26, 0, -5, 62, 118, 9)).concat(arc(2, 2, 18, 18, 0, -5, 40, 140, 11));
  exports.default = {
    walls: SHAPE_WALLS,
    agents: [SHAPE_U]
    // start: { pos: [-26, -20], angle: 0 },
    // target: { pos: [26, -20], angle: 0 },
    // hsize: [60, 40]
  };
});


'use strict';

define('/experiments_old/experiment/parking/ParkingConfig', ['exports', '/math/Sim2', '/math/VecN'], function (exports, _Sim, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Sim2 = _interopRequireDefault(_Sim);

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var DT = 0.15;
  var TWO_PI = Math.PI * 2;
  var DEG_TO_RAD = Math.PI / 180;

  function create() {
    return _VecN2.default.create(4);
  }

  function loadModel(config, model) {
    return loadView(indexer, config);

    function indexer() {
      return model.agents[0].placement;
    }
  }

  function loadSample(simil, config) {
    return loadView(indexer, config);

    function indexer() {
      return simil;
    }
  }

  function loadView(indexer, config) {
    var placement = indexer(0);

    if (placement) {
      _Sim2.default.setXYCS(placement, config[0] * 10, config[1] * 10, config[2], config[3]);
    }

    return config;
  }

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }

  function rint(a, b) {
    return Math.random() * (b - a) + a;
  }

  function clamp(a, x) {
    if (a > x) return x;
    if (a < -x) return -x;
    return a;
  }

  function lerpTo(to, a, b, t) {
    var it = 1 - t;
    var omega = Math.acos(a[2] * b[2] + a[3] * b[3]);
    var sinOmega = Math.sin(omega);
    var sinO1 = Math.sin(it * omega) / sinOmega;
    var sinO2 = Math.sin(t * omega) / sinOmega;
    to[0] = a[0] * it + b[0] * t;
    to[1] = a[1] * it + b[1] * t;
    to[2] = sinO1 * a[2] + sinO2 * b[2];
    to[3] = sinO1 * a[3] + sinO2 * b[3];
    return to;
  }

  function lerp(a, b, t) {
    var to = arguments.length <= 3 || arguments[3] === undefined ? create() : arguments[3];
    return lerpTo(to, a, b, t);
  }

  function normalize(config) {
    var len = Math.sqrt(config[2] * config[2] + config[3] * config[3]);
    config[2] /= len;
    config[3] /= len;
    return config;
  }

  function randomize(config, nbox) {
    config[0] = rint(nbox.min[0], nbox.max[0]);
    config[1] = rint(nbox.min[1], nbox.max[1]);
    var a = Math.random() * TWO_PI;
    config[2] = Math.cos(a);
    config[3] = Math.sin(a);
    return config;
  }

  function initial() {
    var to = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];
    return to;
  }

  function make(x, y, a) {
    var r = create();
    r[0] = x;
    r[1] = y;
    r[2] = Math.cos(a * DEG_TO_RAD);
    r[3] = Math.sin(a * DEG_TO_RAD);
    return r;
  }

  exports.default = {
    initial: initial, create: create, randomize: randomize,
    lerp: lerp, lerpTo: lerpTo,
    dist: _VecN2.default.dist,
    dist2: _VecN2.default.dist2,
    copy: _VecN2.default.copy,
    copyTo: _VecN2.default.copyTo,

    loadModel: loadModel, loadSample: loadSample, loadView: loadView, make: make
  };
});

'use strict';

define('/experiments_old/experiment/parking/ParkingExperiment', ['exports', '/math/NBox', '/experiments_old/experiment/common/PianoSampler', '/experiments_old/experiment/parking/ParkingConfig', '/experiments_old/experiment/parking/ParkingInput', '/experiments_old/experiment/parking/ParkingWorld'], function (exports, _NBox, _PianoSampler, _ParkingConfig, _ParkingInput, _ParkingWorld) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ParkingExperiment;

  var _NBox2 = _interopRequireDefault(_NBox);

  var _PianoSampler2 = _interopRequireDefault(_PianoSampler);

  var _ParkingConfig2 = _interopRequireDefault(_ParkingConfig);

  var _ParkingInput2 = _interopRequireDefault(_ParkingInput);

  var _ParkingWorld2 = _interopRequireDefault(_ParkingWorld);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var World = _ParkingWorld2.default;
  var Config = _ParkingConfig2.default;
  var Input = _ParkingInput2.default;
  var PARK_OUT = false;

  function ParkingExperiment() {
    this.model = World;
    this.sampler = new _PianoSampler2.default(World, Config);
    this.storeResolutionMin = 0.01;
    this.storeResolutionMax = 0.06;
    this.storeResolutionGradient = 0.2;
    this.checkResolution = 0.01;
    this.connectDistance = 0.12;
    this.targetDistance = 0.05;
    this.start = Config.make(0.2, -1.6, 0);
    this.target = Config.make(1.0, -0.4, 0);
    this.sampleBounds = new _NBox2.default([-0.6, -2.4, -1.1, -1.1], [1.2, 2.0, 1.1, 1.1]);

    if (PARK_OUT) {
      var temp = this.start;
      this.start = this.target;
      this.target = temp;
    }

    this.Configuration = Config;
    this.ConfigurationInput = Input;
  }
});

"use strict";

define("/experiments_old/experiment/parking/ParkingInput", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var DT = 0.15;

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }

  function randomize(inp) {
    inp[0] = rspan(1.0);
    inp[1] = rspan(1.5);
  }

  function applyTo(to, config, inp) {
    var dpos = inp[0] * DT;
    var a = dpos * inp[1];
    var sina = Math.sin(a),
        cosa = Math.cos(a);
    var nx = config[2] * cosa + config[3] * sina;
    var ny = -config[2] * sina + config[3] * cosa;
    to[0] = config[0] + dpos * config[3];
    to[1] = config[1] - dpos * config[2];
    to[2] = nx;
    to[3] = ny;
    return to;
  }

  function applyIP(config, inp) {
    return applyTo(config, config, inp);
  }

  function create() {
    return new Float64Array(2);
  }

  function costOf(inp) {
    return 0.25;
  }

  exports.default = {
    create: create, randomize: randomize, applyTo: applyTo, applyIP: applyIP, costOf: costOf
  };
});

"use strict";

define("/experiments_old/experiment/parking/ParkingWorld", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var SHAPE_CAR = [{
    size: [0.1, 0.6],
    pos: [2.0, 7.0],
    angle: 0
  }, {
    size: [0.1, 0.6],
    pos: [2.0, 1.0],
    angle: 0
  }, {
    size: [0.1, 0.6],
    pos: [-2.0, 7.0],
    angle: 0
  }, {
    size: [0.1, 0.6],
    pos: [-2.0, 1.0],
    angle: 0
  }, {
    size: [1.9, 4.0],
    pos: [0, 4.0],
    angle: 0
  }];
  var SHAPE_WALLS = [{
    size: [25, 30],
    pos: [-32, 0],
    angle: 0
  }, {
    size: [15, 30],
    pos: [28, 0],
    angle: 0
  }, {
    size: [40, 5],
    pos: [0, -30],
    angle: 0
  }, {
    size: [40, 10],
    pos: [0, 30],
    angle: 0
  }, {
    size: [2, 4],
    pos: [10, -20.0],
    angle: 0
  }, {
    size: [2, 4],
    pos: [10, -10.0],
    angle: 0
  }, {
    size: [2, 4],
    pos: [10, 10.0],
    angle: 0
  }, {
    size: [2, 4],
    pos: [10, 20.0],
    angle: 0
  }];
  exports.default = {
    walls: SHAPE_WALLS,
    agents: [SHAPE_CAR],
    start: { pos: [-5, -18], angle: 0 },
    target: { pos: [12, -2], angle: 0 },
    hsize: [60, 40]
  };
});


'use strict';

define('/experiments_old/experiment/parking_physics/PhParkingConfig', ['exports', '/math/Sim2', '/math/VecN'], function (exports, _Sim, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Sim2 = _interopRequireDefault(_Sim);

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var DT = 0.1;
  var TWO_PI = Math.PI * 2;
  var DEG_TO_RAD = Math.PI / 180;

  function create() {
    return new Float32Array(6);
  }

  function loadModel(config, model) {
    return loadView(indexer, config);

    function indexer() {
      return model.agents[0].placement;
    }
  }

  function loadSample(simil, config) {
    return loadView(indexer, config);

    function indexer() {
      return simil;
    }
  }

  function loadView(indexer, config) {
    var placement = indexer(0);

    if (placement) {
      _Sim2.default.setXYCS(placement, config[0] * 10, config[1] * 10, config[2], config[3]);
    }

    return config;
  }

  function rint(a, b) {
    return Math.random() * (b - a) + a;
  }

  function lerpTo(to, a, b, t) {
    var it = 1 - t;
    var omega = Math.acos(a[2] * b[2] + a[3] * b[3]);
    var sinOmega = Math.sin(omega);
    var sinO1 = Math.sin(it * omega) / sinOmega;
    var sinO2 = Math.sin(t * omega) / sinOmega;
    to[0] = a[0] * it + b[0] * t;
    to[1] = a[1] * it + b[1] * t;
    to[2] = sinO1 * a[2] + sinO2 * b[2];
    to[3] = sinO1 * a[3] + sinO2 * b[3];
    to[4] = a[4] * it + b[4] * t;
    to[5] = a[5] * it + b[5] * t;
    return to;
  }

  function lerp(a, b, t) {
    var to = arguments.length <= 3 || arguments[3] === undefined ? create() : arguments[3];
    return lerpTo(to, a, b, t);
  }

  function normalize(config) {
    var len = Math.sqrt(config[2] * config[2] + config[3] * config[3]);
    config[2] /= len;
    config[3] /= len;
    return config;
  }

  function randomize(config, nbox) {
    config[0] = rint(nbox.min[0], nbox.max[0]);
    config[1] = rint(nbox.min[1], nbox.max[1]);
    var a = Math.random() * TWO_PI;
    config[2] = Math.cos(a);
    config[3] = Math.sin(a);
    config[4] = rint(nbox.min[4], nbox.max[4]);
    config[5] = rint(nbox.min[5], nbox.max[5]);
    return config;
  }

  function initial() {
    var to = arguments.length <= 0 || arguments[0] === undefined ? create() : arguments[0];
    return to;
  }

  function make(x, y, a) {
    var r = create();
    r[0] = x;
    r[1] = y;
    r[2] = Math.cos(a * DEG_TO_RAD);
    r[3] = Math.sin(a * DEG_TO_RAD);
    r[4] = 0;
    r[5] = 0;
    return r;
  }

  exports.default = {
    initial: initial, create: create, randomize: randomize,
    copy: _VecN2.default.copy, copyTo: _VecN2.default.copyTo,
    lerp: lerp, lerpTo: lerpTo,
    dist: _VecN2.default.dist, dist2: _VecN2.default.dist2,

    loadModel: loadModel, loadSample: loadSample, loadView: loadView, make: make
  };
});

'use strict';

define('/experiments_old/experiment/parking_physics/PhParkingExperiment', ['exports', '/math/NBox', '/experiments_old/experiment/parking_physics/PhParkingConfig', '/experiments_old/experiment/parking/ParkingWorld', '/experiments_old/experiment/parking_physics/PhParkingInput', '/experiments_old/experiment/common/PianoSampler', '/math/VecN'], function (exports, _NBox, _PhParkingConfig, _ParkingWorld, _PhParkingInput, _PianoSampler, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = PhParkingExperiment;

  var _NBox2 = _interopRequireDefault(_NBox);

  var _PhParkingConfig2 = _interopRequireDefault(_PhParkingConfig);

  var _ParkingWorld2 = _interopRequireDefault(_ParkingWorld);

  var _PhParkingInput2 = _interopRequireDefault(_PhParkingInput);

  var _PianoSampler2 = _interopRequireDefault(_PianoSampler);

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var World = _ParkingWorld2.default;
  var Config = _PhParkingConfig2.default;
  var Input = _PhParkingInput2.default;

  function PhParkingExperiment() {
    this.model = World;
    this.sampler = new _PianoSampler2.default(World, Config);
    this.checkResolution = 0.10;
    this.storeResolutionMin = 0.06;
    this.storeResolutionMax = 0.50;
    this.storeResolutionGradient = 0.2;
    this.connectDistance = 0.10;
    this.targetDistance = 0.22;
    this.sampleBounds = new _NBox2.default([-0.6, -2, -1.1, -1.1, -10, -10], [1.0, 2, 1.1, 1.1, 10, 10]);
    this.start = Config.make(0.2, -1.6, 0);
    this.target = Config.make(1.1, -0.4, 0);
    this.Configuration = Config;
    this.ConfigurationInput = Input;
  }
});

'use strict';

define('/experiments_old/experiment/parking_physics/PhParkingInput', ['exports', '/math/Sim2', '/math/VecN'], function (exports, _Sim, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Sim2 = _interopRequireDefault(_Sim);

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var ACCELERATION = 1.0;
  var STEERING_SPEED = 3.0;

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }

  function randomize(inp) {
    inp[0] = rspan(1.0);
    inp[1] = rspan(1.0);
    inp[2] = 0.1 + Math.random() * 0.3;
  }

  function applyTo(to, config, inp) {
    var DT = inp[2];
    var dpos = config[4] * DT;
    var a = dpos * config[5];
    var sina = Math.sin(a),
        cosa = Math.cos(a);
    var nx = config[2] * cosa + config[3] * sina;
    var ny = -config[2] * sina + config[3] * cosa;
    to[0] = config[0] + dpos * config[3];
    to[1] = config[1] - dpos * config[2];
    to[2] = nx;
    to[3] = ny;
    to[4] = clamp(config[4] + inp[0] * ACCELERATION * DT, 1.0);
    to[5] = clamp(config[5] + inp[1] * STEERING_SPEED * DT, 2.4);
    return to;
  }

  function applyIP(config, inp) {
    return applyTo(config, config, inp);
  }

  function clamp(a, x) {
    if (a > x) return x;
    if (a < -x) return -x;
    return a;
  }

  function create() {
    return _VecN2.default.create(3);
  }

  function costOf(inp) {
    return inp[2];
  }

  exports.default = {
    create: create, randomize: randomize,
    costOf: costOf,
    applyTo: applyTo, applyIP: applyIP
  };
});


'use strict';

define('/experiments_old/visual/CssView', ['exports', '/entry/Config', '/utils/utils', '/utils/databind'], function (exports, _Config, _utils, _databind) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Config2 = _interopRequireDefault(_Config);

  var _utils2 = _interopRequireDefault(_utils);

  var _databind2 = _interopRequireDefault(_databind);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var SCALE = 100;
  var VEC2_ZERO = [0, 0];

  function CssView(viewmodel, viewportElement, model) {
    this.viewmodel = viewmodel;
    this.viewport = viewportElement;
    this.model = model;
    this.walls = _createView("walls");

    if (_Config2.default.SHOW2D_WALLS) {
      this.walls = _fillView(this.walls, viewmodel.definition.walls, viewportElement);
    }

    var agents = null;

    if (_Config2.default.SHOW2D_AGENT) {
      agents = viewmodel.definition.agents.map(function (agentDef) {
        return createView(agentDef, viewportElement, "agent");
      });
    } else {
      agents = [];
    }

    this.agents = agents;
    var agents2 = null;

    if (_Config2.default.SHOW2D_AGENT) {
      agents2 = viewmodel.definition.agents.map(function (agentDef) {
        return createView(agentDef, viewportElement, "agent2");
      });
    } else {
      agents2 = [];
    }

    this.agents2 = agents2;
    this.samples = [];

    if (_Config2.default.SHOW2D_TREE_FULL) {
      this.walls.appendChild(createTree(this.model.wallsTree, "rect", false));
    }

    if (_Config2.default.SHOW2D_TREE_PART) {
      this.walls.appendChild(createTree(this.model.wallsTree, "rect", true));
    }

    this.update();
  }

  function createView(def, viewportElement, style) {
    var view = _createView(style);

    _fillView(view, def, viewportElement);

    return view;
  }

  function _createView(style) {
    var view = document.createElement('span');
    view.className = style;
    return view;
  }

  function _fillView(view, def, viewportElement) {
    def.forEach(function (d) {
      var element = document.createElement('span');
      element.className = "box";
      element.style.width = 2 * SCALE * d.size[0] + "px";
      element.style.height = 2 * SCALE * d.size[1] + "px";

      var pos = _utils2.default.nvl(d.pos, VEC2_ZERO);

      positionElement(element, pos[0], pos[1], _utils2.default.nvl(d.angle, 0));
      view.appendChild(element);
    });
    viewportElement.appendChild(view);
    return view;
  }

  function forEach(arr, fn) {
    if (arr) arr.forEach(fn);
  }

  function takeUniform(arr, fn) {
    if (arr) fn(arr[Math.floor(arr.length * Math.random() - 0.000001)]);
  }

  function createTree(tree, style, single_random) {
    var root = document.createElement('span');
    drawTree(tree, root, style, single_random);
    return root;
  }

  function drawTree(tree, parent, style, single_random) {
    var elements = [];

    function bound(tree) {
      var element = document.createElement('span');
      element.className = style;
      element.style.width = 2 * SCALE * tree.box.hsize[0] + "px";
      element.style.height = 2 * SCALE * tree.box.hsize[1] + "px";
      positionElementSim(element, tree.box.placement);
      parent.appendChild(element);
      elements.push(element);

      if (single_random) {
        takeUniform(tree.children, bound);
      } else {
        forEach(tree.children, bound);
      }
    }

    bound(tree);
    return elements;
  }

  var SampleDefinition = {
    create: function create(src, view) {
      var elem = document.createElement('div');
      elem.classList.add('sample');
      view.viewport.appendChild(elem);
      return elem;
    },
    update: function update(dst, src, view) {
      positionElement(dst, src[2], src[3], 0);
    },
    remove: function remove(dst, view) {
      dst.remove();
    }
  };

  CssView.prototype.update = function update() {
    var i, arr1, arr2;
    arr1 = this.agents;
    arr2 = this.viewmodel.agents;

    for (i = 0; i < arr1.length; i++) {
      positionElementSim(arr1[i], arr2[i]);
    }

    arr1 = this.agents2;
    arr2 = this.viewmodel.agents2;

    for (i = 0; i < arr1.length; i++) {
      positionElementSim(arr1[i], arr2[i]);
    }

    if (_Config2.default.SHOW2D_SAMPLES) {
      _databind2.default.updateArray(this.samples, this.viewmodel.samples, SampleDefinition, this);
    }
  };

  CssView.prototype.setHighlighted = function setHighlighted(flag) {
    this.agents.forEach(function (agent) {
      if (flag) {
        agent.classList.add('highlight');
      } else {
        agent.classList.remove('highlight');
      }
    });
  };

  function removeChildren(myNode) {
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }

  CssView.prototype.dispose = function () {
    removeChildren(this.viewport);
  };

  function cssMatrix(x, y, angle) {
    var ca = Math.cos(angle),
        sa = Math.sin(angle);
    return "matrix(" + ca + "," + sa + "," + -sa + "," + ca + "," + x + "," + y + ")";
  }

  function cssMatrixSim(sim, scale) {
    if (scale === undefined) scale = 1;
    return "matrix(" + sim[0] + "," + sim[1] + "," + -sim[1] + "," + sim[0] + "," + sim[2] * scale + "," + sim[3] * scale + ")";
  }

  function positionElementSim(e, sim) {
    e.style.transform = "translate(-50%, -50%) " + cssMatrixSim(sim, SCALE);
  }

  function positionContainerSim(e, sim) {
    e.style.transform = cssMatrixSim(sim, SCALE);
  }

  function positionElement(e, x, y, a) {
    e.style.transform = "translate(-50%, -50%) " + cssMatrix(x * SCALE, y * SCALE, _utils2.default.nvl(a, 0));
  }

  CssView.positionElement = positionElement;
  exports.default = CssView;
});

'use strict';

define('/experiments_old/visual/CssViewModel', ['exports', '/entry/Config', '/utils/databind', '/math/Sim2'], function (exports, _Config, _databind, _Sim) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Config2 = _interopRequireDefault(_Config);

  var _databind2 = _interopRequireDefault(_databind);

  var _Sim2 = _interopRequireDefault(_Sim);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function CssViewModel(def, Configuration) {
    this.definition = def;
    this.agents = def.agents.map(function () {
      return _Sim2.default.create();
    });
    this.agents2 = def.agents.map(function () {
      return _Sim2.default.create();
    });
    this.samples = [];
    this.Configuration = Configuration;
  }

  var SampleBindingDefinition = {
    create: function create() {
      return new Float64Array([1, 0, 0, 0]);
    },
    update: function update(dst, src, _this) {
      _this.Configuration.loadSample(dst, src.pos);
    },
    remove: function remove() {}
  };

  CssViewModel.prototype.pullSolver = function (solver) {
    var agents = this.agents;
    var agents2 = this.agents2;

    _databind2.default.updateArray(this.samples, solver.samples.slice(-_Config2.default.SHOW2D_SAMPLE_COUNT), SampleBindingDefinition, this);

    if (solver.conf_gen) {
      this.Configuration.loadView(indexer1, solver.conf_gen);
    }

    if (solver.conf_trial) {
      this.Configuration.loadView(indexer2, solver.conf_trial);
    }

    function indexer1(i) {
      return agents[i];
    }

    function indexer2(i) {
      return agents2[i];
    }
  };

  CssViewModel.prototype.pullAnim = function (solver, interpolated) {
    var agents = this.agents;
    var agents2 = this.agents2;
    this.Configuration.loadView(indexer1, interpolated);

    if (solver.conf_trial) {
      this.Configuration.loadView(indexer2, solver.conf_trial);
    }

    function indexer1(i) {
      return agents[i];
    }

    function indexer2(i) {
      return agents2[i];
    }
  };

  exports.default = CssViewModel;
});


'use strict';

define('/graphics/Math', ['exports', '/math/Quat', '/math/QuatEtc'], function (exports, _Quat, _QuatEtc) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.mquat_to_bquat = mquat_to_bquat;
  exports.quaternionSetSim = quaternionSetSim;

  var _Quat2 = _interopRequireDefault(_Quat);

  var _QuatEtc2 = _interopRequireDefault(_QuatEtc);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var temp_quat = _Quat2.default.create();

  function mquat_to_bquat(bq, mq) {
    bq.w = mq[0];
    bq.x = mq[1];
    bq.y = mq[2];
    bq.z = mq[3];
    return bq;
  }

  function quaternionSetSim(q, sim) {
    return mquat_to_bquat(q, _QuatEtc2.default.rot_to_quat(temp_quat, sim));
  }
});

'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

define('/graphics/MeshHelper', ['exports', '/shim/babylon', '/graphics/Math'], function (exports, _babylon, _Math) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _babylon2 = _interopRequireDefault(_babylon);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var CompoundMesh = (function (_BABYLON$Mesh) {
    _inherits(CompoundMesh, _BABYLON$Mesh);

    function CompoundMesh(name, scene, children) {
      _classCallCheck(this, CompoundMesh);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompoundMesh).call(this, name, scene));

      _this.my_children = children;
      children.forEach(function (c) {
        return c.parent = _this;
      });
      return _this;
    }

    _createClass(CompoundMesh, [{
      key: 'my_traverse',
      value: function my_traverse(cb) {
        cb(this, false);
        this.my_children.forEach(function (m) {
          if (m.my_traverse) {
            m.my_traverse(cb);
          } else {
            cb(m, true);
          }
        });
      }
    }]);

    return CompoundMesh;
  })(_babylon2.default.Mesh);

  function applyQuaternion(mesh, q) {
    var quat = mesh.rotationQuaternion || (mesh.rotationQuaternion = new _babylon2.default.Quaternion());
    quat.w = q[0];
    quat.x = q[1];
    quat.y = q[2];
    quat.z = q[3];
    return mesh;
  }

  function applyTranslation(mesh, v) {
    var pos = mesh.position;
    pos.x = v[0];
    pos.y = v[1];
    pos.z = v[2];
    return mesh;
  }

  function applyTransform(mesh, sim) {
    var pos = mesh.position;
    pos.x = sim[9];
    pos.y = sim[10];
    pos.z = sim[11];
    var quat = mesh.rotationQuaternion || (mesh.rotationQuaternion = new _babylon2.default.Quaternion());
    (0, _Math.quaternionSetSim)(quat, sim);
    return mesh;
  }

  function meshFromOBoxList(name, scene, oboxes) {
    var box_cb = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    return new CompoundMesh(name, scene, oboxes.map(function (box, i) {
      var view = _babylon2.default.Mesh.CreateBox(name + "__" + i, {
        width: box.hsize[0] * 2,
        height: box.hsize[1] * 2,
        depth: box.hsize[2] * 2
      }, scene);

      applyTransform(view, box.transform);
      if (box_cb) box_cb(view, box, i);
      return view;
    }));
  }

  function forEach(arr, cb) {
    arr.forEach(cb);
  }

  function forSingleUniform(arr, cb) {
    if (arr && arr.length > 0) {
      cb(arr[Math.floor(arr.length * Math.random() - 0.00001)]);
    }
  }

  function meshFromOBoxTree(name, scene, treeRoot) {
    var renderLeaves = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
    var node_cb = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    return _meshFromOBoxTree(forEach, name, scene, treeRoot, renderLeaves, node_cb);
  }

  function meshFromOBoxTreePart(name, scene, treeRoot) {
    var renderLeaves = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
    var node_cb = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    return _meshFromOBoxTree(forSingleUniform, name, scene, treeRoot, renderLeaves, node_cb);
  }

  function _meshFromOBoxTree(iterate, name, scene, treeRoot, renderLeaves, node_cb) {
    var i = 0;
    var children = [];
    var m_tree_items = [];

    function visit(node) {
      if (node.children) {
        iterate(node.children, visit);
      }

      if (node.children || renderLeaves) {
        var box = node.obox;

        var mesh = _babylon2.default.Mesh.CreateBox(name + "__" + i++, {
          width: box.hsize[0] * 2,
          height: box.hsize[1] * 2,
          depth: box.hsize[2] * 2
        }, scene);

        applyTransform(mesh, node.obox.transform);
        if (node_cb) node_cb(mesh, node, i);
        children.push(mesh);
        m_tree_items.push({
          mesh: mesh,
          node: node
        });
      }
    }

    visit(treeRoot);
    var pivot = new CompoundMesh(name, scene, children);

    pivot.my_clear = function () {
      m_tree_items.forEach(function (_ref) {
        var node = _ref.node;
        return node._hit = false;
      });
    };

    pivot.my_update = function () {
      m_tree_items.forEach(function (_ref2) {
        var mesh = _ref2.mesh;
        var node = _ref2.node;
        return mesh.isVisible = node._hit;
      });
    };

    return pivot;
  }

  exports.default = {
    CompoundMesh: CompoundMesh,

    applyQuaternion: applyQuaternion,
    applyTranslation: applyTranslation,
    applyTransform: applyTransform,
    meshFromOBoxList: meshFromOBoxList,
    meshFromOBoxTree: meshFromOBoxTree,
    meshFromOBoxTreePart: meshFromOBoxTreePart
  };
});


'use strict';

define('/math/NBox', ['exports', '/math/VecN'], function (exports, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _Math = Math;
  var sqrt = _Math.sqrt;

  function clamp(x, mi, ma) {
    if (x < mi) return mi;
    if (x > ma) return ma;
    return x;
  }

  var NBox = (function () {
    function NBox(min, max) {
      _classCallCheck(this, NBox);

      this.min = _VecN2.default.make(min);
      this.max = _VecN2.default.make(max);
    }

    _createClass(NBox, [{
      key: 'contains',
      value: function contains(dot) {
        var min = this.min,
            max = this.max;

        for (var i = 0; i < min.length; i++) {
          var x = dot[i];
          if (x < min[i] || x > max[i]) return false;
        }

        return true;
      }
    }, {
      key: 'width',
      value: function width(dim) {
        return this.max[dim] - this.min[dim];
      }
    }, {
      key: 'split',
      value: function split(dim) {
        var min = this.min,
            max = this.max;

        var minmid = _VecN2.default.copy(min);

        var maxmid = _VecN2.default.copy(max);

        var mid = (min[dim] + max[dim]) * 0.5;
        minmid[dim] = maxmid[dim] = mid;
        return [new NBox(min, maxmid), new NBox(minmid, max)];
      }
    }, {
      key: 'split2',
      value: function split2() {
        var bd = 0,
            bv = this.width(0);
        var dims = this.dims();

        for (var i = 1; i < dims; i++) {
          var cv = this.width(i);

          if (cv > bv) {
            bv = cv;
            bd = i;
          }
        }

        return this.split(bd);
      }
    }, {
      key: 'size',
      value: function size() {
        return _VecN2.default.sub(this.max, this.min);
      }
    }, {
      key: 'sizeTo',
      value: function sizeTo(to) {
        return _VecN2.default.subTo(to, this.max, this.min);
      }
    }, {
      key: 'dist2',
      value: function dist2(p) {
        var min = this.min,
            max = this.max;
        var coord,
            delta,
            result = 0;

        for (var i = 0, mi = p.length; i < mi; i++) {
          coord = p[i];
          delta = clamp(coord, min[i], max[i]) - coord;
          result += delta * delta;
        }

        return result;
      }
    }, {
      key: 'dist',
      value: function dist(p) {
        return sqrt(this.dist2(p));
      }
    }, {
      key: 'dims',
      value: function dims() {
        return this.min.length;
      }
    }, {
      key: 'fatten',
      value: function fatten(ratio) {
        if (ratio === undefined) ratio = 0.25;
        var size = this.size();
        var i;

        var nmin = _VecN2.default.copy(this.min);

        var nmax = _VecN2.default.copy(this.max);

        for (i = 0; i < size.length; i++) {
          nmin[i] -= size[i] * ratio;
          nmax[i] += size[i] * ratio;
        }

        return new NBox(nmin, nmax);
      }
    }], [{
      key: 'make',
      value: function make(min, max) {
        return new NBox(_VecN2.default.make(min), _VecN2.default.make(max));
      }
    }]);

    return NBox;
  })();

  exports.default = NBox;
  ;
});

"use strict";

define("/math/NBoxTree", ["exports", "/math/VecN"], function (exports, _VecN) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Node = undefined;

  var _VecN2 = _interopRequireDefault(_VecN);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  function newNode(nbox) {
    return new Node(nbox);
  }

  function putChild(dot, ch, depth, maxcnt) {
    return ch.some(function (c) {
      return c.putDot(dot, depth, maxcnt);
    });
  }

  var Node = exports.Node = (function () {
    function Node(nbox) {
      _classCallCheck(this, Node);

      this.sampleBounds = nbox;
      this.ch = null;
      this.dots = [];
    }

    _createClass(Node, [{
      key: "isLeaf",
      value: function isLeaf() {
        return !this.ch;
      }
    }, {
      key: "putDot",
      value: function putDot(dot, depth, maxcnt) {
        var ch = this.ch;
        if (this.sampleBounds.contains(dot)) {
          if (!ch && this.dots.length > maxcnt) {
            ch = this.split(depth + 1);
          }
          if (ch) {
            return putChild(dot, ch, depth + 1, maxcnt);
          } else {
            this.dots.push(dot);
          }
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: "split",
      value: function split(depth) {
        var ch = this.ch = this.sampleBounds.split2().map(newNode);
        this.dots.forEach(function (dot) {
          putChild(dot, ch, depth);
        });
        this.dots = null;
        return ch;
      }
    }, {
      key: "check",
      value: function check() {
        var _this = this;

        return arrAll(this.dots, function (d) {
          return _this.sampleBounds.contains(d);
        }) && arrAll(this.ch, function (c) {
          return c.check();
        });
      }
    }]);

    return Node;
  })();

  ;

  function arrAll(arr, fn) {
    return !arr || !arr.some(function (x) {
      return !fn(x);
    });
  }

  var NBoxTree = (function () {
    function NBoxTree(nbox) {
      _classCallCheck(this, NBoxTree);

      this.root = new Node(nbox);
      this.maxcnt = 3;
      this.count = 0;
      this._measurement = 0;
      this._measurementBox = 0;
    }

    _createClass(NBoxTree, [{
      key: "traverse",
      value: function traverse(fn, ctx) {
        var depth = 0;

        function bound(node) {
          if (!fn.call(ctx, node, depth)) {
            var ch = node.ch;

            if (ch) {
              depth++;
              ch.forEach(bound);
              depth--;
            }
          }
        }

        bound(this.root);
      }
    }, {
      key: "inspect",
      value: function inspect() {
        var maxdepth = 0;
        var dotcount = 0;
        var depth = 0;

        function bound(node) {
          if (maxdepth < depth) maxdepth = depth;
          if (node.dots) dotcount += node.dots.length;
          var ch = node.ch;

          if (ch) {
            depth++;
            ch.forEach(bound);
            depth--;
          }
        }

        bound(this.root);
        console.log(" " + dotcount + "\t-\t" + maxdepth);
      }
    }, {
      key: "nearest",
      value: function nearest(dot) {
        var currentBest = null;
        var currentRadius2 = 0;
        var visitCnt = 0,
            boxCnt = 0;

        function visit(savedDot) {
          visitCnt++;

          var dist2 = _VecN2.default.dist2(savedDot, dot);

          if (currentBest === null || dist2 < currentRadius2) {
            currentBest = savedDot;
            currentRadius2 = dist2;
          }
        }

        function intrav(node) {
          if (node.sampleBounds.contains(dot)) {
            bound(node);
          }
        }

        function outtrav(node) {
          if ((currentBest === null || node.sampleBounds.dist2(dot) < currentRadius2) && !node.sampleBounds.contains(dot)) {
            bound(node);
          }
        }

        function bound(node) {
          boxCnt++;
          var ch = node.ch,
              dots = node.dots;

          if (ch) {
            ch.forEach(intrav);
            ch.forEach(outtrav);
          }

          if (dots) {
            dots.forEach(visit);
          }
        }

        bound(this.root);
        this._measurement = visitCnt;
        this._measurementBox = boxCnt;
        return currentBest;
      }
    }, {
      key: "hasInRange",
      value: function hasInRange(p, dist) {
        var dist2 = dist * dist;
        var result = false;

        function visit(dot) {
          if (!result && _VecN2.default.dist2(dot, p) <= dist2) {
            result = true;
          }
        }

        function bound(node) {
          if (node.sampleBounds.dist2(p) <= dist2) {
            var ch = node.ch;
            var dots = node.dots;

            if (dots) {
              dots.forEach(visit);
            }

            if (!result && ch) {
              ch.forEach(bound);
            }
          }
        }

        bound(this.root);
        return result;
      }
    }, {
      key: "enumerateInRange",
      value: function enumerateInRange(p, maxDist, fn, ctx) {
        var maxDist2 = maxDist * maxDist;

        function visit(dot) {
          var actualDist2 = _VecN2.default.dist2(dot, p);

          if (actualDist2 <= maxDist2) {
            fn.call(ctx, dot, actualDist2);
          }
        }

        function bound(node) {
          if (node.sampleBounds.dist2(p) <= maxDist2) {
            var ch = node.ch;
            var dots = node.dots;

            if (dots) {
              dots.forEach(visit);
            }

            if (ch) {
              ch.forEach(bound);
            }
          }
        }

        bound(this.root);
      }
    }, {
      key: "putDot",
      value: function putDot(dot) {
        this.count++;
        var success = this.root.putDot(dot, 0, this.maxcnt);
        if (!success) throw new Error("NBoxTree.putDot: outside");
        return true;
      }
    }, {
      key: "tryPutDot",
      value: function tryPutDot(dot) {
        var success = this.root.putDot(dot, 0, this.maxcnt);
        if (success) this.count++;
        return success;
      }
    }, {
      key: "check",
      value: function check() {
        return this.root.check();
      }
    }]);

    return NBoxTree;
  })();

  exports.default = NBoxTree;
  ;
});

'use strict';

define('/math/Quat', ['exports', '/math/Vec3'], function (exports, _Vec) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Vec2 = _interopRequireDefault(_Vec);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _Math = Math;
  var sqrt = _Math.sqrt;
  var acos = _Math.acos;
  var sin = _Math.sin;
  var cos = _Math.cos;
  var EPS = 1e-5;

  function create() {
    return new Float64Array(4);
  }

  function array(n) {
    var r = new Array(n);

    for (var i = 0; i < n; i++) {
      r[i] = create();
    }

    return r;
  }

  function setWXYZ(to, w, x, y, z) {
    to[0] = w;
    to[1] = x;
    to[2] = y;
    to[3] = z;
    return to;
  }

  function slerpTo(to, a, b, t) {
    var it = 1 - t;
    var omega = acos(dot(a, b));
    var sino = sin(omega);
    var x1 = sin(it * omega) / sino;
    var x2 = sin(t * omega) / sino;
    to[0] = x1 * a[0] + x2 * b[0];
    to[1] = x1 * a[1] + x2 * b[1];
    to[2] = x1 * a[2] + x2 * b[2];
    to[3] = x1 * a[3] + x2 * b[3];
    return to;
  }

  function slerpIP(a, b, t) {
    return slerpTo(a, a, b, t);
  }

  function slerp(a, b, t) {
    return slerpTo(create(), a, b, t);
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }

  function dotXYZW(a, w, x, y, z) {
    return a[0] * w + a[1] * x + a[2] * y + a[3] * z;
  }

  function len2(a) {
    return dot(a, a);
  }

  function len(a) {
    return sqrt(len2(a));
  }

  function dist2(a, b) {
    var d0 = a[0] - b[0];
    var d1 = a[1] - b[1];
    var d2 = a[2] - b[2];
    var d3 = a[3] - b[3];
    return d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3;
  }

  function dist(a, b) {
    return sqrt(dist2(a, b));
  }

  function copy(a) {
    return copyTo(create(), a);
  }

  function copyTo(r, a) {
    r[0] = a[0];
    r[1] = a[1];
    r[2] = a[2];
    r[3] = a[3];
    return r;
  }

  function scaleTo(to, q, s) {
    to[0] = q[0] * s;
    to[1] = q[1] * s;
    to[2] = q[2] * s;
    to[3] = q[3] * s;
    return to;
  }

  function negTo(to, a) {
    to[0] = -a[0];
    to[1] = -a[1];
    to[2] = -a[2];
    to[3] = -a[3];
    return to;
  }

  function directTo(to, a, b) {
    if (dot(a, b) < 0) {
      return negTo(to, a);
    } else {
      return copyTo(to, a);
    }
  }

  function normalizeTo(to, a) {
    return scaleTo(to, a, 1 / len(a));
  }

  function normalize(a) {
    return normalizeTo(create(), a);
  }

  function normalizeIP(a) {
    return normalizeTo(a, a);
  }

  function setIdentity(q) {
    q[0] = 1;
    q[1] = q[2] = q[3] = 0;
    return q;
  }

  function identity() {
    return setIdentity(create());
  }

  function mulTo(to, a, b) {
    var a1 = a[0],
        b1 = a[1],
        c1 = a[2],
        d1 = a[3],
        a2 = b[0],
        b2 = b[1],
        c2 = b[2],
        d2 = b[3];
    to[0] = a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2;
    to[1] = a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2;
    to[2] = a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2;
    to[3] = a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2;
    return to;
  }

  function mulIP(a, b) {
    return mulTo(a, a, b);
  }

  function mul(a, b) {
    return mulTo(create(), a, b);
  }

  function setAxisAngleXYZA(to, ax, ay, az, ang) {
    var sina = sin(ang / 2);
    to[0] = cos(ang / 2);
    to[1] = sina * ax;
    to[2] = sina * ay;
    to[3] = sina * az;
    return to;
  }

  function setAxisAngleVA(to, v, ang) {
    return setAxisAngleXYZA(to, v[0], v[1], v[2], ang);
  }

  function setEulerScaleXYZS(to, x, y, z, s) {
    var l = _Vec2.default.lenXYZ(x, y, z);

    if (l < EPS) {
      return setIdentity(to);
    } else {
      return setAxisAngleXYZA(to, x / l, y / l, z / l, s * l);
    }
  }

  function setEulerXYZ(to, x, y, z) {
    return setEulerScaleXYZS(to, x, y, z, 1);
  }

  function setEulerV(to, v) {
    return setEulerXYZ(to, v[0], v[1], v[2]);
  }

  function setEulerScaleVS(to, v, s) {
    return setEulerXYZ(to, v[0], v[1], v[2], s);
  }

  exports.default = {
    DIMS: 4,
    create: create,
    array: array,
    setWXYZ: setWXYZ,

    identity: identity, setIdentity: setIdentity,

    copy: copy, copyTo: copyTo,

    mul: mul, mulTo: mulTo, mulIP: mulIP,

    slerp: slerp, slerpTo: slerpTo, slerpIP: slerpIP,

    dot: dot, dotXYZW: dotXYZW,

    len: len, len2: len2,
    dist: dist, dist2: dist2,

    normalize: normalize,
    normalizeTo: normalizeTo,
    normalizeIP: normalizeIP,

    directTo: directTo,

    setAxisAngleXYZA: setAxisAngleXYZA,
    setAxisAngleVA: setAxisAngleVA,
    setEulerScaleXYZS: setEulerScaleXYZS,
    setEulerXYZ: setEulerXYZ,
    setEulerV: setEulerV,
    setEulerScaleVS: setEulerScaleVS
  };
});

"use strict";

define("/math/QuatEtc", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var sqrt = _Math.sqrt;
  var random = _Math.random;

  function setRandomUnit(q) {
    var w, x, y, z;

    for (var i = 0; i < 20; i++) {
      w = random() * 2 - 1;
      x = random() * 2 - 1;
      y = random() * 2 - 1;
      z = random() * 2 - 1;
      var l2 = w * w + x * x + y * y + z * z;

      if (l2 <= 1 && l2 > 1e-4) {
        var l = sqrt(l2);
        q[0] = w / l;
        q[1] = x / l;
        q[2] = y / l;
        q[3] = z / l;
        return q;
      }
    }

    q[0] = 1;
    q[1] = 0;
    q[2] = 0;
    q[3] = 0;
    return q;
  }

  function quat_to_rot(sim, q) {
    var a = q[3],
        b = q[0],
        c = q[1],
        d = q[2];
    sim[0] = a * a + b * b - c * c - d * d;
    sim[1] = 2 * b * c - 2 * a * d;
    sim[2] = 2 * b * d + 2 * a * c;
    sim[3] = 2 * b * c + 2 * a * d;
    sim[4] = a * a - b * b + c * c - d * d;
    sim[5] = 2 * c * d - 2 * a * b;
    sim[6] = 2 * b * d - 2 * a * c;
    sim[7] = 2 * c * d + 2 * a * b;
    sim[8] = a * a - b * b - c * c + d * d;
    return sim;
  }

  function quat_to_sim(sim, q) {
    quat_to_rot(sim, q);
    sim[9] = 0;
    sim[10] = 0;
    sim[11] = 0;
    return sim;
  }

  function rot_to_quat(q, sim) {
    var m00 = sim[0],
        m10 = sim[1],
        m20 = sim[2],
        m01 = sim[3],
        m11 = sim[4],
        m21 = sim[5],
        m02 = sim[6],
        m12 = sim[7],
        m22 = sim[8];
    var tr = m00 + m11 + m22;
    var S, qw, qx, qy, qz;

    if (tr > 0) {
      S = sqrt(tr + 1.0) * 2;
      qw = 0.25 * S;
      qx = (m21 - m12) / S;
      qy = (m02 - m20) / S;
      qz = (m10 - m01) / S;
    } else if (m00 > m11 && m00 > m22) {
      S = sqrt(1.0 + m00 - m11 - m22) * 2;
      qw = (m21 - m12) / S;
      qx = 0.25 * S;
      qy = (m01 + m10) / S;
      qz = (m02 + m20) / S;
    } else if (m11 > m22) {
      S = sqrt(1.0 + m11 - m00 - m22) * 2;
      qw = (m02 - m20) / S;
      qx = (m01 + m10) / S;
      qy = 0.25 * S;
      qz = (m12 + m21) / S;
    } else {
      S = sqrt(1.0 + m22 - m00 - m11) * 2;
      qw = (m10 - m01) / S;
      qx = (m02 + m20) / S;
      qy = (m12 + m21) / S;
      qz = 0.25 * S;
    }

    q[0] = qw;
    q[1] = qx;
    q[2] = qy;
    q[3] = qz;
    return q;
  }

  function transformQXYZ(to, q, x, y, z) {
    quat_to_rot(to, q);
    to[9] = x;
    to[10] = y;
    to[11] = z;
    return to;
  }

  exports.default = {
    quat_to_rot: quat_to_rot,
    quat_to_sim: quat_to_sim,
    rot_to_quat: rot_to_quat,

    setRandomUnit: setRandomUnit,
    transformQXYZ: transformQXYZ
  };
});

"use strict";

define("/math/Sim2", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var cos = _Math.cos;
  var sin = _Math.sin;
  var sqrt = _Math.sqrt;

  function create() {
    return new Float32Array(4);
  }

  function clone(sim) {
    return set(create(), sim);
  }

  function array(cnt) {
    var buffer = new Float32Array(4 * cnt);
    var res = new Array(cnt);

    for (var i = 0; i < cnt; i++) {
      res[i] = buffer.subarray(4 * i, 4 * i + 4);
    }

    return res;
  }

  function scale(output, sim, s) {
    output[0] = sim[0] * s;
    output[1] = sim[1] * s;
    output[2] = sim[2] * s;
    output[3] = sim[3] * s;
    return output;
  }

  function set(output, sim) {
    output[0] = sim[0];
    output[1] = sim[1];
    output[2] = sim[2];
    output[3] = sim[3];
    return output;
  }

  function setXYA(output, x, y, a) {
    return setXYCS(output, x, y, cos(a), sin(a));
  }

  function setXYCS(output, x, y, c, s) {
    output[0] = c;
    output[1] = s;
    output[2] = x;
    output[3] = y;
    return output;
  }

  function setTranslateXY(output, x, y) {
    output[0] = 1;
    output[1] = 0;
    output[2] = x;
    output[3] = y;
    return output;
  }

  function setTranslateV(output, v) {
    return setTranslateXY(output, v[0], v[1]);
  }

  function setRotateCS(output, c, s) {
    output[0] = c;
    output[1] = s;
    output[2] = 0;
    output[3] = 0;
    return output;
  }

  function setRotateA(output, angle) {
    return setRotateCS(output, cos(angle), sin(angle));
  }

  function setRotateV(output, v) {
    return setRotateCS(output, v[0], v[1]);
  }

  function setIdentity(output) {
    output[0] = 1;
    output[1] = output[2] = output[3] = 0;
    return output;
  }

  function mul_(output, a, b) {
    var ac = a[0],
        as = a[1],
        ax = a[2],
        ay = a[3];
    var bc = b[0],
        bs = b[1],
        bx = b[2],
        by = b[3];
    output[0] = ac * bc - as * bs;
    output[1] = ac * bs + as * bc;
    output[2] = ax * bc - ay * bs + bx;
    output[3] = ax * bs + ay * bc + by;
    return output;
  }

  function transform_(output, v, sim) {
    var ac = sim[0],
        as = sim[1],
        ax = sim[2],
        ay = sim[3];
    var vx = v[0],
        vy = v[1];
    output[0] = vx * ac - vy * as + ax;
    output[1] = vx * as + vy * ac + ay;
    return output;
  }

  function rotate_(output, v, sim) {
    var ac = sim[0],
        as = sim[1];
    var vx = v[0],
        vy = v[1];
    output[0] = vx * ac - vy * as;
    output[1] = vx * as + vy * ac;
    return output;
  }

  function mul(a, b) {
    return mul_(a, a, b);
  }

  function transform(v, sim) {
    return transform_(v, v, sim);
  }

  function rotate(v, sim) {
    return rotate_(v, v, sim);
  }

  function getRotateV(output, sim) {
    output[0] = sim[0];
    output[1] = sim[1];
    return output;
  }

  function getTranslateV(output, sim) {
    output[0] = sim[2];
    output[1] = sim[3];
    return output;
  }

  function invert_(output, sim) {
    var c = sim[0],
        s = sim[1],
        x = sim[2],
        y = sim[3];
    var idet = 1.0 / (c * c + s * s);
    output[0] = idet * c;
    output[1] = -idet * s;
    output[2] = -idet * (c * x + s * y);
    output[3] = idet * (s * x + c * y);
    return output;
  }

  function invert(sim) {
    return invert_(sim, sim);
  }

  function getRotateM(output, sim) {
    output[0] = sim[0];
    output[1] = sim[1];
    output[2] = 0;
    output[3] = 0;
    return output;
  }

  function getTranslateM(output, sim) {
    output[0] = 1;
    output[1] = 0;
    output[2] = sim[2];
    output[3] = sim[3];
    return output;
  }

  function createIdentity() {
    return setIdentity(create());
  }

  function createRotateA(a) {
    return setRotateA(create(), a);
  }

  function createRotateCS(c, s) {
    return setRotateA(create(), c, s);
  }

  function createRotateV(v) {
    return setRotateV(create(), v);
  }

  function createTranslateXY(x, y) {
    return setTranslateXY(create(), x, y);
  }

  function createTranslateV(v) {
    return setTranslateV(create(), v);
  }

  function createXYA(x, y, a) {
    return setXYA(create(), x, y, a);
  }

  function createXYCS(x, y, c, s) {
    return setXYCS(create(), x, y, c, s);
  }

  function det(sim) {
    var c = sim[0],
        s = sim[1];
    return c * c + s * s;
  }

  function getScaleFactor(sim) {
    return sqrt(det(sim));
  }

  exports.default = {
    ELEMENTS: 4,
    create: create,
    array: array,
    clone: clone,
    createXYA: createXYA,
    createXYCS: createXYCS,
    createIdentity: createIdentity,
    createRotateA: createRotateA,
    createRotateCS: createRotateCS,
    createRotateV: createRotateV,
    createTranslateXY: createTranslateXY,
    createTranslateV: createTranslateV,

    mul_: mul_,
    transform_: transform_,
    rotate_: rotate_,
    invert_: invert_,
    mul: mul,
    transform: transform,
    rotate: rotate,
    invert: invert,

    set: set,
    setXYA: setXYA,
    setXYCS: setXYCS,
    setIdentity: setIdentity,
    setRotateCS: setRotateCS,
    setRotateA: setRotateA,
    setRotateV: setRotateV,
    setTranslateXY: setTranslateXY,
    setTranslateV: setTranslateV,

    scale: scale,
    det: det,
    getRotateV: getRotateV,
    getRotateM: getRotateM,
    getTranslateV: getTranslateV,
    getTranslateM: getTranslateM,
    getScaleFactor: getScaleFactor
  };
});

'use strict';

define('/math/Sim3', ['exports', '/math/Vec3'], function (exports, _Vec) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Vec2 = _interopRequireDefault(_Vec);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _Math = Math;
  var sin = _Math.sin;
  var cos = _Math.cos;
  var abs = _Math.abs;

  function create() {
    return new Float64Array(12);
  }

  function set(to, a) {
    for (var i = 0; i < 12; i++) {
      to[i] = a[i];
    }

    return to;
  }

  function copy(a) {
    return set(create(), a);
  }

  function setIdentity(a) {
    a[0] = 1;
    a[1] = 0;
    a[2] = 0;
    a[3] = 0;
    a[4] = 1;
    a[5] = 0;
    a[6] = 0;
    a[7] = 0;
    a[8] = 1;
    a[9] = 0;
    a[10] = 0;
    a[11] = 0;
    return a;
  }

  function identity() {
    return setIdentity(create());
  }

  function setTranslationXYZ(a, x, y, z) {
    a[0] = 1;
    a[1] = 0;
    a[2] = 0;
    a[3] = 0;
    a[4] = 1;
    a[5] = 0;
    a[6] = 0;
    a[7] = 0;
    a[8] = 1;
    a[9] = x;
    a[10] = y;
    a[11] = z;
    return a;
  }

  function translationXYZ(x, y, z) {
    return setTranslationXYZ(create(), x, y, z);
  }

  function setTranslationV(a, v) {
    return setTranslationXYZ(a, v[0], v[1], v[2]);
  }

  function translationV(v) {
    return setTranslationV(create(), v);
  }

  function translateXYZ(a, x, y, z) {
    a[9] += x;
    a[10] += y;
    a[11] += z;
    return a;
  }

  function translateV(a, v) {
    return translateXYZ(a, v[0], v[1], v[2]);
  }

  function setRotationX(m, a) {
    var c = cos(a),
        s = sin(a);
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = c;
    m[5] = s;
    m[6] = 0;
    m[7] = -s;
    m[8] = c;
    m[9] = 0;
    m[10] = 0;
    m[11] = 0;
    return m;
  }

  function setRotationY(m, a) {
    var c = cos(a),
        s = sin(a);
    m[0] = c;
    m[1] = 0;
    m[2] = -s;
    m[3] = 0;
    m[4] = 1;
    m[5] = 0;
    m[6] = s;
    m[7] = 0;
    m[8] = c;
    m[9] = 0;
    m[10] = 0;
    m[11] = 0;
    return m;
  }

  function setRotationZ(m, a) {
    var c = cos(a),
        s = sin(a);
    m[0] = c;
    m[1] = s;
    m[2] = 0;
    m[3] = -s;
    m[4] = c;
    m[5] = 0;
    m[6] = 0;
    m[7] = 0;
    m[8] = 1;
    m[9] = 0;
    m[10] = 0;
    m[11] = 0;
    return m;
  }

  function setRotationAxisAngle(m, v) {
    return setRotationAxisAngleXYZ(m, v[0], v[1], v[2]);
  }

  function setRotationAxisAngleScale(m, v, s) {
    return setRotationAxisAngleXYZ(m, v[0] * s, v[1] * s, v[2] * s);
  }

  function setRotationAxisAngleXYZ(m, vx, vy, vz) {
    var a = _Vec2.default.lenXYZ(vx, vy, vz);

    if (-1e-4 < a && a < 1e-4) {
      return setIdentity(m);
    } else {
      var ux = vx / a;
      var uy = vy / a;
      var uz = vz / a;
      var psin = sin(a);
      var pcos = cos(a);
      var ncos = 1 - pcos;
      m[0] = pcos + ux * ux * ncos;
      m[1] = ux * uy * ncos - uz * psin;
      m[2] = ux * uz * ncos + uy * psin;
      m[3] = uy * ux * ncos + uz * psin;
      m[4] = pcos + uy * uy * ncos;
      m[5] = uy * uz * ncos - ux * psin;
      m[6] = uz * ux * ncos - uy * psin;
      m[7] = uz * uy * ncos + ux * psin;
      m[8] = pcos + uz * uz * ncos;
      m[9] = 0;
      m[10] = 0;
      m[11] = 0;
      return m;
    }
  }

  function rotationX(a) {
    return setRotationX(create(), a);
  }

  function rotationY(a) {
    return setRotationY(create(), a);
  }

  function rotationZ(a) {
    return setRotationZ(create(), a);
  }

  function rotationAxisAngle(v) {
    return setRotationAxisAngle(create(), v);
  }

  function rotationAxisAngleScale(v) {
    return setRotationAxisAngleScale(create(), v);
  }

  function rotationAxisAngleXYZ(x, y, z) {
    return setRotationAxisAngleXYZ(create(), x, y, z);
  }

  function rotVecTo(to, v, s) {
    var vx = v[0],
        vy = v[1],
        vz = v[2];
    to[0] = vx * s[0] + vy * s[3] + vz * s[6];
    to[1] = vx * s[1] + vy * s[4] + vz * s[7];
    to[2] = vx * s[2] + vy * s[5] + vz * s[8];
    return to;
  }

  function rotVecIP(v, s) {
    return rotVecTo(v, v, s);
  }

  function mulVecTo(to, v, s) {
    var vx = v[0],
        vy = v[1],
        vz = v[2];
    to[0] = vx * s[0] + vy * s[3] + vz * s[6] + s[9];
    to[1] = vx * s[1] + vy * s[4] + vz * s[7] + s[10];
    to[2] = vx * s[2] + vy * s[5] + vz * s[8] + s[11];
    return to;
  }

  function mulVecIP(v, s) {
    return mulVecTo(v, v, s);
  }

  function mulTo(to, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a10 = a[3],
        a11 = a[4],
        a12 = a[5],
        a20 = a[6],
        a21 = a[7],
        a22 = a[8],
        a30 = a[9],
        a31 = a[10],
        a32 = a[11],
        b00 = b[0],
        b01 = b[1],
        b02 = b[2],
        b10 = b[3],
        b11 = b[4],
        b12 = b[5],
        b20 = b[6],
        b21 = b[7],
        b22 = b[8],
        b30 = b[9],
        b31 = b[10],
        b32 = b[11];
    to[0] = a00 * b00 + a01 * b10 + a02 * b20;
    to[1] = a00 * b01 + a01 * b11 + a02 * b21;
    to[2] = a00 * b02 + a01 * b12 + a02 * b22;
    to[3] = a10 * b00 + a11 * b10 + a12 * b20;
    to[4] = a10 * b01 + a11 * b11 + a12 * b21;
    to[5] = a10 * b02 + a11 * b12 + a12 * b22;
    to[6] = a20 * b00 + a21 * b10 + a22 * b20;
    to[7] = a20 * b01 + a21 * b11 + a22 * b21;
    to[8] = a20 * b02 + a21 * b12 + a22 * b22;
    to[9] = a30 * b00 + a31 * b10 + a32 * b20 + b30;
    to[10] = a30 * b01 + a31 * b11 + a32 * b21 + b31;
    to[11] = a30 * b02 + a31 * b12 + a32 * b22 + b32;
    return to;
  }

  function mulIP(a, b) {
    return mulTo(a, a, b);
  }

  function transposeTo(to, a) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5],
        a6 = a[6],
        a7 = a[7],
        a8 = a[8];
    to[0] = a0;
    to[1] = a3;
    to[2] = a6;
    to[3] = a1;
    to[4] = a4;
    to[5] = a7;
    to[6] = a2;
    to[7] = a5;
    to[8] = a8;
    return to;
  }

  function invertTo(to, a) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5],
        a6 = a[6],
        a7 = a[7],
        a8 = a[8],
        a9 = a[9],
        a10 = a[10],
        a11 = a[11];
    to[0] = a0;
    to[1] = a3;
    to[2] = a6;
    to[3] = a1;
    to[4] = a4;
    to[5] = a7;
    to[6] = a2;
    to[7] = a5;
    to[8] = a8;
    to[9] = -a9 * a0 - a10 * a1 - a11 * a2;
    to[10] = -a9 * a3 - a10 * a4 - a11 * a5;
    to[11] = -a9 * a6 - a10 * a7 - a11 * a8;
    return to;
  }

  function getX(to, s) {
    to[0] = s[0];
    to[1] = s[1];
    to[2] = s[2];
    return to;
  }

  function getY(to, s) {
    to[0] = s[3];
    to[1] = s[4];
    to[2] = s[5];
    return to;
  }

  function getZ(to, s) {
    to[0] = s[6];
    to[1] = s[7];
    to[2] = s[8];
    return to;
  }

  function getT(to, s) {
    to[0] = s[9];
    to[1] = s[10];
    to[2] = s[11];
    return to;
  }

  function setRotationVecs(to, r0, r1, r2) {
    to[0] = r0[0];
    to[1] = r0[1];
    to[2] = r0[2];
    to[3] = r1[0];
    to[4] = r1[1];
    to[5] = r1[2];
    to[6] = r2[0];
    to[7] = r2[1];
    to[8] = r2[2];
    to[9] = 0;
    to[10] = 0;
    to[11] = 0;
    return to;
  }

  exports.default = {
    DIMS: 3,
    create: create,
    set: set,
    copy: copy,

    rotVecTo: rotVecTo,
    rotVecIP: rotVecIP,
    mulVecTo: mulVecTo,
    mulVecIP: mulVecIP,
    mulTo: mulTo,
    mulIP: mulIP,

    getX: getX,
    getY: getY,
    getZ: getZ,
    getT: getT,

    identity: identity,
    setIdentity: setIdentity,

    setTranslationXYZ: setTranslationXYZ,
    setTranslationV: setTranslationV,
    translationXYZ: translationXYZ,
    translationV: translationV,
    translateXYZ: translateXYZ,
    translateV: translateV,

    setRotationX: setRotationX,
    setRotationY: setRotationY,
    setRotationZ: setRotationZ,
    setRotationAxisAngle: setRotationAxisAngle,
    setRotationAxisAngleScale: setRotationAxisAngleScale,
    setRotationAxisAngleXYZ: setRotationAxisAngleXYZ,

    rotationX: rotationX,
    rotationY: rotationY,
    rotationZ: rotationZ,

    rotationAxisAngle: rotationAxisAngle,
    rotationAxisAngleScale: rotationAxisAngleScale,
    rotationAxisAngleXYZ: rotationAxisAngleXYZ,

    transposeTo: transposeTo,
    invertTo: invertTo,

    setRotationVecs: setRotationVecs
  };
});

"use strict";

define("/math/Sim3Etc", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var sqrt = _Math.sqrt;

  function getTDist2(a, b) {
    var dx = a[9] - b[9];
    var dy = a[10] - b[10];
    var dz = a[11] - b[11];
    return dx * dx + dy * dy + dz * dz;
  }

  function getTDist(a, b) {
    return sqrt(getTDist2(a, b));
  }

  exports.default = {
    getTDist2: getTDist2,
    getTDist: getTDist
  };
});

"use strict";

define("/math/Vec2", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var cos = _Math.cos;
  var sin = _Math.sin;
  var sqrt = _Math.sqrt;

  function create() {
    return new Float32Array(2);
  }

  function clone(v) {
    return set(create(), v);
  }

  function array(cnt) {
    var buffer = new Float32Array(2 * cnt);
    var res = new Array(cnt);

    for (var i = 0; i < cnt; i++) {
      res[i] = buffer.subarray(2 * i, 2 * i + 2);
    }

    return res;
  }

  function add_(output, a, b) {
    output[0] = a[0] + b[0];
    output[1] = a[1] + b[1];
    return output;
  }

  function sub_(output, a, b) {
    output[0] = a[0] - b[0];
    output[1] = a[1] - b[1];
    return output;
  }

  function scale_(output, v, s) {
    output[0] = v[0] * s;
    output[1] = v[1] * s;
    return output;
  }

  function cmul_(output, a, b) {
    var ax = a[0],
        ay = a[1],
        bx = b[0],
        by = b[1];
    output[0] = ax * bx - ay * by;
    output[1] = ax * by + ay * bx;
    return output;
  }

  function set(output, v) {
    output.set(v, 0);
    return output;
  }

  function setXY(output, x, y) {
    output[0] = x;
    output[1] = y;
    return output;
  }

  function setA(output, angle) {
    return setXY(output, cos(angle), sin(angle));
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }

  function cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  }

  function len2(v) {
    return dot(v, v);
  }

  function len(v) {
    return sqrt(len2(v));
  }

  function add(a, b) {
    return add_(a, a, b);
  }

  function sub(a, b) {
    return sub_(a, a, b);
  }

  function scale(v, s) {
    return scale_(v, v, s);
  }

  function cmul(a, b) {
    return cmul_(a, a, b);
  }

  function createXY(x, y) {
    return setXY(create(), x, y);
  }

  function createA(angle) {
    return setA(create(), angle);
  }

  function right_(output, v) {
    var vx = v[0],
        vy = v[1];
    output[0] = -vy;
    output[1] = vx;
    return output;
  }

  function right(v) {
    return right_(v, v);
  }

  exports.default = {
    ELEMENTS: 2,
    create: create,
    array: array,
    clone: clone,
    createXY: createXY,
    createA: createA,
    set: set,
    setXY: setXY,
    setA: setA,
    add_: add_,
    sub_: sub_,
    scale_: scale_,
    right_: right_,
    cmul_: cmul_,
    add: add,
    sub: sub,
    scale: scale,
    right: right,
    cmul: cmul,
    dot: dot,
    cross: cross,
    len2: len2,
    len: len
  };
});

"use strict";

define("/math/Vec3", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var sqrt = _Math.sqrt;

  function create() {
    return new Float64Array(3);
  }

  function array(n) {
    var r = new Array(n);

    for (var i = 0; i < n; i++) {
      r[i] = create();
    }

    return r;
  }

  function setXYZ(to, x, y, z) {
    to[0] = x;
    to[1] = y;
    to[2] = z;
    return to;
  }

  function addTo(to, a, b) {
    to[0] = a[0] + b[0];
    to[1] = a[1] + b[1];
    to[2] = a[2] + b[2];
    return to;
  }

  function add(a, b) {
    return addTo(create(), a, b);
  }

  function addIP(a, b) {
    return addTo(a, a, b);
  }

  function subTo(to, a, b) {
    to[0] = a[0] - b[0];
    to[1] = a[1] - b[1];
    to[2] = a[2] - b[2];
    return to;
  }

  function sub(a, b) {
    return subTo(create(), a, b);
  }

  function subIP(a, b) {
    return subTo(a, a, b);
  }

  function lerpTo(to, a, b, t) {
    var it = 1 - t;
    to[0] = a[0] * it + b[0] * t;
    to[1] = a[1] * it + b[1] * t;
    to[2] = a[2] * it + b[2] * t;
    return to;
  }

  function lerpIP(a, b, t) {
    return lerpTo(a, a, b, t);
  }

  function lerp(a, b, t) {
    return lerpTo(create(), a, b, t);
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function dotXYZ(a, x, y, z) {
    return a[0] * x + a[1] * y + a[2] * z;
  }

  function scaleTo(to, a, s) {
    to[0] = a[0] * s;
    to[1] = a[1] * s;
    to[2] = a[2] * s;
    return to;
  }

  function scaleIP(a, s) {
    return scaleTo(a, a, s);
  }

  function scale(a, s) {
    return scaleTo(create(), a, s);
  }

  function len2(a) {
    return dot(a, a);
  }

  function len(a) {
    return sqrt(len2(a));
  }

  function len2XYZ(x, y, z) {
    return x * x + y * y + z * z;
  }

  function lenXYZ(x, y, z) {
    return sqrt(len2XYZ(x, y, z));
  }

  function dist2(a, b) {
    var d0 = a[0] - b[0];
    var d1 = a[1] - b[1];
    var d2 = a[2] - b[2];
    return d0 * d0 + d1 * d1 + d2 * d2;
  }

  function dist(a, b) {
    return sqrt(dist2(a, b));
  }

  function copy(a) {
    return copyTo(create(), a);
  }

  function copyTo(r, a) {
    r[0] = a[0];
    r[1] = a[1];
    r[2] = a[2];
    return r;
  }

  function unit(dir) {
    return unitSet(create(), dir);
  }

  function unitSet(a, dir) {
    a[0] = 0;
    a[1] = 0;
    a[2] = 0;
    a[dir] = 1;
    return a;
  }

  function crossTo(to, a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        b0 = b[0],
        b1 = b[1],
        b2 = b[2];
    to[0] = a1 * b2 - a2 * b1;
    to[1] = a2 * b0 - a0 * b2;
    to[2] = a0 * b1 - a1 * b0;
    return to;
  }

  function crossIP(a, b) {
    return crossTo(a, a, b);
  }

  function cross(a, b) {
    return crossTo(create(), a, b);
  }

  function normalizeTo(to, a) {
    return scaleTo(to, a, 1 / len(a));
  }

  function normalize(a) {
    return normalizeTo(create(), a);
  }

  function normalizeIP(a) {
    return normalizeTo(a, a);
  }

  exports.default = {
    DIMS: 3,
    create: create,
    array: array,

    setXYZ: setXYZ,
    unit: unit,
    unitSet: unitSet,

    copy: copy,
    copyTo: copyTo,

    scale: scale,
    scaleTo: scaleTo,
    scaleIP: scaleIP,

    lerp: lerp,
    lerpTo: lerpTo,
    lerpIP: lerpIP,

    dot: dot,
    dotXYZ: dotXYZ,

    cross: cross,
    crossTo: crossTo,
    crossIP: crossIP,

    add: add,
    addTo: addTo,
    addIP: addIP,

    sub: sub,
    subTo: subTo,
    subIP: subIP,

    len: len,
    len2: len2,
    dist: dist,
    dist2: dist2,
    lenXYZ: lenXYZ,
    len2XYZ: len2XYZ,

    normalize: normalize,
    normalizeTo: normalizeTo,
    normalizeIP: normalizeIP
  };
});

"use strict";

define("/math/Vec3Etc", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var sqrt = _Math.sqrt;
  var random = _Math.random;

  function setRandomUnit(v) {
    var x, y, z;

    for (var i = 0; i < 20; i++) {
      x = random() * 2 - 1;
      y = random() * 2 - 1;
      z = random() * 2 - 1;
      var l2 = x * x + y * y + z * z;

      if (l2 <= 1 && l2 > 1e-4) {
        var l = sqrt(l2);
        v[1] = x / l;
        v[2] = y / l;
        v[3] = z / l;
        return v;
      }
    }

    v[0] = 0;
    v[1] = 0;
    v[2] = 0;
    return v;
  }

  function uniformInSphere(x) {
    var idx = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var radius = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    for (var i = 0; i < 20; i++) {
      var x0 = random() * 2 - 1;
      var x1 = random() * 2 - 1;
      var x2 = random() * 2 - 1;
      var l2 = x0 * x0 + x1 * x1 + x2 * x2;

      if (l2 <= 1) {
        x[idx + 0] = x0 * radius;
        x[idx + 1] = x1 * radius;
        x[idx + 2] = x2 * radius;
        return;
      }
    }

    x[idx + 0] = 0;
    x[idx + 1] = 0;
    x[idx + 2] = 0;
  }

  exports.default = {
    setRandomUnit: setRandomUnit,
    uniformInSphere: uniformInSphere
  };
});

"use strict";

define("/math/VecN", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var sqrt = _Math.sqrt;

  function dims(a) {
    return a.length;
  }

  function copyTo(to, a) {
    for (var i = 0; i < to.length; i++) {
      to[i] = a[i];
    }

    return to;
  }

  function addTo(to, a, b) {
    for (var i = 0, mi = a.length; i < mi; i++) {
      to[i] = a[i] + b[i];
    }

    return to;
  }

  function add(a, b) {
    return addTo(_alloc(a), a, b);
  }

  function subTo(to, a, b) {
    for (var i = 0, mi = a.length; i < mi; i++) {
      to[i] = a[i] - b[i];
    }

    return to;
  }

  function sub(a, b) {
    return subTo(_alloc(a), a, b);
  }

  function lerpTo(to, a, b, t) {
    var it = 1 - t;

    for (var i = 0, mi = a.length; i < mi; i++) {
      to[i] = a[i] * it + b[i] * t;
    }

    return to;
  }

  function dot(a, b) {
    var res = 0;

    for (var i = 0, mi = a.length; i < mi; i++) {
      res += a[i] * b[i];
    }

    return res;
  }

  function scaleTo(to, v, s) {
    for (var i = 0; i < v.length; i++) {
      to[i] = v[i] * s;
    }

    return to;
  }

  function scale(v, s) {
    return scaleTo(_alloc(v), v, s);
  }

  function len2(a) {
    var res = 0,
        ai;

    for (var i = 0, mi = a.length; i < mi; i++) {
      res += (ai = a[i]) * ai;
    }

    return res;
  }

  function len(a) {
    return sqrt(len2(a));
  }

  function dist2(a, b) {
    var res = 0;

    for (var i = 0, mi = a.length; i < mi; i++) {
      var ai = a[i] - b[i];
      res += ai * ai;
    }

    return res;
  }

  function dist(a, b) {
    return sqrt(dist2(a, b));
  }

  function copy(a) {
    return new Float64Array(a);
  }

  function zero(dims) {
    return alloc(dims);
  }

  function unit(dims, dir) {
    var res = zero(dims);
    res[dir] = 1;
    return res;
  }

  function alloc(dims) {
    return new Float64Array(dims);
  }

  function _alloc(other) {
    return new Float64Array(other.length);
  }

  function V() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Float64Array(args);
  }

  function make(args) {
    return new Float64Array(args);
  }

  function create(dims) {
    return new Float64Array(dims);
  }

  exports.default = {
    V: V,
    create: create,
    make: make,
    alloc: alloc,
    zero: zero,
    unit: unit,
    dims: dims,

    copy: copy,
    copyTo: copyTo,

    scaleTo: scaleTo,
    scale: scale,
    lerpTo: lerpTo,

    dot: dot,
    add: add,
    addTo: addTo,
    sub: sub,
    subTo: subTo,
    len: len,
    len2: len2,
    dist: dist,
    dist2: dist2
  };
});



'use strict';

define('/planning/algorithm/Prm', ['exports', '/math/NBox', '/math/NBoxTree', '/planning/utils/Helper', '/algorithm/UnionFind', '/algorithm/MultiMap', '/planning/utils/ConfigCost'], function (exports, _NBox, _NBoxTree, _Helper, _UnionFind, _MultiMap, _ConfigCost) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _NBox2 = _interopRequireDefault(_NBox);

    var _NBoxTree2 = _interopRequireDefault(_NBoxTree);

    var _Helper2 = _interopRequireDefault(_Helper);

    var _UnionFind2 = _interopRequireDefault(_UnionFind);

    var _MultiMap2 = _interopRequireDefault(_MultiMap);

    var _ConfigCost2 = _interopRequireDefault(_ConfigCost);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var FINE_TUNING_COEFF = 20;

    function Prm(map) {
        var self = this;
        var boxTree = new _NBoxTree2.default(map.sampleBounds);
        var Configuration = map.Configuration;
        var connectedSets = new _UnionFind2.default();
        var neighboursMap = new _MultiMap2.default();
        var edges = [];
        var samples = [];
        var startNode = Configuration.copy(map.target);
        var endNode = Configuration.copy(map.start);
        var conf_trial = Configuration.create();
        var lineChecker = new _Helper2.default.LineChecker(Configuration.create());
        putDot(startNode);
        putDot(endNode);

        function makeNeighbours(a, b) {
            neighboursMap.put(a, b);
            neighboursMap.put(b, a);
            connectedSets.union(a, b);
            edges.push([{
                pos: a
            }, {
                pos: b
            }]);

            if (connectedSets.same(startNode, endNode)) {
                self.hasSolution = true;
            }
        }

        function putDot(dot) {
            boxTree.putDot(dot);
            samples.push({
                pos: dot
            });
            Configuration.copyTo(conf_trial, dot);
            boxTree.enumerateInRange(dot, map.connectDistance, function (dotInTree, knownDistance2) {
                var dist = Math.sqrt(knownDistance2);
                var hitsWall = lineChecker.check(map.sampler, dot, dotInTree, map.checkResolution, dist, Configuration.lerpTo);

                if (!hitsWall) {
                    makeNeighbours(dot, dotInTree);
                }
            });
        }

        function putRandomDot() {
            var newDot = Configuration.create();
            Configuration.randomize(newDot, map.sampleBounds);
            self.samplesGenerated++;
            var nearest = boxTree.nearest(newDot);
            var goodSample = false;

            if (nearest) {
                var knownDistance = Configuration.dist(nearest, newDot);

                if (knownDistance > map.storeResolutionMax) {
                    if (!map.sampler.sample(newDot)) {
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
            _Helper2.default.iterate(self, putRandomDot, trialCount);
        }

        function getSolution() {
            var parentMap = _Helper2.default.dijkstra(endNode, startNode, neighboursMap, Configuration.dist);

            var result = _Helper2.default.pathToRoot(parentMap, startNode, function () {
                return 0.2;
            }, function (dot) {
                return new _ConfigCost2.default(dot, 0);
            });

            var result_path = result.path;

            for (var i = 1; i < result_path.length; i++) {
                result_path[i].cost = result_path[i - 1].cost + Configuration.dist(result_path[i - 1].config, result_path[i].config);
            }

            result.cost = result_path[result_path.length - 1].cost;
            return result;
        }

        this.samplesGenerated = 0;
        this.hasSolution = false;
        this.continueForever = false;
        this.wrongSampleCallback = null;
        this.edges = edges;
        this.samples = samples;
        this.iterate = iterate;
        this.conf_trial = conf_trial;
        this.getSolution = getSolution;
    }

    exports.default = Prm;
});

'use strict';

define('/planning/algorithm/RrtInc', ['exports', '/entry/Config', '/algorithm/Heap', '/math/NBox', '/math/NBoxTree', '/planning/utils/Helper', '/planning/utils/ConfigCost', '/utils/order'], function (exports, _Config, _Heap, _NBox, _NBoxTree, _Helper, _ConfigCost, _order) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Config2 = _interopRequireDefault(_Config);

  var _Heap2 = _interopRequireDefault(_Heap);

  var _NBox2 = _interopRequireDefault(_NBox);

  var _NBoxTree2 = _interopRequireDefault(_NBoxTree);

  var _Helper2 = _interopRequireDefault(_Helper);

  var _ConfigCost2 = _interopRequireDefault(_ConfigCost);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var itemCmp = (0, _order.comparerByField)("score");

  function SampleItem(pos, parent) {
    this.pos = pos;
    this.fails = 0;
    this.parent = parent;
    this.cost = 0;
    this.score = 0;
    this.fails = 0;
    this.path_length = parent ? parent.path_length + 1 : 0;
    this.init_score = 0;
  }

  function choose_random(items) {
    var index = Math.floor((items.length - 0.0001) * Math.random());
    return items[index];
  }

  function RrtInc(myMap) {
    var _this = this;

    var samples = this.samples = [];
    var edges = this.edges = [];
    var sampleHeap = new _Heap2.default();
    this.map = myMap;
    var rejected_by_crowd_count = 0;
    var quad = new _NBoxTree2.default(myMap.sampleBounds);
    var trialCount = 0;
    var target = myMap.target;
    var Configuration = myMap.Configuration;
    var ConfigurationInput = myMap.ConfigurationInput;
    var storeResolutionMin = myMap.storeResolutionMin;
    var storeResolutionMax = myMap.storeResolutionMax;
    var storeResolutionGradient = myMap.storeResolutionGradient;
    var checkResolution = myMap.checkResolution;
    var targetDistance = myMap.targetDistance;
    var targetDistance2 = targetDistance * targetDistance;
    var localSampler = myMap.sampler;
    var solutionSample = null;
    var TEMP_INPUT = ConfigurationInput.create();
    var TEMP_CONF = Configuration.create();
    var TEMP_CONF2 = Configuration.create();
    var NEARING_TRIALS = 2;
    var best_best_dist = Configuration.dist(myMap.start, target);
    var greediness = 0.5;
    putNewItemByPosAndDCost(myMap.start, null, 0);

    function setItemInitialScore(item) {
      itemProcessInitScore(item);
      item.score = item.init_score * 5;
    }

    function putNewItemByPosAndDCost(dot, parent, dcost) {
      dot = Configuration.copy(dot);

      if (putDotInTree(dot)) {
        var best_dist = Configuration.dist(dot, target);
        best_best_dist = Math.min(best_best_dist, best_dist);

        if (_Config2.default.DEBUG_GREEDY) {
          console.log('nearest: ' + best_best_dist);
        }

        var item = new SampleItem(dot, parent);
        item.cost = (parent ? parent.cost : 0) + dcost;
        setItemInitialScore(item);
        samples.push(item);
        putItemToHeap(item);

        if (parent) {
          edges.push([parent, item]);
        }

        return item;
      } else {
        return null;
      }
    }

    var lineChecker = new _Helper2.default.LineChecker(Configuration.create());

    function verifyDot(item, edot, max_dist) {
      var p = item.pos;

      if (quad.hasInRange(edot, max_dist)) {
        rejected_by_crowd_count++;
        return false;
      } else {
        return !lineChecker.check(localSampler, p, edot, checkResolution, undefined, Configuration.lerpTo);
      }
    }

    function chooseByScore() {
      return sampleHeap.popValue();
    }

    function putItemToHeap(item) {
      sampleHeap.push(item.score, item);
    }

    function clamp(val, mn, mx) {
      return Math.max(Math.min(val, mx), mn);
    }

    function itemProcessInitScore(item) {
      item.init_score = (Configuration.dist(item.pos, target) - best_best_dist) * 2 + Math.pow(item.path_length, 1.1) * 0.05;
    }

    function itemUpdateSuccess(item) {
      itemProcessInitScore(item);
      item.score += item.init_score * 0.5;
    }

    function itemUpdateFail(item) {
      itemProcessInitScore(item);
      item.fails++;
      item.score += item.fails * (item.init_score + 1);
    }

    function processRandomItem(item) {
      var best_conf = null,
          best_dist = 0,
          best_dt = 0;
      var current_conf = null,
          current_dist = 0;

      for (var i = 0; i < NEARING_TRIALS; i++) {
        ConfigurationInput.randomize(TEMP_INPUT);
        current_conf = Configuration.copyTo(TEMP_CONF, item.pos);
        ConfigurationInput.applyIP(current_conf, TEMP_INPUT);
        current_dist = Configuration.dist(current_conf, target);
        var store_res = clamp(current_dist * storeResolutionGradient, storeResolutionMin, storeResolutionMax);

        if (verifyDot(item, current_conf, store_res)) {
          if (!best_conf || current_dist < best_dist) {
            best_conf = Configuration.copyTo(TEMP_CONF2, current_conf);
            best_dist = current_dist;
            best_dt = ConfigurationInput.costOf(TEMP_INPUT);
          }
        }
      }

      Configuration.copyTo(_this.conf_trial, best_conf || current_conf);

      if (best_conf) {
        var newItem = putNewItemByPosAndDCost(best_conf, item, best_dt, best_dist);
        _this.samplesSaved++;

        if (newItem) {
          if (best_dist < targetDistance) {
            _this.hasSolution = true;
            solutionSample = newItem;
          }
        }

        itemUpdateSuccess(item);
      } else {
        if (_this.wrongSampleCallback) {
          _this.wrongSampleCallback(current_conf);
        }

        itemUpdateFail(item);
      }
    }

    function putRandomDot() {
      trialCount++;

      if (Math.random() < greediness) {
        var item = chooseByScore();
        processRandomItem(item);
        putItemToHeap(item);
      } else {
        processRandomItem(choose_random(samples));
      }
    }

    function putDotInTree(dot) {
      return quad.tryPutDot(dot, 0);
    }

    function iterate(sampleCnt) {
      _Helper2.default.iterate(_this, putRandomDot, sampleCnt);
    }

    function getSolution() {
      return _Helper2.default.pathToRoot({
        get: function get(item) {
          return item.parent;
        }
      }, solutionSample, function (i) {
        return i.cost;
      }, function (item) {
        return new _ConfigCost2.default(item.pos, item.cost);
      });
    }

    this.conf_trial = Configuration.create();
    this.samplesGenerated = 0;
    this.samplesSaved = 0;
    this.continueForever = false;
    this.hasSolution = false;
    this.wrongSampleCallback = null;
    this.iterate = iterate;
    this.getSolution = getSolution;
  }

  exports.default = RrtInc;
});

'use strict';

define('/planning/algorithm/RrtVoronoi', ['exports', '/entry/Config', '/math/VecN', '/math/NBox', '/math/NBoxTree', '/planning/utils/Helper', '/planning/utils/ConfigCost'], function (exports, _Config, _VecN, _NBox, _NBoxTree, _Helper, _ConfigCost) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Config2 = _interopRequireDefault(_Config);

  var _VecN2 = _interopRequireDefault(_VecN);

  var _NBox2 = _interopRequireDefault(_NBox);

  var _NBoxTree2 = _interopRequireDefault(_NBoxTree);

  var _Helper2 = _interopRequireDefault(_Helper);

  var _ConfigCost2 = _interopRequireDefault(_ConfigCost);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SampleItem = function SampleItem(parent, config, cost) {
    _classCallCheck(this, SampleItem);

    this.parent = parent;
    this.pos = config;
    this.cost = cost;
  };

  function clamp(val, mn, mx) {
    return Math.max(Math.min(val, mx), mn);
  }

  var RrtVoronoi = (function () {
    function RrtVoronoi(map) {
      _classCallCheck(this, RrtVoronoi);

      this.myMap = map;
      this.boxTree = new _NBoxTree2.default(map.sampleBounds.fatten(2));
      this.greediness = 0.05;
      this.solutionNode = null;
      this.itemMap = new Map();
      this.samples = [];
      this.targetDistance2 = map.targetDistance * map.targetDistance;
      this.Configuration = map.Configuration;
      this.ConfigurationInput = map.ConfigurationInput;
      this.TEMP_INPUT = this.ConfigurationInput.create();
      this.TEMP_INPUT2 = this.ConfigurationInput.create();
      this.TEMP_CONFIG = this.Configuration.create();
      this.TEMP_CONFIG2 = this.Configuration.create();
      this.TEMP_CONFIG3 = this.Configuration.create();
      this.NEARING_TRIALS = 3;
      this.samplesGenerated = 0;
      this.continueForever = false;
      this.samplesSaved = 0;
      this.wrongSampleCallback = null;
      this.hasSolution = false;
      this.conf_trial = this.Configuration.create();
      this.conf_near = this.Configuration.create();
      this.conf_gen = this.Configuration.create();
      this.trialDist = 1e50;
      this.lineChecker = new _Helper2.default.LineChecker(this.Configuration.create());
      this.putConfig(map.start, null, 0);
    }

    _createClass(RrtVoronoi, [{
      key: 'putConfig',
      value: function putConfig(config, parent_dot, cost) {
        var Configuration = this.Configuration;
        config = Configuration.copy(config);
        this.boxTree.putDot(config);
        var len2 = Configuration.dist2(this.myMap.target, config);

        if (len2 < this.targetDistance2) {
          this.solutionNode = config;
          this.hasSolution = true;
        }

        var parent = this.itemMap.get(parent_dot) || null;
        var sampleitem = new SampleItem(parent, config, (parent ? parent.cost : 0) + cost);
        this.itemMap.set(config, sampleitem);
        this.samples.push(sampleitem);
      }
    }, {
      key: 'putRandomDot',
      value: function putRandomDot() {
        var myMap = this.myMap;
        var Configuration = this.Configuration;
        var ConfigurationInput = this.ConfigurationInput;
        var temp,
            i,
            saved_dist,
            current_dist,
            saved_cost = 0;
        var config_random_target = this.TEMP_CONFIG;
        var config_saved = this.TEMP_CONFIG2;
        var config_current = this.TEMP_CONFIG3;
        var input_saved = this.TEMP_INPUT;
        var input_current = this.TEMP_INPUT2;
        var isGreedyIteration = Math.random() < this.greediness;

        if (isGreedyIteration) {
          Configuration.copyTo(config_random_target, myMap.target);
        } else {
          Configuration.randomize(config_random_target, myMap.sampleBounds);
          this.samplesGenerated++;
        }

        var nearest = this.boxTree.nearest(config_random_target);
        Configuration.copyTo(this.conf_gen, config_random_target);
        Configuration.copyTo(this.conf_near, nearest);
        var goodSample = false;

        if (_Config2.default.DEBUG_GREEDY && isGreedyIteration) {
          Configuration.copyTo(config_saved, nearest);
          var prev_best_dist = Configuration.dist(config_saved, config_random_target);
          console.log('greedy: ' + prev_best_dist + ' ' + this.boxTree.check());
        }

        ConfigurationInput.randomize(input_saved);
        ConfigurationInput.applyTo(config_saved, nearest, input_saved);
        saved_dist = Configuration.dist(config_saved, config_random_target);
        saved_cost = ConfigurationInput.costOf(input_saved);

        for (i = 0; i < this.NEARING_TRIALS; i++) {
          ConfigurationInput.randomize(input_current);
          ConfigurationInput.applyTo(config_current, nearest, input_current);
          current_dist = Configuration.dist(config_current, config_random_target);

          if (current_dist < saved_dist) {
            saved_cost = ConfigurationInput.costOf(input_current);
            saved_dist = current_dist;

            _VecN2.default.copyTo(config_saved, config_current);

            _VecN2.default.copyTo(input_saved, input_current);
          }
        }

        Configuration.copyTo(this.conf_trial, config_saved);
        var nextNearest = this.boxTree.nearest(config_saved);
        var nextDist = Configuration.dist(nextNearest, config_saved);
        var store_res = clamp(saved_dist * myMap.storeResolutionGradient, myMap.storeResolutionMin, myMap.storeResolutionMax);

        if (nextDist > store_res) {
          var hitsWall = this.lineChecker.check(myMap.sampler, nearest, config_saved, myMap.checkResolution, undefined, Configuration.lerpTo);

          if (!hitsWall) {
            goodSample = true;
            this.putConfig(config_saved, nearest, saved_cost);
            this.samplesSaved++;
          }
        }

        if (!goodSample && this.wrongSampleCallback) {
          this.wrongSampleCallback(Configuration.copy(config_saved));
        }
      }
    }, {
      key: 'iterate',
      value: function iterate(trialCount) {
        var _this = this;

        _Helper2.default.iterate(this, function () {
          return _this.putRandomDot();
        }, trialCount);
      }
    }, {
      key: 'getSolution',
      value: function getSolution() {
        return _Helper2.default.pathToRoot({
          get: function get(item) {
            return item.parent;
          }
        }, this.itemMap.get(this.solutionNode), function (item) {
          return item.cost;
        }, function (item) {
          return new _ConfigCost2.default(item.pos, item.cost);
        });
      }
    }]);

    return RrtVoronoi;
  })();

  exports.default = RrtVoronoi;
});


"use strict";

define("/planning/utils/ConfigCost", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ConfigCost = function ConfigCost(config, cost) {
    _classCallCheck(this, ConfigCost);

    this.config = config;
    this.cost = cost;
  };

  exports.default = ConfigCost;
});

'use strict';

define('/planning/utils/Helper', ['exports', '/math/VecN', '/algorithm/Heap'], function (exports, _VecN, _Heap) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _VecN2 = _interopRequireDefault(_VecN);

    var _Heap2 = _interopRequireDefault(_Heap);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    var LineChecker = (function () {
        function LineChecker(temp_config) {
            _classCallCheck(this, LineChecker);

            this.temp_config = temp_config;
        }

        _createClass(LineChecker, [{
            key: 'check',
            value: function check(sampler, start, end, step, knownDistance, lerpTo) {
                if (step === undefined) step = 1;
                if (knownDistance === undefined) knownDistance = _VecN2.default.dist(start, end);
                var temp1 = this.temp_config;
                var inters = true;
                var inc = step / knownDistance;

                for (var i = inc; i < 1; i += inc) {
                    lerpTo(temp1, start, end, i);

                    if (sampler.sample(temp1)) {
                        inters = false;
                        break;
                    }
                }

                return !inters || sampler.sample(end);
            }
        }]);

        return LineChecker;
    })();

    function randomDotInBox(nbox, dot, dims) {
        for (var i = 0; i < dims; i++) {
            dot[i] = Math.random() * nbox.width(i) + nbox.min[i];
        }

        return dot;
    }

    function identity(x) {
        return x;
    }

    function pathToRoot(parentMap, aNode, costFn) {
        var mapperFn = arguments.length <= 3 || arguments[3] === undefined ? identity : arguments[3];
        var p = aNode;

        if (p) {
            var path = [];

            for (;;) {
                path.unshift(mapperFn(p));
                var parent = parentMap.get(p);
                if (!parent) break;
                p = parent;
            }

            return {
                cost: costFn(aNode),
                path: path
            };
        } else {
            return null;
        }
    }

    function fnOrMap(fnOrMap) {
        return typeof fnOrMap === 'function' ? fnOrMap : function (key) {
            return fnOrMap.get(key);
        };
    }

    function dijkstra(startNode, endNode, neighboursMap, distFn) {
        var item;
        var queue = new _Heap2.default();
        var parentMap = new Map();
        queue.push(0, [null, startNode]);

        while (item = queue.popEntry()) {
            var current = item.value[1];

            if (!parentMap.has(current)) {
                parentMap.set(current, item.value[0]);

                if (current === endNode) {
                    break;
                } else {
                    var total = item.key;
                    if (!item) break;
                    neighboursMap.get(current).forEach(function (neigh) {
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

    exports.default = {
        LineChecker: LineChecker,
        randomDotInBox: randomDotInBox,
        pathToRoot: pathToRoot,
        iterate: iterate,
        fnOrMap: fnOrMap,
        dijkstra: dijkstra
    };
});


"use strict";

define("/shim/babylon", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = self.BABYLON;
});

"use strict";

define("/shim/threejs", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = self.THREE;
});


'use strict';

define('/utils/MeasureHelper', ['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Measurement = function Measurement() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var samples = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var storage = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var cost = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
    var timeout = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

    _classCallCheck(this, Measurement);

    this.time = time;
    this.samples = samples;
    this.storage = storage;
    this.cost = cost;
    this.timeout = timeout;
  };

  var MeasuringProcess = (function () {
    function MeasuringProcess(parent) {
      _classCallCheck(this, MeasuringProcess);

      this.parent = parent;
      this.started = 0;
      this.finished = 0;
      this.total_time = 0;
      this.state = 0;
      this.measurement = null;
    }

    _createClass(MeasuringProcess, [{
      key: 'start',
      value: function start() {
        if (this.state === 0) {
          this.started = performance.now();
          this.state = 1;
        } else {
          console.warn('MeasuringProcess.start: invalid state');
        }
      }
    }, {
      key: '_end',
      value: function _end(msg, newstate, timeout) {
        if (this.state === 1) {
          this.finished = performance.now();
          this.state = newstate;
          var returnedCbInfo = this.parent.cbInfo();
          this.total_time = this._finish_timespan();
          this.measurement = new Measurement(this.total_time, returnedCbInfo.samples, returnedCbInfo.storage, returnedCbInfo.cost, timeout);
          this.parent.data.push(this.measurement);
          return this.measurement;
        } else {
          console.warn('MeasuringProcess.' + msg + ': invalid state');
        }
      }
    }, {
      key: 'end',
      value: function end() {
        return this._end('end', 2, false);
      }
    }, {
      key: 'timespan',
      value: function timespan() {
        return (performance.now() - this.started) * 0.001;
      }
    }, {
      key: '_finish_timespan',
      value: function _finish_timespan() {
        return (this.finished - this.started) * 0.001;
      }
    }, {
      key: 'inspectTo',
      value: function inspectTo(data) {
        if (this.measurement) {
          data.time = this.total_time;
          data.samples = this.measurement.samples;
          data.storage = this.measurement.storage;
        } else {
          var returnedCbInfo = this.parent.cbInfo();
          data.time = this.timespan();
          data.samples = returnedCbInfo.samples;
          data.storage = returnedCbInfo.storage;
        }
      }
    }, {
      key: 'endTimeout',
      value: function endTimeout() {
        return this._end('endTimeout', 3, true);
      }
    }]);

    return MeasuringProcess;
  })();

  var MeasureHelper = (function () {
    function MeasureHelper(cbInfo) {
      _classCallCheck(this, MeasureHelper);

      this.data = [];
      this.cbInfo = cbInfo;
    }

    _createClass(MeasureHelper, [{
      key: 'start',
      value: function start() {
        var result = new MeasuringProcess(this);
        result.start();
        return result;
      }
    }]);

    return MeasureHelper;
  })();

  exports.default = MeasureHelper;
});

"use strict";

define("/utils/databind", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function updateArray(dest, source, def, param) {
    var i,
        source_length = source ? source.length : 0;

    if (dest.length > source_length) {
      for (i = dest.length; i < source_length; i++) {
        def.remove(dest[i], param);
      }

      dest.length = source_length;
    } else if (dest.length < source_length) {
      i = dest.length;
      dest.length = source_length;

      for (; i < dest.length; i++) {
        dest[i] = def.create(source[i], param);
      }
    }

    for (i = 0; i < dest.length; i++) {
      def.update(dest[i], source[i], param);
    }
  }

  exports.default = {
    updateArray: updateArray
  };
});

"use strict";

define("/utils/dicts", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default_dict = default_dict;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var DefaultDict = exports.DefaultDict = (function () {
    function DefaultDict(values, def) {
      _classCallCheck(this, DefaultDict);

      this.values = values;
      this.def = def;
    }

    _createClass(DefaultDict, [{
      key: "get",
      value: function get(key) {
        return this.values.has(key) ? this.values.get(key) : this.def;
      }
    }, {
      key: "set",
      value: function set(key, val) {
        return this.values.set(key, val);
      }
    }, {
      key: "has",
      value: function has(key) {
        return this.values.has(key);
      }
    }, {
      key: "delete",
      value: function _delete(key) {
        return this.values.delete(key);
      }
    }]);

    return DefaultDict;
  })();

  ;

  function dict(obj) {
    var result = new Map();

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result.set(key, obj[key]);
      }
    }

    return result;
  }

  function default_dict(def, obj) {
    return new DefaultDict(dict(obj), def);
  }
});

"use strict";

define("/utils/lists", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _Math = Math;
  var min = _Math.min;
  var max = _Math.max;

  function generate(n, cb) {
    for (var i = 0, r = []; i < n; i++) {
      r.push(cb(i));
    }

    return r;
  }

  function selectAggregate(list, selector, aggregate) {
    var def = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
    if (list.length < 1) return def;
    var r = selector(list[0]);

    for (var i = 1; i < list.length; i++) {
      r = aggregate(r, selector(list[i]));
    }

    return r;
  }

  function selectMin(list, selector) {
    var def = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    return selectAggregate(list, selector, min, def);
  }

  function selectMax(list, selector) {
    var def = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    return selectAggregate(list, selector, max, def);
  }

  function aggregateBy(list, selector, aggregatePred, def) {
    if (list.length < 1) return def;
    var best_value = list[0];
    var best_score = selector(best_value);

    for (var i = 1; i < list.length; i++) {
      var c_value = list[i];
      var c_score = selector(c_value);

      if (aggregatePred(c_score, best_score)) {
        best_score = c_score;
        best_value = c_value;
      }
    }

    return best_value;
  }

  function firstLarger(a, b) {
    return a > b;
  }

  function firstSmaller(a, b) {
    return a < b;
  }

  function minBy(list, selector) {
    var def = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    return aggregateBy(list, selector, firstSmaller, def);
  }

  function maxBy(list, selector) {
    var def = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    return aggregateBy(list, selector, firstLarger, def);
  }

  function KeyValue(key, value) {
    this.key = key;
    this.value = value;
  }

  function sortedBy(list, selector) {
    return list.map(function (i) {
      return new KeyValue(selector(i), i);
    }).sort(function (a, b) {
      return a.key - b.key;
    }).map(function (i) {
      return i.value;
    });
  }

  exports.default = {
    generate: generate,

    selectAggregate: selectAggregate,
    selectMin: selectMin,
    selectMax: selectMax,
    sortedBy: sortedBy,

    firstLarger: firstLarger,
    firstSmaller: firstSmaller,
    minBy: minBy,
    maxBy: maxBy
  };
});

"use strict";

define("/utils/loaded", ["exports"], function (exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (cb) {
        setTimeout(function () {
            cb();
        }, 0);
    };
});

"use strict";

define("/utils/math", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var PI = exports.PI = Math.PI;
  var TWO_PI = exports.TWO_PI = 2 * PI;
  var DEG_TO_RAD = exports.DEG_TO_RAD = PI / 180;
  var RAD_TO_DEG = exports.RAD_TO_DEG = 180 / PI;
});

"use strict";

define("/utils/order", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.compare = compare;
  exports.comparerByField = comparerByField;
  exports.comparerBy = comparerBy;

  function compare(sa, sb) {
    return sa > sb ? 1 : sa < sb ? -1 : 0;
  }

  function comparerByField(field) {
    return function (a, b) {
      return compare(a[field], b[field]);
    };
  }

  function comparerBy(selector) {
    return function (a, b) {
      return compare(selector(a), selector(b));
    };
  }
});

'use strict';

define('/utils/query', ['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function get_params_from_url(query) {
    var result = new Map();
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      result.set(decodeURIComponent(pair[0]), decodeURIComponent(pair[1]));
    }

    return result;
  }

  function get_params() {
    return get_params_from_url(window.location.search.substring(1));
  }

  exports.default = {
    get_params: get_params, get_params_from_url: get_params_from_url
  };
});

"use strict";

define("/utils/utils", ["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function range(cnt, fn) {
    var a = new Array(cnt);

    for (var i = 0; i < cnt; i++) {
      a[i] = fn(i);
    }

    return a;
  }

  function times(cnt, x) {
    var a = new Array(cnt);

    for (var i = 0; i < cnt; i++) {
      a[i] = x;
    }

    return a;
  }

  function nvl(x, y) {
    return x !== undefined ? x : y;
  }

  exports.default = { range: range, times: times, nvl: nvl };
});


'use strict';

define('/view/DataContainer', ['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _typeof(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }

  function el(tagName, children, opt_class) {
    var r = document.createElement(tagName);
    children && children.forEach(function (e) {
      if (typeof e === 'string') e = document.createTextNode(e);
      r.appendChild(e);
    });
    if (opt_class) r.className = opt_class;
    return r;
  }

  var dataTable = null;

  function createDataTable() {
    var dataTable = el('table', [el('tr', [el('th', ['time']), el('th', ['samples']), el('th', ['storage']), el('th', ['cost']), el('th', ['timeout'])])], 'data-table');
    document.getElementById('data-container').appendChild(dataTable);
    return dataTable;
  }

  function ensureTable() {
    if (!dataTable) {
      dataTable = createDataTable();
    }

    return dataTable;
  }

  function isObject(o) {
    return !!((typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o);
  }

  function num_to_str(x) {
    return '' + (0 + x).toFixed(2);
  }

  function any_to_str(x) {
    return '' + x;
  }

  function appendDataToTable(data) {
    if (isObject(data)) {
      ensureTable().appendChild(el('tr', [el('td', [num_to_str(data.time)]), el('td', [any_to_str(data.samples)]), el('td', [any_to_str(data.storage)]), el('td', [num_to_str(data.cost)]), el('td', [data.timeout ? 'timeout' : ''])]));
    }
  }

  function setCurrentData(data) {
    document.getElementById('data-time').textContent = num_to_str(data.time);
    document.getElementById('data-samples').textContent = any_to_str(data.samples);
    document.getElementById('data-storage').textContent = any_to_str(data.storage);
  }

  exports.default = {
    appendDataToTable: appendDataToTable,
    setCurrentData: setCurrentData
  };
});
