---
id: idea-supersession
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, ai-dev, principle]
strength: core
---

## Statement
When an idea is absorbed by a more abstract one — it moves to an archive, not deleted. The working library contains only current ideas, the archive preserves history and prevents links from becoming broken.

## Reasoning
Deleting an idea breaks links from other units, from SKILLS.md, from external sources. An archive solves this without cluttering the working space: current ideas live in idealib_ru/ and idealib_en/, superseded ones in idealib_archive/. The working context stays clean, history is not lost.

Boundary: archive only when supersession is complete — the new idea contains the essence of the old one as a special case. If ideas are merely similar — both remain.

## Examples
**name-police/idealib:** `semgrep-vs-custom-ast` was absorbed by `wrapper-complexity-threshold`. The right move — move to archive, not delete. Links from other units would have stayed alive, the history of the decision would have been preserved.

**Code analogy:** a deprecated API is not deleted immediately — it is marked and lives until the next major version. An idea archive works by the same logic.

## Consequences
- Repo structure: `idealib_ru/`, `idealib_en/` — working; `idealib_archive/` — archive with superseded units.
- An archived file should have a header: `superseded-by: wrapper-complexity-threshold` — so the reader immediately knows where to look.
- Connection to → knowledge-colocation: the archive lives in the same repo — links are never broken by definition.
- Over time the archive becomes a history of the evolution of thinking — you can see how ideas grew and absorbed each other.
