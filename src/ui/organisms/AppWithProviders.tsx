/**
 * AppWithProviders — Wraps App with ThemeProvider, SoundProvider, and ErrorBoundary.
 * This is lazy-loaded by ShellApp, so heavy initialization is deferred.
 */

import { I18nProvider, SoundProvider } from '@/app'
import { ThemeProvider } from '@/app/context/ThemeContext'
import { ErrorBoundary } from '@/ui'

import App from './App'

export default function AppWithProviders() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <SoundProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </SoundProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
