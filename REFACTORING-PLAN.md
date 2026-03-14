# Complete Refactoring Plan — Phases 1 & 2
## Domain Purification + Platform Contracts Architecture

**Date**: March 14, 2026  
**Target**: Strict boundary model with pure domain and explicit platform contracts  
**Scope**: Phases 1 & 2 only (foundation for phases 3-6)

---

## Phase 1: Purify Domain Layer

Clear non-domain concerns OUT of `src/domain/` to restore domain purity.

### Files to Move (Domain → Target Destinations)

#### 1. responsive.ts
```
CURRENT: src/domain/responsive.ts
TARGET:  src/infrastructure/platform/responsive.ts
REASON:  UI breakpoints are platform/browser concerns, not game domain
SIZE:    ~3KB
IMPORTS: none from domain (safe to move)
AFFECTED: All files importing from @/domain/responsive
```

**Files that import responsive.ts**:
- `src/app/useResponsiveState.ts` (updates)
- `src/ui/ui-constants.ts` (updates)
- `src/ui/molecules/HamburgerMenu.tsx` (updates)
- `src/ui/molecules/SettingsPanel.tsx` (updates)
- `src/ui/organisms/GameBoard.tsx` (updates)
- `src/ui/atoms/*.tsx` (multiple files, updates)

**Barrel Updates**:
- `src/domain/index.ts` — Remove export of responsive
- `src/infrastructure/platform/index.ts` — Add export of responsive (create if needed)

---

#### 2. layers.ts
```
CURRENT: src/domain/layers.ts
TARGET:  src/ui/theme/tokens/layers.ts
REASON:  Z-index tokens are UI/rendering concerns, not game logic
SIZE:    ~0.5KB (pure constants)
IMPORTS: none
AFFECTED: All files importing @/domain/layers
```

**Files that import layers.ts**:
- `src/ui/atoms/*.tsx` (multiple, uses Z_INDEX constants)
- `src/ui/molecules/*.tsx` (uses Z_INDEX)
- `src/ui/organisms/*.tsx` (uses Z_INDEX)
- `src/ui/ui-constants.ts` (may reference)

**Barrel Updates**:
- `src/domain/index.ts` — Remove export of layers
- `src/ui/theme/tokens/index.ts` — Add export of layers (create if needed)

---

#### 3. sprites.ts
```
CURRENT: src/domain/sprites.ts
TARGET:  src/assets/sprites/registry.ts
REASON:  Asset mapping is infrastructure/assets concern, not game rules
SIZE:    ~1KB
IMPORTS: none from domain
AFFECTED: Any component that uses sprite mapping
```

**Files that import sprites.ts**:
- `src/ui/atoms/NimObject.tsx` (if uses sprite map)
- `src/ui/organisms/GameBoard.tsx` (if uses sprite rendering)
- `src/app/useGame.ts` (if needs sprite registry)

**Barrel Updates**:
- `src/domain/index.ts` — Remove export of sprites
- `src/assets/sprites/index.ts` — Add export of registry (create if needed)

---

#### 4. themes.ts
```
CURRENT: src/domain/themes.ts
TARGET:  src/ui/theme/themeRegistry.ts
REASON:  Theme data is UI/rendering, not game domain
SIZE:    ~2KB
IMPORTS: Contains game-relevant constants? Audit first
AFFECTED: Theme context, theme loading, settings
```

**Files that import themes.ts**:
- `src/app/ThemeContext.tsx` (updates)
- `src/app/useTheme.ts` (updates)
- `src/ui/molecules/SettingsPanel.tsx` (updates)
- `src/ui/organisms/App.tsx` (updates)

**Barrel Updates**:
- `src/domain/index.ts` — Remove export of themes
- `src/ui/theme/index.ts` — Add export of themeRegistry (create if needed)

---

### Domain Index Update (Phase 1)

**File**: `src/domain/index.ts`

```typescript
// BEFORE
export * from './types'
export * from './constants'
export { isValidMove, makeMove, ... } from './rules'
export { computeAiMove } from './ai'
export { createBoard } from './board'
export * from './responsive'        // ❌ REMOVE
export * from './layers'            // ❌ REMOVE
export * from './sprites'           // ❌ REMOVE
export * from './themes'            // ❌ REMOVE

// AFTER
export * from './types'
export * from './constants'
export { isValidMove, makeMove, ... } from './rules'
export { computeAiMove } from './ai'
export { createBoard } from './board'
// ✅ Domain is now PURE: contains only game logic
```

