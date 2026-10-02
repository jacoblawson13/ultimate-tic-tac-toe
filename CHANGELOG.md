# Changelog

## Unreleased

- Initialize repository, README, decisions log
- Add minimal FastAPI backend scaffold (health check only)
- Scaffold frontend with Vite, React, TypeScript, and Tailwind
- Add turn and board-selection logic with playable board UI (Milestone 1)
- Add Docker Compose setup and GitHub Actions CI
- Add backend httpx/ASGITransport test and frontend status-message/win-overlay tests
- Audit against the stack contract and fix real gaps: Node 24 LTS, Corepack-managed
  pnpm, Playwright e2e smoke tests, `.env.example` in both apps, `test_setup.ts`
  moved to the contract's layout path
- Second audit: TypeScript pinned to 5.x, strict Node tsconfig covering e2e, Python
  3.14 in Docker, Prettier check in CI, `{code, detail}` error envelope for API
  404/405, fix for Playwright never exiting (vite orphaned by `pnpm dev`)
- Pin the project constitution as `CLAUDE.md` (verbatim copy of the boilerplate)
- Add SmallBoard/LargeBoard component tests, full-game UI tests (win and tie),
  game-logic edge cases, and a seeded random-playout invariant test
