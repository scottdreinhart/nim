import { useI18nContext } from '@/app'
import type { ColorTheme } from '@/domain'

interface QuickThemePickerProps {
  themes: readonly ColorTheme[]
  activeThemeId: string
  onSelectTheme: (themeId: string) => void
}

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

export function QuickThemePicker({ themes, activeThemeId, onSelectTheme }: QuickThemePickerProps) {
  const { t } = useI18nContext()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        marginTop: '4px',
      }}
    >
      {themes.map((theme) => {
        const labelKey = THEME_LABEL_KEY[theme.id as keyof typeof THEME_LABEL_KEY]
        const localizedLabel = labelKey ? t(labelKey) : theme.label
        const isActive = activeThemeId === theme.id

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelectTheme(theme.id)}
            title={localizedLabel}
            aria-label={t('settings.themeAria', { theme: localizedLabel })}
            aria-pressed={isActive}
            style={{
              padding: '6px 4px',
              backgroundColor: isActive ? theme.accent : 'transparent',
              border: `2px solid ${theme.accent}`,
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.65rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--theme-bg)' : 'var(--theme-fg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              opacity: isActive ? 1 : 0.7,
              boxShadow: isActive ? `0 0 8px ${theme.accent}88` : 'none',
            }}
            onMouseEnter={(event) => {
              const element = event.currentTarget as HTMLElement
              if (!isActive) {
                element.style.opacity = '0.9'
                element.style.borderColor = theme.accent
              }
            }}
            onMouseLeave={(event) => {
              const element = event.currentTarget as HTMLElement
              if (!isActive) {
                element.style.opacity = '0.7'
              }
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                backgroundColor: theme.accent,
              }}
            />
            {localizedLabel.slice(0, 3).toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
