import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // PWA and Production optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging (optional)
    sourcemap: false,
    
    // Minify for production
    minify: 'esbuild',
    
    // Target modern browsers
    target: 'es2015',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router'],
          'motion-vendor': ['motion'],
        },
      },
    },
  },
  
  // Development server
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
  
  // Preview server
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
  },
  
  // Public base path
  base: '/',
  
  // Define environment variables
  define: {
    // You can add custom env vars here if needed
  },
});
