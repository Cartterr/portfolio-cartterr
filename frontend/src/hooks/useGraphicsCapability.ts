import { useEffect, useState } from 'react'

export type GraphicsCapability = 'poster' | 'low' | 'full'

export type GraphicsSignals = {
  reducedMotion: boolean
  saveData: boolean
  webgl2: boolean
  deviceMemory?: number
  hardwareConcurrency?: number
}

type NetworkInformationLike = EventTarget & {
  saveData?: boolean
}

type NavigatorWithGraphicsHints = Navigator & {
  connection?: NetworkInformationLike
  deviceMemory?: number
}

export const GRAPHICS_FALLBACK_EVENT = 'visual-graphics-runtime-fallback'

const capabilityRank: Record<GraphicsCapability, number> = {
  poster: 0,
  low: 1,
  full: 2,
}

const minimumCapability = (
  first: GraphicsCapability,
  second: GraphicsCapability,
): GraphicsCapability =>
  capabilityRank[first] <= capabilityRank[second] ? first : second

export function classifyGraphicsCapability({
  reducedMotion,
  saveData,
  webgl2,
  deviceMemory,
  hardwareConcurrency,
}: GraphicsSignals): GraphicsCapability {
  if (reducedMotion || saveData || !webgl2) return 'poster'

  if (
    (typeof deviceMemory === 'number' && deviceMemory <= 4) ||
    (typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 4)
  ) {
    return 'low'
  }

  return 'full'
}

function hasWebGL2() {
  if (typeof document === 'undefined') return false

  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

function readGraphicsSignals(): GraphicsSignals {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      reducedMotion: true,
      saveData: false,
      webgl2: false,
    }
  }

  const graphicsNavigator = navigator as NavigatorWithGraphicsHints
  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = graphicsNavigator.connection?.saveData === true
  return {
    reducedMotion,
    saveData,
    webgl2: reducedMotion || saveData ? false : hasWebGL2(),
    deviceMemory: graphicsNavigator.deviceMemory,
    hardwareConcurrency: graphicsNavigator.hardwareConcurrency,
  }
}

function isGraphicsCapability(value: unknown): value is GraphicsCapability {
  return value === 'poster' || value === 'low' || value === 'full'
}

export function requestGraphicsFallback(capability: Exclude<GraphicsCapability, 'full'>) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(GRAPHICS_FALLBACK_EVENT, { detail: capability }))
}

export function useGraphicsCapability(): GraphicsCapability {
  const [baselineCapability, setBaselineCapability] = useState<GraphicsCapability>(() =>
    classifyGraphicsCapability(readGraphicsSignals()),
  )
  const [runtimeCeiling, setRuntimeCeiling] = useState<GraphicsCapability>('full')

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const graphicsNavigator = navigator as NavigatorWithGraphicsHints
    const connection = graphicsNavigator.connection
    const refreshCapability = () => {
      setBaselineCapability(classifyGraphicsCapability(readGraphicsSignals()))
    }
    const handleRuntimeFallback = (event: Event) => {
      const requested = (event as CustomEvent<unknown>).detail
      if (!isGraphicsCapability(requested)) return
      setRuntimeCeiling((current) => minimumCapability(current, requested))
    }

    motionQuery.addEventListener?.('change', refreshCapability)
    connection?.addEventListener?.('change', refreshCapability)
    window.addEventListener(GRAPHICS_FALLBACK_EVENT, handleRuntimeFallback)

    return () => {
      motionQuery.removeEventListener?.('change', refreshCapability)
      connection?.removeEventListener?.('change', refreshCapability)
      window.removeEventListener(GRAPHICS_FALLBACK_EVENT, handleRuntimeFallback)
    }
  }, [])

  return minimumCapability(baselineCapability, runtimeCeiling)
}
