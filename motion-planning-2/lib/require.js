const MODULES = new Map();

function define(name, deps, factory) {
    if (MODULES.has(name)) {
        throw { name: 'AmdError', code: 'RedefinedModule', message: name };
    }
    MODULES.set(name, { n: name, d: deps, e: null, f: factory });
}

function require(name) {
    const module = MODULES.get(name);
    if (!module) {
        throw { name: 'AmdError', code: 'ModuleNotFound', message: name };
    }
    if (!module.e) {
        try {
            module.e = {};
            module.f.apply(null, module.d.map(req));
        } catch (e) {
            throw { name: 'AmdError', code: 'ModuleInitFailed', inner: e };
        }
    }
    return module.e;

    function req(name) {
        return name === 'exports' ? module.e : require(name);
    }
}