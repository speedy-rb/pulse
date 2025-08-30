import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
       target: "http://localhost:3001", // where your Express app runs
        changeOrigin: true               // sets Host header to target
        // optional: rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
