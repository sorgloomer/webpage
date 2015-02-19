angular.module('policellApp').controller('SearchController', function(
  $q, $scope
) {

  $scope.num1 = 0;
  $scope.num2 = 0;
  
   $scope.onuser = {
    num1: function(v) {
      $scope.num2 = v + 1;
    },
    num2: function(v) {
      $scope.num1 = v + 1;
    }
  };
});
