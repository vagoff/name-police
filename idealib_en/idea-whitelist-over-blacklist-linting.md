---
id: whitelist-over-blacklist-linting
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, pattern]
strength: core
---

## Statement
To forbid "everything except a small set" — define the small set as a whitelist and forbid everything else by default, rather than enumerating the forbidden.

## Reasoning
The set of allowed positions for a name in JS is small (5-7 patterns). The set of forbidden positions is huge and open-ended: any new JS syntax is automatically forbidden. A blacklist requires constant updates as new syntax appears. A whitelist does not.

Boundary: works when the allowed set is the minority. If almost everything is allowed — a blacklist is cheaper.

## Examples
**name-police forbidden-contexts:** `isAllowedUsage()` returns `true` for 7 positions, everything else is automatically forbidden. Optional chaining `?.`, nullish `??` — forbidden without a single line of code.

**Firewall rules:** default deny + whitelist of allowed ports. A new protocol is blocked automatically.

## Consequences
- New JS syntax is forbidden by default until explicitly allowed — the safe side of the error.
- Whitelist code is shorter and more readable than the equivalent blacklist.
- Adding a new allowed context: one `if` in `isAllowedUsage`. With a blacklist — you have to remember all the places where the check exists.
