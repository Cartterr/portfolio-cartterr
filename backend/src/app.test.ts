import request from 'supertest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from './app.js'

const successMessage = 'Thanks for reaching out. Your message has been received.'

async function withNodeEnvironment<T>(
  nodeEnvironment: string,
  callback: () => Promise<T>,
): Promise<T> {
  const previousNodeEnvironment = process.env.NODE_ENV
  process.env.NODE_ENV = nodeEnvironment

  try {
    return await callback()
  } finally {
    process.env.NODE_ENV = previousNodeEnvironment
  }
}

async function withTemporaryFrontendDist<T>(
  callback: (frontendDist: string) => Promise<T>,
): Promise<T> {
  const frontendDist = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-static-test-'))

  try {
    return await callback(frontendDist)
  } finally {
    fs.rmSync(frontendDist, { recursive: true, force: true })
  }
}

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
    const malformed = await request(app).get('/api/health').set('Origin', 'not a URL')

    expect(allowed.status).toBe(200)
    expect(allowed.headers['access-control-allow-origin']).toBe('https://josecarter.dev')
    expect(denied.status).toBe(403)
    expect(denied.body).toEqual({ success: false, message: 'Origin is not allowed.' })
    expect(malformed.status).toBe(403)
    expect(malformed.body).toEqual({ success: false, message: 'Origin is not allowed.' })
  })

  it('allows a same-origin API contact request dynamically', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const origin = 'http://127.0.0.1:5000'
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .set('Host', '127.0.0.1:5000')
      .set('Origin', origin)
      .send({ name: 'Ada', email: 'ada@example.com', message: 'Hello' })

    expect(response.status).toBe(200)
    expect(response.headers['access-control-allow-origin']).toBe(origin)
    expect(sendContactEmail).toHaveBeenCalledOnce()
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

  it.each(['software', 'visual'] as const)(
    'accepts the validated %s portfolio context for contact delivery',
    async (portfolioMode) => {
      const sendContactEmail = vi.fn().mockResolvedValue(undefined)
      const response = await request(createApp({ sendContactEmail }))
        .post('/api/contact')
        .send({
          name: 'Ada',
          email: 'ada@example.com',
          message: 'Hello',
          portfolioMode,
        })

      expect(response.status).toBe(200)
      expect(sendContactEmail).toHaveBeenCalledWith({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello',
        portfolioMode,
      })
    },
  )

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
    [
      'unknown portfolio mode',
      { name: 'Ada', email: 'ada@example.com', message: 'Hello', portfolioMode: 'admin' },
    ],
    [
      'non-string portfolio mode',
      { name: 'Ada', email: 'ada@example.com', message: 'Hello', portfolioMode: ['visual'] },
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

  it('returns a safe 415 for an unsupported JSON charset without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .set('Content-Type', 'application/json; charset=iso-8859-1')
      .send(JSON.stringify({ name: 'Ada', email: 'ada@example.com', message: 'Hello' }))

    expect(response.status).toBe(415)
    expect(response.body).toEqual({
      success: false,
      message: 'Request body encoding is not supported.',
    })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns a safe 415 for an unsupported content encoding without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'compress')
      .send(JSON.stringify({ name: 'Ada', email: 'ada@example.com', message: 'Hello' }))

    expect(response.status).toBe(415)
    expect(response.body).toEqual({
      success: false,
      message: 'Request body encoding is not supported.',
    })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns a safe 400 for a malformed gzip body without sending', async () => {
    const sendContactEmail = vi.fn().mockResolvedValue(undefined)
    const response = await request(createApp({ sendContactEmail }))
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'gzip')
      .send(Buffer.from('not-a-valid-gzip-stream'))

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ success: false, message: 'Request body could not be decoded.' })
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

  it('redirects only the exact www host to the apex in production and preserves the request target', async () => {
    await withNodeEnvironment('production', async () => {
      const app = createApp()
      const canonicalized = await request(app)
        .get('/selected-work?query=1')
        .set('Host', 'www.josecarter.dev')
      const railwayHealth = await request(app)
        .get('/api/health')
        .set('Host', 'portfolio-cartterr-production.up.railway.app')
      const localHealth = await request(app).get('/api/health').set('Host', 'localhost:5000')

      expect(canonicalized.status).toBe(308)
      expect(canonicalized.headers.location).toBe('https://josecarter.dev/selected-work?query=1')
      expect(railwayHealth.status).toBe(200)
      expect(localHealth.status).toBe(200)
    })

    await withNodeEnvironment('development', async () => {
      const response = await request(createApp())
        .get('/api/health')
        .set('Host', 'www.josecarter.dev')

      expect(response.status).toBe(200)
    })
  })

  it('uses immutable caching for hashed Vite assets and revalidates HTML', async () => {
    await withTemporaryFrontendDist(async (frontendDist) => {
      const assetsDirectory = path.join(frontendDist, 'assets')
      fs.mkdirSync(assetsDirectory, { recursive: true })
      fs.writeFileSync(
        path.join(assetsDirectory, 'contract-BQKOHs0Q.js'),
        'export const contract = true',
      )
      fs.writeFileSync(
        path.join(frontendDist, 'cache-contract.html'),
        '<!doctype html><title>Cache contract</title>',
      )

      await withNodeEnvironment('production', async () => {
        const app = createApp({ frontendDist })
        const hashedAsset = await request(app).get('/assets/contract-BQKOHs0Q.js')
        const html = await request(app).get('/cache-contract.html')

        expect(hashedAsset.status).toBe(200)
        expect(hashedAsset.headers['cache-control']).toBe(
          'public, max-age=31536000, immutable',
        )
        expect(html.status).toBe(200)
        expect(html.headers['cache-control']).toBe('public, max-age=0, must-revalidate')
      })
    })
  })

  it('serves only the explicit Software and Visual documents and returns real 404s', async () => {
    await withTemporaryFrontendDist(async (frontendDist) => {
      const visualDirectory = path.join(frontendDist, 'visual')
      fs.mkdirSync(visualDirectory, { recursive: true })
      fs.writeFileSync(
        path.join(frontendDist, 'index.html'),
        '<!doctype html><title>Software route</title><main>SOFTWARE_DOCUMENT</main>',
      )
      fs.writeFileSync(
        path.join(visualDirectory, 'index.html'),
        '<!doctype html><title>Visual route</title><main>VISUAL_DOCUMENT</main>',
      )

      await withNodeEnvironment('production', async () => {
        const app = createApp({ frontendDist })
        const software = await request(app).get('/')
        const visual = await request(app).get('/visual')
        const visualWithSlash = await request(app).get('/visual/')
        const unknownDocument = await request(app).get('/unknown-project')
        const missingAsset = await request(app).get('/assets/missing-abcdef123456.js')

        expect(software.status).toBe(200)
        expect(software.text).toContain('SOFTWARE_DOCUMENT')
        expect(software.text).not.toContain('VISUAL_DOCUMENT')
        expect(software.headers['cache-control']).toBe('public, max-age=0, must-revalidate')

        for (const response of [visual, visualWithSlash]) {
          expect(response.status).toBe(200)
          expect(response.text).toContain('VISUAL_DOCUMENT')
          expect(response.text).not.toContain('SOFTWARE_DOCUMENT')
          expect(response.headers['cache-control']).toBe('public, max-age=0, must-revalidate')
        }

        expect(unknownDocument.status).toBe(404)
        expect(unknownDocument.text).toContain('Page not found')
        expect(unknownDocument.text).not.toContain('SOFTWARE_DOCUMENT')
        expect(unknownDocument.headers['cache-control']).toBe('no-store')

        expect(missingAsset.status).toBe(404)
        expect(missingAsset.text).not.toContain('SOFTWARE_DOCUMENT')
        expect(missingAsset.text).not.toContain('VISUAL_DOCUMENT')
      })
    })
  })

  it('gives the CV and social image one-day revalidation caching', async () => {
    await withTemporaryFrontendDist(async (frontendDist) => {
      fs.writeFileSync(path.join(frontendDist, 'Jose_Carter_CV_Eng.pdf'), 'test CV')
      fs.writeFileSync(path.join(frontendDist, 'og-jose-carter.png'), 'test social image')

      await withNodeEnvironment('production', async () => {
        const app = createApp({ frontendDist })
        const cv = await request(app).get('/Jose_Carter_CV_Eng.pdf')
        const socialImage = await request(app).get('/og-jose-carter.png')

        expect(cv.headers['cache-control']).toBe('public, max-age=86400, must-revalidate')
        expect(socialImage.headers['cache-control']).toBe(
          'public, max-age=86400, must-revalidate',
        )
      })
    })
  })

  it('serves production module assets even when a loopback Origin header is present', async () => {
    await withTemporaryFrontendDist(async (frontendDist) => {
      const assetsDirectory = path.join(frontendDist, 'assets')
      fs.mkdirSync(assetsDirectory, { recursive: true })
      fs.writeFileSync(
        path.join(assetsDirectory, 'app-abcdef123456.js'),
        'export const mounted = true',
      )
      fs.writeFileSync(path.join(frontendDist, 'index.html'), '<main>Portfolio</main>')

      await withNodeEnvironment('production', async () => {
        const response = await request(createApp({ frontendDist }))
          .get('/assets/app-abcdef123456.js')
          .set('Host', '127.0.0.1:4400')
          .set('Origin', 'http://127.0.0.1:4400')

        expect(response.status).toBe(200)
        expect(response.type).toMatch(/javascript/)
        expect(response.text).toContain('mounted = true')
        expect(response.headers['access-control-allow-origin']).toBeUndefined()
      })
    })
  })

  it('serves a production CSP limited to same-origin application resources', async () => {
    await withNodeEnvironment('production', async () => {
      const response = await request(createApp())
        .get('/api/health')
        .set('Host', 'portfolio-cartterr-production.up.railway.app')
      const policy = response.headers['content-security-policy']

      expect(policy).toContain("default-src 'self'")
      expect(policy).toContain("connect-src 'self'")
      expect(policy).toContain("font-src 'self'")
      expect(policy).toContain("img-src 'self' data:")
      expect(policy).toContain("style-src 'self'")
      expect(policy).toContain("style-src-attr 'unsafe-inline'")
      expect(policy).not.toContain('http:')
      expect(policy).not.toContain('https:')
      expect(policy).not.toContain('*')
    })
  })
})
