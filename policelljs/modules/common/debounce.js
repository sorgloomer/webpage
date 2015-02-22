angular.module('policellApp').factory('debounce', function($qfapply, $timeout) {

  function Debouncer(delay) {
    var queued = null;

    function finishOne() {
      if (queued) {
        invoke();
      } else {
        debounce.working = false;
      }
    }

    function invoke() {
      var q = queued;
      queued = null;
      var prom = $qfapply(q);
      prom.finally(finishOne);
    }

    function scheduleInvoke() {
      if (!debounce.working) {
        debounce.working = true;
        if (delay) {
          $timeout(invoke, delay);
        } else {
          invoke();
        }
      }
    }

    function debounce(fn) {
      queued = fn;
      scheduleInvoke();
    }

    debounce.working = false;
    return debounce;
  }

  function debounce(fn, delay) {
    var debounced = Debouncer(delay);
    return function wrapped(/* arguments */) {
      var _arguments = arguments, _this = this;
      return debounced(function () {
        return fn.apply(_this, _arguments);
      });
    }
  }
  debounce.Debouncer = Debouncer;
  Debouncer.debounce = debounce;
  return debounce;
});