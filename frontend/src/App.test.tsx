import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

/** Cells render in section order (0-8), 9 cells each, so this converts a
 * (section, cell) pair into the 1-based position React Testing Library
 * sees them in via getAllByRole. */
function cellIndex(section: number, cell: number): number {
  return section * 9 + cell
}

describe('App', () => {
  it('starts with player X and every section playable', () => {
    render(<App />)

    expect(screen.getByText(/player x's turn — play anywhere/i)).toBeInTheDocument()
    const cells = screen.getAllByRole('button', { name: 'Empty cell' })
    expect(cells).toHaveLength(81)
    cells.forEach((cell) => expect(cell).toBeEnabled())
  })

  it('routes the next player to the matching section after a move', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Play the top-left cell (index 0) of section 2 (top-right section).
    const cells = screen.getAllByRole('button', { name: 'Empty cell' })
    await user.click(cells[cellIndex(2, 0)])

    expect(screen.getByText(/player o's turn — play in section 1/i)).toBeInTheDocument()
  })

  it('prevents clicking a cell that is already marked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cells = screen.getAllByRole('button', { name: 'Empty cell' })
    const target = cells[cellIndex(2, 0)]
    await user.click(target)

    expect(screen.getByRole('button', { name: 'Cell marked X' })).toBeDisabled()
    // Still O's turn - clicking the occupied cell again must not be possible
    // (it's no longer queryable as an empty cell at all).
    expect(screen.queryAllByRole('button', { name: 'Empty cell' })).toHaveLength(80)
  })

  it('resets the board when New Game is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cells = screen.getAllByRole('button', { name: 'Empty cell' })
    await user.click(cells[cellIndex(2, 0)])
    await user.click(screen.getByRole('button', { name: 'New Game' }))

    expect(screen.getByText(/player x's turn — play anywhere/i)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Empty cell' })).toHaveLength(81)
  })
})
