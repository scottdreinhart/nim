# Governance Deployment Checklist

**Template Source**: `/mnt/c/Users/scott/nim/` (validated, built, tested)  
**Deployment Status**: Proven via TicTacToe pilot  
**Build Status**: ✅ Phase 2 complete (`typecheck`: 15/15 pass, `build`: 15/15 pass)

---

## Quick Reference: 8-Step Deployment (5 minutes per project)

| # | Task | Command | Time | Status |
|---|------|---------|------|--------|
| 1 | Copy governance instructions | `cp nim/.github/instructions/*.md project/.github/instructions/` | 15s | ✅ |
| 2 | Copy app hooks | `cp nim/src/app/{useLongPress,usePerformanceMetrics}.ts project/src/app/` | 15s | ✅ |
| 3 | Copy ErrorBoundary component | `cp nim/src/ui/organisms/ErrorBoundary.{tsx,module.css} project/src/ui/organisms/` | 10s | ✅ |
| 4 | Update package.json | Add 4 packages + commitizen config + scripts.commit | 1m | ✅ |
| 5 | Merge eslint.config.js | Import security plugin, add to plugins, add 8 rules | 1m | ✅ |
| 6 | Update barrel exports | Add 3 hooks to `src/app/index.ts`, add ErrorBoundary to `src/ui/organisms/index.ts` | 1m | ✅ |
| 7 | Install & verify | `pnpm install && pnpm typecheck && pnpm build` | 2m | ⚠️ |
| 8 | Commit | `pnpm commit` (interactive) | 1m | ✅ |

**Total Time**: ~7 minutes per project  
**Success**: Both Step 7 checks PASS (typecheck + build)

---

## Detailed Instructions

### Step 1: Copy Governance Instruction Files

**Source**: `nim/.github/instructions/`  
**Target**: `your-project/.github/instructions/`

Files to copy (5 total):
- `09-wcag-accessibility.instructions.md`
- `10-security.instructions.md`
- `11-performance.instructions.md`
- `12-error-handling.instructions.md`
- `13-mobile-gestures.instructions.md`

**Command**:
```bash
mkdir -p your-project/.github/instructions
cp nim/.github/instructions/0{9,12,13}*.md your-project/.github/instructions/
cp nim/.github/instructions/1{0,1}*.md your-project/.github/instructions/
```

**Verify**: `ls your-project/.github/instructions/ | wc -l` should show **5 files**

---

### Step 2: Copy Custom App Hooks

**Source**: `nim/src/app/`  
**Target**: `your-project/src/app/`

Files to copy (2 total):
- `useLongPress.ts` (long-press gesture detection)
- `usePerformanceMetrics.ts` (Web Vitals tracking)

**Command**:
```bash
cp nim/src/app/useLongPress.ts your-project/src/app/
cp nim/src/app/usePerformanceMetrics.ts your-project/src/app/
```

**Verify**: Both files exist in target

---

### Step 3: Copy ErrorBoundary Component

**Source**: `nim/src/ui/organisms/`  
**Target**: `your-project/src/ui/organisms/`

Files to copy (2 total):
- `ErrorBoundary.tsx` (error catching + dev logging)
- `ErrorBoundary.module.css` (styles)

**Command**:
```bash
cp nim/src/ui/organisms/ErrorBoundary.tsx your-project/src/ui/organisms/
cp nim/src/ui/organisms/ErrorBoundary.module.css your-project/src/ui/organisms/
```

**Verify**: Both files exist in target

---

### Step 4: Update package.json

**Add to `devDependencies`**:
```json
"eslint-plugin-security": "^4.0.0",
"commitizen": "^4.3.1",
"cz-conventional-changelog": "^3.3.0",
"@commitlint/config-conventional": "^19.5.0",
```

**Add at root level**:
```json
"commitizen": {
  "path": "cz-conventional-changelog"
},
```

**Add to `scripts`**:
```json
"commit": "pnpm exec cz",
```

