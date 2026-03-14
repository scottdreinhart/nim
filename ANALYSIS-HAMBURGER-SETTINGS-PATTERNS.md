# UI Pattern Analysis: Hamburger Menu & Settings Screens
## Cross-Repository Study
**Scope**: tictactoe, shut-the-box, rock-paper-scissors, connect-four  
**Created**: March 13, 2026  
**Focus**: Reusable patterns for Nim project enhancement

---

## Executive Summary

**TicTacToe** is the model implementation with a sophisticated, reusable hamburger menu pattern and comprehensive settings architecture. The remaining repos range from minimal (shut-the-box with setup-only) to zero (rock-paper-scissors, connect-four have no settings UI).

**Key Finding**: TicTacToe's `HamburgerMenu` component using React.createPortal() + useDropdownBehavior is the gold standard for in-app menu access. All repos would benefit from this pattern.

**Recommendation for Nim**: Adopt TicTacToe's HamburgerMenu for in-app settings access, while keeping SettingsPanel as the full-screen modal for comprehensive configuration.

---

## 1. TICTACTOE — Advanced UI Pattern

### 1.1 Hamburger Menu Implementation

**File**: [src/ui/molecules/HamburgerMenu.tsx](src/ui/molecules/HamburgerMenu.tsx)

#### Component Architecture

```tsx
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState<PanelPosition | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // 1. Calculate fixed position from button bounding rect
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const boardEl = document.getElementById('game-board')
    const boardRect = boardEl
      ? boardEl.getBoundingClientRect()
      : { left: 0, right: window.innerWidth }
    
    const panelWidth = 240
    const pad = 8
    // Align panel's right edge to board's right edge
    let left = boardRect.right - panelWidth
    if (left < boardRect.left + pad) {
      left = boardRect.left + pad
    }
    setPanelPos({ top: rect.bottom + 8, left })
  }, [open])

  // 2. Toggle open/closed
  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  // 3. Dropdown behavior: close on outside click, ESC key, focus trap
  useDropdownBehavior({
    open,
    onClose: () => setOpen(false),
    triggerRef: btnRef,
    panelRef,
  })

  return (
    <div className={styles.root}>
      {/* Hamburger button */}
      <button
        ref={btnRef}
        type="button"
        className={styles.button}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="game-menu-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <span className={styles.icon} aria-hidden="true">
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
        </span>
      </button>

      {/* Portal to document.body for layering */}
      {open && createPortal(
        <div
          ref={panelRef}
          id="game-menu-panel"
          className={styles.panel}
          role="menu"
          aria-label="Game settings"
          style={panelPos ? { top: panelPos.top, left: panelPos.left } : undefined}
        >
          {children}
        </div>,
        document.body,
      )}
    </div>
  )
}
```

#### Key Features

| Feature | Implementation |
|---------|----------------|
| **Trigger** | Click hamburger button (3-line icon) |
| **Open State** | Local `useState(false)` |
| **Position** | Calculated via useLayoutEffect from button rect |
| **Portal** | `createPortal(panel, document.body)` |
| **Alignment** | Right-edge aligned to game board |
| **Overflow** | Clamps to left side if panel overflows |
| **Keyboard** | ESC to close, focus trap via useDropdownBehavior |
| **Touch** | Full mousedown + touchstart listener support |

#### Mobile vs Desktop

- **Desktop**: Fixed positioning aligns to board edge
- **Mobile**: Same logic; panel fits within viewport
- **Touch**: Identical event handling (no special touch behavior)
- **Responsive**: Works at any viewport width

#### Animation Details

**CSS Module**: [src/ui/molecules/HamburgerMenu.module.css](src/ui/molecules/HamburgerMenu.module.css)

