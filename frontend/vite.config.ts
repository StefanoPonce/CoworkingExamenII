import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/spaces': 'http://localhost:3000',
      '/reservations': 'http://localhost:3000',
      '/reviews': 'http://localhost:3000',
      '/favorites': 'http://localhost:3000',
      '/amenities': 'http://localhost:3000',
      '/notifications': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
    },
  },
})
