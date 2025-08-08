import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getImages } from '../imageManifest'

const Experience = () => {
  const experiences = [
    {
      period: 'Dec 2024 - Jul 2025',
      title: 'Software Engineer (Full Stack)',
      company: 'Flair - StartupChile Growth Winner',
      description: 'Contributed to the development of a microservices-based energy management platform using Python for RESTful services and Vue.js for the enterprise interface; integrated InfluxDB for time-series data and DynamoDB for transactional data; implemented pattern recognition that reduced energy consumption.',
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
      description: 'Leading Politiktok research project backed by Fondecyt funding, processing datasets of 100,000+ records using Python, PyTorch, and advanced NLP techniques. Implemented GPU-accelerated ML pipelines achieving 10x performance improvements.',
      technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'Big Data', 'ML'],
      pattern: /(politiktok)/i,
      links: [{ href: 'https://politiktok.cl/', label: 'politiktok.cl' }]
    },
    {
      period: 'Mar 2023 - 2025',
      title: 'Advanced Teaching Assistant',
      company: 'Pontificia Universidad Católica de Chile',
      description: (
        <>
          Recognized as an "Advanced Level Teaching Assistant". I taught in the Escuela de Ingeniería and also served as <strong>Ayudante</strong> at Escuela Militar. Courses included Sistemas Operativos y Redes (IIC2333), Testing de Software (IIC3745), Computación de Alto Rendimiento (IIC3533), and IIC1005 Computación: Ciencia y Tecnología del Mundo Digital; I also supported introductory programming courses.
        </>
      ),
      technologies: ['Python', 'HPC', 'Operating Systems', 'Teaching', 'Mentoring'],
      pattern: /^(ayudante)/i
    },
    {
      period: '2023 - 2024',
      title: 'Geoscience Researcher',
      company: 'Pontificia Universidad Católica de Chile — Seismology',
      description: 'Built GPU-accelerated geological simulation pipeline and co-authored geoscience publications. Developed tools to process large seismic datasets and visualize tectonic dynamics.',
      technologies: ['Python', 'CUDA', 'NumPy', 'Visualization', 'Research'],
      pattern: /(geoscience)/i,
      links: [
        { href: 'https://eartharxiv.org/repository/view/7166/', label: 'Geoscience Publication' }
      ]
    }
  ]

  const [imagesByKey, setImagesByKey] = useState<Record<string, { name: string; url: string }[]>>({})
  const [currentByKey, setCurrentByKey] = useState<Record<string, number>>({})
  const [previousByKey, setPreviousByKey] = useState<Record<string, number | null>>({})
  const [loadedByKey, setLoadedByKey] = useState<Record<string, Set<number>>>({})
  const [failedByKey, setFailedByKey] = useState<Record<string, Set<number>>>({})
  const [transitioning, setTransitioning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [activeByKey, setActiveByKey] = useState<Record<string, number | null>>({})

  useEffect(() => {
    const grouped: Record<string, { name: string; url: string }[]> = {}
    experiences.forEach(exp => {
      const key = exp.title
      grouped[key] = getImages('flair')
        .concat(getImages('nd'))
        .concat(getImages('politiktok'))
        .concat(getImages('ayudante'))
        .concat(getImages('geoscience'))
        .filter(img => exp.pattern.test(img.name.replace(/\s+|\(|\)/g, '')))
    })
    setImagesByKey(grouped)
    const initCurrent: Record<string, number> = {}
    const initPrev: Record<string, number | null> = {}
    const initLoaded: Record<string, Set<number>> = {}
    const initFailed: Record<string, Set<number>> = {}
    const initActive: Record<string, number | null> = {}
    Object.keys(grouped).forEach(key => {
      initCurrent[key] = 0
      initPrev[key] = null
      initLoaded[key] = new Set()
      initFailed[key] = new Set()
      initActive[key] = null
    })
    setCurrentByKey(initCurrent)
    setPreviousByKey(initPrev)
    setLoadedByKey(initLoaded)
    setFailedByKey(initFailed)
    setActiveByKey(initActive)
  }, [])

  useEffect(() => {
    const keys = Object.keys(imagesByKey)
    if (!keys.length || paused) return
    const SLIDE_INTERVAL_MS = 5000
    const CROSSFADE_MS = 1200
    const id = window.setInterval(() => {
      setPreviousByKey(prev => {
        const next: Record<string, number | null> = { ...prev }
        keys.forEach(k => { next[k] = currentByKey[k] ?? 0 })
        return next
      })
      setCurrentByKey(prev => {
        const next: Record<string, number> = { ...prev }
        keys.forEach(k => {
          const len = imagesByKey[k]?.length || 0
          if (len > 0) next[k] = ((prev[k] ?? 0) + 1) % len
          else next[k] = 0
        })
        return next
      })
      setTransitioning(true)
      window.setTimeout(() => setTransitioning(false), CROSSFADE_MS)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [imagesByKey, paused, currentByKey])



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
            const key = exp.title
            const group = imagesByKey[key] || []
            const cur = currentByKey[key] ?? 0
            const prev = previousByKey[key] ?? (group.length ? (cur - 1 + group.length) % group.length : 0)
            const loaded = loadedByKey[key] || new Set<number>()
            const failed = failedByKey[key] || new Set<number>()
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row mb-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="lg:w-1/2 lg:px-8">
                  <div className="glass-effect p-8 rounded-2xl relative hover:scale-105 transition-transform duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green rounded-t-2xl"></div>
                    <div className="text-accent-blue font-semibold mb-2 text-sm">{exp.period}</div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{exp.title}</h3>
                    <div className="text-accent-green font-semibold mb-4">{exp.company}</div>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {exp.description}
                      {Array.isArray((exp as any).links) && (exp as any).links.map((l: any) => (
                        <React.Fragment key={l.href}> <a href={l.href} target="_blank" rel="noreferrer" className={`${l.href.includes('eartharxiv') ? 'text-accent-purple' : 'text-accent-blue'} underline font-semibold`}>{l.label}</a></React.Fragment>
                      ))}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-accent-blue text-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 flex items-center justify-center py-8">
                  <div
                    className="group relative w-full aspect-[5/4] bg-primary-secondary rounded-3xl flex items-center justify-center overflow-hidden glass-effect hover:scale-[1.01] transition-transform duration-300 cursor-pointer image-container"
                    style={{ contentVisibility: 'auto', contain: 'layout paint style', willChange: 'transform, opacity' }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                  >
                    <div className="absolute inset-0">
                      <div className="h-full w-full">
                        <div className="h-full w-full relative">
                          {group.map((img, idx) => {
                            const len = group.length || 1
                            const isActive = idx === (cur % len)
                            const isPrev = idx === (prev as number % len)
                            const isLoaded = loaded.has(idx)
                            const hasFailed = failed.has(idx)
                            // const isLoading = false
                            return (
                              <div key={img.name} className="absolute top-0 left-0 h-full w-full">
                                <img
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
                                  decoding="async"
                                  loading="eager"
                                  onLoad={() => {
                                    setLoadedByKey(prev => {
                                      const next = { ...prev }
                                      const s = new Set(next[key] || new Set<number>())
                                      s.add(idx)
                                      next[key] = s
                                      return next
                                    })
                                  }}
                                  onError={() => {
                                    setFailedByKey(prev => {
                                      const next = { ...prev }
                                      const s = new Set(next[key] || new Set<number>())
                                      s.add(idx)
                                      next[key] = s
                                      return next
                                    })
                                  }}
                                />

                                {isActive && !isLoaded && !hasFailed && (
                                  <div className="absolute inset-0 grid place-items-center rounded-3xl bg-black/20">
                                    <div className="w-12 h-12 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                                  </div>
                                )}

                                {isActive && hasFailed && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-red-600/20 rounded-3xl overflow-hidden"></div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      {group.length > 0 && (
                        <button
                          onClick={() => setActiveByKey(prev => ({ ...prev, [key]: cur }))}
                          className="absolute inset-0 z-20 cursor-pointer"
                          aria-label="Open gallery"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {activeByKey[key] !== null && (group.length > 0) && (
                  <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80"
                    onClick={() => setActiveByKey(prev => ({ ...prev, [key]: null }))}
                  >
                    <div
                      className="relative max-w-7xl w-[98vw]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        aria-label="Close"
                        className="absolute -top-10 right-0 text-white/80 hover:text-white"
                        onClick={() => setActiveByKey(prev => ({ ...prev, [key]: null }))}
                      >
                        <X className="w-8 h-8" />
                      </button>
                      <div className="w-full max-h-[90vh] overflow-hidden rounded-xl bg-black/40 flex items-center justify-center p-2">
                        {activeByKey[key] !== null && (
                          <img
                            src={group[(activeByKey[key] as number) % group.length].url}
                            alt={group[(activeByKey[key] as number) % group.length].name}
                            className="max-w-full max-h-[88vh] w-auto h-auto object-contain"
                            loading="eager"
                            decoding="async"
                          />
                        )}
                      </div>
                      {group.length > 1 && (
                        <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                          {group.map((g, idx) => (
                            <button
                              key={g.name}
                              onClick={() => setActiveByKey(prev => ({ ...prev, [key]: idx }))}
                              className={`relative rounded-lg overflow-hidden border ${idx === activeByKey[key] ? 'border-accent-blue' : 'border-white/10'}`}
                            >
                              <img src={g.url} alt={g.name} className="w-full h-20 object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
