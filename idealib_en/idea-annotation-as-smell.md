---
id: annotation-as-smell
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [dev, arch, principle]
strength: useful
---

## Statement
If a type annotation is needed for the machine to understand a variable — it is also needed for the human reader. That is not an argument for annotations; it is a signal to simplify the code.

## Reasoning
An annotation that makes the type obvious is redundant. An annotation that makes the type non-obvious reveals that without it the reader is also lost. The annotation treats the symptom. The cause is that the name, structure, or scope of the variable does not communicate its nature. Fixing the cause eliminates the need for the annotation.

Boundary: does not apply to public API boundaries and library interfaces — there annotations serve as a contract for external consumers and are justified regardless of internal clarity. Applies to internal implementation code.

## Examples
**Symptom:** `/** @type {UserRecord} */ const x = getResult();` — `x` is opaque, annotation patches it. Fix: rename to `userRecord` or restructure so the type is evident from context.

**Symptom:** `/** @param {Connection} conn */` on a function that accepts anything named `conn` — the annotation exists because the name doesn't carry the constraint. name-police solves this at the enforcement level; the annotation becomes unnecessary.

**Healthy annotation:** on a public module export, an interface definition, a factory return type — here the annotation is a contract, not a patch.

## Consequences
- The question "do I need an annotation here?" becomes diagnostic: yes → why is the type not evident without it → fix that.
- Connection to → good-names-as-free-types: a good name already carries type information. If an annotation is still needed after a good name is chosen — the structure of the code is the problem, not the name.
- Connection to → naming-as-type-system: name-police is one concrete way to make annotations unnecessary for controlled classes — enforcement replaces documentation.
- Annotations accumulate silently and are rarely removed. Treating them as smells keeps the codebase honest about where real complexity lives.
