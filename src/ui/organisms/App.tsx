/**
 * App — Phase-based navigation wrapper for the Nim game.
 *
 * Manages game phases:
 * - loading: Splash screen (1.2s + instant gradient background)
 * - menu: Main menu with stats
 * - playing: Active game board
 * - settings: Settings overlay (modal on top of menu or game)
 * - help: Help overlay (future)
 * - stats: Stats overlay (future)
 *
 * Responsive: Uses useResponsiveState for semantic breakpoints.
 * Board scaling: Dynamic sizing using CSS custom properties + clamp().
 */

import {
  useGame,
  useResponsiveState,
  useSoundEffects,
  useStats,
  useThemeContext,
} from '@/app'
import { haptics } from '@/infrastructure/haptics'
import { GAME_PRESETS } from '@/domain/constants'
import { COLOR_THEMES } from '@/ui/theme'
import { DifficultyToggle, RulesToggle } from '@/ui/atoms'
import { OfflineIndicator } from '@/ui/atoms/OfflineIndicator'
import { HamburgerMenu, MainMenu } from '@/ui/molecules'
import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './App.module.css'
import { GameBoard } from './GameBoard'

type AppPhase = 'loading' | 'menu' | 'playing' | 'settings'

export default function App() {
  const responsive = useResponsiveState()
  const game = useGame()
  const { stats, recordWin, recordLoss } = useStats()
  const sfx = useSoundEffects()
  const { settings, setColorTheme } = useThemeContext()
  const [phase, setPhase] = useState<AppPhase>('loading')
  const [tempSetup, setTempSetup] = useState<number[]>(game.setup)
  const prevGameOver = useRef(false)

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => setPhase('menu'), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Sync tempSetup with game.setup when game changes
  useEffect(() => {
    setTempSetup(game.setup)
  }, [game.setup])

  // Sound + haptic + stats on game over
  useEffect(() => {
    if (game.state.isGameOver && !prevGameOver.current) {
      if (game.opponent === 'cpu') {
        if (game.state.winner === 'human') {
          sfx.onWin()
          haptics.success()
          recordWin()
        } else {
          sfx.onLose()
          haptics.error()
          recordLoss()
        }
      }
    }
    prevGameOver.current = game.state.isGameOver
  }, [game.state.isGameOver, game.state.winner, game.opponent, sfx, recordWin, recordLoss])

  // Sound on CPU move
  useEffect(() => {
    if (game.state.lastMove?.player === 'cpu') {
      sfx.onCpuMove()
      haptics.light()
    }
  }, [game.state.lastMove, sfx])

  // ─── Navigation Handlers ───
  const handlePlayVsCpu = useCallback(() => {
    game.setOpponent('cpu')
    game.resetGame()
    sfx.onClick()
    setPhase('playing')
  }, [game, sfx])

  const handlePlayLocal = useCallback(() => {
    game.setOpponent('local')
    game.resetGame()
    sfx.onClick()
    setPhase('playing')
  }, [game, sfx])

  const handleShowSettings = useCallback(() => {
    sfx.onClick()
    setPhase('settings')
  }, [sfx])

  const handleBackToMenu = useCallback(() => {
    sfx.onClick()
    setPhase('menu')
  }, [sfx])

  const handleObjectClick = useCallback(
    (pileId: number, index: number) => {
      sfx.onSelect()
      haptics.light()
      game.handleObjectClick(pileId, index)
    },
    [game, sfx],
  )

  const handleConfirm = useCallback(() => {
    sfx.onConfirm()
    haptics.light()
    game.confirmMove()
  }, [game, sfx])

  const handleResetGame = useCallback(() => {
    sfx.onClick()
    game.resetGame()
  }, [game, sfx])

  const handlePileChange = useCallback(
    (index: number, val: string) => {
      const num = parseInt(val, 10) || 0
      const clamped = Math.min(Math.max(num, 1), 15)
      const next = [...tempSetup]
      next[index] = clamped
      setTempSetup(next)
      game.updateSetup(next)
    },
    [tempSetup, game],
  )

  const handleApplyPreset = useCallback(
    (counts: number[]) => {
      setTempSetup([...counts])
      game.updateSetup(counts)
      sfx.onClick()
    },
    [game, sfx],
  )

  const isPresetActive = (counts: number[]) =>
    counts.length === tempSetup.length && counts.every((c, i) => c === tempSetup[i])

  // ─── Show Splash ───
  if (phase === 'loading') {
    return (
      <div className="nim-splash">
        <div className="nim-splash__orb"></div>
        <div className="nim-splash__grid"></div>
        <div className="nim-splash__content">
          <div className="nim-splash__badge">
            <div className="nim-splash__emoji">🎯</div>
          </div>
          <div className="nim-splash__eyebrow">Stack. Remove. Win.</div>
          <h1 className="nim-splash__title">Nim</h1>
          <p className="nim-splash__subtitle">Take the last stone, or force your opponent to</p>
          <div className="nim-splash__loading">
            <span className="nim-splash__dot"></span>
            <span className="nim-splash__dot"></span>
            <span className="nim-splash__dot"></span>
          </div>
        </div>
      </div>
    )
  }

  // ─── Show Menu ───
  if (phase === 'menu') {
    return (
      <div className={styles.appPage}>
        <OfflineIndicator />
        <MainMenu
          isMobile={responsive.isMobile}
          stats={stats}
          onPlay={handlePlayVsCpu}
          onPlayLocal={handlePlayLocal}
          onSettings={handleShowSettings}
        />
      </div>
    )
  }

  // ─── Show Game Board with Persistent Header ───
  return (
    <div className={styles.appContainer}>
      <OfflineIndicator />

      {/* Persistent App Header */}
      <header className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={handleBackToMenu}
            aria-label="Back to menu"
            title="Back"
          >
            ✕
          </button>
        </div>

        <h1 className={styles.headerTitle}>Game of Nim</h1>

        <div className={styles.headerRight}>
          <HamburgerMenu>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Game Board / Piles Section */}
              <div
                style={{
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--theme-border)',
                  opacity: 0.3,
                }}
              >
                <div
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    marginBottom: '6px',
                    color: 'var(--theme-accent)',
                    fontWeight: 600,
                  }}
                >
                  Initial Piles
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    justifyContent: 'center',
                    marginBottom: '6px',
                  }}
                >
                  {tempSetup.map((count, i) => (
                    <input
                      key={i}
                      type="number"
                      value={count}
                      onChange={(e) => handlePileChange(i, e.target.value)}
                      style={{
                        width: '40px',
                        padding: '4px 6px',
                        border: '1px solid var(--theme-border)',
                        background: 'var(--theme-bg)',
                        color: 'var(--theme-fg)',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                      min="1"
                      max="15"
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {GAME_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset.counts)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.65rem',
                        border: `1px solid var(--theme-accent)`,
                        background: isPresetActive(preset.counts)
                          ? 'var(--theme-accent)'
                          : 'transparent',
                        color: isPresetActive(preset.counts)
                          ? 'var(--theme-bg)'
                          : 'var(--theme-accent)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontWeight: isPresetActive(preset.counts) ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        if (!isPresetActive(preset.counts)) {
                          el.style.opacity = '0.85'
                        }
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        if (!isPresetActive(preset.counts)) {
                          el.style.opacity = '1'
                        }
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{ height: '1px', backgroundColor: 'var(--theme-border)', opacity: 0.3 }}
              />

              {/* Theme Selector Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                  marginTop: '4px',
                }}
              >
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      sfx.onClick()
                      setColorTheme(theme.id)
                    }}
                    title={theme.label}
                    style={{
                      padding: '6px 4px',
                      backgroundColor:
                        settings.colorTheme === theme.id ? theme.accent : 'transparent',
                      border: `2px solid ${theme.accent}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.65rem',
                      fontWeight: settings.colorTheme === theme.id ? 600 : 400,
                      color:
                        settings.colorTheme === theme.id ? 'var(--theme-bg)' : 'var(--theme-fg)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      opacity: settings.colorTheme === theme.id ? 1 : 0.7,
                      boxShadow:
                        settings.colorTheme === theme.id ? `0 0 8px ${theme.accent}88` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      if (settings.colorTheme !== theme.id) {
                        el.style.opacity = '0.9'
                        el.style.borderColor = theme.accent
                      }
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      if (settings.colorTheme !== theme.id) {
                        el.style.opacity = '0.7'
                      }
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        backgroundColor: theme.accent,
                      }}
                    />
                    {theme.label.slice(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                  marginTop: '8px',
                }}
              >
                Difficulty
              </div>
              <DifficultyToggle
                difficulty={game.difficulty}
                onSelect={(d) => {
                  sfx.onClick()
                  game.setDifficulty(d)
                }}
              />
              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                  marginTop: '8px',
                }}
              >
                Rules
              </div>
              <RulesToggle
                mode={game.state.mode}
                onSelect={(mode) => {
                  sfx.onClick()
                  game.setMode(mode)
                }}
              />
            </div>
          </HamburgerMenu>
        </div>
      </header>

      {/* Game Content Area */}
      <div className={styles.appContent}>
        <GameBoard
          state={game.state}
          selectedPileId={game.selectedPileId}
          selectedCount={game.selectedCount}
          opponent={game.opponent}
          cpuThinking={game.cpuThinking}
          isMobile={responsive.isMobile}
          onObjectClick={handleObjectClick}
          onConfirm={handleConfirm}
          onReset={handleResetGame}
        />
      </div>
    </div>
  )
}
