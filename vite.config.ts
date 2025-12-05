import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import prerender from 'vite-plugin-prerender';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
    }),
    vue(),
    // prerender({
    //   staticDir: './dist',
    //   routes: ['/', '/ifoi', '/room/access', '/we', '/chat'],
    // }),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    // Define 'global' como 'window' para o ambiente do navegador
    'global': 'window',
  },
  optimizeDeps: {
    include: ['simple-peer'], // Pré-otimiza o simple-peer
  },
  build: {
    commonjsOptions: {
      include: [/simple-peer/, /node_modules/], // Suporte a CommonJS
    },
  },

  server: {
    proxy: {
      '/api': 'http://localhost:8000/api/v1',
    },
  },
});