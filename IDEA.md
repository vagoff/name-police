# The Core Idea: Naming Discipline as a Type System

## The Insight

A sufficiently strict naming convention makes data flow analysis **reducible to syntactic
checking**. No type inference. No data flow graph. Just names.

If you enforce:
1. `new C()` can only be assigned to variables matching pattern `xxx*`
2. `xxx*` variables can only flow into other `xxx*` variables/parameters
3. `xxx*` names can only appear in a small whitelist of syntactic positions

Then: **any variable matching `xxx*` is guaranteed to hold an instance of `C`**.
The name becomes a machine-verified type.

## Why It Works (The Closed System Argument)

The rules create a closed set. Entry into `xxx*`-space is only via `new C()`. Exit is
impossible. Therefore the name is a sound invariant — not inferred, but postulated
syntactically. This is why syntactic checking becomes equivalent to data flow analysis
under these constraints.

## This Is Not Hungarian Notation

Hungarian notation adds cognitive load — `pszBuffer`, `lpDword` are noise. name-police
enforces **good names that already reflect the domain**. `dbt` is just a good name for
a DB_ToolBox instance. The invariant is a free bonus, not extra ceremony.

## One Name, One Contract

A second invariant that makes the system click: **every method/function name must have
exactly one signature across the entire codebase**. This enables call-site checking
without type inference or class hierarchy traversal. When you see `svc.process(x, y)`,
the name `process` alone tells you what `x` and `y` must be.

Side effect: forces semantic naming discipline. A codebase where `process` always means
the same thing is a better codebase.

## The Strategic Choice: Ignore Primitives

Primitives are where static analysis starts lying. String is a string — no convention
can be enforced without pain and false positives. name-police only controls instances
of named classes, where the system is **decidable and complete within its domain**.

Better to cover a smaller domain perfectly than a larger domain approximately.

## Inversion of Linter Logic

Most linters use **blacklists** — forbid specific bad patterns. name-police uses a
**whitelist** — permit only specific good positions for controlled names, forbid
everything else automatically. This means new JS syntax is forbidden by default until
explicitly allowed. The complement approach.

## Equivalence to Linear/Capability Types

What name-police implements is conceptually close to linear types or capability systems:
a value of type `xxx*` can only be used in specific ways. The difference is the
enforcement mechanism — names instead of types. Simpler, less powerful, but zero
infrastructure cost.

## The "Genius of the Kuvaldа" Principle

Academic type systems are mathematically elegant and practically heavy. This idea is
"not mathematical" and "simple as a sledgehammer" — and that's exactly why it works
in production. It covers an enormous class of bugs with zero false positives in its
domain, enforces excellent coding guidelines as a side effect, and requires no
compiler, no type annotations, no build step changes.

The tools that didn't exist to do this: not because it's hard, but because it's not
publishable in PLDI.
