---
id: dialogue-mining
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [ai-dev, arch, principle]
strength: core
---

## Statement
A dialogue is ore. Regularly scan the conversation history looking for ideas that emerged in passing but deserve to be written up as atomic units for use in future contexts.

## Reasoning
Valuable ideas often arise not as the goal of a conversation but as a byproduct of solving a specific task. At the moment they appear they seem obvious and not worth recording. A week later — gone. Connection to → asymmetric-cost-of-omission: the cost of a lost idea is irretrievable, the cost of an extra unit is near zero.

Boundary: not every remark is an idea. The criterion: can this be formulated as a single statement applicable outside the current context? If yes — a candidate for idealib.

## Examples
**This session:** the idea of naming-as-type-system was born as an answer to "can we do this in semgrep?". global-signature-uniqueness — as a solution to problem with rule 3. project-skills-file — from the remark "let's write down what we learned". None were the goal of the conversation.

**Search pattern:** look for moments where someone said "oh that's interesting", "brilliant", "that's important" — those are markers of ideas that resonated.

## Consequences
- Scanning the dialogue at the end of a session takes 5 minutes and can yield 3-5 units. Connection to → project-skills-file: same thing but for conceptual rather than technical insights.
- An LLM handles this task well: ask it to go through the conversation history and identify candidates for idea files — it sees the full context at once.
- Over time you develop an instinct: you start noticing ideas at the moment of their birth and capturing them immediately without waiting for the end of the session.
- Dialogue with an LLM is especially rich ore — because the LLM generates observations and consequences that a person working alone might not notice.
