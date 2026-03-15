import React from 'react'
import ReactDOM from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

import { ErrorBoundary, ShellApp } from '@/ui'
import './styles.css'

// Initialize Capacitor bridge
if (Capacitor.isNativePlatform()) {
  // Hide splash screen after brief delay (app is rendering)
  setTimeout(() => {
    SplashScreen.hide().catch((err) => {
      console.warn('SplashScreen already hidden', err)
    })
  }, 500)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      onError={(error, info) => {
        // Error logged in ErrorBoundary component; can enhance with crashLogger
        console.error('React Error Boundary', error.message, info)
      }}
    >
      <ShellApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
