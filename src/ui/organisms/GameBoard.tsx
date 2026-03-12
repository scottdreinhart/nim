import type { Difficulty, GameState, LastMove, Opponent } from '@/domain/types'
import { PileToggle } from '@/ui/molecules'
import { cx } from '@/ui/utils/cssModules'
import { useCallback, useEffect } from 'react'

import styles from './GameBoard.module.css'

interface GameBoardProps {
  state: GameState
  selectedPileId: number | null
  selectedCount: number
  difficulty: Difficulty
  opponent: Opponent
  cpuThinking: boolean
  isMobile: boolean
  onObjectClick: (pileId: number, index: number) => void
  onConfirm: () => void
  onReset: () => void
  onBack: () => void
  onSettings: () => void
}

const difficultyClass: Record<Difficulty, string> = {
  easy: styles.badgeEasy,
  medium: styles.badgeMedium,
  hard: styles.badgeHard,
}

function getPlayerLabel(opponent: Opponent, currentPlayer: 'human' | 'cpu'): string {
  if (opponent === 'local') {
    return currentPlayer === 'human' ? 'PLAYER 1' : 'PLAYER 2'
  }
  return currentPlayer === 'human' ? 'YOUR TURN' : 'CPU THINKING'
}

function getWinnerLabel(
  opponent: Opponent,
  winner: 'human' | 'cpu' | null,
  lastMove: LastMove | null,
): string {
  if (!winner) {
    return ''
  }
  if (opponent === 'local') {
    return lastMove?.player === 'human' ? 'PLAYER 1 WINS!' : 'PLAYER 2 WINS!'
  }
  return winner === 'human' ? 'YOU WON!' : 'YOU LOST'
}

export function GameBoard({
  state,
  selectedPileId,
  selectedCount,
  difficulty,
  opponent,
  cpuThinking,
  isMobile,
  onObjectClick,
  onConfirm,
  onReset,
  onBack,
  onSettings,
}: GameBoardProps) {
  const canConfirm = selectedPileId !== null && selectedCount > 0
  const isHumanTurn = state.currentPlayer === 'human'
  const canInteract = opponent === 'local' || isHumanTurn
  const playerWon = opponent === 'local' ? true : state.winner === 'human'

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.isGameOver || !canInteract) {
        return
      }
      const nonEmpty = state.piles.filter((p) => p.count > 0)
      if (nonEmpty.length === 0) {
        return
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const currentIdx = nonEmpty.findIndex((p) => p.id === selectedPileId)
        let nextIdx: number
        if (e.key === 'ArrowRight') {
          nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % nonEmpty.length
        } else {
          nextIdx = currentIdx <= 0 ? nonEmpty.length - 1 : currentIdx - 1
        }
        const pile = nonEmpty[nextIdx]
        onObjectClick(pile.id, 0)
      } else if (e.key === 'ArrowUp' && selectedPileId !== null) {
        e.preventDefault()
        const pile = state.piles.find((p) => p.id === selectedPileId)
        if (pile && selectedCount < pile.count) {
          onObjectClick(selectedPileId, selectedCount)
        }
      } else if (e.key === 'ArrowDown' && selectedPileId !== null) {
        e.preventDefault()
        if (selectedCount > 1) {
          onObjectClick(selectedPileId, selectedCount - 2)
        }
      } else if (e.key === 'Enter' && canConfirm) {
        e.preventDefault()
        onConfirm()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
      }
    },
    [
      state,
      selectedPileId,
      selectedCount,
      canInteract,
      canConfirm,
      onObjectClick,
      onConfirm,
      onBack,
    ],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className={cx(styles.root, isMobile && styles.rootMobile)}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.closeBtn} onClick={onBack} aria-label="Back to menu">
          ✕
        </button>
        <h2 className={styles.heading}>Nim</h2>
        <button className={styles.gearBtn} onClick={onSettings} aria-label="Settings">
          ⚙
        </button>
      </div>

      {/* Info Badges */}
      <div className={styles.infoBadges}>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>Mode: </span>
          <span className={state.mode === 'normal' ? styles.badgeNormal : styles.badgeMisere}>
            {state.mode === 'normal' ? 'Normal' : 'Misère'}
          </span>
        </div>
        {opponent === 'cpu' && (
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>AI: </span>
            <span className={difficultyClass[difficulty]}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        )}
        {opponent === 'local' && (
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>Mode: </span>
            <span className={styles.badgeNormal}>2 Player</span>
          </div>
        )}
      </div>

      {/* Piles */}
      <div className={styles.pilesArea}>
        {state.piles.map((pile) => (
          <div
            key={pile.id}
            className={cx(
              styles.pileColumn,
              state.lastMove?.pileId === pile.id && styles.lastMovePile,
            )}
          >
            <div className={styles.pileWrapper}>
              <PileToggle
                id={pile.id}
                count={pile.count}
                selectedCount={selectedPileId === pile.id ? selectedCount : 0}
                onObjectClick={onObjectClick}
                disabled={!canInteract || state.isGameOver}
              />
            </div>
            {canInteract && !state.isGameOver && pile.count > 0 && (
              <button
                className={styles.takeAllBtn}
                onClick={() => {
                  onObjectClick(pile.id, pile.count - 1)
                  onConfirm()
                }}
                aria-label={`Take all from pile ${pile.id + 1}`}
              >
                −
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className={styles.bottomSection}>
        {state.isGameOver ? (
          <div className={styles.winOverlay}>
            <h2
              className={cx(styles.winTitle, playerWon ? styles.winTitleWin : styles.winTitleLose)}
            >
              {getWinnerLabel(opponent, state.winner, state.lastMove)}
            </h2>
            <button className={styles.playAgainBtn} onClick={onReset}>
              PLAY AGAIN
            </button>
          </div>
        ) : (
          <div className={styles.turnArea}>
            <div
              className={cx(
                styles.turnLabel,
                canInteract ? styles.turnLabelActive : styles.turnLabelInactive,
              )}
            >
              {cpuThinking ? (
                <span>
                  CPU THINKING{' '}
                  <span className={styles.thinkingDots}>
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                  </span>
                </span>
              ) : (
                getPlayerLabel(opponent, state.currentPlayer)
              )}
            </div>

            {canInteract && (
              <button
                className={cx(
                  styles.confirmBtn,
                  canConfirm ? styles.confirmBtnEnabled : styles.confirmBtnDisabled,
                )}
                onClick={onConfirm}
                disabled={!canConfirm}
              >
                End Turn
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
