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
