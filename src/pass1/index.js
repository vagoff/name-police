const traverse = require('@babel/traverse').default;

function collectSignatures(ast, filename, existingSignatures = new Map()) {
  const errors = [];
  const methodSignatures = new Map(existingSignatures);
  const mixins = new Map();
  const mixinApplications = new Map();

  function extractParamNames(params) {
    return params.map(p => {
      if (p.type === 'Identifier') return p.name;
      if (p.type === 'AssignmentPattern' && p.left.type === 'Identifier') return p.left.name;
      if (p.type === 'RestElement' && p.argument.type === 'Identifier') return p.argument.name;
      return null;
    }).filter(Boolean);
  }

  function registerMethod(methodName, paramNames, loc) {
    if (methodSignatures.has(methodName)) {
      const existing = methodSignatures.get(methodName);
      if (existing.join(',') !== paramNames.join(',')) {
        errors.push({
          file: filename,
          line: loc?.start?.line,
          message: `Method/function "${methodName}" has conflicting signatures: ` +
            `(${existing.join(', ')}) vs (${paramNames.join(', ')}). Rename one of them.`
        });
      }
    } else {
      methodSignatures.set(methodName, paramNames);
    }
  }

  function registerFunction(name, params, loc) {
    registerMethod(name, extractParamNames(params), loc);
  }

  traverse(ast, {
    // class method: class Foo { bar(dbt) {} }
    ClassMethod(path) {
      const key = path.node.key;
      if (key.type !== 'Identifier') return;
      if (key.name === 'constructor') return;
      registerFunction(key.name, path.node.params, path.node.loc);
    },

    // class field as function: class Foo { bar = (dbt) => {} }
    ClassProperty(path) {
      const key = path.node.key;
      if (key.type !== 'Identifier') return;
      const val = path.node.value;
      if (!val) return;
      if (val.type === 'FunctionExpression' || val.type === 'ArrowFunctionExpression') {
        registerFunction(key.name, val.params, path.node.loc);
      }
    },

    // function foo(dbt) {}
    FunctionDeclaration(path) {
      const id = path.node.id;
      if (!id) return;
      registerFunction(id.name, path.node.params, path.node.loc);
    },

    VariableDeclarator(path) {
      const id = path.node.id;
      const init = path.node.init;
      if (!id || id.type !== 'Identifier' || !init) return;

      const isFn = init.type === 'FunctionExpression' || init.type === 'ArrowFunctionExpression';
      if (!isFn) return;

      // Mixin: (Super) => class extends Super { ... }
      // detect by: single param + body is ClassBody or BlockStatement returning ClassExpression
      const isMixinDef =
        (init.body.type === 'ClassBody') ||
        (init.body.type === 'BlockStatement' &&
          init.body.body.some(s =>
            s.type === 'ReturnStatement' && s.argument?.type === 'ClassExpression'
          ));

      if (isMixinDef) {
        // collect mixin methods
        const classBody = init.body.type === 'ClassBody'
          ? init.body
          : init.body.body.find(s => s.type === 'ReturnStatement').argument.body;
        const methods = [];
        for (const member of classBody.body) {
          if (member.type === 'ClassMethod' && member.key.type === 'Identifier') {
            if (member.key.name === 'constructor') continue;
            registerFunction(member.key.name, member.params, member.loc);
            methods.push(member.key.name);
          }
        }
        mixins.set(id.name, methods);
        return;
      }

      // Mixin application: const MyClass = DbMixin(Base)
      if (init.type === 'CallExpression' && init.callee.type === 'Identifier') {
        if (mixins.has(init.callee.name)) {
          mixinApplications.set(id.name, init.callee.name);
          return;
        }
      }

      // Regular function/arrow: const foo = (dbt) => ...
      registerFunction(id.name, init.params, init.loc);
    },

    // object literal method: const o = { m1(dbt) {} }
    ObjectMethod(path) {
      const key = path.node.key;
      if (key.type !== 'Identifier') return;
      registerFunction(key.name, path.node.params, path.node.loc);
    },
    MemberExpression(path) {
      const obj = path.node.object;
      const prop = path.node.property;
      if (prop.type === 'Identifier' && prop.name === 'prototype') {
        errors.push({
          file: filename,
          line: path.node.loc?.start?.line,
          message: `".prototype" is forbidden. Use class syntax instead.`
        });
      }
      if (obj.type === 'Identifier' && obj.name === 'Object' &&
          prop.type === 'Identifier' && prop.name === 'assign') {
        errors.push({
          file: filename,
          line: path.node.loc?.start?.line,
          message: `"Object.assign" is forbidden. Use class syntax instead.`
        });
      }
    }
  });

  return { methodSignatures, mixins, mixinApplications, errors };
}

module.exports = { collectSignatures };
