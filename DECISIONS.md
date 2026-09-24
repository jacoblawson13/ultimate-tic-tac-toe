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
moment a real resource needs them.

## 2026-09-24 — Skipping React Router and TanStack Query for now

**Decision:** The frontend does not include React Router or TanStack Query,
despite both being listed in the stack contract.

**Why:** There is exactly one screen (the game board) and no server state
to manage — TanStack Query's own stated purpose in the contract is owning
*server* state, and this app's state is entirely local UI state, which the
contract says belongs in `useState`. Adding a router with one route, or a
query client with no queries, would be scaffolding with nothing to do.
