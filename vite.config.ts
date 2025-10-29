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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React core libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('wouter')) {
              return 'react-vendor';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            // Form and validation libraries
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'form-vendor';
            }
            // Tanstack Query
            if (id.includes('@tanstack')) {
              return 'query-vendor';
            }
            // Other large libraries
            if (id.includes('lucide-react') || id.includes('recharts') || id.includes('animejs')) {
              return 'icons-charts-vendor';
            }
            // Everything else goes to vendor
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
    headers: {
      'Content-Security-Policy': "script-src 'self' 'sha256-Z2/iFzh9VMlVkEOar1f/oSHWwQk3ve1qk/C2WdsC4Xk=' https://connect.facebook.net; object-src 'none';"
    }
  },
});
