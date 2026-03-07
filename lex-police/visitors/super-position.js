/**
 * Rule: identifier "Super" is reserved for mixin definitions only.
 * Allowed: const M = (Super) => class extends Super { }
 * Forbidden: everywhere else.
 */

function isMixinArrow(path) {
    let cur = path.parentPath;
    while (cur) {
        if (cur.node.type === 'ArrowFunctionExpression') {
            const params = cur.node.params || [];
            const hasSuper = params.some(
                p => p.type === 'Identifier' && p.name === 'Super'
            );
            if (!hasSuper) return false;
            return cur.node.body?.type === 'ClassExpression';
        }
        cur = cur.parentPath;
    }
    return false;
}

export function visitSuperPosition(path, { filename, errors }) {
    if (path.node.type !== 'Identifier') return;
    if (path.node.name !== 'Super') return;
    if (isMixinArrow(path)) return;

    errors.push({
        file: filename,
        line: path.node.loc?.start?.line,
        message: `"Super" may only appear as a mixin parameter: const M = (Super) => class extends Super { }.`,
    });
}
