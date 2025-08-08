import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit, { type Options as RateLimitOptions } from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const app = express()
const PORT = process.env.PORT || 5000

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
} as RateLimitOptions)

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
const apiRouter = express.Router()
apiRouter.use((req, res, next) => limiter(req, res, next))
app.use('/api', apiRouter)

app.use('/images', express.static(path.join(__dirname, '../public/images'), {
  maxAge: '30d',
  etag: true,
  setHeaders: (res, _filePath) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable')
  }
}))

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

app.get('/api/images', async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '../public/images')
    const entries = await fs.readdir(imagesDir)
    const allowed = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp'])
    const q = (req.query.q as string | undefined)?.toLowerCase()
    const files = entries
      .filter(name => allowed.has(path.extname(name).toLowerCase()))
      .filter(name => q ? name.toLowerCase().includes(q) : true)
    const sorted = files.sort((a, b) => {
      if (a.toLowerCase() === 'profile1.jpg') return -1
      if (b.toLowerCase() === 'profile1.jpg') return 1
      return 0
    })
    const images = sorted.map(name => ({ name, url: `/images/${name}` }))
    res.json({ images })
  } catch (err) {
    res.status(500).json({ error: 'Failed to list images' })
  }
})

app.get('/api/portfolio-data', (_req, res) => {
  res.json({
    name: 'José Carter Arriagada',
    title: 'Software Engineer | Full-Stack Developer | AI & Data Science Researcher',
    email: 'jose.carterx@gmail.com',
    universityEmail: 'jrcarter@uc.cl',
    linkedin: 'https://linkedin.com/in/jose-carter-arriagada',
    github: 'https://github.com/Cartterr',
    location: 'Santiago, Chile',
    education: {
      degree: 'B.S. in Computer Engineering',
      university: 'Pontificia Universidad Católica de Chile',
      focus: 'Software Engineering and Data Science'
    },
    experiences: [
      {
        id: 1,
        title: 'Software Engineer Full Stack',
        company: 'Flair - StartupChile Growth Winner',
        location: 'Santiago, Chile',
        period: 'Dec 2024 - Jul 2025',
        description: 'Developed complete microservices architecture using Python for RESTful APIs and Vue.js for enterprise BMS platform, integrating InfluxDB for time series data and DynamoDB for transactional data. Created advanced pattern recognition algorithms that reduce energy consumption by up to 50%.',
        technologies: ['Python', 'Vue.js', 'Docker', 'AWS', 'InfluxDB', 'DynamoDB', 'IoT'],
        achievements: [
          'Reduced energy consumption by up to 50%',
          'Built complete microservices architecture',
          'Integrated multiple database systems'
        ]
      },
      {
        id: 2,
        title: 'Software Engineer',
        company: 'University of Notre Dame - Drone Response',
        location: 'Notre Dame, Indiana, USA',
        period: 'Jan 2024 - Mar 2024',
        description: 'Developed Smart Mission Planner (SMP) using Python with advanced Hamiltonian pathfinding algorithms and clustering systems for autonomous drone management. Integrated OpenAI APIs for intelligent decision-making and MQTT protocols for real-time coordination.',
        technologies: ['Python', 'OpenAI API', 'MQTT', 'Angular', 'AI', 'Algorithms'],
        achievements: [
          'Created advanced pathfinding algorithms',
          'Integrated AI for intelligent decision-making',
          'Implemented real-time coordination systems'
        ]
      },
      {
        id: 3,
        title: 'Data Science Researcher',
        company: 'Pontificia Universidad Católica de Chile',
        location: 'Santiago, Chile',
        period: 'Jul 2023 - Present',
        description: 'Leading Politiktok research project backed by Fondecyt funding, processing datasets of 100,000+ records using Python, PyTorch, and advanced NLP techniques. Implemented GPU-accelerated ML pipelines achieving 10x performance improvements.',
        technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'Big Data', 'ML'],
        achievements: [
          'Processed 100,000+ data records',
          'Achieved 10x performance improvements',
          'Led Fondecyt-funded research project'
        ]
      },
      {
        id: 4,
        title: 'Advanced Teaching Assistant',
        company: 'Pontificia Universidad Católica de Chile',
        location: 'Santiago, Chile',
        period: 'Mar 2023 - Present',
        description: 'Distinguished "Advanced Level Teaching Assistant" for exceptional performance in Operating Systems, Software Testing, and High Performance Computing courses. Teaching Python from fundamentals to advanced HPC techniques.',
        technologies: ['Python', 'HPC', 'Operating Systems', 'Teaching', 'Mentoring'],
        achievements: [
          'Distinguished Advanced Level status',
          'Taught multiple technical courses',
          'Mentored students in HPC techniques'
        ]
      }
    ],
    projects: [
      {
        id: 1,
        title: 'Enterprise BMS Energy Optimization',
        description: 'Developed complete energy management platform for commercial buildings using Python microservices, Vue.js interfaces, and Docker containers with InfluxDB/DynamoDB for real-time HVAC data processing.',
        technologies: ['Python', 'Vue.js', 'Docker', 'AWS', 'InfluxDB', 'IoT'],
        status: 'completed',
        impact: '50% energy savings achieved'
      },
      {
        id: 2,
        title: 'Smart Mission Planner - Autonomous Drones',
        description: 'AI-powered drone management system with Hamiltonian optimization algorithms and OpenAI integration for intelligent resource allocation in emergency response scenarios.',
        technologies: ['Python', 'OpenAI API', 'MQTT', 'Angular', 'AI', 'Algorithms'],
        status: 'completed',
        impact: 'Emergency response optimization'
      },
      {
        id: 3,
        title: 'Politiktok - Big Data Analytics Platform',
        description: 'Large-scale social media behavior analysis system processing 100,000+ datasets with PyTorch and CUDA acceleration, featuring 10x performance improvements in ML pipelines.',
        technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'Big Data', 'ML'],
        status: 'ongoing',
        impact: '10x performance improvement'
      },
      {
        id: 4,
        title: 'Tectonic Plate Simulation Engine',
        description: 'Advanced GPU-accelerated geological simulation system using CUDA and Python for earthquake prediction modeling with 15x performance improvements in parallel computing.',
        technologies: ['Python', 'CUDA', 'GPU Computing', 'Simulation', 'Physics'],
        status: 'completed',
        impact: '15x performance improvement'
      }
    ],
    skills: {
      programming: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL', 'CUDA'],
      frameworks: ['React', 'Vue.js', 'Angular', 'Django', 'Flask', 'FastAPI', 'Node.js', 'PyTorch'],
      databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'InfluxDB', 'DynamoDB', 'Redis', 'MQTT'],
      cloud: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'Docker', 'Git', 'CI/CD', 'Linux'],
      specializations: ['Machine Learning', 'AI Integration', 'IoT Development', 'GPU Computing', 'System Integration', 'API Development']
    },
    stats: {
      yearsExperience: 5,
      projectsCompleted: 20,
      energySavings: 50,
      dataPointsProcessed: 100000
    }
  })
})

app.post('/api/contact', async (req, res) => {
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
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br/>')}</p>`
    })

    return res.json({ success: true, message: 'Thank you for your message! I will get back to you soon.' })
  } catch (err) {
    console.error('Email send error', err)
    return res.status(500).json({ success: false, message: 'Failed to send email' })
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')))

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
  })
}

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
