# CODEBASE.md

Operational guide for agents and developers working on this codebase.
Read this first. For architecture and design decisions — see IDEA.md and idealib/.

---

## Project structure

```
src/
  checker.js          ← CLI entry point + check() orchestrator
  config.js           ← load .name-police.json, pattern matching helpers
  builtins.js         ← JS built-in constructors whitelist
  pass1/
    index.js          ← collectSignatures(): builds global method signature map
  pass2/
    index.js          ← runChecks(): runs all visitors in one traverse
    visitors/
      strict-constructors.js   ← unknown new Foo() check
      constructor-naming.js    ← assignment target of new Foo() must match pattern
      assignment-flow.js       ← controlled name can't flow into uncontrolled variable
      call-arg-naming.js       ← call site args must match signature table
      literal-args.js          ← literal values in controlled param positions
      forbidden-contexts.js    ← controlled names allowed only in whitelist positions

lex-police/
  index.js            ← CLI entry point
  checker.js          ← orchestrator: runs block-comments check + AST visitors
  patterns.js         ← SINGLE SOURCE OF TRUTH for structural patterns (re + check)
  build-index.js      ← builds CODEBASE-INDEX.json from all .js files
  visitors/
    block-comments.js ← /* */ blocks must not contain structural pattern lines
    toplevel-shape.js ← whitelist of allowed top-level constructs
    method-indent.js  ← class methods must start at column 4
    super-position.js ← Super identifier only in mixin definitions
    no-toplevel-let.js← top-level let is forbidden

eslint-plugin/
  index.js            ← ESLint plugin wrapper (subset of name-police rules)

scripts/
  gen-index.js        ← regenerates INDEX.md (runs on git push via pre-push hook)

test/                 ← fixture .js files for manual testing
idealib_en/           ← idea units in English
idealib_ru/           ← idea units in Russian
idealib_attic/        ← superseded ideas
```

---

## Running the tools

```bash
# name-police: check naming conventions
node src/checker.js .name-police.json src/**/*.js

# lex-police: check structural conventions
node lex-police/index.js src/**/*.js

# build-index: rebuild CODEBASE-INDEX.json
node lex-police/build-index.js src/**/*.js --out CODEBASE-INDEX.json

# both tools run automatically on git commit (via .githooks/pre-commit)
# activate with:
git config core.hooksPath .githooks
```

---

## Navigation by grep

Structural conventions make grep reliable. All patterns are positional — the start of
a line unambiguously identifies the semantic role of a construct.

```bash
# all top-level functions
grep -rn "^function " src/

# all classes
grep -rn "^class " src/

# all mixins
grep -rn "^const \w\+ = (Super)" src/

# all top-level constants (non-import)
grep -rn "^const " src/

# all methods named X across all classes
grep -rn "^    X(" src/

# all module.exports assignments
grep -rn "^module\.exports" src/
```

For symbol lookup by name — use CODEBASE-INDEX.json (rebuilt on every commit):

```bash
# find where function "check" is defined
node -e "const i = require('./CODEBASE-INDEX.json'); console.log(i.functions['check'])"

# find all classes and their methods
node -e "const i = require('./CODEBASE-INDEX.json'); console.log(JSON.stringify(i.classes, null, 2))"

# find all classes that have method "process"
node -e "const i = require('./CODEBASE-INDEX.json'); console.log(i.methods['process'])"
```

---

## Structural conventions (enforced by lex-police)

See also: `idealib_ru/coding_guidelines.md` for the full reference.

| Construct | Pattern | Example |
|---|---|---|
| Top-level function | `^function \w+(` | `function check(files, config) {` |
| Class | `^class \w+ ` | `class Service extends Base {` |
| Class method | `^\s{4}\w+(` | `    process(dbt, userId) {` |
| Top-level const | `^const \w+ =` | `const TIMEOUT = 5000;` |
| Mixin | `^const \w+ = (Super) =>` | `const M = (Super) => class extends Super {` |
| Module export | `^module\.exports` | `module.exports = { check };` |

**Forbidden at top level:** `let`, arrow functions, `var`.
**`Super` identifier:** only as mixin parameter. Forbidden everywhere else.
**`/* */` blocks:** must not contain lines matching the patterns above.
To comment out a structural construct — add a leading space to each line.

---

## Naming conventions (enforced by name-police)

Configured via `.name-police.json`. Key invariants:

- `new ControlledClass()` → assignment target must match the configured pattern
- Controlled names flow only into other controlled names (no leaking into `plain`)
- Controlled names appear only in: assignments, call args, method calls, null-checks
- Every method/function name has exactly one signature across the entire codebase
- `Object.assign` and `.prototype` are forbidden — use class syntax

---

## Adding a new structural rule

1. Add entry to `lex-police/patterns.js` with `re`, `label`, `check`
2. If the rule needs AST context beyond pattern matching — add a visitor in
   `lex-police/visitors/` and register it in `lex-police/checker.js`
3. Both `block-comments.js` and `toplevel-shape.js` pick up `patterns.js` automatically

## Adding a new naming rule

Add a visitor file in `src/pass2/visitors/` and register it in the `VISITORS` array
in `src/pass2/index.js`. See `visitor-pipeline-pattern` in idealib for the pattern.
