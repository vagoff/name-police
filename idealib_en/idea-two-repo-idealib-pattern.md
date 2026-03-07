---
id: two-repo-idealib-pattern
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [ai-dev, arch, pattern]
strength: useful
---

## Statement
A private master repo holds the full personal idealib; each public project repo holds a curated subset relevant to that project. Synchronization is manual (copy what belongs). The split separates personal knowledge accumulation from external agent context.

## Reasoning
A single public idealib leaks ideas not ready for publication. A single private idealib makes the index unfetchable without a token for every external agent. The two-repo pattern resolves this: master is the source of truth and accumulation space, project repo is a curated public-facing context for agents, contributors, and CI. Ideas graduate from master to project when they are stable and relevant. The copy is intentional — it signals "this idea is load-bearing for this project."

## Examples
`vagoff/aidev_tmp` (private): full idealib, all ideas in progress, fetched with token by personal agents.
`vagoff/name-police` (public): subset of ~20 ideas directly relevant to static analysis and naming, fetched without token by any agent or contributor.

## Consequences
- Project onboarding for agents becomes: fetch `INDEX.md`, fetch relevant idea files — no auth required.
- Master stays unconstrained: speculative and in-progress ideas don't pollute project context.
- Manual sync is a feature, not a bug: it forces a curation decision each time an idea is added to the project.
- The subset relationship is not enforced by tooling — discipline is the only constraint.
