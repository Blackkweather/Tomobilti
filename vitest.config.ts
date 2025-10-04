import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'scripts/',
        'migrations/',
        'client/',
        '.github/',
        'docs/'
      ]
    },
    testMatch: ['tests/**/*.test.{js,ts}', '**/*.test.{js,ts}'],
    setupFiles: ['tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './server'),
      '@shared': resolve(__dirname, './shared')
    }
  }
});