import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getPortfolio, type PortfolioMode } from '../data/portfolio'

type PortfolioRouteHistory = {
  mode: PortfolioMode
  scrollY: number
}

type PendingRoute = PortfolioRouteHistory & {
  hash: string
  kind: 'popstate' | 'switch'
  revision: number
}

type RouteState = {
  mode: PortfolioMode
  revision: number
}

const isPortfolioMode = (value: unknown): value is PortfolioMode =>
  value === 'software' || value === 'visual'

export const getPortfolioModeFromPathname = (pathname: string): PortfolioMode =>
  pathname === '/visual' || pathname === '/visual/' ? 'visual' : 'software'

export const applyPortfolioIdentity = (mode: PortfolioMode) => {
  const page = getPortfolio(mode)
  document.documentElement.dataset.portfolioMode = mode
  document.title = page.meta.title

  let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!description) {
    description = document.createElement('meta')
    description.name = 'description'
    document.head.append(description)
  }
  description.content = page.meta.description
}

const withPortfolioRoute = (state: unknown, route: PortfolioRouteHistory) => ({
  ...(state && typeof state === 'object' ? state : {}),
  portfolioRoute: route,
})

const readPortfolioRoute = (state: unknown): PortfolioRouteHistory | null => {
  if (!state || typeof state !== 'object' || !('portfolioRoute' in state)) return null
  const route = state.portfolioRoute
  if (!route || typeof route !== 'object') return null
  if (!('mode' in route) || !isPortfolioMode(route.mode)) return null
  if (!('scrollY' in route) || typeof route.scrollY !== 'number') return null
  return { mode: route.mode, scrollY: route.scrollY }
}

const announceMode = (mode: PortfolioMode, action: 'loaded' | 'restored') =>
  `${mode === 'software' ? 'Software' : 'Visual'} portfolio ${action}`

export function usePortfolioRoute() {
  const [route, setRoute] = useState<RouteState>(() => ({
    mode: getPortfolioModeFromPathname(window.location.pathname),
    revision: 0,
  }))
  const [announcement, setAnnouncement] = useState('')
  const modeRef = useRef(route.mode)
  const pendingRouteRef = useRef<PendingRoute | null>(null)

  modeRef.current = route.mode

  useLayoutEffect(() => {
    applyPortfolioIdentity(route.mode)
  }, [route.mode])

  useEffect(() => {
    const originalScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const persistCurrentScroll = () => {
      const current = readPortfolioRoute(window.history.state)
      const nextRoute = { mode: modeRef.current, scrollY: window.scrollY }
      if (current?.mode === nextRoute.mode && current.scrollY === nextRoute.scrollY) return
      window.history.replaceState(
        withPortfolioRoute(window.history.state, nextRoute),
        '',
        window.location.href,
      )
    }

    persistCurrentScroll()
    let animationFrame = 0
    const queueScrollPersistence = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0
        persistCurrentScroll()
      })
    }

    window.addEventListener('scroll', queueScrollPersistence, { passive: true })
    window.addEventListener('pagehide', persistCurrentScroll)
    return () => {
      window.history.scrollRestoration = originalScrollRestoration
      window.removeEventListener('scroll', queueScrollPersistence)
      window.removeEventListener('pagehide', persistCurrentScroll)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const mode = getPortfolioModeFromPathname(window.location.pathname)
      const storedRoute = readPortfolioRoute(event.state)
      const scrollY = storedRoute?.mode === mode ? storedRoute.scrollY : 0

      setRoute((current) => {
        const revision = current.revision + 1
        pendingRouteRef.current = {
          mode,
          scrollY,
          hash: window.location.hash,
          kind: 'popstate',
          revision,
        }
        modeRef.current = mode
        return { mode, revision }
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const pending = pendingRouteRef.current
    if (!pending || pending.revision !== route.revision) return undefined

    let animationFrame = 0
    let observer: MutationObserver | null = null
    const finishNavigation = () => {
      const page = document.querySelector<HTMLElement>(
        `[data-portfolio-page="${pending.mode}"]`,
      )
      if (!page) return false

      const hashTarget = pending.hash
        ? document.getElementById(decodeURIComponent(pending.hash.slice(1)))
        : null
      if (hashTarget) {
        hashTarget.scrollIntoView?.()
        if (hashTarget.id === 'main' || hashTarget.matches('h1, h2, h3, h4, h5, h6')) {
          hashTarget.tabIndex = -1
          hashTarget.focus({ preventScroll: true })
        }
      } else {
        window.scrollTo({ behavior: 'auto', left: 0, top: pending.scrollY })
      }

      if (pending.kind === 'switch') {
        const heading = page.querySelector<HTMLHeadingElement>('h1')
        if (!heading) return false
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
        setAnnouncement(announceMode(pending.mode, 'loaded'))
      } else {
        setAnnouncement(announceMode(pending.mode, 'restored'))
      }

      pendingRouteRef.current = null
      observer?.disconnect()
      return true
    }

    if (!finishNavigation()) {
      const main = document.getElementById('main')
      if (main) {
        observer = new MutationObserver(finishNavigation)
        observer.observe(main, { childList: true, subtree: true })
      }
      animationFrame = window.requestAnimationFrame(finishNavigation)
    }

    return () => {
      observer?.disconnect()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [route])

  const navigateMode = useCallback((mode: PortfolioMode) => {
    if (mode === modeRef.current) return

    window.history.replaceState(
      withPortfolioRoute(window.history.state, {
        mode: modeRef.current,
        scrollY: window.scrollY,
      }),
      '',
      window.location.href,
    )
    window.history.pushState(
      withPortfolioRoute({}, { mode, scrollY: 0 }),
      '',
      getPortfolio(mode).path,
    )

    setRoute((current) => {
      const revision = current.revision + 1
      pendingRouteRef.current = {
        mode,
        scrollY: 0,
        hash: '',
        kind: 'switch',
        revision,
      }
      modeRef.current = mode
      return { mode, revision }
    })
  }, [])

  return { mode: route.mode, navigateMode, announcement }
}
