import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'

import './index.css'
import App from './App.tsx'
import { AppProvider } from '@/context/AppContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
      <Analytics />
    </AppProvider>
  </StrictMode>,
)
