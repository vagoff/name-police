const traverse = require('@babel/traverse').default;
const visitConstructorNaming  = require('./visitors/constructor-naming');
const visitAssignmentFlow     = require('./visitors/assignment-flow');
const visitCallArgNaming      = require('./visitors/call-arg-naming');
const visitForbiddenContexts  = require('./visitors/forbidden-contexts');
const visitStrictConstructors = require('./visitors/strict-constructors');
const visitLiteralArgs        = require('./visitors/literal-args');

const VISITORS = [
  visitStrictConstructors,
  visitConstructorNaming,
  visitAssignmentFlow,
  visitCallArgNaming,
  visitLiteralArgs,
  visitForbiddenContexts,
];

function runChecks(ast, { config, methodSignatures, filename }) {
  const errors = [];
  const context = { config, methodSignatures, filename, errors };

  traverse(ast, {
    enter(path) {
      for (const visitor of VISITORS) {
        visitor(path, context);
      }
    }
  });

  return errors;
}

module.exports = { runChecks };
