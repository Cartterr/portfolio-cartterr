import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Github, Linkedin, Activity } from 'lucide-react'
import { focusAreas } from '../content'

const heroTitle = 'Software Engineer, AI Engineer & Data Scientist.'
const heroBody =
  'I build robust systems for real-world constraints across product engineering, data infrastructure, and autonomous planning. I specialize in the intersection of scalable backends, machine learning, and high-performance computing.'
const heroInterestLine =
  'Interested in applying AI to satellite data, simulation, and aerospace problems.'

const Hero = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`)
  }

  return (
    <section
      id="home"
      className="relative px-6 pb-8 pt-28 sm:pb-12 sm:pt-32 lg:pb-14 lg:pt-36 min-h-[44rem] sm:min-h-[46rem]"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex max-w-4xl flex-col gap-10"
        >
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-100 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
              <Activity className="w-3 h-3 animate-pulse text-orange-400" />
              Santiago, Chile · Systems & Data Engineering
            </div>

            <div className="space-y-5">
              <p className="font-mono text-sm uppercase tracking-[0.4em] text-zinc-400">José Carter Arriagada</p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] text-[#f8f5ec] drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] sm:text-6xl lg:text-7xl">
                {heroTitle}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-200 sm:text-xl">
                {heroBody}
              </p>
              <div className="glowing-card group max-w-2xl rounded-[1.5rem] border border-white/10 bg-[#111111]/90 px-6 py-5 transition-colors hover:bg-[#161616]" onMouseMove={handleMouseMove}>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-200 transition-colors group-hover:text-orange-200/90 sm:text-base">
                  {heroInterestLine}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-zinc-100 text-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] transition hover:-translate-y-0.5 hover:bg-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                See selected work
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="/Jose_Carter_CV_Eng.pdf"
                download="Jose_Carter_CV_Eng.pdf"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-[#121212] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Download CV
                <Download className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/Cartterr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-[#121212] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                GitHub
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/jose-carter-arriagada"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-[#121212] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                LinkedIn
                <Linkedin className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 max-w-2xl pt-4">
              {focusAreas.map((item) => (
                <div 
                  key={item} 
                  onMouseMove={handleMouseMove}
                  className="glowing-card group rounded-2xl border border-white/10 bg-[#121212] px-5 py-4 backdrop-blur-sm transition-colors hover:bg-white/10 flex items-center"
                >
                  <div className="mr-4 h-1.5 w-1.5 rounded-full bg-orange-500/50 transition-all group-hover:bg-orange-400 group-hover:shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-200 transition-colors group-hover:text-zinc-100">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
