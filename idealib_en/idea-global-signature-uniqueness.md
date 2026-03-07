---
id: global-signature-uniqueness
revnum: 1
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [arch, dev, cs, pattern]
strength: core
---

## Statement
If every method/function name has exactly one signature globally across the entire codebase, call-site checking requires no knowledge of the object type — the method name alone is sufficient.

## Reasoning
Normally checking `obj.process(x)` requires knowing the type of `obj` to find the definition of `process`. This requires type inference or data flow. If `process` is globally unique — a lookup in the signature table by name is enough. Complexity O(1) instead of solving a system of equations.

Boundary: requires naming discipline at the whole-project level. Two classes with a `process` of different semantics is an architectural problem, not a technical one.

## Examples
**name-police:** pass1 builds a global table `methodName → [paramNames]`. Signature conflict = linter error. This forces renaming of methods with different semantics.

**SQL:** table names are globally unique — so `SELECT * FROM users` needs no context about which `users` is meant.

## Consequences
- Side effect: a codebase where `process` always means the same thing is more readable.
- Signature conflict is a signal of an architectural problem, not just a linter error.
- The signature table is built once in pass1, used everywhere in pass2 — classic separation of collection and use.
