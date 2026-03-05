---
id: semgrep-vs-custom-ast
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [dev, arch, principle]
strength: useful
superseded-by: wrapper-complexity-threshold
---

> **Archived.** This idea has been superseded by → wrapper-complexity-threshold which captures the same insight at a higher level of abstraction. The Semgrep/babel example is preserved there in the Examples section.

## Original statement
When the logic for generating rules for a tool is more complex than the rules themselves — write the checker directly; the tool has become an intermediate layer with no value.

## Original examples
**name-police:** started with "can we do this in semgrep?" Answer: rules 1 and 2 yes, 3 and 4 no. The rule generator for rule 3 by complexity equals the checker itself. Decision: @babel/parser + traverse.
