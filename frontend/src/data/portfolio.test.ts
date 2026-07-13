import { describe, expect, it } from 'vitest'
import { getPortfolio, softwarePortfolio, visualPortfolio } from './portfolio'
import { portfolioMedia } from './media'

const sectionOrder = ['hero', 'about', 'experience', 'work', 'capabilities', 'contact']

describe('dual portfolio content', () => {
  it('defines two complete portfolio trees without conference branding', () => {
    for (const page of [softwarePortfolio, visualPortfolio]) {
      expect(page.sections.map((section) => section.kind)).toEqual(sectionOrder)
      expect(JSON.stringify(page)).not.toMatch(/siggraph/i)
    }

    expect(softwarePortfolio.experience).toHaveLength(7)
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
