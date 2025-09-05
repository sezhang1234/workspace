import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
      ]
    }})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      onwarn: (warning, warn) => {
        // Ignore certain warnings to reduce memory usage
        if (warning.code === 'EVAL') return;
        warn(warning);
      }
    },
    chunkSizeWarningLimit: 1000,
  },
})
