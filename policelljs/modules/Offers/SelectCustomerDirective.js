angular.module('policellApp').directive('plSelectCustomer', function(DataService, $compile) {
  var TEMPLATE =
  '<ui-select class="select" theme="bootstrap">' +
  '<ui-select-match>' +
  '{{ $select.selected }}' +
  '</ui-select-match>' +
  '<ui-select-choices repeat="item in items" refresh="searchCustomer($select.search)" refresh-delay="250">' +
  '<small ng-bind-html="item | highlight: $select.search"></small>' +
  '</ui-select-choices>' +
  '</ui-select>';

  function control($scope) {
    $scope.items = null;
    $scope.searchCustomer = function(text) {
      DataService.searchNames(text).then(function(items) {
        $scope.items = items;
      });
    };
  }
  function link(scope, element, attrs) {
    control(scope);

    var newElem = angular.element(TEMPLATE);
    newElem.attr('ng-model', attrs.ngModel);
    newElem.addClass(attrs.class);
    var match = newElem.children().eq(0);
    match.attr('placeholder', attrs.placeholder);

    newElem = $compile(newElem)(scope);
    element.replaceWith(newElem);
  }
  return {
    restrict: 'E',
    link: link
  };
});