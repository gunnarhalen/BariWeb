import { type Config } from 'vitest/config'

export default {
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
} satisfies Config
