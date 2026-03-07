---
id: claude-github-workflow
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [ai-dev, dev, pattern]
strength: useful
---

## Statement
Claude can push directly to GitHub via an HTTPS token embedded in the repository URL, using git in bash_tool — no connectors, no intermediate files, no user involvement in each commit.

## Reasoning
Claude has bash access with git. GitHub accepts authentication via a token embedded in the remote URL. This gives a full git workflow directly from the session: commit, push, history, branches. Connectors (MCP GitHub) are often unavailable or require separate setup — this approach works whenever a token is available.

Boundary: the token in the URL stays in git remote history — for private repos with sensitive code a different mechanism is preferable. For public repos and work projects — fine. The token lives in Claude's session memory, not persisted between sessions.

## Examples
**Setting remote with token:**
```bash
git remote add origin https://TOKEN@github.com/user/repo.git
# or if remote already exists:
git remote set-url origin https://TOKEN@github.com/user/repo.git
```

**Typical workflow in a session:**
```bash
# Initialization (once)
cd /home/claude/project
git init
git config user.email "deploy@session"
git config user.name "Claude"
git remote add origin https://TOKEN@github.com/user/repo.git
git branch -m main

# Work
git add .
git commit -m "feat: description"
git push -u origin main

# Subsequent pushes
git add changed-file.js
git commit -m "fix: description"
git push
```

**If repo is not empty (GitHub created a README):**
```bash
git push --force  # or git pull --rebase then push
```

## Consequences
- Claude becomes a full participant in the git workflow — not just a file generator.
- The user gives the token once at the start of the session — Claude handles all commits and pushes from there.
- Between sessions the token is lost — needs to be provided again in a new session (or kept in project config).
- Token must be created with Contents: Read and Write permissions on the specific repository (fine-grained token in GitHub Settings → Developer settings → Personal access tokens).
- After the session the token should be revoked if it was single-use.
