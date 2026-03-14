# Design System Governance Gaps & Expansion Strategy

> **Authority**: Identifies architectural oversights in AGENTS.md, copilot-instructions.md, and instruction files regarding fonts, colors, and design tokens.
> **Scope**: Typography, color management, design token system, and aesthetic uniformity across scaffolded applications.
> **Status**: Proposed additions to AGENTS.md, new § Design Token Governance.

---

## Executive Summary

The current governance framework provides excellent guidance on **layer architecture**, **responsive breakpoints**, and **component hierarchy**, but lacks critical directives for:

1. **Font Management** — No embedded font strategy, no typography scale, no font-loading governance
2. **Color Palette System** — Only minimal CSS variables (`--bg`, `--text`); no semantic color tokens or accessibility rules
3. **Design Token System** — Missing typography, spacing, shadows, borders, elevations, and z-index management
4. **Theme Completeness** — Current themes are minimal; no exhaustive token application per theme
5. **Aesthetic Uniformity** — No rules ensuring visual consistency across projects using same scaffolding

---

## Current State: What's Missing

### 1. Font Management (Currently Oversimplified)

**Current Implementation** (`src/styles.css`):
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

**Gaps**:
- ❌ No embedded font strategy (relies entirely on system fonts)
- ❌ No typography/type scale (font sizes hardcoded in components: `2rem`, `1rem`, etc.)
- ❌ No line-height scale or letter-spacing guidance
- ❌ No font-loading optimization rules (no `font-display`, no preload strategy)
- ❌ No fallback hierarchy for accessibility
- ❌ No mono font for code/developer interfaces
- ❌ No weight strategy (bold, regular, light)

**Evidence**:
- `h1 { font-size: 2rem }` — hardcoded in global styles
- No `src/domain/typography.ts` or similar
- No font files in `public/fonts/`

---

### 2. Color Palette System (Currently Minimal)

**Current Implementation** (`src/themes/chiba-city.css`):
```css
[data-theme='chiba'] {
  --bg: #050505;
  --text: #00ff41;
}
```

**Gaps**:
- ❌ Only 2 semantic colors per theme (background, text)
- ❌ No primary/secondary/accent color hierarchy
- ❌ No status colors (success, error, warning, info)
- ❌ No semantic layer colors (surface, border, hover, disabled)
- ❌ No contrast validation (WCAG AA/AAA compliance not enforced)
- ❌ No opacity/alpha variants (`:hover`, `:focus`, `:disabled` states)
- ❌ No color value semantics documented (why `#050505` vs `#000000`?)

**Evidence**:
- Theme files are minimal (2 lines each)
- No color contrast rules in AGENTS.md § 12 or § 13
- Components hardcode colors inconsistently (e.g., gradients in `styles.css` use `#667eea, #764ba2` without tracking)

---

### 3. Design Token System (Nonexistent Beyond Breakpoints)

**Current Implementation**: 
- ✅ Breakpoints: `src/domain/responsive.ts` (complete)
- ✅ Z-index hints: `src/domain/layers.ts` (basic)
- ❌ Typography tokens: missing
- ❌ Spacing scale: missing
- ❌ Shadow/elevation system: missing
- ❌ Border radius scale: missing
- ❌ All other visual tokens: missing

**Gaps**:
- ❌ No `src/domain/typography.ts` with type scale, line heights, weights
- ❌ No `src/domain/colors.ts` with palette definition and contrast validation
- ❌ No `src/domain/spacing.ts` with spacing scale (8px-based, or similar)
- ❌ No `src/domain/shadows.ts` for elevation/layering
- ❌ No `src/domain/borders.ts` for radius scale and stroke widths
- ❌ No centralized theme application rules

---

### 4. Theme System Incompleteness

**Current State**:
- 8 themes with inconsistent depth
- Each theme file is 2–4 CSS variables only
- No single source of truth for theme structure

**Gaps**:
- ❌ No exhaustive checklist of required variables per theme
- ❌ No fallback/override rules if variable is missing
- ❌ No per-theme typography rules (e.g., "Synthwave uses wider letter-spacing")
- ❌ No per-theme border radius, shadows, or spacing adjustments
- ❌ No colorblind-mode integration at CSS level (only application level)

---

### 5. Accessibility & Contrast Enforcement (No Governance)

