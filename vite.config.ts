import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // honor the port assigned by the preview harness (autoPort)
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
  },
})
