# Verification Test Plan — Deploy to First Real Project

**Purpose**: Validate the deployment process works end-to-end on a real app project  
**Time**: 30-45 minutes (one project)  
**Success**: All validation checks pass + commitizen prompts work  
**Recommended Project**: TicTacToe (simplest app project)

---

## 🎯 Pre-Deployment Checklist

Before starting deployment:

- [ ] Have access to TicTacToe repo (or similar simple project)
- [ ] Project already has: eslint, prettier, tsconfig.json, vite.config.js
- [ ] Project has pnpm installed and pnpm-lock.yaml exists
- [ ] Terminal ready in project directory
- [ ] copy-to-project.sh is executable (`chmod +x copy-to-project.sh`)

---

## 📋 Verification Steps

### Step 1: Pre-Deployment Baseline (5 min)

**Goal**: Know the current state before changes

```bash
cd /path/to/tictactoe

# Record baseline state
git status                    # Confirm clean working directory
pnpm validate 2>&1 > /tmp/baseline-validate.log
pnpm lint 2>&1 > /tmp/baseline-lint.log

# Optional: capture current package.json
cp package.json /tmp/baseline-package.json
```

**Expected**: Both commands should either pass or have known errors (record them)

---

### Step 2: Run Deployment Script (5 min)

```bash
# Make sure copy script is executable
ls -la copy-to-project.sh        # Check if executable
chmod +x copy-to-project.sh      # If not, make it executable

# Run copy script
./copy-to-project.sh /path/to/tictactoe

# Expected output:
# ✅ 5 instruction files copied
# ✅ 3 hooks copied
# ✅ ErrorBoundary component + CSS copied
# ✅ Config files copied
```

**Verify files exist**:
```bash
cd /path/to/tictactoe

# Check instruction files
ls -1 .github/instructions/{09,10,11,12,13}*.md    # Should list 5 files

# Check hooks
ls -1 src/app/{useSwipe,useLong,usePerf}*.ts       # Should list 3 files

# Check component
ls -1 src/ui/organisms/ErrorBoundary*              # Should list 2 files (tsx + css)

# Check config
ls -1 .commitlintrc.cjs                            # Should exist
ls -1 .husky/commit-msg                            # Should exist
```

✅ **All files should exist after this step**

---

### Step 3: Manual ESLint Merge (5 min)

**⚠️ Critical Step**: Copy security rules from Nim to target project

**Option A: Quick Merge (Recommended)**

```bash
# Open both files side-by-side:
# 1. Nim eslint.config.js (lines 100-110, the security rules section)
# 2. Target project eslint.config.js

# Copy this section from Nim:
      // ── Security (XSS, Injection, Crypto) ──
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-no-csrf-before-method-override': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-require': 'warn',

# And add to target project's rules section.

# Also add security plugin to imports (near top of file):
# import securityPlugin from 'eslint-plugin-security'

# Also add to plugins object:
#   'security': securityPlugin,
```

**Option B: Full Copy (If confused)**
```bash
# Just copy Nim's entire eslint.config.js if target structure is similar:
cp /mnt/c/Users/scott/nim/eslint.config.js /path/to/tictactoe/
```

✅ **ESLint file should now have security rules + plugin imported**

---

### Step 4: Update Barrel Exports (5 min)

**Edit these files in target project**:

**src/app/index.ts** — Add 3 new exports
```ts
export { useSwipeGesture } from './useSwipeGesture'
export { useLongPress } from './useLongPress'
export { usePerformanceMetrics } from './usePerformanceMetrics'
export { logWebVitals } from './usePerformanceMetrics'  // Optional utility
// Keep existing exports unchanged
```

**src/ui/organisms/index.ts** — Add ErrorBoundary export
```ts
export { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
// Keep existing exports unchanged
```

✅ **Verify exports are in place**

---

### Step 5: Wrap App with ErrorBoundary (5 min)

**Edit src/index.tsx** (or main entry point):

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

✅ **App wrapped. Save file.**

---

### Step 6: Install NPM Packages (10 min)

```bash
cd /path/to/tictactoe

# Install 4 packages
pnpm add -D eslint-plugin-security@^3.1.1 \
           commitizen@^4.3.1 \
           cz-conventional-changelog@^3.3.0 \
           @commitlint/config-conventional@^19.5.0

# Expected: pnpm adds 4 packages, updates node_modules/ and pnpm-lock.yaml
# Time: 5-10 minutes
```

✅ **Packages installed. Check pnpm-lock.yaml was updated.**

---

### Step 7: Run Validation (10 min)

```bash
cd /path/to/tictactoe

# Run full validation
pnpm validate 2>&1 | tee /tmp/validate-result.log

# Expected output (last lines):
# > nim-game@1.0.0 check ...
# > pnpm lint && pnpm format:check && pnpm typecheck
# > pnpm lint [PASS]
# > pnpm format:check [PASS]
# > pnpm typecheck [PASS]
# > pnpm build [builds to dist/]
# ✅ Exit code 0

echo "Exit code: $?"
```

**Possible Issues & Fixes**:

| Error | Fix |
|-------|-----|
| `Cannot find module '@/ui/organisms'` | Check src/ui/organisms/index.ts exports ErrorBoundary |
| `Cannot find module 'ErrorBoundary'` | Check ErrorBoundary.tsx exists at src/ui/organisms/ |
| ESLint config error | Verify security rules are valid (copy from this doc) |
| TypeScript errors | Run `pnpm typecheck` to see full report, fix types |
| Build fails | Check dist/ wasn't built, re-run `pnpm build` |

✅ **pnpm validate should exit with code 0 (no errors)**

---

### Step 8: Test Commitizen (5 min)

```bash
cd /path/to/tictactoe

# Make a dummy change to trigger git
echo "// test" >> src/index.tsx

# Try interactive commit
pnpm commit

# Expected: Interactive prompts:
# ? Select the type of change: (Use arrow keys)
# ❯ feat
#   fix
#   docs
#   style
#   refactor
#   perf
#   test
#   chore
#   revert

# Select one, follow prompts, type description, hit Enter
# Commit message should be formatted as: "feat: your message"
```

✅ **Commitizen interactive commit should work**

---

### Step 9: Final Verification (5 min)

```bash
cd /path/to/tictactoe

# All-in-one check
echo "=== FINAL VERIFICATION ==="
echo "Files present:"
ls -q .github/instructions/{09,10,11,12,13}*.md | wc -l    # Should be 5
ls -q src/app/use{Swipe,Long,Perf}*.ts | wc -l               # Should be 3
ls -q src/ui/organisms/ErrorBoundary.* | wc -l               # Should be 2

echo ""
echo "Configuration:"
grep -c "security/detect-" eslint.config.js       # Should be 8+
[ -f .commitlintrc.cjs ] && echo ".commitlintrc.cjs ✅" || echo ".commitlintrc.cjs ❌"
[ -f .husky/commit-msg ] && echo ".husky/commit-msg ✅" || echo ".husky/commit-msg ❌"

echo ""
echo "Validation:"
pnpm lint > /dev/null 2>&1 && echo "pnpm lint ✅" || echo "pnpm lint ❌"
pnpm typecheck > /dev/null 2>&1 && echo "pnpm typecheck ✅" || echo "pnpm typecheck ❌"
pnpm build > /dev/null 2>&1 && echo "pnpm build ✅" || echo "pnpm build ❌"

echo ""
echo "=== VERIFICATION COMPLETE ==="
```

---

## ✅ Sign-Off Checklist

After all steps, confirm:

- [ ] All 5 instruction files exist in `.github/instructions/`
- [ ] All 3 hooks present in `src/app/` and exported from barrel
- [ ] ErrorBoundary + CSS in `src/ui/organisms/` and exported
- [ ] `.commitlintrc.cjs` exists
- [ ] `.husky/commit-msg` exists
- [ ] ESLint config has security rules (8+ detect-* rules)
- [ ] `pnpm validate` passes (exit code 0)
- [ ] `pnpm lint` passes (no errors)
- [ ] `pnpm typecheck` passes (no errors)
- [ ] `pnpm build` succeeds (dist/ created)
- [ ] `pnpm commit` shows interactive prompts
- [ ] App still renders without errors (test manually or check no console errors)

✅ **All items checked = Project deployment successful**

---

## 🚀 Post-Verification

Once one project passes all checks:

1. **Document the process** — Note any tricky steps (usually ESLint merge)
2. **Create team guidance** — Share this test plan with team
3. **Deploy to next project** — Repeat process 24 more times
4. **Batch if possible** — Multiple team members can deploy in parallel

---

## ⏱️ Time Breakdown (For Planning)

| Step | Time | Notes |
|------|------|-------|
| Pre-deployment baseline | 5 min | Record current state |
| Run copy script | 5 min | Automated |
| ESLint merge | 5 min | Copy-paste security rules |
| Barrel exports | 5 min | Update 2 files |
| App wrapping | 5 min | Wrap App with ErrorBoundary |
| Install packages | 10 min | pnpm install |
| Validation | 10 min | pnpm validate |
| Commitizen test | 5 min | Test interactive commit |
| Final checks | 5 min | Verify all items |
| **TOTAL** | **45 min** | Per project |

**25 Projects**: 45 min × 25 = ~18-20 hours wall time  
**With 3 people in parallel**: ~6-7 hours total

---

## 📝 Example Success Log

```
✅ Baseline recorded
✅ Copy script ran (5 files + 3 hooks + 1 component)
✅ ESLint security rules merged
✅ App barrel exports updated
✅ ErrorBoundary wraps app
✅ 4 packages installed (135KB)
✅ pnpm lint passes (no errors)
✅ pnpm typecheck passes (no errors)
✅ pnpm build succeeds (dist created)
✅ pnpm commit works (interactive prompt shown)
✅ App renders without errors

TicTacToe Deployment: SUCCESS ✅
Ready to deploy to projects 2-25
```

---

**This process is idempotent** (can run multiple times without issues).  
**This process is parallelizable** (multiple projects can be deployed in parallel).  
**This process is reversible** (git reset/checkout to undo if needed).

---

**Next**: Run this test plan on TicTacToe, document results, then batch the remaining 24 projects.