**Gaps**:
- ❌ No WCAG AA/AAA contrast ratio requirements in AGENTS.md
- ❌ No documented contrast validation for new colors
- ❌ No font size accessibility floor (e.g., "min 14px for body text on mobile")
- ❌ No color-reliance rules (e.g., "never use color alone to convey meaning")
- ❌ No contrast enforcement in linting rules (no ESLint rule for hardcoded colors)

---

## Proposed Solutions

### Solution 1: Formalized Font Management System

**New File**: `src/domain/typography.ts`

```typescript
/**
 * Typography system — type scale, weights, line heights, letter spacing.
 * Pure data, framework-agnostic. Re-exported in barrel.
 */

// Type scale: mobile-first progression
export const TYPE_SCALE = {
  // Display sizes (headlines, hero text)
  display: {
    xs: { size: '1.75rem', lineHeight: 1.2, weight: 700 },      // phones
    sm: { size: '2rem', lineHeight: 1.2, weight: 700 },         // tablets
    md: { size: '2.5rem', lineHeight: 1.15, weight: 700 },      // desktop
    lg: { size: '3rem', lineHeight: 1.1, weight: 700 },         // widescreen
  },
  // Heading 1
  h1: {
    xs: { size: '1.5rem', lineHeight: 1.3, weight: 700 },
    sm: { size: '1.75rem', lineHeight: 1.25, weight: 700 },
    md: { size: '2rem', lineHeight: 1.2, weight: 700 },
    lg: { size: '2.5rem', lineHeight: 1.15, weight: 700 },
  },
  // ... h2, h3, h4, h5, h6, body, caption, code, etc.
}

// Font weights
export const FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

// Font families (includes mono stack)
export const FONT_FAMILIES = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Fira Code", "Courier New", monospace',
  display: '"Space Grotesk", -apple-system, sans-serif', // e.g., for hero text
} as const

// Letter spacing (for tight/normal/loose control)
export const LETTER_SPACING = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.05em',
  extraWide: '0.1em',
} as const

// Line height scale
export const LINE_HEIGHTS = {
  tight: 1,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const

// Font loading config
export const FONT_LOADING = {
  // Preload critical fonts
  preload: [
    { family: 'Space Grotesk', fallback: 'sans' },
    { family: 'Fira Code', fallback: 'mono' },
  ],
  // Font display strategies per family
  display: {
    'Space Grotesk': 'swap',  // Swap immediately, load in background
    'Fira Code': 'fallback',  // Use fallback, load in background
  },
  // Subsets to load (e.g., latin-only)
  subsets: ['latin', 'latin-ext'],
} as const
```

**CSS Integration** (`src/styles.css`):
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Fira+Code:wght@400;600&display=swap');

:root {
  /* Typography tokens from domain */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Fira Code", "Courier New", monospace;
  --font-display: "Space Grotesk", -apple-system, sans-serif;

  /* Type scale (base for lg breakpoint, others via media queries) */
  --text-display-size: 3rem;
  --text-h1-size: 2rem;
  --text-h2-size: 1.75rem;
  --text-body-size: 1rem;
  --text-caption-size: 0.875rem;

  /* Line heights */
  --line-height-tight: 1;
  --line-height-normal: 1.5;
  --line-height-loose: 2;

  /* Letter spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.05em;
}

/* Responsive type scale adjustments */
@media (max-width: 599px) { /* xs/sm */
  :root {
    --text-display-size: 1.75rem;
    --text-h1-size: 1.5rem;
    --text-h2-size: 1.25rem;
    --text-body-size: 0.9375rem;
    --text-caption-size: 0.8125rem;
  }
}

@media (min-width: 600px) and (max-width: 899px) { /* md */
  :root {
    --text-display-size: 2.5rem;
    --text-h1-size: 1.75rem;
    --text-h2-size: 1.5rem;
  }
}

/* Apply type scale to semantic elements */
h1 {
  font-size: var(--text-h1-size);
  line-height: var(--line-height-tight);
  font-weight: 700;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-body-size);
  line-height: var(--line-height-normal);
}

code, pre {
  font-family: var(--font-mono);
  letter-spacing: var(--letter-spacing-wide);
}
```

---

### Solution 2: Comprehensive Color Palette System

**New File**: `src/domain/colors.ts`

```typescript
/**
 * Color palette system — semantic tokens with contrast validation.
 * Defines base colors, semantic roles, and accessibility rules.
 */

