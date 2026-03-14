import { useResponsiveState, useDropdownBehavior } from '@/app'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './HamburgerMenu.module.css'

interface PanelPosition {
  top: number
  left: number
}

interface HamburgerMenuProps {
  children: React.ReactNode
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ children }) => {
  const responsive = useResponsiveState()
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState<PanelPosition | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  // Helper function to calculate intelligent position
  const calculatePosition = useCallback(() => {
    if (!btnRef.current || !panelRef.current) {
      return
    }

    const btnRect = btnRef.current.getBoundingClientRect()
    const panelEl = panelRef.current
    const panelWidth = panelEl.offsetWidth || 240
    const panelHeight = panelEl.offsetHeight || 200

    const TOOLTIP_GAP = 8
    const VIEWPORT_PAD = 12

    // Try positioning below button first
    let top = btnRect.bottom + TOOLTIP_GAP
    let left = btnRect.right - panelWidth // Align right edges by default

    // If menu goes off right edge, shift left
    if (left + panelWidth > window.innerWidth - VIEWPORT_PAD) {
      left = window.innerWidth - panelWidth - VIEWPORT_PAD
    }

    // If menu goes off left edge, shift right
    if (left < VIEWPORT_PAD) {
      left = VIEWPORT_PAD
    }

    // If menu goes off bottom, position above button instead
    if (top + panelHeight > window.innerHeight - VIEWPORT_PAD) {
      top = btnRect.top - panelHeight - TOOLTIP_GAP
    }

    // Clamp top to viewport
    if (top < VIEWPORT_PAD) {
      top = VIEWPORT_PAD
    }

    setPanelPos({ top, left })
  }, [])

  // Compute intelligent fixed position from button bounding rect
  useLayoutEffect(() => {
    if (!open || !btnRef.current || !panelRef.current) {
      return
    }

    // Give panel a moment to render so we can measure it
    setTimeout(() => {
      calculatePosition()
    }, 0)
  }, [open, calculatePosition])

  // Reposition menu on window resize
  useLayoutEffect(() => {
    if (!open) {return}

    const handleResize = () => {
      // Recalculate position on window resize
      calculatePosition()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [open, calculatePosition])

  // Close on outside click / touch / Escape + focus trap via shared hook
  useDropdownBehavior({
    open,
    onClose: () => setOpen(false),
    triggerRef: btnRef,
    panelRef,
  })

  // Determine panel max-width based on device class and content density
  const getPanelMaxWidth = (): string => {
    if (responsive.isMobile) {
      return 'min(90vw, 320px)'
    }
    if (responsive.isTablet) {
      return 'min(85vw, 400px)'
    }
    return 'min(80vw, 480px)'
  }

  return (
    <div className={styles.root}>
      <button
        ref={btnRef}
        type="button"
        className={styles.button}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="nim-menu-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        title="Menu"
      >
        <span className={styles.icon} aria-hidden="true">
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id="nim-menu-panel"
            className={styles.panel}
            role="menu"
            aria-label="Game settings"
            style={{
              ...(panelPos
                ? { top: panelPos.top, left: panelPos.left }
                : { visibility: 'hidden' as const }),
              maxWidth: getPanelMaxWidth(),
              padding: responsive.contentDensity === 'compact' ? '1rem' : '1.5rem',
              gap: responsive.contentDensity === 'compact' ? '1rem' : '1.5rem',
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  )
}

export default HamburgerMenu
