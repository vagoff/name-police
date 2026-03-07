#!/usr/bin/env node
// Builds CODEBASE-INDEX.json — machine-readable map of the codebase.
//
// Output structure:
//   functions → name → { file, line }
//   constants → name → { file, line }        (excludes require() imports)
//   classes   → name → { file, line, methods: [name, ...] }
//   methods   → name → [{ file, line, class }]

import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const parser   = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const BABEL_OPTS = {
    sourceType: 'script',
    plugins: ['optionalChaining', 'nullishCoalescingOperator'],
    attachComment: false,
};

function parseFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    try {
        return parser.parse(code, BABEL_OPTS);
    } catch (e) {
        return null;
    }
}

function isRequireInit(init) {
    if (!init) return false;
    // require('x')
    if (init.type === 'CallExpression' && init.callee?.name === 'require') return true;
    // require('x').something
    if (init.type === 'MemberExpression' && isRequireInit(init.object)) return true;
    return false;
}

function collectFile(filePath, index) {
    const ast = parseFile(filePath);
    if (!ast) return;

    traverse(ast, {
        enter (p) {
            const node = p.node;

            // top-level function
            if (node.type === 'FunctionDeclaration' &&
                p.parent.type === 'Program' &&
                node.id?.name) {
                index.functions[node.id.name] = { file: filePath, line: node.loc?.start?.line };
            }

            // top-level const — exclude require() imports, arrows, functions
            if (node.type === 'VariableDeclaration' &&
                node.kind === 'const' &&
                p.parent.type === 'Program') {
                for (const decl of node.declarations) {
                    if (!decl.id?.name) continue;
                    const init = decl.init;
                    if (isRequireInit(init)) continue;
                    if (init?.type === 'ArrowFunctionExpression') continue;
                    if (init?.type === 'FunctionExpression') continue;
                    index.constants[decl.id.name] = { file: filePath, line: node.loc?.start?.line };
                }
            }

            // class declaration
            if (node.type === 'ClassDeclaration' && node.id?.name) {
                const name = node.id.name;
                const methods = [];

                for (const member of node.body.body) {
                    if (member.type !== 'ClassMethod') continue;
                    if (!member.key?.name || member.static) continue;
                    methods.push(member.key.name);
                    if (!index.methods[member.key.name]) index.methods[member.key.name] = [];
                    index.methods[member.key.name].push({
                        file: filePath,
                        line: member.loc?.start?.line,
                        class: name,
                    });
                }

                index.classes[name] = { file: filePath, line: node.loc?.start?.line, methods };
            }
        }
    });
}

function buildIndex(files) {
    const index = { functions: {}, constants: {}, classes: {}, methods: {} };
    for (const file of files) collectFile(file, index);
    return index;
}

// CLI: build-index.js file1.js file2.js ... [--out path]
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: build-index.js <file1.js> ... [--out CODEBASE-INDEX.json]');
    process.exit(1);
}

const outIdx  = args.indexOf('--out');
const outFile = outIdx !== -1 ? args[outIdx + 1] : 'CODEBASE-INDEX.json';
const jsFiles = args.filter((a, i) => {
    if (a === '--out') return false;
    if (outIdx !== -1 && i === outIdx + 1) return false;
    return true;
});

const index = buildIndex(jsFiles);
fs.writeFileSync(outFile, JSON.stringify(index, null, 2));

console.log(
    `✓ ${outFile} written` +
    ` (${jsFiles.length} files,` +
    ` ${Object.keys(index.functions).length} functions,` +
    ` ${Object.keys(index.constants).length} constants,` +
    ` ${Object.keys(index.classes).length} classes,` +
    ` ${Object.keys(index.methods).length} unique method names)`
);
