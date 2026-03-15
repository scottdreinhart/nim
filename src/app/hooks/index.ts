export { useGame } from './useGame'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
export { useTheme } from './useTheme'

export { useAppScreens } from './useAppScreens'
export { useDeviceInfo } from './useDeviceInfo'
export { useKeyboardControls } from './useKeyboardControls'
export { useLongPress } from './useLongPress'
export { useMediaQuery } from './useMediaQuery'
export { useOnlineStatus } from './useOnlineStatus'
export { useSwipeGesture } from './useSwipeGesture'
export { useWindowSize } from './useWindowSize'

export { useDropdownBehavior } from './useDropdownBehavior'
export { logWebVitals, usePerformanceMetrics } from './usePerformanceMetrics'
export { useResponsiveState } from './useResponsiveState'
export { useServiceLoader } from './useServiceLoader'

// Utility hooks — reusable patterns
export { useDebounce } from './useDebounce'
export { useToggle } from './useToggle'
export { useLocalStorage } from './useLocalStorage'
export { useDarkMode } from './useDarkMode'

// Capacitor native bridge — access to native Android/iOS APIs
export {
  useCapacitor,
  useAppLifecycle as useCapacitorAppLifecycle,
  useCapacitorHaptics,
  useCapacitorStorage,
} from './useCapacitor'

// Cross-platform bridges
export { usePlatform } from './usePlatform'
export { useHaptics } from './useHaptics'
export { useGamePersistence } from './useGamePersistence'
export { useAppLifecycle, useAppPauseResume, useAppBeforeUnload } from './useAppLifecycle'

export type { DeviceInfo as CapacitorDeviceInfo } from '@capacitor/device'
export type { Platform } from './usePlatform'