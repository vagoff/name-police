---
id: positional-convention-as-navigation-contract
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, ai-dev, pattern]
strength: core
---

## Statement
A convention that makes the start of a line semantically unambiguous creates a
grep-contract: a machine-readable interface to the codebase that any tool —
human, agent, shell script — can use without parsing.

## Reasoning
Most codebases are navigable only with a language server or IDE: symbol lookup
requires type inference, class hierarchy traversal, or build-time analysis.
A positional convention eliminates this dependency. If `^function \w+(` is
guaranteed to mean "top-level named function" — then grep is a complete and
accurate symbol index, available in any environment, with zero infrastructure.

This is not style. Style is about aesthetics. A navigation contract is about
the information content of line prefixes. The convention is designed so that
the first N characters of a line uniquely identify the semantic role of the
construct.

Boundary: requires enforcement (see → enforcer-as-trust-signal). Without
enforcement, the contract is aspirational and grep produces false positives.
Requires that auto-formatters are disabled — formatters break positional guarantees.

## Examples
**name-police / lex-police conventions:**
```
^function \w+(     → top-level named function (never an arrow)
^class \w+         → class declaration
^    \w+(          → class method at indent 4
^const \w+ =       → top-level constant (never a require import)
^const \w+ = \(Super\) =>  → mixin definition
^module\.exports   → export
```
Each prefix is a unique key in the semantic map of the file.
`grep -rn "^function " src/` returns a complete, accurate list of all top-level
functions. No IDE needed. Works in any terminal, any CI, any agent tool call.

**ctags:** same idea, implemented as a separate index-building tool.
The positional convention achieves the same result without a build step —
the source file is its own index.

**Go:** exported identifiers start with uppercase — a one-character positional
convention. Any tool can determine visibility without a compiler.

## Consequences
- Agents navigating via tool calls use grep as a reliable index.
- The convention is self-documenting: reading a file tells you the rules.
- Onboarding reduces to: "read CODEBASE.md, run `git config core.hooksPath`".
- Auto-formatters are incompatible with this pattern — an explicit design decision,
  not a limitation.
- Related: → enforcer-as-trust-signal (what makes the contract hold),
  → static-index-for-agents (complementary: INDEX.md for content, grep for code).