```css
/* Button */
.button {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 48px;
  min-height: 48px;
  transition: background-color 200ms ease, transform 200ms ease;
}

.button:hover {
  background: var(--cell-hover-bg);
  transform: scale(1.05);
}

.button:active {
  transform: scale(0.95);
}

/* Lines transform to X */
.line {
  display: block;
  height: 2.5px;
  width: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: transform 300ms ease, opacity 300ms ease;
}

.lineOpen:nth-child(1) {
  /* Top line rotates 45deg down */
  transform: translateY(6.5px) rotate(45deg);
}

.lineOpen:nth-child(2) {
  /* Middle line fades out */
  opacity: 0;
}

.lineOpen:nth-child(3) {
  /* Bottom line rotates -45deg up */
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Panel entrance animation */
.panel {
  position: fixed;
  z-index: 9999;
  background: var(--card-bg);
  border: 2px solid var(--accent);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 8px 32px var(--card-shadow);
  min-width: 240px;
  animation: panelEnter 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes panelEnter {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-8px);
  }
  100% {
    opacity: 0;
    transform: scale(1) translateY(0);
  }
}
```

### 1.2 Settings Screen

**File**: [src/ui/molecules/SettingsOverlay.tsx](src/ui/molecules/SettingsOverlay.tsx)

#### Component Structure

```tsx
export function SettingsOverlay({
  difficulty,
  seriesLength,
  soundEnabled,
  onSetDifficulty,
  onSetSeriesLength,
  onToggleSound,
  onBack,
}: SettingsOverlayProps) {
  const { settings, setColorTheme, setMode, setColorblind } = useThemeContext()

  const themes = ['forest', 'ocean', 'sunset', 'rose', 'midnight', 'highcontrast']
  const modes = ['light', 'dark', 'system']
  const colorblindModes = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']

  return (
    <div className={styles.overlay}>
      <h1 className={styles.title}>Settings</h1>
      
      <div className={styles.settingsScroll} style={{ width: '100%', maxWidth: '400px' }}>
        {/* Difficulty */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Difficulty</div>
          <div className={styles.selectorRow}>
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                className={d === difficulty ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => onSetDifficulty(d as Difficulty)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Series Length */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Series</div>
          <div className={styles.selectorRow}>
            {[1, 3, 5].map((n) => (
              <button
                key={n}
                className={n === seriesLength ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => onSetSeriesLength(n)}
              >
                Best of {n}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Sound</div>
          <div className={styles.row}>
            <button
              className={soundEnabled ? styles.toggleBtnOn : styles.toggleBtn}
              onClick={onToggleSound}
            >
              {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* Color Theme */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Color Theme</div>
          <div className={styles.selectorRow}>
            {themes.map((t) => (
              <button
                key={t}
                className={t === settings.colorTheme ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => setColorTheme(t as any)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Display Mode */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Display Mode</div>
          <div className={styles.selectorRow}>
            {modes.map((m) => (
              <button
                key={m}
                className={m === settings.mode ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => setMode(m as any)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Colorblind Mode */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Colorblind Mode</div>
          <div className={styles.selectorRow}>
            {colorblindModes.map((cb) => (
              <button
                key={cb}
                className={cb === settings.colorblind ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => setColorblind(cb as any)}
              >
                {cb}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.menu} style={{ marginTop: '1.5rem' }}>
        <button className={styles.menuBtnPrimary} onClick={onBack} autoFocus>
          Back
        </button>
      </div>
    </div>
  )
}
```

#### Available Settings

| Category | Options | Storage | Context |
|----------|---------|---------|---------|
| **Difficulty** | easy, medium, hard, unbeatable | State (app.tsx) | Game logic |
| **Series Length** | Free, Bo3, Bo5, Bo7 | State (app.tsx) | Series tracking |
| **Sound** | On / Off | SoundContext + localStorage | useSoundEffects |
| **Color Theme** | forest, ocean, sunset, rose, midnight, highcontrast | localStorage | ThemeContext |
| **Display Mode** | light, dark, system | localStorage | ThemeContext |
| **Colorblind Mode** | none, protanopia, deuteranopia, tritanopia, achromatopsia | localStorage | ThemeContext |

#### Form Layout

```css
.settingsScroll {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.settingsSection {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.settingsSection:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  text-align: center;
}

.selectorRow {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.selectorBtn {
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  background: transparent;
  color: var(--fg, #e0e0e0);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.selectorBtnActive {
  background: var(--accent, #667eea);
  color: #fff;
  border-color: var(--accent, #667eea);
}
```

### 1.3 Navigation Architecture

**File**: [src/ui/organisms/App.tsx](src/ui/organisms/App.tsx)

#### Phase-Based Navigation

