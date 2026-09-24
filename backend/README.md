# Backend

FastAPI service scaffolded per the project's stack contract. It currently
exposes only a health-check endpoint — it is **not** part of the gameplay
path. See [`../DECISIONS.md`](../DECISIONS.md) for why: this game's state
is entirely client-side, so there is no persisted resource for the backend
to own yet.

## Commands

```bash
uv sync                  # install dependencies
uv run uvicorn app.main:app --reload   # run the dev server
uv run pytest             # run tests
uv run ruff check .       # lint
uv run mypy .             # type-check
```
