angular.module('policellApp').factory('$call', function() {
  var slice = Array.prototype.slice;
  return function $call(fn /*, ...args */) {
    if (typeof fn === 'function') {
      return fn.apply(undefined, slice.call(arguments, 1));
    }
  };
}).factory('$qfapply', function($q) {
  return function $qfapply(fn , args) {
    try {
      if (typeof fn === 'function') {
        return $q.when(fn.apply(undefined, args));
      } else {
        return $q.when();
      }
    } catch(e) {
      return $q.reject(e);
    }
  };
}).factory('$qfcall', function($qfapply) {
  var slice = Array.prototype.slice;
  return function $qfcall(fn /*, ...args */) {
    return $qfapply(fn, slice.call(arguments, 1));
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
}).factory('$error', function($log) {
  return function $error(e) {
    $log.error(e);
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
      return p;
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
.factory('$apply2', function($log) {
  return function $apply2(scope, fn, makeLog) {
    if (fn) {
      switch (scope.$root.$$phase) {
        case '$apply':
        case '$digest':
          if (makeLog) {
            $log.log('Change is already in $apply');
          }
          return fn();
        default:
          if (makeLog) {
            $log.log('Change is not in $apply');
          }
          return scope.$apply(fn);
      }
    }
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