```tsx
type AppPhase = 'menu' | 'playing' | 'settings' | 'help' | 'stats' | 'game-over'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [seriesLength, setSeriesLength] = useState(1)
  
  // Navigation callbacks
  const handlePlayClicked = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleSettingsClicked = useCallback(() => {
    setPhase('settings')
  }, [])

  const handleBackToMenu = useCallback(() => {
    setPhase('menu')
  }, [])

  // Phase rendering
  if (phase === 'menu') {
    return (
      <MainMenu
        onPlay={handlePlayClicked}
        onSettings={handleSettingsClicked}
        onHelp={handleHelpClicked}
        onStats={handleStatsClicked}
      />
    )
  }

  if (phase === 'settings') {
    return (
      <SettingsOverlay
        difficulty={difficulty}
        seriesLength={seriesLength}
        soundEnabled={soundEnabled}
        onSetDifficulty={handleSetDifficulty}
        onSetSeriesLength={handleSetSeriesLength}
        onToggleSound={toggleSound}
        onBack={handleBackToMenu}
      />
    )
  }

  // ... TicTacToeGame with in-app HamburgerMenu
  return <TicTacToeGame />
}
```

#### In-App Menu Access

**File**: [src/ui/organisms/TicTacToeGame.tsx](src/ui/organisms/TicTacToeGame.tsx) (excerpt)

```tsx
return (
  <div className={styles.game}>
    <header>
      <h1>Tic Tac Toe</h1>
      
      {/* In-app hamburger menu — wraps settings components */}
      <HamburgerMenu>
        <div className={styles.menuSection} role="group" aria-label="Difficulty">
          <span className={styles.menuLabel}>Difficulty</span>
          <DifficultyToggle difficulty={difficulty} onSelect={handleSetDifficulty} />
        </div>
        <div className={styles.menuSection} role="group" aria-label="Series">
          <span className={styles.menuLabel}>Series</span>
          <SeriesSelector seriesLength={seriesLength} onSelect={handleSeriesChange} />
        </div>
        <div className={styles.menuSection} role="group" aria-label="Sound">
          <span className={styles.menuLabel}>Sound</span>
          <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
        </div>
        <div className={styles.menuSection} role="group" aria-label="Theme">
          <span className={styles.menuLabel}>Theme</span>
          <ThemeSelector
            settings={settings}
            onColorTheme={setColorTheme}
            onMode={setMode}
            onColorblind={setColorblind}
          />
        </div>
        <div className={styles.menuSection} role="group" aria-label="Help">
          <span className={styles.menuLabel}>Help</span>
          <Instructions />
        </div>
      </HamburgerMenu>
    </header>

    {/* Game board and UI */}
    <Scoreboard ... />
    <BoardGrid ... />
    <MoveTimeline ... />
  </div>
)
```

#### useDropdownBehavior Hook

**File**: [src/app/useDropdownBehavior.ts](src/app/useDropdownBehavior.ts)

```tsx
const useDropdownBehavior = ({
  open,
  onClose,
  triggerRef,
  panelRef,
  onOutsideClick,
}: DropdownConfig): void => {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return

    // Outside click dismissal
    const handleOutside = (e: Event) => {
      const target = e.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        onOutsideClick?.()
        onCloseRef.current()
      }
    }

    // ESC key dismissal
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, triggerRef, panelRef, onOutsideClick])
}
```

### 1.4 Context Providers

#### ThemeContext

**File**: [src/app/ThemeContext.tsx](src/app/ThemeContext.tsx) (excerpt)

```tsx
const STORAGE_KEY = 'ttt-theme-settings'

const loadSettings = (): ThemeSettings => {
  const parsed = load<ThemeSettings>(STORAGE_KEY)
  if (parsed) {
    return { ...DEFAULT_SETTINGS, ...parsed }
  }
  return { ...DEFAULT_SETTINGS }
}

const saveSettings = (settings: ThemeSettings): void => {
  save(STORAGE_KEY, settings)
}

const applyToDOM = (settings: ThemeSettings): void => {
  // Apply CSS variables and dynamic theme CSS
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(loadSettings)

  const setColorTheme = useCallback((id: string) => {
    const updated = { ...settings, colorTheme: id }
    setSettings(updated)
    saveSettings(updated)
    applyThemeCSS(id)
  }, [settings])

  const setMode = useCallback((mode: string) => {
    const updated = { ...settings, mode }
    setSettings(updated)
    saveSettings(updated)
    applyToDOM(updated)
  }, [settings])

  return (
    <ThemeContext.Provider value={{ settings, setColorTheme, setMode, ... }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be within ThemeProvider')
  return ctx
}
```

