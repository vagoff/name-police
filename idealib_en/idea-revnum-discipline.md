---
id: idea-revnum-discipline
revnum: 1
author: handle
home: https://github.com/user/ideas
tags: [arch, dev, principle]
strength: useful
---

## Statement
On any edit to an idea.md file — increment revnum by 1.

## Reasoning
revnum is the only indicator that a file has changed after creation. Without updating it, there is no way to distinguish an original formulation from a refined one, to track the evolution of an idea, or to understand the freshness of a unit in the library.

Boundary: the rule applies only to meaningful edits. Fixing a typo is at the author's discretion.

## Examples
Added a paragraph to Consequences → revnum: 1 → revnum: 2. Refined the statement → revnum: 2 → revnum: 3.

## Consequences
- The history of an idea's evolution is readable from revnum even without git blame.
- revnum > 1 signals: the idea has been through refinement, it is more mature.
- revnum remains the only field that changes on edit — everything else is content.
