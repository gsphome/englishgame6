import { defineConfig } from 'vitest/config';

import { resolve } from 'path';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: { 
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, '../tests/setup.ts')],
    // CSS testing support
    css: {
      modules: {
        classNameStrategy: 'stable'
      }
    },
    // Environment configuration for CSS testing
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        runScripts: 'dangerously'
      }
    },
    // Test patterns
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/unit/styles/**/*.{test,spec}.{js,ts}',
      'tests/integration/css/**/*.{test,spec}.{js,ts}',
      'tests/integration/performance/**/*.{test,spec}.{js,ts}'
    ]
  }
});