#### SoundContext

**File**: [src/app/SoundContext.tsx](src/app/SoundContext.tsx)

```tsx
const SoundContext = createContext<UseSoundEffectsReturn | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const sound = useSoundEffects()
  return <SoundContext.Provider value={sound}>{children}</SoundContext.Provider>
}

export function useSoundContext(): UseSoundEffectsReturn {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSoundContext must be used within a <SoundProvider>')
  }
  return ctx
}
```

### 1.5 Reusable Settings Atoms

#### DifficultyToggle

**File**: [src/ui/atoms/DifficultyToggle.tsx](src/ui/atoms/DifficultyToggle.tsx)

```tsx
const LEVELS: Difficulty[] = ['easy', 'medium', 'hard', 'unbeatable']

const DifficultyToggle = React.memo<DifficultyToggleProps>(({ difficulty, onSelect }) => (
  <div className={styles.root} role="group" aria-label="CPU difficulty">
    {LEVELS.map((level) => (
      <button
        key={level}
        type="button"
        className={`${styles.option}${difficulty === level ? ` ${styles.active}` : ''}`}
        onClick={difficulty !== level ? () => onSelect(level) : undefined}
        aria-pressed={difficulty === level}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </button>
    ))}
  </div>
))
```

#### SeriesSelector

**File**: [src/ui/atoms/SeriesSelector.tsx](src/ui/atoms/SeriesSelector.tsx)

```tsx
const SERIES_OPTIONS = [
  { value: 0, label: 'Free' },
  { value: 3, label: 'Bo3' },
  { value: 5, label: 'Bo5' },
  { value: 7, label: 'Bo7' },
] as const

const SeriesSelector = React.memo<SeriesSelectorProps>(({ seriesLength, onSelect }) => (
  <div className={styles.root} role="group" aria-label="Series mode">
    {SERIES_OPTIONS.map(({ value, label }) => (
      <button
        key={value}
        type="button"
        className={`${styles.option}${seriesLength === value ? ` ${styles.active}` : ''}`}
        onClick={seriesLength !== value ? () => onSelect(value) : undefined}
        aria-pressed={seriesLength === value}
      >
        {label}
      </button>
    ))}
  </div>
))
```

#### SoundToggle

**File**: [src/ui/atoms/SoundToggle.tsx](src/ui/atoms/SoundToggle.tsx)

```tsx
const SoundToggle = React.memo<SoundToggleProps>(({ soundEnabled, onToggle }) => (
  <button
    type="button"
    className={styles.root}
    onClick={onToggle}
    aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
    title={soundEnabled ? 'Sound on' : 'Sound off'}
  >
    {soundEnabled ? '🔊' : '🔇'}
  </button>
))
```

### 1.6 ThemeSelector Molecule

**File**: [src/ui/molecules/ThemeSelector.tsx](src/ui/molecules/ThemeSelector.tsx) (excerpt)

Features:
- Uses `useDropdownBehavior` for panel management
- Uses `useSmartPosition` for left/right auto-alignment
- Avoids viewport overflow
- Renders color swatches for visual selection
- Radio buttons for mode/colorblind selection

---

## 2. SHUT-THE-BOX — Minimal Setup

### 2.1 Implementation Status

- **No hamburger menu**
- **No settings screen**
- **Only GameSetup** for player configuration

### 2.2 GameSetup Component

**File**: [src/ui/organisms/GameSetup.tsx](src/ui/organisms/GameSetup.tsx)

