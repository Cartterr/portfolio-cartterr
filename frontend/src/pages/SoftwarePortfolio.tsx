import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Experience } from '../sections/Experience'
import { FeaturedWork } from '../sections/FeaturedWork'
import { Capabilities } from '../sections/Capabilities'
import { Contact } from '../sections/Contact'
import { legacyMedia } from '../data/media'
import { softwarePortfolio } from '../data/software'
import '../styles/software.css'

function ProofRail() {
  return (
    <section
      aria-label="Selected outcomes"
      className="software-proof-rail"
      data-software-proof-rail
    >
      <div className="software-proof-rail__inner">
        {softwarePortfolio.metrics.map((metric, index) => (
          <article data-testid="proof-metric" key={metric.label}>
            <p className="software-proof-rail__index" aria-hidden="true">
              P{String(index + 1).padStart(2, '0')}
            </p>
            <strong>{metric.value}</strong>
            <h2>{metric.label}</h2>
            <p>{metric.context}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function SoftwarePortfolio() {
  const profileMedia = legacyMedia.filter(({ storyId }) => storyId === 'profile')

  return (
    <div className="software-document">
      <Hero content={softwarePortfolio.hero} id="software-home" />
      <ProofRail />
      <About content={softwarePortfolio.about} id="software-about" media={profileMedia} />
      <Experience id="software-experience" items={softwarePortfolio.experience} />
      <FeaturedWork caseStudies={softwarePortfolio.projects} id="software-work" />
      <Capabilities
        groups={softwarePortfolio.capabilities}
        id="software-capabilities"
        projects={softwarePortfolio.projects}
      />
      <Contact
        content={softwarePortfolio.contact}
        id="software-contact"
        portfolioMode="software"
      />
    </div>
  )
}
