/**
 * Rule: top-level "let" declarations are forbidden.
 * Use "const". Mutable state: const state = { x: 1 }.
 */

export function visitNoToplevelLet(path, { filename, errors }) {
    if (path.node.type !== 'VariableDeclaration') return;
    if (path.node.kind !== 'let') return;
    if (path.parent.type !== 'Program') return;

    const names = path.node.declarations
        .map(d => d.id?.name ?? '?')
        .join(', ');

    errors.push({
        file: filename,
        line: path.node.loc?.start?.line,
        message: `Top-level "let ${names}" is forbidden. Use "const".`,
    });
}
