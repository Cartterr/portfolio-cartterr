import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from './app.js'

const successMessage = 'Thanks for reaching out. Your message has been received.'

describe('portfolio API', () => {
  it('reports service health', async () => {
    const response = await request(createApp()).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ status: 'OK' })
  })

  it('rate limits each forwarded client independently before parsing request bodies', async () => {
    const app = createApp()
    const repeatedClient = '203.0.113.10'

    for (let requestNumber = 0; requestNumber < 100; requestNumber += 1) {
      const response = await request(app)
        .get('/api/health')
        .set('X-Forwarded-For', repeatedClient)
      expect(response.status).toBe(200)
    }

    const blockedBeforeParsing = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', repeatedClient)
      .set('Content-Type', 'application/json')
      .send('{')
    const independentClient = await request(app)
      .get('/api/health')
      .set('X-Forwarded-For', '203.0.113.11')

    expect(blockedBeforeParsing.status).toBe(429)
    expect(independentClient.status).toBe(200)
  })

  it('allows the production origin and rejects an unknown CORS origin safely', async () => {
    const app = createApp()
    const allowed = await request(app).get('/api/health').set('Origin', 'https://josecarter.dev')
    const denied = await request(app).get('/api/health').set('Origin', 'https://untrusted.example')

    expect(allowed.status).toBe(200)
    expect(allowed.headers['access-control-allow-origin']).toBe('https://josecarter.dev')
    expect(denied.status).toBe(403)
    expect(denied.body).toEqual({ success: false, message: 'Origin is not allowed.' })
  })

  it('normalizes a valid contact submission before sending it', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .send({
        name: '  Ada Lovelace  ',
        email: '  ada@example.com  ',
        message: '  Build reliable systems.  ',
        website: '',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true, message: successMessage })
    expect(sendContactEmail).toHaveBeenCalledOnce()
    expect(sendContactEmail).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Build reliable systems.',
    })
  })

  it.each([
    ['missing field', { name: 'Ada', email: 'ada@example.com' }],
    ['non-string field', { name: ['Ada'], email: 'ada@example.com', message: 'Hello' }],
    ['malformed email', { name: 'Ada', email: 'not-an-email', message: 'Hello' }],
    ['over-limit name', { name: 'a'.repeat(81), email: 'ada@example.com', message: 'Hello' }],
    ['over-limit email', { name: 'Ada', email: `${'a'.repeat(243)}@example.com`, message: 'Hello' }],
    ['over-limit message', { name: 'Ada', email: 'ada@example.com', message: 'a'.repeat(4001) }],
    [
      'over-limit honeypot',
      { name: 'Ada', email: 'ada@example.com', message: 'Hello', website: 'a'.repeat(201) },
    ],
    [
      'unexpected field',
      { name: 'Ada', email: 'ada@example.com', message: 'Hello', company: 'Analytical Engines' },
    ],
  ])('rejects an invalid submission: %s', async (_label, body) => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail })).post('/api/contact').send(body)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Please provide a valid name, email, and message.',
    })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns a safe 400 for malformed JSON without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send('{')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ success: false, message: 'Request body must be valid JSON.' })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns a safe 400 for a JSON primitive without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send('"primitive"')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ success: false, message: 'Request body must be valid JSON.' })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns 413 for a JSON body larger than 32kb without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .send({ name: 'Ada', email: 'ada@example.com', message: 'a'.repeat(33 * 1024) })

    expect(response.status).toBe(413)
    expect(response.body).toEqual({ success: false, message: 'Request body is too large.' })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('rejects urlencoded contact bodies without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .type('form')
      .send({ name: 'Ada', email: 'ada@example.com', message: 'Hello' })

    expect(response.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('silently accepts a filled honeypot without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .send({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello',
        website: 'https://spam.example',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true, message: successMessage })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('silently accepts a filled honeypot before validating visible fields', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .send({ website: 'https://spam.example' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true, message: successMessage })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns a generic response when delivery fails', async () => {
    const sendContactEmail = vi.fn().mockRejectedValue(new Error('delivery-provider-detail'))
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .send({ name: 'Ada', email: 'ada@example.com', message: 'Hello' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      success: false,
      message: 'Your message could not be sent. Please try again or use a direct contact link.',
    })
    expect(JSON.stringify(response.body)).not.toContain('provider-detail')
  })

  it('does not write contact data from a query string to request logs', async () => {
    const previousNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    try {
      const response = await request(createApp({ sendContactEmail: vi.fn() }))
        .post('/api/contact?email=sensitive@example.com')
        .send({ name: 'Ada', email: 'ada@example.com', message: 'Hello' })

      expect(response.status).toBe(200)
      const output = write.mock.calls.flat().map(String).join(' ')
      expect(output).not.toContain('sensitive@example.com')
    } finally {
      write.mockRestore()
      process.env.NODE_ENV = previousNodeEnv
    }
  })

  it('returns a JSON 404 for removed and unknown API routes before the production SPA fallback', async () => {
    const previousNodeEnv = process.env.NODE_ENV
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    process.env.NODE_ENV = 'production'

    try {
      const response = await request(createApp()).get('/api/portfolio-data')

      expect(response.status).toBe(404)
      expect(response.type).toBe('application/json')
      expect(response.body).toEqual({ success: false, message: 'API route not found.' })
    } finally {
      write.mockRestore()
      process.env.NODE_ENV = previousNodeEnv
    }
  })
})
