# Skills & Patterns Learned Building name-police

## 1. @babel/parser over acorn

Use `@babel/parser` for modern JS/TS — acorn chokes on modern syntax.

```js
const parser = require('@babel/parser');
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['typescript', 'jsx', ['decorators', { decoratorsBeforeExport: true }],
    'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
});
```

Pair with `@babel/traverse` for walking — don't write visitors by hand.

## 2. Two-Pass Architecture for Cross-File Analysis

When you need global information (signatures, class hierarchies) before checking:

- **Pass 1**: collect everything across all files, accumulate into shared Maps
- **Pass 2**: check each file using the globally accumulated data

Pass 1 results are passed into Pass 2 via context object. Files are parsed twice
(acceptable — parsing is fast).

## 3. Visitor Pipeline Pattern

Each rule is an independent function `(path, context) => void` that pushes to
`context.errors`. The orchestrator runs all visitors in a single traverse:

```js
traverse(ast, {
  enter(path) {
    for (const visitor of VISITORS) visitor(path, context);
  }
});
```

Adding a rule = adding one file + one line in the visitors array.
No coupling between rules. No shared state between visitors.

## 4. getControlledName — Last Segment Extraction

For systems where the meaningful name is always the last segment:

```js
function getControlledName(node) {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression' && !node.computed)
    return node.property.type === 'Identifier' ? node.property.name : null;
  return null;
}
```

`dbt`, `this.dbt`, `a.b.c.dbt` → all return `"dbt"`. Unifies treatment of
local variables and object fields.

## 5. Whitelist over Blacklist for Forbidden Context Detection

Instead of listing all forbidden positions (arithmetic, template literals, spread,
return, etc.) — list the small set of **allowed** positions:

```js
function isAllowedUsage(path) {
  const parent = path.parent;
  if (parent.type === 'AssignmentExpression' ...) return true;
  if (parent.type === 'CallExpression' ...) return true;
  // ...
  return false; // everything else is forbidden
}
```

New JS syntax is forbidden by default until explicitly whitelisted.
No need to enumerate every possible forbidden node type.

## 6. Mixin Pattern Detection

```js
// Detect: const M = (Super) => class extends Super { ... }
const isMixinDef =
  (init.body.type === 'ClassBody') ||
  (init.body.type === 'BlockStatement' &&
    init.body.body.some(s =>
      s.type === 'ReturnStatement' && s.argument?.type === 'ClassExpression'
    ));
```

Mixin methods go into the same global signature table as class methods — no
special treatment needed downstream.

## 7. Anonymous vs Named Function Detection

To distinguish named functions (have a name in the signature table) from anonymous
callbacks (don't):

```js
// Named: FunctionDeclaration always has id
// Named: FunctionExpression with its own id (function foo() {})
// Named: assigned to variable (const foo = () => {}) — check grandparent
const grandParent = path.parentPath?.parent;
const isNamed =
  parent.type === 'FunctionDeclaration' ||
  (parent.type === 'FunctionExpression' && parent.id) ||
  grandParent?.type === 'VariableDeclarator' ||
  grandParent?.type === 'ClassProperty';
```

## 8. Shorthand ObjectProperty in Babel AST

`{ dbt }` is `ObjectProperty` with `shorthand: true`. Key and value are **two
separate nodes** pointing to the same identifier — don't compare by reference.
Just check `parent.shorthand === true`.

## 9. ESLint Plugin as Thin Wrapper

ESLint plugin runs one file at a time — can't do cross-file pass1.
Keep the core as a standalone checker, wrap it:

```js
create(context) {
  return {
    Program() {
      const errors = check([context.getFilename()], rawConfig);
      for (const err of errors)
        context.report({ loc: { line: err.line }, ... });
    }
  };
}
```

Document the limitation: full cross-file checking requires CLI.

## 10. GitHub Push via HTTPS Token in URL

```js
git remote add origin https://TOKEN@github.com/user/repo.git
git push -u origin main --force  // if remote has initial commit
```

Force push needed when GitHub creates repo with default README.

## 11. Built-in Constructor Whitelist

When implementing `strictConstructors`, maintain a Set of JS/Node/Browser builtins:
`Map`, `Set`, `Promise`, `Error`, `Buffer`, `URL`, `Worker`, browser APIs, etc.
Keep it in a separate `builtins.js` — it grows over time and is reusable.

## 12. Semgrep vs Custom AST Walker

Use Semgrep when: rules are simple, few in number, no cross-file analysis needed.

Write a custom AST walker when:
- Rules require cross-file information (signatures, class hierarchies)
- You need whitelist logic ("everything except these positions")
- The number of generated rules would be large (semgrep YAML becomes unwieldy)
- You need to generate rules programmatically

The tipping point: when you'd write a script to generate semgrep rules, you're
already writing the checker — just with YAML as an awkward intermediate layer.
