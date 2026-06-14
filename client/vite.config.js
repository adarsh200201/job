import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json,webp}'],
        navigateFallbackDenylist: [
          /^\/ads\.txt$/,
          /^\/robots\.txt$/,
          /^\/sitemap\.xml$/
        ]
      },
      manifest: {
        name: 'NextJobPost',
        short_name: 'NextJobPost',
        description: 'Government & Private Job Portal',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      }
    }),
    visualizer({
      filename: 'bundle-stats.html',
      title: 'NextJobPost Bundle Analysis',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true
    })
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler') || id.includes('router') || id.includes('helmet')) {
              return 'vendor-react';
            }
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap';
            }
            if (id.includes('mixpanel-browser')) {
              return 'vendor-mixpanel';
            }
          }
        }
      }
    }
  }
});
