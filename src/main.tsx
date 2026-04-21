import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@metro/index.css"
import App from '@metro/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
