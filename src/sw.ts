/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

// Предкэширование ресурсов (манифест подставляется плагином)
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  clientsClaim()
})

// SPA: навигация ведёт на index.html
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') return false
    if (url.pathname.startsWith('/_')) return false
    if (fileExtensionRegexp.test(url.pathname)) return false
    return true
  },
  createHandlerBoundToURL('/index.html'),
)

// Кеширование изображений
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
    ],
  }),
)

// Кеширование API (если запросы идут на /api/ или на ваш backend)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
  }),
)

// Статика (скрипты, стили)
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
)
