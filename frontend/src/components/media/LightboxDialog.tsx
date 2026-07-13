import { createPortal } from 'react-dom'
import { useCallback, useEffect, useId, useRef, type RefObject } from 'react'
import type { PortfolioMedia } from '../../data/types'
import '../../styles/gallery.css'
import { MediaFrame } from './MediaFrame'

type LightboxDialogProps = {
  open: boolean
  media: PortfolioMedia[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
  returnFocusRef: RefObject<HTMLElement | null>
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length

export function LightboxDialog({
  open,
  media,
  index,
  onIndexChange,
  onClose,
  returnFocusRef,
}: LightboxDialogProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const indexRef = useRef(index)
  const onCloseRef = useRef(onClose)
  const onIndexChangeRef = useRef(onIndexChange)
  const captionId = useId()
  indexRef.current = index
  onCloseRef.current = onClose
  onIndexChangeRef.current = onIndexChange
  const restoreFocus = useCallback(() => returnFocusRef.current?.focus(), [returnFocusRef])

  useEffect(() => {
    if (!open || media.length === 0) return

    const portalRoot = document.querySelector<HTMLElement>('[data-lightbox-root]')
    const backgroundElements = Array.from(document.body.children).filter(
      (element) => element !== portalRoot,
    )
    const inertState = backgroundElements.map((element) => ({
      element,
      wasInert: element.hasAttribute('inert'),
    }))
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    for (const background of backgroundElements) background.setAttribute('inert', '')
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const direction = event.key === 'ArrowRight' ? 1 : -1
        onIndexChangeRef.current(wrapIndex(indexRef.current + direction, media.length))
        return
      }

      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      )
      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      for (const { element, wasInert } of inertState) {
        if (!wasInert) element.removeAttribute('inert')
      }
      restoreFocus()
    }
  }, [media.length, open, restoreFocus])

  if (!open || media.length === 0) return null

  const activeIndex = wrapIndex(index, media.length)
  const activeMedia = media[activeIndex]
  const hasMultipleItems = media.length > 1

  return createPortal(
    <div
      className="lightbox-dialog__backdrop"
      data-lightbox-root=""
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-describedby={captionId}
        aria-label="Expanded media viewer"
        aria-modal="true"
        className="lightbox-dialog"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="lightbox-dialog__header">
          <span>{activeIndex + 1} of {media.length}</span>
          <button
            aria-label="Close expanded view"
            className="lightbox-dialog__close"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <figure className="lightbox-dialog__figure">
          <MediaFrame
            active
            className="lightbox-dialog__media"
            media={activeMedia}
            priority
            sourceEnabled
          />
          <figcaption id={captionId}>{activeMedia.caption}</figcaption>
        </figure>

        <div className="lightbox-dialog__controls">
          <button
            aria-label="Previous image"
            disabled={!hasMultipleItems}
            onClick={() => onIndexChange(wrapIndex(activeIndex - 1, media.length))}
            type="button"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            aria-label="Next image"
            disabled={!hasMultipleItems}
            onClick={() => onIndexChange(wrapIndex(activeIndex + 1, media.length))}
            type="button"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
