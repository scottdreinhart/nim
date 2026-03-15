import { useI18nContext } from '@/app'
import { cx } from '@/ui'
import styles from '../organisms/SettingsOverlay.module.css'

interface Preset {
  name: string
  counts: number[]
}

interface SettingsOverlayPilesSectionProps {
  setup: number[]
  presets: readonly Preset[]
  onPileChange: (index: number, value: string) => void
  onApplyPreset: (counts: number[]) => void
  isPresetActive: (counts: readonly number[]) => boolean
}

const PRESET_LABEL_KEY = {
  Classic: 'settings.preset.classic',
  Simple: 'settings.preset.simple',
  Challenge: 'settings.preset.challenge',
  Quick: 'settings.preset.quick',
  Grand: 'settings.preset.grand',
} as const

export function SettingsOverlayPilesSection({
  setup,
  presets,
  onPileChange,
  onApplyPreset,
  isPresetActive,
}: SettingsOverlayPilesSectionProps) {
  const { t } = useI18nContext()

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t('settings.initialPiles')}</h3>
      <div className={styles.pilesRow}>
        {setup.map((count, index) => (
          <input
            key={index}
            type="number"
            min={1}
            max={15}
            value={count}
            onChange={(event) => onPileChange(index, event.target.value)}
            className={styles.pileInput}
            aria-label={t('settings.pileAria', { index: index + 1 })}
          />
        ))}
      </div>
      <div className={styles.presetRow}>
        {presets.map((preset) => {
          const key = PRESET_LABEL_KEY[preset.name as keyof typeof PRESET_LABEL_KEY]
          const presetLabel = key ? t(key) : preset.name

          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onApplyPreset([...preset.counts])}
              className={cx(styles.presetBtn, isPresetActive(preset.counts) && styles.presetBtnActive)}
            >
              {presetLabel}
            </button>
          )
        })}
      </div>
    </section>
  )
}