---

### Create New Directories & Barrels (Phase 1)

#### New: `src/infrastructure/platform/`
```
src/infrastructure/platform/
├── index.ts               ← barrel (exports responsive)
└── responsive.ts          ← moved from domain/
```

**File**: `src/infrastructure/platform/index.ts`
```typescript
export * from './responsive'
```

---

#### New: `src/ui/theme/tokens/`
```
src/ui/theme/tokens/
├── index.ts               ← barrel (exports layers, other tokens)
└── layers.ts              ← moved from domain/
```

**File**: `src/ui/theme/tokens/index.ts`
```typescript
export * from './layers'
// Future: tokens.ts, breakpoints.ts, etc.
```

---

#### New: `src/assets/sprites/`
```
src/assets/sprites/
├── index.ts               ← barrel (exports registry)
└── registry.ts            ← moved from domain/
```

**File**: `src/assets/sprites/index.ts`
```typescript
export * from './registry'
```

---

#### New/Update: `src/ui/theme/`
```
src/ui/theme/
├── index.ts               ← barrel (exports themeRegistry)
├── themeRegistry.ts       ← moved from domain/themes.ts
├── tokens/                ← new (created above)
│   ├── index.ts
│   └── layers.ts
└── [existing theme CSS files remain]
```

**File**: `src/ui/theme/index.ts`
```typescript
export * from './themeRegistry'
export * from './tokens'
```

---

### Import Updates (Phase 1)

**Search & Replace Pattern** for all moved imports:

```
OLD: import { responsive } from '@/domain'
NEW: import { responsive } from '@/infrastructure/platform'

OLD: import { Z_INDEX } from '@/domain'
NEW: import { Z_INDEX } from '@/ui/theme/tokens'

OLD: import { SPRITE_MAP } from '@/domain'
NEW: import { SPRITE_MAP } from '@/assets/sprites'

OLD: import { THEMES } from '@/domain'
NEW: import { THEMES } from '@/ui/theme'
```

**Files needing updates** (comprehensive list):
- `src/app/useResponsiveState.ts` (4 files import this hook)
- `src/ui/ui-constants.ts`
- `src/ui/atoms/DifficultyToggle.tsx`
- `src/ui/atoms/ErrorBoundary.tsx`
- `src/ui/atoms/LoadingScreen.tsx`
- `src/ui/atoms/NimObject.tsx`
- `src/ui/atoms/OfflineIndicator.tsx`
- `src/ui/atoms/RulesToggle.tsx`
- `src/ui/molecules/HamburgerMenu.tsx`
- `src/ui/molecules/MainMenu.tsx`
- `src/ui/molecules/SettingsPanel.tsx`
- `src/ui/organisms/App.tsx`
- `src/ui/organisms/AppWithProviders.tsx`
- `src/ui/organisms/GameBoard.tsx`
- `src/app/ThemeContext.tsx`
- `src/app/useTheme.ts`
- `src/app/useGame.ts`

---

### Phase 1 Summary

**Outcome**:
- ✅ `src/domain/` contains ONLY: types, constants, rules, ai, board
- ✅ All UI/responsive concerns moved to `src/infrastructure` or `src/ui/theme`
- ✅ All asset mappings moved to `src/assets/`
- ✅ Domain purity restored
- ✅ Zero broken imports (all updated and tested)

---

---

## Phase 2: Formalize Platform Contracts Architecture

Establish typed boundary layer for ALL platform capabilities.

### Platform Contract Types (New)

**File**: `src/infrastructure/platform/contracts/types.ts`

```typescript
/**
 * PlatformApi: Union of all platform capabilities
 * All platform interactions go through contracts, never direct API access
 */

export interface HapticsApi {
  light(): Promise<void>
  medium(): Promise<void>
  heavy(): Promise<void>
}

export interface StorageApi {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}

export interface DiagnosticsApi {
  logError(message: string, context?: Record<string, any>): void
  logWarning(message: string): void
  logInfo(message: string): void
  trackEvent(eventName: string, data?: Record<string, any>): void
}

export interface AudioApi {
  play(soundId: string): Promise<void>
  stop(soundId: string): Promise<void>
  setVolume(level: number): void
}

export interface DeviceApi {
  isOnline(): boolean
  getDeviceInfo(): DeviceInfo
  onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void
}

export interface DeviceInfo {
  userAgent: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  supportsHaptics: boolean
  supportsNotifications: boolean
}

export interface PlatformApi {
  haptics: HapticsApi
  storage: StorageApi
  diagnostics: DiagnosticsApi
  audio: AudioApi
  device: DeviceApi
  name: 'web' | 'electron' | 'capacitor'
}
```

