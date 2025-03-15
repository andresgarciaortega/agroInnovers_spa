import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './',  // Asegúrate de que la raíz sea correcta
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['react-icons']
        }
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  }
});