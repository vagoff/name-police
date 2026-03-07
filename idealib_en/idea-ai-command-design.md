---
id: ai-command-design
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [ai-dev, principle, pattern]
strength: core
---

## Statement
Commands to an AI in natural-language conversation should be single uppercase words — no symbols, no prefixes, no phrases. Uppercase signals intentionality without special syntax and does not conflict with natural speech.

## Reasoning
Natural language conversation has no reserved syntax for commands — unlike a shell or a programming language. This creates a design problem: how to distinguish "mine this data" (topic sentence) from a command to start mining.

Uppercase solves this at zero cognitive cost. MINE is unambiguous. "mine" in a sentence is ambiguous. A symbol prefix like `/mine` or `!mine` requires remembering the prefix convention. A phrase like "please do a mining pass now" is fragile — paraphrase breaks it.

Single word enforces one command = one action (→ responsibility-as-north-star applied to UX). If a command needs two words to describe its action, it is probably two commands.

Boundary: works when the command set is small (< ~10 commands). At large scale, a proper command syntax with autocomplete is better. Also assumes the AI is reading the full message — not just keywords.

## Examples
**This workflow:** `MINE` triggers dialogue mining + handoff generation. No ambiguity possible in any natural sentence.

**Shell analogy:** `ls`, `cd`, `grep` — short, memorable, unambiguous. The difference is that in a shell all tokens are commands by default; in conversation, the opposite is true. Uppercase is the minimal marker to flip that default.

## Consequences
- A command vocabulary of 5-10 words covers most AI workflow needs and is trivially memorable.
- The design question "what should my command be?" reduces to: find the one verb that names the action. If you can't find one verb — the action isn't defined clearly enough yet.
- Uppercase commands are self-documenting in conversation logs: scanning a long session for `MINE` is instant.
