---
id: session-as-pure-function
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [ai-dev, arch, principle]
strength: core
---

## Statement
An LLM working session should be treated as a pure function: explicit inputs (loaded knowledge units + current task), explicit outputs (result + new idea candidates). State must not accumulate inside the session.

## Reasoning
The current default model — "conversation = stateful context window" — is architecturally defective for long working sessions. State accumulates implicitly, signal-to-noise ratio drops monotonically, and the session cannot be reproduced or composed.

A pure function session has the opposite properties: it is reproducible (same inputs → same quality), composable (outputs of one session can be inputs of the next), and its scope is explicit (you know what you loaded, you know what you produced).

The handoff prompt at the start of a new session is not a workaround — it is the function signature. Writing it forces you to be explicit about what context actually matters.

Connection to → knowledge-unit-store: units are the loadable inputs. Connection to → dialogue-mining: mining produces the outputs. Connection to → context-degradation-as-signal: degradation marks the function's natural termination point.

Boundary: pure session discipline requires an externalised idea store. Without idealib, the inputs for the next session don't exist — and you're back to stateful accumulation.

## Examples
**Good session start:** "Context: [3 relevant units pasted]. Task: design the attention-window entry point for Tulip. Output expected: decision + any new ideas for idealib."

**Bad session pattern:** same conversation thread extended across multiple days, topics, and tasks — context ballast grows, relevance of old turns approaches zero, degradation is guaranteed.

## Consequences
- Session length becomes a design decision, not an accident of "how long until I got tired".
- The quality of a session is measurable: how many units did it produce? Was the output clean enough to paste as input to the next session?
- Idealib is not just PKM — it is the inter-session state store that makes pure sessions possible. Without it, purity is aspirational only.
