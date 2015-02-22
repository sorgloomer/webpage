angular.module('policellApp').controller('HeaderController', function(
  $scope, HeaderService, models
) {
  $scope.isPage = HeaderService.isPage;
  $scope.openPage = HeaderService.openPage;
  $scope.models = models;
});
