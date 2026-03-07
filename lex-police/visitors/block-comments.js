// Rule: block comments must not contain lines matching structural patterns.
// If you want to comment out a class/function — add a leading space to the line.
//
// Operates on ast.comments directly, not on traverse path.

const STRUCTURAL_PATTERNS = [
    { re: /^function \w+\(/,  label: 'top-level function' },
    { re: /^class \w+ /,      label: 'class' },
    { re: /^    \w+\(/,       label: 'method (4-space indent)' },
    { re: /^const \w+ =/,     label: 'top-level const' },
    { re: /^module\.exports/, label: 'module.exports' },
];

export function checkBlockComments(ast, { filename, errors }) {
    const comments = ast.comments || [];

    for (const comment of comments) {
        if (comment.type !== 'CommentBlock') continue;

        const lines = comment.value.split('\n');
        const startLine = comment.loc?.start?.line ?? 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNum = startLine + i;

            for (const { re, label } of STRUCTURAL_PATTERNS) {
                if (re.test(line)) {
                    errors.push({
                        file: filename,
                        line: lineNum,
                        message: `Block comment contains a line matching ${label} pattern. ` +
                            `Add a leading space to the line to exclude it from structural analysis.`,
                    });
                    break;
                }
            }
        }
    }
}
