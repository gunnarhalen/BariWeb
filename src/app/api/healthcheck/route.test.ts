import { describe, it, expect } from 'vitest'
import { GET } from '../route'

describe('healthcheck endpoint', () => {
  it('returns status ok', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'ok' })
  })
})
