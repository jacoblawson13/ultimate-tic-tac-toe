# Ultimate Tic-Tac-Toe

A web app implementation of Ultimate Tic-Tac-Toe for COSC410.

## What is Ultimate Tic-Tac-Toe?

The board is a 3x3 grid of small 3x3 Tic-Tac-Toe boards. Players alternate
placing X and O. The square a player picks inside a small board decides
which small board (section) the other player must play in next. If that
required section is already won or full, the next player may play in any
open section. The overall game is won by winning three small boards in a
row, column, or diagonal.

See [Documentation/](Documentation/) for the full assignment write-up.

## Project layout

- `backend/` — FastAPI service (see `backend/README.md` for status/scope)
- `frontend/` — React + TypeScript app that plays the game (game logic lives
  here; see `frontend/README.md`)

## Running the project

**With Docker (closest to production):**

```bash
docker compose up --build
```

Then open <http://localhost:8080> to play. The backend health check is at
<http://localhost:8000/api/v1/health>.

**For local development (faster iteration, hot reload):**

```bash
# backend
cd backend && uv run uvicorn app.main:app --reload

# frontend, in another terminal
cd frontend && pnpm install && pnpm dev
```

See `backend/README.md` and `frontend/README.md` for the full command list
(tests, lint, type-check) for each side.
