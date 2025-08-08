import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const Experience = () => {
  const experiences = [
    {
      period: 'Dec 2024 - Jul 2025',
      title: 'Software Engineer Full Stack',
      company: 'Flair - StartupChile Growth Winner',
      description: 'Developed complete microservices architecture using Python for RESTful APIs and Vue.js for enterprise BMS platform, integrating InfluxDB for time series data and DynamoDB for transactional data. Created advanced pattern recognition algorithms that reduce energy consumption by up to 50%.',
      technologies: ['Python', 'Vue.js', 'Docker', 'AWS', 'InfluxDB', 'IoT'],
      pattern: /^(flair)/i
    },
    {
      period: 'Jan 2024 - Mar 2024',
      title: 'Software Engineer',
      company: 'University of Notre Dame - Drone Response',
      description: 'Developed Smart Mission Planner (SMP) using Python with advanced Hamiltonian pathfinding algorithms and clustering systems for autonomous drone management. Integrated OpenAI APIs for intelligent decision-making and MQTT protocols for real-time coordination.',
      technologies: ['Python', 'OpenAI API', 'MQTT', 'Angular', 'AI', 'Algorithms'],
      pattern: /^(nd)/i
    },
    {
      period: 'Jul 2023 - Present',
      title: 'Data Science Researcher',
      company: 'Pontificia Universidad Católica de Chile',
      description: 'Leading Politiktok research project backed by Fondecyt funding, processing datasets of 100,000+ records using Python, PyTorch, and advanced NLP techniques. Implemented GPU-accelerated ML pipelines achieving 10x performance improvements. Visit politiktok.cl for more.',
      technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'Big Data', 'ML'],
      pattern: /(politiktok)/i,
      links: [{ href: 'https://politiktok.cl/', label: 'politiktok.cl' }]
    },
    {
      period: 'Mar 2023 - Present',
      title: 'Advanced Teaching Assistant',
      company: 'Pontificia Universidad Católica de Chile',
      description: 'Distinguished "Advanced Level Teaching Assistant" for exceptional performance in Operating Systems, Software Testing, and High Performance Computing courses. Teaching Python from fundamentals to advanced HPC techniques.',
      technologies: ['Python', 'HPC', 'Operating Systems', 'Teaching', 'Mentoring'],
      pattern: /^(ayudante)/i
    },
    {
      period: '2023 - 2024',
      title: 'Geoscience Researcher',
      company: 'Pontificia Universidad Católica de Chile — Seismology',
      description: '3D geometric analysis and seismic interaction of the Marga‑Marga fault in Viña del Mar, Chile. Built high‑fidelity models and simulated 1000‑year seismic cycles to study slip accumulation and coupling dynamics.',
      technologies: ['Python', 'Matplotlib', '3D Modeling', 'Simulation'],
      pattern: /(geoscience)/i,
      links: [{ href: 'https://meetings.seismosoc.org/wp-content/uploads/2023/03/SSA-Program-2023.pdf', label: 'SSA Program 2023 (publication)' }]
    }
  ]

  const [allImages, setAllImages] = useState<{ name: string; url: string }[]>([])
  useEffect(() => {
    const load = async () => {
      try {
        const base = (import.meta.env.VITE_API_URL as string) || '/api'
        const res = await fetch(`${base}/images`)
        const data = await res.json()
        const list: { name: string; url: string }[] = data.images || []
        setAllImages(list)
      } catch {}
    }
    load()
  }, [])

  const getShuffled = (pattern: RegExp) => {
    const matched = allImages.filter(i => pattern.test(i.name))
    for (let i = matched.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = matched[i]
      matched[i] = matched[j]
      matched[j] = tmp
    }
    return matched
  }

  const Gallery: React.FC<{ images: { name: string; url: string }[] }> = ({ images }) => {
    const [current, setCurrent] = useState(0)
    const [previous, setPrevious] = useState<number | null>(null)
    const [transitioning, setTransitioning] = useState(false)
    const [paused, setPaused] = useState(false)
    const [firstLoaded, setFirstLoaded] = useState(false)
    const [activeIdx, setActiveIdx] = useState<number | null>(null)

    useEffect(() => {
      if (images.length <= 1 || paused) return
      const SLIDE_INTERVAL_MS = 5000
      const CROSSFADE_MS = 1200
      const id = window.setInterval(() => {
        setPrevious(current)
        setCurrent((s) => (s + 1) % images.length)
        setTransitioning(true)
        window.setTimeout(() => setTransitioning(false), CROSSFADE_MS)
      }, SLIDE_INTERVAL_MS)
      return () => clearInterval(id)
    }, [images.length, paused, current])

    useEffect(() => {
      images.forEach(({ url }) => {
        const img = new Image()
        img.decoding = 'async'
        img.loading = 'eager'
        img.src = url
      })
    }, [images])

    return (
      <div
        className="relative w-full aspect-[5/4] bg-primary-secondary rounded-3xl flex items-center justify-center overflow-hidden glass-effect"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute inset-0">
          <div className="h-full w-full">
            <div className="h-full w-full">
              {images.length === 0 && (
                <div className="absolute inset-0 grid place-items-center skeleton">
                  <div className="spinner"></div>
                </div>
              )}
              {images.length > 0 && (
                <div className="h-full w-full relative">
                  {images.map((img, idx) => {
                    const isActive = idx === current
                    const isPrev = idx === (previous ?? (current - 1 + images.length) % images.length)
                    return (
                      <img
                        key={img.name}
                        src={img.url}
                        alt={img.name}
                        className={`absolute top-0 left-0 h-full w-full object-cover ${isActive ? 'kenburns' : isPrev ? 'kenburns-out' : ''}`}
                        style={{
                          opacity: isActive ? 1 : (transitioning && isPrev ? 1 : 0),
                          transform: isActive ? 'translateZ(0)' : (transitioning && isPrev ? 'translate3d(-8px,0,0) scale(1.06)' : 'translateZ(0)'),
                          transition: transitioning
                            ? (isActive
                                ? 'opacity 1200ms cubic-bezier(0.22,0.61,0.36,1)'
                                : (isPrev ? 'opacity 1200ms cubic-bezier(0.22,0.61,0.36,1), transform 1200ms cubic-bezier(0.22,0.61,0.36,1)' : 'none'))
                            : 'none',
                          zIndex: isActive ? 2 : (transitioning && isPrev ? 1 : 0),
                          willChange: 'opacity, transform'
                        }}
                        onClick={() => setActiveIdx(current)}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.opacity = '0'
                        }}
                        onLoad={() => {
                          if (isActive && !firstLoaded) setFirstLoaded(true)
                        }}
                      />
                    )
                  })}
                  {!firstLoaded && (
                    <div className="absolute inset-0 grid place-items-center skeleton">
                      <div className="spinner"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {images.length > 0 && (
          <button onClick={() => setActiveIdx(current)} className="absolute inset-0" aria-label="Open gallery" />
        )}

        {activeIdx !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80" onClick={() => setActiveIdx(null)}>
            <div className="relative max-w-5xl w-[92vw]" onClick={(e) => e.stopPropagation()}>
              <button aria-label="Close" className="absolute -top-10 right-0 text-white/80 hover:text-white" onClick={() => setActiveIdx(null)}>
                <X className="w-8 h-8" />
              </button>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/40 grid place-items-center">
                <img src={images[activeIdx].url} alt={images[activeIdx].name} className="w-full h-full object-contain" loading="eager" decoding="async" />
              </div>
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {images.map((img, idx) => (
                    <button key={img.name} onClick={() => setActiveIdx(idx)} className={`relative rounded-lg overflow-hidden border ${idx === activeIdx ? 'border-accent-blue' : 'border-white/10'}`}>
                      <img src={img.url} alt={img.name} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

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
          {experiences.map((exp, index) => {
            const imgs = useMemo(() => exp.pattern ? getShuffled(exp.pattern) : [], [allImages])
            return (
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
                    {exp.links && exp.links.map((l: any) => (
                      <>
                        {' '}
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`${l.href.includes('seismosoc') ? 'text-accent-purple' : 'text-accent-blue'} underline font-semibold`}>
                          {l.label}
                        </a>
                      </>
                    ))}
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
                {imgs.length > 0 ? (
                  <Gallery images={imgs} />
                ) : (
                  <div className="w-4 h-4 bg-accent-blue rounded-full shadow-lg shadow-accent-blue/50"></div>
                )}
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  )
}

export default Experience
