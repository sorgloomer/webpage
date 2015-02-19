angular.module('policellApp').controller('LatestController', function(
  $q, $scope, $load,
  CommonTableDefinition,
  LatestService) {

  $scope.name = { selected: null };
  
  $scope.gridOptions = CommonTableDefinition('myData');
  
  $scope.myData = [];
  $scope.names = [];
  
    
  $scope.columns = null;

  
  LatestService.getNames().then(function(r) { $scope.names = r; });
  $scope.searchNames = function(part) {
    $load(LatestService.searchNames(part).then(function(r) { $scope.names = r; }));
  };
  
  $scope.refresh = function() {
    $load(LatestService.getData().then(function(x) { $scope.myData = x; }));
  };
  $scope.add = function() {
    $load(LatestService.addData(), $scope.refresh);
  };
    
  $scope.$on('ngGridEventColumns', function(evt, newColumns){
    $scope.columns = newColumns;
  });
  $scope.$on('ngGridEventEndCellEdit', function(event) {
    var scp = event.targetScope;
    $load(LatestService.setData(scp.row.entity, scp.col.field));
  });
  
  $scope.refresh();
});