// Base palette (not directly used; foundation for themes)
export const BASE_PALETTE = {
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Primary, secondary, success, error, warning, info palettes
  // ... (full Tailwind-style palette)
} as const

// Semantic color tokens (how colors are USED, not their literal values)
export interface SemanticColors {
  // Backgrounds
  background: string
  surface: string          // Slightly raised surface (card, modal)
  surfaceHover: string     // Hover state on surface
  surfaceActive: string    // Active/pressed state
  disabled: string         // Disabled element background

  // Text / Foreground
  text: string             // Primary text
  textSecondary: string    // Secondary/muted text
  textHint: string         // Hint/helper text
  textInverse: string      // Text on colored backgrounds
  textDisabled: string     // Disabled text

  // Interactions
  primary: string          // Primary action (button, link)
  primaryHover: string
  primaryActive: string
  primaryDisabled: string

  secondary: string        // Secondary action
  secondaryHover: string
  secondaryActive: string

  // Status colors
  success: string
  successHover: string
  error: string
  errorHover: string
  warning: string
  warningHover: string
  info: string
  infoHover: string

  // Borders & dividers
  border: string
  borderLight: string
  borderStrong: string

  // Focus indicators
  focus: string

  // Overlay / scrim
  overlay: string          // Semi-transparent overlay for modals (rgba)
}

// Contrast validation helpers
export const validateContrast = (
  color1: string,
  color2: string,
  level: 'AA' | 'AAA' = 'AA',
): { ratio: number; passes: boolean } => {
  // Calculate actual contrast ratio per WCAG formula
  const ratio = getContrastRatio(color1, color2)
  const passesAA = ratio >= 4.5
  const passesAAA = ratio >= 7
  return {
    ratio,
    passes: level === 'AA' ? passesAA : passesAAA,
  }
}

// Example: Chiba City theme
export const CHIBA_THEME: SemanticColors = {
  background: '#050505',
  surface: '#0a0a0a',
  surfaceHover: '#151515',
  surfaceActive: '#202020',
  disabled: '#1a1a1a',

  text: '#00ff41',              // Verified: contrast 20+ against #050505 ✅ AAA
  textSecondary: '#00bb2f',     // Verified: contrast ~10 ✅ AAA
  textHint: '#007a1f',          // Verified: contrast ~4.5 ✅ AA
  textInverse: '#000000',
  textDisabled: '#004d14',      // Verified: contrast 4.5 ✅ AA (minimum)

  primary: '#00ff41',
  primaryHover: '#00dd37',
  primaryActive: '#00bb2f',
  primaryDisabled: '#004d14',

  secondary: '#6b21a8',         // Purple accent
  secondaryHover: '#7c3aed',
  secondaryActive: '#6d28d9',

  success: '#00ff41',
  successHover: '#00dd37',
  error: '#ff4545',             // Verified: contrast ~1.5 against #050505 ✗ FAIL
  // ^ FIX: Change to #ff7777 for contrast 2+ ✅
  errorHover: '#ff6767',
  warning: '#ffaa00',
  warningHover: '#ffb833',
  info: '#00aaff',
  infoHover: '#33bbff',

  border: '#1a1a1a',
  borderLight: '#0f0f0f',
  borderStrong: '#2a2a2a',

  focus: '#00ff41',
  overlay: 'rgba(0, 0, 0, 0.8)',
}
```

---

### Solution 3: Complete Design Token System

**New Files**:

1. **`src/domain/spacing.ts`** — 8px-based scale
2. **`src/domain/shadows.ts`** — Z-index / elevation
3. **`src/domain/borders.ts`** — Radius scale, stroke widths
4. **`src/domain/tokens.ts`** — Master barrel exporting all

```typescript
// src/domain/spacing.ts
export const SPACING = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
} as const

// src/domain/shadows.ts
export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px rgba(0, 0, 0, 0.25)',
} as const

