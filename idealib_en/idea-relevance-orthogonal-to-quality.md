---
id: relevance-orthogonal-to-quality
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, cs, principle]
strength: core
---

## Statement
The relevance of a component is orthogonal to its quality. A perfectly designed system can contain a design error that no structural analysis will detect: a component that solves a problem that no longer exists.

## Reasoning
All design principles — responsibility, cohesion, coupling — operate inside the system. They answer "is this well built?" but not "is this needed at all?". These are orthogonal dimensions. A dependency graph A→B→C can be technically flawless and semantically dead simultaneously — if C solves an obsolete problem, everything that depends on it is also dead, regardless of implementation quality.

The error is not detectable from inside the system. Code review, linters, architectural analysis — these are all inside-view tools. A relevance error is only visible from outside: "why does C exist at all?"

The insidious consequence: the better the system is designed — the longer this error lives undetected. A bad system causes pain and provokes questions. A good one runs quietly.

Boundary: on short time horizons relevance is stable. The error manifests on horizons where context changes — market, technology, user needs.

## Examples
**Classic:** a typewriter staffing agency could be impeccably organized in 1990 — right processes, right roles, right metrics. The error is not in the organization, but in the fact that the problem disappeared.

**In code:** a desktop-to-server data sync library, perfectly designed in 2010 — becomes dead weight when the product moves to web-only. All components that depend on it carry this weight.

## Consequences
- The question "why does this exist?" is separate and mandatory — not derivable from architectural analysis.
- Regular review of component relevance is a separate practice, not covered by any code review.
- Good design is a necessary but not sufficient condition for a healthy system.
- Connection to → responsibility-as-north-star: the responsibility principle answers "what does this component do". Relevance answers "should this be done at all". Both questions are mandatory.
