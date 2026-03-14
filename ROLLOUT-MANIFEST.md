# Rollout Manifest — File Inventory

**Date**: March 14, 2026  
**Source Project**: Nim  
**Target**: 25 projects  
**Total Files to Copy**: 12  
**Configuration Updates**: 2  
**Packages to Install**: 3  

---

## Instruction Files (5)
Location: `.github/instructions/`

| File | Size | Purpose | Status |
|------|------|---------|--------|
| `09-wcag-accessibility.instructions.md` | ~200 lines | Keyboard nav, ARIA, contrast compliance | ✅ Ready |
| `10-security.instructions.md` | ~200 lines | XSS prevention, input validation, CSP | ✅ Ready |
| `11-performance.instructions.md` | ~220 lines | Web Vitals, bundle budgets, optimization | ✅ Ready |
| `12-error-handling.instructions.md` | ~160 lines | Error boundaries, recovery, classification | ✅ Ready |
| `13-mobile-gestures.instructions.md` | ~190 lines | Swipe, long-press, haptic feedback | ✅ Ready |

**Total**: 970 lines of governance documentation

---

## Custom Hooks (3)
Location: `src/app/`

| File | Lines | Purpose | Exports | Status |
|------|-------|---------|---------|--------|
| `useSwipeGesture.ts` | 90 | Multi-direction swipe detection | `useSwipeGesture` | ✅ Ready |
| `useLongPress.ts` | 50 | Long-press gesture detection | `useLongPress` | ✅ Ready |
| `usePerformanceMetrics.ts` | 70 | Web Vitals tracking (LCP, FCP, CLS) | `usePerformanceMetrics`, `logWebVitals` | ✅ Ready |

**Total**: 210 lines of custom code  
**Must be exported from**: `src/app/index.ts`

---

## Error Boundary Component (2)
Location: `src/ui/organisms/`

| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `ErrorBoundary.tsx` | 80 | React error boundary + retry UI | ✅ Ready |
| `ErrorBoundary.module.css` | 65 | Error container styling + accessibility | ✅ Ready |

**Total**: 145 lines  
**Must be exported from**: `src/ui/organisms/index.ts`  
**Must wrap app in**: `src/index.tsx`

---

## Configuration Files (2)
Location: Project root `/`

| File | Lines | Purpose | Action | Status |
|------|-------|---------|--------|--------|
| `.commitlintrc.cjs` | 25 | Enforce conventional commits | NEW (copy from nim) | ✅ Ready |
| `eslint.config.js` | 150 | ESLint rules + security plugin | UPDATE (merge security rules) | ✅ Ready |

**Note**: `eslint.config.js` needs careful merge to preserve project-specific rules

---

## NPM Packages (3)
Location: `package.json` devDependencies

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `eslint-plugin-security` | ^3.1.1 | XSS/injection prevention rules | ✅ Ready |
| `commitizen` | ^4.3.1 | Interactive conventional commit prompts | ✅ Ready |
| `cz-conventional-changelog` | ^3.3.0 | Conventional changelog adapter | ✅ Ready |
| `@commitlint/config-conventional` | ^19.5.0 | Conventional commit validation | ✅ Ready |

**Total**: ~165KB added to node_modules  
**Install command**: `pnpm add -D eslint-plugin-security commitizen cz-conventional-changelog @commitlint/config-conventional`

---

## Configuration Updates (Not Files)

### Update 1: `src/app/index.ts`
**Action**: ADD these exports (keep existing ones)

```typescript
export { useSwipeGesture } from './useSwipeGesture'
export { useLongPress } from './useLongPress'
export { usePerformanceMetrics, logWebVitals } from './usePerformanceMetrics'
```

**Verify**: All imports in other files still work

### Update 2: `src/ui/organisms/index.ts`
**Action**: ADD this export (keep existing ones)

```typescript
export { ErrorBoundary } from './ErrorBoundary'
```

**Verify**: No duplicate exports

### Update 3: `src/index.tsx`
**Action**: WRAP app root with ErrorBoundary

**Before**:
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ShellApp />
  </React.StrictMode>,
)
```

**After**:
```typescript
import { ErrorBoundary } from '@/ui/organisms'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary onError={(error, info) => console.error(error)}>
      <ShellApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

### Update 4: `package.json`
**Action**: ADD commitizen config

