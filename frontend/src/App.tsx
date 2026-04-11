import { Suspense, lazy, startTransition, useEffect, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Navigation from './components/Navigation'
import ScrollProgress from './components/ScrollProgress'

const BelowFoldSections = lazy(() => import('./components/BelowFoldSections'))

function App() {
  const [showBelowFold, setShowBelowFold] = useState(false)

  useEffect(() => {
    const reveal = () => {
      startTransition(() => {
        setShowBelowFold(true)
      })
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }

    if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(reveal, { timeout: 1200 })
      return () => idleWindow.cancelIdleCallback?.(idleId)
    }

    const timeoutId = window.setTimeout(reveal, 500)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      <div className="relative overflow-x-hidden">

      <ScrollProgress />
      <Navigation />
      <Hero />
      <About />
      {showBelowFold ? (
        <Suspense fallback={null}>
          <BelowFoldSections />
        </Suspense>
      ) : null}
      </div>
    </div>
  )
}

export default App
