---
id: mess-definition
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, cs, principle]
strength: core
---

## Statement
Mess in code is a disjunction of three orthogonal violations: undefined responsibility of a component, violation of a component's responsibility zone, duplication of responsibility between components.

## Reasoning
The three bases are independent: each exists without the other two. Duplication is not resolved by defining zones — you can have two perfectly scoped components with the same responsibility. Undefinition does not produce violation — a component without a responsibility doesn't violate another's zone simply because it has none of its own.

Formally: an ideal system is an injection in the mapping "component → responsibility". Every responsibility is covered by exactly one component. Mess is when the mapping ceases to be a function (undefinition), an injection (duplication), or violates the value domains (zone intersection).

The definition is complete: a counterexample — mess outside these three cases — does not exist. Dead code does not create mess. A live but semantically redundant component falls into the first or second case through analysis of its callers.

Boundary: the definition is structural, not dynamic. The causes of mess (process, team, deadline pressure) are intentionally out of scope.

## Examples
**Undefinition:** `userHelper.js` — nobody knows what it does or why it exists. Responsibility is not assigned.

**Zone violation:** the service layer directly constructs SQL queries. The repository's responsibility is violated from outside.

**Duplication:** `userManager`, `userService`, `userUtils` — three components partially implement the same thing in different ways.

## Consequences
- The definition is operational: any component can be checked against three criteria and get an unambiguous answer.
- The definition implies the cure: assign responsibility, restore boundaries, eliminate duplicates — and these are three independent actions.
- Codebase comprehension complexity grows as O(n²) with mess and as O(n) without it — because mess pushes the dependency graph toward complete.
- The definition applies beyond code: knowledge bases, microservices, team roles — mess has the same structure everywhere.
