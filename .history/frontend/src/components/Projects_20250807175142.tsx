import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const Projects = () => {
  const projects = [
    {
      title: 'Enterprise BMS Energy Optimization',
      description: 'Developed complete energy management platform for commercial buildings using Python microservices, Vue.js interfaces, and Docker containers with InfluxDB/DynamoDB for real-time HVAC data processing.',
      technologies: ['Python', 'Vue.js', 'Docker', 'AWS', 'InfluxDB', 'IoT'],
      link: '#'
    },
    {
      title: 'Smart Mission Planner - Autonomous Drones',
      description: 'AI-powered drone management system with Hamiltonian optimization algorithms and OpenAI integration for intelligent resource allocation in emergency response scenarios.',
      technologies: ['Python', 'OpenAI API', 'MQTT', 'Angular', 'AI', 'Algorithms'],
      link: '#'
    },
    {
      title: 'Politiktok - Big Data Analytics Platform',
      description: 'Large-scale social media behavior analysis system processing 100,000+ datasets with PyTorch and CUDA acceleration, featuring 10x performance improvements in ML pipelines.',
      technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'Big Data', 'ML'],
      link: '#'
    },
    {
      title: 'Tectonic Plate Simulation Engine',
      description: 'Advanced GPU-accelerated geological simulation system using CUDA and Python for earthquake prediction modeling with 15x performance improvements in parallel computing.',
      technologies: ['Python', 'CUDA', 'GPU Computing', 'Simulation', 'Physics'],
      link: '#'
    }
  ]

  return (
    <section id="projects" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16 gradient-text"
        >
          Featured Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-effect p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden group [transform-style:preserve-3d]"
              whileHover={{ rotateX: -3, rotateY: 3, scale: 1.02 }}
              onMouseMove={(e) => {
                const target = e.currentTarget as HTMLElement
                const rect = target.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                target.style.setProperty('--x', `${x}px`)
                target.style.setProperty('--y', `${y}px`)
              }}
              style={{ willChange: 'transform' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green"></div>

              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white group-hover:text-accent-blue transition-colors">
                {project.title}
              </h3>

              <p className="text-gray-300 leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-accent-blue text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-accent hover:bg-accent-blue text-white rounded-lg transition-colors duration-300"
              >
                <span>Learn More</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(0,212,255,0.08), transparent 40%)', willChange: 'background, opacity' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
