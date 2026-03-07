---
id: existing-structure-as-data
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [arch, cs, principle]
strength: core
---

## Statement
Before introducing a new data type, check whether the needed structure is already an existing system primitive in another form. Introducing a new type costs more than it appears.

## Reasoning
A new type brings with it: literal syntax, operations (indexing, length, iteration), serialisation into state, passing between functions. That is a whole layer of language or API. If an existing primitive covers the task, there is no reason to pay that cost.

Boundary: does not apply when the existing primitive is semantically wrong (storing a list in a string with a separator — technically works, semantically terrible). Applies only when the existing structure is a natural representation of the data, not a technical hack.

## Examples
**DSL compiler:** navigation over grep results required a list of lines with a current position. Instead of introducing a `list` type, the editor's text buffer was used. A buffer with grep results already is a list of lines. `buf.find_next_re_from(gbuf, pos, pattern)` iterates buffer lines. The search pattern is a configurable regex. No array syntax needed.

**Unix:** text stream as the universal data structure between tools. `grep | head | sort` — each tool works with the same primitive.

## Consequences
- The language stays smaller: less syntax, less cognitive load.
- All tools that work with the existing primitive are automatically applicable to the new task.
- In this case: quickfix functionality received all text buffer operations for free — search, navigation, display.
