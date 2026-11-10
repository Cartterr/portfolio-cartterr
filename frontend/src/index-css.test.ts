import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const styles = readFileSync('src/index.css', 'utf8')
const softwareStyles = readFileSync('src/site/site.css', 'utf8')
const galleryStyles = readFileSync('src/styles/gallery.css', 'utf8')

const getRule = (selector: string) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))
  expect(match, `Missing CSS rule for ${selector}`).not.toBeNull()
  return match?.[1] ?? ''
}

const getSoftwareRule = (selector: string) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = softwareStyles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))
  expect(match, `Missing Software CSS rule for ${selector}`).not.toBeNull()
  return match?.[1] ?? ''
}

const getGalleryRule = (selector: string) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = galleryStyles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))
  expect(match, `Missing gallery CSS rule for ${selector}`).not.toBeNull()
  return match?.[1] ?? ''
}

const getToken = (name: string) => {
  const match = styles.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  expect(match, `Missing color token ${name}`).not.toBeNull()
  return match?.[1] ?? '#000000'
}

const getSoftwareToken = (name: string) => {
  const match = softwareStyles.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  expect(match, `Missing software color token ${name}`).not.toBeNull()
  return match?.[1] ?? '#000000'
}

const relativeLuminance = (hex: string) => {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

const contrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('portfolio CSS accessibility contracts', () => {
  it('stacks both case-study directions below 900px without implicit zero-width columns', () => {
    const responsiveStart = styles.indexOf('@media (max-width: 900px)')
    const responsiveEnd = styles.indexOf('@media (max-width: 760px)')
    const responsiveRules = styles.slice(responsiveStart, responsiveEnd)
    const stackedRule = responsiveRules.match(
      /\.case-study\[data-direction='media-first'\],\s*\.case-study\[data-direction='copy-first'\]\s*\{([^}]*)\}/,
    )

    expect(stackedRule, 'Both directional selectors must be reset explicitly').not.toBeNull()
    expect(stackedRule?.[1]).toContain('grid-template-columns: minmax(0, 1fr)')
    expect(stackedRule?.[1]).toMatch(/grid-template-areas:\s*'media'\s*'copy'/)
  })

  it('uses AA text variants for every accent/background pairing', () => {
    const paper = getToken('--paper')
    const paperDeep = getToken('--paper-deep')
    const ink = getToken('--ink')
    const white = getToken('--white')
    const copperText = getToken('--copper-text')
    const copperOnDark = getToken('--copper-on-dark')
    const copperSurface = getToken('--copper-surface')
    const tealText = getToken('--teal-text')

    for (const ratio of [
      contrastRatio(copperText, paper),
      contrastRatio(copperText, paperDeep),
      contrastRatio(copperOnDark, ink),
      contrastRatio(white, copperSurface),
      contrastRatio(tealText, paper),
      contrastRatio(tealText, paperDeep),
    ]) {
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    }
    expect(contrastRatio(copperSurface, ink)).toBeGreaterThanOrEqual(3)

    expect(getRule('.eyebrow')).toContain('color: var(--copper-text)')
    expect(getRule('.eyebrow--research')).toContain('color: var(--teal-text)')
    expect(getRule('.hero__eyebrow')).toContain('color: var(--copper-on-dark)')
    expect(getRule('.button-link--primary')).toContain('background: var(--copper-surface)')
    expect(getRule('.case-study__link')).toContain('color: var(--copper-text)')
    expect(getRule('.contact .eyebrow')).toContain('color: var(--copper-on-dark)')
  })

  it('keeps Software text readable on paper, on cards, and on ink', () => {
    const paper = getSoftwareToken('--jc-paper')
    const card = getSoftwareToken('--jc-white')
    const ink = getSoftwareToken('--jc-ink')
    const inkRaised = getSoftwareToken('--jc-ink-2')
    const signal = getSoftwareToken('--jc-signal')
    const inkContext = getSoftwareRule('.jc-ink')
    const inkToken = (name: string) => {
      const match = inkContext.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
      expect(match, `Missing ink-context token ${name}`).not.toBeNull()
      return match?.[1] ?? '#000000'
    }

    for (const background of [paper, card]) {
      expect(contrastRatio(getSoftwareToken('--fg-2'), background)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(getSoftwareToken('--fg-mute'), background)).toBeGreaterThanOrEqual(4.5)
      expect(
        contrastRatio(getSoftwareToken('--jc-signal-text'), background),
      ).toBeGreaterThanOrEqual(4.5)
    }
    for (const background of [ink, inkRaised]) {
      expect(contrastRatio(inkToken('--fg-2'), background)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(inkToken('--fg-mute'), background)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(inkToken('--accent-text'), background)).toBeGreaterThanOrEqual(4.5)
    }
    // Buttons turn signal orange on hover and keep ink text on it.
    expect(contrastRatio(ink, signal)).toBeGreaterThanOrEqual(4.5)
    expect(softwareStyles).toMatch(
      /\.jc-btn--ink:hover,\s*\.jc-btn--ink:focus-visible\s*\{\s*color: var\(--jc-ink\);/,
    )
  })

  it('hides Software entrances only after the script opts in', () => {
    const rules = softwareStyles.replace(/\/\*[\s\S]*?\*\//g, '')
    const hiddenStates = [...rules.matchAll(/([^{}]+)\{[^}]*opacity:\s*0;[^}]*\}/g)]
      .map(([, selector]) => selector.trim())
      .filter((selector) => selector.includes('[data-reveal]'))

    expect(hiddenStates.length).toBeGreaterThan(0)
    for (const selector of hiddenStates) expect(selector.startsWith('.jc-anim ')).toBe(true)
    expect(softwareStyles).toContain('.jc-anim .jc-words:not(.is-in) .jc-word__in')
    expect(softwareStyles).toContain('.jc-anim [data-reveal]:not(.is-in) .jc-odo__reel')
  })

  it('keeps Software motion on the compositor and optional', () => {
    // No CSS masks: a mask over the animated canvas or marquee costs a full extra pass per frame.
    expect(softwareStyles).not.toMatch(/mask-image\s*:/)
    expect(softwareStyles).toContain('@supports (transition-timing-function: linear(0, 1))')
    expect(softwareStyles).toMatch(
      /@media \(prefers-reduced-motion: no-preference\) \{\s*@supports \(animation-timeline: view\(\)\)/,
    )
    expect(softwareStyles).toContain('@media (prefers-reduced-motion: reduce)')
    expect(softwareStyles).toContain('@media (forced-colors: active)')

    const keyframes = [...softwareStyles.matchAll(/@keyframes (jc-[\w-]+) \{([\s\S]*?)\n\}/g)]
    expect(keyframes.length).toBeGreaterThan(5)
    for (const [, name, body] of keyframes) {
      const properties = [...body.matchAll(/^\s{4}([a-z-]+):/gm)].map(([, property]) => property)
      const allowed = name === 'jc-mark-fill' ? ['background-size'] : ['opacity', 'transform']
      for (const property of properties) {
        expect(allowed, `${name} animates ${property}`).toContain(property)
      }
    }
  })

  it('keeps long Software project titles inside their responsive text column', () => {
    expect(getSoftwareRule('.jc-feature')).toContain(
      'grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr)',
    )
    expect(getSoftwareRule('.jc-row__button')).toContain(
      'grid-template-columns: 3.25rem minmax(0, 1fr) auto 2.75rem',
    )
    expect(getSoftwareRule('.jc-feature h3')).toContain('text-wrap: balance')
    expect(getSoftwareRule('.jc-foot__mark')).toContain('font-size: 20.2cqi')
  })

  it('lets the Fade plugin crossfade outgoing slides instead of hiding them immediately', () => {
    expect(getGalleryRule('.portfolio-carousel__slide')).not.toContain('visibility: hidden')
    expect(galleryStyles).not.toContain(".portfolio-carousel__slide[data-active='true']")
  })

  it('provides progressive liquid-glass navigation with readable fallbacks', () => {
    expect(styles).toContain('--shell-canvas: #090909')
    expect(styles).toContain("[data-portfolio-mode='visual']")
    expect(styles).toContain('@supports')
    expect(styles).toContain('backdrop-filter')
    expect(styles).toContain('@media (forced-colors: active)')
    expect(styles).toContain('@media (prefers-contrast: more)')
    expect(getRule('.site-header__inner')).toContain('background: var(--glass-opaque)')
  })
})