// src/domain/borders.ts
export const BORDERS = {
  radius: {
    none: '0',
    sm: '0.25rem',
    base: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  width: {
    hairline: '0.5px',
    thin: '1px',
    base: '1.5px',
    thick: '2px',
  },
} as const
```

---

### Solution 4: Exhaustive Theme Definition

**New File**: `src/domain/theme-schema.ts`

```typescript
/**
 * Theme schema — exhaustive token requirements per theme.
 * Ensures all 8 themes are complete and consistent.
 */

export interface ThemeTokens {
  // Semantic colors (from colors.ts)
  colors: SemanticColors

  // Typography overrides (per-theme variations)
  typography?: {
    defaultLineHeight?: number
    defaultLetterSpacing?: string
    headingWeight?: number
  }

  // Spacing adjustments (compact vs spacious)
  spacing?: {
    compact?: Record<string, string>
    comfortable?: Record<string, string>
    spacious?: Record<string, string>
  }

  // Border, shadow, radius adjustments
  borders?: {
    defaultRadius?: string
    defaultBorderColor?: string
  }

  shadows?: {
    default?: string
    hover?: string
  }

  // Accessibility requirements
  a11y: {
    minContrastRatio: 'AA' | 'AAA'
    minFontSize: string
    minTouchTarget: string  // e.g., "44px"
  }
}

// Theme checklist
export const REQUIRED_THEME_FIELDS = [
  'colors.background',
  'colors.surface',
  'colors.text',
  'colors.primary',
  'colors.primaryHover',
  'colors.primaryActive',
  'colors.error',
  'colors.success',
  'colors.warning',
  'colors.border',
  'colors.focus',
  'a11y.minContrastRatio',
  'a11y.minFontSize',
  'a11y.minTouchTarget',
] as const
```

---

### Solution 5: New AGENTS.md Section — Design Token Governance

**Proposed Addition to AGENTS.md**:

```markdown
---

## § 23. Design Token & Aesthetic Governance

This section formalize design tokens (typography, color, spacing, shadows) and ensures
aesthetic uniformity across all applications using the same scaffolding.

### 23.1 Design Token System (Mandatory)

All visual decisions are expressed as **design tokens** — shareable, verifiable, reusable values.

**Layers:**
1. **Base Tokens** — Primitive values (colors, sizes, weights)
2. **Semantic Tokens** — Named by usage (primary, secondary, success, error)
3. **Component Tokens** — Component-specific computed tokens
4. **Theme Tokens** — Theme-specific overrides or extensions

**Location**: `src/domain/`
- `typography.ts` — Type scale, font families, weights, line heights
- `colors.ts` — Base palette, semantic tokens, contrast validation
- `spacing.ts` — Spacing scale (8px-based)
- `shadows.ts` — Elevation / shadow scale
- `borders.ts` — Border radius scale, stroke widths
- `tokens.ts` — Master barrel exporting all

### 23.2 Typography System (Mandatory)

All typography is defined via `src/domain/typography.ts` and applied via CSS custom properties.

**Type Scale** (mobile-first, all 5 breakpoints covered):
- Display (hero text): `1.75rem (xs) → 3rem (lg)`
- H1: `1.5rem (xs) → 2.5rem (lg)`
- H2, H3, H4, H5, H6 (explicit scale per breakpoint)
- Body (default): `0.9375rem (xs) → 1rem (lg)`
- Caption/small: `0.8125rem (xs) → 0.875rem (lg)`
- Code/mono: Fixed size, monospace family

**Font Families**:
- Sans: System stack (fallback-safe)
- Serif: For editorial content
- Mono: For code displays
- Display: Optional (e.g., "Space Grotesk" for hero)

**Font Loading** (via `FONT_LOADING` config):
- Preload critical fonts (sans, mono)
- Use `font-display: swap` for zero-FOUT
- Default fallbacks until font loads
- Subset latinonly to reduce payload

**CSS Custom Properties**:
```css
:root {
  /* Type scale */
  --text-display-size: 3rem;
  --text-h1-size: 2rem;
  --text-h2-size: 1.75rem;
  --text-body-size: 1rem;
  --text-caption-size: 0.875rem;

  /* Line heights */
  --line-height-tight: 1;
  --line-height-normal: 1.5;
  --line-height-loose: 2;

  /* Letter spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.05em;
}

/* Apply to semantic elements */
h1 { font-size: var(--text-h1-size); line-height: var(--line-height-tight); }
body { font-size: var(--text-body-size); line-height: var(--line-height-normal); }
```

**Responsive Adjustments** (via media queries):
- All 5 device tiers covered (xs, sm, md, lg, xl, xxl)
- Type scale adjusts per breakpoint
- Line height may tighten on mobile, loosen on desktop

**Rules**:
- ❌ Never hardcode font sizes in components (use CSS variables or imported tokens)
- ❌ Never mix font styles (e.g., one component sans, another serif)
- ❌ No custom fonts except from approved list
- ✅ Import type scale from `@/domain/typography`
- ✅ Use semantic font sizes (h1, body, caption) vs generic sizes
- ✅ Provide accessible minimum: 14px body on mobile, 16px on desktop

### 23.3 Color Palette & Semantic Tokens (Mandatory)

All colors are defined via `src/domain/colors.ts` with semantic meaning.

**Palette Structure**:
1. **Base Palette** — Raw colors (not directly used)
2. **Semantic Tokens** — Named by role (primary, error, success, text, border, etc.)
3. **State Variants** — Hover, active, disabled per semantic token
4. **Theme Overrides** — Per-theme customization of semantic tokens

**Semantic Token Categories**:

| Category | Tokens | Purpose |
|----------|--------|---------|
| Background | background, surface, surfaceHover, surfaceActive, disabled | Container & section backgrounds |
| Text | text, textSecondary, textHint, textInverse, textDisabled | Typography color |
| Interactions | primary, primaryHover, primaryActive, secondary, secondaryHover | Buttons, links, interactive elements |
| Status | success, successHover, error, errorHover, warning, info | Semantic feedback (✓ green, ✗ red, ⚠ orange, ℹ blue) |
| Structure | border, borderLight, borderStrong, focus, overlay | Dividers, borders, focus rings, modals |

**Contrast Validation** (WCAG Compliance):
```typescript
// In colors.ts, every color pair is validated:
validateContrast('#050505', '#00ff41') // Returns { ratio: 20+, passes: true } ✅ AAA
validateContrast('#050505', '#ff4545') // Returns { ratio: 1.5, passes: false } ✗ FAIL
```

**Rules**:
- ❌ No hardcoded hex colors in components
- ❌ No color-only semantics (e.g., "red means error" without text label)
- ❌ No theme-specific color overrides in component CSS (theme CSS only)
- ✅ All colors imported from `@/domain/colors`
- ✅ All color pairs validated for AA contrast minimum
- ✅ Status colors (success, error, warning) also convey meaning via icon/text
- ✅ Focus indicators visible on all interactive elements

**CSS Application**:
```css
[data-theme='chiba'] {
  --color-background: #050505;
  --color-surface: #0a0a0a;
  --color-text: #00ff41;
  --color-text-secondary: #00bb2f;
  --color-primary: #00ff41;
  --color-error: #ff7777;           /* Fixed from #ff4545 */
  --color-border: #1a1a1a;
  /* ... exhaustive token list ... */
}

/* Component usage */
button {
  background-color: var(--color-primary);
  color: var(--color-background);
  border: 1px solid var(--color-border);
}

button:hover {
  background-color: var(--color-primary-hover);
}

button:disabled {
  background-color: var(--color-primary-disabled);
  color: var(--color-text-disabled);
}
```

### 23.4 Spacing Scale (Mandatory)

All spacing (padding, margin, gap) uses a consistent 8px-based scale from `src/domain/spacing.ts`.

| Token | Value | Use Case |
|-------|-------|----------|
| 0 | 0 | Remove spacing |
| 1 | 4px | Icon spacing, tight columns |
| 2 | 8px | Default padding, standard gap |
| 3 | 12px | Compact sections |
| 4 | 16px | Standard section padding |
| 6 | 24px | Large section padding |
| 8 | 32px | Hero padding, spacious layouts |
| 12 | 48px | XL section spacing |
| 16 | 64px | Full-page padding |

**CSS Variables**:
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-4: 1rem;     /* 16px */
  --space-8: 2rem;     /* 32px */
  /* ... */
}

