import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/icons-material']
  },
  build: {
    rollupOptions: {
      external: ['@mui/icons-material']
    }
  },
  resolve: {
    alias: {
      '@mui/icons-material': '@mui/icons-material/esm'
    }
  }
});