import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 80,
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      // Иконки из src/assets/fav (копируются в public/fav для стабильных URL)
      includeAssets: ['fav/favicon.ico', 'fav/android-icon-192x192.png', 'fav/ms-icon-310x310.png', 'fav/apple-icon-180x180.png'],
      manifest: {
        name: 'Voice Helper — Задачи',
        short_name: 'Voice Helper',
        description: 'Управление задачами. Вход через Telegram или браузер.',
        theme_color: '#1a1a2e',
        background_color: '#16213e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/fav/android-icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/fav/android-icon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
          { src: '/fav/ms-icon-310x310.png', sizes: '310x310', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/telegram\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'telegram-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
})
