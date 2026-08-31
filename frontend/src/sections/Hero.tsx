import { useEffect, useState } from 'react'
import { getMedia } from '../data/media'
import type { PortfolioImageMedia, PortfolioPage } from '../data/types'

const heroMediaSlides = [
  { id: 'nd1', project: 'Drone Response', label: 'Autonomous fieldwork' },
  { id: 'geoscience7', project: 'CUDA geoscience', label: 'Scientific simulation' },
  { id: 'gridworks-dashboard-operations', project: 'GridWorks', label: 'Production monitoring' },
].map((definition) => {
  const media = getMedia(definition.id)
  if (media.kind !== 'image') throw new Error(`Hero media must be an image: ${definition.id}`)

  return { ...definition, media } satisfies {
    id: string
    project: string
    label: string
    media: PortfolioImageMedia
  }
})

type HeroProps = {
  content: PortfolioPage['hero']
  id?: string
}

export function Hero({ content, id }: HeroProps) {
  const secondaryIsDownload = /\.pdf(?:$|[?#])/i.test(content.secondaryCta.href)
  const [activeSlide, setActiveSlide] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleMotionPreference)
    return () => mediaQuery.removeEventListener('change', handleMotionPreference)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveSlide(0)
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroMediaSlides.length)
    }, 7200)

    return () => window.clearInterval(timer)
  }, [prefersReducedMotion])

  return (
    <section
      aria-labelledby="software-hero-title"
      className="software-hero"
      data-testid={id ? 'software-section' : undefined}
      id={id}
    >
      <div className="software-hero__inner">
        <div className="software-hero__signal">
          <p className="software-kicker">Santiago, Chile · Software engineering and applied research</p>
          <span className="software-hero__signal-line" aria-hidden="true" />
          <p>Production software · research infrastructure · autonomous planning</p>
        </div>

        <div className="software-hero__copy">
          <p className="software-hero__name">{content.name}</p>
          <h1 id="software-hero-title">{content.title}</h1>
          <p className="software-hero__summary">{content.summary}</p>
          <div aria-label="Software portfolio actions" className="software-hero__actions" role="group">
            <a className="software-button software-button--primary" href={content.primaryCta.href}>
              <span>{content.primaryCta.label}</span>
              <span aria-hidden="true">↘</span>
            </a>
            <a
              className="software-button software-button--secondary"
              download={secondaryIsDownload || undefined}
              href={content.secondaryCta.href}
            >
              <span>{content.secondaryCta.label}</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <figure className="software-hero__media">
          <div aria-hidden="true" className="software-hero__media-frame">
            {heroMediaSlides.map(({ media }, index) => (
              <img
                alt=""
                className={index === activeSlide ? 'is-active' : undefined}
                data-hero-media={media.id}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : 'low'}
                key={media.id}
                loading={index === 0 ? 'eager' : 'lazy'}
                src={media.src}
                style={{ objectPosition: media.objectPosition }}
              />
            ))}
          </div>
          <figcaption className="software-hero__media-meta">
            {heroMediaSlides[activeSlide].project} · {heroMediaSlides[activeSlide].label}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
