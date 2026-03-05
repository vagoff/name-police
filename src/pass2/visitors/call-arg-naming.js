const { matchesPattern, matchesClass, getControlledName } = require('../../config');

/**
 * Rule: when calling f(arg) or o.method(arg),
 * controlled args must go to controlled params and vice versa.
 *
 * Works on last segment:
 *   svc.process(this.dbt, x)  →  arg name = "dbt"
 */
function visitCallArgNaming(path, { config, methodSignatures, filename, errors }) {
  if (path.node.type !== 'CallExpression') return;

  const call = path.node;
  const args = call.arguments;
  if (!args.length) return;

  const methodName = getMethodName(call.callee);
  if (!methodName) return;

  const paramNames = methodSignatures.get(methodName);
  if (!paramNames) return;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const paramName = paramNames[i];
    if (!paramName) continue;

    const argName = getControlledName(arg);

    const paramClass = matchesPattern(paramName, config);
    const argClass = argName ? matchesPattern(argName, config) : null;

    // Param expects controlled but arg doesn't match
    if (paramClass && (!argName || !matchesClass(argName, paramClass, config))) {
      errors.push({
        file: filename,
        line: call.loc?.start?.line,
        message: `Argument ${i + 1} to "${methodName}" must match pattern ` +
          `${config.constructors[paramClass]} (parameter "${paramName}" is controlled as ${paramClass})` +
          (argName ? `, but got "${argName}"` : `, but got non-identifier expression`)
      });
    }

    // Arg is controlled but param doesn't expect it
    if (argClass && !paramClass) {
      errors.push({
        file: filename,
        line: call.loc?.start?.line,
        message: `Argument "${argName}" is controlled as ${argClass} but parameter "${paramName}" ` +
          `of "${methodName}" is not a controlled parameter. Check method signature.`
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

module.exports = visitCallArgNaming;
