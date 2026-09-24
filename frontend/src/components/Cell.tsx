import type { CellValue } from '../game/types'

interface CellProps {
  value: CellValue
  onClick: () => void
  disabled: boolean
}

/** One clickable square inside a small board. */
export function Cell({ value, onClick, disabled }: CellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell marked ${value}` : 'Empty cell'}
      className="flex h-10 w-10 items-center justify-center border border-slate-200 text-lg
        font-bold enabled:hover:bg-slate-200 disabled:cursor-not-allowed"
    >
      {value}
    </button>
  )
}
