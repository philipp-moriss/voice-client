import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@app/styles/variables.css'
import '@app/styles/base.css'
import { router } from '../routes'
import { RouterProvider } from 'react-router-dom'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
