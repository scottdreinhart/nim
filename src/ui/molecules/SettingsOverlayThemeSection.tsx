import { useI18nContext } from '@/app'
import type { ColorTheme } from '@/domain'
import { cx } from '@/ui'
import styles from '../organisms/SettingsOverlay.module.css'

const THEME_LABEL_KEY = {
  chiba: 'settings.theme.chiba',
  classic: 'settings.theme.classic',
  ocean: 'settings.theme.ocean',
  sunset: 'settings.theme.sunset',
  forest: 'settings.theme.forest',
  rose: 'settings.theme.rose',
  midnight: 'settings.theme.midnight',
  highcontrast: 'settings.theme.highcontrast',
} as const

interface SettingsOverlayThemeSectionProps {
  themes: readonly ColorTheme[]
  themeId: string
  onSelectTheme: (themeId: string) => void
}

export function SettingsOverlayThemeSection({
  themes,
  themeId,
  onSelectTheme,
}: SettingsOverlayThemeSectionProps) {
  const { t } = useI18nContext()

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t('settings.theme')}</h3>
      <div className={styles.themeGrid}>
        {themes.map((theme) => {
          const key = THEME_LABEL_KEY[theme.id as keyof typeof THEME_LABEL_KEY]
          const themeLabel = key ? t(key) : theme.label

          return (
            <button
              key={theme.id}
              type="button"
              className={cx(styles.themeBtn, themeId === theme.id && styles.themeBtnActive)}
              onClick={() => onSelectTheme(theme.id)}
              aria-label={t('settings.themeAria', { theme: themeLabel })}
              aria-pressed={themeId === theme.id}
              title={themeLabel}
            >
              <span className={styles.themeSwatch} style={{ backgroundColor: theme.accent }} />
              <span className={styles.themeLabel}>{themeLabel}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
