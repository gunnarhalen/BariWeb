import { type Config } from 'vitest/config'

export default {
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
} satisfies Config
