import heroBackdrop from '../assets/images/optimized/geoscience7-main.webp'
import type { PortfolioPage } from '../data/types'

type HeroProps = {
  content: PortfolioPage['hero']
  id?: string
}

export function Hero({ content, id }: HeroProps) {
  const secondaryIsDownload = /\.pdf(?:$|[?#])/i.test(content.secondaryCta.href)

  return (
    <section
      aria-labelledby="software-hero-title"
      className="software-hero"
      data-testid={id ? 'software-section' : undefined}
      id={id}
    >
      <div aria-hidden="true" className="software-hero__backdrop">
        <img alt="" decoding="async" fetchPriority="high" src={heroBackdrop} />
      </div>
      <div className="software-hero__inner">
        <div className="software-hero__signal">
          <p className="software-kicker">Santiago, Chile · Systems under real constraints</p>
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

        <aside className="software-hero__note" aria-label="Current engineering direction">
          <p className="software-kicker">Current direction</p>
          <p>Applying AI to satellite data, scientific simulation, and aerospace systems.</p>
        </aside>
      </div>
    </section>
  )
}
