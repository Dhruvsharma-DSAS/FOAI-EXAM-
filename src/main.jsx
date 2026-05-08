import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import './styles/animations.css'
import './styles/leaflet-overrides.css'
import { ThemeProvider } from './context/ThemeContext'
import { DashboardProvider } from './context/DashboardContext'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ui/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <DashboardProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <Toaster position="bottom-left" />
      </DashboardProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