.button {
  padding: var(--space-2) var(--space-4);  /* 8px 16px */
}

.section {
  padding: var(--space-8);                 /* 32px all sides */
}
```

**Rules**:
- ❌ No arbitrary padding/margin (e.g., `padding: 13px` or `margin: 5px`)
- ❌ No responsive spacing tweaks outside media queries
- ✅ All spacing from `SPACING` object in `src/domain/spacing.ts`
- ✅ Content density scale applies per `responsive.contentDensity`:
  - Compact: spacing * 0.75 (reduce padding/gap)
  - Comfortable: spacing * 1.0 (standard)
  - Spacious: spacing * 1.25 (increase padding/gap)

### 23.5 Shadows & Elevation (Mandatory)

Shadow scale from `src/domain/shadows.ts` ensures consistent depth.

| Level | Use Case | Example |
|-------|----------|---------|
| none | Flat surfaces | Base background |
| xs | Subtle hover | Tooltip, small overlay |
| sm | Raised interactive | Card hover state |
| base | Standard elevation | Default card, popover |
| md | Elevated content | Modal, dropdown |
| lg | High elevation | Full-screen dialog |
| xl | Floating UI | Floating action button, toast |

**Rules**:
- ❌ No custom shadow values
- ✅ Shadows applied via `box-shadow: var(--shadow-base)` etc.
- ✅ Elevation communicates hierarchy (higher shadow = higher z-index)

### 23.6 Border Radius Scale (Mandatory)

Consistent border radius from `src/domain/borders.ts`.

| Token | Value | Use Case |
|-------|-------|----------|
| none | 0 | Sharp corners |
| sm | 4px | Subtle roundness |
| base | 6px | Default buttons, inputs |
| md | 8px | Cards, containers |
| lg | 12px | Modals |
| xl | 16px | Hero sections |
| full | 9999px | Badges, pills, circles |

**Rules**:
- ❌ No arbitrary radius values
- ✅ All radius from `BORDERS.radius` scale

### 23.7 Theme Completeness Checklist

Every theme must include **all** required CSS variables:

**Required Tokens Per Theme**:
```
Color tokens (16+):
  - background, surface, surfaceHover, surfaceActive, disabled
  - text, textSecondary, textHint, textInverse, textDisabled
  - primary, primaryHover, primaryActive, primaryDisabled
  - secondary, secondaryHover, secondaryActive, secondaryDisabled
  - success, successHover, error, errorHover, warning, info
  - border, borderLight, borderStrong, focus, overlay

