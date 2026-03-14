# Strategic Governance Implementation Plan
## ESLint-First Approach + Minimal Package Additions

> **Scope**: Implement 6 priority governance areas using ESLint enhancement, custom patterns, and selective packages
> **Authority**: Maximizes tooling we already have; only adds dependencies with proven ROI
> **Status**: Ready for implementation

---

## Executive Summary

Your project **already has excellent accessibility tooling** (`eslint-plugin-jsx-a11y` installed and configured). 

**Strategic approach**:
1. **ESLint Enhancements** (no new packages)
   - Add `eslint-plugin-security` (XSS, input validation rules) — 1 package
   - Expand existing a11y rules
   - Add performance linting rules (custom)
   
2. **Git Standards** (minimal packages)
   - Add `commitizen` + `cz-conventional-changelog` — 2 packages (low effort, high ROI)
   
3. **Custom Patterns** (no packages)
   - Error Boundary component + hook
   - Mobile gesture hooks (swipe, long-press)
   - Performance monitoring hooks
   - Performance budget CI checks
   
4. **Instruction Files** (documentation only)
   - WCAG compliance guidelines
   - Security patterns
   - Performance monitoring
   - Error handling patterns
   - Git workflow

---

## Phase 1: ESLint Configuration Enhancement

### Current State
✅ `eslint-plugin-jsx-a11y` installed (comprehensive a11y coverage)
✅ `eslint-plugin-react-hooks` (dependency arrays checked)
✅ `typescript-eslint` (type safety)
✅ Architecture boundaries enforced
❌ No security linting (XSS, unsanitized HTML, etc.)
❌ No performance budgeting checks
❌ No CSS-in-JS accessibility patterns

### Step 1.1: Add eslint-plugin-security (1 package)

**Installation**:
```bash
pnpm add -D eslint-plugin-security
```

**Why**:
- Detects common security vulnerabilities (XSS, crypto, RegExp DoS, etc.)
- Minimal bloat (single focused plugin)
- Catches dangerous patterns automatically
- Investment: 1 package, ~5 minutes to configure

**Enhanced eslint.config.js**:

```javascript
import securityPlugin from 'eslint-plugin-security'

export default [
  // ... existing config ...
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      // ... existing plugins ...
      security: securityPlugin,
    },
    rules: {
      // ... existing rules ...
      
      // ── Security (XSS, Injection, Crypto) ──
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-no-csrf-before-method-override': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-unvalidated-redirect': 'error',
      
      // React + DOM safety
      'react/no-danger': 'error',  // Catches dangerouslySetInnerHTML
      'react/no-danger-with-children': 'error',
    },
  },
]
```

### Step 1.2: Expand Accessibility Rules (no packages)

**Add missing a11y rules to ESLint**:

```javascript
rules: {
  // ... existing jsx-a11y rules ...
  
  // ── Additional Accessibility (WCAG 2.1 AA+) ──
  
  // Form accessibility
  'jsx-a11y/form-has-associated-label': ['error', { assert: 'either' }],
  
  // Focus management (keyboard nav)
  'jsx-a11y/no-noninteractive-tabindex': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',
  
  // Color contrast (requires external tool, but document requirement)
  // Note: `junit-a11y` can't detect contrast; manual review + accessibility testing tool
  
  // Interactive element requirements
  'jsx-a11y/click-events-have-key-events': 'error',
  'jsx-a11y/interactive-supports-focus': 'error',
  
  // Additional semantic rules
  'jsx-a11y/no-redundant-roles': 'error',
  'jsx-a11y/no-noninteractive-element-interactions': 'warn',
  'jsx-a11y/no-static-element-interactions': 'warn',
  
  // Custom rule: Ensure aria-label on icon buttons (can detect missing labels)
  // Document: Icon buttons MUST have either visible text or aria-label
}
```

**Document in instruction file**: Which components require `aria-label` and when.

### Step 1.3: Add Performance Linting Rules (no packages)

**Custom ESLint rules** (no external package, just configuration):

