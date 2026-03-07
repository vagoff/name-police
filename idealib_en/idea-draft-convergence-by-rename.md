---
id: draft-convergence-by-rename
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [dev, pattern]
strength: useful
---

## Statement
To converge multiple numbered drafts into one canonical file without losing history: rename the earliest draft to the target slug first, then overwrite it with the final content. Never do both in one commit.

## Reasoning
This is the mechanical implementation of → numbered-draft-resolution. The key insight is sequencing: establish identity first (rename), evolve content second. Git's rename detection operates on the diff between two commit states — isolating the rename maximises detection confidence.

The rename commit has zero or minimal content change: git computes similarity as (matching lines) / (total lines). A pure rename scores near 100%. Adding content changes reduces the score and can fall below git's default 50% threshold, causing the history to appear as delete+create.

## Examples
```
# commit 1 — rename only
git mv idea-xxx1.md idea-xxx.md
git commit -m "rename: idea-xxx1 → idea-xxx"

# commit 2 — content only  
cp idea-xxx2.md idea-xxx.md
git rm idea-xxx2.md
git add idea-xxx.md
git commit -m "update: idea-xxx — merge extended draft, remove xxx2"
```

## Consequences
- `git log --follow idea-xxx.md` traces back through the rename to the original `xxx1` creation.
- The diff in commit 2 shows only the content delta between the two drafts — clean and reviewable.
- Generalises to any file convergence, not just idea drafts.
