import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GRAPHICS_FALLBACK_EVENT,
  classifyGraphicsCapability,
  useGraphicsCapability,
} from '../hooks/useGraphicsCapability'

const capableSignals = {
  reducedMotion: false,
  saveData: false,
  webgl2: true,
  deviceMemory: 8,
  hardwareConcurrency: 8,
} as const

const setNavigatorValue = (key: string, value: unknown) => {
  Object.defineProperty(navigator, key, { configurable: true, value })
}

describe('graphics capability gate', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
    setNavigatorValue('connection', { saveData: false })
    setNavigatorValue('deviceMemory', 8)
    setNavigatorValue('hardwareConcurrency', 8)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      ((contextId: string) => (contextId === 'webgl2' ? {} : null)) as HTMLCanvasElement['getContext'],
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    ['reduced motion', { ...capableSignals, reducedMotion: true }],
    ['Save-Data', { ...capableSignals, saveData: true }],
    ['no WebGL2', { ...capableSignals, webgl2: false }],
  ])('uses the poster for %s', (_reason, signals) => {
    expect(classifyGraphicsCapability(signals)).toBe('poster')
  })

  it('uses a conservative low scene on constrained hardware', () => {
    expect(classifyGraphicsCapability({ ...capableSignals, deviceMemory: 4 })).toBe('low')
    expect(classifyGraphicsCapability({ ...capableSignals, hardwareConcurrency: 4 })).toBe('low')
  })

  it('allows the full scene only with all capability signals present', () => {
    expect(classifyGraphicsCapability(capableSignals)).toBe('full')
  })

  it('downgrades the live hook when the measured runtime asks for fallback', () => {
    const { result } = renderHook(() => useGraphicsCapability())
    expect(result.current).toBe('full')

    act(() => {
      window.dispatchEvent(new CustomEvent(GRAPHICS_FALLBACK_EVENT, { detail: 'low' }))
    })
    expect(result.current).toBe('low')

    act(() => {
      window.dispatchEvent(new CustomEvent(GRAPHICS_FALLBACK_EVENT, { detail: 'poster' }))
    })
    expect(result.current).toBe('poster')
  })
})
