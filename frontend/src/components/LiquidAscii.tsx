import { useEffect, useRef, useState } from 'react'

const palette = ' .,:-=+*#%@'

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

      const cols = clamp(Math.floor(width / 9), 28, 86)
      const rows = clamp(Math.floor(height / 14), 18, 34)
      const mouse = pointerRef.current
      const t = time * 0.0011
      let next = ''

      for (let row = 0; row < rows; row += 1) {
        const y = row / Math.max(rows - 1, 1)
        for (let col = 0; col < cols; col += 1) {
          const x = col / Math.max(cols - 1, 1)
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          const base =
            Math.sin(x * 8.2 + t * 2.1) * 0.7 +
            Math.cos(y * 9.4 - t * 1.5) * 0.65 +
            Math.sin((x + y) * 10.5 - t * 1.2) * 0.45 +
            Math.cos((x - y) * 13.5 + t * 1.8) * 0.25

          const ripple = mouse.active ? Math.cos(dist * 24 - t * 5.2) * Math.max(0, 1 - dist * 2.2) : 0
          const swirl = Math.sin((x * x + y * y) * 18 - t * 2.8) * 0.4
          const intensity = base + ripple + swirl
          const normalized = clamp((intensity + 2.4) / 4.8, 0, 0.999)
          let char = palette[Math.floor(normalized * palette.length)]

          if (normalized > 0.74 && (row + col + Math.floor(t * 9)) % 5 === 0) {
            char = '@'
          } else if (normalized > 0.55 && (row + Math.floor(t * 7)) % 6 === 0) {
            char = '#'
          } else if (normalized < 0.18 && (col + Math.floor(t * 4)) % 8 === 0) {
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
      const w = window.innerWidth
      const h = window.innerHeight
      pointerRef.current = {
        x: clamp(event.clientX / w, 0, 1),
        y: clamp(event.clientY / h, 0, 1),
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
    <div ref={ref} className="absolute inset-0 z-[1] overflow-hidden pointer-events-none opacity-[0.10] [mask-image:linear-gradient(to_bottom,white_40%,transparent)]">
      <pre className="liquid-ascii" aria-hidden="true">
        {frame}
      </pre>
    </div>
  )
}

export default LiquidAscii
