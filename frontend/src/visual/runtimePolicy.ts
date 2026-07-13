export type RuntimeWindowState = {
  slowWindows: number
}

type RuntimeWindowMeasurement = {
  averageDeltaSeconds: number
  targetFps: number
}

type RuntimeWindowEvaluation = {
  state: RuntimeWindowState
  shouldDowngrade: boolean
}

export type SceneVisibilityPolicy = 'observe' | 'poster'

const CADENCE_TOLERANCE_MULTIPLIER = 1.5
const SCHEDULER_TOLERANCE_SECONDS = 0.004

export function evaluateRuntimeWindow(
  state: RuntimeWindowState,
  { averageDeltaSeconds, targetFps }: RuntimeWindowMeasurement,
): RuntimeWindowEvaluation {
  const scheduledDeltaSeconds = 1 / targetFps
  const sustainableDeltaSeconds =
    scheduledDeltaSeconds * CADENCE_TOLERANCE_MULTIPLIER + SCHEDULER_TOLERANCE_SECONDS
  const slowWindows =
    averageDeltaSeconds > sustainableDeltaSeconds ? state.slowWindows + 1 : 0

  return {
    state: { slowWindows },
    shouldDowngrade: slowWindows >= 2,
  }
}

export function selectSceneVisibilityPolicy(
  observerAvailable: boolean,
): SceneVisibilityPolicy {
  return observerAvailable ? 'observe' : 'poster'
}
