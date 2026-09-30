import { expect, test } from '@playwright/test'

test('a player can make a move and the game routes to the next section', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Ultimate Tic-Tac-Toe' })).toBeVisible()
  await expect(page.getByText("Player X's turn — play anywhere")).toBeVisible()

  // Play the top-left cell (index 0) of section 3 (top-right section).
  const section3 = page.getByRole('group', { name: 'Section 3' })
  await section3.getByRole('button').first().click()

  await expect(page.getByText("Player O's turn — play in section 1")).toBeVisible()
  await expect(section3.getByRole('button', { name: 'Cell marked X' })).toBeVisible()
})

test('New Game resets the board to its starting state', async ({ page }) => {
  await page.goto('/')

  const section3 = page.getByRole('group', { name: 'Section 3' })
  await section3.getByRole('button').first().click()

  await page.getByRole('button', { name: 'New Game' }).click()

  await expect(page.getByText("Player X's turn — play anywhere")).toBeVisible()
  await expect(page.getByRole('button', { name: 'Empty cell' })).toHaveCount(81)
})
