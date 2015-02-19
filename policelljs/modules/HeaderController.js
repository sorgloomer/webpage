angular.module('policellApp').controller('HeaderController', function(
  $q, $scope, $load, $location, i18n
) {
  $scope.currentPage = null;

  $scope.isPage = function(guess) {
    return $scope.currentPage === guess;
  };

  $scope.openPage = function(page) {
    $scope.currentPage = page;
    $location.url(page);
  };

  function determinePage() {
    $scope.currentPage = $location.url() || 'main';
  }
  determinePage();
});
