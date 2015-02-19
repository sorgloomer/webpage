angular.module('policellApp').controller('I18NController', function(i18n) {
  i18n.m('hu', {
    date_sf: 'yy-mm-dd',
    date_lf: 'yyyy-MM-dd',

    menu_title_latest: 'Legutóbbi',
    menu_title_search: 'Keresés',

    column_id: 'ID',
    column_text: 'Szöveg',
    column_number: 'Szám',
    column_date: 'Dátum'
  });
  i18n.locale('hu');
});