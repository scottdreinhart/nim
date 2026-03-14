/**
 * Application layer barrel export.
 * Re-exports all React hooks and context providers.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

// Context providers
export { SoundProvider, useSoundContext } from './SoundContext'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// Game & state hooks
export { useGame } from './useGame'
export { useStats } from './useStats'
export { useTheme } from './useTheme'
export { useSoundEffects } from './useSoundEffects'

// Device & input hooks
export { useAppScreens } from './useAppScreens'
export { useDeviceInfo } from './useDeviceInfo'
export { useKeyboardControls } from './useKeyboardControls'
export { useLongPress } from './useLongPress'
export { useMediaQuery } from './useMediaQuery'
export { useOnlineStatus } from './useOnlineStatus'
export { useSwipeGesture } from './useSwipeGesture'
export { useWindowSize } from './useWindowSize'

// Responsive & utility hooks
export { useResponsiveState } from './useResponsiveState'
export { useDropdownBehavior } from './useDropdownBehavior'
export { usePerformanceMetrics, logWebVitals } from './usePerformanceMetrics'
export { useServiceLoader } from './useServiceLoader'
