---
id: staged-git-semantics
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [dev, arch, principle]
strength: core
---

## Statement
A git commit should contain exactly one semantic operation: either a rename, or a content change — not both. Mixing them destroys the history that git is capable of preserving.

## Reasoning
Git's rename detection is heuristic: it matches a deleted file with a new one by content similarity. If rename and content change happen in the same commit, the similarity threshold may not be met and git records delete+create instead of rename. `git log --follow`, `git blame`, and diff readability all depend on this detection working correctly.

The same principle applies beyond renames: a refactoring commit (restructuring without behaviour change) should not be mixed with a bug fix. Each operation has its own semantic — mixing makes both unreadable in review and archaeology.

Boundary: applies when history legibility matters. For throwaway branches or solo exploration, the cost of extra commits may exceed the benefit.

## Examples
**Rename + extend:** `idea-xxx1.md` → `idea-xxx.md` (commit 1, rename only), then overwrite with extended content from `idea-xxx2.md` (commit 2, content only). Git tracks the file as continuously evolving.

**Code refactoring:** extract a function (commit 1), then fix the bug inside it (commit 2). Mixed into one commit, `git blame` on the bug fix line shows the refactor author/date, not the fix.

## Consequences
- `git log --follow <file>` works across renames only if the rename was isolated.
- Code review of content changes is clean: no rename noise in the diff.
- The principle generalises: one semantic operation per commit is the invariant; rename vs content is just the most commonly violated instance.
