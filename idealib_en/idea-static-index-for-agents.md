---
id: static-index-for-agents
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [ai-dev, dev, pattern]
strength: useful
---

## Statement
If a repository contains structured content that an agent or LLM needs to navigate — put a static INDEX.md in the root with a list of all files. One fetch instead of ls that may not be available.

## Reasoning
Agents and LLMs access repositories via HTTP (raw.githubusercontent.com) or API — they have no guaranteed access to `ls`, `find`, or directory listing. A static index solves this without infrastructure: one file at a predictable URL contains a complete content map with metadata.

Staleness is solved by a git hook — the index is regenerated automatically on every push. Connection to → committed-git-hooks.

Boundary: justified when content is structured and there are more than 10-15 items. For a small repo a README is enough.

## Examples
**name-police/INDEX.md:** list of all idea files from idealib_en/, idealib_ru/, idealib_attic/ with id, strength and tags. Agent in a new session: one fetch INDEX.md → full picture → targeted fetch of needed units. No ls, no surprises.

**Entry format:**
```markdown
- [idea-slug](path/to/file.md) `strength` [tags]
```

## Consequences
- Index URL is predictable: `https://raw.githubusercontent.com/user/repo/main/INDEX.md` — can be hardcoded into prompts.
- The index is useful not only for agents — a human also orients faster from one file than from a folder tree.
- Connection to → knowledge-colocation: index lives in the repo, doesn't rot, needs no external service.
- The index generator (`scripts/gen-index.sh`) is a separate file — can be copied to other repos with the same structure.
