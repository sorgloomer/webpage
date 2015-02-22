angular.module('policellApp').constant('TEMPLATES', {
  cell_editor_number: '<input type="number" class="form-control" ng-input ng-model="row.entity[col.field]" />',
  cell_editor_date: '<my-date-cell-editor/>'
});
