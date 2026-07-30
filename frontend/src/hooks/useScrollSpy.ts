import { useEffect, useState } from 'react'

export function useScrollSpy(hrefs: string[], mountedPageKey: string) {
  const [activeHref, setActiveHref] = useState(hrefs[0] ?? '')
  const [progress, setProgress] = useState(0)
  const hrefKey = hrefs.join('|')

  useEffect(() => {
    setActiveHref(hrefs[0] ?? '')
  }, [hrefKey, hrefs, mountedPageKey])

  useEffect(() => {
    let sections: Array<{ element: HTMLElement; href: string }> = []
    let mountObserver: MutationObserver | null = null
    let animationFrame = 0

    const measurePage = () => {
      animationFrame = 0

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollableHeight > 0 ? Math.min(1, window.scrollY / scrollableHeight) : 0)

      if (!sections.length) return

      const readingLine = Math.min(Math.max(window.innerHeight * 0.28, 104), 280)
      let nextHref = sections[0]?.href ?? ''

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top > readingLine) break
        nextHref = section.href
      }

      const reachedDocumentEnd =
        scrollableHeight > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (reachedDocumentEnd) nextHref = sections.at(-1)?.href ?? nextHref

      setActiveHref((currentHref) => (currentHref === nextHref ? currentHref : nextHref))
    }

    const queueMeasurement = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(measurePage)
    }

    const observeMountedPage = () => {
      const page = document.querySelector<HTMLElement>(
        `[data-portfolio-page="${mountedPageKey}"]`,
      )
      if (!page) return false

      sections = hrefs.flatMap((href) => {
        const element = page.querySelector<HTMLElement>(href)
        return element ? [{ element, href }] : []
      })
      mountObserver?.disconnect()
      queueMeasurement()
      return true
    }

    if (!observeMountedPage()) {
      const main = document.getElementById('main')
      if (main) {
        mountObserver = new MutationObserver(observeMountedPage)
        mountObserver.observe(main, { childList: true, subtree: true })
      }
    }

    window.addEventListener('resize', queueMeasurement)
    window.addEventListener('scroll', queueMeasurement, { passive: true })

    return () => {
      mountObserver?.disconnect()
      window.removeEventListener('resize', queueMeasurement)
      window.removeEventListener('scroll', queueMeasurement)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [hrefKey, hrefs, mountedPageKey])

  return { activeHref, progress }
}
