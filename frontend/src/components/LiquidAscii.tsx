import { useEffect, useRef, useState } from 'react'

const palette = '   ..,:-=+*#%@'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const LiquidAscii = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false })
  const [frame, setFrame] = useState('')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let width = 0
    let height = 0
    let frameId = 0
    let lastCommit = 0

    const render = (time: number) => {
      if (!width || !height) {
        frameId = window.requestAnimationFrame(render)
        return
      }

      const cols = clamp(Math.floor(width / 8.1) + 14, 72, 240)
      const rows = clamp(Math.floor(height / 12.6) + 8, 32, 92)
      const pointer = pointerRef.current
      const t = time * 0.00095
      const mouse = pointer.active
        ? pointer
        : {
            x: 0.58 + Math.cos(t * 0.9) * 0.16,
            y: 0.38 + Math.sin(t * 1.1) * 0.12,
            active: false,
          }
      let next = ''

      for (let row = 0; row < rows; row += 1) {
        const y = row / Math.max(rows - 1, 1)
        for (let col = 0; col < cols; col += 1) {
          const x = col / Math.max(cols - 1, 1)
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          const wave =
            Math.sin((x * 7.4 - y * 3.8) + t * 2.8) * 0.72 +
            Math.cos((y * 9.6 + x * 2.5) - t * 2.1) * 0.62
          const diagonal = Math.sin((x + y) * 13.5 - t * 2.7) * 0.38
          const vortex = Math.cos(((x - 0.55) ** 2 + (y - 0.44) ** 2) * 38 - t * 5.4) * 0.5
          const shimmer = Math.sin((x * 24 + y * 18) + t * 4.8) * 0.16
          const ripple = Math.cos(dist * 28 - t * 6.2) * Math.max(0, 1 - dist * 2.4) * 0.95
          const focus = Math.max(0, 1 - dist * 1.55) * 0.58
          const intensity = wave + diagonal + vortex + shimmer + ripple + focus
          const normalized = clamp((intensity + 2.9) / 5.8, 0, 0.999)
          let char = palette[Math.floor(normalized * palette.length)]

          if (normalized > 0.83 && (row + col + Math.floor(t * 8)) % 4 === 0) {
            char = '%'
          } else if (normalized > 0.72 && (row + Math.floor(t * 6)) % 4 === 0) {
            char = '@'
          } else if (normalized > 0.58 && (col + Math.floor(t * 6)) % 5 === 0) {
            char = '#'
          } else if (normalized > 0.48 && (row + col + Math.floor(t * 10)) % 6 === 0) {
            char = '*'
          } else if (normalized < 0.16 && (col + Math.floor(t * 3)) % 9 === 0) {
            char = '.'
          }

          next += char
        }
        next += '\n'
      }

      if (time - lastCommit > 72) {
        lastCommit = time
        setFrame(next)
      }

      frameId = window.requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      width = entry.contentRect.width
      height = entry.contentRect.height
    })

    const handleMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const w = rect.width || window.innerWidth
      const h = rect.height || window.innerHeight
      pointerRef.current = {
        x: clamp((event.clientX - rect.left) / w, 0, 1),
        y: clamp((event.clientY - rect.top) / h, 0, 1),
        active: true,
      }
    }

    const handleLeave = () => {
      pointerRef.current.active = false
    }

    resizeObserver.observe(element)
    window.addEventListener('pointermove', handleMove as any)
    window.addEventListener('pointerleave', handleLeave)
    frameId = window.requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handleMove as any)
      window.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="liquid-ascii-stage absolute -inset-x-8 -inset-y-10 z-[1] overflow-hidden pointer-events-none"
    >
      <div className="liquid-ascii-aura liquid-ascii-aura-left" />
      <div className="liquid-ascii-aura liquid-ascii-aura-right" />
      <pre className="liquid-ascii liquid-ascii-echo liquid-ascii-shift-right" aria-hidden="true">
        {frame}
      </pre>
      <pre className="liquid-ascii liquid-ascii-echo liquid-ascii-shift-down" aria-hidden="true">
        {frame}
      </pre>
      <pre className="liquid-ascii liquid-ascii-base" aria-hidden="true">
        {frame}
      </pre>
      <pre className="liquid-ascii liquid-ascii-glow" aria-hidden="true">
        {frame}
      </pre>
    </div>
  )
}

export default LiquidAscii
