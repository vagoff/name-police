---
id: pre-decision-research-as-artifact
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, ai-dev, principle]
strength: core
---

## Statement
The pre-implementation phase — market survey, scope definition, alternatives evaluation, boundary reasoning — is a project artifact and must be captured in a document, not lost in chat history or memory.

## Reasoning
Decisions are visible in code and in rejection logs. The *reasoning before the decision* — what was surveyed, what questions were asked, where the scope boundary was drawn and why — disappears unless explicitly captured. Six months later the same questions resurface: "did we consider X?", "why doesn't this tool cover Y?", "who decided the scope and on what basis?".

The pre-decision research document answers these questions before they are asked. It is distinct from a rejection log (which records what was rejected after a decision was made) and from architecture docs (which record what was accepted). It records the *state of knowledge at decision time*.

Boundary: worth maintaining when the pre-implementation phase involved non-trivial research — tool evaluation, external sources, scope tradeoffs. Trivial decisions with obvious scope need no research doc.

## Examples
**lex-police:** before implementation, two independent AI sources (Grok × 2) were consulted on the question "ESLint custom rules vs Semgrep vs shell script vs something else". The research established: (1) rules split into positional (text-based) and semantic (AST-based) classes with different tool requirements; (2) Semgrep is overkill given existing @babel/parser in the project; (3) shell script is unreliable for semantic rules. This reasoning is not in the code, not in the rejection log — it belongs in a research section.

**ADR format:** the "Context" section of an Architecture Decision Record is a pre-decision research artifact in institutionalised form. Most projects skip it.

## Consequences
- New developers understand not only what was decided but what was known when the decision was made.
- Prevents re-opening research that was already done — "we surveyed this, here are the sources and conclusions".
- For AI-assisted development: research done in dialogue with an LLM is especially at risk of being lost — the conversation ends, the context disappears. Capturing it as a doc is the only preservation mechanism.
- Natural home: a `doc/research/` directory, or a dedicated section in ARCHITECTURE.md for the component in question.
- Related: → rejection-log-as-design-doc (what was rejected), → pause-before-implementation (when to do research).
