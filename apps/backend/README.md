# Peblo Backend API

Express API for auth, notes, tags, sharing, insights, and AI job enqueueing.

## Run

```bash
# From repo root (requires Redis + DATABASE_URL in .env)
bun run dev:api

# AI worker (separate terminal)
bun run dev:worker
```

## Environment

See `.env` — required: `DATABASE_URL`, `JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`.

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
| POST | `/notes/:id/generate-summary` | Bearer |
| GET | `/notes/:id/ai-status` | Bearer |
| POST/DELETE | `/notes/:id/share` | Bearer |
| GET | `/shared/:shareId` | No |
| GET | `/tags` | Bearer |
| GET | `/insights` | Bearer |
