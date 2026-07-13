import { PortfolioCarousel } from '../components/media/PortfolioCarousel'
import { getMedia } from '../data/media'
import { visualPortfolio } from '../data/visual'
import { Contact } from '../sections/Contact'
import '../styles/visual-compatibility.css'

export function VisualCompatibilityPortfolio() {
  const aboutMedia = visualPortfolio.about.mediaIds.map(getMedia)

  return (
    <div
      className="visual-compatibility"
      data-presentation="visual-compatibility"
      data-visual-compatibility
    >
      <section aria-labelledby="visual-compatibility-title" className="visual-compatibility__hero" id="hero">
        <div className="visual-compatibility__hero-copy">
          <p className="visual-compatibility__kicker">{visualPortfolio.hero.eyebrow}</p>
          <h1 id="visual-compatibility-title">{visualPortfolio.hero.title}</h1>
          <p>{visualPortfolio.hero.summary}</p>
          <div aria-label="Visual portfolio actions" className="visual-compatibility__actions">
            <a href={visualPortfolio.hero.primaryCta.href}>
              {visualPortfolio.hero.primaryCta.label}
              <span aria-hidden="true"> ↘</span>
            </a>
            <a href={visualPortfolio.hero.secondaryCta.href}>
              {visualPortfolio.hero.secondaryCta.label}
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>

        <ol aria-label="Visual practice evidence" className="visual-compatibility__metrics">
          {visualPortfolio.metrics.map((metric) => (
            <li key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              <p>{metric.context}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="visual-about-title" className="visual-compatibility__section visual-compatibility__about" id="about">
        <div className="visual-compatibility__copy">
          <p className="visual-compatibility__kicker">About visual practice</p>
          <h2 id="visual-about-title">{visualPortfolio.about.heading}</h2>
          {visualPortfolio.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <PortfolioCarousel
          featured
          id="visual-compatibility-about-gallery"
          label="Visual profile and practice gallery"
          media={aboutMedia}
        />
      </section>

      <section
        aria-labelledby="visual-experience-title"
        className="visual-compatibility__section visual-compatibility__experience"
        data-testid="visual-experience"
        id="experience"
      >
        <header className="visual-compatibility__heading">
          <p className="visual-compatibility__kicker">Experience</p>
          <h2 id="visual-experience-title">Visual systems grounded in engineering practice.</h2>
        </header>
        <div className="visual-compatibility__chapters">
          {visualPortfolio.experience.map((story, index) => {
            const media = story.mediaIds.map(getMedia)
            return (
              <article
                className="visual-compatibility__chapter"
                data-direction={index % 2 === 0 ? 'copy-first' : 'media-first'}
                data-media-count={media.length}
                data-testid="visual-experience-chapter"
                key={story.id}
              >
                <div
                  className="visual-compatibility__chapter-copy"
                  data-media-count={media.length}
                  data-testid={`visual-experience-${story.id}`}
                >
                  <p className="visual-compatibility__kicker">{story.period}</p>
                  <h3>{story.title}</h3>
                  <p className="visual-compatibility__company">{story.company}</p>
                  <p>{story.summary}</p>
                  <dl>
                    <div>
                      <dt>Contribution</dt>
                      <dd>{story.contribution}</dd>
                    </div>
                    <div>
                      <dt>Outcome</dt>
                      <dd>{story.outcome}</dd>
                    </div>
                  </dl>
                  <ul aria-label={`${story.title} technologies`}>
                    {story.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                </div>
                <PortfolioCarousel
                  featured={index === 0}
                  id={`visual-compatibility-${story.id}-gallery`}
                  label={`${story.company} visual gallery`}
                  media={media}
                />
              </article>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="visual-work-title" className="visual-compatibility__section visual-compatibility__work" id="work">
        <header className="visual-compatibility__heading">
          <p className="visual-compatibility__kicker">Selected work</p>
          <h2 id="visual-work-title">Spatial systems made inspectable.</h2>
        </header>
        <div className="visual-compatibility__projects">
          {visualPortfolio.projects.map((project) => (
            <article data-testid="visual-project" id={`visual-project-${project.id}`} key={project.id}>
              <img
                alt={project.imageAlt}
                height={project.imageHeight}
                loading="lazy"
                src={project.image}
                width={project.imageWidth}
              />
              <div>
                <p className="visual-compatibility__kicker">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <dl>
                  <div>
                    <dt>Problem</dt>
                    <dd>{project.problem}</dd>
                  </div>
                  <div>
                    <dt>Outcome</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="visual-capabilities-title" className="visual-compatibility__section visual-compatibility__capabilities" id="capabilities">
        <header className="visual-compatibility__heading">
          <p className="visual-compatibility__kicker">Capabilities</p>
          <h2 id="visual-capabilities-title">From spatial research to tested delivery.</h2>
        </header>
        <div className="visual-compatibility__capability-list">
          {visualPortfolio.capabilities.map((capability) => (
            <article data-testid="visual-capability" key={capability.id}>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.summary}</p>
              </div>
              <ul aria-label={`${capability.title} tools`}>
                {capability.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ul aria-label={`${capability.title} proof`}>
                {capability.proofStoryIds.map((storyId) => (
                  <li key={storyId}>
                    <a href={`#visual-project-${storyId}`}>Proof: {storyId}</a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <Contact content={visualPortfolio.contact} />
    </div>
  )
}
