#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const { loadConfig } = require('./config');
const { collectSignatures } = require('./pass1/index');
const { runChecks } = require('./pass2/index');

const BABEL_OPTS = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'jsx',
    ['decorators', { decoratorsBeforeExport: true }],
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'optionalChaining',
    'nullishCoalescingOperator',
    'logicalAssignment',
  ]
};

function parseFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    return parser.parse(code, BABEL_OPTS);
  } catch (e) {
    return { parseError: e.message };
  }
}

function check(files, configObj) {
  const config = loadConfig(configObj);
  const allErrors = [];

  // Pass 1: collect signatures across all files
  let methodSignatures = new Map();

  for (const file of files) {
    const ast = parseFile(file);
    if (ast.parseError) {
      allErrors.push({ file, line: 0, message: `Parse error: ${ast.parseError}` });
      continue;
    }
    const result = collectSignatures(ast, file, methodSignatures);
    methodSignatures = result.methodSignatures; // accumulate
    allErrors.push(...result.errors);
  }

  // Pass 2: run checks on each file
  for (const file of files) {
    const ast = parseFile(file);
    if (ast.parseError) continue; // already reported

    const errors = runChecks(ast, { config, methodSignatures, filename: file });
    allErrors.push(...errors);
  }

  return allErrors;
}

// CLI entry
function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: nameguard <config.json> <file1.js> [file2.js ...]');
    process.exit(1);
  }

  const configPath = args[0];
  const files = args.slice(1);

  const configObj = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const errors = check(files, configObj);

  if (errors.length === 0) {
    console.log('✓ No violations found.');
    process.exit(0);
  }

  for (const err of errors) {
    console.error(`${err.file}:${err.line ?? '?'} — ${err.message}`);
  }
  process.exit(1);
}

module.exports = { check };

if (require.main === module) main();