```javascript
rules: {
  // ── Performance & Bundle ──
  
  // React performance anti-patterns
  'react/require-render-return': 'error',
  'react/no-children-prop': 'error',
  'react/no-array-index-key': 'warn',  // Keys should not be array indices
  
  // Avoid `any` type (trade bundle size for type safety)
  '@typescript-eslint/no-explicit-any': 'error',  // Upgrade to error
  
  // Unnecessary re-renders
  'react-hooks/exhaustive-deps': 'error',  // Upgrade to error (find all missing deps)
  
  // Code style that impacts bundle size
  'prefer-const': 'error',
  'no-var': 'error',
  'eqeqeq': ['error', 'always'],
  
  // Avoid console in production (tree-shakes cleanly)
  'no-console': ['error', { allow: ['warn', 'error'] }],  // Upgrade dev to error
}
```

---

## Phase 2: Git Standards (Minimal Packages)

### Step 2.1: Add Conventional Commits with Commitizen

**Installation**:
```bash
pnpm add -D commitizen cz-conventional-changelog
```

**Why**:
- 2 small packages with massive clarity ROI
- Auto-generate changelogs (when ready)
- CI can validate commit format (prevent sneaky commits)
- Team consistency on what changed and why

**Setup**:

1. **Update package.json**:
```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  },
  "scripts": {
    "commit": "pnpm exec cz commit"
  }
}
```

2. **Create `.commitlintrc.cjs`** (enforce conventional commits):
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',      // New feature
        'fix',       // Bug fix
        'docs',      // Documentation changes
        'style',     // Code style changes (formatting, missing semicolons, etc.)
        'refactor',  // Code refactoring without changing functionality
        'perf',      // Performance improvements
        'test',      // Adding or updating tests
        'chore',     // Build, CI, dependencies, tooling
        'a11y',      // Accessibility improvements
        'security',  // Security fixes
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'scope-case': [2, 'always', 'lower-case'],
  },
}
```

3. **Update `.husky/commit-msg`** (enforce in pre-commit hook):
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx commitlint --edit "$1"
```

4. **Usage**:
```bash
# Instead of: git commit -m "add a11y rules"
pnpm commit

# Interactive prompt:
# ? Select the type of change: feat
# ? What is the scope? (eslint)
# ? Write a short description: add accessibility rules for WCAG compliance
# ? Provide a longer description: (optional)
# ? List any breaking changes: (none)
```

**Commit format enforced**:
```
feat(eslint): add accessibility rules for WCAG compliance

- Add eslint-plugin-security for XSS prevention
- Expand jsx-a11y rules for keyboard navigation
- Document aria-label requirements for icon buttons
- Closes #42

Reviewed-by: Team
```

---

## Phase 3: Custom Patterns (No Packages)

### 3.1: Error Boundary Pattern

**New file**: [`src/ui/organisms/ErrorBoundary.tsx`](src/ui/organisms/ErrorBoundary.tsx)

```typescript
import React, { ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, info: { componentStack: string }) => void
}

interface ErrorBoundaryState {
  error: Error | null
  retryCount: number
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, retryCount: 0 }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to crash logger
    if (this.props.onError) {
      this.props.onError(error, info)
    }
    console.error('ErrorBoundary caught:', error, info)
  }

  handleRetry = () => {
    this.setState(prev => ({
      error: null,
      retryCount: prev.retryCount + 1,
    }))
  }

  render() {
    if (this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      // Default fallback
      return (
        <div className={styles.errorContainer} role="alert">
          <h1>Something went wrong</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
            <br />
            {this.state.error?.stack}
          </details>
          <button onClick={this.handleRetry}>Try again</button>
        </div>
      )
    }

    return this.props.children
  }
}
```

**CSS** (`ErrorBoundary.module.css`):
```css
.errorContainer {
  padding: 2rem;
  background-color: var(--color-error-light);
  border: 2px solid var(--color-error);
  border-radius: 8px;
  font-family: var(--font-mono);
  color: var(--color-text);
}

.errorContainer h1 {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.errorContainer button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.errorContainer button:hover {
  background-color: var(--color-primary-hover);
}
```

**Usage** (wrap in App component):
```tsx
<ErrorBoundary
  onError={(error, info) => {
    crashLogger.error('React Error Boundary', error.message, {
      stack: error.stack,
      componentStack: info.componentStack,
    })
  }}
  fallback={(error, retry) => (
    <div style={{ padding: '2rem' }}>
      <h2>Error occurred</h2>
      <p>{error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  )}
>
  <GameBoard />
  <ResultsTable />
</ErrorBoundary>
```

### 3.2: Mobile Gesture Hooks

**New file**: [`src/app/useSwipeGesture.ts`](src/app/useSwipeGesture.ts)

