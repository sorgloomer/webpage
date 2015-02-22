angular.module('policellApp').factory('DataService', function($q, $delay, util, NAMES, LOREM_IPSUM) {

  var CUSTOMER_RESULT_COUNT = 15;

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

  var lorem = LOREM_IPSUM.split(' ');

  var customerCounter = NAMES.length;
  var customers = util.range(customerCounter, function(i) {
    return {
      id: i,
      name: NAMES[i],
      comment: lorem.slice(6*i, 6*i+100).join(' '),
      register_date: new Date(Date.now() - i * 20000000)
    };
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
    var result = NAMES.filter(function(n) { return util.like(n, part); });
    result = angular.copy(result);
    return crawl(result);
  }
  function getNames() {
    var result = angular.copy(NAMES);
    return crawl(result);
  }


  function addCustomer(customer) {
    customers.push({
      id: ++customerCounter,
      name: customer.name,
      register_date: new Date(),
      comment: customer.comment
    });

    return crawl();
  }

  function updateCustomer(id, newData) {
    customers.forEach(function(c) {
      if (c.id === id) {
        c.name = newData.name;
        c.comment = newData.comment;
      }
    });

    return crawl();
  }

  function findCustomers(part) {
    part = (''+part).toLowerCase();
    return crawl(angular.copy(customers.filter(function(customer) {
      return util.like(customer.name, part) || util.like(customer.comment, part);
    }).slice(-CUSTOMER_RESULT_COUNT).reverse()));
  }
  function findCustomerById(id) {
    return crawl(angular.copy(customers.filter(function(customer) {
      return customer.id === id;
    })[0]));
  }

  function getLatestCustomers() {
    return crawl(angular.copy(customers.slice(-CUSTOMER_RESULT_COUNT).reverse()));
  }

  return {
    getData: getData,
    setData: setData,
    addData: addData,
    searchNames: searchNames,
    getNames: getNames,
    updateCustomer: updateCustomer,

    addCustomer: addCustomer,
    findCustomers: findCustomers,
    findCustomerById: findCustomerById,
    getLatestCustomers: getLatestCustomers
  };
})
.constant('NAMES', [ "Ábel", "Ádám", "Adrián", "Ákos", "Alex", "Alexander", "Andor", "András", "Ármin", "Áron", "Árpád", "Attila",
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
]).constant('LOREM_IPSUM', "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velut ego nunc moveor. Aliter homines, aliter philosophos loqui" +
  " putas oportere? Sed erat aequius Triarium aliquid de dissensione nostra iudicare. Quasi ego id curem, quid ille aiat aut neget. Duo Reges: " +
  "constructio interrete. Tria genera cupiditatum, naturales et necessariae, naturales et non necessariae, nec naturales nec necessariae. Tum Piso: Quoniam igitur " +
  "aliquid omnes, quid Lucius noster? Audeo dicere, inquit. Itaque ad tempus ad Pisonem omnes. Bonum negas esse divitias, praeposìtum esse dicis? Eadem fortitudinis " +
  "ratio reperietur. Sic enim censent, oportunitatis esse beate vivere. Illa sunt similia: hebes acies est cuipiam oculorum, corpore alius senescit; Quod si ita se habeat, " +
  "non possit beatam praestare vitam sapientia. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Profectus in exilium Tubulus statim nec " +
  "respondere ausus; Longum est enim ad omnia respondere, quae a te dicta sunt. Color egregius, integra valitudo, summa gratia, vita denique conferta voluptatum omnium " +
  "varietate. Cur post Tarentum ad Archytam? Non modo carum sibi quemque, verum etiam vehementer carum esse? Et ille ridens: Video, inquit, quid agas; Et harum quidem " +
  "rerum facilis est et expedita distinctio. Tanta vis admonitionis inest in locis; Sit hoc ultimum bonorum, quod nunc a me defenditur; Idemne potest esse dies saepius, " +
  "qui semel fuit? Tecum optime, deinde etiam cum mediocri amico. Sit sane ista voluptas. Si verbum sequimur, primum longius verbum praepositum quam bonum. Summum ením " +
  "bonum exposuit vacuitatem doloris; Quae duo sunt, unum facit. Sic consequentibus vestris sublatis prima tolluntur. Quod totum contra est. Audeo dicere, inquit. " +
  "Quod quidem iam fit etiam in Academia. Stoicos roga. Sit ista in Graecorum levitate perversitas, qui maledictis insectantur eos, a quibus de veritate dissentiunt. " +
  "Quid enim de amicitia statueris utilitatis causa expetenda vides." +
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum " +
  "imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu " +
  "ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean " +
  "quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, " +
  "luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum " +
  "velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing " +
  "diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam " +
  "ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at " +
  "interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed " +
  "non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum " +
  "tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. " +
  "Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. " +
  "Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium " +
  "blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, " +
  "ligula. Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus consectetuer risus et tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
  "Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed " +
  "augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales " +
  "ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin " +
  "ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus " +
  "metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos " +
  "himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. " +
  "Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus " +
  "magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere " +
  "cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec " +
  "lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar " +
  "ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, " +
  "dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci " +
  "risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, " +
  "sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula. Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus " +
  "consectetuer risus et tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem " +
  "at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti " +
  "sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. " +
  "Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit " +
  "quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat " +
  "condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor " +
  "neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. " +
  "Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa " +
  "mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent " +
  "blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum si.");
