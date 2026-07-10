import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const styles = readFileSync('src/index.css', 'utf8')

const getRule = (selector: string) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))
  expect(match, `Missing CSS rule for ${selector}`).not.toBeNull()
  return match?.[1] ?? ''
}

const getToken = (name: string) => {
  const match = styles.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  expect(match, `Missing color token ${name}`).not.toBeNull()
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

  it('keeps the sticky header opaque without glass effects', () => {
    const headerRule = getRule('.site-header')

    expect(headerRule).toContain('background: var(--paper)')
    expect(headerRule).not.toContain('color-mix')
    expect(headerRule).not.toContain('backdrop-filter')
  })
})