```typescript
import { useRef, useCallback } from 'react'

interface SwipeConfig {
  threshold?: number  // Min distance (px) to register as swipe
  velocityThreshold?: number  // Min velocity to register as swipe
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export const useSwipeGesture = ({
  threshold = 50,
  velocityThreshold = 0.3,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: SwipeConfig) => {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      // Avoid treating long-press as swipe
      if (deltaTime > 1000) return

      // Calculate velocity (pixels per millisecond)
      const velocityX = Math.abs(deltaX) / deltaTime
      const velocityY = Math.abs(deltaY) / deltaTime

      // Determine primary direction (avoid diagonal ambiguity)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold && velocityX > velocityThreshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold && velocityY > velocityThreshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }
    },
    [threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
  )

  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd }
}
```

**Usage**:
```tsx
const GameBoard = () => {
  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    onSwipeLeft: () => moveCursor('right'),
    onSwipeRight: () => moveCursor('left'),
    onSwipeUp: () => moveCursor('down'),
    onSwipeDown: () => moveCursor('up'),
    threshold: 50,
  })

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'none' }}  // Prevent browser defaults
    >
      {/* Game board content */}
    </div>
  )
}
```

**New file**: [`src/app/useLongPress.ts`](src/app/useLongPress.ts)

```typescript
import { useRef, useCallback } from 'react'

interface LongPressConfig {
  duration?: number  // ms before triggering (default 500ms)
  onLongPress: () => void
  onLongPressEnd?: () => void
}

export const useLongPress = ({
  duration = 500,
  onLongPress,
  onLongPressEnd,
}: LongPressConfig) => {
  const timerRef = useRef<NodeJS.Timeout>()
  const pressStartedRef = useRef(false)

  const handleTouchStart = useCallback(() => {
    pressStartedRef.current = true
    timerRef.current = setTimeout(() => {
      if (pressStartedRef.current) {
        onLongPress()
      }
    }, duration)
  }, [duration, onLongPress])

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (pressStartedRef.current) {
      pressStartedRef.current = false
      if (onLongPressEnd) {
        onLongPressEnd()
      }
    }
  }, [onLongPressEnd])

  const handleMouseDown = useCallback(() => {
    handleTouchStart()
  }, [handleTouchStart])

  const handleMouseUp = useCallback(() => {
    handleTouchEnd()
  }, [handleTouchEnd])

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
  }
}
```

**Usage**:
```tsx
const { onTouchStart, onTouchEnd } = useLongPress({
  duration: 800,
  onLongPress: () => showContextMenu(),
  onLongPressEnd: () => hideContextMenu(),
})

return (
  <button onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    Hold me
  </button>
)
```

### 3.3: Performance Monitoring Hooks

**New file**: [`src/app/usePerformanceMetrics.ts`](src/app/usePerformanceMetrics.ts)

```typescript
import { useEffect } from 'react'

interface PerformanceMetrics {
  lcp?: number  // Largest Contentful Paint
  fid?: number  // First Input Delay (deprecated, use INP)
  cls?: number  // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  fcp?: number  // First Contentful Paint
}

declare global {
  interface Window {
    webVitals?: PerformanceMetrics
  }
}

export const usePerformanceMetrics = () => {
  useEffect(() => {
    if (!window.webVitals) {
      window.webVitals = {}
    }

    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      window.webVitals!.lcp = lastEntry.renderTime || lastEntry.loadTime
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
          window.webVitals!.cls = clsValue
        }
      }
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      if (entries.length > 0) {
        window.webVitals!.fcp = entries[0].startTime
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    return () => {
      lcpObserver.disconnect()
      clsObserver.disconnect()
      fcpObserver.disconnect()
    }
  }, [])

  return window.webVitals || {}
}

// Log metrics when user leaves page
export const logWebVitals = () => {
  if (typeof window === 'undefined') return

  window.addEventListener('beforeunload', () => {
    const metrics = window.webVitals || {}
    console.log('Web Vitals:', {
      lcp: `${metrics.lcp?.toFixed(0)}ms`,
      cls: metrics.cls?.toFixed(3),
      fcp: `${metrics.fcp?.toFixed(0)}ms`,
    })

    // Send to analytics if needed
    // analytics.track('web_vitals', metrics)
  })
}
```

---

## Phase 4: Instruction Files (Documentation)

### File: `.github/instructions/09-wcag-accessibility.instructions.md`

