angular.module('policellApp').controller('OffersController', function(
  $q, $scope, $load, $apply2, HeaderService,
  OfferTableDefinition,
  DataService
) {
  HeaderService.notify('offers');


  $scope.name = { selected: null };
  
  $scope.gridOptions = OfferTableDefinition('myData');
  
  $scope.myData = [];
  $scope.names = [];
  
    
  $scope.columns = null;

  $scope.notifySearch = function() {

  };
  
  DataService.getNames().then(function(r) { $scope.names = r; });
  $scope.searchNames = function(part) {
    $load(DataService.searchNames(part).then(function(r) { $scope.names = r; }));
  };
  
  $scope.refresh = function() {
    $load(DataService.getData().then(function(x) { $scope.myData = x; }));
  };
  $scope.add = function() {
    $load(DataService.addData(), $scope.refresh);
  };
    
  $scope.$on('ngGridEventColumns', function(evt, newColumns){
    $apply2($scope, function() {
      $scope.columns = newColumns;
    });
  });
  $scope.$on('ngGridEventEndCellEdit', function(event) {
    $apply2($scope, function() {
      var scp = event.targetScope;
      $load(DataService.setData(scp.row.entity, scp.col.field));
    });
  });
  
  $scope.refresh();
});
