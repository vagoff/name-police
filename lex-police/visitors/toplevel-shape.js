// Rule: top-level (Program body) statements must match one of the known patterns.
// top-level "let" is handled separately by no-toplevel-let (better message).
// top-level arrow is caught here as a special case of const.

import { PATTERNS } from '../patterns.js';

function isArrowConst(node) {
    if (node.type !== 'VariableDeclaration' || node.kind !== 'const') return false;
    return node.declarations.some(d =>
        d.init?.type === 'ArrowFunctionExpression' &&
        !(d.init.params?.length === 1 && d.init.params[0]?.name === 'Super' &&
          d.init.body?.type === 'ClassExpression')
    );
}

function isRequireCall(node) {
    if (node.type !== 'ExpressionStatement') return false;
    const expr = node.expression;
    return expr.type === 'CallExpression' && expr.callee?.name === 'require';
}

function isStrictDirective(node) {
    return node.type === 'ExpressionStatement' &&
        node.expression?.type === 'StringLiteral';
}

export function visitToplevelShape(path, { filename, errors }) {
    if (path.node.type !== 'Program') return;

    for (const node of path.node.body) {
        // let is handled by no-toplevel-let with a specific message
        if (node.type === 'VariableDeclaration' && node.kind === 'let') continue;
        // side-effect require() and 'use strict'
        if (isRequireCall(node)) continue;
        if (isStrictDirective(node)) continue;

        // top-level arrow function (non-mixin)
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

        // check against known patterns
        const matched = PATTERNS.some(p => p.check && p.check(node));
        if (!matched) {
            errors.push({
                file: filename,
                line: node.loc?.start?.line,
                message: `Top-level ${node.type}${node.kind ? ` (${node.kind})` : ''} is not allowed. ` +
                    `Allowed: function, class, const, module.exports, mixin.`,
            });
        }
    }
}
