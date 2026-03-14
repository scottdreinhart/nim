import { useCallback, memo } from 'react'

import { useI18nContext, useKeyboardControls, useResponsiveState } from '@/app'
import type { GameState, Opponent } from '@/domain'
import { cx, PileToggle } from '@/ui'

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

function getPlayerLabel(
  opponent: Opponent,
  currentPlayer: 'human' | 'cpu',
  t: (key: 'game.player1Turn' | 'game.player2Turn' | 'game.yourTurn' | 'game.cpuThinking') => string,
): string {
  if (opponent === 'local') {
    return currentPlayer === 'human' ? t('game.player1Turn') : t('game.player2Turn')
  }
  return currentPlayer === 'human' ? t('game.yourTurn') : t('game.cpuThinking')
}

function getWinnerLabel(
  opponent: Opponent,
  winner: 'human' | 'cpu' | null,
  t: (key: 'game.player1Wins' | 'game.player2Wins' | 'game.youWon' | 'game.youLost') => string,
): string {
  if (!winner) {
    return ''
  }
  if (opponent === 'local') {
    return winner === 'human' ? t('game.player1Wins') : t('game.player2Wins')
  }
  return winner === 'human' ? t('game.youWon') : t('game.youLost')
}

function GameBoardRaw({
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
  const { t } = useI18nContext()
  const canConfirm = selectedPileId !== null && selectedCount > 0
  const isHumanTurn = state.currentPlayer === 'human'
  const canInteract = opponent === 'local' || isHumanTurn
  const playerWon = opponent === 'local' ? true : state.winner === 'human'

  const selectAdjacentPile = useCallback(
    (direction: 'left' | 'right') => {
      if (state.isGameOver || !canInteract) {
        return
      }

      const nonEmpty = state.piles.filter((p) => p.count > 0)
      if (nonEmpty.length === 0) {
        return
      }

      const currentIdx = nonEmpty.findIndex((p) => p.id === selectedPileId)
      const nextIdx =
        direction === 'right'
          ? currentIdx < 0
            ? 0
            : (currentIdx + 1) % nonEmpty.length
          : currentIdx <= 0
            ? nonEmpty.length - 1
            : currentIdx - 1

      onObjectClick(nonEmpty[nextIdx].id, 0)
    },
    [state, canInteract, selectedPileId, onObjectClick],
  )

  const increaseSelection = useCallback(() => {
    if (state.isGameOver || !canInteract || selectedPileId === null) {
      return
    }
    const pile = state.piles.find((p) => p.id === selectedPileId)
    if (pile && selectedCount < pile.count) {
      onObjectClick(selectedPileId, selectedCount)
    }
  }, [state, canInteract, selectedPileId, selectedCount, onObjectClick])

  const decreaseSelection = useCallback(() => {
    if (state.isGameOver || !canInteract || selectedPileId === null) {
      return
    }
    if (selectedCount > 1) {
      onObjectClick(selectedPileId, selectedCount - 2)
    }
  }, [state, canInteract, selectedPileId, selectedCount, onObjectClick])

  const confirmSelection = useCallback(() => {
    if (canConfirm) {
      onConfirm()
    }
  }, [canConfirm, onConfirm])

  useKeyboardControls(
    [
      {
        action: 'moveLeft',
        keys: ['ArrowLeft', 'KeyA'],
        onTrigger: () => selectAdjacentPile('left'),
      },
      {
        action: 'moveRight',
        keys: ['ArrowRight', 'KeyD'],
        onTrigger: () => selectAdjacentPile('right'),
      },
      {
        action: 'moveUp',
        keys: ['ArrowUp', 'KeyW'],
        onTrigger: increaseSelection,
      },
      {
        action: 'moveDown',
        keys: ['ArrowDown', 'KeyS'],
        onTrigger: decreaseSelection,
      },
      {
        action: 'confirm',
        keys: ['Enter', 'NumpadEnter', 'Space'],
        onTrigger: confirmSelection,
      },
    ],
    {
      enabled: !state.isGameOver,
      ignoreInputs: true,
    },
  )

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
                aria-label={t('game.takeAllFromPile', { pile: pile.id + 1 })}
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
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.5rem' : '2rem',
              }}
            >
              {getWinnerLabel(opponent, state.winner, t)}
            </h2>
            <button
              className={styles.playAgainBtn}
              onClick={onReset}
              style={{
                padding: responsive.contentDensity === 'compact' ? '0.8rem 1.2rem' : '1rem 1.5rem',
                fontSize: responsive.contentDensity === 'compact' ? '0.9rem' : '1rem',
              }}
            >
              {t('game.playAgain')}
            </button>
          </div>
        ) : (
          <div className={styles.turnArea}>
            <div
              className={cx(
                styles.turnLabel,
                canInteract ? styles.turnLabelActive : styles.turnLabelInactive,
              )}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              aria-label={t('game.liveStatus')}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '0.85rem' : '1rem',
              }}
            >
              {cpuThinking ? (
                <span>
                  {t('game.cpuThinking')}{' '}
                  <span className={styles.thinkingDots}>
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                  </span>
                </span>
              ) : (
                getPlayerLabel(opponent, state.currentPlayer, t)
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
                {t('game.endTurn')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * GameBoard memoized to prevent unnecessary re-renders when parent context updates.
 * Props are compared shallowly via React.memo() — as long as prop identity doesn't change,
 * the component will skip re-rendering.
 *
 * See § 14 Performance Optimization Governance for rationale.
 */
export const GameBoard = memo(GameBoardRaw)
