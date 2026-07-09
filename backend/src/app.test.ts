import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from './app'

const successMessage = 'Thanks for reaching out. Your message has been received.'

describe('portfolio API', () => {
  it('reports service health', async () => {
    const response = await request(createApp()).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ status: 'OK' })
  })

  it('uses one trusted proxy hop when rate limiting forwarded Railway requests', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    try {
      const response = await request(createApp())
        .get('/api/health')
        .set('X-Forwarded-For', '203.0.113.10')

      expect(response.status).toBe(200)
      expect(error).not.toHaveBeenCalled()
    } finally {
      error.mockRestore()
    }
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
})
