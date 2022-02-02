import { defineConfig } from 'vite';
import shimReactPdf from 'vite-plugin-shim-react-pdf';
import tsconfigPaths from 'vite-tsconfig-paths';

import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), shimReactPdf()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
