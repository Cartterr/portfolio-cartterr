import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { experienceEntries } from '../content'
import { getImages } from '../imageManifest'
import ImageGallery from './ImageGallery'
import ResponsivePretext from './ResponsivePretext'

const Experience = () => (
  <section id="experience" className="px-6 py-20 sm:py-28">
    <div className="mx-auto max-w-6xl">
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
            className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-7 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="rounded-[1.6rem] border border-white/10 bg-[#121212] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{entry.period}</p>
              <ResponsivePretext
                as="h3"
                text={entry.title}
                className="mt-4 text-3xl font-semibold text-[#f8f5ec]"
                lineClassName="pretext-line block"
              />
              <p className="mt-2 text-lg text-zinc-100">{entry.company}</p>
              <ResponsivePretext
                as="p"
                text={entry.summary}
                className="mt-5 text-base leading-7 text-zinc-300"
                lineClassName="pretext-line block"
              />
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-zinc-200">
                {entry.impact}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {entry.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-300"
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
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
                >
                  {entry.link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            {entry.gallery ? (
              <ImageGallery images={getImages(entry.gallery)} label={`${entry.company} gallery`} />
            ) : (
              <div className="flex h-full flex-col justify-between rounded-[1.6rem] border border-white/10 bg-[#121212] p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{entry.spotlight?.eyebrow ?? 'Selected context'}</p>
                  <ResponsivePretext
                    as="h4"
                    text={entry.spotlight?.title ?? 'Current work'}
                    className="mt-4 text-3xl font-semibold leading-tight text-[#f8f5ec]"
                    lineClassName="pretext-line block"
                  />
                </div>

                <div className="mt-8 space-y-3">
                  {(entry.spotlight?.points ?? []).map((point) => (
                    <div key={point} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-zinc-200">
                      {point}
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

export default Experience
