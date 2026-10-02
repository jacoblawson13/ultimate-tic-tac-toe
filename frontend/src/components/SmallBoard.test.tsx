import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { SmallBoardCells } from '../game/types'
import { SmallBoard } from './SmallBoard'

const emptyCells: SmallBoardCells = Array(9).fill(null)

function renderBoard(overrides: Partial<Parameters<typeof SmallBoard>[0]> = {}) {
  const onCellClick = vi.fn()
  render(
    <SmallBoard
      section={0}
      cells={emptyCells}
      result={null}
      isPlayable={true}
      onCellClick={onCellClick}
      {...overrides}
    />,
  )
  return { onCellClick }
}

describe('SmallBoard', () => {
  it('is labelled with a 1-based section number so players can tell boards apart', () => {
    renderBoard({ section: 4 })

    expect(screen.getByRole('group', { name: 'Section 5' })).toBeInTheDocument()
  })

  it('renders nine cells while the board is still undecided', () => {
    renderBoard()

    expect(screen.getAllByRole('button')).toHaveLength(9)
  })

  it('reports which cell was clicked by its position within the board', async () => {
    const user = userEvent.setup()
    const { onCellClick } = renderBoard()

    await user.click(screen.getAllByRole('button')[6])

    expect(onCellClick).toHaveBeenCalledTimes(1)
    expect(onCellClick).toHaveBeenCalledWith(6)
  })

  it('disables every cell when the board is not playable', async () => {
    const user = userEvent.setup()
    const { onCellClick } = renderBoard({ isPlayable: false })

    screen.getAllByRole('button').forEach((cell) => expect(cell).toBeDisabled())
    await user.click(screen.getAllByRole('button')[0])
    expect(onCellClick).not.toHaveBeenCalled()
  })

  it('keeps already-marked cells disabled even on a playable board', () => {
    const cells: SmallBoardCells = [...emptyCells]
    cells[0] = 'X'
    renderBoard({ cells })

    expect(screen.getByRole('button', { name: 'Cell marked X' })).toBeDisabled()
    expect(screen.getAllByRole('button', { name: 'Empty cell' })).toHaveLength(8)
    screen.getAllByRole('button', { name: 'Empty cell' }).forEach((cell) => {
      expect(cell).toBeEnabled()
    })
  })

  it.each(['X', 'O'] as const)(
    'replaces the cells with a large %s once that player wins',
    (winner) => {
      renderBoard({ result: winner })

      expect(screen.getByText(winner)).toBeInTheDocument()
      expect(screen.queryAllByRole('button')).toHaveLength(0)
    },
  )

  it('replaces the cells with a dash when the board is tied', () => {
    renderBoard({ result: 'tied' })

    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
