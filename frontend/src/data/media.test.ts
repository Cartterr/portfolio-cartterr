import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { legacyMedia, portfolioMedia, visualMedia } from './media'

const forbiddenLegacyPrivateAssetPaths = [
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
    expect(legacyMedia).toHaveLength(59)
    expect(countByStory(legacyMedia)).toEqual({
      profile: 13,
      dily: 3,
      gridworks: 4,
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

  it('uses cleared configurator and personal VFX captures with separate renditions', () => {
    expect(
      visualMedia
        .filter(({ storyId }) => storyId === 'parametric-configurator')
        .map(({ id }) => id),
    ).toEqual([
      'configurator-front-angled',
      'configurator-entrance',
      'configurator-door-clearance',
    ])

    expect(
      visualMedia
        .filter(({ storyId }) => storyId === 'personal-vfx-studies')
        .map(({ id }) => id),
    ).toEqual([
      'vfx-campfire-environment',
      'vfx-crystal-environment',
      'vfx-orbital-portrait',
      'vfx-disintegration-portrait',
      'vfx-cyberpunk-lookdev',
      'vfx-robot-lookdev',
    ])

    for (const entry of visualMedia) {
      expect(entry.src).not.toBe(entry.thumbnail)
      expect(['parametric-configurator', 'personal-vfx-studies']).toContain(entry.storyId)
    }
  })

  it('uses four distinct, cleared GridWorks product captures', () => {
    const mediaById = new Map(legacyMedia.map((entry) => [entry.id, entry]))
    const gridWorksEntries = legacyMedia.filter(({ storyId }) => storyId === 'gridworks')
    const flairIdentity = mediaById.get('flair1')
    const flairReplacement = mediaById.get('flair4')

    expect(gridWorksEntries.map(({ id }) => id)).toEqual([
      'gridworks-landing-overview',
      'gridworks-dashboard-operations',
      'gridworks-dashboard-food-history',
      'gridworks-alert-history',
    ])
    expect(new Set(gridWorksEntries.map(({ src }) => src)).size).toBe(4)
    expect(gridWorksEntries.every(({ src, thumbnail }) => src !== thumbnail)).toBe(true)
    expect(
      gridWorksEntries.every(({ rights }) => rights.clearance === 'cleared-project-capture'),
    ).toBe(true)
    expect(flairReplacement?.src).toBe(flairIdentity?.src)
    expect(flairReplacement?.rights.clearance).toBe('privacy-safe-replacement')
  })

  it('keeps superseded private dashboard originals out of the repository checkout', () => {
    expect(forbiddenLegacyPrivateAssetPaths.filter((path) => existsSync(path))).toEqual([])
  })
})
