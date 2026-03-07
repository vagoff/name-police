---
id: e2e-definition-by-gap
revnum: 1
author: vagoff
tags: [dev, cs, principle]
strength: core
---

## Statement
An E2E test is a test with no gap between what is verified and what the corresponding consumer actually experiences. If a gap exists, the test is integration-level. The word "corresponding" carries all the weight: it defines where "end" ends.

## Reasoning
The standard definition of E2E via "browser" or "the full stack" fails as a criterion — it is tied to technology, not to structure. A browser is merely the typical example of a "corresponding consumer".

For a web application the consumer is a browser, the gap is JS/CSS rendering. For an external service the consumer is an HTTP client, the gap is near-zero, and a test with a real environment is already E2E. For mobile the consumer is the native UI. The criterion works everywhere without naming specific tools.

Boundary: the definition is structural. It says nothing about cost, speed, or quantity of tests — only about how to classify them.

## Examples
A test of a server-rendered page with a real environment and golden-master comparison is integration-level: the HTML is correct, but JS may re-render it (gap exists). The same test for a system where the consumer is an HTML parser is already E2E (no gap).

## Consequences
- The question "is this integration or E2E?" reduces to one question: is there a gap between what is verified and what the corresponding consumer perceives?
- The same test can be E2E for one consumer and integration-level for another — classification depends on the point of view.
- The boundary between testing levels is not technical — it is the boundary of the mock and the boundary of the consumer.
