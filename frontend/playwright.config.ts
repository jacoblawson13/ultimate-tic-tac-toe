import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  webServer: {
    // Run vite directly, not via `pnpm dev`: pnpm puts scripts in their own
    // process group, so Playwright can't stop vite afterwards and the test
    // run never exits.
    command: './node_modules/.bin/vite --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173',
  },
})
