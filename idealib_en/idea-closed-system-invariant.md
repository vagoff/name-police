---
id: closed-system-invariant
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [cs, arch, principle]
strength: core
---

## Statement
If a set of values is closed — entry only through one controlled path, exit impossible — syntactic checking becomes equivalent to semantic checking.

## Reasoning
Data flow analysis normally computes invariants. A closed system lets you postulate them. You don't need to track flow if flow is structurally constrained. Rules 1-4 in name-police create exactly this closure: a pattern name cannot appear from anywhere but the constructor, and cannot leak anywhere but allowed positions.

Boundary: requires all rules to be enforced simultaneously and mechanically. One broken rule — closure is lost.

## Examples
**name-police:** four rules together create a system where name = type. Each rule individually is weak, all together — strong.

**Cryptography:** a private key is "closed" — there is exactly one way to create it and strict rules for its use. This is what makes guarantees possible.

## Consequences
- Checking complexity does not grow with codebase size — each check is local.
- Adding a new rule to a closed system strengthens guarantees without rewriting anything else.
- Any violation of a system rule must be a lint/compile error — otherwise closure is theoretical, not real.
