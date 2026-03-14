# 25-Project Rollout Guide

**Status**: Nim is complete template  
**Target**: Apply 4-week governance implementation across all 25 projects  
**Total Time**: ~30 minutes per project  
**Quality Gate**: All projects must pass `pnpm validate` after rollout

---

## Files to Copy

### Instruction Files (5 files)
**Source**: `nim/.github/instructions/`  
**Destination**: `<project>/.github/instructions/`

```
09-wcag-accessibility.instructions.md
10-security.instructions.md
11-performance.instructions.md
12-error-handling.instructions.md
13-mobile-gestures.instructions.md
```

### Custom Hooks (3 files)
**Source**: `nim/src/app/`  
**Destination**: `<project>/src/app/`

```
useSwipeGesture.ts
useLongPress.ts
usePerformanceMetrics.ts
```

### Error Boundary Component (2 files)
**Source**: `nim/src/ui/organisms/`  
**Destination**: `<project>/src/ui/organisms/`

```
ErrorBoundary.tsx
ErrorBoundary.module.css
```

### Configuration Files (2 files)
**Source**: `nim/`  
**Destination**: `<project>/`

```
.commitlintrc.cjs          (NEW for project)
eslint.config.js           (UPDATED — merge security rules)
```

---

## Package Installation

Add 3 new devDependencies to each project:

```bash
pnpm add -D eslint-plugin-security commitizen cz-conventional-changelog
```

Or manually update `package.json`:

```json
{
  "devDependencies": {
    "eslint-plugin-security": "^3.1.1",
    "commitizen": "^4.3.1",
    "cz-conventional-changelog": "^3.3.0",
    "@commitlint/config-conventional": "^19.5.0"
  }
}
```

Then run:

```bash
pnpm install
```

---

## Step-by-Step Rollout (Per Project)

### Step 1: Copy Instruction Files
```bash
# From nim directory
cp .github/instructions/09-*.md /path/to/<project>/.github/instructions/
cp .github/instructions/1[0-3]-*.md /path/to/<project>/.github/instructions/
```

### Step 2: Copy Custom Hooks
```bash
# From nim directory
cp src/app/useSwipeGesture.ts /path/to/<project>/src/app/
cp src/app/useLongPress.ts /path/to/<project>/src/app/
cp src/app/usePerformanceMetrics.ts /path/to/<project>/src/app/
```

### Step 3: Copy ErrorBoundary Component
```bash
# From nim directory
cp src/ui/organisms/ErrorBoundary.tsx /path/to/<project>/src/ui/organisms/
cp src/ui/organisms/ErrorBoundary.module.css /path/to/<project>/src/ui/organisms/
```

### Step 4: Copy Configuration Files
```bash
# From nim directory
cp .commitlintrc.cjs /path/to/<project>/
cp eslint.config.js /path/to/<project>/
```

### Step 5: Install Packages
```bash
cd /path/to/<project>
pnpm install
```

### Step 6: Update Exports
Edit `/path/to/<project>/src/app/index.ts`:

```typescript
// Add these exports (keep existing ones)
export { useSwipeGesture } from './useSwipeGesture'
export { useLongPress } from './useLongPress'
export { usePerformanceMetrics, logWebVitals } from './usePerformanceMetrics'
```

Edit `/path/to/<project>/src/ui/organisms/index.ts`:

```typescript
// Add this export (keep existing ones)
export { ErrorBoundary } from './ErrorBoundary'
```

### Step 7: Wrap App with ErrorBoundary
Edit `/path/to/<project>/src/index.tsx`:

```typescript
import { ErrorBoundary } from '@/ui/organisms'
import ShellApp from '@/ui/organisms/ShellApp'  // Or equivalent app root
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary onError={(error, info) => console.error(error)}>
      <ShellApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

### Step 8: Update package.json (Commitizen Config)
Add to `package.json`:

```json
{
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

Add script to `package.json`:

```json
{
  "scripts": {
    "commit": "pnpm exec cz commit"
  }
}
```

### Step 9: Validation
```bash
cd /path/to/<project>

# Full validation should pass
pnpm validate

# Test conventional commits
pnpm commit      # Interactive prompt
git log --oneline  # Verify format
```

### Step 10: Commit & Push
```bash
# Using new workflow
pnpm commit

# Follow prompts:
# ? Select the type of change that you're committing:
#   feat: A new feature
#   fix: A bug fix
#   docs: Documentation only changes
#   style: Changes that do not affect the meaning of the code
#   refactor: A code change that neither fixes a bug nor adds a feature
#   perf: A code change that improves performance
#   test: Adding missing tests or correcting existing tests
#   chore: Changes to the build process or auxiliary tools
#   a11y: Accessibility improvements
#   security: Security fixes
```

---

## Verification Checklist (Per Project)

- [ ] 5 instruction files copied to `.github/instructions/`
- [ ] 3 custom hooks copied to `src/app/`
- [ ] ErrorBoundary component + CSS copied to `src/ui/organisms/`
- [ ] `.commitlintrc.cjs` copied to project root
- [ ] `eslint.config.js` updated with security rules
- [ ] `pnpm install` completed successfully
- [ ] `src/app/index.ts` exports new hooks
- [ ] `src/ui/organisms/index.ts` exports ErrorBoundary
- [ ] `src/index.tsx` wraps App with ErrorBoundary
- [ ] `package.json` includes commitizen config + commit script
- [ ] `pnpm validate` passes (lint + format + typecheck + build)
- [ ] `pnpm commit` works with interactive prompt
- [ ] Git log shows conventional format: `feat(...): ...`, `fix(...): ...`, etc.

---

## Expected Outcomes

**Per Project After Rollout**:

✅ ESLint security rules active  
✅ 30+ a11y rules enforced  
✅ Conventional commits enforced (pre-commit hook)  
✅ Error boundary wrapping entire app  
✅ Swipe/long-press hooks available  
✅ Performance metrics tracking ready  
✅ 5 governance reference docs (instruction files)  

**Across All 25 Projects**:

✅ Consistent security patterns (XSS prevention)  
✅ Consistent a11y compliance (WCAG)  
✅ Consistent commit history (conventional format)  
✅ Consistent error recovery (error boundaries)  
✅ Consistent mobile UX (gesture hooks)  
✅ Consistent performance monitoring  

---

## Automated Rollout Script (Optional)

If you need to rollout to multiple projects at once:

```bash
#!/bin/bash
# rollout.sh — Apply nim template to all 25 projects

PROJECTS=(
  "snake"
  "tictactoe"
  # ... (add all 25 project names)
)

NIM_PATH="/path/to/nim"
PROJECTS_PATH="/path/to/projects"

for PROJECT in "${PROJECTS[@]}"; do
  PROJECT_PATH="$PROJECTS_PATH/$PROJECT"
  
  echo "🚀 Rolling out to $PROJECT..."
  
  # Copy instruction files
  cp "$NIM_PATH/.github/instructions/09-*.md" "$PROJECT_PATH/.github/instructions/"
  cp "$NIM_PATH/.github/instructions/1[0-3]-*.md" "$PROJECT_PATH/.github/instructions/"
  
  # Copy hooks
  cp "$NIM_PATH/src/app/useSwipeGesture.ts" "$PROJECT_PATH/src/app/"
  cp "$NIM_PATH/src/app/useLongPress.ts" "$PROJECT_PATH/src/app/"
  cp "$NIM_PATH/src/app/usePerformanceMetrics.ts" "$PROJECT_PATH/src/app/"
  
  # Copy ErrorBoundary
  cp "$NIM_PATH/src/ui/organisms/ErrorBoundary.tsx" "$PROJECT_PATH/src/ui/organisms/"
  cp "$NIM_PATH/src/ui/organisms/ErrorBoundary.module.css" "$PROJECT_PATH/src/ui/organisms/"
  
  # Copy config
  cp "$NIM_PATH/.commitlintrc.cjs" "$PROJECT_PATH/"
  cp "$NIM_PATH/eslint.config.js" "$PROJECT_PATH/"
  
  # Install
  cd "$PROJECT_PATH"
  pnpm install
  
  # Validate
  echo "✅ Validating $PROJECT..."
  pnpm validate || echo "❌ Validation failed for $PROJECT"
  
  echo "---"
done

echo "🎉 Rollout complete!"
```

---

## Common Issues & Fixes

### Issue: Type errors in usePerformanceMetrics
**Cause**: TypeScript version mismatch  
**Fix**: Ensure `tsconfig.json` has `lib: ["dom", "es2020"]`

### Issue: ErrorBoundary not catching errors
**Cause**: Error thrown in event handler, not render  
**Fix**: Error boundaries only catch render errors. Event errors need try-catch.

### Issue: Commitizen prompt not showing
**Cause**: Missing config in package.json  
**Fix**: Add `"commitizen": { "path": "cz-conventional-changelog" }` to package.json

### Issue: ESLint security rules not enforcing
**Cause**: eslint-plugin-security not in eslintrc  
**Fix**: Ensure `eslint.config.js` has `import securityPlugin from 'eslint-plugin-security'` and plugin registered

---

## Support & Questions

**If rollout fails validation in a project:**

1. Run `pnpm lint` — check which rules fail
2. Run `pnpm typecheck` — check type errors
3. Run `pnpm format` — auto-fix formatting
4. Run `pnpm validate` again

**If tests fail:**

1. Ensure existing tests still pass: `pnpm test`
2. Check test imports (may need to update paths if project structure differs)

---

## Timeline

**Recommended Rollout Schedule**:

- **Day 1**: Rollout to 5 projects (core games: tictactoe, snake, etc.)
- **Day 2**: Rollout to next 10 projects
- **Day 3**: Rollout to remaining 10 projects
- **Day 4**: Team training + Q&A

**Per-Project Time**: ~20-30 minutes (copy files + install + validate + commit)

---

## Success Criteria

After complete rollout:

- ✅ All 25 projects pass `pnpm validate`
- ✅ All 25 projects have conventional commits enforced
- ✅ All 25 projects have security linting active
- ✅ All 25 projects can use new hooks/components
- ✅ All 25 projects follow consistent governance patterns

---

**Created**: March 14, 2026  
**Authority**: AGENTS.md § 22, IMPLEMENTATION-COMPLETE.md  
**Template Source**: Nim (complete, validated template)
