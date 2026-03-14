# Hamburger Menu & Settings Screen Review

> Comparing Nim against TicTacToe (gold standard) and other sibling repos.

---

## 📊 Current State Comparison

### **Nim** ✅ Foundational, Needs Enhancement

**Current Architecture:**
- **App Screen Navigation**: Loading → Menu → Settings → Game (view-based routing)
- **Settings**: Full-screen `SettingsPanel` on menu screen only
- **In-App Menu**: None — GameBoard has `onSettings` callback but unused
- **Missing**: In-app quick menu, hamburger button, dropdown behavior hook

**SettingsPanel** (src/ui/molecules/SettingsPanel.tsx):
- ✅ Rules variant toggle (Normal / Misère)
- ✅ Difficulty selector (easy/medium/hard)  
- ✅ Pile setup with quick presets
- ✅ Back button to return to menu
- ❌ No theme/sound/colorblind settings (these live in context)
- ❌ No quick-access in-app menu

---

### **TicTacToe** 🏆 Gold Standard

**Architecture:**
- **Dual-Menu System**: 
  1. **HamburgerMenu** — in-app quick settings (top-right header)
  2. **SettingsOverlay** — full-screen comprehensive settings (from menu)

**HamburgerMenu** (src/ui/molecules/HamburgerMenu.tsx):
```
┌─────────────────────────────────────┐
│ Score | Stats | [Hamburger Button]  │ ← Header
└─────────────────────────────────────┘
              ↓ (Portal to fixed position)
         ┌──────────────┐
         │ Difficulty ▼ │ ← Accessible while playing
         │ Series ▼     │
         │ Sound On/Off │
         │ Color Theme  │
         └──────────────┘
```

**Key Features:**
- ✅ 3-line icon animates to X (cubic-bezier spring)
- ✅ Portal-rendered dropdown (fixed position, above all elements)
- ✅ Positioned relative to button + board alignment
- ✅ Click-outside detection (useDropdownBehavior hook)
- ✅ Keyboard support (ESC to close, focus management)
- ✅ Touch-safe (no accidental gameplay triggers)
- ✅ Mobile-optimized (240px width, responsive top/left)

**SettingsOverlay** (src/ui/molecules/SettingsOverlay.tsx):
```
┌─────────────────────────────────────┐
│ ← Settings                          │
├─────────────────────────────────────┤
│ Difficulty    [Easy] [Medium] [Hard]│
│ Series        [1]    [3]     [5]    │
│ Sound         [On/Off]              │
│ Color Theme   [6 Options]           │
│ Display Mode  [Light/Dark/System]   │
│ Colorblind    [5 Options]           │
├─────────────────────────────────────┤
│                        [Cancel] [OK]│
└─────────────────────────────────────┘
```

**Key Features:**
- ✅ Full-screen modal (scrollable if needed)
- ✅ Organized sections (game / theme / accessibility)
- ✅ All context providers integrated (ThemeContext, etc.)
- ✅ Accessible radio/button groups
- ✅ Uses same atoms as HamburgerMenu (DifficultyToggle, SoundToggle, etc.)

---

## 🔧 Technical Deep-Dive: How It Works

### **1. The HamburgerMenu Component**

```tsx
// TicTacToe pattern
<HamburgerMenu>
  <MenuButton onDifficulty={setDifficulty}>Easy / Medium / Hard</MenuButton>
  <MenuButton onSeries={setSeries}>1 / 3 / 5</MenuButton>
  <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
</HamburgerMenu>
```

**Portal Rendering** (z-index 9999):
```tsx
createPortal(
  <div className={styles.panel} style={{ top, left }}>
    {children}
  </div>,
  document.body
)
```

**CSS Animation** (HamburgerMenu.module.css):
```css
.lineOpen:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);  /* Top line → top of X */
}
.lineOpen:nth-child(2) {
  opacity: 0;  /* Middle line disappears */
}
.lineOpen:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);  /* Bottom line → bottom of X */
}

@keyframes panelEnter {
  0% { opacity: 0; transform: scale(0.9) translateY(-8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
```

