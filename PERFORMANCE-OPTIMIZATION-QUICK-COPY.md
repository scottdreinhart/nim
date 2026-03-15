# Performance Optimization Quick-Copy Guide

For applying the 7 optimizations to the 25 sibling projects.

---

## 1️⃣ Code-Splitting in `vite.config.js`

**Copy this `manualChunks` function into your `vite.config.js`**:

```javascript
// vite.config.js → build.rollupOptions.output.manualChunks

rollupOptions: {
  output: {
    manualChunks: (id) => {
      // Isolate React (shared vendor)
      if (id.includes('node_modules/react')) {
        return 'vendor-react'
      }
      
      // Isolate Capacitor mobile APIs
      if (id.includes('node_modules/@capacitor')) {
        return 'vendor-capacitor'
      }
      
      // Isolate react-vfx for lazy-loading
      if (id.includes('node_modules/react-vfx')) {
        return 'vendor-vfx'
      }
      
      // Externalize Electron (only use in electron/main.js)
      if (id.includes('node_modules/electron')) {
        return null // Don't bundle, it's in Electron process
      }
      
      // Separate AI worker (heavy computation)
      if (id.includes('.worker.ts')) {
        return 'ai-worker'
      }
    }
  }
}
```

**Expected Result**: 6-8 chunks instead of 1-2, faster cache busting on updates.

---

## 2️⃣ TypeScript Incremental Builds in `tsconfig.json`

**Add these flags to your `tsconfig.json` → `compilerOptions`**:

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.ts-buildinfo",
    "strict": true,
    "noImplicitAny": true,
    ...
  }
}
```

**Add to `.gitignore`**:
```
.ts-buildinfo
```

**Expected Result**: First build ~9-10s, subsequent builds ~3-5s (50%+ faster).

---

## 3️⃣ TreeShaking Configuration in `package.json`

**Add this flag to your `package.json`**:

```json
{
  "name": "your-game",
  "sideEffects": false,
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

**What it does**: Tells bundlers to aggressively eliminate dead code (unused imports, unreachable exports).

**Expected Result**: 2-5% additional bundle size savings.

---

## 4️⃣ Organism Memoization in UI Components

**Pattern to apply to `src/ui/organisms/*.tsx`**:

```typescript
import { memo } from 'react'

// Rename original component
function GameBoardRaw(props: GameBoardProps) {
  // ... existing component code ...
  return <div>...</div>
}

// Export memoized version
export const GameBoard = memo(GameBoardRaw)
```

**Apply to organisms that**:
- Receive props from Context (ThemeContext, SoundContext, etc.)
- Render frequently but props rarely change
- Have 20+ child elements

**Expected Result**: Jank-free interactions on theme/sound changes.

---

## 5️⃣ Shader Externalization (For react-vfx Components)

**If using react-vfx for WebGL effects (like GlitchText)**:

**Before**: Shader as inline string
```tsx
const shader = `
  float glitch = sin(time * 10.0) * 0.5;
  ...
`
```

**After**: External `.glsl` file

Create `src/ui/atoms/MyEffect.glsl`:
```glsl
float glitch = sin(time * 10.0) * 0.5;
gl_FragColor = vec4(color + glitch, 1.0);
```

Use in component:
```tsx
import shader from './MyEffect.glsl?raw'
import { VFXSpan } from 'react-vfx'

export function MyEffect({ children }) {
  return <VFXSpan shader={shader}>{children}</VFXSpan>
}
```

**Expected Result**: Shader compiled once at build time, not per render.

---

## 6️⃣ Add Governance Documentation

**Create `.github/instructions/14-performance-optimization.instructions.md`**

Copy from: [Nim repo → `.github/instructions/14-performance-optimization.instructions.md`]

**Contents**:
- Performance profiling philosophy
- Optimization patterns (memoization, code-splitting, treeshaking)
- Validation checklist before committing

**Update your `AGENTS.md` § 25** to reference § 14:
```markdown
### Related files

- `.github/instructions/14-performance-optimization.instructions.md` — Concrete optimization patterns
```

---

## 7️⃣ Validation Checklist

After applying optimizations, verify:

```bash
# Build performance
pnpm build                 # Should complete in 5-6s
pnpm build:analyze        # Visualize bundle chunks

# Code quality
pnpm validate              # lint + format + typecheck + build

# Bundle analysis
du -sh dist/               # Total size (should be <700KB)
ls -1 dist/assets/ | wc -l # Chunk count (should be 6-8)
```

---

## Rollout Checklist

For each of the 25 sibling projects:

- [ ] Copy 1️⃣ vite.config.js code-splitting logic
- [ ] Copy 2️⃣ tsconfig.json incremental flags + .gitignore
- [ ] Copy 3️⃣ package.json "sideEffects": false flag
- [ ] Apply 4️⃣ React.memo() to 3-5 key organisms
- [ ] Copy 5️⃣ Shader externalization pattern (if using react-vfx)
- [ ] Copy 6️⃣ § 14 governance documentation
- [ ] Run 7️⃣ validation checklist
- [ ] Commit with message: `perf: apply performance optimizations (code-splitting, TS incremental, treeshaking, memoization)`

---

## Expected Results After Rollout

**Per Project**:
- Build time: 5-6s (from ~10-12s)
- Bundle size: 8-20% smaller
- TypeScript rebuilds: 50% faster
- Theme/sound changes: Jank-free interactions

**Portfolio-Wide** (25 projects):
- Faster CI/CD pipelines (~2-3 min saved per build)
- Smaller app distributions (easier mobile deployments)
- Better user experience on slow networks
- Consistent performance standards across all projects

---

## Troubleshooting

**Q: Bundle not code-splitting correctly**
- A: Check that all paths in `manualChunks` match your `node_modules` structure
- Use `pnpm build:analyze` to visualize chunks

**Q: TypeScript incremental still slow**
- A: Delete `.ts-buildinfo` and rebuild once (cache initialization)
- Subsequent builds should be 3-5s

**Q: GlitchText shader not compiling**
- A: Ensure `.glsl` file is imported with `?raw` suffix
- Example: `import shader from './GlitchText.glsl?raw'`

**Q: React.memo() causing stale props**
- A: Only memoize organisms with stable props or deep object equality
- Test with React DevTools Profiler to confirm memoization is working

---

## Reference

- Nim Performance Report: `/PERFORMANCE-OPTIMIZATION-FINAL-REPORT.md`
- Governance Documentation: `.github/instructions/14-performance-optimization.instructions.md`
- Commit: `c1dbf92` on Nim main branch

---

*Quick guide for 25-project rollout — all patterns tested and verified*