```markdown
# WCAG 2.1 AA Accessibility Governance

> **Authority**: Subordinate to AGENTS.md § 12
> **Scope**: Keyboard navigation, screen readers, semantic HTML, contrast

---

## 1. ESLint Enforcement

### Enabled Rules
- `jsx-a11y/*` — 30+ accessibility rules auto-checked
- `react/no-danger` — Prevents dangerouslySetInnerHTML
- `react/no-unescaped-entities` — Prevents HTML entity issues

### What's Enforced
- ✅ All buttons must be keyboard accessible (Tab)
- ✅ All interactive elements have focus indicators
- ✅ Links have descriptive text (not "click here")
- ✅ Images have alt text
- ✅ Forms have labels associated with inputs
- ✅ ARIA roles only on supported elements
- ✅ No positive tabIndex (natural tab order)

### Run checks:
```bash
pnpm lint  # ESLint a11y rules
```

---

## 2. Keyboard Navigation (Manual)

### Required: Tab Order
- All interactive elements reachable via Tab
- Logical tab order (usually DOM order, test with Tab key)
- Focus indicator visible (CSS `:focus-visible` styled)

### Required: Escape Key
- Modals close on Escape
- Menus close on Escape
- Focus returns to trigger element

### Required: Arrow Keys
- Menu navigation: up/down/left/right arrows
- List navigation: up/down arrows
- Not required for single inputs

### Implementation:
```tsx
<button
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  }}
>
  Open
</button>
```

---

## 3. Screen Readers (ARIA)

### Required: aria-label (Icon Buttons Only)
```tsx
// ❌ INACCESSIBLE
<button>☰</button>

// ✅ ACCESSIBLE
<button aria-label="Open menu">☰</button>
```

### Required: aria-labelledby (Complex Elements)
```tsx
<div id="instructions">How to play</div>
<div aria-labelledby="instructions">
  {/* Content explained by "How to play" heading */}
</div>
```

### Required: role (When Semantic HTML Insufficient)
```tsx
// ❌ BAD: generic div for button
<div onClick={...}>Submit</div>

// ✅ GOOD: actual button
<button onClick={...}>Submit</button>

// ✅ ACCEPTABLE: div with explicit role
<div role="button" onClick={...} onKeyDown={...}>
  Submit
</div>
```

### Required: aria-live (Dynamic Content)
```tsx
// Status updates on game board
<div aria-live="polite" aria-atomic="true">
  {gameStatus}  {/* Screen reader announces changes */}
</div>
```

---

## 4. Contrast Compliance (WCAG AA = 4.5:1)

### ESLint Cannot Detect Contrast
- Manual review or external tool required
- Use: WebAIM Contrast Checker, aXe DevTools, WAVE

### All Color Pairs Must Pass:
- Text on background: 4.5:1 minimum (AA), 7:1 (AAA)
- Large text (18pt+): 3:1 minimum (AA), 4.5:1 (AAA)
- UI components (borders, edges): 3:1 minimum

### Update theme implementation:
```typescript
// src/domain/colors.ts
validateContrast('#050505', '#00ff41')  // Returns ratio, passes status
// Document every color pair with its ratio
```

---

## 5. Semantic HTML

### Required: Proper Heading Hierarchy
```tsx
// ✅ GOOD
<h1>Main Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>

// ❌ BAD: Skip levels
<h1>Main Title</h1>
<h3>Subsection</h3>  {/* h2 missing */}
```

### Required: Form Labels
```tsx
// ✅ GOOD
<label htmlFor="username">Username</label>
<input id="username" type="text" />

// ❌ BAD: No label
<input type="text" placeholder="username" />
```

### Required: Alt Text on Images
```tsx
// ✅ GOOD
<img src="board.png" alt="3x3 game board with pieces" />

// ❌ BAD
<img src="board.png" />
```

---

## 6. Color-Alone Semantics (Forbidden)

### ❌ INACCESSIBLE
```css
.success { color: green; }
.error { color: red; }
```

### ✅ ACCESSIBLE
```css
.success::before { content: '✓'; color: green; }
.error::before { content: '✗'; color: red; }
/* Or use text: "Success", "Error" */
```

---

## 7. Focus Indicators

### All :focus Elements Must be Visible
```css
button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

