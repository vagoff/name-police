---
id: two-source-ai-verification
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [ai-dev, dev, pattern]
strength: useful
---

## Statement
For non-trivial technical decisions, query two independent AI sources with the same
question. Divergent answers are informative: they reveal underspecification in the
question, not contradiction in the answers.

## Reasoning
A single AI answer reflects one framing of the question. The AI optimises for the
framing it infers from the prompt. A different AI (or the same AI in a different
session) may infer a different framing — and produce a different, equally valid answer.

When two answers diverge, the divergence itself is the finding. It means: the question
has multiple reasonable interpretations, and the decision depends on which interpretation
is correct for your context. The next step is not "which answer is right" but "which
framing applies to us".

Boundary: works when both sources are genuinely independent (different models, or
same model in separate sessions without shared context). Diminishing returns with
more than two sources — divergence analysis becomes complex.

## Examples
**lex-police tool selection:** Grok queried twice with the same question about enforcer
tools. Run 1 recommended Semgrep (framing: mixed positional+semantic rules, speed of
iteration). Run 2 recommended ESLint custom rules (framing: JS ecosystem maturity,
IDE integration). Both correct. Divergence revealed the question had two valid
decompositions. Resolution: neither framing applied — project context (existing
@babel/parser stack) made both moot. The divergence forced explicit context specification.

## Consequences
- Divergent answers prevent premature closure on one solution.
- The process of resolving divergence forces making implicit context explicit.
- Two queries are cheap; a wrong architectural decision is not.
- The two reports become part of RESEARCH.md — preserved reasoning, not lost chat.
- Related: → pre-decision-research-as-artifact, → external-verification-for-technical-facts.
