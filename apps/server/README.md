# server

Queue configuration, Groq AI service, and optional BullMQ worker for the peblo monorepo.

## Architecture

- **`server/ai`** — `GenerateNoteAIService` (Groq). Used by the API in **sync mode** (`USE_AI_WORKER=false`).
- **`server/queue`** — BullMQ queue (`aiQueue`), Redis connection. Used only when `USE_AI_WORKER=true`.
- **`src/worker.ts`** — Background process that consumes jobs (optional).

## Default: sync AI in the API

The backend calls `server/ai` directly on `POST /notes/:id/generate-summary`. You do **not** need Redis or this worker for production deploy.

```bash
# apps/backend/.env
USE_AI_WORKER=false
GROQ_API_KEY=...
```

## Optional: background worker mode

**Prerequisites**

- Redis: `docker run -p 6379:6379 redis`
- `USE_AI_WORKER=true` in `apps/backend/.env`
- `REDIS_HOST` / `REDIS_PORT` in backend `.env`
- `DATABASE_URL` and `GROQ_API_KEY` in `apps/server/.env` (worker) and backend `.env`

**Run**

```bash
bun run dev:api    # terminal 1
bun run dev:worker # terminal 2
```

## Enqueue AI job (worker mode only)

```http
POST http://localhost:5000/notes/:noteId/generate-summary
Authorization: Bearer <access_token>
```

Poll with `GET /notes/:noteId/ai-status` until `status` is `done`.

## Install

```bash
bun install
```
