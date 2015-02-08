angular.module('policellApp')
.factory('WelcomeService', function($http) {
  function fl_data(x) {
    return x.data;
  }
  
  function get(path) {
    return $http.get(path).then(fl_data);
  }
  function post(path, data) {
    return $http.post(path, data).then(fl_data);
  }

  function setData(item, col) {
    return post('api/set', {id: item.id, col: col, val: item[col]});
  }
  
  function addData(item) {
    if (!item) item = { info: 'New', age: 0 };
    return post('api/add', item);
  }

  function getData() {
    return get('api/get');
  }
  
  return {
    getData: getData,
    setData: setData,
    addData: addData
  };
});
