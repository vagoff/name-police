---
id: initiative-protocol
revnum: 3
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [ai-dev, pattern]
strength: core
---

## Statement
Four symmetric code words — SWITCH, CONTINUE, NEED_SWITCH, NEED_CONTINUE — implement a full agent mode on top of a stateless assistant: SWITCH transfers initiative, CONTINUE clocks the active side, NEED_SWITCH and NEED_CONTINUE are informational signals about intent, both at the receiver's discretion.

## Reasoning
Without an explicit initiative-transfer protocol, conversation with an LLM is structurally asymmetric: the user is always the active side, the LLM always reacts. This is not a technical constraint — it is the default convention.

The code words change the convention. SWITCH transfers goal ownership (→ goal-ownership-defines-agency). CONTINUE works in both directions: the passive side clocks the active side, but the active side can also send CONTINUE if it sees the passive side has not finished a thought. NEED_SWITCH gives the passive side a way to signal need for control without interrupting — the active side finishes the current fragment and transfers SWITCH. NEED_CONTINUE is symmetric: the active side signals the passive that it has work for the next iteration — the passive does not rush with new requests. Both NEED-signals are purely informational: the receiver decides on its own how and when to respond.

The symmetry of the vocabulary underlines the equality of the parties: the same words for both sides.

Scratchpad (`/home/claude/scratchpad.md`) — persistent agent state between turns within a session. Read at the start of a turn, updated at the end. Packed into an archive at end of session for transfer to the next session.

Connection to → convention-over-infrastructure: full agent mode is implemented by convention, without an agent framework.

Boundary: works while both parties are cooperative and the session fits in the context window. Cross-session persistence — via scratchpad archive, not infrastructure.

## Examples
**This session:** initiative-protocol was developed and documented in agent mode that itself implements this protocol. The first run proved viability.

**NEED_SWITCH:** the active side is in the middle of a complex fragment — the passive side does not want to interrupt, but wants to add important context. NEED_SWITCH signals this without breaking the flow.

## Consequences
- CONTINUE from either side is an explicit signal "not stuck, keep going" without polluting the context.
- NEED_SWITCH separates "I want control" from "I am interrupting right now" — the active side chooses the transfer moment itself.
- Scratchpad makes the plan and state visible — both to the LLM and to the user.
- The scratchpad archive at end of session is the handoff to the next session. Together with → session-as-pure-function, gives a reproducible agent workflow.
- The protocol self-documents in the conversation log: SWITCH and NEED_SWITCH are easy to find in a long session.
