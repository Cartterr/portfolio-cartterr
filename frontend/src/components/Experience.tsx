import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { experienceEntries } from '../content'
import { getImages } from '../imageManifest'
import ImageGallery from './ImageGallery'
import ResponsivePretext from './ResponsivePretext'

const Experience = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`)
  }

  return (
    <section id="experience" className="px-6 py-20 sm:py-28 relative">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-14 max-w-3xl">
          <p className="section-kicker">Experience</p>
          <ResponsivePretext
            as="h2"
            text="Selected work across product engineering, research systems, and technical teaching."
            className="section-title"
            lineClassName="pretext-line block"
          />
        </div>

        <div className="space-y-16">
          {experienceEntries.map((entry, index) => (
            <motion.article
              key={`${entry.company}-${entry.title}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.04 }}
              onMouseMove={handleMouseMove}
              className="glowing-card group grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] transition-colors hover:bg-white/10"
            >
              <div className="rounded-[1.6rem] border border-white/5 bg-[#0f0f0f]/80 p-6 shadow-inner">
                <p className="text-xs font-mono uppercase tracking-[0.28em] text-zinc-500">{entry.period}</p>
                <ResponsivePretext
                  as="h3"
                  text={entry.title}
                  className="mt-4 text-3xl font-semibold text-[#f8f5ec]"
                  lineClassName="pretext-line block"
                />
                <p className="mt-2 text-lg text-orange-200/80 font-medium">{entry.company}</p>
                <ResponsivePretext
                  as="p"
                  text={entry.summary}
                  className="mt-6 text-base leading-7 text-zinc-300"
                  lineClassName="pretext-line block"
                />
                <div className="mt-5 border-l-2 border-orange-500/30 pl-4 py-1">
                  <p className="text-sm italic leading-6 text-zinc-400">
                    "{entry.impact}"
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {entry.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.1em] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {entry.link ? (
                  <a
                    href={entry.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-orange-400"
                  >
                    {entry.link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>

              {entry.gallery ? (
                <div className="h-full w-full overflow-hidden rounded-[1.6rem] border border-white/5">
                   <ImageGallery images={getImages(entry.gallery)} label={`${entry.company} gallery`} />
                </div>
              ) : (
                <div className="flex h-full flex-col justify-center rounded-[1.6rem] border border-white/5 bg-[#0f0f0f]/80 p-8 shadow-inner">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.28em] text-zinc-500 flex items-center gap-2">
                      <Terminal className="w-3 h-3" />
                      {entry.spotlight?.eyebrow ?? 'Selected context'}
                    </p>
                    <ResponsivePretext
                      as="h4"
                      text={entry.spotlight?.title ?? 'Current work'}
                      className="mt-4 text-2xl font-semibold leading-tight text-[#f8f5ec]"
                      lineClassName="pretext-line block"
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    {(entry.spotlight?.points ?? []).map((point) => (
                      <div key={point} className="flex gap-3 text-sm leading-6 text-zinc-300">
                        <ChevronRight className="w-4 h-4 text-orange-500/70 shrink-0 mt-1" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
