---
id: idea-supersession
revnum: 2
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, ai-dev, principle]
strength: core
---

## Statement
When an idea is COMPLETELY absorbed by a more abstract one — it moves to the attic (attic/), not deleted. Partial overlap is not grounds for moving. The working library contains only current ideas, the attic preserves history and prevents links from becoming broken.

## Reasoning
Deleting an idea breaks links from other units, from SKILLS.md, from external sources. The attic solves this without cluttering the working space: current ideas live in idealib_ru/ and idealib_en/, fully superseded ones in idealib_attic/.

Full supersession: the new idea contains the essence of the old one as a special case, and referring to the old one adds no additional information. Partial overlap or intersection — both ideas remain in the working library.

Boundary: when in doubt — keep in the working library. To the attic only when supersession is obvious and complete.

## Examples
**name-police/idealib:** `semgrep-vs-custom-ast` was fully superseded by `wrapper-complexity-threshold` — the new one contains the same essence without binding to specific tools. Right move — transfer to attic, not delete.

**Anti-example:** two ideas about naming partially overlap — both remain. Overlap is not supersession.

## Consequences
- Structure: `idealib_ru/`, `idealib_en/` — working; `idealib_attic/` — attic.
- In the attic file add `superseded-by: slug` — so the reader immediately knows where to look.
- Connection to → knowledge-colocation: attic is in the same repo — links are never broken by definition.
- The attic over time becomes a history of the evolution of thinking — you can see how ideas grew and absorbed each other.
