import { useEffect, useRef } from 'react'
import { canAnimate, clamp, damp } from '../lib/env'

const COLS = 190
const ROWS = 96
/** Upper bound on canvas pixels: soft dots do not need more, integrated GPUs do need less. */
const MAX_PIXELS = 1_300_000

const vertexSource = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
uniform vec2 uPointer;
uniform float uPointerForce;
out float vAlpha;
out float vCrest;

const float COLS = ${COLS}.0;
const float ROWS = ${ROWS}.0;

void main() {
  float id = float(gl_VertexID);
  vec2 cell = vec2(mod(id, COLS), floor(id / COLS));
  vec2 grid = cell / vec2(COLS - 1.0, ROWS - 1.0);

  float z = mix(1.1, 13.0, grid.y * grid.y);
  float x = (grid.x * 2.0 - 1.0) * (2.2 + z * 1.05);
  vec2 p = vec2(x, z);
  float t = uTime;

  float h = 0.0;
  h += 0.34 * sin(dot(p, vec2(0.62, 0.78)) * 0.9 + t * 0.7);
  h += 0.17 * sin(dot(p, vec2(-0.71, 0.70)) * 1.9 - t * 1.1);
  h += 0.08 * sin(dot(p, vec2(0.21, -0.98)) * 3.7 + t * 1.7);
  h += 0.04 * sin(dot(p, vec2(0.95, 0.31)) * 7.1 - t * 2.3);

  float d = distance(p, uPointer);
  h += uPointerForce * 0.42 * exp(-d * d * 0.55) * cos(d * 3.2 - t * 4.0);

  float crest = smoothstep(0.26, 0.56, h);
  vec3 world = vec3(x, h - 1.55, z);
  float focal = 1.9;
  vec2 ndc = vec2(world.x * focal / world.z / uAspect, world.y * focal / world.z + 0.62);

  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = clamp(uDpr * (5.4 / z) * (1.0 + crest * 0.7), 1.0, 5.0 * uDpr);
  float fade = smoothstep(13.0, 6.0, z) * smoothstep(1.0, 1.9, z);
  // Soft top and bottom edges, done here so the canvas needs no CSS mask (a mask
  // would force an extra full-size compositing pass on every frame).
  fade *= smoothstep(-1.0, -0.72, ndc.y) * smoothstep(0.66, 0.2, ndc.y);
  vAlpha = fade * (0.3 + 0.5 * crest);
  vCrest = crest;
}`

const fragmentSource = `#version 300 es
precision mediump float;
uniform vec3 uInk;
uniform vec3 uSignal;
in float vAlpha;
in float vCrest;
out vec4 outColor;

void main() {
  float r = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.28, r);
  float a = disc * vAlpha;
  vec3 color = mix(uInk, uSignal, smoothstep(0.72, 1.0, vCrest));
  outColor = vec4(color * a, a);
}`

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

type WaveFieldProps = {
  className?: string
  /** Dot colour, linear 0..1 RGB. */
  ink?: [number, number, number]
  signal?: [number, number, number]
}

/**
 * A point-cloud swell drawn by one WebGL2 vertex shader (no geometry buffers).
 * Time advances by measured frame deltas, so it moves the same at any refresh rate,
 * and it stops drawing whenever it is off screen or the tab is hidden.
 */
export function WaveField({
  className,
  ink = [0.05, 0.05, 0.047],
  signal = [1, 0.29, 0.11],
}: WaveFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inkKey = ink.join(',')
  const signalKey = signal.join(',')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof WebGL2RenderingContext === 'undefined') return undefined

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
      stencil: false,
    })
    if (!gl) return undefined

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return undefined
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const uTime = uniform('uTime')
    const uAspect = uniform('uAspect')
    const uDpr = uniform('uDpr')
    const uPointer = uniform('uPointer')
    const uPointerForce = uniform('uPointerForce')
    gl.uniform3fv(uniform('uInk'), inkKey.split(',').map(Number))
    gl.uniform3fv(uniform('uSignal'), signalKey.split(',').map(Number))

    const animated = canAnimate()
    let width = 1
    let height = 1
    let dpr = 1
    let quality = 1
    let slowFrames = 0
    let sampledFrames = 0
    let fastestFrame = Infinity
    let frame = 0
    let last = 0
    let time = 12
    let visible = true
    let pointerX = 0
    let pointerZ = 5
    let targetX = 0
    let targetZ = 5
    let force = 0
    let targetForce = 0

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(uTime, time)
      gl.uniform1f(uAspect, width / height)
      gl.uniform1f(uDpr, dpr)
      gl.uniform2f(uPointer, pointerX, pointerZ)
      gl.uniform1f(uPointerForce, force)
      gl.drawArrays(gl.POINTS, 0, COLS * ROWS)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr =
        Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (width * height))) *
        quality
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      if (!frame) draw()
    }

    const tick = (now: number) => {
      const elapsed = last ? now - last : 0
      const dt = Math.min(elapsed / 1000, 0.05)
      last = now

      // If frames keep arriving well behind the display's own pace, draw fewer pixels.
      if (elapsed > 0 && elapsed < 100) {
        fastestFrame = Math.min(fastestFrame, elapsed)
        sampledFrames += 1
        if (elapsed > fastestFrame * 1.6) slowFrames += 1
        if (sampledFrames >= 120) {
          if (slowFrames > 60 && quality > 0.5) {
            quality = Math.max(0.5, quality * 0.8)
            resize()
          }
          sampledFrames = 0
          slowFrames = 0
        }
      }
      time += dt * 0.55
      const ease = damp(dt, 5)
      pointerX += (targetX - pointerX) * ease
      pointerZ += (targetZ - pointerZ) * ease
      force += (targetForce - force) * damp(dt, 3)
      draw()
      frame = visible ? window.requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (!animated || frame || !visible || document.hidden) return
      last = 0
      frame = window.requestAnimationFrame(tick)
    }
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const ndcY = 1 - ((event.clientY - rect.top) / rect.height) * 2
      // Invert the shader's projection on the resting plane (y = -1.55).
      const z = clamp((1.9 * -1.55) / Math.min(ndcY - 0.62, -0.05), 1.2, 12)
      targetZ = z
      targetX = (ndcX * (rect.width / rect.height) * z) / 1.9
      targetForce = ndcY < 0.62 && Math.abs(ndcX) <= 1 && ndcY >= -1 ? 1 : 0
    }
    const handleLeave = () => {
      targetForce = 0
    }
    const handleVisibility = () => (document.hidden ? stop() : start())

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    resizeObserver?.observe(canvas)
    const viewObserver =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible) start()
            else stop()
          })
    viewObserver?.observe(canvas)

    window.addEventListener('pointermove', handlePointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', handleLeave)
    document.addEventListener('visibilitychange', handleVisibility)
    resize()
    start()

    return () => {
      stop()
      resizeObserver?.disconnect()
      viewObserver?.disconnect()
      window.removeEventListener('pointermove', handlePointer)
      document.documentElement.removeEventListener('pointerleave', handleLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.deleteVertexArray(vao)
    }
  }, [inkKey, signalKey])

  return <canvas aria-hidden="true" className={className} ref={canvasRef} />
}
