# ARCHITECTURE.md

Design decisions and the reasoning behind them.
For operational guide (how to run, grep, navigate) — see CODEBASE.md.
For pre-implementation research and tool selection — see RESEARCH.md.
For atomic idea units — see idealib/.

---

## What this project is

name-police is a static analysis tool that enforces naming conventions with the force
of a type system — without the weight of one.

The core insight: if you control (1) what names instances of a class can have,
(2) how those names flow between variables, and (3) in what syntactic positions those
names may appear — the system is *closed*. Entry into the named set is only via
`new C()`, exit is impossible. The name becomes a machine-verified type invariant.
No type inference. No annotations. No build step changes.

See: `idea-naming-as-type-system`, `idea-closed-system-invariant`.

---

## Component responsibilities

**`src/checker.js`** — orchestrator and CLI.
Owns: file parsing, pass sequencing, error aggregation, exit code.
Does not know about specific rules.

**`src/config.js`** — configuration contract.
Owns: loading `.name-police.json`, pattern matching against constructor names,
resolving which class a controlled name belongs to.
Everything that depends on user configuration goes through here.

**`src/builtins.js`** — JS built-in whitelist.
Owns: the list of constructors (Map, Set, Error, ...) exempt from strictConstructors.
A separate file because the list is data, not logic.

**`src/pass1/index.js`** — global information collector.
Owns: building the signature table `methodName → [paramNames]` across all files.
Detects signature conflicts. Does not check anything — only collects.
See: `idea-two-pass-ast-analysis`.

**`src/pass2/index.js`** — check orchestrator.
Owns: running all visitors in a single traverse over each file.
Visitors are independent — order does not matter, shared context is read-only.
See: `idea-visitor-pipeline-pattern`.

**`src/pass2/visitors/*`** — individual rules. One file = one responsibility.
Each visitor answers one question about one AST node. Adding a rule = adding a file.

| Visitor | Responsibility |
|---|---|
| `strict-constructors` | unknown `new Foo()` is an error |
| `constructor-naming` | assignment target of `new C()` must match pattern |
| `assignment-flow` | controlled name cannot flow into uncontrolled variable |
| `call-arg-naming` | call site args checked against signature table |
| `literal-args` | literal values forbidden in controlled parameter positions |
| `forbidden-contexts` | controlled names allowed only in whitelist positions |

`forbidden-contexts` uses whitelist logic: `isAllowedUsage()` returns true for ~7
positions, everything else is automatically forbidden. New JS syntax is forbidden
by default without adding any code. See: `idea-whitelist-over-blacklist-linting`.

**`lex-police/`** — structural conventions enforcer.
Owns: positional/structural rules (form of the file), not naming semantics.
Separate from name-police because the responsibilities are different:
name-police checks what names mean, lex-police checks where constructs appear.

**`lex-police/patterns.js`** — single source of truth for structural patterns.
Both `block-comments.js` (text-based) and `toplevel-shape.js` (AST-based) derive
from this file. Adding a structural rule = one entry here.

**`lex-police/build-index.js`** — codebase indexer.
Owns: producing `CODEBASE-INDEX.json` with functions, constants, classes, methods.
Runs after every commit via pre-commit hook. Enables agent symbol lookup by name.

**`eslint-plugin/`** — thin wrapper.
Owns: exposing a subset of name-police rules as an ESLint plugin for IDE integration.
Thin wrapper is the right pattern here — ESLint handles IDE squiggles and CI
integration, the checker handles the actual logic.
See: `idea-wrapper-complexity-threshold`.

---

## Why two passes

Pass 1 collects global information (signature table) that cannot be known
while reading a single file. Pass 2 uses this table at every call site.

Alternative — single pass with deferred checks — would require buffering unresolved
sites and resolving them after all files are read. Two passes keep the
architecture flat: collection and checking are independent, testable separately,
and pass 1 output is a plain Map — no global state.

See: `idea-two-pass-ast-analysis`.

---

## Why not Semgrep or ESLint custom rules

Semgrep: rules 1-2 work. Rules 3-4 (cross-file signature checking) would require
a script to generate YAML from the signature table. The complexity of that generator
is comparable to writing the checker directly. Intermediate layer with no net benefit.

ESLint custom rules: ESLint plugin API is file-scoped. Cross-file pass 1 is not
supported natively — would require a separate pre-processing step anyway.
Result: the same two-pass architecture but with more boilerplate.

Decision: `@babel/parser` + `@babel/traverse` directly. Full control, zero constraints
from intermediate layers, total complexity lower than either alternative.

See: `idea-wrapper-complexity-threshold`, `idealib_attic/idea-semgrep-vs-custom-ast`.

---

## Why primitives are excluded

Primitives (strings, numbers, booleans) have no constructor to control — entry into
a "string named `userId`" cannot be restricted to one source. Any enforcement would
produce false positives. The system would become untrustworthy in its own domain.

Decision: control only instances of named classes. Within that domain: zero false
positives, 100% coverage, sound invariants.

This is not a limitation — it is a deliberate scope cut that makes the rest work.
See: `idea-ignore-primitives-for-decidability`.

---

## Why global signature uniqueness

Normally checking `obj.process(x, y)` requires knowing the type of `obj` — which
requires either TypeScript or data flow analysis. Global uniqueness of method names
eliminates this: `process` has exactly one signature everywhere, lookup is O(1).

Side effect: two classes with a `process` of different semantics is a naming problem,
not a technical one. The linter forces you to resolve it architecturally.

See: `idea-global-signature-uniqueness`.

---

## Dependency graph

```
checker.js
  ├── config.js
  ├── builtins.js  (via config)
  ├── pass1/index.js
  │     └── @babel/traverse
  └── pass2/index.js
        ├── @babel/traverse
        └── visitors/* (each imports config.js)

lex-police/checker.js
  ├── @babel/parser
  ├── @babel/traverse
  ├── patterns.js
  └── visitors/*
        └── patterns.js (block-comments, toplevel-shape)
```

No circular dependencies. `config.js` is the only shared module across pass1, pass2,
and visitors — intentional: it is the configuration contract for the whole system.

---

## Extension points

**New naming rule:** add visitor in `src/pass2/visitors/`, register in `VISITORS`
array in `src/pass2/index.js`. The visitor receives `(path, context)` where context
has `{ config, methodSignatures, filename, errors }`.

**New structural rule (positional):** add entry in `lex-police/patterns.js`.
Both block-comment and toplevel-shape checking picks it up automatically.

**New structural rule (semantic/contextual):** add visitor in `lex-police/visitors/`,
register in `VISITORS` array in `lex-police/checker.js`.

**New indexed symbol type:** extend `lex-police/build-index.js` with a new top-level
key in the index object and a new collector branch in `collectFile()`.
