// Rule: top-level (Program body) statements must be one of:
//   - FunctionDeclaration          → function foo(
//   - ClassDeclaration             → class Foo
//   - VariableDeclaration (const)  → const x =  (but not assigning an arrow function)
//   - ExpressionStatement          → module.exports = / module.exports.x =
//   - 'use strict' / bare require() for side effects
//
// Note: top-level "let" is handled by no-toplevel-let visitor (more specific message).

function isModuleExports(node) {
    if (node.type !== 'ExpressionStatement') return false;
    const expr = node.expression;
    if (expr.type !== 'AssignmentExpression') return false;
    const left = expr.left;
    if (
        left.type === 'MemberExpression' &&
        left.object?.name === 'module' &&
        left.property?.name === 'exports'
    ) return true;
    if (
        left.type === 'MemberExpression' &&
        left.object?.type === 'MemberExpression' &&
        left.object.object?.name === 'module' &&
        left.object.property?.name === 'exports'
    ) return true;
    return false;
}

function isRequireCall(node) {
    if (node.type !== 'ExpressionStatement') return false;
    const expr = node.expression;
    if (expr.type !== 'CallExpression') return false;
    return expr.callee?.name === 'require';
}

function isArrowConst(node) {
    if (node.type !== 'VariableDeclaration' || node.kind !== 'const') return false;
    return node.declarations.some(d =>
        d.init?.type === 'ArrowFunctionExpression'
    );
}

function isMixinConst(node) {
    // const M = (Super) => class extends Super { }
    if (node.type !== 'VariableDeclaration' || node.kind !== 'const') return false;
    return node.declarations.some(d => {
        const init = d.init;
        return init?.type === 'ArrowFunctionExpression' &&
            init.params?.length === 1 &&
            init.params[0]?.name === 'Super' &&
            init.body?.type === 'ClassExpression';
    });
}

export function visitToplevelShape(path, { filename, errors }) {
    if (path.node.type !== 'Program') return;

    for (const node of path.node.body) {
        if (node.type === 'FunctionDeclaration') continue;
        if (node.type === 'ClassDeclaration') continue;
        // let is handled by no-toplevel-let with a better message
        if (node.type === 'VariableDeclaration' && node.kind === 'let') continue;
        // mixin const is allowed
        if (isMixinConst(node)) continue;
        // plain arrow at top level is forbidden
        if (isArrowConst(node)) {
            const name = node.declarations[0]?.id?.name ?? '?';
            errors.push({
                file: filename,
                line: node.loc?.start?.line,
                message: `Top-level arrow function "const ${name} = (...) =>" is not allowed. ` +
                    `Use "function ${name}(...)" instead.`,
            });
            continue;
        }
        if (node.type === 'VariableDeclaration' && node.kind === 'const') continue;
        if (isModuleExports(node)) continue;
        if (isRequireCall(node)) continue;
        if (node.type === 'ExpressionStatement' &&
            node.expression?.type === 'StringLiteral') continue;

        errors.push({
            file: filename,
            line: node.loc?.start?.line,
            message: `Top-level ${node.type}${node.kind ? ` (${node.kind})` : ''} is not allowed. ` +
                `Allowed: function, class, const, module.exports.`,
        });
    }
}
