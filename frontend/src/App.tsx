import SiteFooter from './components/layout/SiteFooter'
import SiteHeader from './components/layout/SiteHeader'
import Metric from './components/ui/Metric'
import { portfolioContent } from './data/portfolio'
import About from './sections/About'
import Capabilities from './sections/Capabilities'
import Contact from './sections/Contact'
import Experience from './sections/Experience'
import FeaturedWork from './sections/FeaturedWork'
import Hero from './sections/Hero'

const droneCaseStudy = portfolioContent.caseStudies.find(
  (study) => study.slug === 'notre-dame-drone-response',
) ?? portfolioContent.caseStudies[0]

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader cvHref={portfolioContent.hero.secondaryCta.href} />
      <main id="main">
        <Hero content={portfolioContent.hero} image={droneCaseStudy} />
        <section aria-label="Selected outcomes" className="metrics-strip">
          <div className="metrics-strip__inner">
            {portfolioContent.metrics.map((metric) => (
              <Metric key={metric.label} metric={metric} />
            ))}
          </div>
        </section>
        <FeaturedWork caseStudies={portfolioContent.caseStudies} />
        <Experience items={portfolioContent.experience} />
        <About content={portfolioContent.about} />
        <Capabilities groups={portfolioContent.capabilities} />
        <Contact content={portfolioContent.contact} />
      </main>
      <SiteFooter links={portfolioContent.contact.links} name={portfolioContent.hero.name} />
    </>
  )
}

export default App
