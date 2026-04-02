import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projectEntries } from '../content'
import ResponsivePretext from './ResponsivePretext'

const Projects = () => (
  <section id="projects" className="px-6 py-20 sm:py-28">
    <div className="mx-auto max-w-6xl">
      <div className="mb-14 max-w-3xl">
        <p className="section-kicker">Selected Work</p>
        <ResponsivePretext
          as="h2"
          text="Three projects that explain the direction better than a long list."
          className="section-title"
          lineClassName="pretext-line block"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {projectEntries.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/5 p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <ResponsivePretext
                as="h3"
                text={project.title}
                className="text-2xl font-semibold leading-tight text-[#f8f5ec]"
                lineClassName="pretext-line block"
              />
              <span className="rounded-full border border-white/10 bg-zinc-100 text-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                {project.status}
              </span>
            </div>

            <ResponsivePretext
              as="p"
              text={project.description}
              className="mt-5 text-base leading-7 text-zinc-300"
              lineClassName="pretext-line block"
            />
            <ResponsivePretext
              as="p"
              text={project.detail}
              className="mt-4 text-sm leading-6 text-zinc-400"
              lineClassName="pretext-line block"
            />

            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-[#181818] px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mt-auto pt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
              >
                Open project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <div className="mt-auto pt-8 text-sm text-zinc-500">Private or internal implementation.</div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  </section>
)

export default Projects
