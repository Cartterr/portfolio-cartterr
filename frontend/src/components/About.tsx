import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getShuffledImages } from '../imageManifest'

const About = () => {
  const stats = [
    { number: '2+', label: 'Years Experience' },
    { number: '10+', label: 'Projects Completed' },
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
  const [, setError] = useState<string | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadImages = () => {
      try {
        const profileImages = getShuffledImages('profile')
        setImages(profileImages)
        setLoading(false)
      } catch (e: any) {
        setError('Failed to load images')
        setLoading(false)
      }
    }
    loadImages()
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



  const openLightbox = (idx: number) => {
    requestAnimationFrame(() => setActiveIdx(idx))
  }

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
              className="group relative w-full aspect-[5/4] bg-primary-secondary rounded-3xl flex items-center justify-center overflow-hidden glass-effect hover:scale-[1.01] transition-transform duration-300 cursor-pointer image-container"
              style={{ contentVisibility: 'auto', contain: 'layout paint style', willChange: 'transform, opacity' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="absolute inset-0">
                <div className="h-full w-full">
                  <div className="h-full w-full">
                    {(loading || images.length === 0) && (
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="spinner"></div>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="h-full w-full relative">
                        {images.map((img, idx) => {
                          const isActive = idx === currentSlide
                          const isPrev = idx === (previousSlide ?? (currentSlide - 1 + images.length) % images.length)
                          const isLoaded = loadedImages.has(idx)
                          const hasFailed = failedImages.has(idx)

                          return (
                            <div key={img.name} className="absolute top-0 left-0 h-full w-full">
                              <img
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
                                loading="eager"
                                onLoad={() => setLoadedImages(prev => new Set(prev).add(idx))}
                                onError={() => setFailedImages(prev => new Set(prev).add(idx))}
                              />

                              {isActive && !isLoaded && !hasFailed && (
                                <div className="absolute inset-0 grid place-items-center rounded-3xl bg-black/20">
                                  <div className="w-12 h-12 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                                </div>
                              )}

                              {isActive && hasFailed && (
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-red-600/20 rounded-3xl overflow-hidden">
                                  <div className="absolute inset-0 opacity-10" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
                                  }}></div>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <div className="relative mb-6">
                                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400/30 to-orange-500/30 backdrop-blur-sm border border-red-400/20 flex items-center justify-center">
                                        <X className="w-10 h-10 text-red-300" />
                                      </div>
                                      <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-400/20 animate-ping"></div>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-white/90 text-lg font-medium">Failed to Load</p>
                                      <p className="text-white/60 text-sm">The image could not be displayed</p>
                                      <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-200 text-sm transition-all duration-200 hover:scale-105">Retry</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
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
            <h3 className="text-2xl sm:text-3xl font-bold text-accent-blue">Transforming Ideas into Digital Reality</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              <span className="text-accent-blue font-semibold">Software Engineer</span> specialized in <span className="text-accent-purple font-semibold">full‑stack development</span> and <span className="text-accent-green font-semibold">intelligent systems</span>, with a B.S. in Computer Engineering from Pontificia Universidad Católica de Chile. Focused on <span className="text-accent-blue font-semibold">Software Engineering</span> and <span className="text-accent-purple font-semibold">Data Science</span>, with hands‑on experience building scalable <span className="text-accent-green font-semibold">microservices</span> using <span className="text-accent-blue font-semibold">Python</span>, <span className="text-accent-purple font-semibold">JavaScript/TypeScript</span>, and <span className="text-accent-green font-semibold">cloud deployments</span>.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Contributed to enterprise platforms in <span className="text-accent-green font-semibold">HVAC energy optimization</span>, <span className="text-accent-blue font-semibold">autonomous drone coordination</span>, and <span className="text-accent-purple font-semibold">digital political research</span>, applying <span className="text-accent-blue font-semibold">design patterns</span>, <span className="text-accent-purple font-semibold">functional programming</span>, and <span className="text-accent-green font-semibold">AI‑driven</span> solutions.
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
            <div key={index} className="text-center p-6 glass-effect rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-accent-green mb-2">{stat.number}</div>
              <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {activeIdx !== null && images.length > 0 && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80" onClick={() => setActiveIdx(null)}>
          <div className="relative max-w-7xl w-[98vw]" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Close" className="absolute -top-10 right-0 text-white/80 hover:text-white" onClick={() => setActiveIdx(null)}>
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-h-[90vh] overflow-hidden rounded-xl bg-black/40 flex items-center justify-center p-2">
              <img src={images[activeIdx].url} alt={images[activeIdx].name} className="max-w-full max-h-[88vh] w-auto h-auto object-contain" loading="eager" decoding="async" />
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
