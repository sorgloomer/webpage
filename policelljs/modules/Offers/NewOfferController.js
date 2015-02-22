angular.module('policellApp').controller('NewOfferController', function(
  $scope, models, HeaderService
) {
  HeaderService.notify('offers/new');

  function init() {
    if (models.newOffer) {
      $scope.offer = models.newOffer;
    } else {
      $scope.clear();
    }
  }

  $scope.clear = function() {
    $scope.offer = models.newOffer = {
      registration_date: new Date(),
      product_properties: ''
    };
  };

  $scope.save = function() {
    throw new Error('TODO unimplemented');
  };

  $scope.cancel = function() {
    models.newOffer = null;
    HeaderService.openPage('offers');
  };

  function trim(s) {
    return (''+s).trim();
  }
  function contains(arr, v) {
    return arr.indexOf(v) >= 0;
  }
  function splitByComa(str) {
    return str ? str.split(',') : [];
  }
  $scope.addProperty = function(v) {
    v = '' + v;
    var items = splitByComa($scope.offer.product_properties).map(trim);
    if (!contains(items, v)) {
      $scope.offer.product_properties +=
        (items.length > 0 ? ', ' : '') + v;
    }
  };

  init();
});
