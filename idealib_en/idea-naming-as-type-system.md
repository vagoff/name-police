---
id: naming-as-type-system
revnum: 1
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [arch, cs, dev, principle]
strength: core
---

## Statement
A sufficiently strict naming convention makes data flow analysis reducible to syntactic checking — no type inference, no flow graph, just names.

## Reasoning
If you control three things simultaneously: (1) only `new C()` can produce a name matching pattern `xxx*`, (2) `xxx*` names can only flow into other `xxx*` names, (3) `xxx*` names can only appear in a small whitelist of syntactic positions — the system is closed. Entry into `xxx*`-space is only via `new C()`, exit is impossible. The invariant is not inferred but postulated syntactically. That is the equivalence.

Boundary: works only for instances of named classes. Primitives are undecidable — the system doesn't apply there and doesn't need to.

## Examples
**name-police:** `dbt` is a good name for a DB_ToolBox instance. The linter guarantees any `dbt*` variable holds exactly a DB_ToolBox — no TypeScript, no annotations.

**Cross-domain:** Hungarian notation did the same thing manually in the 80s. The difference: name-police checks it mechanically, and uses good names instead of noisy prefixes.

## Consequences
- Grep on the name pattern gives a complete and accurate picture of class usage — no surprises.
- Different developers cannot name the same instance `helper`, `obj`, `tmp` — the system won't allow it.
- The domain where it works is covered 100% with zero false positives. Better to cover a small domain perfectly than a large one approximately.
