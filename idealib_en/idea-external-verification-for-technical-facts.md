---
id: external-verification-for-technical-facts
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [ai-dev, dev, principle]
strength: useful
---

## Statement
For verifying a specific technical fact about an external system (API, library behaviour, runtime) — a query to an independent source is more valuable than consensus within the current dialogue.

## Reasoning
Within a dialogue, participants can converge on the wrong answer — because nobody verified it, and confidence is created by repetition. LLMs are especially susceptible: they can hallucinate APIs with high confidence, particularly for lesser-known systems. An independent source (another model, documentation, an experiment) breaks this loop.

Boundary: applies to facts that can be verified empirically or through an authoritative source. Not applicable to questions with no objective answer.

## Examples
**DSL compiler:** the question about `FindPrev` in micro's Lua API. Within the dialogue there was uncertainty — a speculative implementation was written. Bringing in Grok produced a concrete example with real code and two alternatives (plain search and PCRE via luare). This changed the implementation: line-by-line iteration without external dependencies was chosen.

**General pattern:** "Grok says this" / "the documentation says X" — a signal to update the position, not to defend the current one.

## Consequences
- Different models have different knowledge gaps — combining them reduces hallucination probability.
- Expertise in a dialogue should not be monopolised by a single source.
- For LLM-assisted development: maintain access to multiple models and use them as independent reviewers of technical details.
