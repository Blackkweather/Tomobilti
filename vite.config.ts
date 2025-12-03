import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet', 'react', 'react-dom'],
    exclude: [],
    force: true
  },
  ssr: {
    noExternal: ['react-leaflet'],
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: false,
    cssMinify: 'esbuild',
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          ui: ["lucide-react"],
          data: ["@tanstack/react-query"],
          leaflet: ["leaflet", "react-leaflet"],
        }
      }
    },
    commonjsOptions: {
      include: [/leaflet/, /react-leaflet/, /node_modules/],
      transformMixedEsModules: true,
    }
  },
  server: {
    port: 5000,
    host: '127.0.0.1',
    hmr: {
      port: 5001,
      host: '127.0.0.1'
    },
    fs: {
      strict: false,
    },
  },
});
