import { describe, expect, it } from 'vitest'
import { getPortfolio, softwarePortfolio, visualPortfolio } from './portfolio'
import { portfolioMedia } from './media'

const sectionOrder = ['hero', 'about', 'experience', 'work', 'capabilities', 'contact']

describe('dual portfolio content', () => {
  it('uses the portfolio owner full name in content and concise route-aligned metadata', () => {
    expect([softwarePortfolio.hero.name, visualPortfolio.hero.name]).toEqual([
      'José Ernesto Carter Arriagada',
      'José Ernesto Carter Arriagada',
    ])
    expect([softwarePortfolio.meta.title, visualPortfolio.meta.title]).toEqual([
      'José Carter Arriagada — Production Technology, Tools & Simulation',
      'José Carter Arriagada — Production Technology, Tools & Simulation',
    ])
  })

  it('defines two complete portfolio trees with focused visual positioning', () => {
    for (const page of [softwarePortfolio]) {
      expect(page.sections.map((section) => section.kind)).toEqual(sectionOrder)
      expect(JSON.stringify(page)).not.toMatch(/siggraph/i)
    }

    expect(softwarePortfolio.experience).toHaveLength(7)
    expect(softwarePortfolio.projects).toHaveLength(6)
    expect(softwarePortfolio.capabilities).toHaveLength(4)
    expect(visualPortfolio.experience).toHaveLength(7)
    expect(visualPortfolio.projects).toHaveLength(5)
    expect(visualPortfolio.hero.eyebrow).toBe(
      'SOFTWARE ENGINEER · ACM SIGGRAPH 2026 STUDENT VOLUNTEER',
    )
    expect(visualPortfolio.meta.socialTitle).toBe(
      'José Carter — Production Technology, Tools & Simulation',
    )
  })

  it('uses the WDAS-priority visual launch set', () => {
    expect(visualPortfolio.projects.map((project) => project.id)).toEqual([
      'parametric-configurator',
      'personal-vfx-studies',
      'geoscience-simulation',
      'drone-response-spatial-autonomy',
      'politiktok-research-platform',
    ])
  })

  it('backs every published visual project with real media', () => {
    const publishedMediaIds = new Set(
      portfolioMedia.filter(({ publication }) => publication === 'approved').map(({ id }) => id),
    )

    for (const project of visualPortfolio.projects) {
      expect(project.mediaIds.length).toBeGreaterThan(0)
      expect(project.mediaIds.every((mediaId) => publishedMediaIds.has(mediaId))).toBe(true)
    }
  })

  it('selects the requested tree without changing object identity', () => {
    expect(getPortfolio('software')).toBe(softwarePortfolio)
    expect(getPortfolio('visual')).toBe(visualPortfolio)
  })
})
