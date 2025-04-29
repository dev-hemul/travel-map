# Travel map Project

Фулстек застосунок на базі MongoDB, Express.js, React, Node.js.

## 📦 Структура
- `/client` — React.js фронтенд
- `/server` — Express.js бекенд

# Гайд для роботи з єдиною гілкою `main`

Цей гайд описує стандарт роботи для команди, що використовують лише одну гілку `main` у Git.

---

## Структура гілок

- `main` — єдина продакшн-гілка
- `feature/PROJ-123-name` — вторинні гілки для розробки

---

## 1. Створення фічевої гілки

1.1. Переключитись на `main`:
```bash
git checkout main
git pull origin main
```

1.2. Створити гілку із задачею JIRA:
```bash
git checkout -b feature/PROJ-123-short-description
```

> `PROJ-123` — це ід задачі в Jira

---

## 2. Розробка і коміти

2.1. Коміти оформлювати за схемою:
```bash
PROJ-123: Короткий опис змін
```

2.2. Приклад:
```bash
git add .
git commit -m "PROJ-123: Додано форму логіну"
```

---

## 3. Push фічі та PR

3.1. Надіслати гілку на сервер:
```bash
git push -u origin feature/PROJ-123-short-description
```

3.2. Створити Pull Request з цієї гілки в `main`

> У описі PR вказуй ід Jira + що зроблено

3.3. Після ревію і approve злити PR через `Squash and merge`

---

## 4. Оновлення `main` локально

4.1. Щоб бути в синхроні:
```bash
git checkout main
git pull origin main
```

---

## 5. Видалення фіч-гілок після merge

5.1. Сервер:
- GitHub пропонує видалити після merge

5.2. Локально:
```bash
git branch -d feature/PROJ-123-short-description
```
---

## Додатково

- Кожний PR має бути прочитаний і прийнятий.
- В Jira PR автоматично прив'язується за ID задачі.
- Використовуй `git status` для перевірки стану.

---

Запитання? Звертайся до ліда проекту.



