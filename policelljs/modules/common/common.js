angular.module('policellApp').factory('$call', function() {
  var slice = Array.prototype.slice;
  return function $call(fn /*, ...args */) {
    if (typeof fn === 'function') {
      return fn.apply(null, slice.call(arguments, 1));
    }
  };
}).factory('$finally', function($q) {
  return function $finally(p, fn) {
    var success = true, value = null;
    return $q.when(p, function(r) {
      success = true; value = r;
      return fn(success, value);
    }, function(e) {
      success = false; value = e;
      return fn(success, value);
    }).then(function() {
      return success ? $q.when(value) : $q.reject(value);
    });
  };
}).factory('$error', function($q) {
  return function $error(e) {
    console.error(e);
  };
}).factory('$done', function($q, $error, $call) {
  return function $done(p, fn) {
    $q.when(p, function(r) {
      try {
        $call(fn, true, r);
      } catch(e) {
        $error(e);
      }
    }, function(e) {
      $error(e);
      try {
        $call(fn, false, e);
      } catch(e2) {
        $error(e2);
      }
    });
  };
}).factory('$load', function($q, $done, $call, $rootScope) {
  function make(scope, field) {
    if (field === undefined) field = 'loading';
    scope[field] = false;
    var loadCount = 0;
    return function $load(p, fn) {
      ++loadCount;
      scope[field] = true;
      $done(p, function(s, v) {
        if (!(--loadCount)) scope[field] = false;
        $call(fn, s, v);
      });
    };
  }
  var $load = make($rootScope);
  $load.make = make;
  return $load;
})
.factory('$delay', function($q, $timeout) {
  return function $delay(time, val) {
    var def = $q.defer();
    $timeout(function() {
      def.resolve(val);
    }, time);
    return def.promise;
  };
})
.factory('util', function() {
  function range(a, fn) {
    if (fn === undefined) fn = angular.identity;
    var res = [];
    for (var i = 0; i < a; i++) {
      res.push(fn(i));
    }
    return res;
  }
  function like(a, b) {
    return ((''+a).toLowerCase()).indexOf((''+b).toLowerCase()) >= 0;
  }

  return { range: range, like: like };
})
;

