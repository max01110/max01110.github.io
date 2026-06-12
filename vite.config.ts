import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Change to '/repo-name/' if deploying to github.io/repo-name
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      // OneDrive/cloud-synced folders often break native file watchers
      usePolling: true,
      interval: 1000,
    },
  },
})

