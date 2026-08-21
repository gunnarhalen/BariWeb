import { config } from '@vitest/coverage-v8'

export default {
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './src/test/setup.ts',
  },
  coverage: config().coverage,
}
