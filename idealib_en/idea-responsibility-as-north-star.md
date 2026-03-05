---
id: responsibility-as-north-star
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, cs, principle]
strength: core
---

## Statement
The north star of system design is unambiguous responsibility: every component has exactly one clearly defined responsibility, and only that component carries it. All architectural decisions are derived from this principle, not memorized as patterns.

## Reasoning
Design does not start with choosing a pattern, a paradigm, or a tech stack. It starts with the question: **who is responsible for what?** — and the answer must be unambiguous for every component in the system.

All architectural patterns are consequences of this principle, not independent truths. Repository separates storage responsibility from business logic. Adapter isolates translation responsibility. Factory owns creation responsibility. Hexagonal architecture builds the system around explicit responsibility zones.

The principle is paradigm-neutral: works in OOP, functional, event-driven, and any other style. This is not SRP from SOLID — SRP is a special case for classes. This principle is universal across levels: function, module, service, system.

Violating the principle in any of three forms produces mess (see mess-definition): undefined responsibility, violation of another component's zone, duplication.

## Examples
**Code review question:** "what is this module responsible for?" — if the answer takes more than one sentence or contains the word "and", the principle is violated.

**Design question:** before writing any component — formulate its responsibility in one sentence without "and". If you can't — decompose.

**Refactoring:** not "how to rewrite it nicely", but "where are responsibilities blurred or duplicated" — and fix exactly that.

## Consequences
- Patterns stop being dogma — they become tools with a clear purpose.
- Architectural decisions become derivable, not selectable from a list.
- The principle applies at any level of abstraction and in any paradigm — that is the hallmark of a fundamental principle rather than a specific rule.
- Mess gets a precise definition as a deviation from this principle — and becomes diagnosable rather than intuitive.
- Onboarding a new developer reduces to one question: does he understand what each component is responsible for?
