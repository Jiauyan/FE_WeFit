import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons';
          }
          if (id.includes('firebase')) {
            return 'firebase';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@mui/icons-material': '@mui/icons-material/esm'
    }
  },
  define: {
    'global': {},
  },
});
