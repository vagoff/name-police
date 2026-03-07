---
id: convention-over-infrastructure
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [arch, dev, cs, principle]
strength: core
---

## Statement
A convention achieves the same behaviour as infrastructure — as long as the parties are cooperative, the state is simple, and the cost of violating the convention is acceptable. Infrastructure is justified when any of these conditions breaks.

## Reasoning
Infrastructure is an enforced convention. It adds reliability at the cost of complexity: it must be designed, built, maintained. A convention is free to build and expensive to violate — but only if violation is possible.

The premature infrastructure error: building enforcement before the convention has shown where it breaks. This is optimising for imagined failures instead of real ones.

The correct sequence: start with a convention, observe where it is violated and what the cost of violation is, build infrastructure precisely under real failures.

Boundary: if the parties are inherently non-cooperative (public API, competing interests) — convention is insufficient from the start. Infrastructure is needed immediately.

## Examples
**SWITCH/CONTINUE protocol:** agent mode for LLMs is implemented by two code words — a convention. Agent frameworks (LangGraph, AutoGen) are infrastructure solving persistence, parallelism, and fault-tolerance. The convention suffices while parties are cooperative and the session fits in the context window.

**Git commit conventions:** Conventional Commits (`feat:`, `fix:`, `breaking:`) — convention. CI commit message validator — infrastructure. A two-person team lives on the convention; a large open-source project builds infrastructure because the cost of violating the convention (broken changelog, missed breaking change) becomes real.

**TCP vs UDP + convention:** UDP is an unreliable channel. Applications that know what they are doing (DNS, video streaming) implement the needed reliability level as a convention on top of UDP — and get less overhead than TCP. TCP is reliability infrastructure for cases where the convention is insufficient.

**REST vs gRPC:** JSON over HTTP — convention about data structure. gRPC with protobuf — infrastructure for typing and versioning. Microservices within one team live on REST; between teams or organisations the infrastructure is justified.

## Consequences
- Convention is the MVP of infrastructure. Start with the convention, observe failures, build infrastructure for specific failures.
- Infrastructure encodes the convention in code — that is simultaneously its strength (enforcement) and weakness (cost of change). Changing a convention is cheap; changing infrastructure is not.
- A good sign the convention is ready to become infrastructure: its violation has already occurred and the cost proved unacceptable.
- Connection to → format-follows-usage: don't design structure upfront. Same principle but for enforcement mechanisms.
