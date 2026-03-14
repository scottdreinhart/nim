# 🚀 Rollout Quick-Reference Card

**Nim Template Ready** | **March 14, 2026** | **25 Projects Awaiting Rollout**

---

## What Gets Rolled Out (TL;DR)

**3 files** (custom hooks + component) + **5 files** (governance docs) + **2 configs** + **3 packages**

| What | Qty | Time | Impact |
|------|-----|------|--------|
| Instruction files | 5 | 1 min | Team alignment + governance |
| Custom hooks | 3 | 1 min | Swipe/long-press/metrics |
| Error boundary | 2 | 1 min | App stability |
| Config updates | 2 | 5 min | Security + commits |
| Packages | 3 | 3 min | Features enabled |
| Validation | 1 | 5 min | Quality gate |
| **TOTAL** | — | **~20 min** | 6 governance gaps closed |

---

## Copy-Paste Commands

```bash
# Navigate to target project
cd /path/to/<project-name>

# Copy instruction files
cp -r /path/to/nim/.github/instructions/0[9-3]*.md .github/instructions/

# Copy hooks
cp /path/to/nim/src/app/useSwipeGesture.ts src/app/
cp /path/to/nim/src/app/useLongPress.ts src/app/
cp /path/to/nim/src/app/usePerformanceMetrics.ts src/app/

# Copy error boundary
cp /path/to/nim/src/ui/organisms/ErrorBoundary.* src/ui/organisms/

# Copy configs
cp /path/to/nim/.commitlintrc.cjs .
cp /path/to/nim/eslint.config.js .

# Install + validate
pnpm install
pnpm validate

# Test conventional commits
pnpm commit   # Interactive prompt
```

---

## Configure Exports (3 edits)

### Edit 1: `src/app/index.ts` — Add 3 lines
```typescript
export { useSwipeGesture } from './useSwipeGesture'
export { useLongPress } from './useLongPress'
export { usePerformanceMetrics, logWebVitals } from './usePerformanceMetrics'
```

### Edit 2: `src/ui/organisms/index.ts` — Add 1 line
```typescript
export { ErrorBoundary } from './ErrorBoundary'
```

### Edit 3: `src/index.tsx` — Wrap app
```typescript
import { ErrorBoundary } from '@/ui/organisms'

<ErrorBoundary onError={(error, info) => console.error(error)}>
  <ShellApp />  {/* or your root component */}
</ErrorBoundary>
```

### Edit 4: `package.json` — Add config + script
```json
{
  "commitizen": { "path": "cz-conventional-changelog" },
  "scripts": { "commit": "pnpm exec cz commit" }
}
```

---

## 3-Point Verification

```bash
# 1. Validation passes?
pnpm validate
# Output: ✅ all lint/format/typecheck/build pass

# 2. Commits work?
pnpm commit
# Interactive prompt with types: feat, fix, security, a11y, perf, etc.

# 3. App wraps?
grep -q "ErrorBoundary" src/index.tsx
# Should find ErrorBoundary wrapping root
```

---

## Security Rules Now Active

❌ **Forbidden**: 
- `dangerouslySetInnerHTML`
- Unsafe regex patterns
- Object injection attacks
- Unvalidated redirects

✅ **Enforced**:
- Input validation before render
- ARIA labels on interactive elements
- Focus management (Tab, Escape)
- Keyboard navigation support

---

## Mobile UX Now Available

```typescript
// Swipe gestures
const { onTouchStart, onTouchEnd } = useSwipeGesture({
  onSwipeLeft: () => navigate('prev'),
  onSwipeRight: () => navigate('next'),
})

// Long-press (context menu, etc.)
const { onTouchStart, onTouchEnd } = useLongPress({
  duration: 800,
  onLongPress: () => showMenu(),
})

// Performance tracking
const { lcp, fcp, cls } = usePerformanceMetrics()
logWebVitals()  // Send to analytics
```

---

## Conventional Commits Now Enforced

**Before** (old way, no format guarantee):
```bash
git commit -m "add thing"
git commit -m "fixed it"
```

**After** (new way, type-enforced):
```bash
pnpm commit
# Select type: feat | fix | docs | style | refactor | perf | test | chore | a11y | security
# Scope: [optional]
# Subject: clear, imperative, no period
$git log:
# feat(ui): add swipe gesture detection
# fix(security): prevent xss in sanitizer
# a11y(keyboard): improve focus indicators
```

---

## Team Workflow Changes

### Developer: Making Changes
```bash
# Old
git commit -m "stuff"

# New (enforced)
pnpm commit          # Interactive, validates format
```

### CI/CD: Checking Quality
```bash
# Old
npm lint

# New (expanded)
pnpm validate        # lint + format + typecheck + build
```

### Testing: Error Recovery
```typescript
// Old: App crashes on render error
throw new Error("...")  // → Blank white screen

// New: Error boundary catches + shows fallback
throw new Error("...")  // → Safe error UI with "Try Again"
```

---

## Rollout Order (Recommended)

**Day 1**: Core games (5 projects)
- TicTacToe
- Snake
- Connect4
- Checkers
- Chess

**Day 2**: Secondary games (10 projects)
- Dominoes, Hearts, Spades, etc.

**Day 3**: Utilities + Tools (10 projects)
- Admin tools, Analytics, etc.

**Daily Validation**: All projects pass `pnpm validate` by EOD

---

## ESLint Rules by Category

### Security Rules (NEW) — 8 total
- No: `dangerouslySetInnerHTML`, regex DoS, object injection, unvalidated redirect
- Catch: buffer operations, child process spawning, unsafe parsing

### Accessibility Rules (EXPANDED) — 30+ total
- Keyboard navigation (Tab, Escape, arrows)
- ARIA labels, live regions, semantic HTML
- Focus indicators, color contrast
- Alternative text for images

### Performance Rules (ADDED)
- Exhaustive dependency arrays (error severity)
- No explicit `any` type (error severity)
- Proper `React.memo` usage
- Array key optimization

### Already Active — 40+ rules
- React best practices (jsx-a11y, react, react-hooks)
- TypeScript strictness (no-implicit-any, etc.)
- Code style (ESLint core)
- Boundaries (eslint-plugin-boundaries)

---

## Success = All 25 Projects Passing

```bash
✅ pnpm validate passes
✅ pnpm commit works
✅ Security rules active
✅ A11y rules enforced
✅ Error boundary protecting app
✅ Swipe/gesture hooks available
✅ Metrics tracking enabled
✅ Consistent governance docs in every project
```

---

## Questions?

**Doc**: ROLLOUT-GUIDE.md (step-by-step)  
**Reference**: ROLLOUT-MANIFEST.md (inventory + details)  
**Authority**: AGENTS.md § 22 (governance)  
**Template**: Nim (validated, ready to copy)

**Estimated Team Effort**: ~9 hours total (parallelizable)  
**Target Completion**: March 17, 2026  
**Status**: ✅ READY TO LAUNCH

---

**Created**: March 14, 2026  
**Template Status**: Validated & Production-Ready  
**Next Step**: Begin Day 1 rollout (March 15)
