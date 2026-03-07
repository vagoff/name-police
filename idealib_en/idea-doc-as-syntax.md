---
id: doc-as-syntax
revnum: 1
author: vagoff
home: https://github.com/vagoff/ideas
tags: [cs, arch, principle]
strength: core
---

## Statement
Documentation that must be machine-readable belongs in the language syntax, not in comments. A comment is discarded by the parser and unavailable to tools — a keyword remains in the AST.

## Reasoning
A comment is what the parser threw away. If a tool (documentation generator, IDE, compiler) must see the documentation, it must be in the AST. Special markers in comments (`/** ... */`, `# type: ignore`) are a crutch: the documentation pretends to be a comment in order to enter the stream while not actually being a normal comment.

Boundary: if documentation is needed only by a human and is never processed by tooling, a comment is sufficient. `doc` is justified when there is at least one automated use.

## Examples
**DSL compiler:** `doc "Description of the command."` — a keyword, reaches the AST as a `DocStmt`. Compiled into a comment in the target language. Future potential: a `:help plugin` command could show these strings directly from the AST without parsing comments.

**Python docstrings:** a string literal as the first statement in a function — a compromise: not a keyword, but not a comment either. Ends up in the `__doc__` attribute. Better than `#`, weaker than explicit syntax.

**JSDoc `/** */`:** a comment with a convention inside. TypeScript is forced to parse comments to extract types — an architectural smell.

## Consequences
- `doc` annotates the specific next construct — no ambiguity about which construct the documentation belongs to.
- Consistency: one keyword in any context (command, function, constant).
- The first keyword is always first on the line — the language invariant is not violated.
