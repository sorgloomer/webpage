function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function extract(shaderCode, type) {
    // language=regexp
    const identifier = "([a-zA-Z0-9_]+)";
    var regexp = `^\\s*${escapeRegex(type)}\\s+${identifier}\\s+${identifier}\\s*;`;
    var matches = shaderCode.matchAll(new RegExp(regexp, 'gm'));
    return Array.from(matches).map(m => ({type:m[1], name:m[2]}));
}

export function shader(code, type) {
    var uniforms = extract(code, 'uniform');
    var attributes = extract(code, 'attribute');
    return { type, code, uniforms, attributes };
}
