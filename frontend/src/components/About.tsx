import React from 'react'
import { motion } from 'framer-motion'
import { getImages } from '../imageManifest'
import { stats } from '../content'
import ImageGallery from './ImageGallery'
import ResponsivePretext from './ResponsivePretext'

const codeSnippet = `const persona = {
  role: "Software & AI Engineer",
  focus: [
    "Systems Architecture",
    "Model Deployment",
    "Scientific Computing"
  ],
  approach: "Pragmatic, scalable, type-safe.",
  status: 200
};`

const About = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`)
  }

  return (
    <section id="about" className="px-6 py-20 sm:py-28 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <ImageGallery images={getImages('profile')} label="Profile gallery" autoplay priority />
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0d0d0d] p-5 font-mono text-sm shadow-inner">
            <div className="flex gap-2 border-b border-white/10 pb-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <pre className="text-zinc-300 overflow-x-auto">
              <code className="text-orange-300">{codeSnippet.split('=')[0]}=</code>
              <code className="text-zinc-300">{codeSnippet.split('=')[1]}</code>
            </pre>
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
            <ResponsivePretext
              as="h2"
              text="Software engineering with one foot in production and the other in research."
              className="section-title"
              lineClassName="pretext-line block"
            />
            <div className="space-y-5 text-lg leading-8 text-zinc-300">
              <ResponsivePretext
                as="p"
                text="I studied Computer Engineering at Pontificia Universidad Católica de Chile and have worked across fintech, industrial operations, energy optimization, autonomous drones, and large-scale research tooling. The common thread is building systems that stay understandable when the stakes move beyond a demo."
                lineClassName="pretext-line block"
              />
              <ResponsivePretext
                as="p"
                text="I am especially interested in the edge where AI meets simulation, remote sensing, computer vision, and aerospace-style problems. Alongside engineering work, I have also taught operating systems, testing, high-performance computing, and Python in technical academic settings."
                lineClassName="pretext-line block"
              />
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
