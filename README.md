# 🚔 name-police

**Stop your teammates from naming DB instances `helper2`.**

name-police is a static analysis tool for JavaScript that enforces naming conventions with the force of a type system — without the weight of one.

```
test/service.js:42 — "conn" receives new DB_ToolBox() but doesn't match required pattern ^(dbt|new_dbt|dbt2|tmp_dbt)$
test/service.js:67 — "plain" receives "dbt" (controlled as DB_ToolBox) but doesn't match required pattern
test/service.js:89 — "dbt" is a controlled name and can only be used in assignments or method calls. Found in: IfStatement
```

---

## The Idea

Every codebase has classes that matter. `DB_ToolBox`. `ApiClient`. `AuthSession`. You know exactly what they are — and you know that when someone names an instance `temp`, `obj`, or `x`, things go wrong.

name-police makes a simple observation:

> **If you control what names instances can have, and you control where those names can flow — you get data flow analysis for free. No inference. No types. Just names.**

The math works out like this:

- `new DB_ToolBox()` can **only** be assigned to a variable matching `^(dbt|...)$`
- A `dbt*` variable can **only** flow into another `dbt*` variable or parameter
- A `dbt*` name can **only** appear in assignments, calls, and null-checks
- Therefore: **any variable named `dbt*` is guaranteed to hold a `DB_ToolBox` instance**

No type inference. No runtime overhead. No PhD required.

This is not Hungarian notation. Hungarian notation adds cognitive load by encoding type into a prefix nobody asked for. name-police lets you use **good names** — short, readable, obvious — and then enforces them. `dbt` is just a good name for a database toolbox. The machine-checked invariant is a free bonus.

---

## Install

```bash
npm install --save-dev name-police
```

---

## Usage

```bash
npx name-police .name-police.json src/**/*.js
```

---

## Configuration

```json
{
  "strictConstructors": true,
  "allowedConstructors": ["EventEmitter", "Router"],
  "constructors": {
    "DB_ToolBox": "^(dbt|new_dbt|dbt2|tmp_dbt)$",
    "ApiClient":  "^api[A-Z][A-Za-z0-9]*$",
    "AuthSession": "^(sess|session|authSess)$"
  }
}
```

---

## What It Catches

### ✗ Wrong name on construction
```js
const helper = new DB_ToolBox();   // ERROR: "helper" doesn't match ^(dbt|...)$
const dbt = new DB_ToolBox();      // ✓
this.dbt = new DB_ToolBox();       // ✓
```

### ✗ Controlled name leaking into uncontrolled variable
```js
const plain = dbt;    // ERROR: "plain" is not a controlled name
const dbt2 = dbt;     // ✓
```

### ✗ Controlled name used in forbidden context
```js
console.log(dbt);          // ERROR
const x = dbt + something; // ERROR
`query: ${dbt}`;           // ERROR
return dbt;                // ERROR
if (dbt) { ... }           // ✓ null-check is fine
dbt.query();               // ✓ method call is fine
const { dbt } = obj;       // ✓ shorthand destructuring preserves the name
return { dbt };            // ✓ shorthand object property preserves the name
```

### ✗ Passing controlled instance to wrong parameter
```js
class Service {
  process(dbt, userId) { ... }  // pass1 records: process → [dbt, userId]
}

svc.process(helper, 42);   // ERROR: arg 1 must match ^(dbt|...)$
svc.process(dbt, 42);      // ✓
svc.process(this.dbt, 42); // ✓ last segment is "dbt"
```

### ✗ Method signature conflicts
```js
// file1.js
class A { process(dbt, userId) {} }

// file2.js  
class B { process(conn, userId) {} }  // ERROR: "process" has conflicting signatures
```

This is a feature, not a limitation. One name = one contract. Always.

### ✗ Unknown constructors (when `strictConstructors: true`)
```js
const repo = new UserRepository();  // ERROR: not in constructors or allowedConstructors
const m = new Map();                // ✓ built-in
const e = new Error('oops');        // ✓ built-in
```

---

## How It Works

Two passes over your AST:

**Pass 1** — collect all function, method, and mixin signatures globally across all files. Build a table: `methodName → [paramName, paramName, ...]`. Flag any name that appears with two different signatures.

**Pass 2** — run 5 independent visitors:
1. `strict-constructors` — unknown `new Foo()` check
2. `constructor-naming` — checks the assignment target of every `new`
3. `assignment-flow` — checks both sides of every assignment
4. `call-arg-naming` — checks every call site against the signature table
5. `forbidden-contexts` — whitelist of allowed positions for controlled names

Each visitor is independent. Adding a new rule = adding one file.

---

## Supported Syntax

- Classes, class fields, class methods
- Mixins: `const M = (Super) => class extends Super { ... }`
- Object literal methods: `const o = { process(dbt) { } }`
- Named functions and arrow functions at any nesting level
- Anonymous callbacks with controlled params → **forbidden** (name your function)
- `this.dbt`, `o.x.dbt` — last segment is the controlled name
- Default params: `f(dbt = null)` allowed, `f(dbt = 5)` forbidden
- Shorthand destructuring: `const { dbt } = obj` allowed
- `Object.assign` and `.prototype` → always forbidden

---

## ESLint Plugin

```bash
npm install --save-dev eslint-plugin-name-police
```

```json
{
  "plugins": ["name-police"],
  "rules": {
    "name-police/enforce": ["error", { "config": ".name-police.json" }]
  }
}
```

---

## Prior Art

Nothing does exactly this. The closest things are:

- **TypeScript branded types** — heavier, doesn't enforce naming, requires TS
- **Semgrep** — pattern matching without flow, YAML rules don't compose
- **ESLint naming-convention** — checks names in isolation, no flow tracking
- **Hungarian notation** — same idea, no enforcement, adds noise

name-police is what you get when you observe that **naming discipline + mechanical enforcement = most of what a type system gives you**, at a fraction of the cost.

---

## License

MIT

---

## Authors

Built by [@vagoff](https://github.com/vagoff) and [Claude](https://claude.ai) (Anthropic) in one sitting.

The idea, architecture, and every "wait, you didn't handle this case" — vagoff.  
The typing — Claude.