---

### Create Platform Adapters

#### Browser Adapter (Web Platform)

**File**: `src/infrastructure/platform/adapters/browser/index.ts`

```typescript
import type { PlatformApi } from '../types'

const browserHaptics: HapticsApi = {
  async light() {
    navigator.vibrate?.(10)
  },
  async medium() {
    navigator.vibrate?.(20)
  },
  async heavy() {
    navigator.vibrate?.(50)
  },
}

const browserStorage: StorageApi = {
  async getItem(key: string) {
    return localStorage.getItem(key)
  },
  async setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  },
  async removeItem(key: string) {
    localStorage.removeItem(key)
  },
  async clear() {
    localStorage.clear()
  },
}

// ... rest of adapters

export const createBrowserPlatformApi = (): PlatformApi => ({
  haptics: browserHaptics,
  storage: browserStorage,
  diagnostics: browserDiagnostics,
  audio: browserAudio,
  device: browserDevice,
  name: 'web',
})
```

---

#### Capacitor Adapter (Mobile Platform)

**File**: `src/infrastructure/platform/adapters/capacitor/index.ts`

```typescript
import { App as CapApp } from '@capacitor/app'
import type { PlatformApi } from '../types'

const capacitorHaptics: HapticsApi = {
  async light() {
    const { Haptics } = await import('@capacitor/haptics')
    Haptics.notification({ type: 'Light' })
  },
  // ... etc
}

export const createCapacitorPlatformApi = (): PlatformApi => ({
  haptics: capacitorHaptics,
  // ... all other APIs
  name: 'capacitor',
})
```

---

#### Electron Adapter (Desktop Platform)

**File**: `src/infrastructure/platform/adapters/electron/index.ts`

```typescript
import type { PlatformApi } from '../types'

const electronHaptics: HapticsApi = {
  async light() {
    // Electron doesn't have native haptics, no-op
  },
  // ... etc
}

export const createElectronPlatformApi = (): PlatformApi => ({
  haptics: electronHaptics,
  // ... all other APIs
  name: 'electron',
})
```

---

### Platform Detection & Resolution

**File**: `src/infrastructure/platform/detection.ts`

```typescript
export function detectPlatform(): 'web' | 'electron' | 'capacitor' {
  if (window.__ELECTRON__) return 'electron'
  if (window.Capacitor) return 'capacitor'
  return 'web'
}
```

---

### Platform DI Container

**File**: `src/infrastructure/platform/resolvePlatformApi.ts`

```typescript
import type { PlatformApi } from './contracts/types'
import { detectPlatform } from './detection'
import { createBrowserPlatformApi } from './adapters/browser'
import { createCapacitorPlatformApi } from './adapters/capacitor'
import { createElectronPlatformApi } from './adapters/electron'

let _platformApi: PlatformApi | null = null

export function resolvePlatformApi(): PlatformApi {
  if (_platformApi) return _platformApi

  const platform = detectPlatform()

  switch (platform) {
    case 'electron':
      _platformApi = createElectronPlatformApi()
      break
    case 'capacitor':
      _platformApi = createCapacitorPlatformApi()
      break
    case 'web':
    default:
      _platformApi = createBrowserPlatformApi()
  }

  return _platformApi
}
```

---

### Infrastructure Platform Barrel

**File**: `src/infrastructure/platform/index.ts`

```typescript
export type { PlatformApi, HapticsApi, StorageApi, DiagnosticsApi, AudioApi, DeviceApi } from './contracts/types'
export { resolvePlatformApi } from './resolvePlatformApi'
export { detectPlatform } from './detection'
```

---

### Update App Hooks to Use Platform API

#### Before & After: `useHaptics` (Example)

**BEFORE** (Direct API):
```typescript
export const useHaptics = () => {
  return {
    light: () => navigator.vibrate?.(10),
    medium: () => navigator.vibrate?.(20),
  }
}
```

