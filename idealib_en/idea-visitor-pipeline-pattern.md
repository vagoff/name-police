---
id: visitor-pipeline-pattern
revnum: 1
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [dev, arch, pattern]
strength: useful
---

## Statement
Each analyzer rule is an independent visitor `(path, context) => void`. The orchestrator runs all of them through one traverse. Adding a rule = adding a file.

## Reasoning
The alternative — one big visitor with branching by node type — quickly becomes unreadable. A pipeline keeps rules independent, simplifies testing each in isolation, and makes adding/removing rules safe.

Boundary: if rules have strong state dependencies on each other — the pipeline gets complicated. In name-police rules are independent, shared context is read-only.

## Examples
**name-police pass2:** `VISITORS = [strictConstructors, constructorNaming, assignmentFlow, callArgNaming, literalArgs, forbiddenContexts]`. One `traverse`, one `enter`, all visitors receive every node.

**Express middleware:** same thing — each middleware is independent, shared `req/res` is a read-only contract.

## Consequences
- Order of visitors only matters if one produces data for another — in name-police it doesn't.
- New visitor: one file + one line in the array. Zero risk of breaking existing ones.
- Errors in one visitor don't break others if there's a catch at the orchestrator level.
