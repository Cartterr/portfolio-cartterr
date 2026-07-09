import type { PortfolioContent } from '../data/portfolio'

type AboutProps = {
  content: PortfolioContent['about']
}

function About({ content }: AboutProps) {
  return (
    <section aria-labelledby="about-title" className="section about" id="about">
      <div className="about__copy">
        <p className="eyebrow">About</p>
        <h2 id="about-title">{content.heading}</h2>
        {content.paragraphs.slice(0, 2).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="about__media">
        {content.images.map((image) => (
          <figure key={image.src}>
            <img
              alt={image.alt}
              decoding="async"
              height={image.height}
              loading="lazy"
              src={image.src}
              width={image.width}
            />
            <figcaption>{image.alt}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default About
