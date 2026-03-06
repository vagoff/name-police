---
id: committed-git-hooks
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [dev, pattern]
strength: useful
---

## Statement
Git hooks should live in the repository as ordinary files, not in `.git/hooks/`. Use `core.hooksPath .githooks` — then hooks are versioned, transferred on clone, and never lost.

## Reasoning
`.git/hooks/` is not versioned and not cloned — a hook written by one developer is invisible to others and disappears on re-clone. This is an anti-pattern of the same nature as documentation in Notion: works locally, lost on transfer. `core.hooksPath` allows storing hooks in any folder in the repository — they become ordinary files with change history.

Boundary: requires one command after cloning. Can be automated via `Makefile` or `package.json postinstall`.

## Examples
**Setup:**
```bash
# once after cloning
git config core.hooksPath .githooks
```

**name-police:** `.githooks/pre-push` automatically regenerates `INDEX.md` and amends the last commit if the file changed. Hook is in the repo — so it works for everyone, is versioned, visible in `git log`.

## Consequences
- A hook is part of the project — it should live next to the code. Connection to → knowledge-colocation.
- `git log .githooks/` shows hook change history like any ordinary file.
- A new developer sees the hooks in the repo, reads what they do, installs with one command.
- Automation that lives only on the author's machine is not automation — it's a personal script.
