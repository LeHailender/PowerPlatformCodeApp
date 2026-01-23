import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PowerProvider from './PowerProvider.tsx'
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <PowerProvider>
        <App />
      </PowerProvider>
    </ThemeProvider>
  </StrictMode>,
)
