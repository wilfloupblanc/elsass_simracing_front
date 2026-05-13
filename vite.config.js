import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://elsass-simracing.fr',
      routes: [
        '/',
        '/reservations',
        '/prices',
        '/subscriptions',
        '/privatization',
        '/tickets',
        '/contact',
        '/coaching',
        '/events',
      ]
    })
  ],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@store": "/src/store",
    }
  },
  server: {
    host: true
  }
})