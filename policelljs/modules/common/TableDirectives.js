angular.module('policellApp').directive('ngModel2', function($compile) {
  function changer(attr) {
    return 'onuser.' + attr + '(' + attr + ",'" + attr + "')";
  }
  function link(scope, element, attrs) {
    element.removeAttr('ng-model2');
    element.removeAttr('data-ng-model2');
    element.attr('ng-model', attrs.ngModel2);
    element.attr('ng-change', changer(attrs.ngModel2));
    $compile(element)(scope);
  }
  return {
    restrict: 'A',
    replace: false,
    terminal: true,
    priority: 1000,
    link: link
  };
}).directive('myDateCellEditor', function() {
  function link(scope, element, attrs) {
    scope.emitEditEnd = function() {
      scope.$emit('ngGridEventEndCellEdit');
    };
    scope.$on('ngGridEventStartCellEdit', function () {
      element = element.children();
      element.focus();
      element.select();
    });
  }
  return {
    restrict: 'E',
    template: '<input type="text" data-type="date" ui-date="{ dateFormat: S.date_sf, onClose: emitEditEnd }" class="form-control" ng-model="row.entity[col.field]"/>',
    link: link
  };
});