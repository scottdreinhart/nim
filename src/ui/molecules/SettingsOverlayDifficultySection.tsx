import { useI18nContext } from '@/app'
import type { Difficulty } from '@/domain'
import { DifficultyToggle } from '@/ui'
import styles from '../organisms/SettingsOverlay.module.css'

interface SettingsOverlayDifficultySectionProps {
  difficulty: Difficulty
  onSelectDifficulty: (difficulty: Difficulty) => void
}

export function SettingsOverlayDifficultySection({
  difficulty,
  onSelectDifficulty,
}: SettingsOverlayDifficultySectionProps) {
  const { t } = useI18nContext()

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t('settings.difficulty')}</h3>
      <DifficultyToggle difficulty={difficulty} onSelect={onSelectDifficulty} />
    </section>
  )
}