**AFTER** (Platform Contract):
```typescript
import { resolvePlatformApi } from '@/infrastructure/platform'

export const useHaptics = () => {
  const platform = resolvePlatformApi()
  return platform.haptics
}
```

---

**Files needing refact** (hooks that now use platform API):
- `src/app/useDeviceInfo.ts` → use `platform.device`
- `src/app/useSoundEffects.ts` → use `platform.audio`
- `src/app/useOnlineStatus.ts` → use `platform.device.isOnline()`
- `src/app/crashLogger.ts` → use `platform.diagnostics`
- `src/app/storageService.ts` → use `platform.storage`
- `src/app/haptics.ts` → use `platform.haptics`

---

### Move Services Under Infrastructure (Phase 2 Overlap)

These services NOW consume platform contracts (not direct APIs):

**File Moves**:
```
src/app/storageService.ts    → src/infrastructure/storage/persistence.ts
src/app/crashLogger.ts       → src/infrastructure/diagnostics/crashLogger.ts
src/app/haptics.ts           → src/infrastructure/haptics/haptics.ts
src/app/sounds.ts            → src/infrastructure/audio/sounds.ts
```

**Barrel Updates**:
- `src/app/index.ts` — Remove these service exports
- `src/infrastructure/index.ts` — Add service exports

---

### Create Infrastructure Directory Structure

**New Structure**:
```
src/infrastructure/
├── index.ts                          ← Master barrel
├── platform/
│   ├── index.ts
│   ├── contracts/types.ts
│   ├── adapters/
│   │   ├── browser/
│   │   ├── capacitor/
│   │   └── electron/
│   ├── detection.ts
│   └── resolvePlatformApi.ts
├── storage/
│   ├── index.ts
│   └── persistence.ts               ← moved from app/storageService.ts
├── diagnostics/
│   ├── index.ts
│   └── crashLogger.ts               ← moved from app/crashLogger.ts
├── haptics/
│   ├── index.ts
│   └── haptics.ts                   ← moved from app/haptics.ts
├── audio/
│   ├── index.ts
│   └── sounds.ts                    ← moved from app/sounds.ts
└── device/
    ├── index.ts
    └── [device info hooks]
```

---

### Infrastructure Master Barrel

**File**: `src/infrastructure/index.ts`

```typescript
// Platform contracts (core)
export * from './platform'

// Services (consuming contracts)
export * from './storage'
export * from './diagnostics'
export * from './haptics'
export * from './audio'
export * from './device'
```

---

### Update App Layer Barrels (Phase 2)

**File**: `src/app/index.ts` (AFTER phase 2)

```typescript
// Composition & Bootstrap
export { ThemeProvider } from './ThemeContext'
export { SoundProvider } from './SoundContext'
export { useTheme } from './useTheme'
export { useSoundEffects } from './useSoundEffects'
export { useResponsiveState } from './useResponsiveState'
export { useGame } from './useGame'
export { useKeyboardControls } from './useKeyboardControls'
export { useAppScreens } from './useAppScreens'

// ❌ NO SERVICES (moved to infrastructure/)
// ❌ NO DIAGNOSTICS (moved to infrastructure/)
// ❌ NO DEVICE UTILS (moved to infrastructure/)
```

---

### Phase 2 Summary

**Outcome**:
- ✅ PlatformApi contract established (single source of capability definitions)
- ✅ All platforms (web, electron, capacitor) implement same contract
- ✅ All platform capabilities accessible via `resolvePlatformApi().xxx`
- ✅ Services moved to infrastructure layer
- ✅ App layer focused on composition + hooks only
- ✅ Features can switch platforms without knowing implementation details
- ✅ New platform? Just add adapter; no feature code changes needed

---

---

## Validation Checklist (Phases 1 & 2)

Before moving to phases 3-6, verify:

### Domain Layer
- [ ] `src/domain/index.ts` exports ONLY: types, constants, rules, ai, board
- [ ] No imports from `src/app`, `src/ui`, `src/infrastructure` in domain files
- [ ] All domain files compile (`pnpm typecheck`)

### Platform Contracts
- [ ] `src/infrastructure/platform/contracts/types.ts` complete and typed
- [ ] All 5 adapters (browser, capacitor, electron) compile
- [ ] `resolvePlatformApi()` returns correct platform type
- [ ] All services refactored to consume `PlatformApi`

