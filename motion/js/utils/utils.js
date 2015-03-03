/**
 * Created by Hege on 2014.11.07..
 */
define('utils.utils', [], function() {
    function byCmp(by) {
        return function(a, b) {
            var sa = a[by];
            var sb = b[by];
            return sa > sb ? 1 : (sa < sb ? -1 : 0);
        };
    }
    function keyCmp(key) {
        return function(a, b) {
            var sa = key(a);
            var sb = key(b);
            return sa > sb ? 1 : (sa < sb ? -1 : 0);
        };
    }

    function sortBy(array, by) {
        array.sort(byCmp(by));
    }
    function sortByKey(array, key) {
        array.sort(keyCmp(key));
    }

    return {
        byCmp: byCmp,
        keyCmp: keyCmp,
        sortBy: sortBy,
        sortByKey: sortByKey
    };
});