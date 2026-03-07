---
id: numbered-draft-resolution
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [dev, arch, pattern]
strength: useful
---

## Statement
When two competing drafts of the same idea exist as `idea-xxx1.md` and `idea-xxx2.md`, the resolution sequence is: rename `xxx1` to the clean slug (commit), overwrite with the content of `xxx2` and delete `xxx2` (commit). This preserves full history under the canonical name.

## Reasoning
The numbering suffix is a signal of unresolved ambiguity, not a permanent naming scheme. The goal is to converge to a single canonical file whose history is continuous and complete.

The two-commit sequence exploits git's rename detection: commit 1 establishes the file identity under the canonical name with minimal content change (git sees rename, not delete+create). Commit 2 then evolves the content of that established file. The result: `git log --follow idea-xxx.md` shows the full lineage from the first draft.

A single-commit resolution (rename + content change simultaneously) risks breaking rename detection and producing a history that starts at the merge point, losing the earlier drafts.

Boundary: applies when the two drafts share a slug and one is a superset or evolution of the other. If they are genuinely divergent ideas that happen to share a working name, they deserve separate canonical slugs.

## Examples
**This repo:** `idea-goal-ownership-defines-agency1.md` (base) and `idea-goal-ownership-defines-agency2.md` (extended with scratchpad section). Commit 1: rename `1` → `idea-goal-ownership-defines-agency.md`. Commit 2: overwrite with content of `2`, delete `2`.

## Consequences
- The canonical file's history is continuous from its first draft, not from the merge point.
- The numbered suffixes disappear from the repo without losing the work they contained.
- The pattern is reusable: any `xxxN.md` proliferation resolves the same way regardless of N.
