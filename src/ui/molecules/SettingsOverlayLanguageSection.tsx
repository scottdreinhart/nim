import { useI18nContext } from '@/app'
import type { Locale } from '@/domain'
import { cx } from '@/ui'
import styles from '../organisms/SettingsOverlay.module.css'

interface SettingsOverlayLanguageSectionProps {
  locale: Locale
  onSelectLocale: (locale: Locale) => void
}

export function SettingsOverlayLanguageSection({
  locale,
  onSelectLocale,
}: SettingsOverlayLanguageSectionProps) {
  const { t } = useI18nContext()

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t('settings.language')}</h3>
      <div className={styles.localeRow} role="radiogroup" aria-label={t('settings.language')}>
        <button
          type="button"
          className={cx(styles.localeBtn, locale === 'en' && styles.localeBtnActive)}
          role="radio"
          aria-checked={locale === 'en'}
          onClick={() => onSelectLocale('en')}
        >
          {t('settings.locale.en')}
        </button>
        <button
          type="button"
          className={cx(styles.localeBtn, locale === 'es' && styles.localeBtnActive)}
          role="radio"
          aria-checked={locale === 'es'}
          onClick={() => onSelectLocale('es')}
        >
          {t('settings.locale.es')}
        </button>
      </div>
    </section>
  )
}
