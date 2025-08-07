import React from 'react'
import { motion } from 'framer-motion'

const Experience = () => {
  const experiences = [
    {
      period: 'Dec 2024 - Jul 2025',
      title: 'Software Engineer Full Stack',
      company: 'Flair - StartupChile Growth Winner',
      description: 'Developed complete microservices architecture using Python for RESTful APIs and Vue.js for enterprise BMS platform, integrating InfluxDB for time series data and DynamoDB for transactional data. Created advanced pattern recognition algorithms that reduce energy consumption by up to 50%.',
      technologies: ['Python', 'Vue.js', 'Docker', 'AWS', 'InfluxDB', 'IoT']
    },
    {
      period: 'Jan 2024 - Mar 2024',
      title: 'Software Engineer',
      company: 'University of Notre Dame - Drone Response',
      description: 'Developed Smart Mission Planner (SMP) using Python with advanced Hamiltonian pathfinding algorithms and clustering systems for autonomous drone management. Integrated OpenAI APIs for intelligent decision-making and MQTT protocols for real-time coordination.',
      technologies: ['Python', 'OpenAI API', 'MQTT', 'Angular', 'AI', 'Algorithms']
    },
    {
      period: 'Jul 2023 - Present',
      title: 'Data Science Researcher',
      company: 'Pontificia Universidad Católica de Chile',
      description: 'Leading Politiktok research project backed by Fondecyt funding, processing datasets of 100,000+ records using Python, PyTorch, and advanced NLP techniques. Implemented GPU-accelerated ML pipelines achieving 10x performance improvements.',
      technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'Big Data', 'ML']
    },
    {
      period: 'Mar 2023 - Present',
      title: 'Advanced Teaching Assistant',
      company: 'Pontificia Universidad Católica de Chile',
      description: 'Distinguished "Advanced Level Teaching Assistant" for exceptional performance in Operating Systems, Software Testing, and High Performance Computing courses. Teaching Python from fundamentals to advanced HPC techniques.',
      technologies: ['Python', 'HPC', 'Operating Systems', 'Teaching', 'Mentoring']
    }
  ]

  return (
    <section id="experience" className="py-20 sm:py-32 bg-gradient-to-b from-transparent to-primary-secondary/20">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16 gradient-text"
        >
          Experience
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row mb-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:w-1/2 lg:px-8">
                <div className="glass-effect p-8 rounded-2xl relative hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green rounded-t-2xl"></div>
                  
                  <div className="text-accent-blue font-semibold mb-2 text-sm">
                    {exp.period}
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                    {exp.title}
                  </h3>
                  
                  <div className="text-accent-green font-semibold mb-4">
                    {exp.company}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-accent-blue text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex items-center justify-center py-8">
                <div className="w-4 h-4 bg-accent-blue rounded-full shadow-lg shadow-accent-blue/50"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
