import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Mail } from 'lucide-react'
import Typewriter from './Typewriter'

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let raf = 0
    let pending = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || pending) return
      pending = true
      raf = window.requestAnimationFrame(() => {
        pending = false
        const rect = heroRef.current!.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const xPercent = x / rect.width
        const yPercent = y / rect.height
        heroRef.current!.style.background = `
          radial-gradient(circle at ${xPercent * 100}% ${yPercent * 100}%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
          radial-gradient(circle at ${(1 - xPercent) * 100}% ${(1 - yPercent) * 100}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #000 50%, #0a0a0a 100%)
        `
      })
    }
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const gridSvg = encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none"><g fill="#ffffff" fill-opacity="0.02"><circle cx="30" cy="30" r="1"/></g></g></svg>')

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 floating-animation"
          style={{ backgroundImage: `url("data:image/svg+xml,${gridSvg}")` }}
        ></div>
      </div>

      <div className="text-center z-10 max-w-5xl mx-auto px-6 will-change-transform">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 gradient-text"
        >
          José Carter Arriagada
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto"
        >
          <Typewriter
            phrases={[
              'Software Engineer',
              'Full-Stack Developer',
              'AI & Data Science Researcher',
              'Systems Optimizer',
            ]}
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <a
            href="#projects"
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full text-white font-semibold hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-blue/30"
          >
            <Rocket className="w-5 h-5" />
            View My Work
          </a>

          <a
            href="#contact"
            className="flex items-center gap-3 px-8 py-4 glass-effect rounded-full text-white font-semibold hover:scale-105 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
