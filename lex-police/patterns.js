// Single source of truth for structural patterns.
// Each pattern has:
//   re      — regex for text-based checks (block-comments visitor)
//   label   — human-readable name for error messages
//   check   — function(node) => bool for AST-based checks (toplevel-shape visitor)

export const PATTERNS = [
    {
        label: 'top-level function',
        re:    /^function \w+\(/,
        check: node => node.type === 'FunctionDeclaration',
    },
    {
        label: 'class',
        re:    /^class \w+ /,
        check: node => node.type === 'ClassDeclaration',
    },
    {
        label: 'top-level const',
        re:    /^const \w+ =/,
        check: node => node.type === 'VariableDeclaration' && node.kind === 'const',
    },
    {
        label: 'module.exports',
        re:    /^module\.exports/,
        check: node => {
            if (node.type !== 'ExpressionStatement') return false;
            const expr = node.expression;
            if (expr.type !== 'AssignmentExpression') return false;
            const left = expr.left;
            if (left.type !== 'MemberExpression') return false;
            // module.exports = ...
            if (left.object?.name === 'module' &&
                left.property?.name === 'exports') return true;
            // module.exports.x = ...
            if (left.object?.type === 'MemberExpression' &&
                left.object.object?.name === 'module' &&
                left.object.property?.name === 'exports') return true;
            return false;
        },
    },
    {
        label: 'mixin',
        re:    /^const \w+ = \(Super\) =>/,
        check: node => {
            if (node.type !== 'VariableDeclaration' || node.kind !== 'const') return false;
            return node.declarations.some(d =>
                d.init?.type === 'ArrowFunctionExpression' &&
                d.init.params?.length === 1 &&
                d.init.params[0]?.name === 'Super' &&
                d.init.body?.type === 'ClassExpression'
            );
        },
    },
    {
        label: 'method (4-space indent)',
        re:    /^    \w+\(/,
        check: null, // checked separately via column in method-indent.js
    },
];
