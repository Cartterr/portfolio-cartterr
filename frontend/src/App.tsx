import { Fragment, useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { MotionProvider } from './components/providers/MotionProvider'
import { Metric } from './components/ui/Metric'
import { getPortfolio, type PortfolioPage } from './data/portfolio'
import type { PortfolioSection } from './data/types'
import { usePortfolioRoute } from './hooks/usePortfolioRoute'
import { About } from './sections/About'
import { Capabilities } from './sections/Capabilities'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { FeaturedWork } from './sections/FeaturedWork'
import { Hero } from './sections/Hero'

const renderSection = (section: PortfolioSection, page: PortfolioPage) => {
  switch (section.kind) {
    case 'hero':
      return (
        <div id={section.id}>
          <Hero content={page.hero} image={page.projects[0]} />
          <section aria-label="Selected outcomes" className="metrics-strip">
            <div className="metrics-strip__inner">
              {page.metrics.map((metric) => (
                <Metric key={metric.label} metric={metric} />
              ))}
            </div>
          </section>
        </div>
      )
    case 'about':
      return <About content={page.about} />
    case 'experience':
      return <Experience items={page.experience} />
    case 'work':
      return <FeaturedWork caseStudies={page.projects} />
    case 'capabilities':
      return (
        <div id={section.id}>
          <Capabilities groups={page.capabilities} />
        </div>
      )
    case 'contact':
      return <Contact content={page.contact} />
  }
}

function PortfolioShell() {
  const mainRef = useRef<HTMLElement>(null)
  const { announcement, mode, navigateMode } = usePortfolioRoute()
  const page = getPortfolio(mode)

  return (
    <>
      <a className="skip-link" href="#main" onClick={() => mainRef.current?.focus()}>
        Skip to content
      </a>
      <SiteHeader
        mode={mode}
        navigateMode={navigateMode}
        navigation={page.navigation}
        roleLabel={page.hero.eyebrow}
      />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <AnimatePresence initial={false} mode="wait">
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="portfolio-page"
            data-portfolio-page={mode}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={mode}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {page.sections.map((section) => (
              <Fragment key={section.id}>{renderSection(section, page)}</Fragment>
            ))}
          </m.div>
        </AnimatePresence>
      </main>
      <SiteFooter links={page.contact.links} mode={mode} name={page.hero.name} />
      <p aria-atomic="true" aria-live="polite" className="sr-only" data-route-announcement>
        {announcement}
      </p>
    </>
  )
}

function App() {
  return (
    <MotionProvider>
      <PortfolioShell />
    </MotionProvider>
  )
}

export default App
