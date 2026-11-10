import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { canAnimate, hasFinePointer, isTestRun } from './env'

const commonRates = [60, 72, 75, 90, 100, 120, 144, 165, 180, 240, 360]

const snapRate = (rate: number) => {
  const nearest = commonRates.reduce((best, candidate) =>
    Math.abs(candidate - rate) < Math.abs(best - rate) ? candidate : best,
  )
  return Math.abs(nearest - rate) / nearest < 0.07 ? nearest : Math.round(rate)
}

// The page measures the display once and every reader shares the answer.
let measuredRate: number | null = null
let measuring = false
const rateListeners = new Set<() => void>()

const measureRefreshRate = () => {
  if (measuring || measuredRate !== null || isTestRun || typeof window === 'undefined') return
  measuring = true
  let last = 0
  const deltas: number[] = []

  const tick = (time: number) => {
    if (last) {
      const delta = time - last
      if (delta > 1 && delta < 60) deltas.push(delta)
    }
    last = time
    if (deltas.length < 90) {
      window.requestAnimationFrame(tick)
      return
    }
    // A busy frame can arrive late but never early, so the lower quartile of the
    // frame spacing is the display's own interval.
    deltas.sort((a, b) => a - b)
    measuredRate = snapRate(1000 / deltas[Math.floor(deltas.length * 0.25)])
    measuring = false
    rateListeners.forEach((listener) => listener())
  }

  window.requestAnimationFrame(tick)
}

const subscribeToRate = (listener: () => void) => {
  rateListeners.add(listener)
  measureRefreshRate()
  return () => {
    rateListeners.delete(listener)
  }
}

/** The display's refresh rate in Hz, measured from the spacing of animation frames. */
export function useRefreshRate() {
  return useSyncExternalStore(
    subscribeToRate,
    () => measuredRate,
    () => null,
  )
}

const santiagoClock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Santiago',
})

/** Current wall-clock time in Santiago, refreshed while the page is open. */
export function useSantiagoTime() {
  const [time, setTime] = useState(() => santiagoClock.format(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(santiagoClock.format(new Date())), 15_000)
    return () => window.clearInterval(timer)
  }, [])

  return time
}

/**
 * Turns on entrance animations: `[data-reveal]` elements start hidden only once
 * this has run, so the page stays readable without JavaScript or with reduced motion.
 */
export function useReveal() {
  useLayoutEffect(() => {
    if (!canAnimate() || typeof IntersectionObserver === 'undefined') return undefined
    const root = document.documentElement
    root.classList.add('jc-anim')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
    )

    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      root.classList.remove('jc-anim')
    }
  }, [])
}

/** Pulls an element a little toward the pointer while it hovers; springs back on leave. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !canAnimate() || !hasFinePointer()) return undefined
    let rect: DOMRect | null = null

    const enter = () => {
      element.style.setProperty('--mx', '0px')
      element.style.setProperty('--my', '0px')
      rect = element.getBoundingClientRect()
      element.dataset.magnet = 'on'
    }
    const move = (event: PointerEvent) => {
      if (!rect) return
      const x = (event.clientX - (rect.left + rect.width / 2)) * strength
      const y = (event.clientY - (rect.top + rect.height / 2)) * strength
      element.style.setProperty('--mx', `${x.toFixed(2)}px`)
      element.style.setProperty('--my', `${y.toFixed(2)}px`)
    }
    const leave = () => {
      rect = null
      delete element.dataset.magnet
      element.style.setProperty('--mx', '0px')
      element.style.setProperty('--my', '0px')
    }

    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return ref
}
