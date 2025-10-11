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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep React and React-DOM together to avoid import issues
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
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
  },
});
