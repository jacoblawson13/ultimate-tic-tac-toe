/** One player's mark. */
export type Player = 'X' | 'O'

/** What a single cell holds: a mark, or nothing yet. */
export type CellValue = Player | null

/** The 9 cells of one small board, read left-to-right, top-to-bottom. */
export type SmallBoardCells = CellValue[]

/** Outcome of a small board: still playable, won by a player, or tied. */
export type SmallBoardResult = Player | 'tied' | null

/**
 * Everything needed to render and update the game.
 *
 * `boards[section]` holds the 9 cells of the small board at that section.
 * Sections and cells are both numbered 0-8, left-to-right top-to-bottom,
 * the same way a phone number pad is numbered but starting at 0:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 */
export interface GameState {
  boards: SmallBoardCells[]
  boardResults: SmallBoardResult[]
  currentPlayer: Player
  /** Section the current player must play in, or null if they may play anywhere open. */
  requiredSection: number | null
  overallWinner: Player | 'tied' | null
}
