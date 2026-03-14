# Comprehensive Governance Gaps Analysis

> **Scope**: Architectural oversights beyond design tokens. Identifies 20+ missing governance areas.
> **Authority**: Candidates for new AGENTS.md sections § 24–§ 30.
> **Status**: Audit of governance coverage vs. modern application needs.

---

## Executive Summary

Your governance is **excellent for component architecture, responsiveness, and build systems**, but lacks comprehensive coverage for:

1. **Testing & Quality** — No test pyramid, integration strategy, coverage targets
2. **Data State Management** — No philosophy on Context vs hooks vs external state
3. **Error Handling** — Beyond crashLogger, no error recovery or user-facing error patterns
4. **Performance Metrics** — No Web Vitals targets, performance budgets, or profiling governance
5. **Async Data Fetching** — No patterns for API calls, loading states, error states
6. **Full Accessibility (WCAG)** — Only contrast covered; missing keyboard nav, screen readers, semantics
7. **Security** — No XSS, CSP, input sanitization, secrets governance
8. **Git & Versioning** — No commit message standards, branching strategy, SemVer rules
9. **Component Lifecycle** — No guidelines on useEffect, useCallback, useMemo, dependency arrays
10. **Form Validation** — No patterns for form state, validation rules, error display
11. **Modal/Dialog System** — Beyond settings modal, no general popover/dialog/drawer patterns
12. **Analytics/Telemetry** — No event tracking, user analytics, instrumentation patterns
13. **Internationalization (i18n)** — No multi-lang support strategy if needed
14. **Monorepo Scaling** — 25 projects, but no cross-project consistency rules, breaking change prevention
15. **Animation Governance** — Animation performance, `prefers-reduced-motion`, spring physics
16. **Mobile Gestures** — Swipe, pinch, long-press patterns for touch input
17. **Service Worker/PWA** — Offline-first strategy, caching policy, update handling
18. **Browser Compatibility** — No target browser list, polyfill strategy
19. **Type Safety Strictness** — No rules on `any` usage, strict mode governance
20. **CSS Specificity & Cascade** — CSS modules exist, but no inheritance hierarchy rules
21. **Component Composition Patterns** — Render props, compound components, slot patterns
22. **Naming Conventions** — Limited to files; no function/variable/constant naming standards
23. **Documentation Standards** — No JSDoc requirements, API documentation, inline comments
24. **Build Output Validation** — No runtime type checking, tree-shaking verification
25. **Dependency Governance (Expanded)** — CVE scanning, outdated package detection, license compliance

---

## Category 1: Testing & Quality Assurance (Moderate Priority)

### Gap 1.1: No Test Pyramid Governance

**Current State**:
- ✅ Vitest configured with coverage reporting
- ✅ `pnpm test` script exists
- ❌ No test pyramid definition (unit vs integration vs E2E)
- ❌ No required coverage thresholds
- ❌ No integration test strategy
- ❌ No E2E test patterns

**Example Issue**:
```typescript
// ❓ Should this be a unit test, integration test, or E2E test?
test('useGame calculates board state correctly', () => {
  // ... but how deep? Does it test rendering? API calls? Just logic?
})
```

**Proposed Governance** (`§ 24. Testing & Quality`):
- **Unit Tests** (domain layer only): Pure functions, rules, AI logic — `src/domain/**/*.test.ts`
- **Integration Tests** (app + domain): Hooks, context providers, services — `src/app/**/*.test.ts`
- **Component Tests** (UI + app + domain): Atoms, molecules, organisms — `src/ui/**/*.test.tsx`
- **E2E Tests** (optional): Full user workflows with test harness

**Coverage Targets**:
- Domain: ≥ 90% (pure logic, critical)
- App: ≥ 80% (hooks, context)
- UI: ≥ 60% (presentation, lower priority)
- Overall: ≥ 75%

---

### Gap 1.2: No Integration Test Strategy

**Missing**:
- How to test hooks in isolation (useGame, useResponsiveState, useTheme)
- How to test context providers with consumers
- How to test services (storageService, crashLogger)
- Mock strategies for APIs, localStorage, workers

**Example**:
```typescript
// ❓ How do you test useGame without full App tree?
test('useGame updates board on move', () => {
  // Do we render a fake component? Use renderHook? What about context?
})
```

---

