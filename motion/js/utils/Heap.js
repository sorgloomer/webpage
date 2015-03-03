define('utils.Heap', [], function() {

    function swap(l, i, j) {
        var tmp = l[i];
        l[i] = l[j];
        l[j] = tmp;
    }
    function Heap() {
        var list = [];

        function push(key, value) {
            var index = list.length, parent = 0;
            var cursor = {key:key, value:value};
            list.push(cursor);
            while (index > 0) {
                parent = ((index - 1) / 2)|0;
                var pitem = list[parent];
                if (cursor.key < pitem.key) {
                    list[index] = pitem;
                    index = parent;
                } else break;
            }
            list[index] = cursor;
        }

        function pop() {
            var result = list[0];
            if (list.length > 1) {
                list[0] = list.pop();
                var length = list.length;
                var index = 0;
                for (; ;) {
                    var left = index * 2 + 1;
                    var right = left + 1;
                    var smallest = index;
                    if (left < length && list[left].key < list[smallest].key) {
                        smallest = left;
                    }
                    if (right < length && list[right].key < list[smallest].key) {
                        smallest = right;
                    }
                    if (smallest !== index) {
                        swap(list, index, smallest);
                        index = smallest;
                    } else {
                        break;
                    }
                }
            } else if (list.length > 0) {
                list.length = 0;
            }
            return result;
        }
        function peek() {
            return list[0];
        }

        function has() {
            return list.length > 0;
        }
        this.list = list;
        this.pop = pop;
        this.push = push;
        this.peek = peek;
        this.has = has;
    }

    return Heap;
});