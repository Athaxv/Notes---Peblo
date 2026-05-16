# Peblo Backend API

Express API for auth, notes, tags, sharing, insights, and AI summaries.

## Run (sync AI — default, no Redis/worker)

```bash
# From repo root
bun run dev:api
```

Set in `apps/backend/.env`:

```env
DATABASE_URL=...
JWT_SECRET=...
GROQ_API_KEY=...
FRONTEND_URL=http://localhost:3000
USE_AI_WORKER=false
```

## Run (optional background worker)

```bash
USE_AI_WORKER=true
REDIS_HOST=localhost
REDIS_PORT=6379
```

```bash
docker run -p 6379:6379 redis
bun run dev:api    # terminal 1
bun run dev:worker # terminal 2
```

## Environment

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Neon / Postgres |
| `JWT_SECRET` | Yes | |
| `GROQ_API_KEY` | Yes (sync mode) | Groq API key |
| `FRONTEND_URL` | No | CORS origin |
| `USE_AI_WORKER` | No | `true` = BullMQ + Redis; default sync |
| `REDIS_HOST` / `REDIS_PORT` | Worker only | When `USE_AI_WORKER=true` |

## Deploy on Render (API only)

```env
USE_AI_WORKER=false
GROQ_API_KEY=...
```

No Redis or background worker service required for AI.

## API Overview

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| POST | `/auth/refresh` | Cookie |
| POST | `/auth/logout` | Cookie |
| GET | `/notes?q&tag&archived&sort&order` | Bearer |
| POST | `/notes` | Bearer |
| GET/PATCH/DELETE | `/notes/:id` | Bearer |
| POST | `/notes/:id/generate-summary` | Bearer — returns `{ status, note }` |
| GET | `/notes/:id/ai-status` | Bearer |
| POST/DELETE | `/notes/:id/share` | Bearer |
| GET | `/shared/:shareId` | No |
| GET | `/tags` | Bearer |
| GET | `/insights` | Bearer |