### Gap 1.3: No Component Testing Library Patterns

**Missing**:
- `@testing-library/react` usage patterns (user-centric vs implementation)
- Query strategy (getBy vs queryBy vs findBy)
- Accessibility testing integration
- Snapshot testing governance (when to use, when not)

---

## Category 2: Data & State Management (High Priority)

### Gap 2.1: No State Management Philosophy

**Current State**:
- ✅ React Context for theme, sound, app screens
- ✅ React hooks for game logic (`useGame`), responsive state
- ❌ **No guidance on WHEN to use Context vs hooks vs external state**

**Example Confusion**:
```typescript
// Should this be:
// A) Local component state (useState)?
// B) App hook (useGameState)?
// C) Context (GameContext)?
// D) External store?

const [score, setScore] = useState(0)  // But should it persist? Share across screens?
```

**Proposed Governance** (`§ 24. State Management`):

| State Type | Where | Tool | Persistence | Share | Boundary |
|---|---|---|---|---|---|
| **UI-only** (hover, focus, open/close) | Component | `useState` | No | No | Single component |
| **Feature Logic** (game board, moves, validation) | App hook | `useGame()` | Yes | Within app | Organism |
| **Global** (theme, sound, user prefs) | Context | `ThemeContext` | Yes | App-wide | Root provider |
| **Complex/Async** (API cache, sync) | Custom hook + Context | `useApi()` + `CacheContext` | Conditional | Conditional | Subtree |

---

### Gap 2.2: No Async Data Fetching Governance

**Missing**:
- When to use fetch vs external HTTP client
- Loading, error, success state patterns
- Cache invalidation strategy
- Request deduplication (if multiple components request same data)
- Abort controller usage for cleanup

**Example**:
```typescript
// ❓ What's the standard pattern?
const [leaderboard, setLeaderboard] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  fetch('/api/leaderboard')
    .then(r => r.json())
    .then(d => setLeaderboard(d))
    .catch(e => setError(e))
    .finally(() => setLoading(false))
}, [])
```

**Proposed Pattern**:
```typescript
interface AsyncState<T> {
  status: 'idle' | 'loading' | 'success' | 'error'
  data: T | null
  error: Error | null
}

// Reusable hook
const useAsyncData = <T,>(
  url: string,
  deps: DependencyList = []
): AsyncState<T> => {
  // Implementation with AbortController, error handling, etc.
}
```

---

## Category 3: Error Handling & Recovery (High Priority)

### Gap 3.1: No Error Boundary Governance

**Current State**:
- ✅ `crashLogger.ts` exists for logging
- ❌ No error boundaries defined
- ❌ No error UI patterns (toast, fallback, retry)
- ❌ No error recovery strategies

**Missing**:
```typescript
// ❓ How do you catch and display rendering errors?
// What does the error UI show to users?
// Can they retry? Clear cache? Report?
```

**Proposed**:
- Root `<ErrorBoundary>` catching all rendering errors
- Per-organism error boundaries for feature isolation
- User-facing error UI with recovery actions (retry, clear cache, restart app)

---

### Gap 3.2: No Error Classification

**Missing**:
- User errors (form validation, constraints) vs system errors (network, crash)
- Recoverable errors (timeout, rate limit) vs fatal errors (security, data corruption)
- Error recovery patterns per category

**Example**:
```typescript
// ❓ How do you handle a 400 vs 500 vs 0 (network) error?
// Each requires different UX:
// 400 → user error, show form feedback
// 500 → system error, show toast, offer retry
// 0 → offline, show banner, queue for retry
```

---

## Category 4: Performance & Web Vitals (High Priority)

### Gap 4.1: No Performance Budgets

**Missing**:
- **LCP** (Largest Contentful Paint) target — e.g., <2.5s
- **FID** (First Input Delay) target — e.g., <100ms
- **CLS** (Cumulative Layout Shift) target — e.g., <0.1
- **TTFB** (Time to First Byte) target — e.g., <500ms
- **Bundle size budget** — e.g., <150KB gzipped

**Current State**:
- ✅ Vite configured for fast builds
- ❌ No metrics governance
- ❌ No CI check for performance regressions

**Proposed Governance** (`§ 24. Performance`):
```typescript
// .performance-budget.json
{
  "bundles": [
    { "name": "index", "maxSize": "150kb" },
    { "name": "theme--chiba", "maxSize": "5kb" }
  ],
  "thresholds": {
    "interactions": { "interactive": 3000 }
  }
}
```

