import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

// Analytics component auto-tracks page views and visits.
// It only activates in production (vercel.com) — does nothing
// in local dev so it never pollutes your real data.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
