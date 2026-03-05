/**
 * Extract the "controlled name" from a node — always the last segment.
 *   Identifier:       dbt         → "dbt"
 *   MemberExpression: this.dbt    → "dbt"
 *                     a.b.c.dbt   → "dbt"
 * Returns null for anything else (computed, call expression, etc).
 */
function getControlledName(node) {
  if (!node) return null;
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression' && !node.computed) {
    if (node.property.type === 'Identifier') return node.property.name;
  }
  return null;
}

/**
 * Config shape:
 * {
 *   "constructors": {
 *     "DB_ToolBox": "^(dbt|new_dbt|dbt2|tmp_dbt)",
 *     "C1": "^xxx[A-Za-z0-9_]+"
 *   }
 * }
 */

function loadConfig(configObj) {
  const constructors = {};

  for (const [className, pattern] of Object.entries(configObj.constructors || {})) {
    constructors[className] = new RegExp(pattern);
  }

  const strictConstructors = configObj.strictConstructors === true;
  const allowedConstructors = new Set(configObj.allowedConstructors || []);

  return { constructors, strictConstructors, allowedConstructors };
}

// Given a variable name, find which pattern it matches (if any)
function matchesPattern(name, config) {
  for (const [className, regex] of Object.entries(config.constructors)) {
    if (regex.test(name)) return className;
  }
  return null;
}

// Given a variable name, check if it matches the pattern for a specific class
function matchesClass(name, className, config) {
  const regex = config.constructors[className];
  return regex ? regex.test(name) : false;
}

module.exports = { loadConfig, matchesPattern, matchesClass, getControlledName };
