---
id: ignore-primitives-for-decidability
revnum: 2
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [cs, arch, principle]
strength: core
---

## Statement
If part of a problem is statically undecidable — don't solve it, solve only the decidable part, but completely.

## Reasoning
Primitives in JS are undecidable for naming enforcement — string is a string, there's no constructor to control. Trying to cover them leads to false positives and exceptions. Dropping this part preserves a zero false positive rate for the rest and makes the system trustworthy.

Boundary: requires that the "decidable part" is valuable enough on its own. If value comes only from full coverage — the tradeoff doesn't work.

## Examples
**name-police:** controls only instances of named classes. Primitives are ignored entirely. Result: within its domain the system is error-free.

**Formal verification:** only critical modules (crypto, scheduler) are verified, not the whole codebase. Partial verification is better than none.

## Consequences
- A tool that never lies in its domain is trusted more than a tool with 95% accuracy.
- "We don't cover primitives" is not a weakness — it's an honest statement of scope.
- Strategic rejection of the undecidable is a sign of design maturity, not incompleteness.
- Causal connection to → naming-as-type-system: that idea is *possible* precisely because this one holds. Naming-as-type-system works only for instances of named classes. The moment you try to extend it to primitives — the invariant breaks and false positives appear. The decidable domain is not accidental; it is the direct consequence of the cut made here.
