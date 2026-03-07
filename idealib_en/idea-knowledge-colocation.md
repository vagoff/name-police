---
id: knowledge-colocation
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, ai-dev, dev, principle]
strength: core
---

## Statement
Knowledge about a project should live in the same repository as the code — not in a wiki, not in Notion, not in a separate repo. This is not a matter of convenience, it is a matter of structural integrity.

## Reasoning
Knowledge separated from code loses three fundamental properties: version synchrony, availability guarantee, and birth context. When an idealib lives next to the code — these properties are restored automatically, without processes or discipline.

Boundary: knowledge specific to the project. Universal ideas may live in a separate repo — but their copies or links to specific versions are appropriate in the project repo too.

## Examples
**name-police:** idealib/, SKILLS.md, IDEA.md live alongside src/. `git clone` gives everything at once. The idea that was read when writing `forbidden-contexts.js` is the same version as the file itself.

**Anti-example:** a team maintains architectural decisions in Confluence. A year later links are broken, versions don't match the code, a new developer doesn't know the documentation exists.

## Consequences
- **Version synchrony.** `git log` shows how the code changed *and* how understanding changed simultaneously. This is irreproducible with separate storage.
- **Broken links are structurally impossible.** A link `→ knowledge-unit-store` inside the repo is always a live file. An external link dies in two years.
- **Fork carries everything.** Whoever forked the project gets not just the code but the history of thinking, idealib, SKILLS.md. Knowledge is not lost when the project is handed over.
- **No search problem.** Everything in one `git clone`. No need to remember where the documentation lives, who has access, which version is current.
- **Birth context is preserved.** An idea is captured at the moment it was influencing decisions — that is the most valuable moment for a future reader.
- Connection to → cognitive-scope-colocation: both principles are the same locality-of-reference applied at different levels. That one — files within a project. This one — knowledge within a repository. The common root: things used together should live together.
