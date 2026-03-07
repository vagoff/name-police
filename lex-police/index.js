#!/usr/bin/env node
import { check } from './checker.js';

const files = process.argv.slice(2);

if (files.length === 0) {
    console.error('Usage: lex-police <file1.js> [file2.js ...]');
    process.exit(1);
}

const errors = check(files);

if (errors.length === 0) {
    console.log('✓ No structural violations found.');
    process.exit(0);
}

for (const err of errors) {
    console.error(`${err.file}:${err.line ?? '?'} — ${err.message}`);
}
process.exit(1);
