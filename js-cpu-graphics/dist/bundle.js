(function () {
  'use strict';

  function assert(value) {
    if (!value) {
      throw new Error("Assertation error");
    }
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
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
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var TemplateNode = function TemplateNode() {
    classCallCheck(this, TemplateNode);

    this.value = null;
    this.hasValue = false;
    this.links = new Map();
  };

  var Template = function () {
    function Template(factory) {
      classCallCheck(this, Template);

      this.factory = factory;
      this.root = new TemplateNode();
    }

    createClass(Template, [{
      key: "get_item",
      value: function get_item() {
        var node = this.root;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var arg = _step.value;

            var next_node = node.links.get(arg);
            if (!next_node) {
              next_node = new TemplateNode();
              node.links.set(arg, next_node);
            }
            node = next_node;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!node.hasValue) {
          var _context;

          node.value = (_context = null, this.factory).bind(_context).apply(undefined, args);
          node.hasValue = true;
        }
        return node.value;
      }
    }]);
    return Template;
  }();

  function template(factory) {
    var cache = new Template(factory);
    return function () {
      return cache.get_item.apply(cache, arguments);
    };
  }

  function invalidTemplate(name) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var shown_name = name + JSON.stringify(args);
    return function InvalidTemplate() {
      throw new Error("InvalidTemplate: " + shown_name);
    };
  }

  function _set_item(v, i, x) {
    return v.buffer[i + v.offset] = x;
  }
  function _get_item(v, i) {
    return v.buffer[i + v.offset];
  }

  var Vector = template(function (n) {
    if (n < 1) {
      return invalidTemplate("Vector", n);
    }

    var item_count = n;
    function allocate_single() {
      return new Float64Array(n);
    }

    function new_vector() {
      return new VectorTemplate();
    }

    var VectorTemplate = function () {
      createClass(VectorTemplate, [{
        key: "set_to",
        value: function set_to() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return this.set_arr(args);
        }
      }, {
        key: "set_arr",
        value: function set_arr(args) {
          for (var i = 0; i < n; i++) {
            _set_item(this, i, args[i]);
          }
          return this;
        }
      }, {
        key: "clone_to",
        value: function clone_to(to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i));
          }
          return to;
        }
      }, {
        key: "assign",
        value: function assign(b) {
          for (var i = 0; i < n; i++) {
            _set_item(this, i, _get_item(b, i));
          }
          return this;
        }
      }, {
        key: "clone",
        value: function clone() {
          return this.clone_to(new_vector());
        }
      }, {
        key: "expand_to",
        value: function expand_to(e, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i));
          }
          _set_item(to, n, e);
          return to;
        }
      }, {
        key: "set_to_uniform",
        value: function set_to_uniform(x) {
          for (var i = 0; i < n; i++) {
            _set_item(this, i, x);
          }
          return this;
        }
      }, {
        key: "set_to_zero",
        value: function set_to_zero() {
          return this.set_to_uniform(0);
        }
      }, {
        key: "set_to_axis",
        value: function set_to_axis(i) {
          var s = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

          this.set_to_uniform(0);
          _set_item(this, i, s);
          return this;
        }
      }], [{
        key: "from",
        value: function from() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return new VectorTemplate().set_arr(args);
        }
      }, {
        key: "uniform",
        value: function uniform(x) {
          return new VectorTemplate().set_to_uniform(x);
        }
      }, {
        key: "zero",
        value: function zero() {
          return new VectorTemplate().set_to_zero();
        }
      }, {
        key: "axis",
        value: function axis(i) {
          var s = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

          return new VectorTemplate().set_to_axis(i, s);
        }
      }, {
        key: "N",
        get: function get() {
          return n;
        }
      }, {
        key: "SIZE",
        get: function get() {
          return item_count;
        }
      }]);

      function VectorTemplate() {
        var buffer = arguments.length <= 0 || arguments[0] === undefined ? allocate_single() : arguments[0];
        var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        classCallCheck(this, VectorTemplate);

        this.buffer = buffer;
        this.offset = offset;
      }

      createClass(VectorTemplate, [{
        key: "get_item",
        value: function get_item(i) {
          return _get_item(this, i);
        }
      }, {
        key: "set_item",
        value: function set_item(i, v) {
          return _set_item(this, i, v);
        }
      }, {
        key: "add_to",
        value: function add_to(b, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i) + _get_item(b, i));
          }
          return to;
        }
      }, {
        key: "add",
        value: function add(b) {
          return this.add_to(b, new_vector());
        }
      }, {
        key: "sub_to",
        value: function sub_to(b, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i) - _get_item(b, i));
          }
          return to;
        }
      }, {
        key: "sub",
        value: function sub(b) {
          this.sub_to(b, new_vector());
        }
      }, {
        key: "dot",
        value: function dot(b) {
          var acc = 0;
          for (var i = 0; i < n; i++) {
            acc += _get_item(this, i) * _get_item(b, i);
          }
          return acc;
        }
      }, {
        key: "scale",
        value: function scale(s) {
          return this.scale_to(s, new_vector());
        }
      }, {
        key: "scale_to",
        value: function scale_to(s, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i) * s);
          }
          return to;
        }
      }, {
        key: "divide_to",
        value: function divide_to(s, to) {
          return this.scale_to(1 / s, to);
        }
      }, {
        key: "divide",
        value: function divide(s) {
          return this.divide_to(s, new_vector());
        }
      }, {
        key: "abs2",
        value: function abs2() {
          var result = 0;
          for (var i = 0; i < n; i++) {
            var x = _get_item(this, i);
            result += x * x;
          }
          return result;
        }
      }, {
        key: "abs",
        value: function abs() {
          return Math.sqrt(this.abs2());
        }
      }, {
        key: "normalized_to",
        value: function normalized_to(to) {
          return this.divide_to(this.abs(), to);
        }
      }, {
        key: "normalized",
        value: function normalized() {
          return this.normalized_to(new_vector());
        }
      }, {
        key: "normal_by_last_to",
        value: function normal_by_last_to(to) {
          return this.divide_to(this.last, to);
        }
      }, {
        key: "normal_by_last",
        value: function normal_by_last() {
          return this.normal_by_last_to(new_vector());
        }
      }, {
        key: "x",
        get: function get() {
          return _get_item(this, 0);
        },
        set: function set(v) {
          return _set_item(this, 0, v);
        }
      }, {
        key: "y",
        get: function get() {
          return _get_item(this, 1);
        },
        set: function set(v) {
          return _set_item(this, 1, v);
        }
      }, {
        key: "z",
        get: function get() {
          return _get_item(this, 2);
        },
        set: function set(v) {
          return _set_item(this, 2, v);
        }
      }, {
        key: "w",
        get: function get() {
          return _get_item(this, 3);
        },
        set: function set(v) {
          return _set_item(this, 3, v);
        }
      }, {
        key: "last",
        get: function get() {
          return _get_item(this, n - 1);
        },
        set: function set(v) {
          return _set_item(this, n - 1, v);
        }
      }], [{
        key: "sum_to",
        value: function sum_to(vectors, acc) {
          acc.set_to_zero();
          for (var i = 0; i < vectors.length; i++) {
            vectors.index(i).add_to(acc, acc);
          }
          return acc;
        }
      }, {
        key: "sum",
        value: function sum(vectors) {
          return VectorTemplate.sum_to(vectors, new_vector());
        }
      }, {
        key: "average",
        value: function average(vectors) {
          return VectorTemplate.average_to(vectors, new_vector());
        }
      }, {
        key: "average_to",
        value: function average_to(vectors, to) {
          return VectorTemplate.sum_to(vectors, to).divide_to(vectors.length, to);
        }
      }]);
      return VectorTemplate;
    }();

    return VectorTemplate;
  });

  var ArrayView = function () {
    function ArrayView(VectorType) {
      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var buffer = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var offset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var stride = arguments.length <= 4 || arguments[4] === undefined ? VectorType.SIZE : arguments[4];
      classCallCheck(this, ArrayView);

      if (!buffer) {
        buffer = new Float64Array(length * stride);
      }
      this.VectorType = VectorType;
      this.buffer = buffer;
      this.offset = offset;
      this.stride = stride;
      this.length = length;
      this.temp = new VectorType(buffer);
    }

    createClass(ArrayView, [{
      key: "index",
      value: function index(i) {
        this.temp.offset = this.offset + i * this.stride;
        return this.temp;
      }
    }, {
      key: "index_ref_to",
      value: function index_ref_to(i, to) {
        to.buffer = this.buffer;
        to.offset = this.offset + i * this.stride;
        return to;
      }
    }, {
      key: "index_ref",
      value: function index_ref(i) {
        return this.index_ref_to(i, new this.VectorType(null));
      }
    }, {
      key: "forEach",
      value: function forEach(fn) {
        for (var i = 0; i < this.length; i++) {
          fn(this.index(i), i, this);
        }
      }
    }]);
    return ArrayView;
  }();

  var Bulk = function () {
    function Bulk(VectorType) {
      classCallCheck(this, Bulk);

      this.VectorType = VectorType;
      this.SIZE = VectorType.SIZE;
      this.temp = new VectorType(null);
    }

    createClass(Bulk, [{
      key: "allocate",
      value: function allocate(count) {
        var buffer = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var buff_len = this.SIZE * count;
        if (!buffer) buffer = new Float64Array(buff_len);
        var result = new Array(count);
        for (var i = 0; i < count; i++) {
          result[i] = new this.VectorType(buffer, offset);
          offset += this.SIZE;
        }
        return result;
      }
    }, {
      key: "generate",
      value: function generate(count, fn) {
        var buffer = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var offset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        var buff_len = this.SIZE * count;
        if (!buffer) buffer = new Float64Array(buff_len);
        var vec = this.temp;
        vec.buffer = buffer;
        for (var i = 0; i < count; i++) {
          vec.offset = offset;
          offset += this.SIZE;
          fn(vec, i);
        }
        return buffer;
      }
    }]);
    return Bulk;
  }();

  var TransposedView = function () {
    function TransposedView(matrix) {
      classCallCheck(this, TransposedView);

      this.matrix = matrix;
    }

    createClass(TransposedView, [{
      key: "get_item",
      value: function get_item(i, j) {
        return this.matrix.get_item(j, i);
      }
    }, {
      key: "set_item",
      value: function set_item(i, j, v) {
        return this.matrix.set_item(j, i, v);
      }
    }]);
    return TransposedView;
  }();

  var Matrix = template(function (n) {
    if (n < 1) {
      return invalidTemplate("Matrix", n);
    }

    var _vector = Vector(n);
    var item_count = n * n;

    function new_vector() {
      return new _vector();
    }

    function allocate_buffer() {
      return new Float64Array(item_count);
    }

    var MatrixTemplate = function () {
      createClass(MatrixTemplate, null, [{
        key: "N",
        get: function get() {
          return n;
        }
      }, {
        key: "Vector",
        get: function get() {
          return _vector;
        }
      }, {
        key: "SIZE",
        get: function get() {
          return item_count;
        }
      }]);

      function MatrixTemplate() {
        var buffer = arguments.length <= 0 || arguments[0] === undefined ? allocate_buffer() : arguments[0];
        var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        classCallCheck(this, MatrixTemplate);

        this.buffer = buffer;
        this.offset = offset;
      }

      createClass(MatrixTemplate, [{
        key: "get_item",
        value: function get_item(i, j) {
          return this.buffer[this.offset + i * n + j];
        }
      }, {
        key: "set_item",
        value: function set_item(i, j, v) {
          return this.buffer[this.offset + i * n + j] = v;
        }
      }, {
        key: "multiply",
        value: function multiply(b) {
          var to = new MatrixTemplate();
          for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
              var acc = 0;
              for (var k = 0; k < n; k++) {
                acc += this.get_item(i, k) * b.get_item(k, j);
              }
              to.set_item(i, j, acc);
            }
          }
          return to;
        }
      }, {
        key: "multiply_vector_to",
        value: function multiply_vector_to(v, to) {
          for (var i = 0; i < n; i++) {
            var acc = 0;
            for (var j = 0; j < n; j++) {
              acc += this.get_item(j, i) * v.get_item(j);
            }
            to.set_item(i, acc);
          }
          return to;
        }
      }, {
        key: "multiply_vector",
        value: function multiply_vector(v) {
          return this.multiply_vector_to(v, new_vector());
        }
      }, {
        key: "multiply_vector_left_to",
        value: function multiply_vector_left_to(v, to) {
          var _context;

          return (_context = new TransposedView(this), this.multiply_vector_to).call(_context, v, to);
        }
      }, {
        key: "multiply_vector_left",
        value: function multiply_vector_left(v) {
          return this.multiply_vector_left_to(v, new_vector());
        }
      }, {
        key: "clone",
        value: function clone() {
          var to = new MatrixTemplate();
          for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
              to.set_item(i, j, this.get_item(i, j));
            }
          }
          return to;
        }
      }, {
        key: "transpose",
        value: function transpose() {
          var _context2;

          return (_context2 = new TransposedView(this), this.clone).call(_context2);
        }
      }], [{
        key: "identity",
        value: function identity() {
          var to = new MatrixTemplate();
          for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
              to.set_item(i, j, i === j ? 1 : 0);
            }
          }
          return to;
        }
      }, {
        key: "rotation",
        value: function rotation(x1, x2, a) {
          assert(x1 !== x2);
          var sina = Math.sin(a);
          var cosa = Math.cos(a);
          var to = MatrixTemplate.identity();
          to.set_item(x1, x1, cosa);
          to.set_item(x1, x2, sina);
          to.set_item(x2, x1, -sina);
          to.set_item(x2, x2, cosa);
          return to;
        }
      }, {
        key: "projection",
        value: function projection(hdst) {
          var to = MatrixTemplate.identity();
          to.set_item(n - 1, n - 1, 0);
          to.set_item(n - 2, n - 1, hdst);
          return to;
        }
      }, {
        key: "translation",
        value: function translation(t) {
          return MatrixTemplate.translation_from.apply(MatrixTemplate, toConsumableArray(t.items));
        }
      }, {
        key: "translation_from",
        value: function translation_from() {
          var to = MatrixTemplate.identity();

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          for (var i = 0; i < n - 1; i++) {
            to.set_item(n - 1, i, args[i]);
          }
          return to;
        }
      }, {
        key: "scaling",
        value: function scaling(t) {
          return MatrixTemplate.scaling_from.apply(MatrixTemplate, toConsumableArray(t.items));
        }
      }, {
        key: "scaling_from",
        value: function scaling_from() {
          var to = MatrixTemplate.identity();

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          for (var i = 0; i < n; i++) {
            to.set_item(i, i, args[i]);
          }
          return to;
        }
      }]);
      return MatrixTemplate;
    }();

    return MatrixTemplate;
  });

  function identity(x) {
    return x;
  }

  function compare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function comparison_by(fn) {
    var next_comparison = arguments.length <= 1 || arguments[1] === undefined ? compare : arguments[1];

    return function (a, b) {
      return next_comparison(fn(a), fn(b));
    };
  }

  function sort(arr) {
    var key = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];

    return arr.sort(comparison_by(key));
  }

  var ViewMap = function () {
    function ViewMap(proxied, fn) {
      classCallCheck(this, ViewMap);

      this.proxied = proxied;
      this.fn = fn;
    }

    createClass(ViewMap, [{
      key: "index",
      value: function index(i) {
        return this.fn(this.proxied.index(i), i);
      }
    }, {
      key: "length",
      get: function get() {
        return this.proxied.length;
      }
    }]);
    return ViewMap;
  }();

  var ViewArray = function () {
    function ViewArray(array) {
      classCallCheck(this, ViewArray);

      this.array = array;
    }

    createClass(ViewArray, [{
      key: "index",
      value: function index(i) {
        return this.array[i];
      }
    }, {
      key: "length",
      get: function get() {
        return this.array.length;
      }
    }]);
    return ViewArray;
  }();

  function view_zip(fn) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var length = args[0].length;
    var temp = new Array(length);
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < args.length; j++) {
        temp[j] = args[j].index(i);
      }
      fn.apply(undefined, temp);
    }
  }

  function cuboid_vertices(n) {
    var array = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var round = Math.round;

    n = round(n);
    var count = 1 << n;
    if (!array) {
      array = new ArrayView(Vector(n), count);
    }

    for (var i = 0; i < count; i++) {
      var vec = array.index(i);
      for (var j = 0; j < n; j++) {
        vec.set_item(j, round(nthbit(i, j) * 2 - 1));
      }
    }
    return array;

    function nthbit(i, n) {
      return i >>> n & 1;
    }
  }

  var CuboidFace = function () {
    function CuboidFace(vi, vj, rest, parity) {
      classCallCheck(this, CuboidFace);

      this.length = 4;
      this.vi = vi;
      this.vj = vj;
      this.rest = rest;
      this.parity = parity;
      this.rest_shift = insert_zero_at(insert_zero_at(rest, vi), vj);

      function insert_zero_at(x, i) {
        var mask = ~0 << i;
        return (x & mask) << 1 | x & ~mask;
      }
    }

    createClass(CuboidFace, [{
      key: "index",
      value: function index(i) {
        if (this.parity) {
          i = 3 - i;
        }
        var g = gray_code(i);
        return this.rest_shift | (g & 1) << this.vi | (g >>> 1 & 1) << this.vj;

        function gray_code(i) {
          return i ^ i >>> 1;
        }
      }
    }]);
    return CuboidFace;
  }();

  var Cuboid = function () {
    function Cuboid(n) {
      var vertex_buffer_array = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
      classCallCheck(this, Cuboid);

      this.N = n;
      this.VectorN = Vector(n);
      this.vertices = cuboid_vertices(n, vertex_buffer_array);
      this.faces = this._generate_faces();
    }

    createClass(Cuboid, [{
      key: "_generate_faces",
      value: function _generate_faces() {
        var result = [],
            max_rest = 1 << this.N - 2;
        var parity1 = 0;
        for (var i = 0; i < this.N; i++) {
          for (var j = i + 1; j < this.N; j++) {
            for (var r = 0; r < max_rest; r++) {
              result.push(new CuboidFace(i, j, r, parity1));
            }
            parity1 = parity1 ^ 1;
          }
        }
        return result;
      }
    }]);
    return Cuboid;
  }();

  var ExplodedCuboidPiece = function ExplodedCuboidPiece(name, sides) {
    classCallCheck(this, ExplodedCuboidPiece);

    this.name = name;
    this.sides = sides;
  };

  var ExplodedCuboid = function () {
    function ExplodedCuboid(n, dimension, explosion, gap) {
      classCallCheck(this, ExplodedCuboid);

      this.N = n;
      this.dimension = dimension;
      this.explosion = explosion;
      this.gap = gap;
      this.VectorN = Vector(n);
      this.pieces = this._generatePieces();
    }

    createClass(ExplodedCuboid, [{
      key: "_generatePieces",
      value: function _generatePieces() {
        var _this = this;
        var indices = [];
        var xmin = (1 - this.dimension) / 2;
        var pieces = [];
        var N = this.N,
            Nm1 = this.N - 1,
            Dm1 = this.dimension - 1;

        recurse();
        return pieces;

        function recurse() {
          if (indices.length >= N) {
            var sides = [];
            for (var i = 0; i < N; i++) {
              var index = indices[i];
              if (index <= 0) {
                var side = new Cuboid(Nm1);
                modifySide(side, i, -1 - _this.explosion);
                sides.push(side);
              }
              if (index >= Dm1) {
                var _side = new Cuboid(Nm1);
                modifySide(_side, i, 1 + _this.explosion);
                sides.push(_side);
              }
            }
            if (sides.length > 0) {
              var name = JSON.stringify(indices);
              pieces.push(new ExplodedCuboidPiece(name, sides));
            }
          } else {
            indices.push(0);
            for (var _i = 0; _i < _this.dimension; _i++) {
              indices[indices.length - 1] = _i;
              recurse();
            }
            indices.pop();
          }
        }
        function modifySide(side, dim, x) {
          var vertices = side.vertices;
          var newVertices = new ArrayView(_this.VectorN, vertices.length);
          for (var i = 0, maxi = vertices.length; i < maxi; i++) {
            var vertex = vertices.index(i);
            var newVertex = newVertices.index(i);

            for (var j = 0; j < dim; j++) {
              newVertex.set_item(j, vertex.get_item(j));
            }
            newVertex.set_item(dim, 0);
            for (var _j = dim; _j < N; _j++) {
              newVertex.set_item(_j + 1, vertex.get_item(_j));
            }
            for (var _j2 = 0; _j2 < N; _j2++) {
              newVertex.set_item(_j2, newVertex.get_item(_j2) + (indices[_j2] + xmin) * (2 + _this.gap));
            }
            newVertex.set_item(dim, newVertex.get_item(dim) + x);
          }
          side.vertices = newVertices;
        }
      }
    }]);
    return ExplodedCuboid;
  }();

  var PointBuffer = function () {
    function PointBuffer() {
      classCallCheck(this, PointBuffer);

      this.buffer = new Float32Array(256);
      this.offset = 0;
    }

    createClass(PointBuffer, [{
      key: "add",
      value: function add(a) {
        if (this.offset + 1 >= this.buffer.length) {
          this._expand();
        }
        this.buffer[this.offset++] = a;
      }
    }, {
      key: "add2",
      value: function add2(a, b) {
        if (this.offset + 2 >= this.buffer.length) {
          this._expand();
        }
        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
      }
    }, {
      key: "add3",
      value: function add3(a, b, c) {
        if (this.offset + 3 >= this.buffer.length) {
          this._expand();
        }
        this.buffer[this.offset++] = a;
        this.buffer[this.offset++] = b;
        this.buffer[this.offset++] = c;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.offset = 0;
      }
    }, {
      key: "_expand",
      value: function _expand() {
        var temp = new Float32Array(Math.round(this.buffer.length * 1.5));
        temp.set(this.buffer);
        this.buffer = temp;
      }
    }]);
    return PointBuffer;
  }();

  function FacePrimitive() {
    this._offset = 0;
    this._count = 0;
    this.dist = 0;

    this.fill = true;
    this.stroke = true;
    this.close_path = true;
    this.blended = true;

    this.fr = 0;
    this.fg = 1;
    this.fb = 0;
    this.fa = 1;
    this.sr = 0;
    this.sg = 0;
    this.sb = 0;
    this.sa = 1;
    this.lw = 1;
  }

  var FaceRenderer = function () {
    function FaceRenderer() {
      classCallCheck(this, FaceRenderer);

      this.point_buffer = new PointBuffer();
      this.primitive_buffer = [];
    }

    createClass(FaceRenderer, [{
      key: "_next",
      value: function _next() {
        var result = new FacePrimitive();
        this.primitive_buffer.push(result);
        return result;
      }
    }, {
      key: "add_face",
      value: function add_face(buffer, indices) {
        var offset = this.point_buffer.offset;
        var length = indices.length;
        for (var i = 0; i < length; i++) {
          var vec = buffer.index(indices.index(i));
          this.point_buffer.add2(vec.x, vec.y);
        }
        var result = this._next();
        result._offset = offset;
        result._count = length;
        return result;
      }
    }, {
      key: "prepare",
      value: function prepare() {
        sort(this.primitive_buffer, function (p) {
          return -p.dist;
        });
      }
    }, {
      key: "draw",
      value: function draw(context) {
        context.lineJoin = "round";
        var fragcoords = this.point_buffer.buffer;

        this.primitive_buffer.forEach(function (prim) {
          if (prim.fill) {
            context.fillStyle = css_color(prim.fr, prim.fg, prim.fb, prim.fa, prim.blended);
          }
          if (prim.stroke) {
            context.lineWidth = prim.lw;
            context.strokeStyle = css_color(prim.sr, prim.sg, prim.sb, prim.sa, prim.blended);
          }
          context.beginPath();

          for (var p = prim._offset, i = 0; i < prim._count; i++) {
            var px = fragcoords[p++];
            var py = fragcoords[p++];
            if (i) {
              context.lineTo(px, py);
            } else {
              context.moveTo(px, py);
            }
          }

          if (prim.close_path) {
            context.closePath();
          }
          if (prim.fill) {
            context.fill();
          }
          if (prim.stroke) {
            context.stroke();
          }
        });
      }
    }, {
      key: "clear",
      value: function clear(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, {
      key: "reset",
      value: function reset() {
        this.point_buffer.reset();
        this.primitive_buffer.length = 0;
      }
    }, {
      key: "render",
      value: function render(context, canvas) {
        this.prepare();
        this.clear(context, canvas);
        this.draw(context, canvas);
      }
    }]);
    return FaceRenderer;
  }();

  function css_color(r, g, b, a, blended) {
    var round = Math.round;

    return blended ? "rgba(" + round(255 * r) + "," + round(255 * g) + "," + round(255 * b) + "," + a + ")" : "rgb(" + round(255 * r) + "," + round(255 * g) + "," + round(255 * b) + ")";
  }

  var Matrix4 = Matrix(4);
  var Vector4 = Vector(4);

  var Matrix5 = Matrix(5);
  var Vector5 = Vector(5);

  function vec3_cross_to(a, b, to) {
    var ax = a.get_item(0),
        ay = a.get_item(1),
        az = a.get_item(2);
    var bx = b.get_item(0),
        by = b.get_item(1),
        bz = b.get_item(2);
    var tx = ay * bz - az * by;
    var ty = az * bx - ax * bz;
    var tz = ax * by - ay * bx;
    to.set_item(0, tx);
    to.set_item(1, ty);
    to.set_item(2, tz);
    return to;
  }

  var IndexedIndexable = function () {
    function IndexedIndexable(buffer, indices) {
      classCallCheck(this, IndexedIndexable);

      this.buffer = buffer;
      this.indices = indices;
    }

    createClass(IndexedIndexable, [{
      key: "index",
      value: function index(i) {
        return this.buffer.index(this.indices.index(i));
      }
    }, {
      key: "length",
      get: function get() {
        return this.indices.length;
      }
    }]);
    return IndexedIndexable;
  }();

  var View = function () {
    function View(canvas) {
      var _this = this;

      classCallCheck(this, View);


      this.centerx = canvas.width / 2;
      this.centery = canvas.height / 2;
      this.mx = 0;
      this.my = 0;

      this.canvas = canvas;
      this.context = canvas.getContext("2d");

      canvas.addEventListener("mousemove", function (evt) {
        _this.mx = (evt.clientX - _this.centerx) / _this.centerx;
        _this.my = (evt.clientY - _this.centery) / _this.centery;
      });

      this.N = 4;
      this.cuboids = new ExplodedCuboid(this.N, 3, 6.0, 0.3);

      var bufferSize = this.cuboids.pieces[0].sides[0].vertices.length;
      this.verticesMV = new ArrayView(Vector4, bufferSize);
      this.verticesM = new ArrayView(Vector4, bufferSize);
      this.verticesMVPn = new ArrayView(Vector4, bufferSize);

      this.light_dir = Vector4.from(1, 1, 0, 0).normalized();

      this.temp_vec4s = new Bulk(Vector4).allocate(10);
      this.temp_vec5s = new Bulk(Vector5).allocate(10);
      this.indexer = new IndexedIndexable(null, null);

      this.face_renderer = new FaceRenderer();
    }

    createClass(View, [{
      key: "render",
      value: function render(t) {
        var _this3 = this;

        var common_rotation = Matrix5.rotation(0, this.N - 1, 0.276 * t)
        // .multiply(Matrix5.rotation(0, 2, 0.178 * t))
        //.multiply(Matrix5.rotation(1, 3, 0.134 * t))
        ;

        /*
        const mx4V = Matrix5.identity();
        const mx4P = Matrix5.identity();
        */

        var mx4V = Matrix5.translation_from(0, 0, 0, 25);
        var mx4P = Matrix5.projection(0.3);

        // const mx3V = Matrix4.rotation(1, 2, -0.4).multiply(Matrix4.translation_from(0, 0, 15))
        var mx3V = Matrix4.rotation(0, 2, this.mx * 3).multiply(Matrix4.rotation(1, 2, this.my * 3)).multiply(Matrix4.translation_from(0, 0, 12));
        var mx3P = Matrix4.projection(0.2).multiply(Matrix4.scaling_from(200, -200, 1, 1)).multiply(Matrix4.translation_from(250, 250, 0));

        function draw_cube(cuboid) {
          var _this2 = this;

          var mx4M = common_rotation;
          var mx4MV = mx4M.multiply(mx4V);
          var mx4MVP = mx4MV.multiply(mx4P);

          var abs = Math.abs;
          var pow = Math.pow;


          view_zip(function (src, v3M, vMV, vMVPn) {
            var v4 = _this2.temp_vec5s[0];
            var v4MVP = _this2.temp_vec5s[1];
            var v4MVPn = _this2.temp_vec5s[2];
            var vMVP = _this2.temp_vec4s[1];

            src.clone_to(v4);
            for (var i = _this2.N; i < 4; i++) {
              v4.set_item(i, 0);
            }
            v4.last = 1;
            mx4MVP.multiply_vector_to(v4, v4MVP);
            v4MVP.normal_by_last_to(v4MVPn);
            v3M.assign(v4MVPn);
            v3M.last = 1;

            mx3V.multiply_vector_to(v3M, vMV);
            mx3P.multiply_vector_to(vMV, vMVP);
            vMVP.normal_by_last_to(vMVPn);
          }, cuboid.vertices, this.verticesM, this.verticesMV, this.verticesMVPn);

          cuboid.faces.forEach(function (face) {
            var worldnormal = _this2.temp_vec4s[0];
            var center = _this2.temp_vec4s[1];
            var temp1 = _this2.temp_vec4s[2];
            var temp2 = _this2.temp_vec4s[3];
            var temp3 = _this2.temp_vec4s[4];

            _this2.indexer.indices = face;
            _this2.indexer.buffer = _this2.verticesM;

            temp3.assign(_this2.indexer.index(0));
            temp1.assign(_this2.indexer.index(1));
            temp2.assign(_this2.indexer.index(2));

            temp1.sub_to(temp3, temp1);
            temp2.sub_to(temp3, temp2);
            vec3_cross_to(temp1, temp2, temp3);
            temp3.set_item(3, 0);
            temp3.normalized_to(worldnormal);

            _this2.indexer.buffer = _this2.verticesMV;
            Vector4.average_to(_this2.indexer, center);

            var cosa = worldnormal.dot(_this2.light_dir);
            var diffuse = abs(cosa);

            temp1.assign(center).normalized_to(temp1).scale_to(-1, temp1);
            temp1.add_to(_this2.light_dir, temp1).normalized_to(temp1);
            var coss = temp1.dot(worldnormal);
            var specular = pow(abs(coss), 5);

            var intensity = Math.max(0, diffuse) * 0.2 + 0.5;

            var primitive = _this2.face_renderer.add_face(_this2.verticesMVPn, face);

            primitive.fr = intensity * 0.50;
            primitive.fg = intensity * 0.85;
            primitive.fb = intensity * 0.95;

            primitive.fr += specular * (1 - primitive.fr);
            primitive.fg += specular * (1 - primitive.fg);
            primitive.fb += specular * (1 - primitive.fb);

            primitive.fa = 0.70 + specular * 0.15;

            center.w = 0;
            primitive.dist = center.abs();
          });
        }

        this.face_renderer.reset();

        this.cuboids.pieces.forEach(function (cuboidSides) {
          cuboidSides.sides.forEach(function (cuboid) {
            draw_cube.call(_this3, cuboid);
          });
        });

        this.face_renderer.render(this.context, this.canvas);
      }
    }]);
    return View;
  }();

  var view;
  var time;
  function main() {
    view = new View(document.getElementById("main-canvas"));
    time = Date.now();
    schedule_draw();
  }

  window.addEventListener("load", function () {
    main();
  });

  function draw(t) {
    view.render(t);
  }

  function draw_loop() {
    var t = (Date.now() - time) * 0.001;
    draw(t);
    schedule_draw();
  }
  function schedule_draw() {
    window.requestAnimationFrame(draw_loop);
  }

}());