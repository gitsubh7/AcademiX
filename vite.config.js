import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

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
  }
})
