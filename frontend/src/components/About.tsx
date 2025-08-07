import React from 'react'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

const About = () => {
  const stats = [
    { number: '5+', label: 'Years Experience' },
    { number: '20+', label: 'Projects Completed' },
    { number: '50%', label: 'Energy Savings Achieved' },
    { number: '100K+', label: 'Data Points Processed' }
  ]

  return (
    <section id="about" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16 gradient-text"
        >
          About Me
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-8 -left-8 -right-8 -bottom-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-3xl opacity-20 blur-xl"></div>
            <div className="relative w-full h-96 bg-primary-secondary rounded-3xl flex items-center justify-center glass-effect">
              <User className="w-24 h-24 text-gray-400" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-accent-blue">
              Transforming Ideas into Digital Reality
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Software Engineer specialized in full-stack development and intelligent system design, with a B.S. in Computer Engineering from Pontificia Universidad Católica de Chile. I focus on Software Engineering and Data Science, with hands-on experience developing scalable microservices with Python, JavaScript, and cloud deployments.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              I've led and contributed to enterprise-level platforms in HVAC energy optimization, drone swarm automation, and digital political research, applying design patterns, functional programming, and cutting-edge AI technologies.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 glass-effect rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl sm:text-4xl font-bold text-accent-green mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
