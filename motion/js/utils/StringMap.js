define('utils.StringMap', [], function() {
    var hasOwn = Object.prototype.hasOwnProperty;

    function has(obj, key) {
        return hasOwn.call(obj, key);
    }

    function get(obj, key, def) {
        return has(obj, key) ? obj[key] : def;
    }
    function set(obj, key, val) {
        obj[key] = val;
    }

    return {
        has: has,
        get: get,
        set: set
    };
});