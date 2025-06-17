import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import path from 'path' // <-- ADD THIS

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
    open: true
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- ADD THIS
    },
  },
})
