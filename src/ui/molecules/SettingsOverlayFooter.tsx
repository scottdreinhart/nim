import { useI18nContext } from '@/app'
import type { Difficulty, GameMode, Locale } from '@/domain'
import styles from '../organisms/SettingsOverlay.module.css'

interface SettingsOverlayFooterProps {
  setup: number[]
  mode: GameMode
  difficulty: Difficulty
  themeId: string
  locale: Locale
  onConfirm: (next: {
    setup: number[]
    mode: GameMode
    difficulty: Difficulty
    themeId: string
    locale: Locale
  }) => void
  onCancel: () => void
}

export function SettingsOverlayFooter({
  setup,
  mode,
  difficulty,
  themeId,
  locale,
  onConfirm,
  onCancel,
}: SettingsOverlayFooterProps) {
  const { t } = useI18nContext()

  return (
    <footer className={styles.footer}>
      <button type="button" className={styles.cancelBtn} onClick={onCancel}>
        {t('settings.cancel')}
      </button>
      <button
        type="button"
        className={styles.confirmBtn}
        onClick={() => onConfirm({ setup, mode, difficulty, themeId, locale })}
      >
        {t('settings.confirm')}
      </button>
    </footer>
  )
}