```tsx
export function GameSetup() {
  const { dispatch } = useGameContext()
  const [numPlayers, setNumPlayers] = useState(2)
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2'])

  const handleStartGame = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      score: 0,
      isAI: false,
    }))
    dispatch({ type: 'INITIALIZE_GAME', players })
  }

  return (
    <div className={styles.setup}>
      <h1>Shut the Box</h1>
      <p className={styles.subtitle}>Roll dice, flip numbered tiles...</p>

      <div className={styles.section}>
        <h2>Number of Players</h2>
        <div className={styles.playerCount}>
          {[2, 3, 4].map((num) => (
            <button
              key={num}
              className={`${styles.countButton} ${numPlayers === num ? styles.active : ''}`}
              onClick={() => setNumPlayers(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Player Names</h2>
        <div className={styles.playerNames}>
          {playerNames.map((name, index) => (
            <input
              key={index}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Button onClick={handleStartGame} variant="success">
        Start Game
      </Button>
    </div>
  )
}
```

### 2.3 Navigation Flow

```
App (GameProvider)
  └─ GameContent
      ├─ Loading (2.5s splash)
      ├─ GameSetup (player config)
      ├─ GamePlayBoard (game state = 'gamePlay')
      └─ GameOver (game state = 'gameOver')
```

**Limitations**:
- Cannot adjust settings once game starts
- No theme/sound controls
- No help/instructions
- Player-focused, not AI-focused

---

## 3. ROCK-PAPER-SCISSORS — Game-Only

### 3.1 Tier Selector

**File**: [src/ui/atoms/TierSelector.tsx](src/ui/atoms/TierSelector.tsx)

```tsx
export default function App() {
  const [selectedTier, setSelectedTier] = useState<GameTier>(DEFAULT_TIER)
  const [gameStarted, setGameStarted] = useState(false)

  const handleStartGame = (tier: GameTier) => {
    setSelectedTier(tier)
    setGameStarted(true)
  }

  if (!gameStarted) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>♾️ ✊ ✋ ✌️</h1>
          <p className="subtitle">Choose Your Challenge</p>
        </header>
        <main className="app-main">
          <TierSelector selectedTier={selectedTier} onSelectTier={handleStartGame} />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">Best of {gameState.bestOf} Rounds</header>
      <main className="app-main">
        <Score ... />
        <RoundResultDisplay ... />
        <div className="moves-container">
          <p className="moves-label">Make your move:</p>
          {/* Move buttons */}
        </div>
      </main>
    </div>
  )
}
```

**Features**:
- Simple binary state (gameStarted)
- Tier selection (AI difficulty/variant)
- No runtime settings change
- No menu navigation

---

## 4. CONNECT-FOUR — Game-State Driven

### 4.1 Implementation

**File**: [src/ui/organisms/App.tsx](src/ui/organisms/App.tsx) (excerpt)

```tsx
export default function App() {
  const [game, setGame] = useState<GameState>(() => 
    createInitialState('pvc', 'medium')
  )
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [activeCol, setActiveCol] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  // Web Worker for CPU moves
  useEffect(() => {
    const worker = new Worker(new URL('../../workers/ai.worker.ts', import.meta.url), {
      type: 'module',
    })
    workerRef.current = worker
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  // Keyboard controls
  const handleColumnClick = useCallback((col: number) => {
    if (isGameOver || isThinking || isCpuTurn) return
    // ... apply move logic
  }, [game, isGameOver, isThinking, isCpuTurn])

  // Render game board directly
  return (
    <div className={styles.app}>
      {/* Board columns + pieces */}
    </div>
  )
}
```

**Characteristics**:
- No menu or settings UI
- Game state fully controls rendering
- Difficulty hardcoded in initial state
- Keyboard controls inline
- Web Worker for CPU computation

---

## 5. NIM (Current Project)

### 5.1 Current Implementation

**MainMenu**: [src/ui/molecules/MainMenu.tsx](src/ui/molecules/MainMenu.tsx)

```tsx
export function MainMenu({ isMobile, stats, onPlay, onPlayLocal, onSettings }: MainMenuProps) {
  return (
    <div className={cx(styles.root, isMobile && styles.rootMobile)}>
      <h1 className={styles.title}>Game of Nim</h1>
      <p className={styles.subtitle}>A classic strategy game</p>

      {(stats.wins > 0 || stats.losses > 0) && (
        <div className={styles.statsRow}>
          {/* Stats display */}
        </div>
      )}

      <div className={styles.buttons}>
        <button className={styles.primaryBtn} onClick={onPlay}>
          Play vs AI
        </button>
        <button className={styles.secondaryBtn} onClick={onPlayLocal}>
          2 Player
        </button>
        <button className={styles.secondaryBtn} onClick={onSettings}>
          Settings
        </button>
      </div>
    </div>
  )
}
```

