# F1 Tickets App Deployment Guide

## 1. Frontend (Сайт)
Файлы для сайта (`index.html`, `App.tsx` и т.д.) компилируются в статику.
На хостинге они должны лежать в публичной папке (например, `public_html`).

## 2. Backend (Сервер)
Для работы базы данных MySQL нужны эти файлы в отдельной папке на сервере:
- `server.js`
- `package.json`
- `.env`

Запуск:
```bash
npm install
node server.js
```

## 3. Database (База данных)
Импортируйте файл `database_schema.sql` в вашу MySQL базу данных через phpMyAdmin или Workbench.
