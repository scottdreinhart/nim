import { useI18nContext } from '@/app'
import type { GameMode } from '@/domain'
import { RulesToggle } from '@/ui'
import styles from '../organisms/SettingsOverlay.module.css'

interface SettingsOverlayRulesSectionProps {
  mode: GameMode
  onSelectMode: (mode: GameMode) => void
}

export function SettingsOverlayRulesSection({ mode, onSelectMode }: SettingsOverlayRulesSectionProps) {
  const { t } = useI18nContext()

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t('settings.rules')}</h3>
      <RulesToggle mode={mode} onSelect={onSelectMode} />
    </section>
  )
}
