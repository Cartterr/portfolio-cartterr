import { PortfolioCarousel } from '../components/media/PortfolioCarousel'
import type { PortfolioMedia, PortfolioPage } from '../data/types'

type AboutProps = {
  content: PortfolioPage['about']
  id?: string
  media?: PortfolioMedia[]
}

export function About({ content, id = 'about', media }: AboutProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="software-section software-about"
      data-layout="asymmetric-about"
      data-section-boundary
      data-section-index="01"
      data-section-label="About"
      data-testid={id.startsWith('software-') ? 'software-section' : undefined}
      id={id}
    >
      <div className="software-about__media">
        {media ? (
          <PortfolioCarousel
            autoplayMs={7000}
            featured
            id="software-profile-gallery"
            label="Profile gallery"
            media={media}
          />
        ) : (
          <div className="software-about__compatibility-media">
            {content.images.map((image) => (
              <img
                alt={image.alt}
                height={image.height}
                key={image.src}
                loading="lazy"
                src={image.src}
                width={image.width}
              />
            ))}
          </div>
        )}
      </div>

      <div className="software-about__copy">
        <p className="software-kicker">About · 01</p>
        <h2 id={`${id}-title`}>{content.heading}</h2>
        <div className="software-about__paragraphs">
          {content.paragraphs.map((paragraph, index) => (
            <p className={index === 0 ? 'software-about__lead' : undefined} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="software-about__principles">
          <div>
            <dt>Build</dt>
            <dd>Maintainable product and platform systems.</dd>
          </div>
          <div>
            <dt>Investigate</dt>
            <dd>Research questions translated into repeatable infrastructure.</dd>
          </div>
          <div>
            <dt>Operate</dt>
            <dd>Deployment, monitoring, and maintenance in production environments.</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
