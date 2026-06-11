import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({

  build: {
    chunkSizeWarningLimit: 1500,
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules/react')) return 'react'
    //       if (id.includes('node_modules/react-dom')) return 'react'
    //       if (id.includes('@tanstack')) return 'tanstack'
    //       if (id.includes('firebase')) return 'firebase'
    //       return 'vendor'
    //     },
    //   },
    // },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
  }), react(), tailwindcss({
    optimize: true,
  }), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: "auto",

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'bikeapp',
      short_name: 'bikeapp',
      description: 'bikeapp',
      theme_color: '#ffffff',
      display: 'standalone',
      display_override: ['window-controls-overlay', 'standalone', 'browser'],
      icons: [
        {
          src: '/assets/images/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/assets/images/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ]
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },

  })],
})