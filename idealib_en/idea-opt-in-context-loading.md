---
id: opt-in-context-loading
revnum: 1
author: handle
home: https://github.com/user/ideas
tags: [arch, ai-dev, pattern]
strength: core
---

## Statement
Only what is explicitly chosen enters the session context — not everything that exists. Loading by inclusion, not by exclusion.

## Reasoning
Opt-out systems degrade with growth: the more knowledge there is, the more noise in the context, the more expensive filtering becomes. Opt-in systems scale linearly: the size of the library does not affect session quality; only the quality of the selection does.

In the context of LLMs this is doubly critical: tokens are finite, and irrelevant knowledge is not merely useless — it actively interferes by diluting the model's attention.

Boundary: requires that the person selecting knows what they need. If the task is vague, opt-in may miss necessary material. Solution: maintain a small set of "always-loaded" core units as a base layer.

## Examples
**Idea library:** 500 files in the repo, 10 in the session context. A bad or irrelevant unit simply isn't invited — it does not spoil the session.

**Unix philosophy:** tools do one thing and are connected explicitly via pipe. Not one tool that knows everything and is always active.

**Imports in code:** `import` of specific modules instead of `import *` — for the same reason. Explicit is better than implicit.

## Consequences
- The idea library does not degrade with growth — this is a property of the architecture, not of discipline.
- A bad unit in the repo is harmless. A bad unit in the context is harmful.
- Hence the separation of concerns: the repo stores everything, the human or LLM selects what is needed.
- A base layer of 3–5 universal ideas can always be loaded — they produce no noise precisely because they are universal.
