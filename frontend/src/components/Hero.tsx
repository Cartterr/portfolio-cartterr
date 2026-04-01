import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Github, Linkedin } from 'lucide-react'
import { focusAreas } from '../content'
import LiquidAscii from './LiquidAscii'
import ResponsivePretext from './ResponsivePretext'

const heroTitle = 'AI, software, and graphics-driven systems for real-world constraints.'
const heroBody =
  'I am a software engineer with experience across fintech, industrial alerting, energy systems, research infrastructure, and autonomous planning. I like the overlap between product engineering, machine learning, simulation, and graphics.'
const heroInterestLine =
  'Interested in applying AI to satellite data, simulation, and aerospace problems.'

const Hero = () => (
  <section id="home" className="relative overflow-hidden px-6 pb-16 pt-28 sm:pb-24 sm:pt-36">
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start"
      >
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-[#f97316]/30 bg-[#f97316]/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#fbbf24]">
            Santiago, Chile · AI systems · software engineering · graphics and simulation
          </div>

          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">José Carter Arriagada</p>
            <ResponsivePretext
              as="h1"
              text={heroTitle}
              className="max-w-4xl text-5xl font-semibold leading-[0.92] text-[#f8f5ec] sm:text-6xl lg:text-[6.8rem]"
              lineClassName="pretext-line block"
            />
            <ResponsivePretext
              as="p"
              text={heroBody}
              className="max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl"
              lineClassName="pretext-line block"
            />
            <div className="max-w-2xl rounded-[1.5rem] border border-[#f97316]/20 bg-[#f97316]/8 px-5 py-4">
              <ResponsivePretext
                as="p"
                text={heroInterestLine}
                className="text-sm font-medium uppercase tracking-[0.16em] text-[#f6c58e] sm:text-base"
                lineClassName="pretext-line block"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#f97316] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#1a120d] transition hover:-translate-y-0.5 hover:bg-[#fb923c]"
            >
              See selected work
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="/Jose_Carter_CV_Spanish_FullStack.pdf"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Download CV
              <Download className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {focusAreas.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-zinc-100 backdrop-blur-sm">
                <ResponsivePretext
                  as="p"
                  text={item}
                  className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-100"
                  lineClassName="pretext-line block"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <LiquidAscii />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="https://github.com/Cartterr"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-100 transition hover:border-white/20 hover:bg-white/10"
            >
              GitHub
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/jose-carter-arriagada"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-100 transition hover:border-white/20 hover:bg-white/10"
            >
              LinkedIn
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

export default Hero
