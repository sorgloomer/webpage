define('utils.MultiMap', [], function() {
    var MapClass = Map;

    function MultiMap() {
        var map = new MapClass();

        function put(key, value) {
            var list = map.get(key);
            if (list) {
                list.push(value);
            } else {
                map.set(key, [value]);
            }
        }
        function get(key) {
            return map.get(key) || [];
        }

        this.put = put;
        this.get = get;
        this.map = map;
    }


    return MultiMap;
});