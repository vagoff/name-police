---
id: context-degradation-as-signal
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [ai-dev, arch, principle]
strength: core
---

## Statement
Context quality degradation in a long LLM session is not a defect to fight — it is a structural signal that the session's call stack is full and it's time to do a GC pass: mine ideas, then start a new session.

## Reasoning
The attention mechanism processes the entire context window on every generation. As a session grows, irrelevant earlier turns compete with the current signal — the model cannot selectively ignore old context. This produces quality degradation and token inflation (more hedging, more meta-commentary).

Auto-compact doesn't help because it is lossy compression of an already-degraded signal. The session continues in an "averaged" mode — pressure on the cognitive process is not relieved.

The correct response to degradation is not to fight it but to read it as a scheduler interrupt: the stack is about to be released, promote live objects to long-term storage now.

Connection to → dialogue-mining: a session is a call stack; ideas are allocated during execution; mining is the GC pass that promotes live objects before the stack is freed.

Boundary: the signal is meaningful when the session has done real intellectual work. A degrading session with only transactional tasks (generate file, fix bug) carries no mining value.

## Examples
**aidev workflow:** noticeable hedging increase, longer responses with less substance, model starts qualifying things it stated confidently earlier — all of these are degradation markers and mining triggers.

**Human analogy:** a tired, sleep-deprived person shows the same symptoms — not because something is broken, but because the working memory buffer is full. The right response is sleep (session reset), not coffee (compact).

## Consequences
- Degradation becomes actionable instead of frustrating: it triggers a workflow step, not a complaint.
- The optimal session length is not "as long as possible" but "until first degradation signal" — after that, marginal return per token drops sharply.
- Compact is not useless — it buys time — but it doesn't change the fundamental structure. Real fix is session discipline + idealib.
