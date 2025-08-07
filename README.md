# 🚀 José Carter Arriagada - Portfolio

A modern, full-stack portfolio website showcasing my work as a Software Engineer, Full-Stack Developer, and AI & Data Science Researcher.

## 🌟 Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite frontend, Node.js + Express backend
- **Responsive Design**: Mobile-first design with smooth animations using Framer Motion
- **Performance Optimized**: Fast loading with code splitting and optimized builds
- **Docker Support**: Complete containerization for easy deployment
- **SEO Ready**: Optimized for search engines and social sharing
- **Contact Form**: Functional contact form with validation
- **Glass Morphism UI**: Modern glassmorphism design with gradient effects

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend development
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer
- **GitHub Actions** - CI/CD (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn or npm
- Docker (optional, for containerized deployment)

### 1. Clone and Setup
```bash
git clone https://github.com/Cartterr/portfolio.git
cd portfolio
npm run setup
```

### 2. Development
```bash
# Start both frontend and backend in development mode
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
```

### 3. Production Build
```bash
# Build both applications
npm run build

# Start production servers
npm run start
```

### 4. Docker Deployment
```bash
# Development with Docker
npm run docker:dev

# Production with Docker
npm run docker:prod

# Stop containers
npm run docker:stop
```

## 📁 Project Structure

```
portfolio/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── Dockerfile          # Production Docker image
│   ├── Dockerfile.dev      # Development Docker image
│   └── package.json        # Frontend dependencies
│
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   └── server.ts       # Express server
│   ├── Dockerfile          # Production Docker image
│   ├── Dockerfile.dev      # Development Docker image
│   └── package.json        # Backend dependencies
│
├── scripts/                  # Automation scripts
│   ├── setup.js            # Project setup
│   └── deploy.js           # Deployment script
│
├── docker-compose.yml        # Production containers
├── docker-compose.dev.yml   # Development containers
├── nginx.conf               # Nginx configuration
└── package.json             # Root package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CONTACT_FORM=true
```

## 📱 API Endpoints

### Health Check
```
GET /api/health
```

### Portfolio Data
```
GET /api/portfolio-data
```

### Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello José!"
}
```

## 🐳 Docker Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Check status
docker-compose ps
```

## 🚀 Deployment

### Local Production
```bash
npm run build
npm run start
```

### Docker Production
```bash
npm run deploy
```

### Custom Domain Setup
1. Update `nginx.conf` with your domain
2. Add SSL certificates to `./ssl/` directory
3. Update environment variables for production
4. Deploy to your server

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Form validation
- **CSP** - Content Security Policy

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: < 2s first contentful paint
- **SEO**: Fully optimized for search engines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About José Carter

Software Engineer specialized in full-stack development and intelligent system design, with a B.S. in Computer Engineering from Pontificia Universidad Católica de Chile. Experienced in Python, JavaScript, AI, and cloud deployments.

### 🔗 Connect with me:
- **Email**: [jose.carterx@gmail.com](mailto:jose.carterx@gmail.com)
- **LinkedIn**: [jose-carter-arriagada](https://linkedin.com/in/jose-carter-arriagada)
- **GitHub**: [Cartterr](https://github.com/Cartterr)

---

**Built with ❤️ using modern web technologies**
