import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit, { type Options as RateLimitOptions } from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const app = express()
const PORT = process.env.PORT || 5000
app.disable('x-powered-by')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
} as RateLimitOptions)

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}) as any)

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://josecarter.dev',
    'https://portfolio-cartterr-production.up.railway.app',
  ].filter(Boolean) as string[],
)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('CORS blocked'))
  },
  credentials: true
}) as any)

app.use(compression() as any)
app.use(morgan('combined') as any)
app.use(express.json({ limit: '10mb' }) as any)
app.use(express.urlencoded({ extended: true, limit: '10mb' }) as any)
const apiRouter = express.Router()
apiRouter.use(limiter as any)
app.use('/api', apiRouter)

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

apiRouter.get('/portfolio-data', (_req, res) => {
  res.json({
    name: 'José Carter Arriagada',
    title: 'AI Systems Engineer | Full-Stack Developer | Simulation and Research Software',
    email: 'jose.carterx@gmail.com',
    universityEmail: 'jrcarter@uc.cl',
    linkedin: 'https://linkedin.com/in/jose-carter-arriagada',
    github: 'https://github.com/Cartterr',
    location: 'Santiago, Chile',
    education: {
      degree: 'B.S. in Computer Engineering',
      university: 'Pontificia Universidad Católica de Chile',
      focus: 'Software Engineering, Data Science, and applied systems work'
    },
    experiences: [
      {
        id: 1,
        title: 'Full Stack Developer',
        company: 'Dily',
        location: 'Santiago, Chile',
        period: 'Sep 2025 - Present',
        description: 'Developing lending and fintech platforms end to end with DDD and hexagonal architecture, TypeScript and Node.js services, and Angular-based frontend work in a production monorepo.',
        technologies: ['TypeScript', 'Node.js', 'Express', 'Angular', 'Nx', 'MySQL', 'PostgreSQL', 'AWS'],
        achievements: [
          'Applied DDD and hexagonal patterns to keep domain logic clean',
          'Built testable backend services and product-facing frontend flows',
          'Worked across monorepo architecture and cloud integrations'
        ]
      },
      {
        id: 2,
        title: 'Lead Engineer, Alerting Platform Migration',
        company: 'GridWorks',
        location: 'Remote',
        period: '2026 - Present',
        description: 'Leading the end-to-end rebuild of an industrial alerting platform, replacing legacy automation flows with a modular service architecture, safer rollout controls, and production-grade operator tooling.',
        technologies: ['Next.js', 'Node.js', 'Railway', 'MQTT', 'WhatsApp', 'PostgreSQL'],
        achievements: [
          'Preserved parity while migrating live production workflows',
          'Implemented alert lifecycle, escalation, and ingestion logic',
          'Built safer rollout and observability paths for operators'
        ]
      },
      {
        id: 3,
        title: 'Software Engineer',
        company: 'Flair - StartupChile Growth Winner',
        location: 'Santiago, Chile',
        period: 'Dec 2024 - Jul 2025',
        description: 'Built backend services and enterprise UI for an energy-optimization platform with time-series data, cloud deployments, and production workflows tied to measurable HVAC efficiency gains.',
        technologies: ['Python', 'Vue.js', 'Docker', 'AWS', 'InfluxDB', 'DynamoDB', 'IoT'],
        achievements: [
          'Reduced energy consumption by up to 50%',
          'Built production-facing microservices and UI flows',
          'Integrated time-series and transactional data systems'
        ]
      },
      {
        id: 4,
        title: 'AI Systems Developer',
        company: 'University of Notre Dame - Drone Response',
        location: 'Notre Dame, Indiana, USA',
        period: 'Jan 2024 - Mar 2024',
        description: 'Developed Smart Mission Planner logic for autonomous drone coordination using optimization algorithms, MQTT messaging, and OpenAI-assisted decision support in an emergency-response context.',
        technologies: ['Python', 'OpenAI API', 'MQTT', 'Angular', 'Java Spring', 'Algorithms'],
        achievements: [
          'Created route-planning and resource-allocation logic',
          'Integrated AI-assisted decision support with real-time messaging',
          'Worked in an international NASA and NSF backed environment'
        ]
      },
      {
        id: 5,
        title: 'Data Science Researcher',
        company: 'Pontificia Universidad Católica de Chile',
        location: 'Santiago, Chile',
        period: 'Jul 2023 - Present',
        description: 'Leading Politiktok research infrastructure backed by Fondecyt funding, processing 100,000+ records with Python, PyTorch, CUDA, and large-scale data workflows for political-media analysis.',
        technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'PostgreSQL', 'ML'],
        achievements: [
          'Processed 100,000+ data records',
          'Achieved 10x performance improvements',
          'Led Fondecyt-funded research project'
        ]
      }
    ],
    projects: [
      {
        id: 1,
        title: 'GridWorks Alerting Platform Migration',
        description: 'Industrial alerting platform migration covering ingestion, alert rules, escalation chains, operator tooling, and WhatsApp workflows under real production constraints.',
        technologies: ['Next.js', 'Node.js', 'Railway', 'MQTT', 'WhatsApp', 'PostgreSQL'],
        status: 'active',
        impact: 'Production-safe migration and systems modernization'
      },
      {
        id: 2,
        title: 'Politiktok Research Infrastructure',
        description: 'Large-scale political-media analysis platform with GPU-backed NLP pipelines, PostgreSQL-backed data workflows, and research-grade processing at 100,000+ record scale.',
        technologies: ['Python', 'PyTorch', 'CUDA', 'PostgreSQL', 'NLP', 'Data Engineering'],
        status: 'active',
        impact: '10x performance improvement in research pipelines'
      },
      {
        id: 3,
        title: 'Autonomous Planning and Scientific Simulation',
        description: 'A thread of work spanning autonomous drone mission planning and GPU-accelerated geoscience simulation, pointing toward the kind of AI plus aerospace and scientific-computing problems I want to pursue further.',
        technologies: ['Python', 'CUDA', 'Optimization', 'MQTT', 'OpenAI API', 'Simulation'],
        status: 'direction',
        impact: 'Mission planning and 15x simulation speedups'
      }
    ],
    skills: {
      programming: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'CUDA', 'Java'],
      frameworks: ['React', 'Angular', 'Node.js', 'Express', 'PyTorch', 'Next.js', 'Vue.js'],
      databases: ['PostgreSQL', 'MySQL', 'InfluxDB', 'DynamoDB', 'MongoDB', 'Redis', 'MQTT'],
      cloud: ['Railway', 'AWS EC2', 'AWS S3', 'AWS Lambda', 'Docker', 'CI/CD', 'Linux'],
      specializations: ['AI Systems', 'Simulation', 'NLP', 'IoT Development', 'Distributed Systems', 'API Development']
    },
    stats: {
      yearsExperience: 3,
      projectsCompleted: 8,
      energySavings: 50,
      dataPointsProcessed: 100000
    }
  })
})

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

apiRouter.post('/contact', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    })
  }

  console.log('📧 Contact form submission:', {
    name,
    email,
    message: message.substring(0, 100) + '...',
    timestamp: new Date().toISOString()
  })

  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  if (!smtpUser || !smtpPass) {
    return res.status(500).json({ success: false, message: 'Email not configured' })
  }

  const nodemailer = await import('nodemailer')
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass }
    })

    await transporter.sendMail({
      from: `Portfolio Contact <${smtpUser}>`,
      to: 'jose.carterx@gmail.com',
      subject: `New message from ${name}`,
      replyTo: `${name} <${email}>`,
      text: `From: ${name} <${email}>
\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`
    })

    return res.json({ success: true, message: 'Thank you for your message! I will get back to you soon.' })
  } catch (err) {
    console.error('Email send error', err)
    return res.status(500).json({ success: false, message: 'Failed to send email' })
  }
})

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../../frontend/dist')

  app.use(express.static(frontendDist, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store')
        return
      }

      if (/[/\\]assets[/\\].+\.[0-9a-f]{8}\./i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        return
      }

      res.setHeader('Cache-Control', 'public, max-age=3600')
    }
  }))

  app.get('*', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  void req
  void next
  console.error('❌ Error:', err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
})
