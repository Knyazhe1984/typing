import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initI18n } from './i18n'
import './index.css'
import { useSettings } from './store/settings'

initI18n(useSettings.getState().uiLanguage)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
