import { useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { MotionProvider } from './components/providers/MotionProvider'
import { getPortfolio } from './data/portfolio'
import { usePortfolioRoute } from './hooks/usePortfolioRoute'
import { VisualPortfolio } from './pages/VisualPortfolio'
import { SiteFoot } from './site/SiteFoot'
import { SiteNav } from './site/SiteNav'
import { SoftwarePage } from './site/SoftwarePage'

function PortfolioShell() {
  const mainRef = useRef<HTMLElement>(null)
  const { announcement, mode, navigateMode } = usePortfolioRoute()
  const page = getPortfolio(mode)
  const isSoftware = mode === 'software'

  return (
    <>
      <a className="skip-link" href="#main" onClick={() => mainRef.current?.focus()}>
        Skip to content
      </a>
      {isSoftware ? (
        <SiteNav
          navigation={page.navigation}
          resume={page.hero.secondaryCta}
          roleLabel={page.hero.eyebrow}
        />
      ) : (
        <SiteHeader mode={mode} navigation={page.navigation} roleLabel={page.hero.eyebrow} />
      )}
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
            {isSoftware ? <SoftwarePage /> : <VisualPortfolio />}
          </m.div>
        </AnimatePresence>
      </main>
      {isSoftware ? (
        <SiteFoot
          links={page.contact.links}
          location={page.hero.location}
          name={page.hero.name}
          navigateMode={navigateMode}
        />
      ) : (
        <SiteFooter
          links={page.contact.links}
          mode={mode}
          name={page.hero.name}
          navigateMode={navigateMode}
        />
      )}
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
