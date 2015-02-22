angular.module('policellApp').controller('EditCustomerController', function(
  $scope, $done, models, HeaderService, DataService, $routeParams
) {
  HeaderService.notify('customers/edit');

  $scope.customer = null;
  $scope.oldName = null;

  $done(DataService.findCustomerById(+$routeParams.id).then(function(c) {
    $scope.customer = c;
    $scope.oldName = c.name;
  }));


  $scope.applyCustomer = function() {
    $done(DataService.updateCustomer($scope.customer.id, $scope.customer).then(function() {
      HeaderService.openPage('customers');
    }));
  };
  $scope.cancel = function() {
    models.editCustomer = null;
    HeaderService.openPage('customers');
  };

});
