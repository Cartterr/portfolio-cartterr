import { ArrowLink } from '../components/ui/ArrowLink'
import type { CaseStudy, PortfolioContent } from '../data/portfolio'

type HeroProps = {
  content: PortfolioContent['hero']
  image: Pick<CaseStudy, 'image' | 'imageAlt' | 'imageWidth' | 'imageHeight'>
}

const highPriorityImage = { fetchpriority: 'high' }

export function Hero({ content, image }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            {content.name} <span aria-hidden="true">·</span> {content.location}
          </p>
          <h1 id="hero-title">{content.title}</h1>
          <p className="hero__summary">{content.summary}</p>
          <div className="hero__actions">
            <ArrowLink className="button-link button-link--primary" {...content.primaryCta} />
            <a className="button-link button-link--secondary" download href={content.secondaryCta.href}>
              <span>{content.secondaryCta.label}</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <figure className="hero__media">
          <img
            {...highPriorityImage}
            alt={image.imageAlt}
            decoding="sync"
            height={image.imageHeight}
            loading="eager"
            src={image.image}
            width={image.imageWidth}
          />
          <figcaption>Autonomous aircraft prepared for an emergency-response field test.</figcaption>
        </figure>
      </div>
    </section>
  )
}