/* Mobile touch doesn't show outline (ok) */
@media (pointer: coarse) {
  button:focus-visible {
    outline: none;
    background-color: var(--color-focus-bg);
  }
}
```

---

## 8. Testing Checklist

- [ ] Tab through entire page — all controls reachable
- [ ] Escape key closes all modals
- [ ] Focus visible on every interactive element
- [ ] No positive tabIndex (natural order)
- [ ] All buttons have text or aria-label
- [ ] All images have alt text
- [ ] Headings in logical order (no skips)
- [ ] Form fields have labels
- [ ] Contrast passes: Run WebAIM Contrast Checker
- [ ] Screen reader test: NVDA / JAWS / VoiceOver
- [ ] No color-alone meaning (icons/text required)

---
```

### File: `.github/instructions/10-security.instructions.md`

```markdown
# Security Governance

> **Authority**: AGENTS.md § 6
> **Scope**: XSS prevention, input sanitization, secrets management, CSP

---

## 1. ESLint Enforcement

### Rule: react/no-danger (Error)
```tsx
// ❌ FORBIDDEN: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ SAFE: React escapes by default
<div>{userContent}</div>
```

### Rule: security/detect-unsafe-regex (Error)
```typescript
// ❌ FORBIDDEN: Regex DoS vulnerability
const regex = /(a+)+$/  // Exponential backtracking

// ✅ SAFE: No exponential patterns
const regex = /^[a-z]+$/
```

### Rule: security/detect-unvalidated-redirect (Error)
```tsx
// ❌ FORBIDDEN: User input controls redirect
window.location = userProvidedUrl

// ✅ SAFE: Whitelist URLs
const ALLOWED_URLS = ['/', '/game', '/about']
if (ALLOWED_URLS.includes(url)) {
  window.location = url
}
```

---

## 2. Input Sanitization

### Rule: Always Escape User Input (React Default)
```tsx
// ✅ SAFE: React escapes all string interpolation
const username = props.username
<div>{username}</div>  // "<script>alert('xss')</script>" becomes harmless text

// ❌ UNSAFE: Direct innerHTML or setAttribute
element.innerHTML = userInput  // XSS vulnerability!
element.setAttribute('data-value', userInput)  // Safe in attributes, but risky

// ✅ SAFE: Use React, not DOM APIs
<div data-value={userInput}>{user}</div>
```

### Rule: Validate URLs
```tsx
// ❌ UNSAFE: User URL without validation
<a href={userProvidedUrl}>Click</a>

// ✅ SAFE: Validate protocol
const isSafeUrl = (url: string) => {
  try {
    const u = new URL(url, window.location.href)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

if (isSafeUrl(url)) {
  <a href={url}>Click</a>
}
```

### Rule: JSON.parse() — Validate First
```typescript
// ❌ RISKY: Parsing untrusted JSON
const data = JSON.parse(userInput)

// ✅ SAFE: Validate schema (use Zod, Ajv)
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  score: z.number(),
})

const data = schema.parse(JSON.parse(userInput))  // Throws if invalid
```

---

## 3. Secrets Management

### Rule: No API Keys in Source Code
```typescript
// ❌ FORBIDDEN
const API_KEY = 'sk-1234567890abcdef'

// ✅ SAFE: Environment variables
const API_KEY = import.meta.env.VITE_API_KEY
```

### Rule: .env.local Gitignored (Already Done)
```bash
# .gitignore
.env.local
.env.*.local
```

### Accessing Secrets:
```typescript
// public/.env
VITE_API_BASE_URL=https://api.example.com

// src/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Only VITE_* variables exposed to browser (all are public)
```

---

## 4. Content Security Policy (Optional)

### Recommended CSP Header:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none'
```

### For Electron/Capacitor:
```javascript
// electron/main.js
mainWindow.webPreferences = {
  preload: path.join(__dirname, 'preload.js'),
  sandbox: true,
  contextIsolation: true,
}
```

---

## Testing Checklist

- [ ] Run `pnpm lint` — no dangerous HTML patterns
- [ ] Security plugin rules passed
- [ ] No dangerouslySetInnerHTML in codebase
- [ ] All API responses validated with schema (if applicable)
- [ ] Environment variables not hardcoded
- [ ] No user input in redirects without whitelist
- [ ] localStorage/sessionStorage not storing sensitive data
- [ ] All onclick/onX handlers validated

---
```

### File: `.github/instructions/11-performance.instructions.md`

```markdown
# Performance & Web Vitals Governance

