angular.module('policellApp', [
  'ngSanitize',
  'ngRoute',
  'ngGrid',
  'ui.date',
  'ui.select'
]).config(function($routeProvider) {
  $routeProvider
    .when('/search', {
      controller: 'SearchController',
      templateUrl: 'modules/Search/SearchPage.html'
    })
    .when('/customers', {
      controller: 'CustomersController',
      templateUrl: 'modules/Customers/CustomersPage.html'
    })
    .when('/customers/new', {
      controller: 'NewCustomerController',
      templateUrl: 'modules/Customers/NewCustomerPage.html'
    })
    .when('/customers/edit/:id', {
      controller: 'EditCustomerController',
      templateUrl: 'modules/Customers/EditCustomerPage.html'
    })
    .when('/offers', {
      controller: 'OffersController',
      templateUrl: 'modules/Offers/OffersPage.html'
    })
    .when('/offers/new', {
      controller: 'NewOfferController',
      templateUrl: 'modules/Offers/NewOfferPage.html'
    })
    .when('/offers/edit/:id', {
      controller: 'EditOfferController',
      templateUrl: 'modules/Offers/EditOfferPage.html'
    })
    .otherwise({
      controller: 'RouterController',
      template: ''
    });
});
