/* global process */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The sub path the built site is served under. The dev server runs at the
// root, so the default keeps local work unchanged. A host that serves the site
// from a folder, such as a GitHub Pages project page, sets VITE_BASE to that
// folder so asset, photo and route URLs resolve. It ends with a slash.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
