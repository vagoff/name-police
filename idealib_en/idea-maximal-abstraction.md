---
id: maximal-abstraction
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, cs, principle]
strength: core
---

## Statement
An idea should be abstracted to the maximum possible level — removing all non-essential concepts until only the irreducible essence remains. Everything concrete moves to examples.

## Reasoning
An idea captured at a low level of abstraction is reused only in situations similar to the one where it was born. An idea raised to the maximum is reused wherever the same structure exists, regardless of domain, technology, or scale. Concrete details are not lost — they move to the Examples section where they belong.

Readiness check: remove all proper nouns and technical terms from the statement. If the meaning survives — abstraction is achieved. If without them the statement is empty — more precise abstract words are needed.

Boundary: abstraction must not become so general that it loses actionability. "Do good not bad" is not an idea. Maximum abstraction while preserving actionability.

## Examples
**name-police/idealib:** the idea `semgrep-vs-custom-ast` was formulated through specific tools. Raising abstraction gave `wrapper-complexity-threshold` — applicable to any tools, languages, domains. The Semgrep example moved to the Examples section.

**Cross-domain:** the observation "in our project commits without descriptions are unclear a month later" — low abstraction. Raised: "decision context has asymmetric storage and loss cost" — applicable to logs, documentation, tickets, commits.

## Consequences
- One well-abstracted idea replaces a dozen partial observations from different domains.
- The Examples section becomes more valuable: it shows how an abstract idea lands in reality.
- The abstraction process itself clarifies the essence — if you can't remove the specifics, you may not yet understand what you're observing.
- Connection to → dialogue-mining: when scanning a dialogue, ask not only "is there an idea here" but also "at what level of abstraction is it formulated and can it be raised higher".
