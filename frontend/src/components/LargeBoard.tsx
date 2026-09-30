import { isSectionPlayable } from '../game/gameLogic'
import type { GameState } from '../game/types'
import { SmallBoard } from './SmallBoard'

interface LargeBoardProps {
  state: GameState
  onMove: (section: number, cell: number) => void
}

/** The full 3x3 grid of small boards. */
export function LargeBoard({ state, onMove }: LargeBoardProps) {
  const gameOver = state.overallWinner !== null

  return (
    <div className="grid grid-cols-3 gap-2">
      {state.boards.map((cells, section) => (
        <SmallBoard
          key={section}
          section={section}
          cells={cells}
          result={state.boardResults[section]}
          isPlayable={
            !gameOver && isSectionPlayable(section, state.requiredSection, state.boardResults)
          }
          onCellClick={(cell) => onMove(section, cell)}
        />
      ))}
    </div>
  )
}
