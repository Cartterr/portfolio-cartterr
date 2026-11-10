import { type RefObject, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { canAnimate, clamp, damp, hasFinePointer } from '../lib/env'

type PreviewItem = { id: string; src: string }

type CursorPreviewProps = {
  items: PreviewItem[]
  activeId: string | null
  /** The hovered row. Used when the pointer position is unknown or stale. */
  anchorRef: RefObject<HTMLElement | null>
}

/** How long after a scroll a row's hover counts as "the list moved under the cursor". */
const SCROLL_GRACE_MS = 220
/** Gap kept between the pinned card and the row's right edge (the meta and toggle). */
const ANCHOR_INSET_PX = 120

/**
 * A small image card that trails the pointer over the project list. Its position is
 * integrated with frame deltas (exponential smoothing), so the trail has the same feel
 * on a 60 Hz and a 240 Hz display, and the loop sleeps when the card is hidden and settled.
 *
 * When a row lights up because the page scrolled under a still cursor, or before the
 * pointer has moved at all, there is no trustworthy pointer position, so the card is
 * pinned to the right side of that row instead and follows the row until the pointer moves.
 */
export function CursorPreview({ items, activeId, anchorRef }: CursorPreviewProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const activateRef = useRef<() => void>(() => {})
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
    if (activeId !== null) activateRef.current()
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
    let hasPointer = false
    let pointerX = 0
    let pointerY = 0
    let lastScroll = -Infinity
    let mode: 'pointer' | 'anchor' = 'anchor'

    const anchorTarget = () => {
      const anchor = anchorRef.current
      const card = elementRef.current?.firstElementChild as HTMLElement | null
      if (!anchor || !card) return false
      const rect = anchor.getBoundingClientRect()
      const style = getComputedStyle(card)
      const marginLeft = parseFloat(style.marginLeft) || 0
      const marginTop = parseFloat(style.marginTop) || 0
      // The card is drawn at (x + marginLeft, y + marginTop); solve for x and y so its
      // right edge sits ANCHOR_INSET_PX inside the row and it is centred on the row.
      targetX = rect.right - ANCHOR_INSET_PX - card.offsetWidth - marginLeft
      targetY = rect.top + rect.height / 2 - card.offsetHeight / 2 - marginTop
      return true
    }

    const tick = (now: number) => {
      const element = elementRef.current
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
      last = now
      if (mode === 'anchor' && activeRef.current) anchorTarget()
      const ease = damp(dt, 11)
      x += (targetX - x) * ease
      y += (targetY - y) * ease
      const lean = mode === 'pointer' ? clamp((targetX - x) * 0.08, -9, 9) : 0
      tilt += (lean - tilt) * damp(dt, 9)
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

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    const pointerInsideAnchor = () => {
      const anchor = anchorRef.current
      if (!anchor || !hasPointer) return false
      const rect = anchor.getBoundingClientRect()
      return (
        pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom
      )
    }

    // Runs when a row becomes active: pick a mode and jump straight to it, so the card
    // never slides in from wherever it was last (or from the corner of the page).
    activateRef.current = () => {
      const scrolling = performance.now() - lastScroll < SCROLL_GRACE_MS
      if (!scrolling && pointerInsideAnchor()) {
        mode = 'pointer'
        targetX = pointerX
        targetY = pointerY
      } else {
        mode = 'anchor'
        if (!anchorTarget()) return
      }
      x = targetX
      y = targetY
      tilt = 0
      start()
    }

    const handleMove = (event: PointerEvent) => {
      hasPointer = true
      pointerX = event.clientX
      pointerY = event.clientY
      // Browsers send synthetic moves while the page scrolls; only a real move takes over.
      if (performance.now() - lastScroll < SCROLL_GRACE_MS) return
      if (mode === 'anchor' && activeRef.current) {
        mode = 'pointer'
      }
      if (mode === 'pointer') {
        targetX = pointerX
        targetY = pointerY
      }
      if (activeRef.current) start()
    }

    const handleScroll = () => {
      lastScroll = performance.now()
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    if (activeRef.current) activateRef.current()
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('scroll', handleScroll)
      activateRef.current = () => {}
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enabled, anchorRef])

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