---

### Gap 4.2: No Render Performance Rules

**Missing**:
- When to use `useMemo`, `useCallback` (no guidance)
- How to identify unnecessary re-renders
- Component composition for performance (when to split)
- Animation performance (GPU-accelerated transforms, will-change)

---

## Category 5: Accessibility (WCAG) — Beyond Contrast (High Priority)

### Gap 5.1: No Keyboard Navigation Governance

**Current State**:
- ✅ Input controls handled via `useKeyboardControls`
- ✅ Focus management in hamburger menu
- ❌ **No comprehensive keyboard navigation rules**

**Missing**:
- Tab order management (`tabIndex`, logical flow)
- Focus indicators (`:focus-visible` styling)
- Keyboard shortcuts documentation
- Escape key behavior (modal close, cancel)
- Arrow key navigation (menus, lists, grids)

**Proposed**:
```typescript
// WCAG 2.1 AA Requirements for keyboard access:
// - All interactive elements reachable via Tab
// - Logical tab order (usually source order)
// - Focus indicator visible (min 3px outline)
// - Escape key closes modals
// - Arrow keys navigate menu items
// - Enter/Space activate buttons
```

---

### Gap 5.2: No Screen Reader Governance

**Missing**:
- ARIA labels (`aria-label`, `aria-labelledby`)
- ARIA roles when semantic HTML insufficient
- ARIA live regions for dynamic content
- Image alt text requirements
- Heading hierarchy rules

**Example**:
```tsx
// ❓ Should all buttons have aria-label?
// Only icon buttons? How specific?
<button>Click me</button>  // ✅ visible label
<button aria-label="Open menu">☰</button>  // ✅ icon + aria-label

// ❓ What roles for game elements?
<div role="grid">  // Game board as grid?
  <div role="gridcell">  // Cell?
    ●
  </div>
</div>
```

---

### Gap 5.3: No Color-Only Semantics Rule

**Proposed**:
```css
/* ❌ BAD: Meaning conveyed by color alone */
.success { color: green; }
.error { color: red; }

/* ✅ GOOD: Color + icon + text */
.success::before { content: '✓ '; color: green; }
.error::before { content: '✗ '; color: red; }
```

---

## Category 6: Security (Critical Priority)

### Gap 6.1: No Input Sanitization Governance

**Missing**:
- XSS prevention rules
- When to sanitize user input (always)
- Safe HTML rendering (if needed)

**Example**:
```tsx
// ❌ UNSAFE: User input directly in JSX
const username = props.username  // untrusted
return <div>{username}</div>  // Safe in modern React (escaped)

// ❓ But what about setAttribute, innerHTML?
const el = document.getElementById('target')
el.innerHTML = userInput  // UNSAFE! XSS vulnerability

// ✅ SAFE: React escapes by default, or use DOMPurify
```

---

### Gap 6.2: No Secrets Management Governance

**Missing**:
- Where API keys go (environment variables only)
- `.env.local` gitignored strategy
- Public vs private URLs
- OAuth/token handling (if auth used)

---

### Gap 6.3: No CSP (Content Security Policy) Governance

**Missing**:
- Do you enforce CSP headers?
- What inline scripts are allowed?
- Image source restrictions?

---

## Category 7: Git & Versioning (Moderate Priority)

### Gap 7.1: No Commit Message Standards

