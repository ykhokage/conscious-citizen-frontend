# Conscious Citizen — Frontend (React + Vite + Tailwind + Leaflet)

## Запуск
1) Установить зависимости:
```bash
npm install
```

2) Создать `.env` (или скопировать `.env.example`):
```bash
cp .env.example .env
```

3) Запустить dev-сервер:
```bash
npm run dev
```

По умолчанию фронт: http://localhost:5173

## Переменные окружения
- `VITE_API_URL` — адрес backend, например `http://localhost:3000`

## Ожидаемые API endpoints на backend
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/reset-password (может быть заглушкой)
- GET /api/profile
- PUT /api/profile
- GET /api/geo/reverse?lat&lon -> {address, inServiceArea, message?}
- GET /api/geo/search?q -> {items:[{address,lat,lon}]}
- POST /api/incidents
- GET /api/incidents
- GET /api/incidents/my
- GET /api/incidents/:id
- POST /api/incidents/:id/photos (multipart field name: photo)
- GET /api/incidents/:id/document (application/pdf)
- POST /api/incidents/:id/send-email
- GET /api/admin/incidents
