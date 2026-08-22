import request from 'supertest'
import next from 'next'

const app = next({ dev: false })
const handle = app.getRequestHandler()

describe('Healthcheck API', () => {
  beforeAll(async () => {
    await app.prepare()
  })

  test('GET /api/healthcheck returns 200 and { status: ok }', async () => {
    const res = await request(app).get('/api/healthcheck')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
