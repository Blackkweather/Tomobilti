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
        }
      }
    }
    // Let Vite handle chunking automatically - it resolves dependencies correctly
    // No manual chunking needed - Vite's automatic chunking is better at dependency resolution
  },
  server: {
    port: 5000,
    host: '127.0.0.1',
    hmr: {
      port: 5000,
      host: '127.0.0.1'
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    headers: {
      'Content-Security-Policy': "script-src 'self' 'sha256-Z2/iFzh9VMlVkEOar1f/oSHWwQk3ve1qk/C2WdsC4Xk=' https://connect.facebook.net; object-src 'none';"
    }
  },
});
