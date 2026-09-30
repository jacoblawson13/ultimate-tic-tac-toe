import { render, screen, within } from '@testing-library/react'
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

  it('shows a winner overlay on a small board once it is won, and keeps routing correctly', async () => {
    const user = userEvent.setup()
    render(<App />)

    // A verified 7-move sequence where X wins section 1 (top row: cells 0,1,2)
    // by bouncing O through other sections via the cell-index routing rule.
    // See DECISIONS.md / gameLogic tests for the routing rule itself; this
    // test exists to prove the *UI* reacts correctly once a board is won.
    const moves: [number, number][] = [
      [1, 0], // X: section 1, cell 0
      [1, 4], // O: section 1, cell 4
      [5, 5], // X: section 5, cell 5
      [6, 0], // O: section 6, cell 0
      [1, 1], // X: section 1, cell 1
      [2, 0], // O: section 2, cell 0
      [1, 2], // X: section 1, cell 2 -> completes the top row, X wins section 1
    ]

    for (const [section, cell] of moves) {
      const group = screen.getByRole('group', { name: `Section ${section}` })
      // Query every cell (marked or not) so the array stays in a fixed
      // position order - filtering to only "Empty cell" would shift indices
      // once a section has any marks in it.
      const cells = within(group).getAllByRole('button')
      await user.click(cells[cell])
    }

    // The won board no longer shows individual cells, just the winner mark.
    const wonBoard = screen.getByRole('group', { name: 'Section 1' })
    expect(within(wonBoard).getByText('X')).toBeInTheDocument()
    expect(within(wonBoard).queryAllByRole('button')).toHaveLength(0)

    // Cell 2 was the last move played, so the next required section is 3
    // (0-indexed section 2), which is still open - not a free choice.
    expect(screen.getByText(/player o's turn — play in section 3/i)).toBeInTheDocument()
  })
})
