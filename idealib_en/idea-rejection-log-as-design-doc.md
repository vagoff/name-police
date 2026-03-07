---
id: rejection-log-as-design-doc
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [arch, dev, principle]
strength: core
---

## Statement
A list of rejected solutions with reasons for rejection is more valuable than a list of accepted solutions — because it explains why the system looks the way it does, and not otherwise.

## Reasoning
Accepted decisions are visible in code — they can be read. Rejected decisions disappear. Six months later a new developer (or you yourself) sees the result but not the alternatives that were considered. They rediscover the rejected solution, implement it, and only then hit the reason it doesn't work — which was already known.

A rejection log prevents this. It does not describe what was done — it describes what was not done and why.

Boundary: worth maintaining for non-trivial decisions where a real alternative existed. Trivial choices without alternatives need no documentation.

## Examples
**DSL compiler (from a presentation):** rejected — `#ifdef` style (C legacy), `{}` as a record literal (already taken for blocks), `:` for kwargs (assignment must be `=` everywhere), auto-derivation of singleton symbols (fragile), `list` type for grep results (a text buffer already exists). Each entry explains why the system looks as it does.

**RFC process in large projects:** the "Motivation" section describes alternatives that were considered — this is a rejection log in institutionalised form.

**Architecture Decision Records (ADR):** a format designed specifically for this. "Considered Options" + "Decision Outcome" — rejection log with rationale.

## Consequences
- Onboarding accelerates: the new developer understands not only what, but why.
- Prevents repeated consideration of already-rejected ideas in reviews and meetings.
- The process of writing the rejection log is disciplining: it forces making the reasons for rejection explicit rather than intuitive.
- In presentations and design discussions the "what we rejected" section is often more interesting than the "what we accepted" section.
- The rejection log is a **test suite for new proposals**: when someone brings an idea, the first check is whether it is already in the log. This is an O(1) filter for repeated proposals without a meeting. "We considered this already, here is why we didn't take it" — an immediate and documented answer.
