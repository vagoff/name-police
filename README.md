# name-police 🚔

> A static analysis tool that enforces naming conventions as a type system.

**name-police** checks that instances of specific classes are always stored in variables whose names match a configured pattern — and that those names never "leak" into uncontrolled variables, arguments, or expressions.

```js
const dbt = new DB_ToolBox();  // ✓
const helper = new DB_ToolBox(); // ✗ ERROR: "helper" doesn't match pattern ^(dbt|...)
const plain = dbt;               // ✗ ERROR: controlled name flows into uncontrolled variable
if (dbt) { dbt.query(); }        // ✓ null-check + method call allowed
```

## The Idea

A sufficiently strict naming convention makes data flow analysis **reducible to syntactic checking**. If:
1. Only `new C()` can produce a controlled name
2. Controlled names can only flow into other controlled names
3. Controlled names can only be used in assignments, calls, and null-checks

...then **any variable matching the pattern is guaranteed to hold an instance of `C`**. No type inference needed.

This catches a large class of bugs (wrong variable passed to a function, instance stored under an ambiguous name, accidental leaking into untyped structures) with zero false positives in its domain.

## Install

```bash
npm install --save-dev name-police
```

## Usage

```bash
npx name-police .name-police.json src/**/*.js
```

## Configuration

```json
{
  "strictConstructors": true,
  "allowedConstructors": ["EventEmitter"],
  "constructors": {
    "DB_ToolBox": "^(dbt|new_dbt|dbt2|tmp_dbt)$",
    "ApiClient":  "^api[A-Z][A-Za-z0-9]*$"
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `constructors` | object | `{}` | Map of class name → allowed variable name regex |
| `strictConstructors` | boolean | `false` | Forbid `new Foo()` for any `Foo` not in `constructors`, `allowedConstructors`, or built-ins |
| `allowedConstructors` | string[] | `[]` | Classes exempt from `strictConstructors` but not name-checked |

## Rules

### 1. Constructor naming
`new C()` must be immediately assigned to a variable/property whose name matches the pattern.
```js
const dbt = new DB_ToolBox();      // ✓
this.dbt = new DB_ToolBox();       // ✓
const helper = new DB_ToolBox();   // ✗
```

### 2. Assignment flow
A controlled name can only be assigned to another controlled name. Assignment from non-controlled to controlled is also forbidden (except `null`/`undefined`).
```js
const dbt2 = dbt;       // ✓
const plain = dbt;      // ✗
const dbt3 = null;      // ✓ explicit null init
a.b.dbt = 1;            // ✗ controlled name receiving primitive
```

### 3. Call argument naming
When a function/method has a controlled parameter name, the argument passed must also match. And vice versa.
```js
class Service {
  process(dbt, userId) { ... }
}
svc.process(dbt, 42);      // ✓
svc.process(helper, 42);   // ✗
svc.process(dbt);          // ✓ (arity checking is lenient)
```

Method signatures are collected globally across all files. **All methods with the same name must have identical signatures** — name collisions are errors.

### 4. Forbidden contexts
Controlled names may only appear in:
- Assignments (LHS or RHS)
- Function/method arguments
- Method calls on the instance: `dbt.query()`
- Null checks: `if (dbt)`, `dbt && ...`, `dbt ? a : b`
- Shorthand object properties: `return { dbt }`
- Named function parameters (not anonymous callbacks)
- Default params of `null`/`undefined`: `function f(dbt = null)`

Everything else is forbidden: arithmetic, template literals, spread, `return dbt`, arrays, etc.

### 5. Strict constructors (optional)
When `strictConstructors: true`, any `new Foo()` where `Foo` is not in `constructors`, `allowedConstructors`, or the built-in whitelist is an error.

Built-ins include: `Map`, `Set`, `Promise`, `Error`, `Buffer`, `URL`, `Worker`, browser APIs, and more.

### 6. Method signature uniqueness
Methods/functions with the same name must have identical parameter lists across all files. This enables call-site checking without type inference.

### 7. Forbidden patterns
`Object.assign` and `.prototype` are always forbidden — use class syntax.

### 8. Mixins
The mixin pattern is supported:
```js
const DbMixin = (Super) => class extends Super {
  process(dbt) { ... }
};
```

Anonymous callbacks with controlled parameter names are forbidden — name your function.

## ESLint Plugin

```bash
npm install --save-dev eslint-plugin-name-police
```

```json
// .eslintrc.json
{
  "plugins": ["name-police"],
  "rules": {
    "name-police/enforce": ["error", { "config": ".name-police.json" }]
  }
}
```

## License

MIT
