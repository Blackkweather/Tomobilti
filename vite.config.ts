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
    chunkSizeWarningLimit: 500, // Reduced from 1000 to be more strict
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // UI Libraries
          if (id.includes('@radix-ui') || id.includes('@headlessui')) {
            return 'ui-libs';
          }
          
          // Routing and state management
          if (id.includes('wouter') || id.includes('zustand') || id.includes('tanstack')) {
            return 'routing-state';
          }
          
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('zod')) {
            return 'forms';
          }
          
          // Icons and utilities
          if (id.includes('lucide-react') || id.includes('clsx') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          
          // Charts and visualization
          if (id.includes('recharts') || id.includes('chart')) {
            return 'charts';
          }
          
          // Payment and external services
          if (id.includes('stripe') || id.includes('socket.io')) {
            return 'external-services';
          }
          
          // Large component libraries
          if (id.includes('date-fns') || id.includes('moment')) {
            return 'date-utils';
          }
          
          // If it's a node module, put it in vendor
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
