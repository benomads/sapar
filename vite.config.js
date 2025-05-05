import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove the base URL setting for local development
  // base: "/sapar/",
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
