angular.module('policellApp').controller('NewCustomerController', function(
  $scope, models, HeaderService, DataService
) {
  HeaderService.notify('customers/new');

  if (models.newCustomer) {
    $scope.customer = models.newCustomer;
  } else {
    $scope.customer = models.newCustomer = {
      name: '',
      comment: ''
    };
  }

  $scope.saveCustomer = function() {
    DataService.addCustomer({
      name: $scope.customer.name,
      comment: $scope.customer.comment
    }).then(function() {
      models.newCustomer = null;
      HeaderService.openPage('customers');
    });
  };
  $scope.cancel = function() {
    models.newCustomer = null;
    HeaderService.openPage('customers');
  };
});
