import compression from 'compression'
import cors from 'cors'
import express, { type ErrorRequestHandler, type Request, type RequestHandler } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContactHandler, type SendContactEmail } from './contact.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type CreateAppOptions = {
  sendContactEmail?: SendContactEmail
  frontendDist?: string
}

class CorsOriginError extends Error {}

function normalizeOrigin(value: string | undefined) {
  if (!value) return undefined

  try {
    return new URL(value).origin
  } catch {
    return undefined
  }
}

function hasBodyErrorType(error: unknown, expectedType: string) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === expectedType
  )
}

function hasErrorCode(error: unknown, expectedCode: string) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === expectedCode
  )
}

function getExposedClientErrorStatus(error: unknown) {
  if (typeof error !== 'object' || error === null || !('expose' in error) || error.expose !== true) {
    return undefined
  }

  const status =
    'status' in error && typeof error.status === 'number'
      ? error.status
      : 'statusCode' in error && typeof error.statusCode === 'number'
        ? error.statusCode
        : undefined

  return status && status >= 400 && status < 500 ? status : undefined
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    app.use((request, response, next) => {
      if (request.hostname.toLowerCase() === 'www.josecarter.dev') {
        response.redirect(308, `https://josecarter.dev${request.originalUrl}`)
        return
      }

      next()
    })
  }

  const allowedOrigins = new Set(
    [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'https://josecarter.dev',
      'https://portfolio-cartterr-production.up.railway.app',
    ]
      .map(normalizeOrigin)
      .filter(Boolean) as string[],
  )

  app.use(
    helmet({
      contentSecurityPolicy: isProduction
        ? {
            useDefaults: false,
            directives: {
              defaultSrc: ["'self'"],
              baseUri: ["'self'"],
              connectSrc: ["'self'"],
              fontSrc: ["'self'"],
              formAction: ["'self'"],
              frameAncestors: ["'none'"],
              frameSrc: ["'none'"],
              imgSrc: ["'self'", 'data:'],
              mediaSrc: ["'self'"],
              objectSrc: ["'none'"],
              scriptSrc: ["'self'"],
              scriptSrcAttr: ["'none'"],
              styleSrc: ["'self'"],
              styleSrcAttr: ["'unsafe-inline'"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
    }),
  )
  app.use(
    '/api',
    cors<Request>((request, callback) => {
      const rawOrigin = request.get('Origin')
      const origin = normalizeOrigin(rawOrigin)
      const host = request.get('Host')
      const requestOrigin = normalizeOrigin(host ? `${request.protocol}://${host}` : undefined)
      const isAllowedOrigin =
        origin !== undefined && (origin === requestOrigin || allowedOrigins.has(origin))

      if (!rawOrigin || isAllowedOrigin) {
        callback(null, { origin: origin ?? false, credentials: true })
        return
      }

      callback(new CorsOriginError('Origin is not allowed'))
    }),
  )
  app.use(compression() as unknown as RequestHandler)
  app.use(
    morgan(':remote-addr - :method HTTP/:http-version :status :res[content-length] - :response-time ms', {
      skip: () => process.env.NODE_ENV === 'test',
    }),
  )

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many requests. Please try again later.',
      },
    }),
  )
  app.use('/api', express.json({ limit: '32kb', strict: true }))

  const apiRouter = express.Router()
  apiRouter.get('/health', (_request, response) => {
    response.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    })
  })
  apiRouter.post('/contact', createContactHandler(options.sendContactEmail))
  apiRouter.use((_request, response) => {
    response.status(404).json({ success: false, message: 'API route not found.' })
  })
  app.use('/api', apiRouter)

  if (isProduction) {
    const frontendDist = options.frontendDist ?? path.join(__dirname, '../../frontend/dist')

    const redirectPortfolioEntry = (canonicalPath: string): RequestHandler =>
      (request, response) => {
        const query = new URL(request.originalUrl, 'http://localhost').search
        response.redirect(308, `${canonicalPath}${query}`)
      }

    app.get('/index.html', redirectPortfolioEntry('/'))
    app.get('/visual/index.html', redirectPortfolioEntry('/visual'))
    app.get('/resume', (request, response) => {
      const query = new URL(request.originalUrl, 'http://localhost').search
      response.redirect(307, `/Jose_Carter_WDAS_Resume_2026.pdf${query}`)
    })
    app.use((request, response, next) => {
      if (request.path !== '/visual/') {
        next()
        return
      }
      redirectPortfolioEntry('/visual')(request, response, next)
    })

    app.use(
      express.static(frontendDist, {
        index: false,
        redirect: false,
        setHeaders: (response, filePath) => {
          if (filePath.endsWith('.html')) {
            response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
            return
          }

          if (/[/\\]assets[/\\][^/\\]+-[a-z0-9_-]{8,}\.[^/\\]+$/i.test(filePath)) {
            response.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            return
          }

          if (
            /\.pdf$/i.test(filePath) ||
            /^og-jose-carter(?:-visual)?\.png$/i.test(path.basename(filePath))
          ) {
            response.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate')
            return
          }

          response.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate')
        },
      }),
    )

    const sendPortfolioDocument = (relativePath: string): RequestHandler =>
      (_request, response) => {
        response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
        response.sendFile(path.join(frontendDist, relativePath))
      }

    app.get('/', sendPortfolioDocument('index.html'))
    app.get('/visual', sendPortfolioDocument(path.join('visual', 'index.html')))

    app.get('*', (request, response) => {
      response.setHeader('Cache-Control', 'no-store')
      if (request.path.startsWith('/assets/') || path.extname(request.path)) {
        response.status(404).type('text/plain').send('Resource not found.')
        return
      }

      response.status(404).type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Page not found | José Carter</title>
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <p><a href="/">Software portfolio</a> · <a href="/visual">Visual portfolio</a></p>
    </main>
  </body>
</html>`)
    })
  }

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof CorsOriginError) {
      response.status(403).json({ success: false, message: 'Origin is not allowed.' })
      return
    }

    if (hasBodyErrorType(error, 'entity.too.large')) {
      response.status(413).json({ success: false, message: 'Request body is too large.' })
      return
    }

    if (
      hasBodyErrorType(error, 'charset.unsupported') ||
      hasBodyErrorType(error, 'encoding.unsupported')
    ) {
      response
        .status(415)
        .json({ success: false, message: 'Request body encoding is not supported.' })
      return
    }

    if (hasBodyErrorType(error, 'entity.parse.failed')) {
      response.status(400).json({ success: false, message: 'Request body must be valid JSON.' })
      return
    }

    const exposedStatus = getExposedClientErrorStatus(error)
    if (hasErrorCode(error, 'Z_DATA_ERROR') && exposedStatus === 400) {
      response.status(400).json({ success: false, message: 'Request body could not be decoded.' })
      return
    }

    if (exposedStatus) {
      response.status(exposedStatus).json({
        success: false,
        message:
          exposedStatus === 415
            ? 'Request body encoding is not supported.'
            : 'Request body is invalid.',
      })
      return
    }

    response.status(500).json({
      error: 'Something went wrong.',
      message: 'Internal server error',
    })
  }
  app.use(errorHandler)

  return app
}
