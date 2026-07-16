import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getMedia, legacyMedia, portfolioMedia, visualMedia } from './media'

const forbiddenPrivateAssetPaths = [
  'src/assets/images/flair4.png',
  'src/assets/images/optimized/flair4-main.webp',
  'src/assets/images/optimized/flair4-thumb.webp',
  'src/assets/images/optimized/gridworks2-main.webp',
  'src/assets/images/optimized/gridworks2-thumb.webp',
]

const countByStory = (entries: typeof legacyMedia) =>
  Object.fromEntries(
    entries.reduce((counts, entry) => {
      counts.set(entry.storyId, (counts.get(entry.storyId) ?? 0) + 1)
      return counts
    }, new Map<string, number>()),
  )

describe('portfolio media manifest', () => {
  it('uses the portfolio owner full name in creator rights attributions', () => {
    const creatorAttributions = portfolioMedia
      .map(({ rights }) => rights.owner)
      .filter((owner) => owner.startsWith('José'))

    expect(creatorAttributions.length).toBeGreaterThan(0)
    expect(creatorAttributions.every((owner) => owner.startsWith('José Ernesto Carter Arriagada')))
      .toBe(true)
  })

  it('restores every legacy gallery entry to its original story', () => {
    expect(legacyMedia).toHaveLength(58)
    expect(countByStory(legacyMedia)).toEqual({
      profile: 13,
      dily: 3,
      gridworks: 3,
      flair: 4,
      notreDame: 9,
      politiktok: 12,
      teaching: 5,
      geoscience: 9,
    })
  })

  it('records complete, publishable metadata for every entry', () => {
    expect(new Set(portfolioMedia.map(({ id }) => id)).size).toBe(portfolioMedia.length)

    for (const entry of portfolioMedia) {
      expect(entry.kind).toBe('image')
      expect(entry.src).toBeTruthy()
      expect(entry.thumbnail).toBeTruthy()
      expect(entry.width).toBeGreaterThan(0)
      expect(entry.height).toBeGreaterThan(0)
      expect(entry.alt.length).toBeGreaterThan(10)
      expect(entry.caption.length).toBeGreaterThan(10)
      expect(['cover', 'contain']).toContain(entry.fit)
      expect(entry.objectPosition).toMatch(/^\d+% \d+%$/)
      expect(entry.rights.owner).toBeTruthy()
      expect(entry.rights.source).toBeTruthy()
      expect(entry.publication).toBe('approved')
      expect(entry.storyId).toBeTruthy()
    }
  })

  it('uses only the three cleared configurator captures with separate renditions', () => {
    expect(visualMedia.map(({ id }) => id)).toEqual([
      'configurator-front-angled',
      'configurator-entrance',
      'configurator-door-clearance',
    ])

    for (const entry of visualMedia) {
      expect(entry.src).not.toBe(entry.thumbnail)
      expect(entry.storyId).toBe('parametric-configurator')
    }
  })

  it('uses three approved GridWorks dashboard captures in the public manifest', () => {
    const mediaById = new Map(legacyMedia.map((entry) => [entry.id, entry]))
    const gridWorksCaptures = legacyMedia.filter(({ storyId }) => storyId === 'gridworks')

    expect(gridWorksCaptures.map(({ id }) => id)).toEqual([
      'gridworks-sensors-overview',
      'gridworks-analytics-history',
      'gridworks-health-monitoring',
    ])
    expect(gridWorksCaptures.every(({ rights }) => rights.clearance === 'cleared-project-capture'))
      .toBe(true)
    expect(
      gridWorksCaptures.every(({ caption }) =>
        !caption.toLowerCase().includes(['private', 'dashboard'].join(' ')),
      ),
    ).toBe(true)

    const flairIdentity = mediaById.get('flair1')
    const flairReplacement = mediaById.get('flair4')
    expect(flairReplacement?.src).toBe(flairIdentity?.src)
    expect(flairReplacement?.rights.clearance).toBe('privacy-safe-replacement')
  })

  it('keeps raw authenticated source files out of the repository checkout', () => {
    expect(forbiddenPrivateAssetPaths.filter((path) => existsSync(path))).toEqual([])
  })

  it('registers the self-authored SIGGRAPH announcement image as approved profile evidence', () => {
    const siggraph = getMedia('siggraph-2026')

    expect(siggraph.storyId).toBe('profile')
    expect(siggraph.publication).toBe('approved')
    expect(siggraph.rights).toMatchObject({
      owner: 'José Ernesto Carter Arriagada',
      source: 'Self-authored SIGGRAPH 2026 LinkedIn post',
      clearance: 'previously-published',
    })
    expect(siggraph.width).toBeGreaterThan(0)
    expect(siggraph.height).toBeGreaterThan(0)
  })
})
