---
id: cognitive-scope-colocation
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [arch, dev, principle]
strength: core
---

## Statement
Modules that enter the scope of attention together should live in the same folder. The criterion for organization is not architectural layer and not type, but minimization of cognitive friction as an integral over all work sessions.

## Reasoning
Architectural layers describe the nature of a module. Cognitive scope describes the pattern of use. These are orthogonal things — and the second matters more for navigation. A module that structurally belongs to "infra" but is always opened together with "domain" creates friction in every work session.

The right folder is the one you rarely need to leave to fetch a neighboring file within a single task. The wrong folder is discovered empirically: if you constantly open files from two folders simultaneously — they should be one.

Boundary: the principle works when usage patterns have stabilized. In a new project without history — start with architectural layers, then correct by real friction.

## Examples
**Code:** a validation module that is always opened together with the model lives next to the model, not in a separate `validation/` folder. A module that connects two layers and belongs to neither lives where it is most often used.

**Anti-example:** `utils/`, `helpers/`, `common/` — folders organized by type, not scope. Maximum friction: to understand what's inside you need to open every file.

## Consequences
- Modules "between layers" stop being a problem — they simply land by usage pattern.
- Folder structure becomes alive: if work patterns change — structure should change accordingly.
- The ban on `utils/` is derived from this principle: utils has no cognitive scope — it's a dump, not a folder.
- Applies not only to code: any organization of files, documents, notes obeys the same principle.
- Connection to → knowledge-colocation: the same principle at a higher level — knowledge units that are used together in sessions should live in the same repository, not scattered across wikis and Notions. Cognitive scope applies equally to files within a project and to knowledge about the project.
