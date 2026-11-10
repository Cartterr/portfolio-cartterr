import { type CSSProperties, useEffect, useRef } from 'react'
import type { PortfolioImageMedia, PortfolioPage } from '../../data/types'
import { useLightbox } from '../fx/lightboxContext'
import { canAnimate, clamp } from '../lib/env'
import { SectionLabel } from './SectionLabel'

/** A statement whose words fill in as it is scrolled through. */
function ScrollFill({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(' ')

  useEffect(() => {
    const element = ref.current
    if (!element || !canAnimate()) return undefined
    let frame = 0

    const update = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight
      const progress = clamp((viewport * 0.86 - rect.top) / (rect.height + viewport * 0.36), 0, 1)
      element.style.setProperty('--p', progress.toFixed(4))
    }
    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    element.dataset.fill = 'on'
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      if (frame) window.cancelAnimationFrame(frame)
      delete element.dataset.fill
    }
  }, [])

  return (
    <p className="jc-fill" ref={ref}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} style={{ '--w': index / words.length } as CSSProperties}>
          {word}{' '}
        </span>
      ))}
    </p>
  )
}

type AboutProps = {
  content: PortfolioPage['about']
  media: PortfolioImageMedia[]
}

export function About({ content, media }: AboutProps) {
  const openLightbox = useLightbox()
  const stripRef = useRef<HTMLUListElement>(null)
  const [lead, ...rest] = content.paragraphs

  const scrollStrip = (direction: 1 | -1) => {
    const strip = stripRef.current
    if (!strip) return
    strip.scrollBy({ left: direction * strip.clientWidth * 0.7, behavior: 'smooth' })
  }

  return (
    <section
      aria-labelledby="software-about-title"
      className="jc-about jc-ink"
      data-section-index="01"
      data-testid="software-section"
      id="software-about"
    >
      <div className="jc-wrap">
        <SectionLabel index="01" label="About" />
        <h2 className="jc-about__title" data-reveal id="software-about-title">
          {content.heading}
        </h2>

        <ScrollFill text={lead} />

        <div className="jc-about__more">
          {rest.map((paragraph, index) => (
            <p data-reveal key={paragraph} style={{ '--rd': `${index * 90}ms` } as CSSProperties}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="jc-about__gallery" data-reveal>
        <div className="jc-wrap jc-about__gallery-head">
          <p className="jc-meta">People and places · {media.length} photos</p>
          <div className="jc-about__arrows">
            <button aria-label="Scroll photos back" onClick={() => scrollStrip(-1)} type="button">
              ←
            </button>
            <button aria-label="Scroll photos forward" onClick={() => scrollStrip(1)} type="button">
              →
            </button>
          </div>
        </div>
        <ul aria-label="Photos" className="jc-strip" ref={stripRef}>
          {media.map((item, index) => (
            <li key={item.id}>
              <button
                aria-label={`Open photo: ${item.alt}`}
                className="jc-shot"
                onClick={(event) =>
                  openLightbox(media, index, event.currentTarget.querySelector('img'))
                }
                type="button"
              >
                <img
                  alt={item.alt}
                  data-about-photo
                  decoding="async"
                  height={item.height}
                  loading="lazy"
                  src={item.src}
                  style={{
                    aspectRatio: `${item.width} / ${item.height}`,
                    objectPosition: item.objectPosition,
                  }}
                  width={item.width}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
