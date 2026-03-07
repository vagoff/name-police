// Rule: block comments must not contain lines matching structural patterns.
// If you want to comment out a class/function — add a leading space to the line.

import { PATTERNS } from '../patterns.js';

export function checkBlockComments(ast, { filename, errors }) {
    const comments = ast.comments || [];

    for (const comment of comments) {
        if (comment.type !== 'CommentBlock') continue;

        const lines = comment.value.split('\n');
        const startLine = comment.loc?.start?.line ?? 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            for (const { re, label } of PATTERNS) {
                if (re.test(line)) {
                    errors.push({
                        file: filename,
                        line: startLine + i,
                        message: `Block comment contains a line matching ${label} pattern. ` +
                            `Add a leading space to exclude it from structural analysis.`,
                    });
                    break;
                }
            }
        }
    }
}
