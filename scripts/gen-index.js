#!/usr/bin/env node
// gen-index.js — regenerate INDEX.md with blob URLs
// Run from repo root: node scripts/gen-index.js

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const DIRS = ['idealib_en', 'idealib_ru', 'idealib_attic'];

function getRemote() {
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    return url
      .replace(/https:\/\/[^@]+@github\.com\//, 'https://github.com/')
      .replace(/\.git$/, '');
  } catch { return 'https://github.com/OWNER/REPO'; }
}

function getBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch { return 'main'; }
}

function getMeta(filepath) {
  const text = readFileSync(filepath, 'utf8');
  const get = (key) => {
    const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : '';
  };
  return { id: get('id'), strength: get('strength'), tags: get('tags') };
}

function getFiles(dir) {
  try {
    return readdirSync(dir)
      .filter(f => f.startsWith('idea-') && f.endsWith('.md'))
      .sort()
      .map(f => ({ file: f, path: `${dir}/${f}` }));
  } catch { return []; }
}

const base = `${getRemote()}/blob/${getBranch()}`;
const lines = [
  '# name-police / idealib index',
  '',
  'Machine-readable index of all idea units.',
  'Regenerate with `node scripts/gen-index.js` (runs automatically on `git push`).',
  'Each link is a GitHub blob URL — fetchable by agents and LLMs.',
  '',
];

for (const dir of DIRS) {
  const files = getFiles(dir);
  if (!files.length) continue;
  lines.push(`## ${dir}`, '');
  for (const { path } of files) {
    const { id, strength, tags } = getMeta(path);
    lines.push(`- [${id}](${base}/${path}) \`${strength}\` ${tags}`);
  }
  lines.push('');
}

writeFileSync('INDEX.md', lines.join('\n'));
console.log('INDEX.md updated.');
