---
id: small-scale-ideas
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, ai-dev, dev, principle]
strength: core
---

## Statement
Don't be afraid of small-scale ideas. The criterion of value is not scale — but whether this idea can help another person in another project.

## Reasoning
There is a temptation to record only "big" ideas — architectural principles, fundamental observations. But "use @babel/parser instead of acorn" or "whitelist is more effective than blacklist for forbidding contexts" — these are small technical insights that will save another developer an hour of searching. The scale of an idea and its practical value do not correlate.

The key phrase is *another project*. If an idea only applies inside the current project — it belongs in SKILLS.md. If it transfers to a different context, a different task, a different person — it belongs in idealib.

Boundary: the idea must be decontextualizable. Connection to → knowledge-unit-store: a unit is ready when it is understandable without backstory.

## Examples
**name-police/idealib:** the ideas about two-pass-ast-analysis and visitor-pipeline-pattern are purely technical patterns for authors of syntax analyzers. Not anticipated in advance, born as a byproduct. Now they can help anyone writing an AST walker in any language.

**Anti-example temptation:** "this idea is too obvious to write down". Obvious *to you* — because you just went through it. For another person in another project it may be a revelation.

## Consequences
- The threshold for recording in idealib is defined by transferability, not scale.
- The most used units in other people's sessions often turn out to be the most "small" ones — specific and actionable.
- A collection of small precise ideas is more useful than a collection of large vague ones — because small ones can be applied immediately.
- Unexpected consequence: by publishing an idealib alongside a project you make a gift to an audience you didn't anticipate — in the case of name-police, that's AST analyzer authors who have never heard of name-police.
