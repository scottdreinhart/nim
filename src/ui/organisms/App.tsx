import { useGame, useSoundEffects, useStats, useWindowSize, vibrate } from '@/app'
import { LoadingScreen } from '@/ui/atoms/LoadingScreen'
import { OfflineIndicator } from '@/ui/atoms/OfflineIndicator'
import { MainMenu } from '@/ui/molecules/MainMenu'
import { SettingsPanel } from '@/ui/molecules/SettingsPanel'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GameBoard } from './GameBoard'

type View = 'loading' | 'menu' | 'game' | 'settings'

export default function App() {
  const { isMobile } = useWindowSize()
  const game = useGame()
  const { stats, recordWin, recordLoss } = useStats()
  const sfx = useSoundEffects()
  const [view, setView] = useState<View>('loading')
  const prevGameOver = useRef(false)

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => setView('menu'), 2500)
    return () => clearTimeout(timer)
  }, [])

  // Sound + haptic + stats on game over
  useEffect(() => {
    if (game.state.isGameOver && !prevGameOver.current) {
      if (game.opponent === 'cpu') {
        if (game.state.winner === 'human') {
          sfx.onWin()
          vibrate([50, 30, 50])
          recordWin()
        } else {
          sfx.onLose()
          vibrate(100)
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
      vibrate(30)
    }
  }, [game.state.lastMove, sfx])

  const handleObjectClick = useCallback(
    (pileId: number, index: number) => {
      sfx.onSelect()
      vibrate(10)
      game.handleObjectClick(pileId, index)
    },
    [game, sfx],
  )

  const handleConfirm = useCallback(() => {
    sfx.onConfirm()
    vibrate(20)
    game.confirmMove()
  }, [game, sfx])

  const startVsCpu = useCallback(() => {
    game.setOpponent('cpu')
    game.resetGame()
    sfx.onClick()
    setView('game')
  }, [game, sfx])

  const startLocal = useCallback(() => {
    game.setOpponent('local')
    game.resetGame()
    sfx.onClick()
    setView('game')
  }, [game, sfx])

  if (view === 'loading') {
    return <LoadingScreen />
  }

  return (
    <>
      <OfflineIndicator />
      {view === 'menu' && (
        <MainMenu
          isMobile={isMobile}
          stats={stats}
          onPlay={startVsCpu}
          onPlayLocal={startLocal}
          onSettings={() => {
            sfx.onClick()
            setView('settings')
          }}
        />
      )}
      {view === 'settings' && (
        <SettingsPanel
          mode={game.state.mode}
          difficulty={game.difficulty}
          setup={game.setup}
          onModeChange={game.setMode}
          onDifficultyChange={game.setDifficulty}
          onSetupChange={game.updateSetup}
          onBack={() => setView('menu')}
        />
      )}
      {view === 'game' && (
        <GameBoard
          state={game.state}
          selectedPileId={game.selectedPileId}
          selectedCount={game.selectedCount}
          difficulty={game.difficulty}
          opponent={game.opponent}
          cpuThinking={game.cpuThinking}
          isMobile={isMobile}
          onObjectClick={handleObjectClick}
          onConfirm={handleConfirm}
          onReset={() => {
            sfx.onClick()
            game.resetGame()
          }}
          onBack={() => {
            sfx.onClick()
            setView('menu')
          }}
          onSettings={() => {
            sfx.onClick()
            setView('settings')
          }}
        />
      )}
    </>
  )
}
