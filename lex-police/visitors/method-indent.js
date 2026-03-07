/**
 * Rule: class methods must start at exactly column 4 (0-indexed).
 */

export function visitMethodIndent(path, { filename, errors }) {
    if (path.node.type !== 'ClassMethod' &&
        path.node.type !== 'ClassPrivateMethod') return;

    const col = path.node.loc?.start?.column;
    if (col === undefined) return;

    if (col !== 4) {
        const name = path.node.key?.name ?? path.node.key?.id?.name ?? '(unknown)';
        errors.push({
            file: filename,
            line: path.node.loc?.start?.line,
            message: `Method "${name}" starts at column ${col}, expected 4. ` +
                `Use exactly 4 spaces for class method indentation.`,
        });
    }
}
