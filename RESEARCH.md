# RESEARCH.md

Pre-decision research: market surveys, scope reasoning, alternatives evaluated
before implementation began. Captured so the reasoning is not lost when the
session ends.

See: `idea-pre-decision-research-as-artifact` in idealib.

---

## lex-police: tool selection (March 2026)

### The question

We needed a tool to enforce structural/positional conventions in a JS (CJS) codebase
as a pre-commit git hook. The rules fall into two classes:

**Positional** — rely on line start position being meaningful:
- Top-level functions always `^function \w+\(`
- Classes always `^class \w+ `
- Class methods always `^\s{4}\w+\(`
- Top-level constants always `^const \w+ =`
- Mixins always `^const \w+ = \(Super\) =>`

**Semantic** — require understanding context, not just position:
- `Super` identifier only inside mixin definitions
- Top-level `let` forbidden

### Sources consulted

Two independent queries to Grok (same question, separate sessions).

---

### Grok run 1 — recommended: Semgrep

Reasoning: Semgrep unifies positional (regex/pattern-based) and semantic
(AST-aware) rules in one tool. YAML rule syntax is faster to iterate than
ESLint custom rules. Scans only changed files in pre-commit hooks.

Example Semgrep rules proposed:
```yaml
rules:
- id: no-top-level-let
  pattern: let $VAR = ...
  message: Top-level let is forbidden
  severity: ERROR
  languages: [javascript]
- id: super-only-in-mixins
  patterns:
    - pattern: Super
    - pattern-not-inside: const $MIXIN = (Super) => ...
  message: Super forbidden outside mixins
  severity: ERROR
```

---

### Grok run 2 — recommended: ESLint custom rules

Reasoning: ESLint is the baseline for serious JS teams (Netflix, LinkedIn, Google).
Ubiquitous ecosystem, IDE integration (VS Code squiggles), Husky/lint-staged support.
Multithreaded since 2025 updates. Custom rules via AST visitors handle both
positional (column checks) and semantic (Super context) cases.

---

### Comparative table (synthesised from both reports)

| Aspect | ESLint custom | Semgrep | Shell/grep | Biome |
|---|---|---|---|---|
| Positional rules | Good (column checks) | Excellent (regex patterns) | Good (direct regex) | Good |
| Semantic rules | Excellent (AST) | Strong (metavariables) | Weak (multi-line hacks) | Moderate |
| Rule authoring | Moderate (JS + AST knowledge) | High (YAML, code-like) | High for simple / spaghetti for complex | Moderate |
| Performance in hooks | Good (multithreaded) | Excellent (parallel, CI-designed) | Excellent (native shell) | Excellent (Rust-based) |
| False positives | Low (precise AST) | Moderate (pattern-based) | High (ignores context) | Low |
| Dependencies | Free, npm | Free OSS core | Zero | Free, npm |
| IDE integration | Strong (VS Code) | Weak by default | None | Strong |

---

### Our analysis

Both answers were correct for their framing. Neither accounted for project context:

1. `@babel/parser` + `@babel/traverse` already present in name-police
2. visitor-pipeline pattern already established and working
3. cross-file two-pass analysis already implemented

**The key insight from comparing the two reports:**
rules split into positional and semantic with different tool requirements.
This suggested either two tools (one per class) or one tool that handles both.

**Why Semgrep was rejected:**
Rules 1-2 (positional) work in Semgrep. Rules 3-4 (semantic, cross-file) would
require generating YAML from the signature table — a script whose complexity
matches the checker itself. Wrapper complexity threshold crossed.

**Why ESLint custom rules were rejected:**
ESLint plugin API is file-scoped. Cross-file checking requires a separate
pre-processing step regardless — same two-pass architecture, plus plugin boilerplate.

**Why shell script was rejected:**
Reliable for positional rules, but semantic rules (`Super` context) require
multi-line parsing or awk hacks that fail on nested scopes. Blind to `/* */` comment
context — structural patterns inside comments produce false positives.

**Decision:** `@babel/parser` + `@babel/traverse` directly.
- Zero new dependencies
- Full AST access for semantic rules
- Same stack and patterns as name-police — no context switch
- Total complexity lower than any of the alternatives

---

## Scope boundary: what lex-police deliberately does not cover

**Mixin application tracking** (which class gets which mixin methods at runtime) —
statically undecidable in the general case. Covered at Level 1 only (static class
declarations). See `idea-ignore-primitives-for-decidability` for the general principle.

**Formatting rules** (semicolons, quote style, trailing commas) — out of scope.
These belong to a formatter. lex-police enforces structural position, not style.

**Import/export shape** — out of scope for now. CJS `require()` / `module.exports`
are covered as top-level constructs; ESM `import`/`export` are not used in this
codebase.
