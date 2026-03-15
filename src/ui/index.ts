/**
 * UI layer barrel export.
 * Re-exports atoms, molecules, organisms, and utilities.
 *
 * Usage: import { ErrorBoundary, cx } from '@/ui'
 */

export { BREAKPOINTS } from './ui-constants'
export { cx } from './utils/cssModules'

// Atoms
export {
	DifficultyToggle,
	LoadingScreen,
	NimObject,
	OfflineIndicator,
	RulesToggle,
} from './atoms'

// Molecules
export {
	HamburgerMenu,
	MainMenu,
	PileToggle,
	QuickGameSettings,
	QuickThemePicker,
	SettingsOverlayDifficultySection,
	SettingsOverlayFooter,
	SettingsOverlayLanguageSection,
	SettingsOverlayPilesSection,
	SettingsOverlayRulesSection,
	SettingsOverlayThemeSection,
} from './molecules'

// Organisms
export { App, AppWithProviders, GameBoard, ShellApp, SettingsOverlay } from './organisms'
export { ErrorBoundary } from './organisms'

// Theme
export * from './theme'
