import compression from 'compression'
import cors from 'cors'
import express, { type ErrorRequestHandler, type RequestHandler } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContactHandler, type SendContactEmail } from './contact'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type CreateAppOptions = {
  sendContactEmail?: SendContactEmail
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
        callback(new Error('CORS blocked'))
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
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  const apiRouter = express.Router()
  apiRouter.use(
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

  apiRouter.get('/health', (_request, response) => {
    response.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    })
  })
  apiRouter.post('/contact', createContactHandler(options.sendContactEmail))
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

  const errorHandler: ErrorRequestHandler = (_error, _request, response, _next) => {
    response.status(500).json({
      error: 'Something went wrong.',
      message: 'Internal server error',
    })
  }
  app.use(errorHandler)

  return app
}
