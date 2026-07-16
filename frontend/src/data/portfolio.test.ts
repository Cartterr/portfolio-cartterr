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
      'José Carter — Software Engineer for AI, Data & Autonomous Systems',
      'José Carter — Visual Computing, Real-Time 3D & Simulation',
    ])
  })

  it('defines two complete portfolio trees with software milestones and current conference evidence', () => {
    expect(softwarePortfolio.sections.map((section) => section.kind)).toEqual([
      'hero',
      'about',
      'milestones',
      'experience',
      'work',
      'capabilities',
      'contact',
    ])
    expect(visualPortfolio.sections.map((section) => section.kind)).toEqual(sectionOrder)
    expect(JSON.stringify(softwarePortfolio)).toMatch(/siggraph 2026/i)
    expect(JSON.stringify(visualPortfolio)).toMatch(/siggraph 2026/i)

    expect(softwarePortfolio.experience).toHaveLength(8)
    expect(softwarePortfolio.milestones).toHaveLength(8)
    expect(softwarePortfolio.projects).toHaveLength(6)
    expect(softwarePortfolio.capabilities).toHaveLength(4)
    expect(visualPortfolio.projects).toHaveLength(3)
  })

  it('uses the cleared visual launch set', () => {
    expect(visualPortfolio.projects.map((project) => project.id)).toEqual([
      'geoscience-simulation',
      'parametric-configurator',
      'drone-response-spatial-autonomy',
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
