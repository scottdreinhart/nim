import { GAME_PRESETS } from '@/domain/constants'
import type { Difficulty, GameMode } from '@/domain/types'
import { cx } from '@/ui/utils/cssModules'
import { useState } from 'react'

import styles from './SettingsPanel.module.css'

interface SettingsPanelProps {
  mode: GameMode
  difficulty: Difficulty
  setup: number[]
  onModeChange: (mode: GameMode) => void
  onDifficultyChange: (d: Difficulty) => void
  onSetupChange: (counts: number[]) => void
  onBack: () => void
}

export function SettingsPanel({
  mode,
  difficulty,
  setup,
  onModeChange,
  onDifficultyChange,
  onSetupChange,
  onBack,
}: SettingsPanelProps) {
  const [localSetup, setLocalSetup] = useState<number[]>(setup)

  const handlePileChange = (index: number, val: string) => {
    const num = parseInt(val, 10) || 0
    const clamped = Math.min(Math.max(num, 1), 15)
    const next = [...localSetup]
    next[index] = clamped
    setLocalSetup(next)
  }

  const applyPreset = (counts: number[]) => {
    setLocalSetup([...counts])
  }

  const isPresetActive = (counts: number[]) =>
    counts.length === localSetup.length && counts.every((c, i) => c === localSetup[i])

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          ←
        </button>
        <h2 className={styles.headerTitle}>Settings</h2>
      </div>

      {/* Rules Variant */}
      <div className={styles.card}>
        <h3>Rules Variant</h3>
        <div className={styles.radioGroup}>
          <div
            className={cx(styles.radioOption, mode === 'normal' && styles.radioOptionActive)}
            onClick={() => onModeChange('normal')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onModeChange('normal')}
          >
            <input
              type="radio"
              name="mode"
              checked={mode === 'normal'}
              readOnly
              aria-label="Normal Play"
              className={styles.radio}
            />
            <div>
              <div className={styles.optionTitle}>Normal Play</div>
              <div className={styles.optionDesc}>The player who takes the last object wins.</div>
            </div>
          </div>
          <div
            className={cx(styles.radioOption, mode === 'misere' && styles.radioOptionMisere)}
            onClick={() => onModeChange('misere')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onModeChange('misere')}
          >
            <input
              type="radio"
              name="mode"
              checked={mode === 'misere'}
              readOnly
              aria-label="Misère Play"
              className={cx(styles.radio, styles.radioMisere)}
            />
            <div>
              <div className={styles.optionTitle}>Misère Play</div>
              <div className={styles.optionDesc}>The player who takes the last object loses.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className={styles.card}>
        <h3>AI Difficulty</h3>
        <div className={styles.difficultyGroup}>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              className={cx(styles.difficultyBtn, difficulty === d && styles.difficultyBtnActive)}
              onClick={() => onDifficultyChange(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Piles Setup */}
      <div className={styles.card}>
        <h3>Game Board</h3>
        <div className={styles.pilesRow}>
          <span>Initial Piles:</span>
          <div className={styles.pileInputs}>
            {localSetup.map((count, i) => (
              <input
                key={i}
                type="number"
                value={count}
                onChange={(e) => handlePileChange(i, e.target.value)}
                className={styles.pileInput}
                min={1}
                max={15}
              />
            ))}
          </div>
        </div>
        <p className={styles.pileHint}>Set initial counts for the 3 piles (max 15).</p>

        {/* Quick Presets */}
        <div className={styles.presets}>
          {GAME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              className={cx(
                styles.presetBtn,
                isPresetActive(preset.counts) && styles.presetBtnActive,
              )}
              onClick={() => applyPreset(preset.counts)}
            >
              {preset.name} ({preset.counts.join('-')})
            </button>
          ))}
        </div>
      </div>

      <button
        className={styles.saveBtn}
        onClick={() => {
          onSetupChange(localSetup)
          onBack()
        }}
      >
        Save & Back
      </button>
    </div>
  )
}
