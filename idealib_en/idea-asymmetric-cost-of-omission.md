---
id: asymmetric-cost-of-omission
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, cs, principle]
strength: core
---

## Statement
The cost of an extra unit is near zero, the cost of a lost idea is irretrievable — so when in doubt, always capture it.

## Reasoning
Asymmetric costs: storage is cheap, generating a unique thought is expensive and not reproducible on demand. An idea arises in context — mood, conversation, state of the task — that will never repeat exactly. An extra unit is simply ignored, a lost unit never comes back.

Boundary: works when storage cost is truly low. In systems where storage is expensive (RAM, context tokens) — selection is needed.

## Examples
**Idea library:** not sure whether to record an idea — record it. Worst case: the file gets ignored. Best case: six months later it turns out to be key.

**System logging:** better an verbose log nobody reads than a missing log at the moment of an incident.

**Commits:** a small commit with an obvious change does no harm. Lost context for why a change was made — hurts on every `git blame`.

## Consequences
- The threshold for recording should be low — perfectionism kills the library at the start.
- Selection and filtering of ideas is a separate task and should not block recording.
- The storage system must make ignoring extras cheap — otherwise the asymmetry disappears.
