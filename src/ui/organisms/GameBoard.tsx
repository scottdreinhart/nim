import { useResponsiveState } from '@/app'
import type { GameState, LastMove, Opponent } from '@/domain/types'
import { PileToggle } from '@/ui/molecules'
import { cx } from '@/ui/utils/cssModules'
import { useCallback, useEffect } from 'react'

import styles from './GameBoard.module.css'

interface GameBoardProps {
  state: GameState
  selectedPileId: number | null
  selectedCount: number
  opponent: Opponent
  cpuThinking: boolean
  isMobile: boolean
  onObjectClick: (pileId: number, index: number) => void
  onConfirm: () => void
  onReset: () => void
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
  opponent,
  cpuThinking,
  isMobile,
  onObjectClick,
  onConfirm,
  onReset,
}: GameBoardProps) {
  const responsive = useResponsiveState()
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
      }
    },
    [state, selectedPileId, selectedCount, canInteract, canConfirm, onObjectClick, onConfirm],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Determine board size based on device class
  const getBoardMaxWidth = (): string => {
    if (responsive.isMobile) {
      return '90vw'
    }
    if (responsive.isTablet) {
      return '500px'
    }
    if (responsive.isDesktop && !responsive.wideViewport) {
      return '600px'
    }
    return '700px'
  }

  return (
    <div
      className={cx(styles.root, isMobile && styles.rootMobile)}
      style={{
        maxWidth: getBoardMaxWidth(),
        padding: responsive.contentDensity === 'compact' ? '1rem' : '1.5rem',
      }}
    >
      {/* Piles */}
      <div
        className={styles.pilesArea}
        style={{
          gap: responsive.contentDensity === 'compact' ? '0.75rem' : '1.25rem',
        }}
      >
        {state.piles.map((pile) => (
          <div
            key={pile.id}
            className={cx(
              styles.pileColumn,
              state.lastMove?.pileId === pile.id && styles.lastMovePile,
            )}
          >
            <div
              className={styles.pileWrapper}
              style={{
                transform: responsive.contentDensity === 'compact' ? 'scale(0.95)' : 'scale(1)',
              }}
            >
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
                style={{
                  padding:
                    responsive.contentDensity === 'compact' ? '0.4rem 0.6rem' : '0.5rem 0.8rem',
                  fontSize: responsive.contentDensity === 'compact' ? '0.9rem' : '1rem',
                }}
              >
                −
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div
        className={styles.bottomSection}
        style={{
          marginTop: responsive.contentDensity === 'compact' ? '1rem' : '1.5rem',
        }}
      >
        {state.isGameOver ? (
          <div className={styles.winOverlay}>
            <h2
              className={cx(styles.winTitle, playerWon ? styles.winTitleWin : styles.winTitleLose)}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.5rem' : '2rem',
              }}
            >
              {getWinnerLabel(opponent, state.winner, state.lastMove)}
            </h2>
            <button
              className={styles.playAgainBtn}
              onClick={onReset}
              style={{
                padding: responsive.contentDensity === 'compact' ? '0.8rem 1.2rem' : '1rem 1.5rem',
                fontSize: responsive.contentDensity === 'compact' ? '0.9rem' : '1rem',
              }}
            >
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
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '0.85rem' : '1rem',
              }}
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
                style={{
                  padding:
                    responsive.contentDensity === 'compact' ? '0.7rem 1.2rem' : '0.9rem 1.5rem',
                  fontSize: responsive.contentDensity === 'compact' ? '0.9rem' : '1rem',
                }}
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