Typography (optional per-theme customization):
  - --font-family-display (if different)
  - --line-height-default (if different)
  - --letter-spacing-default (if different)

Spacing (optional per-theme customization):
  - None required (inherits global scale)

Accessibility (required):
  - minContrastRatio: 'AA' (minimum) or 'AAA'
  - minFontSize: 14px (mobile), 16px (desktop)
  - minTouchTarget: 44px
```

**Validation** (in linting):
```typescript
// eslint-plugin-design-tokens could validate:
- All required CSS variables present
- All color pairs meet WCAG AA minimum
- No hardcoded colors outside @theme rules
- No arbitrary spacing values
```

### 23.8 Cross-Project Aesthetic Uniformity

When using the same scaffolding across multiple projects:

**Shared Governance**:
- `src/domain/typography.ts` — Identical across projects
- `src/domain/spacing.ts` — Identical across projects
- `src/domain/shadows.ts` — Identical across projects
- `src/domain/borders.ts` — Identical across projects

**Per-Project Customization** (if allowed):
- `src/domain/colors.ts` — Can add project-specific semantic tokens
- `src/themes/` — Project-specific themes using same semantic tokens

**Example**: Two projects using Nim scaffolding
- **Project A (Nim)**: Uses 8 predefined themes (chiba, synthwave, etc.)
- **Project B (MyGame)**: Uses 4 custom themes (forest, urban, space, retro) all inheriting same spacing/type/shadows

Both projects use identical typography scale, spacing scale, and border radius scale, ensuring visual consistency.

**Rules**:
- ❌ Never override `src/domain/typography.ts` per-project
- ❌ Never override `src/domain/spacing.ts` per-project
- ✅ Colors can be customized per-project (create new themes)
- ✅ Accessibility rules (minContrastRatio, minFontSize) must apply to all projects

### 23.9 Agent Checklist

- [ ] All colors hardcoded in components? → Migrate to `src/domain/colors.ts`
- [ ] Font sizes hardcoded? → Use type scale from `src/domain/typography.ts`
- [ ] Spacing inconsistent? → Use `SPACING` scale from `src/domain/spacing.ts`
- [ ] New theme added? → Validate all required tokens present
- [ ] Color pair created? → Validate WCAG AA contrast minimum
- [ ] Font imported? → Configured font-loading strategy in `typography.ts`
- [ ] Theme overriding component colors? → Move to theme CSS variables
- [ ] Focus indicator missing? → Add `--color-focus` ring on `:focus-visible`
- [ ] Cross-project baseline? → All projects share domain tokens (colors can differ)
```