**SettingsPanel**: [src/ui/molecules/SettingsPanel.tsx](src/ui/molecules/SettingsPanel.tsx)

```tsx
export function SettingsPanel({
  mode,
  difficulty,
  setup,
  onModeChange,
  onDifficultyChange,
  onSetupChange,
  onBack,
}: SettingsPanelProps) {
  const [localSetup, setLocalSetup] = useState<number[]>(setup)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          ←
        </button>
        <h2 className={styles.headerTitle}>Settings</h2>
      </div>

      {/* Rules Variant (Normal/Misère) */}
      <div className={styles.card}>
        <h3>Rules Variant</h3>
        <div className={styles.radioGroup}>
          {/* Radio buttons */}
        </div>
      </div>

      {/* Difficulty */}
      {/* */}
      {/* Custom Setup */}
      {/* */}
    </div>
  )
}
```

**GameBoard**: Includes `onSettings` callback for accessing settings during gameplay

### 5.2 Opportunities for Enhancement

1. **In-App Hamburger Menu**
   - Reuse TicTacToe's HamburgerMenu pattern
   - Expose subset of settings controls
   - Keep SettingsPanel for comprehensive config

2. **Settings Atoms**
   - Create RulesToggle (Normal/Misère)
   - Create DifficultySelector (easy/medium/hard)
   - Reuse TicTacToe's toggle/selector patterns

3. **Keyboard Support**
   - ESC to close menus
   - ? for help
   - Consistent with tictactoe

4. **Theme/Sound Context**
   - Adopt ThemeContext pattern if themes added
   - Adopt SoundContext if audio added

---

## 6. Cross-Repo Comparison Table

### Feature Matrix

| Feature | TicTacToe | Shut-Box | RPS | Connect4 | Nim |
|---------|-----------|----------|-----|----------|-----|
| **Hamburger Menu** | ✅ Portal-based | ❌ | ❌ | ❌ | ❌ |
| **In-App Settings** | ✅ Via HamburgerMenu | ❌ | ❌ | ❌ | ❌ |
| **Full Settings Screen** | ✅ SettingsOverlay | ❌ | ❌ | ❌ | ✅ SettingsPanel |
| **Phase Navigation** | ✅ 6+ phases | ❌ (3 phases) | ❌ (boolean) | ❌ (state) | ✅ (menu/game/settings) |
| **ThemeContext** | ✅ With persistence | ✅ Available | ✅ Available | ❌ | ✅ Available |
| **SoundContext** | ✅ With toggle | ✅ Available | ✅ Available | ❌ | ✅ Available |
| **Difficulty Control** | ✅ Runtime changeable | ❌ | ❌ | ❌ (hardcoded) | ✅ In settings |
| **Keyboard Shortcuts** | ✅ (ESC, arrows, etc) | ❓ | ❌ | ✅ (arrows, space) | ✅ (arrows) |
| **Touch Support** | ✅ | ❓ | ❌ | ❌ | ❓ |
| **Mobile Responsive** | ✅ | ✅ | ❓ | ❌ | ✅ |
| **Accessibility** | ✅ (aria-*, focus) | ✅ | ❓ | ❌ | ✅ |

### Component Hierarchy Patterns

#### TicTacToe (Recommended)

```
App (organisms)
├─ MainMenu (molecules)
│   └─ Simple hamburger [state toggle]
├─ TicTacToeGame (organisms)
│   ├─ HamburgerMenu (molecules) [reusable]
│   │   ├─ DifficultyToggle (atoms)
│   │   ├─ SeriesSelector (atoms)
│   │   ├─ SoundToggle (atoms)
│   │   └─ ThemeSelector (molecules)
│   ├─ Scoreboard (molecules)
│   ├─ BoardGrid (molecules)
│   └─ MoveTimeline (molecules)
├─ SettingsOverlay (molecules)
├─ HelpOverlay (molecules)
├─ StatsOverlay (molecules)
└─ GameOverOverlay (molecules)
```

