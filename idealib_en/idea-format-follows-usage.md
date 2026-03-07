---
id: format-follows-usage
revnum: 1
author: handle
home: https://github.com/user/ideas
tags: [arch, dev, principle]
strength: core
---

## Statement
Do not design a format or structure upfront — let real usage patterns reveal what structure is actually needed.

## Reasoning
An upfront-designed format optimises for imagined scenarios. Real usage always differs from anticipated usage. Early structural commitment creates debt: either break the format (and everything depending on it), or live with the inconvenience.

Boundary: if the system is public and backwards compatibility is critical — thinking ahead is necessary. For internal and experimental systems, iteration is cheaper than upfront design.

## Examples
**Databases:** start with a flat table, normalise when you see real queries — not when you imagined the schema.

**Idea library (Idea.md):** launch with minimal format, accumulate units, then decide from real loading patterns whether interlinks, weights, or clusters are needed.

## Consequences
- The first version of the format is intentionally sparse — this is not an oversight, it is a strategy.
- The moment to upgrade the structure is determined by pain during usage, not by a timer.
- The longer you keep the format simple, the more justified any future complication will be.
