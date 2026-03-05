/**
 * Rule: certain method/function arguments must be one of a whitelisted set of string literals.
 *
 * Config shape:
 * {
 *   "literalArgs": {
 *     "setMode":  { "0": ["read", "write", "admin"] },
 *     "query":    { "1": ["SELECT", "INSERT", "UPDATE", "DELETE"] }
 *   }
 * }
 *
 * Keys are argument positions (0-based, as strings).
 */
function visitLiteralArgs(path, { config, filename, errors }) {
  if (!config.literalArgs) return;
  if (path.node.type !== 'CallExpression') return;

  const call = path.node;
  const methodName = getMethodName(call.callee);
  if (!methodName) return;

  const rules = config.literalArgs[methodName];
  if (!rules) return;

  for (const [posStr, allowed] of Object.entries(rules)) {
    const pos = parseInt(posStr, 10);
    const arg = call.arguments[pos];
    if (!arg) continue;

    // Must be a string literal
    if (arg.type !== 'StringLiteral' && arg.type !== 'TemplateLiteral') {
      errors.push({
        file: filename,
        line: call.loc?.start?.line,
        message: `Argument ${pos} to "${methodName}" must be a string literal, ` +
          `one of: ${allowed.map(s => `"${s}"`).join(', ')}`
      });
      continue;
    }

    // TemplateLiteral without expressions is effectively a string literal
    const value = arg.type === 'StringLiteral'
      ? arg.value
      : (arg.expressions.length === 0 ? arg.quasis[0].value.cooked : null);

    if (value === null) {
      errors.push({
        file: filename,
        line: call.loc?.start?.line,
        message: `Argument ${pos} to "${methodName}" must be a plain string literal ` +
          `(no template expressions), one of: ${allowed.map(s => `"${s}"`).join(', ')}`
      });
      continue;
    }

    if (!allowed.includes(value)) {
      errors.push({
        file: filename,
        line: call.loc?.start?.line,
        message: `Argument ${pos} to "${methodName}" must be one of: ` +
          `${allowed.map(s => `"${s}"`).join(', ')}, got "${value}"`
      });
    }
  }
}

function getMethodName(callee) {
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
    return callee.property.name;
  }
  return null;
}

module.exports = visitLiteralArgs;
