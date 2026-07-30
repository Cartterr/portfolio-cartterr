import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { PortfolioCarousel } from '../components/media/PortfolioCarousel'
import { getMedia } from '../data/media'
import { visualPortfolio } from '../data/visual'
import {
  requestGraphicsFallback,
} from '../hooks/useGraphicsCapability'
import { Contact } from '../sections/Contact'
import { VisualHeroPoster } from '../visual/VisualHeroPoster'
import '../styles/visual.css'

const visualHeroTitleLines = [
  'Production technology, ',
  'technical tools, and ',
  'simulation systems.',
] as const

type VisualHeroErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
}

type VisualHeroErrorBoundaryState = {
  failed: boolean
}

export class VisualHeroErrorBoundary extends Component<
  VisualHeroErrorBoundaryProps,
  VisualHeroErrorBoundaryState
> {
  state = { failed: false }

  static getDerivedStateFromError(): VisualHeroErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    requestGraphicsFallback('poster')
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function VisualHeroStage() {
  return (
    <div className="visual-hero-stage" data-graphics-capability="poster">
      <VisualHeroPoster capability="poster" />
      <p className="visual-hero-stage__mode" aria-hidden="true">
        Authentic project render
      </p>
      <div className="visual-hero-stage__legend" aria-hidden="true">
        <span>Scientific visualization · 01</span>
        <strong>Marga-Marga geoscience study</strong>
        <span>Python · CUDA · Tectosaur</span>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section aria-labelledby="visual-title" className="visual-hero" id="hero">
      <div className="visual-hero__copy">
        <p className="visual-kicker">{visualPortfolio.hero.eyebrow}</p>
        <h1 aria-label={visualPortfolio.hero.title} id="visual-title">
          {visualHeroTitleLines.map((line, index) => (
            <span
              aria-hidden="true"
              className={
                index === visualHeroTitleLines.length - 1
                  ? 'visual-hero__title-line visual-hero__title-line--accent'
                  : 'visual-hero__title-line'
              }
              key={line}
            >
              {line}
            </span>
          ))}
        </h1>
        <p className="visual-hero__summary">{visualPortfolio.hero.summary}</p>
        <div aria-label="Visual portfolio actions" className="visual-actions" role="group">
          <a className="visual-actions__primary" href={visualPortfolio.hero.primaryCta.href}>
            {visualPortfolio.hero.primaryCta.label}
            <span aria-hidden="true">↘</span>
          </a>
          <a className="visual-actions__secondary" href={visualPortfolio.hero.secondaryCta.href}>
            {visualPortfolio.hero.secondaryCta.label}
            <span aria-hidden="true">→</span>
          </a>
          <div className="visual-actions__links">
            <a
              href="https://linkedin.com/in/jose-carter-arriagada"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#contact">
              Contact
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <VisualHeroStage />

      <ul aria-label="Career credibility" className="visual-credibility-strip">
        <li>
          <a href="#experience">Software Engineer at Dily</a>
        </li>
        <li>
          <a href="#recognition">ACM SIGGRAPH 2026 Student Volunteer</a>
        </li>
        <li>
          <a href="#education">PUC Computer Science Engineering — Graduated with Distinction</a>
        </li>
        <li>
          <a
            href="https://link.springer.com/article/10.1007/s42438-026-00638-4"
            rel="noreferrer"
            target="_blank"
          >
            Springer Co-author
          </a>
        </li>
      </ul>

      <ol aria-label="Visual practice evidence" className="visual-proof-rail">
        {visualPortfolio.metrics.map((metric, index) => (
          <li key={metric.label}>
            <span className="visual-proof-rail__index" aria-hidden="true">
              0{index + 1}
            </span>
            <strong>{metric.value}</strong>
            <h2>{metric.label}</h2>
            <p>{metric.context}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Profile() {
  const profileMedia = visualPortfolio.about.mediaIds.map(getMedia)

  return (
    <section
      aria-labelledby="visual-profile-title"
      className="visual-section visual-profile"
      data-section-boundary
      data-section-index="01"
      data-section-label="Profile"
      id="about"
    >
      <div className="visual-profile__copy">
        <p className="visual-kicker">Profile / creative technology</p>
        <h2 id="visual-profile-title">Visual profile: computation with a sense of place.</h2>
        {visualPortfolio.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="visual-profile__scope">
          Interactive product visualization · technical 3D prototypes · simulation visuals ·
          graphics programming · spatial interfaces · pipeline tooling
        </p>
      </div>
      <div className="visual-profile__media">
        <PortfolioCarousel
          autoplayMs={8000}
          featured
          id="visual-profile-gallery"
          label="Visual profile field and practice gallery"
          media={profileMedia}
        />
      </div>
    </section>
  )
}

const recognitionCards = [
  ['ACM SIGGRAPH 2026', 'Student Volunteer', '#hero'],
  [
    'Springer — 2026',
    'Peer-reviewed co-author',
    'https://link.springer.com/article/10.1007/s42438-026-00638-4',
  ],
  ['SSA Annual Meeting — 2023', 'Geoscience research contribution', '#visual-project-geoscience-simulation'],
  ['Space Generation Advisory Council — 2026', 'South American Space Generation Workshop Delegate', '#recognition'],
  ['DCC UC — 2025', 'Senior Teaching Assistant Recognition', '#experience'],
  ['KHIPU AI — 2025', 'Latin American AI Meeting', '#recognition'],
] as const

function Experience() {
  return (
    <section
      aria-labelledby="visual-experience-title"
      className="visual-section visual-laboratories"
      data-section-boundary
      data-section-index="02"
      data-section-label="Experience"
      id="experience"
    >
      <header className="visual-section-heading visual-section-heading--split">
        <div>
          <p className="visual-kicker">Experience / production and research</p>
          <h2 id="visual-experience-title">Experience building reliable technical systems.</h2>
        </div>
        <p>
          Production software, research platforms, simulation, autonomous systems, and technical
          instruction—grounded in shipped work and documented outcomes.
        </p>
      </header>

      <ol className="visual-lab-list">
        {visualPortfolio.experience.map((laboratory, index) => (
          <li key={laboratory.id}>
            <article data-testid={`visual-laboratory-${laboratory.id}`}>
              <div className="visual-lab-list__meta">
                <span aria-hidden="true">L{String(index + 1).padStart(2, '0')}</span>
                <p>{laboratory.period}</p>
              </div>
              <div className="visual-lab-list__title">
                <h3>{laboratory.title}</h3>
                <p>{laboratory.company}</p>
              </div>
              <div className="visual-lab-list__body">
                <p>{laboratory.summary}</p>
                <ul className="visual-experience-points">
                  <li>{laboratory.contribution}</li>
                  <li>{laboratory.outcome}</li>
                </ul>
                <ul aria-label={`${laboratory.title} tools`}>
                  {laboratory.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <section aria-labelledby="visual-education-title" className="visual-education" id="education">
        <p className="visual-kicker">Education</p>
        <h2 id="visual-education-title">Education</h2>
        <article>
          <h3>Pontificia Universidad Católica de Chile</h3>
          <p>Computer Science Engineering</p>
          <p>Major in Software Engineering · Minor in Data Science</p>
          <p>Graduated with Distinction · 2020–2025</p>
        </article>
      </section>

      <section
        aria-labelledby="visual-recognition-title"
        className="visual-recognition"
        id="recognition"
      >
        <p className="visual-kicker">Research & recognition</p>
        <h2 id="visual-recognition-title">Research & Recognition</h2>
        <ul>
          {recognitionCards.map(([title, detail, href]) => (
            <li key={title}>
              <a
                href={href}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                target={href.startsWith('http') ? '_blank' : undefined}
              >
                <strong>{title}</strong>
                <span>{detail}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

function SelectedWork() {
  return (
    <section
      aria-labelledby="visual-work-title"
      className="visual-section visual-work"
      data-section-boundary
      data-section-index="03"
      data-section-label="Selected work"
      id="work"
    >
      <header className="visual-section-heading">
        <p className="visual-kicker">Selected visual work / cleared evidence</p>
        <h2 id="visual-work-title">Selected visual work, one system at a time.</h2>
      </header>

      <div className="visual-story-list">
        {visualPortfolio.projects.map((project, index) => {
          const projectMedia = project.mediaIds.map(getMedia)
          return (
            <article
              className="visual-story"
              data-direction={index % 2 === 0 ? 'copy-first' : 'media-first'}
              data-testid="visual-project-story"
              id={`visual-project-${project.id}`}
              key={project.id}
            >
              <div className="visual-story__copy">
                <p className="visual-kicker">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p className="visual-story__meta">
                  {project.role} · {project.period} · {project.status}
                </p>
                <p className="visual-story__summary">{project.summary}</p>
                <dl>
                  <div>
                    <dt>Problem</dt>
                    <dd>{project.problem}</dd>
                  </div>
                  <div>
                    <dt>What I built</dt>
                    <dd>{project.summary}</dd>
                  </div>
                  <div>
                    <dt>Technical challenge</dt>
                    <dd>{project.technicalChallenge ?? project.problem}</dd>
                  </div>
                  <div>
                    <dt>My contribution</dt>
                    <dd>{project.contribution}</dd>
                  </div>
                  <div>
                    <dt>Result</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                </dl>
                <ul aria-label={`${project.title} tools`} className="visual-tool-list">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                {project.link ? (
                  <a
                    className="visual-story__link"
                    href={project.link.href}
                    rel={project.link.external ? 'noreferrer' : undefined}
                    target={project.link.external ? '_blank' : undefined}
                  >
                    {project.link.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                ) : null}
              </div>
              <div className="visual-story__media">
                <PortfolioCarousel
                  autoplayMs={index === 0 ? 9000 : undefined}
                  featured={index === 0}
                  id={`visual-${project.id}-gallery`}
                  label={`${project.title} project evidence`}
                  media={projectMedia}
                />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Pipeline() {
  return (
    <section
      aria-labelledby="visual-pipeline-title"
      className="visual-section visual-pipeline"
      data-section-boundary
      data-section-index="04"
      data-section-label="Capabilities"
      id="capabilities"
    >
      <header className="visual-section-heading visual-section-heading--split">
        <div>
          <p className="visual-kicker">Pipeline / capabilities</p>
          <h2 id="visual-pipeline-title">A visual pipeline from reference to tested delivery.</h2>
        </div>
        <p>
          The tools change with the problem. The through-line is spatial reasoning, inspectable
          geometry, bounded computation, and proof in the final context.
        </p>
      </header>

      <ol className="visual-pipeline__steps">
        {visualPortfolio.capabilities.map((capability, index) => (
          <li key={capability.id}>
            <article>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{capability.title}</h3>
              <p>{capability.summary}</p>
              <ul aria-label={`${capability.title} methods`}>
                {capability.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ul aria-label={`${capability.title} project proof`} className="visual-pipeline__proof">
                {capability.proofStoryIds.map((storyId) => (
                  <li key={storyId}>
                    <a href={`#visual-project-${storyId}`}>Proof / {storyId.split('-').join(' ')}</a>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function VisualPortfolio() {
  return (
    <div className="visual-portfolio" data-presentation="visual-computing" data-visual-portfolio>
      <Hero />
      <Profile />
      <Experience />
      <SelectedWork />
      <Pipeline />
      <Contact content={visualPortfolio.contact} portfolioMode="visual" />
    </div>
  )
}
