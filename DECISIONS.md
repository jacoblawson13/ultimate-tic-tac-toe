# Decisions

Every choice that had a real alternative, and why it went the way it did.

## 2026-09-24 — Follow the full stack contract from Prompt_Boilerplate.txt

**Decision:** Build this project using the FastAPI + React/TypeScript stack
and project layout described in `Documentation/Prompt_Boilerplate.txt`,
even though the assignment doc itself doesn't name a required stack.

**Alternative considered:** Plain HTML/CSS/JS, no backend at all — the
assignment only requires a playable client-side game.

**Why:** Explicit instruction from the project owner (the student) to follow
the boilerplate file as written.

## 2026-09-24 — Game logic lives entirely in the frontend

**Decision:** All game state (board, turns, required-section routing, win
detection) lives in React state on the client. The backend is scaffolded to
match the required project layout but is not part of the gameplay path.

**Alternative considered:** Backend owns game state; frontend calls a REST
API for every move (`POST /api/v1/games/{id}/moves`), backed by SQLAlchemy.

**Why:** The assignment has no requirement for persistence, multiplayer, or
shared state across sessions — it's two players sharing one screen. Routing
every move through an HTTP round trip would add real complexity (API
schemas, a database table, network error handling) with no gameplay
benefit. Explicit instruction from the project owner to keep game logic
client-only.

## 2026-09-24 — No models/schemas/repositories/services folders yet

**Decision:** The backend currently contains only `core/`, `api/v1/`, and
`main.py`, plus tests. The `models/`, `schemas/`, `repositories/`, and
`services/` folders from the standard layout are not created.

**Why:** These folders exist to hold code for persisted resources. There
are currently no persisted resources in this app (see decision above). An
empty folder with no code in it doesn't help anyone; they'll be added the
moment a real resource needs them. `alembic.ini` and `alembic/versions/`
are skipped for the same reason — Alembic generates migrations from
SQLAlchemy model metadata, and there are no models to generate from yet;
an Alembic setup with no models would be inert scaffolding, not a real
migration story.

## 2026-09-24 — Skipping React Router and TanStack Query for now

**Decision:** The frontend does not include React Router or TanStack Query,
despite both being listed in the stack contract.

**Why:** There is exactly one screen (the game board) and no server state
to manage — TanStack Query's own stated purpose in the contract is owning
*server* state, and this app's state is entirely local UI state, which the
contract says belongs in `useState`. Adding a router with one route, or a
query client with no queries, would be scaffolding with nothing to do.
`src/pages/` is skipped for the same reason (one screen, no routes to
separate into pages), and `src/api/` (generated types + typed client) is
skipped because the frontend makes no API calls at all — there is no
backend endpoint to generate a client for.

## 2026-09-24 — No named volume for SQLite in docker-compose.yml

**Decision:** `docker-compose.yml` does not mount a named volume for a
SQLite database file. The PostgreSQL `db` service from the standard layout
is included but commented out, per the contract.

**Why:** The backend has no database engine configured at all right now
(see the "game logic lives entirely in the frontend" decision above) — a
volume for a file that's never created would just be dead configuration.
It can be added the moment a real persisted resource shows up.

## 2026-09-30 — MSW installed but unused

**Decision:** MSW (Mock Service Worker) stays in the frontend's dev
dependencies per the contract's test stack, but no handlers exist and it is
not wired into any test.

**Alternative considered:** Remove it entirely, since dead dependencies are
usually worth cutting.

**Why:** The contract lists it specifically for mocking API calls in
tests, and the frontend makes no API calls (see the "no src/api" decision
above) — there is nothing for it to mock. Removing it would mean
re-adding it later under time pressure the moment an API call is
introduced; keeping it costs nothing (it's dev-only, not shipped) and this
note stands in for what would otherwise be a silent, undocumented gap.

## 2026-09-30 — Fixed real stack-contract gaps found during audit

**Decision:** A full audit against the contract surfaced several
unintentional deviations, now fixed: switched from Node 26 to Node 24 LTS,
switched pnpm from an `npm install -g` install to Corepack-managed (with
`packageManager` pinned in `package.json`), added Playwright with a
happy-path smoke test in `frontend/e2e/` plus a CI job for it, moved the
Vitest setup file to `frontend/test_setup.ts` to match the contract's
layout, and added `.env.example` to both apps.

**Why:** These weren't judgment calls — the contract is explicit about
Node 24, Corepack, Playwright, and the layout, and nothing here justified
deviating. They were gaps from earlier work, caught by request during a
full compliance audit, and corrected rather than left undocumented.