---

### Step 5: Merge eslint.config.js

**Add import**:
```javascript
import securityPlugin from 'eslint-plugin-security'
```

**Add to plugins**:
```javascript
security: securityPlugin,
```

**Add these 8 rules**:
```javascript
'security/detect-object-injection': 'warn',
'security/detect-non-literal-regexp': 'warn',
'security/detect-unsafe-regex': 'warn',
'security/detect-buffer-noassert': 'warn',
'security/detect-child-process': 'warn',
'security/detect-no-csrf-before-method-override': 'warn',
'security/detect-non-literal-fs-filename': 'warn',
'security/detect-non-literal-require': 'warn',
```

---

### Step 6: Update Barrel Exports

**Add to `src/app/index.ts`**:
```typescript
export { useLongPress } from './useLongPress'
export { usePerformanceMetrics, logWebVitals } from './usePerformanceMetrics'
```

**Add to `src/ui/organisms/index.ts`**:
```typescript
export { ErrorBoundary } from './ErrorBoundary'
```

---

### Step 7: Install & Verify Build

```bash
cd your-project
pnpm install
pnpm typecheck    # Must PASS
pnpm build        # Must PASS
```

**Success**: Both typecheck and build complete without errors

---

### Step 8: Commit with New Workflow

```bash
pnpm commit
```

Follow the interactive prompts:
1. Type: `feat`
2. Scope: project name
3. Subject: `deploy governance patterns from Nim template`
4. Body: Add details about what was deployed
5. Breaking changes: `n`
6. Issues: Leave blank

---

## Success Checklist

- [x] All 5 instruction files copied
- [x] Both hook files copied
- [x] ErrorBoundary files copied
- [x] Barrel exports updated (src/app/index.ts, src/ui/organisms/index.ts)
- [x] `package.json` updated (4 packages, commitizen, script)
- [x] `eslint.config.js` updated (security plugin + 8 rules)
- [x] `pnpm typecheck` PASS (per project) — **15/15 pass**
- [x] `pnpm build` PASS (per project) — **15/15 pass**
- [x] `pnpm commit` creates conventional commit (per project)
- [x] Step 5 dedicated commit coverage (`feat: add security plugin to eslint`) — **15/15**

---

## Step 7 Result Matrix (15 Projects)

| Project | Typecheck | Build |
|---|---|---|
| 2048 | PASS | PASS |
| battleship | PASS | PASS |
| bunco | PASS | PASS |
| checkers | PASS | PASS |
| connect-four | PASS | PASS |
| hangman | PASS | PASS |
| lights-out | PASS | PASS |
| memory-game | PASS | PASS |
| minesweeper | PASS | PASS |
| pig | PASS | PASS |
| reversi | PASS | PASS |
| rock-paper-scissors | PASS | PASS |
| simon-says | PASS | PASS |
| snake | PASS | PASS |
| tictactoe | PASS | PASS |

**Summary**: `typecheck` PASS = **15/15**, `build` PASS = **15/15**

**Remaining failing repos**
- None

**Phase 2 fixes applied**
- `minesweeper`: removed duplicate `ErrorBoundary` re-export from `src/ui/organisms/index.ts`
- `snake`: fixed `useLongPress` timer typing in `src/app/useLongPress.ts`
- `pig`: repaired Linux toolchain (`node_modules` reinstall), updated `typecheck` script and responsive hook usage in `src/ui/organisms/App.tsx`

---

## Deployment Status Summary

**Nim (Template)**
- ✅ TypeScript: 0 errors
- ✅ Build: PASS (2.47s, 293KB)
- ✅ Ready for copying

**TicTacToe (Pilot)**
- ✅ Deployment: PASS
- ✅ TypeScript: 0 errors
- ✅ Build: PASS (2.43s, 274KB)
- ✅ Process validated

**15-Project Rollout**: Steps 1–8 complete; Step 7 fully validated across all projects

---

Last Updated: March 14, 2026
