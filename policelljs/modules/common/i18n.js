angular.module('policellApp').factory('i18n', function($rootScope) {
  var currentLocale = '', S = null;
  var i18n = {
    loc: {},
    defaultLocale: 'en',
    usedLocale: '',
    locale: locale, strings: strings,
    S: S, d: d, m: m
  };
  function d(loc, key, val) {
    var cloc = i18n.loc[loc];
    if (val === undefined) {
      return cloc ? cloc[key] : undefined;
    }
    if (!cloc) {
      i18n.loc[loc] = cloc = {};
    }
    cloc[key] = val;
    return i18n;
  }
  function m(loc, keyvals) {
    var cloc = i18n.loc[loc];
    if (!cloc) {
      i18n.loc[loc] = cloc = {};
    }
    angular.forEach(keyvals, function(v, k) {
      cloc[k] = v;
    });
    return i18n;
  }
  function localeInternal(name) {
    if (name && i18n.loc[name]) {
      strings(i18n.loc[name]);
      i18n.userLocale = name;
      return true;
    }
    return false;
  }
  function strings(obj) {
    if (obj === undefined) return S;
    $rootScope.S = i18n.S = S = obj;
    return i18n;
  }
  function locale(name) {
    if (name === undefined) return currentLocale;
    currentLocale = name;

    if (localeInternal(name)) return i18n;
    if (localeInternal(name.split('-')[0])) return i18n;
    if (localeInternal(i18n.defaultLocale)) return i18n;
    return i18n;
  }
  $rootScope.S = i18n.S = S;
  return i18n;
});