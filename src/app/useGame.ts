import { selectMove } from '@/domain/ai'
import { applyMove, createInitialBoard } from '@/domain/board'
import { checkGameOver, getWinner } from '@/domain/rules'
import { GameMode, GameState, Move } from '@/domain/types'
import { useCallback, useEffect, useState } from 'react'

const CPU_DELAY_MS = 1000

export const useGame = (initialCounts: number[] = [3, 4, 5]) => {
  const [setup, setSetup] = useState<number[]>(initialCounts)
  const [state, setState] = useState<GameState>(() => createInitialBoard(setup, 'human', 'misere'))
  const [selectedPileId, setSelectedPileId] = useState<number | null>(null)
  const [selectedCount, setSelectedCount] = useState<number>(0)

  const updateSetup = useCallback(
    (newCounts: number[]) => {
      setSetup(newCounts)
      setState(createInitialBoard(newCounts, 'human', state.mode))
    },
    [state.mode],
  )

  const setMode = useCallback(
    (mode: GameMode) => {
      setState((prev) => ({
        ...prev,
        mode,
      }))
    },
    [setState],
  )

  const resetGame = useCallback(() => {
    setState((prev) => createInitialBoard(setup, 'human', prev.mode))
    setSelectedPileId(null)
    setSelectedCount(0)
  }, [setup])

  const executeMove = useCallback((move: Move) => {
    setState((prev) => {
      const newState = applyMove(prev, move)
      const isGameOver = checkGameOver(newState)
      const winner = getWinner(newState)

      return {
        ...newState,
        isGameOver,
        winner,
        // Switch player if not over
        currentPlayer: isGameOver
          ? prev.currentPlayer
          : prev.currentPlayer === 'human'
            ? 'cpu'
            : 'human',
      }
    })
    setSelectedPileId(null)
    setSelectedCount(0)
  }, [])

  const handleObjectClick = (pileId: number, index: number) => {
    if (state.currentPlayer !== 'human' || state.isGameOver) {
      return
    }

    if (selectedPileId !== null && selectedPileId !== pileId) {
      // Switch pile
      setSelectedPileId(pileId)
      setSelectedCount(1)
    } else {
      setSelectedPileId(pileId)
      setSelectedCount(index + 1)
    }
  }

  const confirmMove = () => {
    if (selectedPileId !== null && selectedCount > 0) {
      executeMove({ pileId: selectedPileId, removeCount: selectedCount })
    }
  }

  // CPU Turn handler
  useEffect(() => {
    if (state.currentPlayer === 'cpu' && !state.isGameOver) {
      const timer = setTimeout(() => {
        const move = selectMove(state)
        executeMove(move)
      }, CPU_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [state, executeMove])

  return {
    state,
    selectedPileId,
    selectedCount,
    handleObjectClick,
    confirmMove,
    resetGame,
    setMode,
    updateSetup,
  }
}
