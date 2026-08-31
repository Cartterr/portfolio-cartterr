import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getPortfolio, type PortfolioMode } from '../data/portfolio'
import { forceScrollTo } from './forceScroll'

type PortfolioRouteHistory = {
  mode: PortfolioMode
  scrollY: number
}

type PendingRoute = PortfolioRouteHistory & {
  hash: string
  kind: 'hash' | 'initial' | 'popstate' | 'switch'
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

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

const portfolioStructuredData = (mode: PortfolioMode) => {
  const professionalIdentity = {
    '@type': 'Person',
    '@id': 'https://josecarter.dev/#person',
    name: 'José Carter Arriagada',
    url: 'https://josecarter.dev/',
    jobTitle: 'Software Engineer',
    description:
      'Software engineer building production tools, simulation systems, workflow automation, real-time 3D applications, and data-intensive platforms.',
    image: { '@type': 'ImageObject', url: 'https://josecarter.dev/favicon.webp' },
    worksFor: {
      '@type': 'Organization',
      name: 'Dily',
      url: 'https://www.linkedin.com/company/11311817/',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Pontificia Universidad Católica de Chile',
      url: 'https://www.uc.cl/',
    },
    homeLocation: { '@type': 'Place', name: 'Santiago, Chile' },
    publishingPrinciples:
      'https://link.springer.com/article/10.1007/s42438-026-00638-4',
    sameAs: [
      'https://github.com/Cartterr',
      'https://linkedin.com/in/jose-carter-arriagada',
    ],
  }

  if (mode === 'visual') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': 'https://josecarter.dev/visual#profile',
          url: 'https://josecarter.dev/visual',
          name: 'José Carter — Production Technology, Tools & Simulation',
          description:
            'Software engineering across production tooling, simulation, real-time 3D, distributed systems, and scientific visualization.',
          mainEntity: { '@id': 'https://josecarter.dev/#person' },
        },
        professionalIdentity,
      ],
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://josecarter.dev/#website',
        url: 'https://josecarter.dev/',
        name: 'José Carter',
        inLanguage: 'en',
      },
      {
        '@type': 'ProfilePage',
        '@id': 'https://josecarter.dev/#profile',
        url: 'https://josecarter.dev/',
        name: 'José Carter — Software Engineer Portfolio',
        isPartOf: { '@id': 'https://josecarter.dev/#website' },
        mainEntity: { '@id': 'https://josecarter.dev/#person' },
        primaryImageOfPage: { '@id': 'https://josecarter.dev/#profile-image' },
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': 'https://josecarter.dev/#person',
        name: 'José Carter Arriagada',
        url: 'https://josecarter.dev/',
        jobTitle: 'Software Engineer',
        description:
          'Software engineer building production tools, simulation systems, workflow automation, real-time 3D applications, and data-intensive platforms.',
        image: {
          '@type': 'ImageObject',
          '@id': 'https://josecarter.dev/#profile-image',
          url: 'https://josecarter.dev/favicon.webp',
          width: 160,
          height: 160,
        },
        homeLocation: { '@type': 'Place', name: 'Santiago, Chile' },
        worksFor: professionalIdentity.worksFor,
        alumniOf: professionalIdentity.alumniOf,
        publishingPrinciples: professionalIdentity.publishingPrinciples,
        sameAs: [
          'https://github.com/Cartterr',
          'https://linkedin.com/in/jose-carter-arriagada',
        ],
      },
    ],
  }
}

export const applyPortfolioIdentity = (mode: PortfolioMode) => {
  const page = getPortfolio(mode)
  document.documentElement.dataset.portfolioMode = mode
  document.title = page.meta.title
  upsertMeta('name', 'description', page.meta.description)
  upsertMeta('name', 'theme-color', page.meta.themeColor)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:locale', 'en_US')
  upsertMeta('property', 'og:site_name', 'José Carter')
  upsertMeta('property', 'og:title', page.meta.socialTitle)
  upsertMeta('property', 'og:description', page.meta.socialDescription)
  upsertMeta('property', 'og:url', page.meta.canonical)
  upsertMeta('property', 'og:image', page.meta.socialImage)
  upsertMeta('property', 'og:image:secure_url', page.meta.socialImage)
  upsertMeta('property', 'og:image:type', 'image/png')
  upsertMeta('property', 'og:image:width', '1200')
  upsertMeta('property', 'og:image:height', '630')
  upsertMeta('property', 'og:image:alt', page.meta.socialImageAlt)
  upsertMeta('name', 'twitter:card', page.meta.twitterCard)
  upsertMeta('name', 'twitter:title', page.meta.socialTitle)
  upsertMeta('name', 'twitter:description', page.meta.socialDescription)
  upsertMeta('name', 'twitter:image', page.meta.socialImage)
  upsertMeta('name', 'twitter:image:alt', page.meta.socialImageAlt)

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = page.meta.canonical

  let structuredData = document.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"]',
  )
  if (!structuredData) {
    structuredData = document.createElement('script')
    structuredData.type = 'application/ld+json'
    document.head.append(structuredData)
  }
  structuredData.textContent = JSON.stringify(portfolioStructuredData(mode))
}

const decodeHashId = (hash: string) => {
  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return null
  }
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
  const pendingRouteRef = useRef<PendingRoute | null>(
    window.location.hash
      ? {
          mode: route.mode,
          scrollY: 0,
          hash: window.location.hash,
          kind: 'initial',
          revision: route.revision,
        }
      : null,
  )

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
    const handleHashChange = () => {
      if (!window.location.hash) return
      setRoute((current) => {
        const revision = current.revision + 1
        pendingRouteRef.current = {
          mode: current.mode,
          scrollY: window.scrollY,
          hash: window.location.hash,
          kind: 'hash',
          revision,
        }
        return { ...current, revision }
      })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const pending = pendingRouteRef.current
    if (!pending || pending.revision !== route.revision) return undefined

    let animationFrame = 0
    let stabilizationFrame = 0
    let stabilizationTimeouts: number[] = []
    let observer: MutationObserver | null = null
    const finishNavigation = () => {
      const page = document.querySelector<HTMLElement>(
        `[data-portfolio-page="${pending.mode}"]`,
      )
      if (!page) return false

      const hashTarget = pending.hash
        ? document.getElementById(decodeHashId(pending.hash) ?? '')
        : null
      if (hashTarget) {
        hashTarget.scrollIntoView?.()
        stabilizationFrame = window.requestAnimationFrame(() => {
          hashTarget.scrollIntoView?.()
          stabilizationFrame = window.requestAnimationFrame(() => hashTarget.scrollIntoView?.())
        })
        stabilizationTimeouts = [120, 320].map((delay) =>
          window.setTimeout(() => hashTarget.scrollIntoView?.(), delay),
        )
        const focusTarget =
          hashTarget.id === 'main' || hashTarget.matches('h1, h2, h3, h4, h5, h6')
            ? hashTarget
            : hashTarget.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6')
        if (focusTarget) {
          focusTarget.tabIndex = -1
          focusTarget.focus({ preventScroll: true })
        }
      } else {
        forceScrollTo(pending.scrollY)
      }

      if (pending.kind === 'switch') {
        const heading = page.querySelector<HTMLHeadingElement>('h1')
        if (!heading) return false
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
      }
      setAnnouncement(
        announceMode(pending.mode, pending.kind === 'popstate' ? 'restored' : 'loaded'),
      )

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
      if (stabilizationFrame) window.cancelAnimationFrame(stabilizationFrame)
      stabilizationTimeouts.forEach((timeout) => window.clearTimeout(timeout))
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
