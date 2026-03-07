---
id: attention-window-as-entry-point
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [arch, ai-dev, cs, pattern]
strength: core
---

## Statement
The entry point into a knowledge system should be a panel of active sets, not a file tree: a tree answers "where is it stored", active sets answer "what is live right now". Seeing irrelevant items is an architectural failure, not an inconvenience.

## Reasoning
A file tree is a storage metaphor. It organises items by location and requires an ontological decision at every new unit: "where does this go?" That decision is made once and becomes structure — even if the working context has changed. Result: opening the system shows everything that exists, not everything needed now.

An active set is a predicate P(x) applied to the corpus. Several active sets simultaneously form an intersection of predicates. They require no fixed taxonomy: a set can be temporary ("current sprint"), role-based ("ideas for Tulip"), situational ("open questions"). An item can belong to multiple sets simultaneously without duplication — in a tree that is impossible without symlinks or copies.

Formally: a tree is a partition of the space with a single location for each item. Sets are arbitrary subsets without a partition requirement. A tree is a degenerate special case of a set system where every predicate is mutually exclusive and complete.

Boundary: active sets require that items have tags or properties from which predicates can be built. For general-purpose file systems (executables, configs, media) a tree remains the right solution — there is no semantics for predicates. For a semantically homogeneous corpus (knowledge, ideas, notes) predicates are applicable and the tree loses.

## Examples
**Email:** inbox is not a folder tree, it is a relevance-sorted slice by the predicate "incoming + unread". Folders exist but are not the entry point. Users who organise mail into folders spend time on taxonomy instead of work — and use search anyway.

**IDE:** the entry point is a fuzzy finder or "recent files", not a file explorer. File explorer is open for navigating to an already-known path — not for discovering what is needed now. Recent files is an implicit set: "active in the last N days".

**Human working memory:** ~7 slots, not a tree. Cognitive science: working memory holds active objects, not a storage hierarchy. Attention window in PKM is literally an interface for working memory.

**LLM session:** before starting work, relevant units from idealib are loaded — not the whole corpus. Loading by inclusion (→ opt-in-context-loading) is manual assembly of an attention window for the model.

## Consequences
- The number of active sets is cognitively bounded: beyond ~7–10 they stop being an attention window and become another tree. This is not a technical limit — it is a property of attention.
- Adding a new unit requires no "where to put it" decision: only tagging is needed. Location in a tree is not assigned — location is determined by which sets are active at the moment of use.
- The system does not degrade with corpus growth: repository size does not affect attention window quality; only the quality of the predicates does. Connection to → opt-in-context-loading.
- A tree in PKM is premature taxonomy: it fixes the ontology at unit-creation time, when least is known about its connections. Active sets defer the ontological decision to the moment of use — when context is known.
- An empty attention window signals no active tracks, not that the system is empty. A tree cannot express this distinction.
