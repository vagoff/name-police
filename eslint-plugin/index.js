const path = require('path');
const fs = require('fs');
const { check } = require('../src/checker');
const { loadConfig } = require('../src/config');

// Cache: configPath -> config object
const configCache = new Map();

function getConfig(configPath) {
  if (configCache.has(configPath)) return configCache.get(configPath);
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const cfg = loadConfig(raw);
  configCache.set(configPath, cfg);
  return cfg;
}

// ESLint rule: runs name-police on the current file
// Options: [{ config: ".name-police.json" }]
const rule = {
  meta: {
    type: 'problem',
    schema: [{ type: 'object', properties: { config: { type: 'string' } }, required: ['config'] }],
    messages: { violation: '{{ message }}' }
  },

  create(context) {
    const configPath = path.resolve(process.cwd(), context.options[0]?.config ?? '.name-police.json');
    const filename = context.getFilename();

    return {
      Program() {
        // name-police needs all files for pass1 — in ESLint we can only check one file at a time.
        // We run both passes on the single file (signatures from same file only).
        // For full cross-file signature checking, use the CLI.
        let rawConfig;
        try {
          rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e) {
          context.report({ loc: { line: 1, column: 0 }, messageId: 'violation',
            data: { message: `name-police: cannot read config ${configPath}: ${e.message}` } });
          return;
        }

        const errors = check([filename], rawConfig);
        for (const err of errors) {
          context.report({
            loc: { line: err.line ?? 1, column: 0 },
            messageId: 'violation',
            data: { message: err.message }
          });
        }
      }
    };
  }
};

module.exports = {
  rules: { enforce: rule },
  configs: {
    recommended: {
      plugins: ['name-police'],
      rules: { 'name-police/enforce': ['error', { config: '.name-police.json' }] }
    }
  }
};