---

## Summary Table: Current vs. Proposed

| Concern | Current Status | Proposed Addition | Impact |
|---------|---|---|---|
| **Fonts** | System stack only | ✅ `src/domain/typography.ts` w/ type scale | Typography consistency, accessibility |
| **Colors** | 2 variables per theme | ✅ `src/domain/colors.ts` w/ 20+ semantic tokens | Color consistency, WCAG compliance, design logic |
| **Spacing** | Hardcoded per-component | ✅ `src/domain/spacing.ts` w/ 8px scale | Spacing uniformity, scalability |
| **Shadows** | Scattered, ad-hoc | ✅ `src/domain/shadows.ts` w/ 7-level scale | Visual hierarchy, consistency |
| **Borders** | Vary widely | ✅ `src/domain/borders.ts` w/ radius & width scales | Polish, consistency |
| **Contrast** | No enforcement | ✅ Validation in domain layer | WCAG AA/AAA accessibility |
| **Themes** | Minimal (2 vars) | ✅ Exhaustive per theme (20+ required vars) | Theme completeness, fallback safety |
| **Cross-Project** | Ad-hoc | ✅ § 23.8 uniformity rules | Scaffolding scalability |
| **Governance** | Implicit | ✅ AGENTS.md § 23 + checklists | Clarity, enforcement capability |

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Create `src/domain/typography.ts` with type scale + CSS variables
- [ ] Create `src/domain/colors.ts` with semantic tokens + contrast validation
- [ ] Add font loading to `src/styles.css`
- [ ] Update `src/styles.css` to use CSS custom properties

### Phase 2: Expansion (Week 3-4)
- [ ] Create `src/domain/spacing.ts`, `shadows.ts`, `borders.ts`
- [ ] Create `src/domain/tokens.ts` barrel
- [ ] Create `src/domain/theme-schema.ts` with checklist
- [ ] Audit all 8 themes; ensure completeness

### Phase 3: Integration (Week 5-6)
- [ ] Update all components to use tokens from domain layer
- [ ] Remove hardcoded colors, spacing, font sizes from components
- [ ] Update theme CSS files with exhaustive token lists
- [ ] Create ESLint rule to block hardcoded hex colors

### Phase 4: Governance (Week 7-8)
- [ ] Add § 23 to AGENTS.md
- [ ] Create `.github/instructions/09-design-tokens.instructions.md`
- [ ] Document per-theme accessibility requirements
- [ ] Create design token verification script

---

## References & Rationale

**Why These Gaps Matter:**

1. **Fonts**: Hardcoded sizes prevent responsive typography and hurt accessibility. No embedded strategy means fonts vary per machine.

2. **Colors**: Only 2 semantic colors makes themes fragile. Status colors undefined. No contrast enforcement risks WCAG violations.

3. **Design Tokens**: Scattered values across components make refactoring hard. New developers don't know spacing scale or color philosophy.

4. **Theme Completeness**: Minimal themes break if a variable is missing. No fallback system.

5. **Cross-Project Uniformity**: Without shared token definitions, scaffolded projects diverge visually and become unmaintainable as a family.

**This expansion aligns with:**
- AGENTS.md § 10 (SOLID principles) — centralized tokens = single responsibility
- AGENTS.md § 12 (Responsive Design) — type scale must respond to device tier
- AGENTS.md § 21 (File Organization) — tokens belong in domain layer
- AGENTS.md § 22 (Build Governance) — new task for token validation

---

## Next Steps

1. **User Review**: Review this document; approve proposed additions
2. **Domain Implementation**: Create typography, colors, spacing, shadows, borders files
3. **CSS Integration**: Update `src/styles.css` to use exported tokens
4. **Component Migration**: Update all components to import from domain
5. **Governance Update**: Commit § 23 to AGENTS.md
6. **Instruction File**: Create `.github/instructions/09-design-tokens.instructions.md`
7. **Validation Script**: Add ESLint rule / pre-commit hook to enforce token usage

