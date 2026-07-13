import { useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { MotionProvider } from './components/providers/MotionProvider'
import { getPortfolio } from './data/portfolio'
import { usePortfolioRoute } from './hooks/usePortfolioRoute'
import { SoftwarePortfolio } from './pages/SoftwarePortfolio'
import { VisualCompatibilityPortfolio } from './pages/VisualCompatibilityPortfolio'

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
            {mode === 'software' ? (
              <SoftwarePortfolio />
            ) : (
              <VisualCompatibilityPortfolio />
            )}
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