### Barrels
- [ ] `src/domain/index.ts` updated
- [ ] `src/app/index.ts` updated
- [ ] `src/infrastructure/platform/index.ts` created
- [ ] `src/infrastructure/index.ts` created

### Imports
- [ ] All files updated to import from new locations
- [ ] No broken imports (`pnpm check` passes)
- [ ] All path aliases working (`@/domain`, `@/app`, `@/infrastructure`)

### Build
- [ ] `pnpm validate` passes (check + build)
- [ ] No TypeScript errors
- [ ] No ESLint violations
- [ ] No missing dependencies

---

---

## Implementation Order (Phases 1 & 2)

### Step 1: Prepare Directories
1. Create `src/infrastructure/` and all subdirs
2. Create `src/ui/theme/tokens/`
3. Create `src/assets/sprites/`

### Step 2: Move Phase 1 Files
1. Move `domain/responsive.ts` → `infrastructure/platform/responsive.ts`
2. Move `domain/layers.ts` → `ui/theme/tokens/layers.ts`
3. Move `domain/sprites.ts` → `assets/sprites/registry.ts`
4. Move `domain/themes.ts` → `ui/theme/themeRegistry.ts`

### Step 3: Update Phase 1 Barrels
1. Update `src/domain/index.ts` (remove 4 exports)
2. Create barrels in new directories

### Step 4: Update Phase 1 Imports
1. Find & replace all imports (16 files affected)
2. Run `pnpm check` — verify zero errors

### Step 5: Create Phase 2 Platform Contracts
1. Create `src/infrastructure/platform/contracts/types.ts`
2. Create 3 adapters (browser, capacitor, electron)
3. Create detection + resolution

### Step 6: Move Phase 2 Services
1. Move storage, diagnostics, haptics, audio to infrastructure

### Step 7: Refactor Phase 2 Hooks
1. Update hooks to consume `PlatformApi`
2. Update app barrel exports

### Step 8: Test & Validate
1. `pnpm validate` passes
2. `pnpm test` passes (if tests exist)
3. Manual spot checks on key components

---

---

## Files Summary

### Phase 1: Files to Move (4 total)
- `src/domain/responsive.ts` → `src/infrastructure/platform/responsive.ts`
- `src/domain/layers.ts` → `src/ui/theme/tokens/layers.ts`
- `src/domain/sprites.ts` → `src/assets/sprites/registry.ts`
- `src/domain/themes.ts` → `src/ui/theme/themeRegistry.ts`

### Phase 1: Barrels to Create (4 total)
- `src/infrastructure/platform/index.ts`
- `src/ui/theme/tokens/index.ts`
- `src/ui/theme/index.ts` (update if exists)
- `src/assets/sprites/index.ts`

### Phase 1: Files to Update (16 total)
- All files importing from `@/domain/responsive`, `@/domain/layers`, `@/domain/sprites`, `@/domain/themes`

### Phase 2: Files to Create (8 total)
- `src/infrastructure/platform/contracts/types.ts`
- `src/infrastructure/platform/adapters/browser/index.ts`
- `src/infrastructure/platform/adapters/capacitor/index.ts`
- `src/infrastructure/platform/adapters/electron/index.ts`
- `src/infrastructure/platform/detection.ts`
- `src/infrastructure/platform/resolvePlatformApi.ts`
- `src/infrastructure/index.ts`
- [Others per adapter completeness]

### Phase 2: Files to Move (4 total)
- `src/app/storageService.ts` → `src/infrastructure/storage/persistence.ts`
- `src/app/crashLogger.ts` → `src/infrastructure/diagnostics/crashLogger.ts`
- `src/app/haptics.ts` → `src/infrastructure/haptics/haptics.ts`
- `src/app/sounds.ts` → `src/infrastructure/audio/sounds.ts`

### Phase 2: Files to Refactor (8+ total)
- All hooks that directly use browser/platform APIs
- All services moving to infrastructure

---

## Ready to Execute?

Once you approve this plan, I will:
1. ✅ Execute all file moves
2. ✅ Create all new directories & barrels
3. ✅ Update all imports (zero broken refs)
4. ✅ Run `pnpm validate` to prove it works
5. ✅ Create phase 1 commit
6. ✅ Create phase 2 commit
7. ✅ Show you the results

**Estimated time to complete phases 1+2**: 30-45 minutes

**Commits**: 2 (one per phase, each ~50-100 lines of diff)

---

**Status**: Awaiting approval to execute. ✅
