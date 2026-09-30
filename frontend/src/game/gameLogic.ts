import type { CellValue, GameState, Player, SmallBoardCells, SmallBoardResult } from './types'

/** The 8 index triples that count as a win on any 3x3 board (rows, columns, diagonals). */
const WIN_LINES: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

/** Returns the player who has three marks in a row among `cells`, or null if nobody does. */
function findLineWinner(cells: readonly (Player | null)[]): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (cells[a] !== null && cells[a] === cells[b] && cells[b] === cells[c]) {
      return cells[a]
    }
  }
  return null
}

/** Result of a single small board: a winner, a tie (full with no winner), or still active (null). */
export function getSmallBoardResult(cells: SmallBoardCells): SmallBoardResult {
  const winner = findLineWinner(cells)
  if (winner !== null) return winner

  const isFull = cells.every((cell: CellValue) => cell !== null)
  return isFull ? 'tied' : null
}

/**
 * Result of the overall game: treats each small board's result as one cell of a
 * 3x3 board. A 'tied' small board doesn't count as either player's mark, so it
 * can't complete a line, but it also can't be claimed later - the same rule
 * that applies to a small board that has already been won.
 */
export function getOverallResult(boardResults: SmallBoardResult[]): Player | 'tied' | null {
  const asPlayerCells = boardResults.map((result: SmallBoardResult) =>
    result === 'tied' ? null : result,
  )
  const winner = findLineWinner(asPlayerCells)
  if (winner !== null) return winner

  const allDecided = boardResults.every((result: SmallBoardResult) => result !== null)
  return allDecided ? 'tied' : null
}

/**
 * Which section the other player must play in next.
 *
 * The rule: the cell position chosen inside a small board points to the
 * matching section of the large board. But if that section is already won
 * or tied, there's nothing to play there, so the next player gets a free
 * choice (represented as null) among any section that isn't decided yet.
 */
export function getNextRequiredSection(
  cellIndexPlayed: number,
  boardResults: SmallBoardResult[],
): number | null {
  const targetSection = cellIndexPlayed
  const targetIsDecided = boardResults[targetSection] !== null
  return targetIsDecided ? null : targetSection
}

/** True if the given section is one the current player is allowed to play in. */
export function isSectionPlayable(
  section: number,
  requiredSection: number | null,
  boardResults: SmallBoardResult[],
): boolean {
  if (boardResults[section] !== null) return false
  if (requiredSection === null) return true
  return section === requiredSection
}

/** The human-readable status line for the current game state. */
export function getStatusMessage(state: GameState): string {
  if (state.overallWinner === 'tied') return "It's a tie!"
  if (state.overallWinner !== null) return `Player ${state.overallWinner} wins!`
  if (state.requiredSection === null) return `Player ${state.currentPlayer}'s turn — play anywhere`
  return `Player ${state.currentPlayer}'s turn — play in section ${state.requiredSection + 1}`
}

/** The starting state: nine empty boards, X goes first, any section is open. */
export function createInitialGameState(): GameState {
  return {
    boards: Array.from({ length: 9 }, () => Array<CellValue>(9).fill(null)),
    boardResults: Array<SmallBoardResult>(9).fill(null),
    currentPlayer: 'X',
    requiredSection: null,
    overallWinner: null,
  }
}

/**
 * Plays one move and returns the resulting state. Does not mutate `state`.
 * Assumes the move is legal (section playable, cell empty, game not over) -
 * callers are expected to check with `isSectionPlayable` before calling this.
 */
export function applyMove(state: GameState, section: number, cell: number): GameState {
  const boards = state.boards.map((board: SmallBoardCells, index: number) =>
    index === section ? board.map((value, i) => (i === cell ? state.currentPlayer : value)) : board,
  )

  const boardResults = state.boardResults.map((result: SmallBoardResult, index: number) =>
    index === section ? getSmallBoardResult(boards[section]) : result,
  )

  const overallWinner = getOverallResult(boardResults)
  const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X'

  return {
    boards,
    boardResults,
    currentPlayer: nextPlayer,
    requiredSection: overallWinner === null ? getNextRequiredSection(cell, boardResults) : null,
    overallWinner,
  }
}
