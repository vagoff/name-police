const { BUILTINS } = require('../../builtins');

/**
 * When strictConstructors: true —
 * any `new Foo()` where Foo is not in config.constructors and not a built-in is forbidden.
 */
function visitStrictConstructors(path, { config, filename, errors }) {
  if (!config.strictConstructors) return;
  if (path.node.type !== 'NewExpression') return;

  const callee = path.node.callee;
  if (callee.type !== 'Identifier') return; // new a.B() — skip, not a simple class name

  const className = callee.name;

  if (config.constructors[className]) return; // controlled — ok
  if (BUILTINS.has(className)) return;        // built-in — ok
  if (config.allowedConstructors.has(className)) return; // explicitly allowed — ok

  errors.push({
    file: filename,
    line: path.node.loc?.start?.line,
    message: `"${className}" is not a registered constructor. ` +
      `Add it to config "constructors" or disable strictConstructors.`
  });
}

module.exports = visitStrictConstructors;
