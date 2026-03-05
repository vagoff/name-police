---
id: project-skills-file
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, ai-dev, dev, pattern]
strength: core
---

## Statement
Every project should have a file "what we learned while building this" — a set of decontextualized technical and conceptual insights extracted from the real experience of building that specific project.

## Reasoning
Knowledge is born in the process — while solving a problem you find patterns and anti-patterns that aren't written down anywhere. If you don't capture them immediately, they evaporate: the next developer (or you six months later, or an LLM in a new session) steps on the same rake.

Different from a README: a README explains *what* the project does. A skills file explains *what we learned while building it* — orthogonal knowledge. Different from code comments: insights are often super-project — applicable in other projects, other technologies.

Connection to → knowledge-unit-store: a skills file is raw material for an idealib. The best insights from it deserve to be extracted into standalone atomic units with tags.

## Examples
**name-police/SKILLS.md:** contains 12 patterns — from "use @babel/parser instead of acorn" to "whitelist is more effective than blacklist for forbidding contexts". Each pattern is self-contained and applicable outside the project.

**Entry structure in a skills file:**
```
## N. Pattern name
One sentence — the essence.
Code or example if needed.
Why it matters / where else it applies.
```

## Consequences
- An LLM in a new session, given the project's skills file, instantly reconstructs the context of decisions — no need to explain "why we use X instead of Y". Connection to → claude-github-workflow: this file is especially valuable precisely because LLMs lose memory between sessions.
- A new developer in 10 minutes understands non-trivial decisions that would otherwise take a month of trial and error.
- A skills file is written *during* the work, not after — an insight is captured while it's fresh. Connection to → asymmetric-cost-of-omission: the cost of an unrecorded insight is irretrievable.
- Over time, patterns that recur across skills files of different projects are candidates for idealib as core units.

## Key property: the file is alive
A skills file is not written once at project completion — it is updated throughout the life of the project. Found a new pattern a month later — add it. An old insight turned out to be wrong — fix it. This is not release documentation, it is a living diary of the team's technical discoveries.

This distinguishes it from post-mortems and retrospectives which are written after the fact and quickly go stale. A skills file is always current because it is updated at the moment of discovery.
