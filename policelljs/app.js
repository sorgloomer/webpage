angular.module('policellApp', [
  'ngSanitize',
	'ngRoute',
  'ngGrid',
  'ui.date',
  'ui.select'
])
.config(function($routeProvider, $provide) {
  
	$routeProvider
  .otherwise({
    controller: 'WelcomeController',
    templateUrl: 'pages/WelcomePage.html'
  });
    
    /*
  $provide.decorator('i18nService', function($delegate) {
    // $delegate.setCurrentLang('hu');
    return $delegate;
  });
  */
});
