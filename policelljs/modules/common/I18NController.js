angular.module('policellApp').controller('I18NController', function(i18n, locale_hu) {
  i18n.m('hu', locale_hu);
  i18n.locale('hu');
});