(function() {
    var modules = {};

    function defined(name) {
        return Object.prototype.hasOwnProperty.call(modules, name);
    }

    function fail(msg) {
        throw new Error(msg);
    }

    function define(name, deps, factory) {
        if (defined(name)) fail("Multiple modules with name " + name);
        var state = 0, module = null;
        modules[name] = function () {
            if (state > 1) return module;
            if (state > 0) fail("Circular dependency including " + name);
            state = 1;
            module = factory.apply(null, deps.map(require));
            state = 2;
            return module;
        };
    }

    function require(name) {
        if (!defined(name)) fail("Undefined module " + name);
        return modules[name]();
    }

    var context = window;
    context.define = define;
    context.require = require;
})();
