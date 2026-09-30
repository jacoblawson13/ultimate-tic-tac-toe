# Frontend

React + TypeScript app that plays Ultimate Tic-Tac-Toe. All game logic
(board state, turns, move routing, win detection) lives here — see
[`../DECISIONS.md`](../DECISIONS.md) for why.

## Stack

Vite 8, React 19, TypeScript (strict), Tailwind CSS v4, ESLint 9 (flat
config) + Prettier, Vitest 4 + React Testing Library + MSW, Playwright
for end-to-end smoke tests. Package manager is pnpm, managed through
Corepack (see `packageManager` in `package.json`) — run `corepack enable`
once if `pnpm` isn't already on your machine.

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # start the dev server
pnpm build         # type-check and build for production
pnpm lint          # run ESLint
pnpm format        # run Prettier
pnpm test          # run unit/component tests once
pnpm test:cov      # run unit/component tests with coverage
pnpm test:e2e      # run Playwright end-to-end tests (starts its own dev server)
```
