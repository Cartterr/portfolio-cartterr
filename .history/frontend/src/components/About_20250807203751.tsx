import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const About = () => {
  const stats = [
    { number: '5+', label: 'Years Experience' },
    { number: '20+', label: 'Projects Completed' },
    { number: '50%', label: 'Energy Savings Achieved' },
    { number: '100K+', label: 'Data Points Processed' }
  ]

  const [images, setImages] = useState<{ name: string; url: string }[]>([])
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [firstLoaded, setFirstLoaded] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const base = (import.meta.env.VITE_API_URL as string) || '/api'
        const res = await fetch(`${base}/images?q=profile`)
        const data = await res.json()
        const list: { name: string; url: string }[] = data.images || []
        const rest = list.filter(i => i.name.toLowerCase() !== 'profile1.jpg')
        for (let i = rest.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[rest[i], rest[j]] = [rest[j], rest[i]]
        }
        const ordered = [list.find(i => i.name.toLowerCase() === 'profile1.jpg')!, ...rest].filter(Boolean)
        setImages(ordered)
      } catch (e: any) {
        setError('Failed to load images')
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length <= 1) return
    if (paused) return
    const SLIDE_INTERVAL_MS = 5000
    const CROSSFADE_MS = 1200
    const id = window.setInterval(() => {
      setPreviousSlide((prev) => (prev === null ? currentSlide : currentSlide))
      setCurrentSlide((s) => (s + 1) % images.length)
      setTransitioning(true)
      window.setTimeout(() => setTransitioning(false), CROSSFADE_MS)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [images.length, paused, currentSlide])

  useEffect(() => {
    if (!images.length) return
    images.forEach(({ url }) => {
      const img = new Image()
      img.decoding = 'async'
      img.loading = 'eager'
      img.src = url
    })
  }, [currentSlide, images])

  const openLightbox = (idx: number) => setActiveIdx(idx)

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
            <div
              className="group relative w-full aspect-[5/4] bg-primary-secondary rounded-3xl flex items-center justify-center overflow-hidden glass-effect hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="absolute inset-0">
                <div className="h-full w-full">
                  <div className="h-full w-full">
                    {(loading || images.length === 0) && (
                      <div className="absolute inset-0 grid place-items-center skeleton">
                        <div className="spinner"></div>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="h-full w-full relative">
                        {images.map((img, idx) => {
                          const isActive = idx === currentSlide
                          const isPrev = idx === (previousSlide ?? (currentSlide - 1 + images.length) % images.length)
                          return (
                            <img
                              key={img.name}
                              src={img.url}
                              alt={img.name}
                              className={`absolute top-0 left-0 h-full w-full object-cover ${isActive ? 'kenburns' : isPrev ? 'kenburns-out' : ''} cursor-pointer`}
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
                              onClick={() => openLightbox(currentSlide)}
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
                <button onClick={() => openLightbox(currentSlide)} className="absolute inset-0 z-20 cursor-pointer" aria-label="Open gallery" />
              )}
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

      {activeIdx !== null && images.length > 0 && (
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
    </section>
  )
}

export default About
