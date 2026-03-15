import { useI18nContext } from '@/app'
import type { Difficulty, GameMode } from '@/domain'
import { DifficultyToggle, RulesToggle } from '@/ui'

interface QuickGameSettingsProps {
  difficulty: Difficulty
  mode: GameMode
  onSelectDifficulty: (difficulty: Difficulty) => void
  onSelectMode: (mode: GameMode) => void
  onOpenFullSettings: () => void
}

export function QuickGameSettings({
  difficulty,
  mode,
  onSelectDifficulty,
  onSelectMode,
  onOpenFullSettings,
}: QuickGameSettingsProps) {
  const { t } = useI18nContext()

  return (
    <>
      <div
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          opacity: 0.6,
          marginTop: '8px',
        }}
      >
        {t('app.quickDifficulty')}
      </div>
      <DifficultyToggle difficulty={difficulty} onSelect={onSelectDifficulty} />

      <div
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          opacity: 0.6,
          marginTop: '8px',
        }}
      >
        {t('app.quickRules')}
      </div>
      <RulesToggle mode={mode} onSelect={onSelectMode} />

      <button
        type="button"
        onClick={onOpenFullSettings}
        style={{
          marginTop: '6px',
          padding: '8px 10px',
          borderRadius: '8px',
          border: '1px solid var(--theme-border)',
          background: 'transparent',
          color: 'var(--theme-fg)',
          cursor: 'pointer',
          fontSize: '0.8rem',
        }}
      >
        {t('app.openFullSettings')}
      </button>
    </>
  )
}
