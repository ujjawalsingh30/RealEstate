import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PropertyProvider } from './context/PropertyContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PropertyProvider>
        <App />
      </PropertyProvider>
    </ThemeProvider>
  </StrictMode>,
)
