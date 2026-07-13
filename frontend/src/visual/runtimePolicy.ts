export type RuntimeWindowState = {
  slowWindows: number
}

export type RuntimeStallState = {
  consecutiveLongFrames: number
}

type RuntimeWindowMeasurement = {
  averageDeltaSeconds: number
  targetFps: number
}

type RuntimeWindowEvaluation = {
  state: RuntimeWindowState
  shouldDowngrade: boolean
}

type RuntimeStallEvaluation = {
  state: RuntimeStallState
  shouldFallbackToPoster: boolean
}

export type SceneVisibilityPolicy = 'observe' | 'poster'

const CADENCE_TOLERANCE_MULTIPLIER = 1.5
const SCHEDULER_TOLERANCE_SECONDS = 0.004
const LONG_FRAME_SECONDS = 0.25
const SUSTAINED_LONG_FRAME_COUNT = 2

export function calculateHeroScrollProgress(
  top: number,
  height: number,
  viewportHeight: number,
) {
  const firstSegment = Math.max(1, height, viewportHeight * 0.8)
  return Math.max(0, Math.min(1, -top / firstSegment))
}

export function shouldTickScene(
  nearViewport: boolean,
  documentVisible: boolean,
  motionWindowActive: boolean,
) {
  return nearViewport && documentVisible && motionWindowActive
}

export function evaluateRuntimeStall(
  state: RuntimeStallState,
  deltaSeconds: number,
): RuntimeStallEvaluation {
  const consecutiveLongFrames =
    deltaSeconds > LONG_FRAME_SECONDS ? state.consecutiveLongFrames + 1 : 0

  return {
    state: { consecutiveLongFrames },
    shouldFallbackToPoster: consecutiveLongFrames >= SUSTAINED_LONG_FRAME_COUNT,
  }
}

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
