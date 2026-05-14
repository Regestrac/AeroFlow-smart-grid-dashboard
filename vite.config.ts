import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('recharts')) {
              return 'ui-vendor';
            }
            if (id.includes('zustand')) {
              return 'state-vendor';
            }
          }
        },
      },
    },
  },
})
