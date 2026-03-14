import { useEffect, useState, memo } from 'react'

import { useI18nContext } from '@/app'
import type { ColorTheme, Difficulty, GameMode, Locale } from '@/domain'
import {
  SettingsOverlayDifficultySection,
  SettingsOverlayFooter,
  SettingsOverlayLanguageSection,
  SettingsOverlayPilesSection,
  SettingsOverlayRulesSection,
  SettingsOverlayThemeSection,
} from '@/ui'
import styles from './SettingsOverlay.module.css'

interface Preset {
  name: string
  counts: number[]
}

interface SettingsOverlayProps {
  open: boolean
  initialSetup: number[]
  initialMode: GameMode
  initialDifficulty: Difficulty
  initialThemeId: string
  initialLocale: Locale
  presets: readonly Preset[]
  themes: readonly ColorTheme[]
  onConfirm: (next: {
    setup: number[]
    mode: GameMode
    difficulty: Difficulty
    themeId: string
    locale: Locale
  }) => void
  onCancel: () => void
}

function SettingsOverlayRaw({
  open,
  initialSetup,
  initialMode,
  initialDifficulty,
  initialThemeId,
  initialLocale,
  presets,
  themes,
  onConfirm,
  onCancel,
}: SettingsOverlayProps) {
  const { t } = useI18nContext()
  const [setup, setSetup] = useState<number[]>(initialSetup)
  const [mode, setMode] = useState<GameMode>(initialMode)
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty)
  const [themeId, setThemeId] = useState<string>(initialThemeId)
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    if (!open) {
      setSetup(initialSetup)
      setMode(initialMode)
      setDifficulty(initialDifficulty)
      setThemeId(initialThemeId)
      setLocale(initialLocale)
    }
  }, [open, initialSetup, initialMode, initialDifficulty, initialThemeId, initialLocale])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open, onCancel])

  if (!open) {
    return null
  }

  const handlePileChange = (index: number, value: string) => {
    const parsed = Number.parseInt(value, 10)
    const nextValue = Number.isNaN(parsed) ? 1 : Math.max(1, Math.min(parsed, 15))
    setSetup((prev) => {
      const next = [...prev]
      next[index] = nextValue
      return next
    })
  }

  const isPresetActive = (counts: readonly number[]) =>
    counts.length === setup.length && counts.every((count, index) => count === setup[index])

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
      onTouchStart={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-overlay-title"
      >
        <header className={styles.header}>
          <h2 id="settings-overlay-title" className={styles.title}>
            {t('settings.title')}
          </h2>
        </header>

        <SettingsOverlayPilesSection
          setup={setup}
          presets={presets}
          onPileChange={handlePileChange}
          onApplyPreset={(counts) => setSetup(counts)}
          isPresetActive={isPresetActive}
        />

        <SettingsOverlayDifficultySection
          difficulty={difficulty}
          onSelectDifficulty={setDifficulty}
        />

        <SettingsOverlayRulesSection mode={mode} onSelectMode={setMode} />

        <SettingsOverlayThemeSection
          themes={themes}
          themeId={themeId}
          onSelectTheme={setThemeId}
        />

        <SettingsOverlayLanguageSection locale={locale} onSelectLocale={setLocale} />

        <SettingsOverlayFooter
          setup={setup}
          mode={mode}
          difficulty={difficulty}
          themeId={themeId}
          locale={locale}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </div>
    </div>
  )
}

/**
 * SettingsOverlay memoized to prevent unnecessary re-renders when parent context updates.
 * Props are compared shallowly via React.memo() — as long as prop identity doesn't change,
 * the component will skip re-rendering.
 *
 * See § 14 Performance Optimization Governance for rationale.
 */
export const SettingsOverlay = memo(SettingsOverlayRaw)
