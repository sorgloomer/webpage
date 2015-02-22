angular.module('policellApp').factory('HeaderService', function(
  $rootScope, $location
) {
  var currentPage = null;

  function isPage(guess) {
    return currentPage === guess;
  }

  function openPage(page) {
    notify(page);
    $location.url(page);
  }
  function notify(newPage) {
    if (currentPage !== newPage) {
      currentPage = newPage;
      $rootScope.$broadcast('page-changed', newPage);
    }
  }

  function getCurrentPage() {
    return currentPage;
  }

  return {
    isPage: isPage,
    openPage: openPage,
    getCurrentPage: getCurrentPage,
    notify: notify
  };
});
