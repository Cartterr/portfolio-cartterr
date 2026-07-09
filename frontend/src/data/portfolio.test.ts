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

  it('keeps the capability list edited and evidence-backed', () => {
    expect(portfolioContent.capabilities).toHaveLength(3)
    expect(portfolioContent.capabilities.flatMap((group) => group.items).length).toBeLessThanOrEqual(18)
  })
})
