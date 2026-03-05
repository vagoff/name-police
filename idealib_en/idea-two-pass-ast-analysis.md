---
id: two-pass-ast-analysis
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [dev, cs, pattern]
strength: useful
---

## Statement
For static analysis requiring global information: pass1 collects everything across all files, pass2 checks each file using what was accumulated.

## Reasoning
Call-site checking requires knowing the signature of a function that may be defined in another file. Single-pass analysis must either defer checks (complex) or work within a single file (limited). Two passes separate information collection from its use — classic separation of concerns.

Boundary: files are parsed twice — acceptable for a linter, unacceptable for a hot path. For very large codebases pass1 can be cached.

## Examples
**name-police:** pass1 builds `Map<methodName, paramNames[]>` across all files. pass2 uses this map when checking every call site.

**Compilers:** most compilers are multi-pass — first pass collects symbols, subsequent passes use the symbol table.

## Consequences
- Pass1 and pass2 are independent — can be tested separately.
- Accumulated pass1 state is passed to pass2 as a plain object — no global state.
- ESLint plugin can run only pass2 (with limited single-file pass1) — full cross-file checking requires CLI.
