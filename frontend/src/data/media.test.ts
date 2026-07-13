import { describe, expect, it } from 'vitest'
import { legacyMedia, portfolioMedia, visualMedia } from './media'

const countByStory = (entries: typeof legacyMedia) =>
  Object.fromEntries(
    entries.reduce((counts, entry) => {
      counts.set(entry.storyId, (counts.get(entry.storyId) ?? 0) + 1)
      return counts
    }, new Map<string, number>()),
  )

describe('portfolio media manifest', () => {
  it('restores every legacy gallery entry to its original story', () => {
    expect(legacyMedia).toHaveLength(57)
    expect(countByStory(legacyMedia)).toEqual({
      profile: 13,
      dily: 3,
      gridworks: 2,
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

  it('keeps private dashboard originals out of the public manifest', () => {
    const mediaById = new Map(legacyMedia.map((entry) => [entry.id, entry]))
    const gridWorksIdentity = mediaById.get('gridworks1')
    const gridWorksReplacement = mediaById.get('gridworks2')
    const flairIdentity = mediaById.get('flair1')
    const flairReplacement = mediaById.get('flair4')

    expect(gridWorksReplacement?.src).toBe(gridWorksIdentity?.src)
    expect(flairReplacement?.src).toBe(flairIdentity?.src)
    expect(gridWorksReplacement?.rights.clearance).toBe('privacy-safe-replacement')
    expect(flairReplacement?.rights.clearance).toBe('privacy-safe-replacement')
  })
})
