import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './', // Ensures paths are relative
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]', // Output all assets in the 'assets' folder
        chunkFileNames: 'assets/[name].js', // Output all chunks in the 'assets' folder
        entryFileNames: 'assets/[name].js', // Output entry points in the 'assets' folder
      }
    }
  }
})