#### Nim (Current)

```
App (organisms)
├─ MainMenu (molecules)
├─ GameBoard (organisms)
│   └─ PileToggle (molecules)
└─ SettingsPanel (molecules)
```

---

## 7. UI Pattern Recommendations for Nim

### 7.1 Adopt TicTacToe's HamburgerMenu

**Why**:
- Reusable across multiple screens
- Handles positioning intelligently
- Accessible (aria-labels, focus management)
- Mobile-friendly via portal approach
- Well-animated, polished UX

**Implementation Steps**:
1. Copy `HamburgerMenu.tsx` and `HamburgerMenu.module.css` from tictactoe
2. Copy `useDropdownBehavior.ts` hook
3. Wrap in GameBoard header for in-app access
4. Adapt children to Nim's settings atoms

### 7.2 Create Settings Atoms

**DifficultyToggle for Nim**:
```tsx
const LEVELS: Difficulty[] = ['easy', 'medium', 'hard']

const DifficultyToggle = React.memo<DifficultyToggleProps>(
  ({ difficulty, onSelect }) => (
    <div className={styles.root} role="group" aria-label="CPU difficulty">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          className={`${styles.option}${difficulty === level ? ` ${styles.active}` : ''}`}
          onClick={difficulty !== level ? () => onSelect(level) : undefined}
          aria-pressed={difficulty === level}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  )
)
```

**RulesToggle for Nim**:
```tsx
const RulesToggle = React.memo<RulesToggleProps>(
  ({ mode, onSelect }) => (
    <div className={styles.root} role="group" aria-label="Game rules">
      {['normal', 'misere'].map((m) => (
        <button
          key={m}
          type="button"
          className={`${styles.option}${mode === m ? ` ${styles.active}` : ''}`}
          onClick={mode !== m ? () => onSelect(m as GameMode) : undefined}
          aria-pressed={mode === m}
        >
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  )
)
```

### 7.3 Enhance GameBoard

```tsx
export function GameBoard({
  state,
  selectedPileId,
  selectedCount,
  difficulty,
  opponent,
  cpuThinking,
  isMobile,
  onObjectClick,
  onConfirm,
  onReset,
  onBack,
  onSettings,
}: GameBoardProps) {
  return (
    <div className={styles.root}>
      <header>
        <h1>Nim</h1>
        
        {/* In-app hamburger menu */}
        <HamburgerMenu>
          <div className={styles.menuSection} role="group" aria-label="Difficulty">
            <span className={styles.menuLabel}>Difficulty</span>
            <DifficultyToggle difficulty={difficulty} onSelect={...} />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Rules">
            <span className={styles.menuLabel}>Rules</span>
            <RulesToggle mode={gameMode} onSelect={...} />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Help">
            <span className={styles.menuLabel}>Help</span>
            <Instructions />
          </div>
          <button onClick={onBack} className={styles.menuBtn}>
            Back to Menu
          </button>
        </HamburgerMenu>
      </header>

      {/* Game board UI */}
      <div className={styles.board}>
        {/* Pile rendering */}
      </div>
    </div>
  )
}
```

### 7.4 Keep SettingsPanel as Modal

Keep the comprehensive SettingsPanel for menu-screen access:
- Full rules explanation
- Setup customization (pile counts)
- This is for planning before game starts

HamburgerMenu is for quick adjustments during gameplay.

---

## 8. Key Implementation Insights

### Hamburger Menu Portal Pattern

**Why `createPortal()`?**
- Avoids z-index stacking context issues
- Panel appears above fixed headers/board
- Positioning calculated independently
- Cleaner DOM hierarchy

### useDropdownBehavior Hook

**Why separate hook?**
- Reusable across multiple dropdowns (ThemeSelector, HamburgerMenu, etc.)
- Handles ESC key, outside-click, touch events
- Focus restoration
- Clean separation of concerns

### Phase-Based Navigation

