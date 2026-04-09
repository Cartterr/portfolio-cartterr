import React from 'react'
import { motion } from 'framer-motion'
import { Hammer, Scaling, BrainCircuit, Network } from 'lucide-react'
import { skillBuckets } from '../content'
import ResponsivePretext from './ResponsivePretext'

const getBucketIcon = (title: string) => {
  switch (title) {
    case 'Build': return <Hammer className="w-6 h-6 text-orange-400/80 mb-4" />
    case 'Scale': return <Scaling className="w-6 h-6 text-pink-400/80 mb-4" />
    case 'Analyze': return <BrainCircuit className="w-6 h-6 text-blue-400/80 mb-4" />
    case 'Integrate': return <Network className="w-6 h-6 text-emerald-400/80 mb-4" />
    default: return null
  }
}

const Skills = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`)
  }

  return (
    <section id="skills" className="px-6 py-20 sm:py-28 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-14 max-w-3xl">
          <p className="section-kicker">Capabilities</p>
          <ResponsivePretext
            as="h2"
            text="The stack changes, but these are the tools and patterns I keep returning to."
            className="section-title"
            lineClassName="pretext-line block"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {skillBuckets.map((bucket, index) => (
            <motion.div
              key={bucket.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onMouseMove={handleMouseMove}
              className="glowing-card group rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10"
            >
              {getBucketIcon(bucket.title)}
              <ResponsivePretext
                as="h3"
                text={bucket.title}
                className="text-2xl font-semibold text-[#f8f5ec]"
                lineClassName="pretext-line block"
              />
              <div className="mt-6 flex flex-wrap gap-2">
                {bucket.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/5 bg-[#121212] px-3 py-1.5 text-sm font-medium text-zinc-300 shadow-inner transition-colors group-hover:border-white/10 group-hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
