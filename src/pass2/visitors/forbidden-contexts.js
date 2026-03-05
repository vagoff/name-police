const { matchesPattern, getControlledName } = require('../../config');

/**
 * Rule: controlled names may ONLY appear as:
 *   - LHS/RHS of assignment
 *   - argument in a call: f(dbt), o.m(dbt)
 *   - object of a method call: dbt.method(), this.dbt.method()
 *   - function parameter declaration (pass1 collects these)
 *
 * Everything else is forbidden (if, return, arithmetic, spread, etc).
 */
function isAllowedUsage(path) {
  const parent = path.parent;
  const node = path.node;

  // RHS of assignment: a = dbt  /  a = o.dbt
  if (parent.type === 'AssignmentExpression' && parent.right === node) return true;

  // LHS of assignment: dbt = ...  /  this.dbt = ...
  if (parent.type === 'AssignmentExpression' && parent.left === node) return true;

  // RHS of var declarator: const a = dbt
  if (parent.type === 'VariableDeclarator' && parent.init === node) return true;

  // LHS of var declarator: const dbt = ...
  if (parent.type === 'VariableDeclarator' && parent.id === node) return true;

  // Argument in a call: f(dbt), o.m(dbt)
  if (parent.type === 'CallExpression' && parent.arguments.includes(node)) return true;

  // Object of a MemberExpression: dbt.method  /  this.dbt.method
  // (the MemberExpression itself must be callee of a CallExpression)
  if (parent.type === 'MemberExpression' && parent.object === node) {
    const grandParent = path.parentPath?.parent;
    // dbt.method()  — MemberExpression is callee of CallExpression
    if (grandParent?.type === 'CallExpression' && grandParent.callee === parent) return true;
    // this.dbt.method — MemberExpression is object of another MemberExpression (chaining)
    if (grandParent?.type === 'MemberExpression' && grandParent.object === parent) return true;
  }

  // Property of a MemberExpression: o.dbt — the "dbt" identifier node itself
  // is the .property of a MemberExpression — allowed, outer MemberExpression will be checked
  if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) return true;

  // Function/method parameter declaration — only if the function is named
  if (parent.type === 'ClassMethod' || parent.type === 'ObjectMethod') {
    if (parent.params && parent.params.includes(node)) return true;
  }
  if (parent.type === 'FunctionDeclaration') {
    // always named (id is required)
    if (parent.params && parent.params.includes(node)) return true;
  }
  if (parent.type === 'FunctionExpression' || parent.type === 'ArrowFunctionExpression') {
    // named function expression: const foo = function bar(dbt) {} — bar is its own id
    if (parent.type === 'FunctionExpression' && parent.id) {
      if (parent.params && parent.params.includes(node)) return true;
    }
    // assigned to variable: const foo = (dbt) => ...  or  const foo = function(dbt) {}
    const grandParent = path.parentPath?.parent;
    const isNamed =
      grandParent?.type === 'VariableDeclarator' ||
      grandParent?.type === 'ClassProperty';
    if (isNamed && parent.params && parent.params.includes(node)) return true;
  }

  // Boolean/nullish check: if (dbt), dbt && x, dbt || x, dbt ?? x, dbt ? a : b
  // Legitimate null-check since controlled params can be null
  if (parent.type === 'IfStatement' && parent.test === node) return true;
  if (parent.type === 'LogicalExpression' && parent.left === node) return true;
  if (parent.type === 'ConditionalExpression' && parent.test === node) return true;

  // Shorthand object property: {dbt} === {dbt: dbt} — allowed
  // because the controlled name is preserved as the key
  // Non-shorthand {foo: dbt} — forbidden (name is lost)
  if (parent.type === 'ObjectProperty' && parent.shorthand) return true;

  // AssignmentPattern in param: f(dbt = null) or f(dbt = undefined) — allowed
  // anything else like f(dbt = 5) — forbidden
  if (parent.type === 'AssignmentPattern' && parent.left === node) {
    const rhs = parent.right;
    const isNullish = rhs.type === 'NullLiteral' ||
      (rhs.type === 'Identifier' && rhs.name === 'undefined');
    if (isNullish) return true;
  }

  return false;
}

function visitForbiddenContexts(path, { config, filename, errors }) {
  // We check both plain Identifiers and MemberExpressions
  // For MemberExpression: only check the full expression, not its sub-nodes
  // (sub-nodes are handled individually when they're Identifiers)

  const name = getControlledName(path.node);
  if (!name) return;

  const controlledClass = matchesPattern(name, config);
  if (!controlledClass) return;

  if (!isAllowedUsage(path)) {
    errors.push({
      file: filename,
      line: path.node.loc?.start?.line,
      message: `"${name}" is a controlled name (${controlledClass}) and can only be used in ` +
        `assignments, function arguments, or method calls on it. Found in: ${path.parent.type}`
    });
  }
}

module.exports = visitForbiddenContexts;
