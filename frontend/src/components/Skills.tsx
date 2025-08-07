import React from 'react'
import { motion } from 'framer-motion'
import { Code, Layers, Database, Cloud, Brain } from 'lucide-react'

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code,
      skills: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL', 'CUDA']
    },
    {
      title: 'Frameworks & Libraries',
      icon: Layers,
      skills: ['React', 'Vue.js', 'Angular', 'Django', 'Flask', 'FastAPI', 'Node.js', 'PyTorch']
    },
    {
      title: 'Databases & Systems',
      icon: Database,
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'InfluxDB', 'DynamoDB', 'Redis', 'MQTT']
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      skills: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'Docker', 'Git', 'CI/CD', 'Linux']
    },
    {
      title: 'Specializations',
      icon: Brain,
      skills: ['Machine Learning', 'AI Integration', 'IoT Development', 'GPU Computing', 'System Integration', 'API Development']
    }
  ]

  const getRandomColor = () => {
    const colors = ['accent-blue', 'accent-green', 'accent-purple']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <section id="skills" className="py-20 sm:py-32 bg-gradient-to-b from-transparent to-primary-secondary/20">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16 gradient-text"
        >
          Technical Skills
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect p-8 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <IconComponent className="w-8 h-8 text-accent-blue" />
                  <h3 className="text-xl font-bold text-accent-blue">
                    {category.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: `rgb(var(--accent-${getRandomColor()}))`,
                        borderColor: `rgb(var(--accent-${getRandomColor()}))`
                      }}
                      className="px-4 py-2 bg-primary-secondary border border-primary-accent rounded-full text-white text-sm font-medium cursor-default transition-all duration-300 hover:shadow-lg"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Skills