> **Authority**: AGENTS.md § 4 (Performance Guardrails)
> **Scope**: Performance budgets, Web Vitals targets, bundle analysis

---

## 1. Web Vitals Targets

### Google Core Web Vitals (2024 Standards)
| Metric | Target | Tool |
|--------|--------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | DevTools > Performance |
| **INP** (Interaction to Next Paint) | < 200ms | Web Vitals library |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Web Vitals library |
| **TTFB** (Time to First Byte) | < 500ms | DevTools > Network |
| **FCP** (First Contentful Paint) | < 1.8s | DevTools > Performance |

### Current Project Targets:
- **LCP**: 2.0s (aim for 80th percentile)
- **INP**: 150ms (interactive components)
- **CLS**: 0.05 (prevent jank)
- **Bundle**: < 150KB gzipped (app.js)

---

## 2. Bundle Size Budgets

### Current Budgets (add to CI):
```json
{
  "bundles": [
    { "name": "app", "path": "dist/assets/app.*.js", "maxSize": "150kb" },
    { "name": "theme", "path": "dist/assets/theme-*.js", "maxSize": "5kb" }
  ]
}
```

### Verification:
```bash
# Analyze bundle
pnpm exec vite build && npx vite-plugin-visualizer dist/stats.html

# Check size
ls -lh dist/assets/
```

---

## 3. ESLint Performance Rules

### Enabled Rules (Prevent Regressions)
- `react-hooks/exhaustive-deps: 'error'` — Prevents stale closures, wasted renders
- `@typescript-eslint/no-explicit-any: 'error'` — Type safety = bundle predictability
- `no-console: ['error']` — Remove in production (tree-shakes)
- `react/no-array-index-key: 'warn'` — Bad key strategy causes re-renders

### Violations Caught:
```typescript
// ❌ ERROR: Missing dependency in useMemo
const value = useMemo(() => cheapCalc(data), [])  // Forgot data!

// ❌ ERROR: Avoid any (hides bundle bloat)
const handler = (x: any) => x * 2

// ❌ WARN: Array index as key (re-renders items)
{items.map((item, idx) => <Item key={idx} />)}  // Bad!
```

---

## 4. React Performance Patterns

### Use useCallback When:
1. Function passed to memoized child
2. Function used in dependency array

### Use useMemo When:
1. Expensive computation (profile first!)
2. Memoized child depends on it
3. Default: DON'T use (premature optimization)

### Rule: Profile Before Optimizing
```typescript
// Bad: Premature optimization
const value = useMemo(() => doSomething(x), [x])

// Good: Profile first
// 1. Open DevTools > Performance Profiler
// 2. Record interaction
// 3. See if component re-renders excessively
// 4. THEN add useMemo if needed
```

---

## 5. Animation Performance

### GPU-Accelerated Only
```css
/* ✅ GOOD: GPU-accelerated (transform, opacity) */
@keyframes slide {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ❌ BAD: Repaints (avoid) */
@keyframes slide {
  from { width: 0; margin-left: 100%; }
  to { width: 100%; margin-left: 0; }
}
```

### Respect prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Code Splitting Strategy

### Lazy Load Heavy Features
```tsx
import { lazy, Suspense } from 'react'

const ResultsTable = lazy(() => import('./ResultsTable'))

export const App = () => (
  <Suspense fallback={<LoadingScreen />}>
    <ResultsTable />
  </Suspense>
)
```

### Lazy Load Themes
```typescript
// Load theme CSS on demand (already implemented)
const theme = (name: string) =>
  import(`../themes/${name}.css?url`).then(m => m.default)
```

---

## 7. Monitoring & Alerts

### Verify in CI/CD
```bash
# Add to .github/workflows/performance.yml
- name: Bundle Size
  run: pnpm build && npx bundlesize

- name: Performance Budget
  run: npx performance-budget --config .performance-budget.json
```

---

## Testing Checklist

- [ ] Lighthouse score: 90+ (Performance)
- [ ] Bundle size < 150KB gzipped
- [ ] No console warnings/errors in DevTools
- [ ] No unnecessary re-renders (DevTools Profiler)
- [ ] Animations only use transform/opacity
- [ ] prefers-reduced-motion respected
- [ ] Lazy loading for heavy features

---
```

### File: `.github/instructions/12-error-handling.instructions.md`

```markdown
# Error Handling & Recovery Patterns

