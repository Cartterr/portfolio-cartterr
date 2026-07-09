import compression from 'compression'
import cors from 'cors'
import express, { type ErrorRequestHandler, type RequestHandler } from 'express'
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
}

class CorsOriginError extends Error {}

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

  const allowedOrigins = new Set(
    [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'https://josecarter.dev',
      'https://portfolio-cartterr-production.up.railway.app',
    ].filter(Boolean) as string[],
  )

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  )
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true)
          return
        }
        callback(new CorsOriginError('Origin is not allowed'))
      },
      credentials: true,
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

  if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, '../../frontend/dist')

    app.use(
      express.static(frontendDist, {
        setHeaders: (response, filePath) => {
          if (filePath.endsWith('.html')) {
            response.setHeader('Cache-Control', 'no-store')
            return
          }

          if (/[/\\]assets[/\\].+\.[0-9a-f]{8}\./i.test(filePath)) {
            response.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            return
          }

          response.setHeader('Cache-Control', 'public, max-age=3600')
        },
      }),
    )

    app.get('*', (_request, response) => {
      response.setHeader('Cache-Control', 'no-store')
      response.sendFile(path.join(frontendDist, 'index.html'))
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
