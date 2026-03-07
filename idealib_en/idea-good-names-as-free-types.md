---
id: good-names-as-free-types
revnum: 1
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [dev, arch, principle]
strength: core
---

## Statement
Good names already carry type information — machine enforcement makes it formal without adding noise.

## Reasoning
Hungarian notation tried to encode type into a name via prefix — this added cognitive load. name-police is the opposite: `dbt` is already a good name for DB_ToolBox, it's short, readable, obvious. The linter adds no ceremony — it formalizes what a good reviewer would have required anyway.

Boundary: requires that the domain already has established good names. If the domain is new and names don't exist yet — convention comes first, enforcement second.

## Examples
**name-police:** `dbt`, `new_dbt`, `dbt2` are natural names for variables holding a DB_ToolBox. The pattern `^(dbt|new_dbt|dbt2|tmp_dbt)$` is simply their enumeration.

**Unix:** `fd` for file descriptor, `pid` for process id — established good names. If a linter existed, `^fd[0-9]*$` would be a natural pattern.

## Consequences
- Different developers naming the same class `helper`, `obj`, `myTool` is a signal of bad names, not just a convention violation.
- The name pattern in the name-police config is machine-checkable documentation of domain conventions.
- Enforcement without good names is pointless. Good names without enforcement get lost as the team grows.
