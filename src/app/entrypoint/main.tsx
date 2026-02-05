import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { isTelegramWebApp } from '@shared/lib'
import '@app/styles/variables.css'
import '@app/styles/base.css'
import { router } from '../routes'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../providers/auth-provider'

// В Telegram Mini App PWA (Service Worker) не регистрируем
if (!isTelegramWebApp()) {
  registerSW({ immediate: true })
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
