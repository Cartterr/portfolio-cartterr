import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        software: path.resolve(__dirname, 'index.html'),
        visual: path.resolve(__dirname, 'visual/index.html'),
      },
    }
  },
  server: {
    port: Number(process.env.FRONTEND_PORT ?? 3000),
    host: true,
    hmr: {
      host: '127.0.0.1',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
