---
id: semgrep-vs-custom-ast
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [dev, arch, principle]
strength: useful
---

## Statement
When the logic for generating rules for a tool is more complex than the rules themselves — write the checker directly; the tool has become an intermediate layer with no value.

## Reasoning
Semgrep is justified for simple patterns written by hand. The moment a script appears to generate YAML rules from signatures — you're effectively writing an analyzer, just with an awkward intermediate format. A direct AST walker removes that layer and gives full control.

Boundary: Semgrep is faster for simple cases (5-10 rules, written manually). A custom walker is justified when: cross-file analysis is needed, whitelist logic is needed, rules are generated programmatically.

## Examples
**name-police:** started with "can we do this in semgrep?" Answer: rules 1 and 2 yes, 3 and 4 no. The rule generator for rule 3 by complexity equals the checker itself. Decision: @babel/parser + traverse.

**Compiler plugins:** a Babel plugin is simpler than a jscodeshift codemod for complex transformations — fewer abstractions between you and the AST.

## Consequences
- Tipping point: "I need a script to generate the tool's rules" → time to write a checker.
- ESLint plugin as a thin wrapper over a custom checker — the right compromise: core without ESLint dependency, editor integration for free.
- Semgrep stays useful for ad-hoc checks and security patterns — not a universal solution.
