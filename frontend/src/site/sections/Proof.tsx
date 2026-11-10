import { type CSSProperties, useEffect, useRef } from 'react'
import type { PortfolioMetric } from '../../data/types'
import { Odometer } from '../fx/Odometer'
import { canAnimate, clamp, damp } from '../lib/env'

const organizations = [
  'TEK Chile',
  'DICTUC',
  'Pontificia Universidad Católica de Chile',
  'University of Notre Dame',
  'GridWorks',
  'Dily',
  'Flair',
  'Politiktok',
  'Escuela Militar de Chile',
]

/** Four measured outcomes; the digits roll in when the strip enters the viewport. */
export function Outcomes({ metrics }: { metrics: PortfolioMetric[] }) {
  return (
    <section aria-label="Selected outcomes" className="jc-outcomes" data-software-proof-rail>
      <ul className="jc-wrap jc-outcomes__grid">
        {metrics.map((metric, index) => (
          <li
            data-reveal
            data-testid="proof-metric"
            key={metric.label}
            style={{ '--rd': `${index * 90}ms` } as CSSProperties}
          >
            <p className="jc-outcomes__value">
              <Odometer value={metric.value} />
            </p>
            <p className="jc-outcomes__label">{metric.label}</p>
            <p className="jc-outcomes__context">{metric.context}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * A slow band of the places I have worked with. Scrolling speeds it up for a moment:
 * the CSS animation keeps running on the compositor and only its playback rate changes.
 */
export function Organizations() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || !canAnimate() || typeof track.getAnimations !== 'function') return undefined
    let frame = 0
    let last = 0
    let lastScroll = window.scrollY
    let rate = 1
    let target = 1

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
      last = now
      const scroll = window.scrollY
      const velocity = Math.abs(scroll - lastScroll) / Math.max(dt, 0.001)
      lastScroll = scroll
      target = 1 + clamp(velocity / 420, 0, 5)
      rate += (target - rate) * damp(dt, 6)
      track.getAnimations().forEach((animation) => {
        animation.playbackRate = rate
      })
      if (Math.abs(rate - 1) > 0.01 || velocity > 1) {
        frame = window.requestAnimationFrame(tick)
      } else {
        frame = 0
        last = 0
      }
    }

    const handleScroll = () => {
      if (!frame) {
        lastScroll = window.scrollY
        frame = window.requestAnimationFrame(tick)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section aria-label="Organizations I have worked with" className="jc-orgs">
      <ul className="sr-only">
        {organizations.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="jc-orgs__track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <div className="jc-orgs__group" key={copy}>
            {organizations.map((name) => (
              <span key={name}>
                {name}
                <i>✳</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
