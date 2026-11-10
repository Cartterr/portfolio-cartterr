import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { canAnimate, clamp, damp, hasFinePointer } from '../lib/env'

type PreviewItem = { id: string; src: string }

type CursorPreviewProps = {
  items: PreviewItem[]
  activeId: string | null
}

/**
 * A small image card that trails the pointer over the project list. Its position is
 * integrated with frame deltas (exponential smoothing), so the trail has the same feel
 * on a 60 Hz and a 240 Hz display, and the loop sleeps when the card is hidden and settled.
 */
export function CursorPreview({ items, activeId }: CursorPreviewProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    setEnabled(canAnimate() && hasFinePointer())
  }, [])

  useEffect(() => {
    if (activeId) setArmed(true)
  }, [activeId])

  useEffect(() => {
    activeRef.current = activeId !== null
  }, [activeId])

  useEffect(() => {
    if (!enabled) return undefined
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0
    let tilt = 0
    let frame = 0
    let last = 0
    let placed = false

    const tick = (now: number) => {
      const element = elementRef.current
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
      last = now
      const ease = damp(dt, 11)
      x += (targetX - x) * ease
      y += (targetY - y) * ease
      tilt += (clamp((targetX - x) * 0.08, -9, 9) - tilt) * damp(dt, 9)
      if (element) {
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`
      }
      const settled = Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1
      if (activeRef.current || !settled) {
        frame = window.requestAnimationFrame(tick)
      } else {
        frame = 0
        last = 0
      }
    }

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!placed) {
        placed = true
        x = targetX
        y = targetY
      }
      if (!frame && activeRef.current) frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return createPortal(
    <div
      aria-hidden="true"
      className="jc-preview"
      data-on={activeId ? 'true' : 'false'}
      ref={elementRef}
    >
      <div className="jc-preview__card">
        {armed
          ? items.map((item) => (
              <img
                alt=""
                data-active={item.id === activeId ? 'true' : 'false'}
                decoding="async"
                key={item.id}
                src={item.src}
              />
            ))
          : null}
      </div>
    </div>,
    document.body,
  )
}
