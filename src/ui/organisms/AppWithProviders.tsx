/**
 * AppWithProviders — Wraps App with ThemeProvider, SoundProvider, and ErrorBoundary.
 * This is lazy-loaded by ShellApp, so heavy initialization is deferred.
 */

import { SoundProvider } from '@/app/SoundContext'
import { ThemeProvider } from '@/app/ThemeContext'
import { ErrorBoundary } from '@/ui/atoms/ErrorBoundary'

import App from './App'

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SoundProvider>
    </ThemeProvider>
  )
}
