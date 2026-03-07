---
id: golden-master-as-orthogonal-dimension
revnum: 1
author: vagoff
tags: [dev, cs, principle]
strength: useful
---

## Statement
Golden Master is an orthogonal dimension to the test level. Any test at any level (unit, integration, E2E) can use the golden master verification strategy. Level and strategy are independent.

## Reasoning
Test level answers the question "how much of the system is involved". Verification strategy answers the question "how is the result checked". These are different axes — easy to confuse because golden master most often appears at the integration level (HTML, snapshots), but that is a correlation, not an implication.

Boundary: golden master tests stability, not correctness. The reference may contain a bug — and the test will be green.

## Examples
Unit with golden master: a rendering function returns a string, compared against a snapshot (Jest snapshot testing). Integration with golden master: a server-rendered page, HTML compared against a reference file.

## Consequences
- When analysing a test, two independent questions must be asked: what level? and what verification strategy?
- Golden master is especially valuable for legacy code: first capture the current behaviour, then refactor without fear of regression.
- Updating the reference is a deliberate action, not an automatic one. That is both the strength and the weakness of the pattern simultaneously.
