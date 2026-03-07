---
id: paradigm-neutral-component
revnum: 1
author: handle
home: https://github.com/user/ideas
tags: [arch, dev, cs, pattern]
strength: core
---

## Statement
A perfectly encapsulated component depends neither on its usage pattern nor on the design paradigm of the system it is embedded in. Paradigm neutrality is achieved not through a universal interface but by substituting platform primitives from below.

## Reasoning
Classical encapsulation hides the internal from the external. But that is not enough: a component can be closed from the outside while being tightly coupled to a paradigm through its lower dependencies — OOP objects, functional monads, reactive streams.

Solution: the component is built on top of abstract semantic platform primitives. The platform substitutes a concrete implementation of those primitives under the component — the component does not see this. The system paradigm changes at the platform level, not at the component level.

This is not dependency injection in the classical sense — there, concrete dependencies are injected. Here the topic is semantically universal primitives that by definition belong to no paradigm.

Boundary: requires a platform with semantically neutral primitives. Without such a platform, paradigm neutrality is unachievable — the component interface will always carry the imprint of a paradigm.

## Examples
**Lisp:** an attempt via syntactic neutrality (homoiconicity, macros). Did not reach the semantic level — primitives are technical, not domain-oriented.

**Hexagonal architecture:** ports and adapters — a partial solution at the interface level. Does not solve the paradigm problem of the primitives inside the component.

**Platform with semantic primitives:** a "warehouse operation" component assembled from "transaction", "balance", "movement" primitives. These primitives are semantically universal — equally expressible in OOP, functional, and event-driven styles.

## Consequences
- A component written today fits into a system whose paradigm has not yet been determined.
- The platform is the only place where the paradigm matters. Everything else is freed from it.
- The platform changes rarely and slowly — one small primitive addition covers thousands of components. The cost of a platform mistake is maximal, which is why primitives crystallise from real practice rather than being designed upfront.
