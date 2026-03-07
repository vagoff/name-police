---
id: raw-url-as-agent-contract
revnum: 1
author: vagoff
home: https://github.com/vagoff/aidev_tmp
tags: [ai-dev, arch, principle]
strength: core
---

## Statement
`github.com/blob/` URLs are a human interface (HTML page); `raw.githubusercontent.com` URLs are a machine contract. When designing index files for agents, URL format is an API decision, not cosmetics.

## Reasoning
Agents and LLMs fetch file content, not rendered pages. A blob URL returns an HTML shell with the content embedded — unfetchable without a browser. A raw URL returns the file directly over HTTP. For public repos this works without authentication; for private repos it requires `Authorization: Bearer TOKEN` in the request header. The distinction matters at design time: an index file with blob URLs is broken for any non-browser consumer regardless of how well-structured the rest of the index is.

## Examples
GitHub raw URL pattern for public repo: `https://raw.githubusercontent.com/owner/repo/main/path/to/file.md` — fetchable by curl, fetch(), LLM tool calls.

Same file as blob URL: `https://github.com/owner/repo/blob/main/path/to/file.md` — returns HTML, useless for agents.

## Consequences
- Any static index intended for agent consumption must use raw URLs exclusively.
- For private repos, the token-passing strategy (Authorization header) must be decided at the agent layer, not encoded in the index itself — the index stays token-free.
- URL format bugs in index generators are silent: the index looks correct to a human reading it, but every link is broken for machines.
