angular.module('policellApp')
.factory('$call', function() {
  var slice = Array.prototype.slice;
  return function $call(fn /*, ...args */) {
    if (typeof fn === 'function') {
      return fn.apply(null, slice.call(arguments, 1));
    }
  };
})
.factory('$finally', function($q) {
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
})
.factory('$error', function($q) {
  return function $error(e) {
    console.error(e);
  };
})
.factory('$done', function($q, $error, $call) {
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
})
.factory('$load', function($q, $done, $call, $rootScope) {  
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
.controller('WelcomeController', function($q, $scope, $load, WelcomeService) {
 
  $scope.name = { selected: null };
  
  $scope.gridOptions = {
    data: 'myData',
    enableColumnResize: true,
    enableColumnReordering: true,
    enablePinning: true,
    enableCellEdit: true,
    multiSelect: false,
    
    headerRowHeight: 24,
    rowHeight: 22,
    
    columnDefs: [
      { field: 'id',    displayName: 'id'      , width: 40  , index: 1 },
      { field: 'info',  displayName: 'Szöveg'  , width: 200 , index: 0 },
      { field: 'age',   displayName: 'Szám'    , index: 2,
        editableCellTemplate: '<input type="number" class="form-control" ng-input="COL_FIELD" ng-model="COL_FIELD" />'
      },
      {
        field: 'date',  displayName: 'Dátum'   , index: 3,
        cellFilter: 'date',
        editableCellTemplate: '<input type="date" class="form-control" ng-input="COL_FIELD" ng-model="COL_FIELD"/>'
      }
    ]
  };
  
  $scope.myData = [];
  $scope.names = [];
  
    
  $scope.columns = null;

  
  WelcomeService.getNames().then(function(r) { $scope.names = r; });
  $scope.searchNames = function(part) {
    $load(WelcomeService.searchNames(part).then(function(r) { $scope.names = r; }));
  };
  
  $scope.refresh = function() {
    $load(WelcomeService.getData().then(function(x) { $scope.myData = x; }));
  };
  $scope.add = function() {
    $load(WelcomeService.addData(), $scope.refresh);  
  };
    
  $scope.$on('ngGridEventColumns', function(evt, newColumns){
    $scope.columns = newColumns;
  });
  $scope.$on('ngGridEventEndCellEdit', function(event) {
    var scp = event.targetScope;
    $load(WelcomeService.setData(scp.row.entity, scp.col.field));
  });
  
  $scope.refresh();
  
});
