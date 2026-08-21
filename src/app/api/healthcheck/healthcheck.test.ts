import { expect, test } from 'vitest'
import { GET } from './route'

test('should return healthcheck status', async () => {
  const request = new Request('http://localhost/api/healthcheck')

  const response = await GET(request)

  expect(response.ok).toBe(true)

  const data = await response.json()
  expect(data.status).toBe('ok')
  expect(data.timestamp).toBeDefined()
  expect(data.service).toBe('bari-web')
})

test('should return JSON response', async () => {
  const request = new Request('http://localhost/api/healthcheck')

  const response = await GET(request)
  const contentType = response.headers.get('content-type')

  expect(contentType).toBe('application/json; charset=utf-8')
})
