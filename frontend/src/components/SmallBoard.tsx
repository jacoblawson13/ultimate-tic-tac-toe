import type { SmallBoardCells, SmallBoardResult } from '../game/types'
import { Cell } from './Cell'

interface SmallBoardProps {
  section: number
  cells: SmallBoardCells
  result: SmallBoardResult
  isPlayable: boolean
  onCellClick: (cellIndex: number) => void
}

/** One of the nine 3x3 boards that make up the large board. */
export function SmallBoard({ section, cells, result, isPlayable, onCellClick }: SmallBoardProps) {
  return (
    <div
      role="group"
      aria-label={`Section ${section + 1}`}
      className={`grid grid-cols-3 gap-1 border-2 p-1 transition-colors ${
        isPlayable ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
      }`}
    >
      {result !== null ? (
        <div
          className="col-span-3 row-span-3 flex h-[126px] w-[126px] items-center justify-center
            text-4xl font-bold text-slate-400"
        >
          {result === 'tied' ? '—' : result}
        </div>
      ) : (
        cells.map((value, cellIndex) => (
          <Cell
            key={cellIndex}
            value={value}
            disabled={!isPlayable}
            onClick={() => onCellClick(cellIndex)}
          />
        ))
      )}
    </div>
  )
}