> **Authority**: AGENTS.md § 3 (Error Handling & Recovery)
> **Scope**: Error boundaries, recovery UI, error classification

---

## 1. Error Boundary Component

### Usage:
```tsx
import { ErrorBoundary } from '@/ui/organisms'

<ErrorBoundary
  onError={(error, info) => {
    crashLogger.error('ErrorBoundary', error.message, {
      stack: error.stack,
      componentStack: info.componentStack,
    })
  }}
>
  <GameBoard />
  <ResultsTable />
</ErrorBoundary>
```

### What It Catches
- ✅ Rendering errors (any component in tree)
- ✅ Lifecycle method errors
- ❌ Event handler errors (use try/catch)
- ❌ Async errors (use async try/catch)

### What It Doesn't Catch
```typescript
// ❌ Not caught by error boundary
const handler = async () => {
  try {
    await fetchData()
  } catch (e) {
    // Handle here, not in boundary
    showErrorToast(e.message)
  }
}
```

---

## 2. Error Classification

### User Error (Form Validation)
```typescript
// User entered invalid data
const error = validateForm(formData)
if (error) {
  // Show inline feedback on form
  setFormErrors(error)
}
```

### Recoverable System Error (Network)
```typescript
// Network timeout, server 5xx
try {
  const data = await fetch(url)
} catch (e) {
  // Offer retry
  showErrorToast('Connection failed. Retry?', {
    action: 'Retry',
    onAction: () => refetch(),
  })
}
```

### Fatal Error (Data Corruption)
```typescript
// Invalid state, security violation
if (!validateGameState(state)) {
  // Clear cache, restart
  localStorage.removeItem('gameState')
  window.location.reload()
}
```

---

## 3. Error Recovery Actions

### Per Error Type
| Type | Recovery | Message |
|------|----------|---------|
| Form validation | Fix inputs | "Please fill all fields" |
| Network timeout | Retry | "Connection lost. Retry?" |
| Server error (500) | Retry later | "Server error. Try later." |
| Data corruption | Restart app | "Data corrupted. Starting over." |
| Out of memory | Clear cache | "Memory full. Clearing cache." |

---

## 4. Toast/Alert Patterns

### Not Implemented (Recommend Adding)
- Add lightweight toast library or custom hook
- Show errors/successes with auto-dismiss
- Priority: Error > Warning > Info > Success

---

## Testing Checklist

- [ ] Error boundary catches rendering errors
- [ ] Fallback UI displays correctly
- [ ] Retry button works
- [ ] Error logged to crashLogger
- [ ] Network errors trigger retry UI
- [ ] Form validation shows feedback
- [ ] Corrupted state triggers restart

---
```

### File: `.github/instructions/13-mobile-gestures.instructions.md`

```markdown
# Mobile Gesture Patterns

> **Authority**: AGENTS.md § 15 (Mobile Gestures)
> **Scope**: Swipe, long-press, haptic feedback

---

## 1. Swipe Gesture Hook

### Implementation
```typescript
import { useSwipeGesture } from '@/app'

const GameBoard = () => {
  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    onSwipeLeft: () => moveCursor('right'),
    onSwipeRight: () => moveCursor('left'),
    onSwipeUp: () => moveCursor('down'),
    onSwipeDown: () => moveCursor('up'),
    threshold: 50,  // Min 50px to register
  })

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'none' }}  // Prevent browser defaults
    >
      {/* Board */}
    </div>
  )
}
```

### Thresholds
- **threshold**: 50px (adjustable per use case)
- **velocityThreshold**: 0.3 px/ms (prevent slow swipes)

---

## 2. Long-Press Gesture Hook

### Implementation
```typescript
import { useLongPress } from '@/app'

const TileButton = () => {
  const { onTouchStart, onTouchEnd } = useLongPress({
    duration: 800,  // 800ms before trigger
    onLongPress: () => showContextMenu(),
    onLongPressEnd: () => hideContextMenu(),
  })

  return (
    <button onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      Hold for options
    </button>
  )
}
```

### Duration Defaults
- **Quick action**: 300ms (short)
- **Context menu**: 800ms (standard)
- **Confirm action**: 1500ms (long)

---

## 3. Haptic Feedback

### Already Implemented
```typescript
import { haptics } from '@/app'

// Trigger haptic feedback
haptics.light()  // Subtle feedback
haptics.medium() // Standard feedback
haptics.heavy()  // Strong feedback
```

