import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
registerType: 'autoUpdate',
      manifest: {
        name: "Pulse",
        short_name: "Pulse",
        start_url: "/",
        display: "standalone",
        background_color: "#ff9b9bff",
        theme_color: "#bbf1ffff",
        icons: [
          {
            src: "/pulse-icon-192-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pulse-icon-512-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/uploads": "http://localhost:3000"
    }
  }
})
