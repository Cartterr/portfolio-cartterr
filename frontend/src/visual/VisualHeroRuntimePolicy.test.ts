import { describe, expect, it } from 'vitest'
import {
  evaluateRuntimeWindow,
  selectSceneVisibilityPolicy,
  type RuntimeWindowState,
} from './runtimePolicy'

const evaluateTwoWindows = (targetFps: number, averageDeltaSeconds: number) => {
  let state: RuntimeWindowState = { slowWindows: 0 }
  let shouldDowngrade = false

  for (let windowIndex = 0; windowIndex < 2; windowIndex += 1) {
    const evaluation = evaluateRuntimeWindow(state, {
      averageDeltaSeconds,
      targetFps,
    })
    state = evaluation.state
    shouldDowngrade ||= evaluation.shouldDowngrade
  }

  return shouldDowngrade
}

describe('Visual hero runtime policy', () => {
  it.each([
    { targetFps: 28, observedDeltaSeconds: 1 / 20 },
    { targetFps: 18, observedDeltaSeconds: 1 / 15 },
  ])(
    'does not downgrade the deliberate $targetFps fps cadence after RAF quantization',
    ({ targetFps, observedDeltaSeconds }) => {
      expect(evaluateTwoWindows(targetFps, observedDeltaSeconds)).toBe(false)
    },
  )

  it('still downgrades after two sustained windows well below the target cadence', () => {
    expect(evaluateTwoWindows(28, 1 / 12)).toBe(true)
  })

  it('chooses poster fallback when viewport visibility cannot be observed', () => {
    expect(selectSceneVisibilityPolicy(false)).toBe('poster')
    expect(selectSceneVisibilityPolicy(true)).toBe('observe')
  })
})
