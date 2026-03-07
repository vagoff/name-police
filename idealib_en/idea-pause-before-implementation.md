---
id: pause-before-implementation
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [dev, arch, principle]
strength: core
---

## Statement
Stopping before implementation begins — when the task seems clear and hands are already reaching for the keyboard — with the question "are we solving the right task?" improves the result more often than it delays it.

## Reasoning
The moment of greatest confidence in the task is simultaneously the moment of greatest risk. The task seems solved in the head, details are filled with assumptions, alternative framings have not been considered. Implementation fixes all those assumptions in code.

A pause is cheap — a few minutes of conversation. Rework after implementation is expensive. The asymmetry of costs makes the pause worthwhile even if it is necessary in only 20% of cases.

Boundary: does not apply to trivial changes where the task is genuinely unambiguous. Applies when the task touches interfaces, architecture, or the principles on which the system is built.

## Examples
**DSL compiler, several cases:**
— "Let's add `find_prev_re`" → pause → "but why should grep results be a list when the buffer already is a list of lines?" → removed an entire layer of syntax.
— "Let's add `shell_ext.capture_to_buf` as a builtin" → pause → "but why not implement it via two calls as a fallback, same pattern as editor_ext?" → more consistent architecture.
— "Let's add description as a second line in command" → pause → "wouldn't `doc` as a keyword be better?" → documentation unified everywhere.

**Refactoring:** "let's rewrite the module" → pause → "which specific responsibility are we redistributing?" — often it turns out that the module does not need rewriting, one function needs extracting.

## Consequences
- The best solutions in dialogue arise not when someone proposes a ready answer, but when someone stops and asks.
- For LLMs the pause is especially important: LLMs have a strong bias toward immediate implementation — they are optimised to respond, not to ask back.
- The skill is formulated as: "before building — can we not build this, or build something else?"
