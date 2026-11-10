import { getMedia } from '../data/media'
import type { PortfolioImageMedia } from '../data/types'
import { softwarePortfolio } from '../data/software'
import { LightboxProvider } from './fx/Lightbox'
import { useReveal } from './lib/hooks'
import { About } from './sections/About'
import { Capabilities } from './sections/Capabilities'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Organizations, Outcomes } from './sections/Proof'
import { Work } from './sections/Work'
import './site.css'

// People and places, in the order software.ts sets (milestones, the Dily team, then the rest).
const aboutMedia = softwarePortfolio.about.mediaIds
  .map((id) => getMedia(id))
  .filter((media): media is PortfolioImageMedia => media.kind === 'image')
const currentRoles = softwarePortfolio.experience
  .filter(({ id }) => id === 'tek' || id === 'dictuc')

/** The Software portfolio: every section of the page at `/`, in reading order. */
export function SoftwarePage() {
  const page = softwarePortfolio
  useReveal()

  return (
    <LightboxProvider>
      <div className="jc-page" data-software-site>
        <Hero content={page.hero} current={currentRoles} />
        <Outcomes metrics={page.metrics} />
        <Organizations />
        <About content={page.about} media={aboutMedia} />
        <Work projects={page.projects} />
        <Experience items={page.experience} />
        <Capabilities groups={page.capabilities} projects={page.projects} />
        <Contact content={page.contact} resume={page.hero.secondaryCta} />
      </div>
    </LightboxProvider>
  )
}