**Advantages**:
- Clear state machine (can't be in 2 phases)
- Each phase has distinct UR component tree
- Easy to reason about navigation flow
- Prevents overlapping modals

**Example**:
```tsx
if (phase === 'menu') return <MainMenu />
if (phase === 'settings') return <SettingsOverlay />
if (phase === 'playing') return <Game />
```

### Context Providers for Global State

**ThemeContext**:
- Centralizes theme/mode/colorblind logic
- Persists to localStorage
- Accessible anywhere via hook
- Applies CSS dynamically

**SoundContext**:
- Wraps useSoundEffects hook
- Exposes sound state + play functions
- Can be muted from any component
- Persists preference if needed

---

## 9. Files to Study (Direct Links)

### TicTacToe Hamburger Menu Implementation
- Component: [HamburgerMenu.tsx](src/ui/molecules/HamburgerMenu.tsx)
- Styles: [HamburgerMenu.module.css](src/ui/molecules/HamburgerMenu.module.css)
- Behavior: [useDropdownBehavior.ts](src/app/useDropdownBehavior.ts)
- Smart Position: [useSmartPosition.ts](src/app/useSmartPosition.ts)

### TicTacToe Settings Implementation
- SettingsOverlay: [SettingsOverlay.tsx](src/ui/molecules/SettingsOverlay.tsx)
- Overlay Styles: [Overlay.module.css](src/ui/molecules/Overlay.module.css)
- Theme Context: [ThemeContext.tsx](src/app/ThemeContext.tsx)
- Sound Context: [SoundContext.tsx](src/app/SoundContext.tsx)

### TicTacToe Settings Atoms
- DifficultyToggle: [DifficultyToggle.tsx](src/ui/atoms/DifficultyToggle.tsx)
- SeriesSelector: [SeriesSelector.tsx](src/ui/atoms/SeriesSelector.tsx)
- SoundToggle: [SoundToggle.tsx](src/ui/atoms/SoundToggle.tsx)
- ThemeSelector: [ThemeSelector.tsx](src/ui/molecules/ThemeSelector.tsx)

### Integration in Gameplay
- TicTacToeGame: [TicTacToeGame.tsx](src/ui/organisms/TicTacToeGame.tsx) — shows menu wrapping children
- App.tsx: [App.tsx](src/ui/organisms/App.tsx) — shows phase-based routing

### Nim Current Implementation
- MainMenu: [MainMenu.tsx](src/ui/molecules/MainMenu.tsx)
- SettingsPanel: [SettingsPanel.tsx](src/ui/molecules/SettingsPanel.tsx)
- GameBoard: [GameBoard.tsx](src/ui/organisms/GameBoard.tsx)

---

## 10. Summary & Recommendations

### Best Practices to Adopt from TicTacToe

1. ✅ **HamburgerMenu component** — reusable, portal-based, accessible
2. ✅ **useDropdownBehavior hook** — handles ESC, outside-click, focus
3. ✅ **useSmartPosition hook** — prevents panel overflow
4. ✅ **Settings atoms** — DifficultyToggle, SeriesSelector, etc.
5. ✅ **ThemeContext + SoundContext** — global state with persistence
6. ✅ **CSS Modules** — scoped styles, no collisions
7. ✅ **Phase-based navigation** — clear state machine
8. ✅ **Overlay.module.css** — shared base styles for modals
9. ✅ **Accessibility** — aria-labels, aria-pressed, focus management
10. ✅ **Keyboard support** — ESC, arrows, Enter

### Maturity Ranking

| Repo | UI Maturity | Recommended For |
|------|------------|-----------------|
| 🥇 TicTacToe | Excellent | Reference implementation |
| 🥈 Shut-The-Box | Good (basic) | Simpler multi-player setup |
| 🥉 Rock-Paper-Scissors | Fair (game only) | Minimal UI needs |
| 🔴 Connect-Four | Basic (no menu) | Pure game state rendering |

### Final Recommendations

**For Nim**:

1. **Import HamburgerMenu** from tictactoe or implement similar
2. **Keep SettingsPanel** as comprehensive modal (menu screen)
3. **Add RulesToggle atom** (Normal/Misère)
4. **Add DifficultyToggle atom** (Easy/Medium/Hard)
5. **Use ThemeContext/SoundContext** if themes/audio added
6. **Support keyboard** (ESC to close, ? for help)
7. **Test responsiveness** on mobile

**Timeline**: Start with HamburgerMenu + atoms, integrate into GameBoard header.

---

**Analysis Complete**  
Generated: March 13, 2026
