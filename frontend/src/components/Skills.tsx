import { motion } from 'framer-motion'
import { skillBuckets } from '../content'
import ResponsivePretext from './ResponsivePretext'

const Skills = () => (
  <section id="skills" className="px-6 py-20 sm:py-28">
    <div className="mx-auto max-w-6xl">
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
            className="rounded-[2rem] border border-white/10 bg-white/5 p-7"
          >
            <ResponsivePretext
              as="h3"
              text={bucket.title}
              className="text-2xl font-semibold text-[#f8f5ec]"
              lineClassName="pretext-line block"
            />
            <div className="mt-5 flex flex-wrap gap-3">
              {bucket.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-[#161616] px-4 py-3 text-sm text-zinc-200"
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

export default Skills