```json
{
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

**Action**: ADD commit script (if not present)

```json
{
  "scripts": {
    "commit": "pnpm exec cz commit"
  }
}
```

---

## Validation Checklist (Per Project)

### Pre-Rollout Verification
- [x] Nim passes `pnpm validate`? ✅ YES (master template)
- [x] All files exist in nim? ✅ YES (verified)
- [x] Source files are git-tracked? ✅ YES (committable)

### Per-Project Post-Rollout
- [ ] Files copied correctly?
- [ ] No merge conflicts in eslint.config.js?
- [ ] New hooks exported?
- [ ] ErrorBoundary exported and wrapping app?
- [ ] package.json has commitizen config?
- [ ] `pnpm install` successful?
- [ ] `pnpm lint` passes with security rules?
- [ ] `pnpm typecheck` passes?
- [ ] `pnpm build` produces dist/?
- [ ] `pnpm validate` passes 100%?
- [ ] `pnpm commit` shows interactive prompt?
- [ ] Conventional commit created successfully?

---

## File Checksums (For Verification)

After copying, verify file integrity (optional):

```bash
# In nim (source)
sha256sum src/app/useSwipeGesture.ts
sha256sum src/app/useLongPress.ts
sha256sum src/app/usePerformanceMetrics.ts
sha256sum src/ui/organisms/ErrorBoundary.tsx
sha256sum src/ui/organisms/ErrorBoundary.module.css

# In target project (should match)
sha256sum src/app/useSwipeGesture.ts
# ... etc
```

---

## Rollout Timeline

**Per Project Estimate: 20-30 minutes**

| Phase | Time | Action |
|-------|------|--------|
| Copy files | 2 min | Run copy commands (instructions/hooks/component) |
| Update config | 5 min | Merge eslint.config.js, add .commitlintrc.cjs |
| Install | 3 min | `pnpm install` |
| Update exports | 5 min | Edit src/app/index.ts, src/ui/organisms/index.ts, src/index.tsx |
| Validate | 5 min | `pnpm validate` (lint + format + typecheck + build) |
| Test workflow | 2 min | `pnpm commit` + git log verification |
| **TOTAL** | **22 min** | Ready for production |

**25 Projects × 22 min = ~9 hours of rollout time** (parallelizable across team)

---

## Success Metrics

**After Complete Rollout Across 25 Projects**:

| Metric | Target | Verification |
|--------|--------|--------------|
| **Validation Pass Rate** | 100% | All 25 projects pass `pnpm validate` |
| **Security Rules Enforcement** | 100% | All projects have security linting |
| **Accessibility Coverage** | 100% | All projects use WCAG rules |
| **Conventional Commits** | 100% | All projects enforce commit format |
| **Error Boundaries** | 100% | All projects wrap root with ErrorBoundary |
| **Custom Hooks Available** | 100% | All projects export new hooks |
| **Governance Documents** | 100% | All projects have 5 instruction files |

---

## Known Variations by Project Type

Some projects may differ in structure. Adapt placement as needed:

| Variation | Adjustment |
|-----------|-----------|
| **App root is `App.tsx` not `ShellApp.tsx`** | Update `.tsx` file name in src/index.tsx wrap |
| **`src/app/` doesn't exist** | Create directory and add hooks there |
| **`src/ui/organisms/` doesn't exist** | Create directory structure (atoms → molecules → organisms) |
| **No `.github/instructions/` dir** | Create `.github/instructions/` directory |
| **Different package manager** | Always use `pnpm` (per AGENTS.md § 2) |

All 25 projects should use Nim's directory structure for consistency.

---

## Post-Rollout Support

**If a project fails validation:**

1. Check eslint.config.js merge (most common issue)
2. Run `pnpm format` to auto-fix formatting
3. Run `pnpm lint` to identify violations
4. Check TypeScript errors: `pnpm typecheck`
5. If still failing, contact team lead with error log

**Common Issues**:
- `nodeJS.Timeout` error → Use `ReturnType<typeof setTimeout>`
- Missing ErrorBoundary export → Check `src/ui/organisms/index.ts`
- Commitizen not prompting → Check package.json config
- ESLint security rules not running → Verify `eslint.config.js` has `security: securityPlugin`

---

## Approval & Signoff

**Template Verified**: ✅ Nim passes all validation  
**Governance Authority**: AGENTS.md § 22  
**Ready for Team Rollout**: ✅ YES  
**Recommended Start Date**: March 15, 2026  
**Target Completion**: March 17, 2026 (3 days, 25 projects)

---

**Prepared by**: GitHub Copilot  
**Last Updated**: March 14, 2026  
**Rollout Status**: READY
