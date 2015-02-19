angular.module('policellApp', [
  'ngSanitize',
	'ngRoute',
  'ngGrid',
  'ui.date',
  'ui.select'
])
.config(function($routeProvider) {
	$routeProvider
  .when('/search', {
    controller: 'SearchController',
    templateUrl: 'modules/SearchPage.html'
  })
  .otherwise({
    controller: 'LatestController',
    templateUrl: 'modules/LatestPage.html'
  });
});
