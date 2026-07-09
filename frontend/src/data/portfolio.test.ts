import { describe, expect, it } from 'vitest'
import { portfolioContent } from './portfolio'

describe('portfolioContent', () => {
  it('leads with one focused positioning statement and four complete case studies', () => {
    expect(portfolioContent.hero.title).toBe(
      'Software engineer building reliable AI, data, and autonomous systems.',
    )
    expect(portfolioContent.caseStudies).toHaveLength(4)
    for (const study of portfolioContent.caseStudies) {
      expect(study.problem.length).toBeGreaterThan(30)
      expect(study.contribution.length).toBeGreaterThan(30)
      expect(study.outcome.length).toBeGreaterThan(15)
      expect(study.imageAlt.length).toBeGreaterThan(10)
    }
  })

  it('uses the approved hero actions and metric values', () => {
    expect([portfolioContent.hero.primaryCta, portfolioContent.hero.secondaryCta]).toEqual([
      { label: 'Explore selected work', href: '#work' },
      { label: 'Download CV', href: '/Jose_Carter_CV_Eng.pdf' },
    ])
    expect(portfolioContent.metrics.map((metric) => metric.value)).toEqual([
      'Up to 50%',
      '100k+',
      '15x',
      '14+',
    ])
  })

  it('keeps case studies in the approved order', () => {
    expect(portfolioContent.caseStudies.map((study) => study.slug)).toEqual([
      'gridworks-alerting-platform',
      'notre-dame-drone-response',
      'politiktok-research-infrastructure',
      'cuda-geoscience-simulation',
    ])
  })

  it('uses verified GridWorks image metadata without asserting project privacy', () => {
    const [gridWorks] = portfolioContent.caseStudies
    expect({
      imageWidth: gridWorks.imageWidth,
      imageHeight: gridWorks.imageHeight,
      hasPrivateFlag: 'private' in gridWorks,
    }).toEqual({ imageWidth: 1600, imageHeight: 1600, hasPrivateFlag: false })
  })

  it('uses a location-neutral drone image description', () => {
    const droneResponse = portfolioContent.caseStudies[1]
    expect(droneResponse.imageAlt).toBe(
      'Autonomous Drone Response aircraft prepared for a field test',
    )
  })

  it('does not link the geoscience study to unrelated research', () => {
    const geoscience = portfolioContent.caseStudies[3]
    expect(geoscience.link).toBeUndefined()
  })

  it('publishes only verified external destinations', () => {
    expect(
      portfolioContent.caseStudies.flatMap((study) =>
        study.link?.external ? [study.link.href] : [],
      ),
    ).toEqual(['https://droneresponse.ai/', 'https://politiktok.cl/'])
    expect(portfolioContent.contact.links).toEqual([
      { label: 'Email', href: 'mailto:jose.carterx@gmail.com' },
      { label: 'GitHub', href: 'https://github.com/Cartterr', external: true },
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/jose-carter-arriagada',
        external: true,
      },
    ])
  })

  it('uses location-neutral descriptions for event photography', () => {
    expect(portfolioContent.about.images[1].alt).toBe(
      'José Carter standing in front of the KHIPU 2025 event backdrop',
    )
  })

  it('keeps the capability list edited and evidence-backed', () => {
    expect(portfolioContent.capabilities).toHaveLength(3)
    expect(portfolioContent.capabilities.flatMap((group) => group.items).length).toBeLessThanOrEqual(18)
  })
})
