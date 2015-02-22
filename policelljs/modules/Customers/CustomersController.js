angular.module('policellApp').controller('CustomersController', function(
  $q, $qfcall, $qfapply, $scope, models, DataService, $load, debounce, HeaderService
) {
  HeaderService.notify('customers');

  $scope.customers = [];
  $scope.search = models.customerSearch;

  function decorateLoader(fn) {
    return function() {
      return $load(fn.apply(this, arguments));
    }
  }
  function decorateFcall(fn) {
    return function() {
      var _this = this, _arguments = arguments;
      return $qfapply(function() {
        return fn.apply(_this, _arguments);
      });
    }
  }

  function loadAndInter(fn) {
    return debounce(decorateLoader(decorateFcall(fn)), 300);
  }

  $scope.fetchSearch = loadAndInter(function(text) {
    return $load(DataService.findCustomers(text).then(function(newData) {
      $scope.customers = newData;
    }));
  });

  $scope.notifySearch = function() {
    $scope.refresh();
  };

  $scope.newCustomer = function() {
    HeaderService.openPage('customers/new');
  };

  $scope.editCustomer = function(customer) {
    HeaderService.openPage('customers/edit/' + customer.id);
  };

  $scope.refresh = function() {
    $scope.fetchSearch($scope.search.value);
  };



  $scope.refresh();
});
