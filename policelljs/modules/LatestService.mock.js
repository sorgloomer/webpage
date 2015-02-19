angular.module('policellApp').factory('LatestService', function($q, $delay, util, names) {

  function crawl(v) {
    return $delay(400, v);
  }
  
  var index = 10;
  function newId() {
    return ++index;
  }
  var data = util.range(10, function(i) { 
    return { id: 1+i, info: 'Árvíztűrő Tükörfúrógép '+(i+1), age: 100+i, date: new Date(Date.now() - i*1000*60*60*24*5) };
  });
  
  function setData(item, col) {
    var newVal = item[col];
    data.forEach(function(d) { 
      if (d.id === item.id) d[col] = newVal; 
    });
    return crawl();
  }
  
  function addData(item) {
    if (!item) item = { info: 'New', age: 0 };
    item = angular.copy(item);
    item = { id: newId(), info: item.info, age: item.age, date: new Date() };
    data.push(item);
    return crawl();
  }

  function getData() {
    return crawl(angular.copy(data));
  }
  
  function searchNames(part) {
    var result = names.filter(function(n) { return util.like(n, part); });
    result = angular.copy(result);
    return crawl(result);
  }
  function getNames() {
    var result = angular.copy(names);
    return crawl(result);
  }
  

  return {
    getData: getData,
    setData: setData,
    addData: addData,
    searchNames: searchNames,
    getNames: getNames
  };
})
.constant('names', [ "Ábel", "Ádám", "Adrián", "Ákos", "Alex", "Alexander", "Andor", "András", "Ármin", "Áron", "Árpád", "Attila",
  "Balázs", "Bálint", "Barna", "Barnabás", "Béla", "Bence", "Bendegúz", "Benedek", "Benett", "Benjámin", "Bertalan", "Boldizsár",
  "Botond", "Brendon", "Bulcsú", "Csaba", "Csanád", "Csongor", "Dániel", "Dávid", "Dénes", "Dominik", "Domonkos", "Donát",
  "Dorián", "Erik", "Ferenc", "Flórián", "Gábor", "Gellért", "Gergely", "Gergő", "György", "Gyula", "Hunor", "Imre",
  "István", "János", "József", "Károly", "Kende", "Kevin", "Kolos", "Koppány", "Kornél", "Kristóf", "Krisztián", "Krisztofer",
  "Lajos", "László", "Levente", "Lóránt	", "Lőrinc", "Marcell", "Márk", "Márkó", "Martin", "Márton", "Máté", "Mátyás",
  "Mihály", "Miklós", "Milán", "Nándor", "Nikolasz", "Nimród", "Noel", "Norbert", "Olivér", "Pál", "Patrik", "Péter",
  "Richárd", "Rikárdó", "Róbert", "Roland", "Sámuel", "Sándor", "Sebestyén", "Simon", "Soma", "Szabolcs", "Szebasztián", "Szilárd",
  "Tamás", "Tibor", "Viktor", "Vilmos", "Vince", "Zalán", "Zétény", "Zsigmond", "Zoltán", "Zsolt", "Zsombor",

  "Adrienn", "Ágnes", "Alexandra", "Andrea", "Anett", "Anikó", "Anita", "Anna", "Annamária", "Aranka", "Barbara", "Beáta", "Beatrix", "Bernadett", "Bettina",
  "Bianka", "Boglárka", "Borbála", "Brigitta", "Csilla", "Diána", "Dóra", "Dorina", "Dorottya", "Edina", "Edit", "Emese", "Emma", "Enikő", "Erika",
  "Erzsébet", "Eszter", "Etelka", "Éva", "Evelin", "Fanni", "Gabriella", "Gizella", "Gyöngyi", "Györgyi", "Hajnalka", "Henrietta", "Ibolya", "Ida", "Ildikó",
  "Ilona", "Irén", "Irma", "Jolán", "Judit", "Júlia", "Julianna", "Katalin", "Kinga", "Kitti", "Klára", "Klaudia", "Krisztina", "Laura", "Lili",
  "Lilla", "Magdolna", "Margit", "Mária", "Mariann", "Marianna", "Márta", "Melinda", "Mónika", "Nikolett", "Nikoletta", "Noémi", "Nóra", "Olga", "Orsolya",
  "Petra", "Piroska", "Réka", "Renáta", "Rita", "Róza", "Rozália", "Rózsa", "Sára", "Sarolta", "Szabina", "Szilvia", "Teréz", "Terézia", "Tímea",
  "Tünde", "Valéria", "Veronika", "Viktória", "Virág", "Vivien", "Zita", "Zsanett", "Zsófia", "Zsuzsanna"
]);
