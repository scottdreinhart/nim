// Platform contracts and types
export * from './contracts/index'

// Platform detection and DI
export { detectPlatform, type DetectedPlatform } from './detection'
export { resolvePlatformApi, resetPlatformApi } from './resolvePlatformApi'

// Platform adapters (core implementations)
export { createBrowserPlatformApi } from './adapters/browser/index'
export { createElectronPlatformApi } from './adapters/electron/index'
export { createCapacitorPlatformApi } from './adapters/capacitor/index'

// Responsive platform capabilities
export { responsive, MEDIA_QUERIES, deriveResponsiveState } from './responsive'
export type { ResponsiveCapabilities, ResponsiveState } from './responsive'
