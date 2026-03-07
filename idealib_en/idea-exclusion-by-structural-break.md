---
id: exclusion-by-structural-break
revnum: 1
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [arch, dev, pattern]
strength: core
---

## Statement
Instead of adding an exclusion mechanism (ignore comments, suppress markers), make
exclusion achievable by breaking the pattern itself. The opt-out is derived from
the convention, not added on top of it.

## Reasoning
Most linters add suppression syntax: `// eslint-disable`, `# noqa`, `// semgrep-ignore`.
This is a second mechanism layered on top of the first. It can be misused, it adds
noise, and it is invisible to tools that don't know about it.

If the convention is positional — pattern matches line start — then adding a leading
space breaks the match. No new syntax. No new mechanism. The exclusion is
self-documenting: the space says "this line is intentionally outside the convention".

Boundary: works only when the convention is positional (start-of-line based).
Does not apply to semantic rules (AST-based) where position is irrelevant.

## Examples
**lex-police block-comments rule:** `/* */` blocks must not contain lines matching
structural patterns. To comment out a class: add a leading space to each line.
`^class Foo ` matches — ` class Foo ` does not. The exclusion mechanism is
the absence of the structural form, not a suppress marker.

**CSS:** a property starting with `//` is not valid CSS but browsers ignore it —
a convention-break as a de facto disable mechanism. Fragile, but the same logic.

## Consequences
- Zero new syntax. The linter has no suppress mechanism to abuse or maintain.
- The exclusion is visible: a leading space on a structural line signals intentionality.
- Discovering a suppressed line is trivial — grep for ` class ` or ` function `.
- Forces the developer to think: "am I really breaking the convention, or am I
  restructuring the code?"
- Related: → whitelist-over-blacklist-linting (same philosophy: fewer mechanisms,
  stronger guarantees).
