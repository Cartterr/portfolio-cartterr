import { motion } from 'framer-motion'
import { getImages } from '../imageManifest'
import { stats } from '../content'
import ImageGallery from './ImageGallery'
import ResponsivePretext from './ResponsivePretext'

const About = () => (
  <section id="about" className="px-6 py-20 sm:py-28">
    <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <ImageGallery images={getImages('profile')} label="Profile gallery" autoplay priority />
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

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-4xl font-semibold text-[#f8f5ec]">{stat.value}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
)

export default About
