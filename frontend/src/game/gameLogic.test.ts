import { describe, expect, it } from 'vitest'
import {
  applyMove,
  createInitialGameState,
  getNextRequiredSection,
  getOverallResult,
  getSmallBoardResult,
  isSectionPlayable,
} from './gameLogic'
import type { CellValue, SmallBoardResult } from './types'

function cells(...values: CellValue[]): CellValue[] {
  const board = Array<CellValue>(9).fill(null)
  values.forEach((value, i) => (board[i] = value))
  return board
}

describe('getSmallBoardResult', () => {
  it('is null while the board still has empty cells and no line is complete', () => {
    expect(getSmallBoardResult(cells('X', 'O'))).toBeNull()
  })

  it('returns the winner when three marks line up in a row', () => {
    expect(getSmallBoardResult(cells('X', 'X', 'X'))).toBe('X')
  })

  it('returns the winner when three marks line up in a column', () => {
    expect(getSmallBoardResult(cells('O', null, null, 'O', null, null, 'O'))).toBe('O')
  })

  it('returns the winner when three marks line up on a diagonal', () => {
    expect(getSmallBoardResult(cells('X', null, null, null, 'X', null, null, null, 'X'))).toBe('X')
  })

  it('returns tied when the board is full with no line completed', () => {
    // X O X / X O O / O X X - full board, no three-in-a-row for either player
    expect(getSmallBoardResult(cells('X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'))).toBe('tied')
  })
})

describe('getOverallResult', () => {
  it('is null when no line of small-board results is complete', () => {
    const results: SmallBoardResult[] = [null, null, null, null, null, null, null, null, null]
    expect(getOverallResult(results)).toBeNull()
  })

  it('returns the winner when a player has won three boards in a row', () => {
    const results: SmallBoardResult[] = ['X', 'X', 'X', null, null, null, null, null, null]
    expect(getOverallResult(results)).toBe('X')
  })

  it('does not let a tied board complete a line', () => {
    const results: SmallBoardResult[] = ['X', 'X', 'tied', null, null, null, null, null, null]
    expect(getOverallResult(results)).toBeNull()
  })

  it('returns tied once every board is decided with no overall winner', () => {
    const results: SmallBoardResult[] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
    expect(getOverallResult(results)).toBe('tied')
  })
})

describe('getNextRequiredSection', () => {
  it('points to the section matching the cell that was played', () => {
    const boardResults: SmallBoardResult[] = Array(9).fill(null)
    expect(getNextRequiredSection(4, boardResults)).toBe(4)
  })

  it('gives a free choice (null) when the required section is already decided', () => {
    const boardResults: SmallBoardResult[] = Array(9).fill(null)
    boardResults[4] = 'X'
    expect(getNextRequiredSection(4, boardResults)).toBeNull()
  })
})

describe('isSectionPlayable', () => {
  const openResults: SmallBoardResult[] = Array(9).fill(null)

  it('permits the required section when it is still open', () => {
    expect(isSectionPlayable(3, 3, openResults)).toBe(true)
  })

  it('refuses a section that is not the required one', () => {
    expect(isSectionPlayable(5, 3, openResults)).toBe(false)
  })

  it('refuses a section that has already been decided, even during free choice', () => {
    const results = [...openResults]
    results[3] = 'X'
    expect(isSectionPlayable(3, null, results)).toBe(false)
  })

  it('permits any undecided section during free choice', () => {
    expect(isSectionPlayable(7, null, openResults)).toBe(true)
  })
})

describe('applyMove', () => {
  it('places the current player mark and switches turns', () => {
    const state = createInitialGameState()
    const next = applyMove(state, 4, 0)

    expect(next.boards[4][0]).toBe('X')
    expect(next.currentPlayer).toBe('O')
  })

  it('routes the next player to the section matching the played cell', () => {
    const state = createInitialGameState()
    const next = applyMove(state, 4, 2)

    expect(next.requiredSection).toBe(2)
  })

  it('does not mutate the state it was given', () => {
    const state = createInitialGameState()
    applyMove(state, 4, 0)

    expect(state.boards[4][0]).toBeNull()
    expect(state.currentPlayer).toBe('X')
  })

  it('sets the overall winner once the final move completes a line of small boards', () => {
    // Build a state where X has already won sections 0 and 1, and section 2
    // is empty and open, with X about to play the winning line 0-1-2 in it.
    const state = createInitialGameState()
    state.boardResults[0] = 'X'
    state.boardResults[1] = 'X'
    state.requiredSection = 2

    const next = applyMove(state, 2, 4)

    expect(next.boardResults[2]).toBeNull() // one mark isn't enough to win section 2 itself
    expect(next.overallWinner).toBeNull() // so the overall game isn't won by this single move either
  })

  it('detects the overall winner once a full line of small boards is won', () => {
    const state = createInitialGameState()
    state.boardResults[0] = 'X'
    state.boardResults[1] = 'X'
    // Section 2: X already has two in a row (cells 0, 1); playing cell 2 wins it.
    state.boards[2] = ['X', 'X', null, null, null, null, null, null, null]
    state.requiredSection = 2

    const next = applyMove(state, 2, 2)

    expect(next.boardResults[2]).toBe('X')
    expect(next.overallWinner).toBe('X')
  })

  it('gives a free choice once the game is won, since there is nothing left to require', () => {
    const state = createInitialGameState()
    state.boardResults[0] = 'X'
    state.boardResults[1] = 'X'
    state.boards[2] = ['X', 'X', null, null, null, null, null, null, null]
    state.requiredSection = 2

    const next = applyMove(state, 2, 2)

    expect(next.requiredSection).toBeNull()
  })
})
