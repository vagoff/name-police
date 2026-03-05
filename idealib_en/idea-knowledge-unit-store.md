---
id: knowledge-unit-store
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, ai-dev, cs, pattern]
strength: core
---

## Statement
Knowledge should be stored in decontextualized atomic units — separated from the history of their creation — to be addressable and reusable in arbitrary new contexts.

## Reasoning
Knowledge is born in context (session, conversation, task) but has value independently of it. Storing knowledge together with context makes it unreadable without that history and non-reusable. This is the same problem as a function with global state: it works, but only inside its own system.

Atomicity matters because composition of units is manageable, decomposition of a monolith is not. Better 50 small ideas than one large article with 50 ideas inside.

Boundary: an idea must be self-contained. If understanding the statement requires its birth context — the unit is not ready, it needs rework.

## Examples
**AI-dev:** in each new session an LLM remembers nothing from past conversations. If ideas are stored as tagged units, they can be loaded into context in batches for a specific task — without the ballast of irrelevant history.

**Software development:** a good function doesn't depend on global state. A good commit solves one problem. A good ticket describes one task. Atomicity is a cross-cutting principle of engineering.

## Consequences
- An idea library becomes a loadable context, not an archive to read.
- Unit quality is easy to check: is it understandable without backstory?
- Tags as unary predicates P(idea) are sufficient for batch selection — a graph of relations isn't needed until the library becomes large.
- Over time a signature emerges: the set of tags most often pulled into sessions — this is the user's domain profile.
