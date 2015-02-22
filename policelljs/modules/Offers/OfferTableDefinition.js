angular.module('policellApp').factory('OfferTableDefinition', function(
  i18n, TEMPLATES
) {
  var S = i18n.S;
  function defineTable(scopeField) {
    return {
      data: scopeField,
      enableColumnResize: true,
      enableColumnReordering: true,
      enablePinning: true,
      enableCellEdit: true,
      multiSelect: false,

      headerRowHeight: 24,
      rowHeight: 22,

      columnDefs: [
        { field: 'registration_number', displayName: S.column_registration_number, width: 70 },
        { field: 'registration_date', displayName: S.column_date, width: 70 },
        { field: 'foreign_id', displayName: S.column_foreign_id, width: 70 },
        { field: 'customer_name', displayName: S.column_customer_name, width: 150 },
        {
          field: 'age', displayName: S.column_number,
          editableCellTemplate: TEMPLATES.cell_editor_number
        },
        {
          field: 'date', displayName: S.column_date,
          cellFilter: 'date:S.date_lf',
          editableCellTemplate: TEMPLATES.cell_editor_date
        }
      ]
    };
  }
  return defineTable;
});
