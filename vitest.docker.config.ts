import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/contract/*.test.docker.ts'],
    exclude: ['test/**/*.test.ts'],
  }
});
