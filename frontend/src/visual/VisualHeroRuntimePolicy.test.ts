import { describe, expect, it } from 'vitest'
import {
  evaluateRuntimeStall,
  evaluateRuntimeWindow,
  selectSceneVisibilityPolicy,
  type RuntimeStallState,
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

  it('falls back to the poster after repeated long visible-frame stalls', () => {
    let state: RuntimeStallState = { consecutiveLongFrames: 0 }

    const first = evaluateRuntimeStall(state, 0.3)
    expect(first.shouldFallbackToPoster).toBe(false)
    state = first.state

    const second = evaluateRuntimeStall(state, 0.31)
    expect(second.shouldFallbackToPoster).toBe(true)
  })

  it('resets an isolated long-frame stall after a normal visible frame', () => {
    const isolated = evaluateRuntimeStall({ consecutiveLongFrames: 0 }, 0.3)
    expect(isolated.shouldFallbackToPoster).toBe(false)

    const recovered = evaluateRuntimeStall(isolated.state, 1 / 20)
    expect(recovered).toEqual({
      state: { consecutiveLongFrames: 0 },
      shouldFallbackToPoster: false,
    })

    expect(evaluateRuntimeStall(recovered.state, 0.32).shouldFallbackToPoster).toBe(false)
  })
})
