---
id: compile-time-capability-folding
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [arch, cs, pattern]
strength: core
---

## Statement
A compile-time constant known at compilation time allows dead code elimination before output is generated — leaving neither a conditional nor dead branches in the generated code. Platform differences disappear from output, even though they are written once in source.

## Reasoning
The alternative — runtime capability checking (`if (hasFeature('x'))`) — leaves the code of both branches in the output. That is dead weight: the unused branch occupies space, may contain unreachable errors, and reduces readability. If a platform capability is known statically, it should be resolved statically.

Mechanics: `command_exists("x")` compiles to the string `"true"` or `"false"`. `emit_if` checks whether the condition is a constant and, if so, emits only the needed branch.

Boundary: works only for differences known before compilation. Runtime-dependent conditions (file existence, system state) require runtime checking.

## Examples
**DSL compiler:** for Neovim, `editor.command_exists("find_in_files")` → `true`, the entire else-branch with an `rg` fallback never reaches the Lua output. For micro → `false`, the native branch is absent. Code is written once; output contains only what the platform needs.

**C preprocessor:** `#ifdef TARGET_ARM` — the same idea, different syntax. Compile-time branching by platform. The DSL variant is cleaner: no ifdefs in source, the condition is written as a normal if.

**Tree shaking in bundlers:** static analysis of imports, unused code excluded from the bundle — same principle.

## Consequences
- Generated code is idiomatic for the platform: no artefacts from multi-platform source.
- Adding a new platform requires no changes to DSL plugins — only a capabilities declaration in the generator.
- `shell_ext` was added in 10 minutes — same mechanism, different capabilities set.
