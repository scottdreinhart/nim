/**
 * ShellApp — Lightweight shell that renders splash immediately,
 * then lazy-loads the full app with providers.
 *
 * This speeds up initial render: splash shows during React init.
 */

import { DEFAULT_LOCALE, translate } from '@/domain'
import { lazy, Suspense } from 'react'

// Lazy-load the full app with providers (deferred until needed)
const AppWithProviders = lazy(() => import('./AppWithProviders'))

// Immediate splash fallback
function ImmediateSplash() {
  return (
    <div className="nim-splash">
      <div className="nim-splash__orb"></div>
      <div className="nim-splash__grid"></div>
      <div className="nim-splash__content">
        <div className="nim-splash__badge">
          <div className="nim-splash__emoji">🎯</div>
        </div>
        <div className="nim-splash__eyebrow">{translate(DEFAULT_LOCALE, 'app.splashEyebrow')}</div>
        <h1 className="nim-splash__title">Nim</h1>
        <p className="nim-splash__subtitle">{translate(DEFAULT_LOCALE, 'app.splashSubtitle')}</p>
        <div className="nim-splash__loading">
          <span className="nim-splash__dot"></span>
          <span className="nim-splash__dot"></span>
          <span className="nim-splash__dot"></span>
        </div>
      </div>
    </div>
  )
}

export default function ShellApp() {
  return (
    <Suspense fallback={<ImmediateSplash />}>
      <AppWithProviders />
    </Suspense>
  )
}
