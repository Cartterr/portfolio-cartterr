import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider.tsx'
import {
  applyPortfolioIdentity,
  getPortfolioModeFromPathname,
} from './hooks/usePortfolioRoute.ts'
import './index.css'

applyPortfolioIdentity(getPortfolioModeFromPathname(window.location.pathname))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </React.StrictMode>,
)
