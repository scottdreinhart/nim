import { ErrorBoundary } from '@/ui/organisms'
import ShellApp from '@/ui/organisms/ShellApp'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

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
