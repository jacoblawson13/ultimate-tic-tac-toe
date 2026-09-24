# Frontend

React + TypeScript app that plays Ultimate Tic-Tac-Toe. All game logic
(board state, turns, move routing, win detection) lives here — see
[`../DECISIONS.md`](../DECISIONS.md) for why.

## Stack

Vite 8, React 19, TypeScript (strict), Tailwind CSS v4, ESLint 9 (flat
config) + Prettier, Vitest 4 + React Testing Library + MSW.

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # start the dev server
pnpm build         # type-check and build for production
pnpm lint          # run ESLint
pnpm format        # run Prettier
pnpm test          # run tests once
pnpm test:cov      # run tests with coverage
```
