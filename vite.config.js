import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  optimizeDeps: {
    include: ['path'], // Include the path module explicitly
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './', // Ensures paths are relative
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]', //worked for css file
        // assetFileNames: ({ name, ext }) => {
        //   // Handle .png files
        //   if (ext === '.png') {
        //     return `assets/${name}__[dirname]${ext}`;
        //   }
        //   // For other assets, keep default naming
        //   return `assets/${name}${ext}`;
        // },
        chunkFileNames: 'assets/[name].js', // Output all chunks in the 'assets' folder
        entryFileNames: 'assets/[name].js', // Output entry points in the 'assets' folder
      },
    },
  },
});
