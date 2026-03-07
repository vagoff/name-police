---
id: explicit-over-derived-config
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [arch, cs, principle]
strength: core
---

## Statement
If configuration is automatically derived from data and the result depends on the current state of that data — declare it explicitly. Fragile derivation is worse than explicit declaration even when explicit requires more words.

## Reasoning
Automatic derivation creates an implicit dependency: adding a new data element can change the derived configuration without any explicit intent to do so. This is especially dangerous when configuration affects system semantics — the error manifests not at the moment of data change, but later, in non-trivial behaviour.

Boundary: if derivation is deterministic and its change is always desired when data changes — auto-derivation is fine. The danger is only when derivation can "surprise".

## Examples
**DSL compiler:** `singleton_puncts` (delimiter symbols `()[]{}`) were automatically derived — symbols that do not appear in multi-character operators. Adding a `->` operator would automatically remove `-` from singletons. Correct solution: explicit `singleton_puncts: new Set([...'()[]{},''])` — regardless of what gets added to the operator set.

**Authorisation systems:** permissions computed from roles through automatic rules are hard to debug. An explicit whitelist is readable and directly verifiable.

## Consequences
- Explicit configuration reads as documentation — it is clear what and why without analysing the derivation algorithm.
- Data changes do not unexpectedly break configuration.
- Cost: more words at declaration time. Acceptable when configuration changes rarely.
