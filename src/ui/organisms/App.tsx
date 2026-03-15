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

import { useCallback, useEffect, useRef, useState } from 'react'

import { App as CapacitorApp } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'

import {
  useGame,
  useI18nContext,
  useResponsiveState,
  useSoundEffects,
  useStats,
} from '@/app'
import { useThemeContext } from '@/app/context/ThemeContext'
import { GAME_PRESETS } from '@/domain'
import { haptics } from '@/infrastructure/haptics'
import {
  COLOR_THEMES,
  HamburgerMenu,
  MainMenu,
  OfflineIndicator,
  QuickGameSettings,
  QuickThemePicker,
} from '@/ui'

import styles from './App.module.css'
import { GameBoard } from './GameBoard'
import { SettingsOverlay } from './SettingsOverlay'
import { DeviceInfoScreen } from './DeviceInfoScreen'

type AppPhase = 'loading' | 'menu' | 'playing' | 'settings' | 'device-info'

export default function App() {
  const responsive = useResponsiveState()
  const game = useGame()
  const { stats, recordWin, recordLoss } = useStats()
  const sfx = useSoundEffects()
  const { settings, setColorTheme } = useThemeContext()
  const { locale, setLocale, t } = useI18nContext()
  const [phase, setPhase] = useState<AppPhase>('loading')
  const prevGameOver = useRef(false)

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => setPhase('menu'), 1200)
    return () => clearTimeout(timer)
  }, [])

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

  const handleCloseSettings = useCallback(() => {
    sfx.onClick()
    setPhase('menu')
  }, [sfx])

  const handleShowDeviceInfo = useCallback(() => {
    sfx.onClick()
    setPhase('device-info')
  }, [sfx])

  const handleCloseDeviceInfo = useCallback(() => {
    sfx.onClick()
    setPhase('menu')
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

  const handleConfirmSettings = useCallback(
    (next: {
      setup: number[]
      mode: 'normal' | 'misere'
      difficulty: 'easy' | 'medium' | 'hard'
      themeId: string
      locale: 'en' | 'es'
    }) => {
      game.updateSetup(next.setup)
      game.setMode(next.mode)
      game.setDifficulty(next.difficulty)
      setColorTheme(next.themeId)
      setLocale(next.locale)
      sfx.onClick()
      setPhase('menu')
    },
    [game, setColorTheme, setLocale, sfx],
  )

  // Capacitor lifecycle: pause, resume, hardwareBackPress
  useEffect(() => {
    const unlisteners: PluginListenerHandle[] = []

    // Setup listeners asynchronously
    const setupListeners = async () => {
      // Handle app pause (native app suspension on iOS/Android)
      const pauseListener = await CapacitorApp.addListener('pause', () => {
        // Game state is already persisted via hooks (useGame, useStats, etc.)
        // No additional action needed here
        console.debug('[Capacitor] App paused - state auto-persisted')
      })
      unlisteners.push(pauseListener)

      // Handle app resume (app returned to foreground)
      const resumeListener = await CapacitorApp.addListener('resume', () => {
        // Could re-initialize if needed (e.g., analytics tracking, sound context)
        console.debug('[Capacitor] App resumed')
      })
      unlisteners.push(resumeListener)

      // Handle Android hardware back button
      const backListener = await CapacitorApp.addListener(
        'backButton',
        async () => {
          // Navigate based on current phase
          if (phase === 'playing') {
            handleBackToMenu()
          } else if (phase === 'settings') {
            handleCloseSettings()
          } else if (phase === 'menu' || phase === 'loading') {
            // Allow OS to handle (app exit)
            // Optional: show exit confirmation
            console.debug('[Capacitor] Back button on menu - allowing app exit')
          }
        },
      )
      unlisteners.push(backListener)
    }

    setupListeners().catch(err => console.error('[Capacitor] Setup failed:', err))

    return () => {
      unlisteners.forEach(listener => listener.remove())
    }
  }, [phase, handleBackToMenu, handleCloseSettings])

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
          <div className="nim-splash__eyebrow">{t('app.splashEyebrow')}</div>
          <h1 className="nim-splash__title">Nim</h1>
          <p className="nim-splash__subtitle">{t('app.splashSubtitle')}</p>
          <div className="nim-splash__loading">
            <span className="nim-splash__dot"></span>
            <span className="nim-splash__dot"></span>
            <span className="nim-splash__dot"></span>
          </div>
        </div>
      </div>
    )
  }

  // ─── Show Menu / Settings Surface ───
  if (phase === 'menu' || phase === 'settings' || phase === 'device-info') {
    return (
      <div className={styles.appPage}>
        <OfflineIndicator />
        {phase === 'device-info' ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '2rem 1rem',
              minHeight: '100vh',
            }}
          >
            <button
              onClick={handleCloseDeviceInfo}
              style={{
                alignSelf: 'flex-start',
                marginBottom: '1rem',
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '1px solid var(--color-border, #ccc)',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              aria-label={t('menu.close')}
            >
              ← Back
            </button>
            <DeviceInfoScreen />
          </div>
        ) : (
          <>
            <MainMenu
              isMobile={responsive.isMobile}
              stats={stats}
              onPlay={handlePlayVsCpu}
              onPlayLocal={handlePlayLocal}
              onSettings={handleShowSettings}
              onDeviceInfo={handleShowDeviceInfo}
            />
            <SettingsOverlay
              open={phase === 'settings'}
              initialSetup={game.setup}
              initialMode={game.state.mode}
              initialDifficulty={game.difficulty}
              initialThemeId={settings.colorTheme}
              initialLocale={locale}
              presets={GAME_PRESETS}
              themes={COLOR_THEMES}
              onConfirm={handleConfirmSettings}
              onCancel={handleCloseSettings}
            />
          </>
        )}
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
            type="button"
            className={styles.backBtn}
            onClick={handleBackToMenu}
            aria-label={t('app.backToMenu')}
            title={t('app.backButtonTitle')}
          >
            ✕
          </button>
        </div>

        <h1 className={styles.headerTitle}>{t('app.headerTitle')}</h1>

        <div className={styles.headerRight}>
          <HamburgerMenu>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <QuickThemePicker
                themes={COLOR_THEMES}
                activeThemeId={settings.colorTheme}
                onSelectTheme={(themeId) => {
                  sfx.onClick()
                  setColorTheme(themeId)
                }}
              />

              <QuickGameSettings
                difficulty={game.difficulty}
                mode={game.state.mode}
                onSelectDifficulty={(difficulty) => {
                  sfx.onClick()
                  game.setDifficulty(difficulty)
                }}
                onSelectMode={(mode) => {
                  sfx.onClick()
                  game.setMode(mode)
                }}
                onOpenFullSettings={() => setPhase('settings')}
              />

              <button
                onClick={() => {
                  sfx.onClick()
                  handleShowDeviceInfo()
                }}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg-secondary, #f0f0f0)',
                  border: '1px solid var(--color-border, #ddd)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left',
                }}
              >
                📱 Device Info
              </button>
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
