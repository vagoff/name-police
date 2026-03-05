---
id: wrapper-complexity-threshold
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, cs, principle]
strength: core
---

## Statement
When a wrapper around a tool has become more complex than the tool itself — the wrapper is your tool. Build it explicitly, remove the intermediate layer.

## Reasoning
A tool is chosen to simplify a task. If using it requires a generator, translator, or adapter of comparable complexity — the tool isn't simplifying, it's shifting complexity. The resulting system is more complex than if the tool hadn't been used at all. The intermediate layer becomes ballast: it needs maintenance, it limits capabilities, it obscures what is actually happening.

Boundary: thin wrappers are fine. The threshold triggers when the complexity of the wrapper is comparable to the complexity of what it does inside.

## Examples
**name-police:** started with "can we do this in Semgrep?". Rules 1-2 — yes. Rules 3-4 would have required a script to generate YAML from function signatures. The complexity of the generator turned out to be comparable to the complexity of the checker itself. Conclusion: drop Semgrep, write the checker on @babel/parser directly. The result is cleaner and more powerful.

**Cross-domain:** a team writes a templating system to generate configs — and at some point the templating system becomes more complex than the framework that initially seemed "too heavy". The right move: acknowledge that the framework was the right tool all along.

## Consequences
- The moment of recognition: "I need a script to use this tool" — a signal that the threshold has been crossed.
- An explicit tool gives full control, removes the constraints of the intermediate layer, and often turns out simpler in total.
- Fear of "too low level" or "too heavy a tool" — a common cause of unnecessary wrappers. Sometimes the right answer is to take what seems excessive.
- A thin wrapper over a custom core is a different matter and remains useful: an ESLint plugin as a wrapper over a custom checker — the right compromise.
