---
id: complexity-creep
revnum: 1
author: handle
home: https://github.com/user/ideas
tags: [arch, dev, cs, principle]
strength: core
---

## Statement
Complexity accumulates invisibly — each addition seems local and justified — until the system is managing you rather than the other way around.

## Reasoning
Every complexity addition is made in the context of a current task and looks reasonable. But complexity is cumulative and non-linear: N connections between components grow as N² not N. The cost is invisible at the moment of addition; you pay later, and all at once.

Boundary: not all complexity is bad — essential complexity of the problem cannot be eliminated. The issue is accidental complexity arising from premature decisions, not from the nature of the task.

## Examples
**Architecture:** add an abstraction "for the future", then another, then they start interacting — and refactoring becomes more expensive than rewriting.

**Data formats:** every new field seems useful. A year later the format cannot be parsed without documentation, and documentation has drifted from reality.

**Idea library:** introduce a graph of links between units — elegant. But a graph requires consistency, consistency requires tooling, tooling requires maintenance. Tags scale linearly, a graph scales exponentially.

## Consequences
- Fighting complexity must be local and continuous, not global and one-off.
- The best moment not to add complexity is before it has been added.
- Simplicity requires effort; complexity arrives on its own.
- A healthy system sign: a new participant understands it in an hour, not a week.
