import React from 'react'

import type { GameMode } from '../../domain/types.ts'
import styles from './RulesToggle.module.css'

const MODES: GameMode[] = ['normal', 'misere']

interface RulesToggleProps {
  mode: GameMode
  onSelect: (mode: GameMode) => void
}

const RulesToggle = React.memo<RulesToggleProps>(({ mode, onSelect }) => (
  <div className={styles.root} role="group" aria-label="Game rules variant">
    {MODES.map((m) => (
      <button
        key={m}
        type="button"
        className={`${styles.option}${mode === m ? ` ${styles.active}` : ''}`}
        onClick={mode !== m ? () => onSelect(m) : undefined}
        aria-pressed={mode === m}
      >
        {m === 'normal' ? 'Normal' : 'Misère'}
      </button>
    ))}
  </div>
))

RulesToggle.displayName = 'RulesToggle'

export default RulesToggle
