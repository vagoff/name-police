---
id: enforcer-as-trust-signal
revnum: 1
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [arch, dev, ai-dev, principle]
strength: core
---

## Statement
A committed git hook running an enforcer changes the epistemic status of conventions
from aspirational to guaranteed. This is not a CI practice — it is a trust signal
that makes downstream tools (grep, agents, static analysis) reliable.

## Reasoning
A convention without enforcement is a wish. An agent or developer reading the codebase
cannot know whether the convention holds — they must verify each instance. With an
enforcer in the pre-commit hook, every committed file has passed the check. The
convention is now a structural invariant, not a guideline.

This changes what grep can do. `^function \w+(` without enforcement: might match
arrow functions, might miss edge cases, depends on developer discipline. With
enforcement: the pattern is a complete and accurate index of top-level functions.
No false positives. No missing entries.

The epistemic shift: `[convention]` → `[auto]`. Tools that consume the convention
can trust it unconditionally.

Boundary: requires that the hook is committed (not just local) and that
`core.hooksPath` is documented in onboarding. An unenforced hook is still a wish.
See: → committed-git-hooks.

## Examples
**lex-police + pre-commit hook:** grep navigation patterns in CODEBASE.md are marked
`[convention]` without the hook, `[auto]` with it. An agent cloning the repo and
seeing `.githooks/pre-commit` running lex-police knows the structural patterns are
guaranteed — and can use grep as a reliable index without hedging.

**name-police:** same principle. The signature table built in pass1 is trustworthy
because name-police enforces the invariants that make it sound.

## Consequences
- Agents can use grep as a reliable index without runtime verification.
- Code review shifts: reviewers stop checking convention compliance manually.
- The enforcer is itself documentation: reading the hook tells you what the
  codebase guarantees.
- Onboarding question reduces to: "did you run `git config core.hooksPath .githooks`?"
- Related: → closed-system-invariant (enforcement is what closes the system),
  → committed-git-hooks, → positional-convention-as-navigation-contract.
