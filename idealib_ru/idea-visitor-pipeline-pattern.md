---
id: visitor-pipeline-pattern
revnum: 1
author: vagoff
home: https://github.com/vagoff/ai_cogs
tags: [dev, arch, pattern]
strength: useful
---

## Формулировка
Каждое правило анализатора — независимый visitor `(path, context) => void`. Оркестратор прогоняет всех через один traverse. Добавить правило = добавить файл.

## Обоснование
Альтернатива — один большой visitor с ветвлением по типу ноды — быстро становится нечитаемым. Pipeline сохраняет независимость правил, упрощает тестирование каждого в изоляции, и делает добавление/удаление правил безопасным.

Граница применимости: если правила сильно зависят друг от друга по состоянию — pipeline усложняется. В name-police правила независимы, общий контекст только readonly.

## Примеры
**name-police pass2:** `VISITORS = [strictConstructors, constructorNaming, assignmentFlow, callArgNaming, literalArgs, forbiddenContexts]`. Один `traverse`, один `enter`, все visitors получают каждую ноду.

**Express middleware:** то же самое — каждый middleware независим, общий объект `req/res` readonly-контракт.

## Следствия
- Порядок visitors важен только если один производит данные для другого — в name-police не важен.
- Новый visitor: один файл + одна строка в массиве. Нулевой риск сломать существующие.
- Ошибки в одном visitor не ломают остальные если catch на уровне оркестратора.
