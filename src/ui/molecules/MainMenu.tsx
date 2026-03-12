import type { GameStats } from '@/domain/types'
import { cx } from '@/ui/utils/cssModules'

import styles from './MainMenu.module.css'

interface MainMenuProps {
  isMobile: boolean
  stats: GameStats
  onPlay: () => void
  onPlayLocal: () => void
  onSettings: () => void
}

export function MainMenu({ isMobile, stats, onPlay, onPlayLocal, onSettings }: MainMenuProps) {
  return (
    <div className={cx(styles.root, isMobile && styles.rootMobile)}>
      <h1 className={styles.title}>Game of Nim</h1>
      <p className={styles.subtitle}>A classic strategy game</p>

      {(stats.wins > 0 || stats.losses > 0) && (
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.wins}</span>
            <span className={styles.statLabel}>Wins</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.losses}</span>
            <span className={styles.statLabel}>Losses</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.bestStreak}</span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
        </div>
      )}

      <div className={styles.buttons}>
        <button className={styles.primaryBtn} onClick={onPlay}>
          Play vs AI
        </button>
        <button className={styles.secondaryBtn} onClick={onPlayLocal}>
          2 Player
        </button>
        <button className={styles.secondaryBtn} onClick={onSettings}>
          Settings
        </button>
      </div>

      <p className={styles.hint}>
        Remove objects from heaps.
        <br />
        Choose Normal or Misère rules in Settings.
      </p>
    </div>
  )
}