**Current State**:
- ✅ Pre-commit hooks enforce formatting/linting
- ❌ **No conventional commit format** (feat:, fix:, chore:, etc.)
- ❌ No issue referencing requirement (#123)
- ❌ No scope/changelog generation

**Proposed** (Conventional Commits):
```
feat(theme): add high-contrast color palette

- Add new theme 'high-contrast' with WCAG AAA compliance
- Update theme selector to include new option
- Closes #142
```

---

### Gap 7.2: No Semantic Versioning Governance

**Missing**:
- How to version libraries (if scaffolding becomes reusable)
- Breaking change detection
- Changelog management

---

## Category 8: Component Lifecycle (Moderate Priority)

### Gap 8.1: No useEffect/useCallback/useMemo Guidance

**Missing**:
```typescript
// ❓ When to use these?
// useEffect — side effects (fetches, subscriptions, DOM)
// useCallback — prevent function recreation (optimization)
// useMemo — expensive computations (memoization)

// But WHEN is it needed?
const expensiveValue = useMemo(() => calculateBig(data), [data])  // When to use?
const memoizedCallback = useCallback(() => ..., [deps])  // When to use?
```

**Proposed**:
- **Don't use `useMemo`/`useCallback` by default** (premature optimization)
- Use only if:
  - Component re-renders frequently
  - Expensive computation / function creation
  - Profiler shows regression
- Profile first, optimize later

---

### Gap 8.2: No Dependency Array Governance

**Missing**:
- How to determine correct dependencies
- Linting rules (`react-hooks/exhaustive-deps`)
- Stale closure prevention

---

## Category 9: Form Validation & Submission (Moderate Priority)

### Gap 9.1: No Form State Pattern

**Missing**:
```typescript
// ❓ Standard pattern for form state?
const [formState, setFormState] = useState({
  username: '',
  email: '',
  errors: {}
})

// Then what? Custom handler for each field?
const handleChange = (field, value) => {
  setFormState(prev => ({...prev, [field]: value}))
}

// Validation on blur? On submit? Both?
```

**Proposed Pattern**:
```typescript
// Centralized form hook
const useForm = <T,>(
  initialValues: T,
  validate: (values: T) => Record<string, string>,
  onSubmit: (values: T) => Promise<void>
) => ({
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  handleChange: (e: ChangeEvent) => void
  handleBlur: (e: FocusEvent) => void
  handleSubmit: (e: FormEvent) => void
  isSubmitting: boolean
})
```

---

## Category 10: Modal/Dialog Systems (Moderate Priority)

### Gap 10.1: Beyond Settings Modal — General Dialog Patterns

**Current State**:
- ✅ Settings modal exists
- ❌ **No patterns for other dialogs** (confirm, alert, drawer, popover)

**Missing**:
- Alert dialog (notification only, one button)
- Confirmation dialog (yes/no, two buttons)
- Drawer (side panel for mobile)
- Popover (positioned dropdown, not full-screen)
- Toast (temporary notification)

**Proposed**:
```typescript
interface DialogConfig {
  type: 'alert' | 'confirm' | 'drawer' | 'popover'
  title: string
  message: string
  buttons?: DialogButton[]
  position?: 'center' | 'bottom' | 'top-right'  // per type
}
```

---

## Category 11: Analytics & Telemetry (Low Priority, Context-Dependent)

### Gap 11.1: No Event Tracking Governance

**Missing** (if analytics needed):
- What events to track (user interactions, errors, performance)
- Event naming convention
- Payload structure
- Privacy compliance (GDPR, CCPA)

**Example**:
```typescript
// ❓ How do you track events consistently?
trackEvent('game_started', { difficulty: 'hard', timestamp: Date.now() })
trackEvent('move_made', { row: 0, col: 1, duration: 2500 })
```

---

## Category 12: Internationalization (i18n) (Low Priority, Context-Dependent)

**Missing** (if multi-language):
- Translation file organization (`public/locales/*.json`)
- Namespace pattern (`game`, `ui`, `errors`)
- RTL language support
- Date/number/currency formatting per locale
- Lazy-loading translations per language

---

## Category 13: Monorepo Scaling (Critical for 25 Projects)

### Gap 13.1: No Cross-Project Consistency Rules

**Current State**:
- 25 projects using same scaffolding
- ❌ **No rules preventing drift** (version mismatches, pattern divergence)
- ❌ **No shared package strategy** (shared utilities across projects)
- ❌ **No breaking change prevention** (how to update all projects safely)

**Proposed Governance** (`§ 25. Monorepo Scaling`):
- **Shared domain tokens** — all projects use same `src/domain/` patterns
- **Shared UI library** — atoms, molecules in `packages/ui-kit/` or symlinked
- **Version lock** — all projects pin same React, Vite, TypeScript versions
- **CI/CD sync** — template updates push to all projects
- **Breaking change protocol** — major changes require migration guide + tag

---

### Gap 13.2: No Shared Package Management

**Missing**:
```
projects/
├── nim/
├── snake/
├── pinwheel/
└── shared-ui/  ← Where do shared atoms live?
    ├── src/ui/atoms/
    ├── src/domain/
    └── package.json
```

---

## Category 14: Animation & Motion (Low Priority)

### Gap 14.1: No Animation Performance Governance

**Missing**:
- When to use CSS vs JS animations
- GPU-accelerated properties (transform, opacity only)
- Avoid repaints (avoid: background, border, width, height)
- `prefers-reduced-motion` implementation rule

**Proposed**:
```css
/* ✅ GOOD: GPU-accelerated */
.animate { animation: slide 300ms ease; }
@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(0); } }

/* ❌ BAD: Repaints (avoid) */
.animate { animation: slide 300ms ease; }
@keyframes slide { from { width: 0; } to { width: 100%; } }

/* ✅ GOOD: Respect motion preference */
@media (prefers-reduced-motion: reduce) {
  .animate { animation: none; }
}
```

---

## Category 15: Mobile Gestures (Moderate Priority)

### Gap 15.1: No Touch Gesture Patterns

**Missing**:
- Swipe detection (left, right, up, down, threshold)
- Long-press (vs tap)
- Pinch-to-zoom gesture
- Double-tap
- Haptic feedback (already have `haptics.ts`, but no usage rules)

**Example**:
```typescript
// ❓ Standard way to handle swipe?
const [touchStart, setTouchStart] = useState(0)
const [touchEnd, setTouchEnd] = useState(0)

const handleTouchStart = (e) => setTouchStart(e.changedTouches[0].clientX)
const handleTouchEnd = (e) => {
  setTouchEnd(e.changedTouches[0].clientX)
  const distance = touchStart - touchEnd

  if (distance > 50) {
    // Swiped left
  } else if (distance < -50) {
    // Swiped right
  }
}

// But repeat across every component? Need a hook!
```

**Proposed**:
```typescript
const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => ({
  onTouchStart: (e) => ...,
  onTouchEnd: (e) => ...,
})
```

---

## Category 16: Service Worker & PWA (Moderate Priority)

### Gap 16.1: No Offline-First Governance

**Current State**:
- ✅ `src/app/useOnlineStatus.ts` exists
- ✅ `public/sw.js` (service worker) exists
- ❌ **No caching strategy** (IDB vs localStorage vs memory)
- ❌ **No update handling** (new app version, user notification)
- ❌ **No offline-first data sync** (queue writes until online)

**Proposed**:
```typescript
// Caching strategy per request:
// static assets (app.js, css) → cache-first (load from cache, fallback to network)
// API calls → network-first (load from network, fallback to cache)
// HTML → network-first (always fresh, prevent stale app)

// Data sync on reconnect:
// Queue writes (saveGame, postLeaderboard) while offline
// Sync on online event (onOnline, web-app-resume)
```

---

## Category 17: Browser Compatibility (Moderate Priority)

### Gap 17.1: No Target Browser List

**Missing**:
- What browsers are supported? (Chrome 90+? Safari 12+?)
- Polyfill strategy (if supporting older browsers)
- Feature detection (navigator.onLine, fetch, etc.)

**Proposed**:
```json
{
  "browserList": [
    "last 2 versions",
    "Firefox ESR",
    "iOS 12+"
  ]
}
```

---

## Category 18: Type Safety Strictness (Moderate Priority)

### Gap 18.1: No `any` Usage Rules

**Missing**:
```typescript
// ❓ Is this ever acceptable?
const value: any = someUnknown  // Bypass type safety

// What about unknownFunctionParameterType?
const handler = (x: any) => x * 2  // Should be (x: number) or <T>(x: T) => T
```

**Proposed**:
- ❌ **Never use `any`** for parameters, return types, or variables
- Use `unknown` if type is truly unknown (requires type guard)
- Use generics `<T>` for polymorphism
- Exception: third-party untyped libraries (wrap in proper types)

---

## Category 19: CSS Specificity & Cascade (Low Priority)

### Gap 19.1: No Inheritance Hierarchy Rules

**Current State**:
- ✅ CSS Modules prevent global collisions
- ❌ **No guidance on CSS var inheritance**, cascade, specificity

**Missing**:
```css
/* ❓ Is this hierarchy clear? */
:root { --color-primary: blue; }
[data-theme='dark'] { --color-primary: lightblue; }
.Button { color: var(--color-primary); }
.Button.disabled { color: var(--color-primary-disabled); }
```

---

## Category 20: Documentation Standards (Moderate Priority)

### Gap 20.1: No JSDoc Governance

**Missing**:
```typescript
// ❓ Should all functions have JSDoc?
/**
 * Validates a move on the game board.
 * @param board The current board state
 * @param move The move to validate
 * @returns true if move is valid, false otherwise
 * @throws MoveError if move is invalid
 */
export const isValidMove = (board: Board, move: Move): boolean => {
  // ...
}
```

**Proposed**:
- Public API functions (exported from `index.ts`): **mandatory JSDoc**
- Internal functions (`_validateMove`): optional
- Include what, why, parameters, return, throws, examples for complex logic

---

## Category 21: Component Composition Patterns (Moderate Priority)

### Gap 21.1: No Advanced Patterns Governance

**Missing**:
- Compound component pattern (e.g., `<Select><Option>...</Option></Select>`)
- Render prop pattern (children as function)
- Slot pattern (component holes)
- When to use vs atomic design hierarchy

---

## Category 22: Naming Conventions (Low Priority)

### Gap 22.1: No Variable/Constant Naming Standards

**Missing**:
```typescript
// Convention unclear:
const x = 5  // ❌ meaningless
const count = 5  // ✅
const TILE_SIZE = 32  // ✅ constants UPPER_CASE
const isBoardFull = true  // ✅ boolean is*/has*/should* prefix
const getTileAt = () => {}  // ✅ getter get* prefix
const setTileAt = () => {}  // ✅ setter set* prefix
```

---

## Category 23: Build Output Validation (Moderate Priority)

### Gap 23.1: No Runtime Type Checking

**Missing**:
- Runtime validation of API responses (before using)
- Tree-shaking verification (unused code removed)
- Bundle analysis (what's included/why)

**Proposed**:
```typescript
// Runtime validation for untrusted data
import { z } from 'zod'  // or ajv

const LeaderboardSchema = z.array(z.object({
  rank: z.number(),
  name: z.string(),
  score: z.number(),
}))

const response = await fetch('/api/leaderboard')
const data = await response.json()
const validated = LeaderboardSchema.parse(data)  // Throws if invalid
```

---

## Category 24: Dependency Governance (Expanded) (Moderate Priority)

### Gap 24.1: No CVE Scanning or License Compliance

**Missing**:
```bash
# ❓ How do you know if a dependency has a vulnerability?
pnpm audit  # Only manual
npm audit fix  # Manual

# Proposed: CI check
CI: pnpm audit --fail  # Fail build if vulnerabilities found
```

**Missing**:
- License compliance checking (GPL, MIT, proprietary)
- Outdated dependency detection
- Dependency update automation

---

## Summary Table: Gaps by Severity

| Category | Gap | Severity | Effort | Impact |
|----------|-----|----------|--------|--------|
| **Testing** | No test pyramid, integration patterns | Medium | Med | High awareness needed |
| **State Mgmt** | No Context vs hooks philosophy | High | Low | Prevents confusion |
| **Async Data** | No fetch/loading patterns | High | Med | Required for any API usage |
| **Error Handling** | Beyond crashLogger | High | Med | Critical for UX |
| **Performance** | No Web Vitals targets, budgets | High | Med | Metrics-driven development |
| **Accessibility** | Only contrast; missing WCAG | High | High | Legal/ethical requirement |
| **Security** | No input sanitization, secrets, CSP | Critical | High | Risk mitigation |
| **Git Standards** | No commit format, SemVer | Medium | Low | Code quality, history |
| **Component Lifecycle** | No useEffect/useMemo guidance | Medium | Low | Prevents bloat, performance |
| **Form Validation** | No patterns | Medium | Med | Common task, consistency |
| **Modals/Dialogs** | Only settings modal | Medium | Med | Reusable system needed |
| **Analytics** | No governance | Low | Low | Context-dependent |
| **i18n** | No multi-language support | Low | High | Only if needed |
| **Monorepo Scaling** | No cross-project rules (25 projects!) | Critical | High | Prevent drift, breaking changes |
| **Animation** | No perf, motion rules | Low | Low | Polish, performance |
| **Mobile Gestures** | No patterns | Medium | Med | Mobile-first needed |
| **Service Worker** | No caching, offline strategy | Medium | Med | PWA capability |
| **Browser Support** | No target list | Medium | Low | Polyfill decisions |
| **Type Safety** | No strict rules | Medium | Low | Code quality |
| **CSS Specificity** | No cascade rules | Low | Low | Style conflicts |
| **Documentation** | No JSDoc standards | Low | Low | Maintainability |
| **Composition** | No pattern guidance | Low | Low | Pattern library |
| **Naming** | Minimal standards | Low | Low | Consistency |
| **Build Validation** | No runtime checks | Medium | Med | Reliability |
| **Dep Governance** | No CVE/license scanning | Medium | Low | Security, legal |

---

## Implementation Priority Roadmap

### **Phase 1: Critical (Weeks 1-2)**
- [ ] § 24: Testing & Quality (test pyramid, coverage targets)
- [ ] § 25: State Management Philosophy (Context vs hooks)
- [ ] § 26: Monorepo Scaling (25 projects, breaking changes)
- [ ] § 27: Security (input sanitization, XSS prevention)

### **Phase 2: High-Impact (Weeks 3-4)**
- [ ] § 28: Async Data Patterns (fetch, loading, error states)
- [ ] § 29: Full Accessibility (WCAG keyboard, screen readers, semantics)
- [ ] § 30: Error Handling & Recovery (error boundaries, user messaging)
- [ ] § 31: Performance (Web Vitals targets, budgets)

### **Phase 3: Maintenance (Weeks 5-6)**
- [ ] § 32: Git & Commit Standards (conventional commits)
- [ ] § 33: Form Validation Patterns
- [ ] § 34: Modal/Dialog System (alert, confirm, drawer, popover)
- [ ] § 35: Component Lifecycle (useEffect, useCallback, useMemo guidance)

### **Phase 4: Polish (Weeks 7-8)**
- [ ] § 36: Mobile Gestures (swipe, long-press, haptics)
- [ ] § 37: Service Worker & PWA (offline-first, caching strategy)
- [ ] § 38: Documentation Standards (JSDoc)
- [ ] § 39: Type Safety Strictness (no `any` rule)
- [ ] § 40: Animation Governance (performance, motion preferences)

### **Phase 5: Optional (As Needed)**
- [ ] i18n Governance (if multi-language)
- [ ] Analytics Governance (if telemetry needed)
- [ ] Browser Compatibility (target list, polyfills)
- [ ] CSS Specificity Rules (cascade hierarchy)
- [ ] Naming Conventions (variables, constants)
- [ ] Component Composition Patterns (compound, render props, slots)
- [ ] Build Output Validation (runtime type checking)
- [ ] Dependency CVE Scanning (security scanning, license compliance)

---

## Recommendations

### **Immediate Actions** (This Week)
1. **Create § 24–25** in AGENTS.md (testing, state mgmt)
2. **Create `.github/instructions/09-testing.instructions.md`** (test pyramid, patterns)
3. **Create `.github/instructions/10-state-management.instructions.md`** (Context vs hooks)
4. **Security audit** — CVE scanning, input sanitization review

### **Short-Term** (Next Month)
1. Implement state management checklist across all 25 projects
2. Add testing infrastructure (integration test examples)
3. Document async data patterns (fetch wrapper, useAsyncData hook)
4. Security hardening (CSP headers if applicable)

### **Medium-Term** (Quarter)
1. Add performance budget enforcement to CI
2. Accessibility audit (WCAG mapping)
3. Monorepo scaling rules (lock versions, shared packages)
4. Service Worker caching strategy

### **Long-Term** (As Projects Grow)
1. Form library (validation, submission)
2. Modal/Dialog system (reusable across 25 projects)
3. Analytics system (if needed)
4. i18n framework (if multi-language)

---

## Files to Create

- `AGENTS.md` additions: § 24–40 (phases as per priority)
- `.github/instructions/09-testing.instructions.md`
- `.github/instructions/10-state-management.instructions.md`
- `.github/instructions/11-error-handling.instructions.md`
- `.github/instructions/12-async-data.instructions.md`
- `.github/instructions/13-accessibility.instructions.md`
- `.github/instructions/14-security.instructions.md`
- `.github/instructions/15-performance.instructions.md`
- `.github/instructions/16-git-standards.instructions.md`

---

## References

- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)
- [React Patterns](https://react.dev/learn)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OWASP](https://owasp.org/www-project-top-ten/) (security)

