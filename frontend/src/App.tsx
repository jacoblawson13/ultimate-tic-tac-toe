import { useState } from 'react'
import { LargeBoard } from './components/LargeBoard'
import {
  applyMove,
  createInitialGameState,
  getStatusMessage,
  isSectionPlayable,
} from './game/gameLogic'

function App() {
  const [state, setState] = useState(createInitialGameState)

  function handleMove(section: number, cell: number) {
    if (state.overallWinner !== null) return
    if (!isSectionPlayable(section, state.requiredSection, state.boardResults)) return
    if (state.boards[section][cell] !== null) return

    setState(applyMove(state, section, cell))
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">Ultimate Tic-Tac-Toe</h1>
      <p className="text-lg">{getStatusMessage(state)}</p>
      <LargeBoard state={state} onMove={handleMove} />
      <button
        type="button"
        onClick={() => setState(createInitialGameState())}
        className="rounded border border-slate-400 px-4 py-2 hover:bg-slate-100"
      >
        New Game
      </button>
    </main>
  )
}

export default App
