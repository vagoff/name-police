---
id: goal-ownership-defines-agency
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [ai-dev, arch, cs, principle]
strength: core
---

## Statement
An agent differs from an assistant not by the presence of infrastructure (framework, background process, persistent memory) but by who holds goal ownership: an agent owns the goal and advances toward it, an assistant reacts to requests.

## Reasoning
The standard definition of an agent via infrastructure ("has an event loop", "runs in background", "persists between calls") describes implementation, not essence. It leads to errors in both directions: calling any LLM with tool-use an agent, and denying agency to a system that owns a goal but is implemented without a framework.

Goal ownership is the precise criterion: who determines the next step? If the human — it is an assistant. If the system — it is an agent. This is observable without knowing the implementation.

Consequence: agency can be transferred by convention. If both parties have agreed that one of them holds the goal until explicit transfer — agent mode is realised, regardless of the infrastructure underneath. The technical implementation may follow later — or never, if the convention is sufficient.

Boundary: convention works when the parties are cooperative and the state is simple enough to hold in working memory. At scale, with unreliable parties, or with complex state, infrastructure becomes necessary — but that is an engineering decision, not the definition of agency.

## Examples
**SWITCH/CONTINUE protocol:** two code words transfer goal ownership between a human and an LLM. The LLM technically remains a stateless assistant — but semantically is an agent while it holds the initiative. No agent framework, no background process.

**Scrum:** the product owner holds goal ownership (backlog, priorities), the team holds task ownership (how to implement). Roles are defined by convention, not infrastructure.

**Unix pipe:** `grep | sort | head` — each command is an agent in its pipeline segment, passing results to the next. Goal ownership is transferred via stdout, not through a coordinating framework.

## Consequences
- The question "is this an agent or assistant?" is replaced by "who currently holds the goal?" — observable and unambiguous.
- Agent mode can be prototyped without infrastructure: convention comes first, infrastructure is an optimisation.
- An LLM assistant in agent mode by convention reveals that agent framework infrastructure solves persistence and reliability — but not agency itself.
- Transferring goal ownership is an event in the protocol; it must be explicit. Implicit goal transfer creates confusion regardless of implementation.

## Implementation via scratchpad

Full agent architecture on top of a stateless assistant:

```
turn N:   read scratchpad → make step → update scratchpad
turn N+1: read scratchpad → make step → update scratchpad
...
final:    pack scratchpad into archive → SWITCH
```

Scratchpad is externalised goal state. Without it, the convention transfers goal ownership, but the agent has no memory of its progress between turns. With scratchpad — a complete model: goal, plan, state, decision history.

The session file system (`/home/claude/`) is the agent's working space. Any number of parallel documents. The archive at end of session is cross-session state transfer.