### Usage Patterns
```typescript
// On successful action
haptics.light()

// On error
haptics.heavy()

// On selection
haptics.medium()
```

### Supported Platforms
- ✅ Web (Vibration API)
- ✅ iOS (Capacitor)
- ✅ Android (Capacitor)

---

## Testing Checklist

- [ ] Swipe Left/Right works on touch device
- [ ] Swipe Up/Down works on touch device
- [ ] Long-press triggers after 800ms
- [ ] Haptic feedback on action
- [ ] No accidental gestures (threshold prevents)
- [ ] Desktop fallback (mouse) works too

---
```

---

## Summary: ESLint Expansion + Minimal Packages

### ESLint Enhancements (No Cost)
| Rule | Coverage | Files |
|------|----------|-------|
| `eslint-plugin-jsx-a11y` | 30+ accessibility rules | Already installed |
| `eslint-plugin-react-hooks` | Dependency arrays, hook rules | Already installed |
| `typescript-eslint` | Type safety rules | Already installed |
| `eslint-plugin-security` | XSS, regex, injection | **Add 1 package** |

### Packages to Add (Strategic Value)
| Package | Size | Purpose | ROI |
|---------|------|---------|-----|
| `eslint-plugin-security` | ~50KB | XSS, injection prevention | High |
| `commitizen` | ~100KB | Conventional commits | High |
| `cz-conventional-changelog` | ~15KB | Commit prompt | High |
| **Total** | **~165KB** | **Git + Security** | **High** |

### Custom Patterns (No Packages)
- Error Boundary component
- Swipe gesture hook
- Long-press hook
- Performance monitoring hook

### Instruction Files Created
1. `09-wcag-accessibility.instructions.md`
2. `10-security.instructions.md`
3. `11-performance.instructions.md`
4. `12-error-handling.instructions.md`
5. `13-mobile-gestures.instructions.md`

---

## Implementation Order

### Week 1: ESLint + Commitizen
- [ ] Add `eslint-plugin-security` to devDependencies
- [ ] Update `eslint.config.js` with security rules
- [ ] Install commitizen + cz-conventional-changelog
- [ ] Create `.commitlintrc.cjs`
- [ ] Test: `pnpm lint` and `pnpm commit`

### Week 2: Custom Components + Hooks
- [ ] Create `ErrorBoundary.tsx` component
- [ ] Create `useSwipeGesture.ts` hook
- [ ] Create `useLongPress.ts` hook
- [ ] Create `usePerformanceMetrics.ts` hook
- [ ] Create `ErrorBoundary.module.css`

### Week 3: Instruction Files
- [ ] Create all 5 instruction files
- [ ] Add commands: `pnpm check:a11y`, `pnpm check:perf` (optional)
- [ ] Document in project README

### Week 4: Integration + Testing
- [ ] Wrap App with ErrorBoundary
- [ ] Test error boundary with intentional error
- [ ] Test swipe/long-press on mobile device
- [ ] Verify all ESLint rules catching violations
- [ ] Update pre-commit hook (already done via commitizen)

---

## Files to Create/Modify

### Create
- `src/ui/organisms/ErrorBoundary.tsx`
- `src/ui/organisms/ErrorBoundary.module.css`
- `src/app/useSwipeGesture.ts`
- `src/app/useLongPress.ts`
- `src/app/usePerformanceMetrics.ts`
- `.commitlintrc.cjs`
- `.github/instructions/09-wcag-accessibility.instructions.md`
- `.github/instructions/10-security.instructions.md`
- `.github/instructions/11-performance.instructions.md`
- `.github/instructions/12-error-handling.instructions.md`
- `.github/instructions/13-mobile-gestures.instructions.md`

### Modify
- `eslint.config.js` (add security plugin, expand rules)
- `package.json` (add commitizen packages, update scripts)
- `src/app/index.ts` (export new hooks)
- `src/ui/organisms/index.ts` (export ErrorBoundary)
- `src/index.tsx` (wrap with ErrorBoundary)

---

## ROI Summary

| Investment | Return |
|-----------|--------|
| 2 npm packages | Conventional commits, security linting |
| 3 custom hooks | Swipe, long-press, performance tracking |
| 5 instruction files | Clear patterns, team alignment, compliance |
| 1 Error Boundary component | Render error recovery, user safety |
| **Total**: 1 week of work | **6+ governance gaps closed** |

