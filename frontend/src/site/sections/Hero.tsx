import { type CSSProperties, Fragment, useEffect, useRef, useState } from 'react'
import heroPortrait from '../../assets/images/optimized/profile1-hero.webp'
import { getMedia } from '../../data/media'
import type { ExperienceStory, PortfolioImageMedia, PortfolioPage } from '../../data/types'
import { WaveField } from '../fx/WaveField'
import { canAnimate, hasFinePointer } from '../lib/env'
import { useMagnetic, useRefreshRate, useSantiagoTime } from '../lib/hooks'

const deck = [
  { id: 'profile1', place: 'KHIPU 2025', label: 'Latin American AI meeting' },
  { id: 'tek-roll-gripper', place: 'TEK Chile', label: 'Robot packing cell' },
  { id: 'dictuc-headsets-jenga', place: 'DICTUC XR Lab', label: 'Three-headset study' },
  { id: 'nd1', place: 'Notre Dame', label: 'Autonomous drone fieldwork' },
  { id: 'tek-rover-mixed-reality', place: 'TEK Chile', label: 'Mixed-reality rover control' },
  { id: 'geoscience1', place: 'PUC', label: 'Tectonic-plate simulation' },
].map((card) => {
  const media = getMedia(card.id)
  if (media.kind !== 'image') throw new Error(`Hero deck media must be an image: ${card.id}`)
  // The top card uses a tighter crop of the KHIPU photo so the face reads at card size.
  const image =
    card.id === 'profile1'
      ? { ...(media as PortfolioImageMedia), src: heroPortrait, width: 800, height: 1000, objectPosition: '50% 35%' }
      : (media as PortfolioImageMedia)
  return { ...card, media: image }
})

const DECK_INTERVAL_MS = 5200

function HeroDeck() {
  const [top, setTop] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animated, setAnimated] = useState(false)
  const figureRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setAnimated(canAnimate())
  }, [])

  useEffect(() => {
    if (!animated || paused) return undefined
    const timer = window.setTimeout(
      () => setTop((current) => (current + 1) % deck.length),
      DECK_INTERVAL_MS,
    )
    return () => window.clearTimeout(timer)
  }, [animated, paused, top])

  useEffect(() => {
    const figure = figureRef.current
    if (!figure || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPaused(true)
      else setPaused(false)
    })
    observer.observe(figure)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stack = stackRef.current
    if (!stack || !canAnimate() || !hasFinePointer()) return undefined
    const move = (event: PointerEvent) => {
      const rect = stack.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      stack.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
      stack.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
    }
    const leave = () => {
      stack.style.setProperty('--ry', '0deg')
      stack.style.setProperty('--rx', '0deg')
    }
    stack.addEventListener('pointermove', move)
    stack.addEventListener('pointerleave', leave)
    return () => {
      stack.removeEventListener('pointermove', move)
      stack.removeEventListener('pointerleave', leave)
    }
  }, [])

  const current = deck[top]

  return (
    <figure
      className="jc-deck"
      data-reveal
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      ref={figureRef}
      style={{ '--rd': '260ms' } as CSSProperties}
    >
      <button
        aria-label="Show the next photo"
        className="jc-deck__stack"
        onClick={() => setTop((value) => (value + 1) % deck.length)}
        ref={stackRef}
        type="button"
      >
        {deck.map(({ media }, index) => {
          const position = (index - top + deck.length) % deck.length
          return (
            <span
              className="jc-deck__card"
              data-position={position === deck.length - 1 ? 'last' : Math.min(position, 3)}
              key={media.id}
            >
              <img
                alt={position === 0 ? media.alt : ''}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : 'low'}
                height={media.height}
                loading={index < 2 ? 'eager' : 'lazy'}
                src={media.src}
                style={{ objectPosition: media.objectPosition }}
                width={media.width}
              />
            </span>
          )
        })}
      </button>
      <figcaption className="jc-deck__caption">
        <span className="jc-deck__count">
          {String(top + 1).padStart(2, '0')}
          <i aria-hidden="true">/</i>
          {String(deck.length).padStart(2, '0')}
        </span>
        <span className="jc-deck__text" key={current.id}>
          <b>{current.place}</b> {current.label}
        </span>
        <span aria-hidden="true" className="jc-deck__timer">
          <span
            data-running={animated && !paused ? 'true' : 'false'}
            key={`${top}-${paused ? 'p' : 'r'}`}
            style={{ '--deck-ms': `${DECK_INTERVAL_MS}ms` } as CSSProperties}
          />
        </span>
      </figcaption>
    </figure>
  )
}

type HeroProps = {
  content: PortfolioPage['hero']
  current: ExperienceStory[]
}

export function Hero({ content, current }: HeroProps) {
  const primaryRef = useMagnetic<HTMLAnchorElement>()
  const secondaryRef = useMagnetic<HTMLAnchorElement>()
  const refreshRate = useRefreshRate()
  const time = useSantiagoTime()
  const words = content.title.split(' ')

  return (
    <section
      aria-labelledby="software-hero-title"
      className="jc-hero"
      data-testid="software-section"
      id="software-home"
    >
      <WaveField className="jc-hero__field" />

      <div className="jc-wrap jc-hero__grid">
        <div className="jc-hero__copy">
          <p className="jc-meta jc-hero__eyebrow" data-reveal>
            <span aria-hidden="true" className="jc-pulse" />
            {content.eyebrow}
          </p>

          <h1 className="jc-display jc-words" data-reveal id="software-hero-title">
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span className="jc-word">
                  <span
                    className={word === 'reliable' ? 'jc-word__in jc-serif' : 'jc-word__in'}
                    style={{ '--i': index } as CSSProperties}
                  >
                    {word}
                  </span>
                </span>{' '}
              </Fragment>
            ))}
          </h1>

          <p className="jc-hero__summary" data-reveal style={{ '--rd': '320ms' } as CSSProperties}>
            {content.summary}
          </p>

          <div
            aria-label="Software portfolio actions"
            className="jc-hero__actions"
            data-reveal
            role="group"
            style={{ '--rd': '400ms' } as CSSProperties}
          >
            <a className="jc-btn jc-btn--ink" href={content.primaryCta.href} ref={primaryRef}>
              <span>{content.primaryCta.label}</span>
              <span aria-hidden="true" className="jc-btn__icon">
                ↓
              </span>
            </a>
            <a className="jc-btn jc-btn--line" href={content.secondaryCta.href} ref={secondaryRef}>
              <span>{content.secondaryCta.label}</span>
              <span aria-hidden="true" className="jc-btn__icon">
                ↗
              </span>
            </a>
          </div>

          <dl className="jc-now" data-reveal style={{ '--rd': '480ms' } as CSSProperties}>
            <dt className="jc-meta">Now</dt>
            {current.map((role) => (
              <dd key={role.id}>
                <b>{role.company.split(',')[0]}</b>
                <span>{role.title}</span>
              </dd>
            ))}
          </dl>
        </div>

        <HeroDeck />
      </div>

      <div className="jc-wrap jc-hero__foot" data-reveal style={{ '--rd': '560ms' } as CSSProperties}>
        <p className="jc-meta">{content.name}</p>
        <p className="jc-meta">
          {content.location} · <span className="jc-tabular">{time}</span>
        </p>
        <p className="jc-meta jc-hero__hz" data-ready={refreshRate ? 'true' : 'false'}>
          Rendering at <span className="jc-tabular">{refreshRate ?? '—'}</span> Hz
        </p>
        <p aria-hidden="true" className="jc-meta jc-hero__scroll">
          Scroll <span>↓</span>
        </p>
      </div>
    </section>
  )
}
