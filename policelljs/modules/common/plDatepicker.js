angular.module('policellApp').directive('plDatepicker', function(DataService, $compile, i18n) {
  var TEMPLATE =
  '<input ui-date="dateOptions"'+
  ' type="text" data-type="date">';

  function makeOptions() {
    var result = angular.copy(jQuery.datepicker.regional[i18n.locale()]);
    angular.extend(result, {
      dateFormat: i18n.S.date_sf
    });
    return result;
  }

  function link(scope, element, attrs) {
    scope.dateOptions = makeOptions();
    var elem = angular.element(TEMPLATE);
    elem.attr('ng-model', attrs.ngModel);
    elem.addClass(attrs.class);
    elem.attr('placeholder', attrs.placeholder || i18n.S.text_date);
    elem = $compile(elem)(scope);
    element.replaceWith(elem);
  }
  return {
    restrict: 'E',
    link: link
  };
});