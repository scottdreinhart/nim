import { useResponsiveState } from '@/app'
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
  const responsive = useResponsiveState()

  // Determine layout variant based on device class
  const layoutVariant = responsive.isMobile ? 'mobile' : responsive.isTablet ? 'tablet' : 'desktop'

  return (
    <div
      className={cx(
        styles.root,
        styles[`root${layoutVariant.charAt(0).toUpperCase() + layoutVariant.slice(1)}`],
        isMobile && styles.rootMobile, // Legacy fallback
      )}
    >
      <h1 className={styles.title}>Game of Nim</h1>
      <p
        className={styles.subtitle}
        style={{
          fontSize: responsive.contentDensity === 'compact' ? '0.85rem' : '0.95rem',
        }}
      >
        A classic strategy game
      </p>

      {(stats.wins > 0 || stats.losses > 0) && (
        <div
          className={styles.statsRow}
          style={{
            gap: responsive.contentDensity === 'compact' ? '1rem' : '2rem',
            marginTop: responsive.contentDensity === 'compact' ? '1rem' : '2rem',
            flexDirection: responsive.isMobile ? 'row' : 'row',
            justifyContent: 'center',
          }}
        >
          <div className={styles.statItem}>
            <span
              className={styles.statValue}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.2rem' : '1.4rem',
              }}
            >
              {stats.wins}
            </span>
            <span className={styles.statLabel}>Wins</span>
          </div>
          <div className={styles.statItem}>
            <span
              className={styles.statValue}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.2rem' : '1.4rem',
              }}
            >
              {stats.losses}
            </span>
            <span className={styles.statLabel}>Losses</span>
          </div>
          <div className={styles.statItem}>
            <span
              className={styles.statValue}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.2rem' : '1.4rem',
              }}
            >
              {stats.bestStreak}
            </span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
        </div>
      )}

      <div
        className={styles.buttons}
        style={{
          flexDirection: responsive.isDesktop ? 'row' : 'column',
          gap: responsive.contentDensity === 'compact' ? '0.75rem' : '1rem',
          maxWidth: responsive.isDesktop ? '100%' : '320px',
        }}
      >
        <button
          className={styles.primaryBtn}
          onClick={onPlay}
          style={{
            padding: responsive.contentDensity === 'compact' ? '0.9rem' : '1.2rem',
            fontSize: responsive.contentDensity === 'compact' ? '1rem' : '1.2rem',
            flex: responsive.isDesktop ? 1 : 'none',
          }}
        >
          Play vs AI
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={onPlayLocal}
          style={{
            padding: responsive.contentDensity === 'compact' ? '0.9rem' : '1.2rem',
            fontSize: responsive.contentDensity === 'compact' ? '1rem' : '1.2rem',
            flex: responsive.isDesktop ? 1 : 'none',
          }}
        >
          2 Player
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={onSettings}
          style={{
            padding: responsive.contentDensity === 'compact' ? '0.9rem' : '1.2rem',
            fontSize: responsive.contentDensity === 'compact' ? '1rem' : '1.2rem',
            flex: responsive.isDesktop ? 1 : 'none',
          }}
        >
          Settings
        </button>
      </div>

      <p
        className={styles.hint}
        style={{
          marginTop: responsive.contentDensity === 'spacious' ? '3rem' : '2rem',
          fontSize: responsive.contentDensity === 'compact' ? '0.8rem' : '0.9rem',
        }}
      >
        Remove objects from heaps.
        <br />
        Choose Normal or Misère rules in Settings.
      </p>
    </div>
  )
}
