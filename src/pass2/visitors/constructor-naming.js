const { matchesClass, getControlledName } = require('../../config');

/**
 * Rule: `new C1()` must be assigned to a variable/property
 * whose last segment matches the pattern for C1.
 *
 * Allowed:
 *   const dbt = new DB_ToolBox()
 *   this.dbt  = new DB_ToolBox()
 *   o.dbt     = new DB_ToolBox()
 *
 * Forbidden:
 *   const helper = new DB_ToolBox()   // wrong name
 *   new DB_ToolBox()                  // no assignment at all
 */
function visitConstructorNaming(path, { config, filename, errors }) {
  if (path.node.type !== 'NewExpression') return;

  const className = getCalleeName(path.node);
  if (!className || !config.constructors[className]) return;

  const parent = path.parent;
  let targetNode = null;

  if (parent.type === 'VariableDeclarator') {
    targetNode = parent.id;
  }

  if (parent.type === 'AssignmentExpression' && parent.right === path.node) {
    targetNode = parent.left;
  }

  if (!targetNode) {
    errors.push({
      file: filename,
      line: path.node.loc?.start?.line,
      message: `Instance of "${className}" must be immediately assigned to a variable matching ` +
        `pattern ${config.constructors[className]}`
    });
    return;
  }

  const name = getControlledName(targetNode);

  if (!name) {
    errors.push({
      file: filename,
      line: path.node.loc?.start?.line,
      message: `Instance of "${className}" assigned to unsupported target (computed/destructured). ` +
        `Use a plain variable or property.`
    });
    return;
  }

  if (!matchesClass(name, className, config)) {
    errors.push({
      file: filename,
      line: path.node.loc?.start?.line,
      message: `"${name}" receives new ${className}() but doesn't match required pattern ` +
        `${config.constructors[className]}`
    });
  }
}

function getCalleeName(newExpr) {
  const c = newExpr.callee;
  if (!c) return null;
  if (c.type === 'Identifier') return c.name;
  return null;
}

module.exports = visitConstructorNaming;
