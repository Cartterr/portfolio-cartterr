const matches = (query: string) =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(query).matches

/** True when the visitor has not asked for reduced motion. */
export const canAnimate = () => !matches('(prefers-reduced-motion: reduce)')

/** True on devices with a hovering, precise pointer (mouse, trackpad). */
export const hasFinePointer = () => matches('(hover: hover) and (pointer: fine)')

export const isTestRun = import.meta.env.MODE === 'test'

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/**
 * Frame-rate independent smoothing factor: the share of the remaining distance
 * to cover in `dt` seconds. The same motion plays at 60, 120 or 240 Hz.
 */
export const damp = (dt: number, speed: number) => 1 - Math.exp(-dt * speed)
