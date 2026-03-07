import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const parser   = require('@babel/parser');
const traverse = require('@babel/traverse').default;

import { checkBlockComments }  from './visitors/block-comments.js';
import { visitToplevelShape }  from './visitors/toplevel-shape.js';
import { visitMethodIndent }   from './visitors/method-indent.js';
import { visitSuperPosition }  from './visitors/super-position.js';
import { visitNoToplevelLet }  from './visitors/no-toplevel-let.js';

const BABEL_OPTS = {
    sourceType: 'script',
    plugins: [
        'optionalChaining',
        'nullishCoalescingOperator',
    ],
    attachComment: true,
};

const VISITORS = [
    visitToplevelShape,
    visitMethodIndent,
    visitSuperPosition,
    visitNoToplevelLet,
];

function parseFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    try {
        return { ast: parser.parse(code, BABEL_OPTS) };
    } catch (e) {
        return { parseError: e.message };
    }
}

function checkFile(filePath) {
    const result = parseFile(filePath);
    const errors = [];

    if (result.parseError) {
        return [{ file: filePath, line: 0, message: `Parse error: ${result.parseError}` }];
    }

    const { ast } = result;
    const context = { filename: filePath, errors };

    checkBlockComments(ast, context);

    traverse(ast, {
        enter (path) {
            for (const visitor of VISITORS) {
                visitor(path, context);
            }
        }
    });

    return errors;
}

export function check(files) {
    const allErrors = [];
    for (const file of files) {
        allErrors.push(...checkFile(file));
    }
    return allErrors;
}