### **2. The useDropdownBehavior Hook**

```tsx
// Shared by HamburgerMenu and any other dropdown
const useDropdownBehavior = ({
  open,
  onClose,
  triggerRef,  // Button ref
  panelRef,    // Dropdown panel ref
  onOutsideClick,
}) => {
  useEffect(() => {
    if (!open) return

    const handleOutside = (e: Event) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        onClose()
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, triggerRef, panelRef, onClose])
}
```

### **3. Smart Position Calculation**

```tsx
useLayoutEffect(() => {
  if (!open || !btnRef.current) return

  const rect = btnRef.current.getBoundingClientRect()
  const boardEl = document.getElementById('game-board')
  const boardRect = boardEl?.getBoundingClientRect() || { /* ... */ }

  // Align panel's right edge to board's right edge
  let left = boardRect.right - panelWidth
  
  // Prevent overflow left of board
  if (left < boardRect.left + pad) {
    left = boardRect.left + pad
  }

  setPanelPos({ 
    top: rect.bottom + 8,  // Below button
    left
  })
}, [open])
```

---

## 📋 Other Sibling Repos

| Repo | Hamburger Menu | Settings | Notes |
|------|---|---|---|
| **TicTacToe** | ✅ HamburgerMenu | ✅ SettingsOverlay | Gold standard — dual system |
| **Shut-The-Box** | ❌ | ❌ GameSetup only | Minimal settings, no in-app menu |
| **Rock-Paper-Scissors** | ❌ | ❌ | No advanced settings |
| **Connect-Four** | ❌ | ❌ | Basic structure, no menus |
| **Nim** | ❌ | ✅ SettingsPanel (menu-only) | Good foundation, needs in-app menu |

---

## 🎯 Recommendations for Nim

### **Phase 1: Add In-App Menu (Quick Win)**

1. **Create `useDropdownBehavior` hook** (copy from TicTacToe)
   - Location: `src/app/useDropdownBehavior.ts`
   - Enables reusable dropdown/menu behavior

2. **Create `HamburgerMenu` component** (adapt from TicTacToe)
   - Location: `src/ui/molecules/HamburgerMenu.tsx`
   - Add to GameBoard header
   - Compact menu: Difficulty, Rules Variant, Sound, Theme

3. **Create Nim-specific atom toggles**:
   - `DifficultyToggle` (easy/medium/hard buttons)
   - `RulesToggle` (Normal/Misère buttons)
   - Import `SoundToggle` from `useTheme` context pattern

4. **Integrate into GameBoard**:
   ```tsx
   <div className={styles.header}>
     <span className={styles.stats}>Piles: {/* ... */}</span>
     <HamburgerMenu>
       {/* Quick settings here */}
     </HamburgerMenu>
   </div>
   ```

### **Phase 2: Enhance SettingsPanel (Polish)**

1. **Add theme selector** (like TicTacToe)
   - Color theme dropdown
   - Light/Dark/System mode

2. **Add sound control** (persistent toggle)
   - Lives in ThemeContext (already exists)
   - Expose in SettingsPanel

3. **Keep pile setup** (unique to Nim)
   - Rules variant selector
   - Difficulty for CPU AI

### **Phase 3: Accessibility (Future)**

- Colorblind mode options (if themes expand)
- Reduced motion preference
- High contrast mode

---

## 🏗️ Implementation Roadmap

### **Step 1: Copy useDropdownBehavior Hook**
```bash
# From TicTacToe → Nim
src/app/useDropdownBehavior.ts
```

**Then update `src/app/index.ts` to export it:**
```ts
export { default as useDropdownBehavior } from './useDropdownBehavior.ts'
```

### **Step 2: Create HamburgerMenu Component**
```tsx
// src/ui/molecules/HamburgerMenu.tsx
// Adapt from TicTacToe version, style to match Nim theme

// Also create companion CSS:
// src/ui/molecules/HamburgerMenu.module.css
```

