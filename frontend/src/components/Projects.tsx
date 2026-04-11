import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Code2, Terminal, Database, Server, Cpu } from 'lucide-react'
import { projectEntries } from '../content'

const getStackIcon = (item: string) => {
  const lowerItem = item.toLowerCase()
  if (lowerItem.includes('sql') || lowerItem.includes('data')) return <Database className="w-3 h-3 mr-1.5" />
  if (lowerItem.includes('node') || lowerItem.includes('python') || lowerItem.includes('c++')) return <Terminal className="w-3 h-3 mr-1.5" />
  if (lowerItem.includes('react') || lowerItem.includes('next')) return <Code2 className="w-3 h-3 mr-1.5" />
  if (lowerItem.includes('cuda') || lowerItem.includes('gpu')) return <Cpu className="w-3 h-3 mr-1.5" />
  return <Server className="w-3 h-3 mr-1.5" />
}

const Projects = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`)
  }

  return (
    <section id="projects" className="px-6 py-20 sm:py-28 relative">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-14 max-w-3xl">
          <p className="section-kicker">Selected Work</p>
          <h2 className="section-title">Projects demonstrating scale, performance, and applied research.</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {projectEntries.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              onMouseMove={handleMouseMove}
              className="glowing-card group flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold leading-tight text-[#f8f5ec]">{project.title}</h3>
              </div>
              <div className="mt-3">
                <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-300 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]">
                  {project.status}
                </span>
              </div>

              <p className="mt-6 text-base leading-7 text-zinc-300">{project.description}</p>
              <p className="mt-4 text-sm leading-6 text-zinc-400 transition-colors group-hover:text-zinc-300">{project.detail}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="flex items-center rounded-full border border-white/10 bg-[#181818] px-3 py-1.5 text-xs font-mono tracking-tight text-zinc-300"
                  >
                    {getStackIcon(item)}
                    {item}
                  </span>
                ))}
              </div>

              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto pt-8 flex w-fit items-center gap-2 text-sm font-semibold text-[#f8f5ec] transition group-hover:text-orange-400"
                >
                  View Details
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              ) : (
                <div className="mt-auto pt-8 text-sm font-mono text-zinc-600">{'/* Private repository */'}</div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
