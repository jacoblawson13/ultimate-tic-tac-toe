import { describe, expect, it } from 'vitest'
import {
  applyMove,
  createInitialGameState,
  getNextRequiredSection,
  getOverallResult,
  getSmallBoardResult,
  getStatusMessage,
  isSectionPlayable,
} from './gameLogic'
import type { CellValue, GameState, SmallBoardResult } from './types'

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

  it('does not declare an overall winner when a move leaves its small board undecided', () => {
    // X already owns sections 0 and 1, so winning section 2 would win the game -
    // but a single opening mark in section 2 doesn't win it.
    const state = createInitialGameState()
    state.boardResults[0] = 'X'
    state.boardResults[1] = 'X'
    state.requiredSection = 2

    const next = applyMove(state, 2, 4)

    expect(next.boardResults[2]).toBeNull()
    expect(next.overallWinner).toBeNull()
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

  it('marks a small board as tied when its last cell is filled without completing a line', () => {
    const state = createInitialGameState()
    // X O X / X O O / O X _ - X fills the last cell (8) and nobody has three in a row.
    state.boards[4] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null]
    state.requiredSection = 4

    const next = applyMove(state, 4, 8)

    expect(next.boardResults[4]).toBe('tied')
    expect(next.overallWinner).toBeNull()
  })

  it('counts a line completed by the very last cell as a win, not a tie', () => {
    const state = createInitialGameState()
    // X X _ / O O X / X O O - X fills cell 2, completing the top row on a full board.
    state.boards[4] = ['X', 'X', null, 'O', 'O', 'X', 'X', 'O', 'O']
    state.requiredSection = 4

    const next = applyMove(state, 4, 2)

    expect(next.boardResults[4]).toBe('X')
  })

  it('gives a free choice when the played cell points at an already-decided section', () => {
    const state = createInitialGameState()
    state.boardResults[2] = 'O'

    const next = applyMove(state, 0, 2) // cell 2 points at section 2, which O already won

    expect(next.requiredSection).toBeNull()
    expect(next.overallWinner).toBeNull()
  })

  it('can send the next player back into the same section that was just played', () => {
    const next = applyMove(createInitialGameState(), 3, 3) // cell 3 points at section 3

    expect(next.requiredSection).toBe(3)
  })

  it.each([
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ])('declares X the overall winner after winning sections %i, %i and %i', (a, b, c) => {
    const state = createInitialGameState()
    state.boardResults[a] = 'X'
    state.boardResults[b] = 'X'
    state.boards[c] = ['X', 'X', null, null, null, null, null, null, null]
    state.requiredSection = c

    const next = applyMove(state, c, 2)

    expect(next.overallWinner).toBe('X')
  })

  it('declares O the overall winner when O completes a line of small boards', () => {
    const state = createInitialGameState()
    state.currentPlayer = 'O'
    state.boardResults[0] = 'O'
    state.boardResults[1] = 'O'
    state.boards[2] = ['O', 'O', null, null, null, null, null, null, null]
    state.requiredSection = 2

    const next = applyMove(state, 2, 2)

    expect(next.overallWinner).toBe('O')
  })

  it('declares a tie when every small board is decided and no line of boards is complete', () => {
    const state = createInitialGameState()
    // X O X / X O O / O X _ across the large board; O is about to take the last section.
    state.boardResults = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null]
    state.currentPlayer = 'O'
    state.boards[8] = ['O', 'O', null, null, null, null, null, null, null]
    state.requiredSection = 8

    const next = applyMove(state, 8, 2)

    expect(next.boardResults[8]).toBe('O')
    expect(next.overallWinner).toBe('tied')
    expect(next.requiredSection).toBeNull()
  })
})

describe('whole-game invariants', () => {
  // Small seeded random generator so a failure is reproducible.
  function makeRandom(seed: number): () => number {
    let t = seed
    return () => {
      t = (t + 0x6d2b79f5) | 0
      let r = Math.imul(t ^ (t >>> 15), 1 | t)
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296
    }
  }

  function legalMoves(state: GameState): [number, number][] {
    const moves: [number, number][] = []
    for (let section = 0; section < 9; section++) {
      if (!isSectionPlayable(section, state.requiredSection, state.boardResults)) continue
      for (let cell = 0; cell < 9; cell++) {
        if (state.boards[section][cell] === null) moves.push([section, cell])
      }
    }
    return moves
  }

  it('holds for 300 complete random games', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const random = makeRandom(seed)
      let state = createInitialGameState()
      let movesPlayed = 0

      while (state.overallWinner === null) {
        const moves = legalMoves(state)
        // A running game must never be stuck without a legal move.
        expect(moves.length, `seed ${seed}, move ${movesPlayed}`).toBeGreaterThan(0)
        // The required section, when there is one, is never already decided.
        if (state.requiredSection !== null) {
          expect(state.boardResults[state.requiredSection]).toBeNull()
        }

        const [section, cell] = moves[Math.floor(random() * moves.length)]
        const mover = state.currentPlayer
        state = applyMove(state, section, cell)
        movesPlayed++

        expect(state.boards[section][cell]).toBe(mover)
        expect(state.currentPlayer).toBe(mover === 'X' ? 'O' : 'X')
        // Every stored small-board result matches what its cells actually say.
        state.boards.forEach((cells, index) => {
          expect(state.boardResults[index]).toBe(getSmallBoardResult(cells))
        })
      }

      expect(movesPlayed).toBeLessThanOrEqual(81)
      expect(state.overallWinner).toBe(getOverallResult(state.boardResults))
      expect(state.requiredSection).toBeNull()
    }
  })
})

describe('getStatusMessage', () => {
  it('announces free choice when no section is required', () => {
    const state = createInitialGameState()
    expect(getStatusMessage(state)).toBe("Player X's turn — play anywhere")
  })

  it('announces the required section, using 1-based numbering for the player', () => {
    const state = createInitialGameState()
    state.requiredSection = 4
    expect(getStatusMessage(state)).toBe("Player X's turn — play in section 5")
  })

  it('announces the other player after a turn switch', () => {
    const state = createInitialGameState()
    state.currentPlayer = 'O'
    expect(getStatusMessage(state)).toBe("Player O's turn — play anywhere")
  })

  it('announces a winner once the game is decided', () => {
    const state = createInitialGameState()
    state.overallWinner = 'X'
    expect(getStatusMessage(state)).toBe('Player X wins!')
  })

  it('announces a tie once the game is decided with no winner', () => {
    const state = createInitialGameState()
    state.overallWinner = 'tied'
    expect(getStatusMessage(state)).toBe("It's a tie!")
  })
})
