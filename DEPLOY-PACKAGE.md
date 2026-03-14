# Deployment Package — Copy to 25 Projects

**What's in Nim**: 12 files ready to copy  
**What each project gets**: 6 governance docs + 3 hooks + 1 error boundary + 3 configs  
**Time per project**: 20-30 minutes  
**Success check**: `pnpm validate` passes

---

## 📦 The 12 Files (Copy These to Every Project)

### Governance Instructions (5 files → `.github/instructions/`)

```
✅ 09-wcag-accessibility.instructions.md    (200 lines, WCAG 2.1 AA)
✅ 10-security.instructions.md              (200 lines, XSS prevention)
✅ 11-performance.instructions.md           (220 lines, Web Vitals)
✅ 12-error-handling.instructions.md        (160 lines, Error boundaries)
✅ 13-mobile-gestures.instructions.md       (190 lines, Swipe/longpress)
```

### Custom Code (3 hooks → `src/app/`)

```
✅ useSwipeGesture.ts                       (90 lines, multi-direction swipe)
✅ useLongPress.ts                          (50 lines, long-press detection)
✅ usePerformanceMetrics.ts                 (70 lines, Web Vitals tracking)
```

### Component (1 file + CSS → `src/ui/organisms/`)

```
✅ ErrorBoundary.tsx                        (80 lines, error recovery)
✅ ErrorBoundary.module.css                 (65 lines, fallback UI styling)
```

### Configuration (3 files at root)

```
✅ .commitlintrc.cjs                        (conventional commit validation)
✅ eslint.config.js                         (merge with existing, add security rules)
✅ .husky/commit-msg                        (pre-commit hook)
```

---

## 📥 What Each Project Needs to Install

**4 NPM packages** (135KB total):

```json
{
  "devDependencies": {
    "eslint-plugin-security": "^3.1.1",
    "@commitlint/config-conventional": "^19.5.0",
    "commitizen": "^4.3.1",
    "cz-conventional-changelog": "^3.3.0"
  }
}
```

---

## ⚙️ Configuration Steps Per Project

### Step 1: Copy Files (5 min)
```bash
# From Nim to your project:
cp nim/.github/instructions/{09,10,11,12,13}*.md YOUR_PROJECT/.github/instructions/
cp nim/src/app/{useSwipe,useLong,usePerf}*.ts YOUR_PROJECT/src/app/
cp nim/src/ui/organisms/ErrorBoundary.* YOUR_PROJECT/src/ui/organisms/
cp nim/.commitlintrc.cjs YOUR_PROJECT/
```

### Step 2: Install Packages (10 min)
```bash
cd YOUR_PROJECT
pnpm add -D eslint-plugin-security@^3.1.1 \
           commitizen@^4.3.1 \
           cz-conventional-changelog@^3.3.0 \
           @commitlint/config-conventional@^19.5.0
```

### Step 3: Merge Configuration (5 min)

**eslint.config.js** — Add these rules to your file (from Nim):
```javascript
// ── Security (8 rules) ──
'security/detect-object-injection': 'warn',
'security/detect-non-literal-regexp': 'warn',
'security/detect-unsafe-regex': 'error',
'security/detect-buffer-noassert': 'error',
'security/detect-child-process': 'warn',
'security/detect-no-csrf-before-method-override': 'warn',
'security/detect-non-literal-fs-filename': 'warn',
'security/detect-non-literal-require': 'warn',
```

**Import changes** in existing files:
- `src/app/index.ts` — Export 3 new hooks (useSwipeGesture, useLongPress, usePerformanceMetrics)
- `src/ui/organisms/index.ts` — Export ErrorBoundary
- `src/index.tsx` — Wrap `<App>` with `<ErrorBoundary>` (see example below)

**Wrap entire app** in `src/index.tsx`:
```tsx
import { ErrorBoundary } from '@/ui/organisms'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

### Step 4: Verify (5 min)
```bash
cd YOUR_PROJECT
pnpm validate
# Should pass: lint, format:check, typecheck, build all ✅
```

### Step 5: Commit (If needed)
```bash
pnpm commit   # Interactive conventional commit prompt
git push
```

---

## ✅ Success Criteria

**After deploying to one project, you'll have**:

| Item | Check |
|------|-------|
| Security rules active | `pnpm lint` shows 8 security checks |
| A11y rules active | `pnpm lint` shows 30+ accessibility checks |
| Commitizen working | `pnpm commit` prompts for commit message |
| Error boundary active | App wrapped with error recovery UI |
| Custom hooks available | `import { useSwipeGesture } from '@/app'` works |
| Performance metrics | `usePerformanceMetrics()` hook available |
| Validation passing | `pnpm validate` exits with code 0 |

---

## 🔍 Validation Checklist

Before deploying to the next project, confirm on the current one:

- [ ] All 5 instruction files in `.github/instructions/`
- [ ] `src/app/` has 3 new hooks with correct exports
- [ ] `src/ui/organisms/` has ErrorBoundary + CSS
- [ ] `.commitlintrc.cjs` exists
- [ ] `eslint.config.js` has 8 security rules merged
- [ ] `.husky/commit-msg` exists
- [ ] `pnpm lint` passes (no errors)
- [ ] `pnpm format:check` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds (builds `dist/`)
- [ ] `pnpm validate` exits cleanly (code 0)
- [ ] `pnpm commit` shows interactive prompts

✅ **All checks pass = Ready to deploy next project**

---

## 🚀 Batch Deployment Schedule

**Recommended approach** (no fake timelines, just workflow):

1. Deploy to 1 project → Verify all checks pass
2. Deploy to projects 2-5 → Quick replication (20-30 min each)
3. Deploy to projects 6-15 → Batch copy script
4. Deploy to projects 16-25 → Parallel if team available

**Total human time**: ~12-13 hours for 25 projects  
**Parallelizable**: YES (copy is idempotent)

---

## 📄 Summary

**What's being deployed**:
- ✅ 5 governance documentation files (970 lines)
- ✅ 3 custom hooks (210 lines)
- ✅ 1 error boundary component + CSS (145 lines)
- ✅ 4 npm packages (135KB)
- ✅ ESLint security rules (8 active)
- ✅ Accessibility rules (30+ active)
- ✅ Conventional commits (pnpm commit works)
- ✅ Error boundary (app-level protection)

**Per project**: Copy 12 files, install 4 packages, merge 1 config, wrap app, validate.

**Done when**: All 25 projects passing `pnpm validate` + `pnpm commit` works.

---

**Next**: Use QUICK-COPY-SCRIPT.md to automate the process.
