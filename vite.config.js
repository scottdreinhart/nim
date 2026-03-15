import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isAnalyzeMode = mode === 'analyze'

  return {
    base: './',
    plugins: [
      react(),
      isAnalyzeMode &&
        visualizer({
          filename: 'dist/bundle-report.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'es2020',
      cssTarget: 'es2020',
      modulePreload: { polyfill: false },
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        external: [
          '@capacitor/core',
          '@capacitor/haptics',
          '@capacitor/preferences',
          '@capacitor/app',
        ],
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return
            }

            // React vendor chunk (core only - largest)
            if (id.includes('/react/') || id.includes('/react-dom/')) {
              return 'vendor-react'
            }

            // Capacitor (mobile bridge) - separate for iOS/Android
            if (id.includes('/@capacitor/')) {
              return 'vendor-capacitor'
            }

            // React-vfx in separate chunk for lazy loading (WebGL effects on-demand)
            if (id.includes('/react-vfx/')) {
              return 'vendor-vfx'
            }

            // Electron packages should NOT be bundled in web build
            // They are only used in electron/main.js and electron/preload.js
            if (
              id.includes('/electron/') ||
              id.includes('/electron-store/') ||
              id.includes('/electron-log/') ||
              id.includes('/electron-updater/')
            ) {
              return null // Externalize: don't bundle these in web output
            }

            // REMOVED: catch-all 'vendor' chunk causing circular dependency issues
            // App utilities will now be bundled together with app code (AppWithProviders)
            // This fixes circular dependency warnings from context re-exports
            return undefined
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: {
        host: 'localhost',
        port: 5173,
      },
    },
  }
})
