---
id: single-assignment-operator
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [cs, arch, principle]
strength: core
---

## Statement
A language or API should have exactly one symbol denoting assignment — and it should be used in every context where assignment occurs. Context-dependent synonyms create cognitive load without adding information.

## Reasoning
If in one place a language uses `=`, in another `:`, in a third `=>` for the semantically identical action "name receives value" — the user must remember the rules for each context. This is arbitrary complexity — complexity without a semantic reason.

Test: if the explanation of a symbol's usage rule contains the phrase "in this context" — it is a sign that there are more symbols than necessary.

Boundary: different symbols are justified when they carry different semantics (`:` as a key-value separator in a dict literal — not assignment but structure). The issue is when the semantics are identical but the symbols differ.

## Examples
**DSL compiler:** kwargs in function definitions (`fn f(x, cwd = ".")`) and in calls (`f(x, cwd = root)`) and in config blocks (`let X = 42`) — `=` everywhere. The alternative with `:` for kwargs (Python-style `f(cwd=root)` vs Kotlin `f(cwd: root)`) was rejected: `=` everywhere assignment occurs.

**CSS vs JS:** `color: red` (CSS) and `color = 'red'` (JS) — different symbols for the same action. Users switching between them make constant mistakes.

## Consequences
- The language is learned faster: one rule instead of a table of exceptions.
- Errors of the "mixed up `:` and `=`" type disappear by construction.
- The parser is simpler: no context-dependent interpretation of the same symbol.
