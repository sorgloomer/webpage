angular.module('policellApp').factory('CommonTableDefinition', function(
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
        { field: 'id', displayName: S.column_id, width: 40, index: 1 },
        { field: 'info', displayName: S.column_text, width: 200, index: 0 },
        {
          field: 'age', displayName: S.column_number, index: 2,
          editableCellTemplate: TEMPLATES.cell_editor_number
        },
        {
          field: 'date', displayName: S.column_date, index: 3,
          cellFilter: 'date:S.date_lf',
          editableCellTemplate: TEMPLATES.cell_editor_date
        }
      ]
    };
  }
  return defineTable;
});
