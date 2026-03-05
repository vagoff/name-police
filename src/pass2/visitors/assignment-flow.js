const { matchesPattern, matchesClass, getControlledName } = require('../../config');

/**
 * Rule: if RHS last segment matches a controlled pattern,
 * then LHS last segment must match the SAME pattern.
 *
 *   dbt2 = dbt          ✓
 *   this.dbt = o.dbt    ✓
 *   plain = dbt         ✗
 *   o.helper = this.dbt ✗
 */
function visitAssignmentFlow(path, { config, filename, errors }) {
  let lhsNode = null;
  let rhsNode = null;

  if (path.node.type === 'AssignmentExpression') {
    lhsNode = path.node.left;
    rhsNode = path.node.right;
  } else if (path.node.type === 'VariableDeclarator') {
    lhsNode = path.node.id;
    rhsNode = path.node.init;
  } else {
    return;
  }

  if (!rhsNode) return;

  // Skip NewExpression on RHS — handled by constructor-naming visitor
  if (rhsNode.type === 'NewExpression') return;

  const rhsName = getControlledName(rhsNode);
  const lhsName = getControlledName(lhsNode);
  const rhsClass = rhsName ? matchesPattern(rhsName, config) : null;
  const lhsClass = lhsName ? matchesPattern(lhsName, config) : null;

  // Neither side is controlled — nothing to check
  if (!rhsClass && !lhsClass) return;

  // RHS is controlled — LHS must match same pattern
  if (rhsClass) {
    if (!lhsName) {
      errors.push({
        file: filename,
        line: path.node.loc?.start?.line,
        message: `Controlled instance "${rhsName}" cannot be assigned to this target (computed/destructured).`
      });
      return;
    }
    if (!matchesClass(lhsName, rhsClass, config)) {
      errors.push({
        file: filename,
        line: path.node.loc?.start?.line,
        message: `"${lhsName}" receives "${rhsName}" (controlled as ${rhsClass}) ` +
          `but doesn't match required pattern ${config.constructors[rhsClass]}`
      });
    }
  }

  // LHS is controlled — RHS must be controlled, null, or undefined
  if (lhsClass && !rhsClass) {
    const isNullish = rhsNode.type === 'NullLiteral' ||
      (rhsNode.type === 'Identifier' && rhsNode.name === 'undefined');
    if (isNullish) return; // const dbt = null — valid initialization
    errors.push({
      file: filename,
      line: path.node.loc?.start?.line,
      message: `"${lhsName}" is a controlled name (${lhsClass}) but receives a non-controlled value. ` +
        `RHS must match pattern ${config.constructors[lhsClass]}`
    });
  }
}

module.exports = visitAssignmentFlow;
