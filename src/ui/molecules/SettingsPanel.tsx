import { GAME_PRESETS } from '@/domain/constants'
import { cx } from '@/ui/utils/cssModules'
import { useState } from 'react'

import styles from './SettingsPanel.module.css'

interface SettingsPanelProps {
  setup: number[]
  onSetupChange: (counts: number[]) => void
  onBack: () => void
}

export function SettingsPanel({ setup, onSetupChange, onBack }: SettingsPanelProps) {
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

  const handleSaveAndBack = () => {
    onSetupChange(localSetup)
    onBack()
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          ←
        </button>
        <h2 className={styles.headerTitle}>Game Board</h2>
      </div>

      <div className={styles.settingsScroll}>
        {/* Initial Piles Setup - ONLY Setting */}
        <div className={styles.section}>
          <div className={styles.label}>Initial Piles</div>
          <div className={styles.pilesRow}>
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
          <p className={styles.pileHint}>Set counts for the 3 piles (1–15).</p>

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
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className={styles.saveBtn} onClick={handleSaveAndBack}>
        Save & Back
      </button>
    </div>
  )
}
