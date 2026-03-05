---
id: claude-github-workflow
revnum: 1
author: vagoff
home: https://github.com/vagoff/name-police
tags: [ai-dev, dev, pattern]
strength: useful
---

## Формулировка
Claude может напрямую пушить в GitHub через HTTPS-токен в URL репозитория, используя git в bash_tool — без коннекторов, без промежуточных файлов, без участия пользователя в каждом коммите.

## Обоснование
Claude имеет доступ к bash с git. GitHub принимает аутентификацию через токен встроенный в remote URL. Это даёт полноценный git workflow прямо из сессии: commit, push, история, ветки. Коннекторы (MCP GitHub) часто недоступны или требуют отдельной настройки — этот способ работает всегда когда есть токен.

Граница применимости: токен в URL остаётся в истории git remote — для приватных репо с чувствительным кодом лучше использовать другой механизм. Для публичных репо и рабочих проектов — нормально. Токен живёт в памяти сессии Claude, не персистируется между сессиями.

## Примеры
**Установка remote с токеном:**
```bash
git remote add origin https://TOKEN@github.com/user/repo.git
# или если remote уже есть:
git remote set-url origin https://TOKEN@github.com/user/repo.git
```

**Типичный workflow в сессии:**
```bash
# Инициализация (один раз)
cd /home/claude/project
git init
git config user.email "deploy@session"
git config user.name "Claude"
git remote add origin https://TOKEN@github.com/user/repo.git
git branch -m main

# Работа
git add .
git commit -m "feat: description"
git push -u origin main

# Последующие пуши
git add changed-file.js
git commit -m "fix: description"
git push
```

**Если репо не пустой (GitHub создал README):**
```bash
git push --force  # или git pull --rebase затем push
```

## Следствия
- Claude становится полноценным участником git workflow — не просто генератором файлов.
- Пользователь даёт токен один раз в начале сессии — дальше все коммиты и пуши Claude делает сам.
- Между сессиями токен теряется — в новой сессии нужно дать снова (или держать в конфиге проекта).
- Токен нужно создавать с правами Contents: Read and Write на конкретный репозиторий (fine-grained token в GitHub Settings → Developer settings → Personal access tokens).
- После сессии токен желательно отозвать если использовался одноразово.
