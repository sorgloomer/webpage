define('utils.UnionFind', [], function() {

    function max(a, b) {
        return a > b ? a : b;
    }

    function UnionFind() {
        var metaMap = new Map();

        function meta(item) {
            var meta = metaMap.get(item);
            if (!meta) {
                meta = { parent: null, height: 1, item: item };
                metaMap.set(item, meta);
            }
            return meta;
        }

        function findMeta(meta) {
            var root = meta, temp;
            while (root.parent !== null) {
                root = root.parent;
            }
            while (meta.parent !== null) {
                temp = meta.parent;
                meta.parent = root;
                meta = temp;
            }
            return root;
        }
        function find(item) {
            return findMeta(meta(item));
        }

        function unionMeta(meta1, meta2) {
            meta1 = findMeta(meta1);
            meta2 = findMeta(meta2);
            if (meta1 !== meta2) {
                if (meta1.height > meta2.height) {
                    meta2.parent = meta1;
                } else {
                    meta1.parent = meta2;
                    meta1.height = max(meta1.height, meta2.height + 1);
                }
                return true;
            }
            return false;
        }
        
        function union(item1, item2) {
            return unionMeta(meta(item1), meta(item2));
        }

        function sameMeta(meta1, meta2) {
            return findMeta(meta1) === findMeta(meta2);
        }

        function same(item1, item2) {
            return find(item1) === find(item2);
        }

        this.metaMap = metaMap;

        this.sameMeta = sameMeta;
        this.same = same;
        this.meta = meta;
        this.union = union;
        this.unionMeta = unionMeta;
        this.findMeta = findMeta;
        this.find = find;
    }

    return UnionFind;
});