### **Step 3: Create Nim-Specific Toggles**
```tsx
// src/ui/atoms/DifficultyToggle.tsx (easy/medium/hard)
// src/ui/atoms/RulesToggle.tsx (normal/misère)
```

### **Step 4: Integrate into GameBoard**
```tsx
// Update src/ui/organisms/GameBoard.tsx
// Add HamburgerMenu to header
// Remove unused onSettings callback or repurpose it
```

### **Step 5: Update molecules/index.ts**
```ts
export { HamburgerMenu } from './HamburgerMenu'
export { DifficultyToggle } from '../atoms/DifficultyToggle'
export { RulesToggle } from '../atoms/RulesToggle'
```

---

## 📐 Design Specs for Nim

| Aspect | Value | Rationale |
|---|---|---|
| **Icon Size** | 20px (3 lines) | Matches TicTacToe |
| **Button Size** | 48px min (mobile-safe) | Touch target |
| **Panel Width** | 240px | Fits most mobile viewports |
| **Animation** | 300ms cubic-bezier(0.34, 1.56, 0.64, 1) | Spring-like feel |
| **Z-Index** | 9999 | Above all game elements |
| **Position** | Fixed, top-right | Standard menu location |
| **Padding** | 14px 16px | Matches TicTacToe |
| **Border Radius** | 12px | Rounded modern look |

---

## ✅ Checklist for Nim Enhancement

- [ ] Copy `useDropdownBehavior.ts` from TicTacToe
- [ ] Create `HamburgerMenu.tsx` with 3-line animation
- [ ] Create `HamburgerMenu.module.css` with portal styles
- [ ] Create `DifficultyToggle.tsx` atom
- [ ] Create `RulesToggle.tsx` atom
- [ ] Update `GameBoard.tsx` to include HamburgerMenu header
- [ ] Test menu open/close on desktop and mobile
- [ ] Test keyboard shortcuts (ESC to close)
- [ ] Test click-outside behavior
- [ ] Verify z-index doesn't conflict with other modals
- [ ] Update `src/ui/atoms/index.ts` and `molecules/index.ts`
- [ ] Add inline comments explaining portal behavior
- [ ] Test on TV/gamepad if applicable

---

## 🚀 Quick Summary

| Feature | Nim (Current) | TicTacToe (Target) | Gap |
|---|---|---|---|
| In-App Menu | ❌ None | ✅ HamburgerMenu | **Add HamburgerMenu** |
| Quick Settings | ❌ Must exit game | ✅ Accessible via menu | **Enable in-app access** |
| Dropdown Behavior | ❌ No hook | ✅ useDropdownBehavior | **Copy & adapt hook** |
| Animation | ❌ None | ✅ 3-line → X rotate | **Add CSS animations** |
| Keyboard Support | ❌ Not handled | ✅ ESC to close | **Implement via hook** |
| Portal Rendering | ❌ Not used | ✅ Z-index safe | **Use React.createPortal** |
| Settings Atoms | ❌ Inline buttons | ✅ Reusable components | **Extract DifficultyToggle, RulesToggle** |

---

## 📚 Files to Reference

**TicTacToe (Source):**
- `src/ui/molecules/HamburgerMenu.tsx` — Main component
- `src/ui/molecules/HamburgerMenu.module.css` — Styling
- `src/app/useDropdownBehavior.ts` — Dropdown logic
- `src/ui/molecules/SettingsOverlay.tsx` — Full settings modal
- `src/ui/atoms/DifficultyToggle.tsx` — Reusable toggle

**Nim (Target):**
- `src/ui/organisms/GameBoard.tsx` — Where menu integrates
- `src/ui/molecules/SettingsPanel.tsx` — Existing settings
- `src/app/index.ts` — Export new hooks/components
- `src/ui/molecules/index.ts` — Export new components
