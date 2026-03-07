---
id: four-file-project-root-convention
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, ai-dev, pattern]
strength: core
---

## Statement
A project root with four documents — README.md, ARCHITECTURE.md, CODEBASE.md,
RESEARCH.md — covers every question a developer or agent asks when entering a
codebase, with no overlap between files.

## Reasoning
Each file answers a different question:

| File | Question answered |
|---|---|
| README.md | What is this and how do I install it? |
| ARCHITECTURE.md | Why is it built this way? |
| CODEBASE.md | How do I navigate and run it? |
| RESEARCH.md | What was surveyed before decisions were made? |

The boundary between ARCHITECTURE and RESEARCH is the decision point. ARCHITECTURE
records what was decided and why. RESEARCH records the state of knowledge before
the decision — market survey, alternatives evaluated, scope boundary reasoning.
Without RESEARCH, ARCHITECTURE lacks context. Without ARCHITECTURE, RESEARCH lacks
conclusions.

README is for humans approaching the project cold. CODEBASE is for agents and
developers already inside the project. ARCHITECTURE is for anyone asking "why".
RESEARCH is for anyone asking "what else was considered".

Boundary: applies to projects with non-trivial architectural decisions and
pre-implementation research. A small script with obvious design needs only README.

## Examples
**name-police:** README (install, usage, examples), ARCHITECTURE (two-pass design,
why not Semgrep/ESLint, closed system invariant), CODEBASE (grep patterns, index
lookup, how to extend), RESEARCH (lex-police tool selection, Grok x2 reports,
comparative table, scope boundary decisions).

## Consequences
- An agent cloning the repo reads four files and has complete orientation: what,
  why, how, and what alternatives were rejected before the session begins.
- No document becomes a dumping ground — each has a defined responsibility.
- Pre-decision knowledge survives session boundaries (critical for AI-assisted dev).
- The convention is transferable: any project can adopt it without modification.
- Related: → pre-decision-research-as-artifact, → rejection-log-as-design-doc,
  → knowledge-colocation.
