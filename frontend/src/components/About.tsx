import React from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, GraduationCap, Layers3 } from 'lucide-react'
import { getImages } from '../imageManifest'
import { stats } from '../content'
import ImageGallery from './ImageGallery'

const aboutHighlights = [
  {
    icon: GraduationCap,
    title: 'Computer Engineering at PUC Chile',
    body: 'Formal training, then real-world work across research, product, and systems that actually have to hold up under pressure.',
  },
  {
    icon: BrainCircuit,
    title: 'Software engineering + data science',
    body: 'I do not treat those as separate tracks. The interesting work usually lives where production software and research workflows meet.',
  },
  {
    icon: Layers3,
    title: 'Production and research infrastructure',
    body: 'From fintech and industrial tooling to autonomous drones, political-media analysis, and scientific computing.',
  },
]

const About = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`)
  }

  return (
    <section id="about" className="relative px-6 pb-20 pt-10 sm:pb-28 sm:pt-14">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-100">
              Personal context
            </div>
            <ImageGallery
              images={getImages('profile')}
              label="Profile gallery"
              autoplay
              intervalMs={7000}
              priority
              variant="portrait"
            />
          </div>

          <div
            className="glowing-card rounded-[1.75rem] border border-white/10 bg-[#0d0d0d] p-6 shadow-inner"
            onMouseMove={handleMouseMove}
          >
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Software Engineering</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Data Science</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Research Systems</span>
            </div>
            <h3 className="mt-5 text-3xl font-semibold leading-tight text-[#f8f5ec]">
              Computer engineer working across software, AI, and research systems.
            </h3>
            <p className="mt-5 text-base leading-7 text-zinc-300">
              I studied Computer Engineering at Pontificia Universidad Católica de Chile and have worked across product engineering, AI systems, data science, and technical research environments. The work I care about most is where software has to be reliable, models have to be useful, and the full system has to hold up under real operating conditions.
            </p>
            <div className="mt-6 grid gap-3">
              {aboutHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-zinc-200">
                  <div className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                    <div>
                      <p className="font-medium text-[#f8f5ec]">{item.title}</p>
                      <p className="mt-1 leading-6 text-zinc-400">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="space-y-8"
        >
          <div className="space-y-5">
            <p className="section-kicker">About</p>
            <h2 className="section-title">Production systems, research mindset.</h2>
            <div className="space-y-5 text-lg leading-8 text-zinc-300">
              <p>
                I studied Computer Engineering at Pontificia Universidad Católica de Chile and have worked across fintech, industrial systems, energy optimization, autonomous drones, and research tooling. The throughline is building software and data systems that can survive real production constraints.
              </p>
              <p>
                I am especially interested in where AI meets simulation, remote sensing, computer vision, and aerospace-style problems. I have also taught operating systems, testing, high-performance computing, and Python, which pushed me to value clarity and rigor as much as raw technical depth.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-4!">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="glowing-card group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
                onMouseMove={handleMouseMove}
              >
                <p className="text-4xl font-mono font-bold tracking-tighter text-[#f8f5ec]">
                  {stat.value}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
