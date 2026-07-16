import { useEffect, useRef, useState } from 'react'

export function useScrollSpy(hrefs: string[], mountedPageKey: string) {
  const [activeHref, setActiveHref] = useState(hrefs[0] ?? '')
  const [progress, setProgress] = useState(0)
  const activeHrefRef = useRef(activeHref)
  activeHrefRef.current = activeHref
  const hrefKey = hrefs.join('|')

  useEffect(() => {
    setActiveHref(hrefs[0] ?? '')
  }, [hrefKey, hrefs, mountedPageKey])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const validHrefs = new Set(hrefs)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]
        const href = visible?.target.id ? `#${visible.target.id}` : ''
        if (validHrefs.has(href) && href !== activeHrefRef.current) setActiveHref(href)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] },
    )
    let mountObserver: MutationObserver | null = null

    const observeMountedPage = () => {
      const page = document.querySelector(
        `[data-portfolio-page="${mountedPageKey}"]`,
      )
      if (!page) return false

      for (const href of hrefs) {
        const section = page.querySelector(href)
        if (section) observer.observe(section)
      }
      mountObserver?.disconnect()
      return true
    }

    if (!observeMountedPage()) {
      const main = document.getElementById('main')
      if (main) {
        mountObserver = new MutationObserver(observeMountedPage)
        mountObserver.observe(main, { childList: true, subtree: true })
      }
    }

    return () => {
      mountObserver?.disconnect()
      observer.disconnect()
    }
  }, [hrefKey, hrefs, mountedPageKey])

  useEffect(() => {
    let animationFrame = 0
    const updateProgress = () => {
      animationFrame = 0
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollableHeight > 0 ? Math.min(1, window.scrollY / scrollableHeight) : 0)
    }
    const queueUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress)
    }

    queueUpdate()
    window.addEventListener('resize', queueUpdate)
    window.addEventListener('scroll', queueUpdate, { passive: true })
    return () => {
      window.removeEventListener('resize', queueUpdate)
      window.removeEventListener('scroll', queueUpdate)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return { activeHref, progress }
}
