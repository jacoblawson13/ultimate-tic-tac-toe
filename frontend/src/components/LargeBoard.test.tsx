import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createInitialGameState } from '../game/gameLogic'
import type { GameState } from '../game/types'
import { LargeBoard } from './LargeBoard'

function renderLargeBoard(state: GameState) {
  const onMove = vi.fn()
  render(<LargeBoard state={state} onMove={onMove} />)
  return { onMove }
}

function section(number: number) {
  return screen.getByRole('group', { name: `Section ${number}` })
}

describe('LargeBoard', () => {
  it('renders nine sections of nine cells each', () => {
    renderLargeBoard(createInitialGameState())

    expect(screen.getAllByRole('group')).toHaveLength(9)
    expect(screen.getAllByRole('button')).toHaveLength(81)
  })

  it('enables only the required section when one is required', () => {
    const state = createInitialGameState()
    state.requiredSection = 4
    renderLargeBoard(state)

    within(section(5))
      .getAllByRole('button')
      .forEach((cell) => expect(cell).toBeEnabled())
    for (const other of [1, 2, 3, 4, 6, 7, 8, 9]) {
      within(section(other))
        .getAllByRole('button')
        .forEach((cell) => expect(cell).toBeDisabled())
    }
  })

  it('enables every undecided section on a free choice, and none that are decided', () => {
    const state = createInitialGameState()
    state.boardResults[2] = 'O'
    renderLargeBoard(state)

    expect(within(section(3)).queryAllByRole('button')).toHaveLength(0)
    expect(within(section(3)).getByText('O')).toBeInTheDocument()
    for (const open of [1, 2, 4, 5, 6, 7, 8, 9]) {
      within(section(open))
        .getAllByRole('button')
        .forEach((cell) => expect(cell).toBeEnabled())
    }
  })

  it('disables every cell once the game has been won', () => {
    const state = createInitialGameState()
    state.overallWinner = 'X'
    renderLargeBoard(state)

    screen.getAllByRole('button').forEach((cell) => expect(cell).toBeDisabled())
  })

  it('disables every cell once the game has ended in a tie', () => {
    const state = createInitialGameState()
    state.overallWinner = 'tied'
    renderLargeBoard(state)

    screen.getAllByRole('button').forEach((cell) => expect(cell).toBeDisabled())
  })

  it('reports a click as the section and cell it happened in', async () => {
    const user = userEvent.setup()
    const { onMove } = renderLargeBoard(createInitialGameState())

    await user.click(within(section(3)).getAllByRole('button')[5])

    expect(onMove).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledWith(2, 5)
  })
})
