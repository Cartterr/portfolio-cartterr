import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import type { PortfolioImageMedia } from '../../data/types'
import { canAnimate } from '../lib/env'
import { LightboxContext, type OpenLightbox } from './lightboxContext'

type LightboxState = { items: PortfolioImageMedia[]; index: number } | null

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> }
}

/**
 * One native <dialog> image viewer for the whole page. Opening morphs the clicked
 * thumbnail into the full image with the View Transitions API where it exists.
 */
export function LightboxProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<LightboxState>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const open = useCallback<OpenLightbox>((items, index, source) => {
    if (!items.length) return
    returnFocusRef.current = (document.activeElement as HTMLElement | null) ?? null
    const next = { items, index }
    const transitionDocument = document as ViewTransitionDocument

    if (source && canAnimate() && typeof transitionDocument.startViewTransition === 'function') {
      source.style.setProperty('view-transition-name', 'jc-media')
      const transition = transitionDocument.startViewTransition(() => {
        source.style.removeProperty('view-transition-name')
        flushSync(() => setState(next))
      })
      transition.finished.catch(() => undefined)
      return
    }
    setState(next)
  }, [])

  const close = useCallback(() => {
    setState(null)
    returnFocusRef.current?.focus({ preventScroll: true })
  }, [])

  const step = useCallback((direction: 1 | -1) => {
    setState((current) =>
      current
        ? {
            ...current,
            index: (current.index + direction + current.items.length) % current.items.length,
          }
        : current,
    )
  }, [])

  const isOpen = state !== null

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal()
      else dialog.setAttribute('open', '')
      closeButtonRef.current?.focus({ preventScroll: true })
    } else if (!isOpen && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, step])

  const media = state ? state.items[state.index] : null
  const many = (state?.items.length ?? 0) > 1

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <dialog
        aria-label="Image viewer"
        className="jc-lightbox"
        onCancel={(event) => {
          event.preventDefault()
          close()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
        ref={dialogRef}
      >
        {media && state ? (
          <figure className="jc-lightbox__figure">
            <img
              alt={media.alt}
              className="jc-lightbox__image"
              decoding="async"
              height={media.height}
              key={media.id}
              src={media.src}
              width={media.width}
            />
            <figcaption className="jc-lightbox__bar">
              <p className="jc-lightbox__caption">{media.caption}</p>
              <div className="jc-lightbox__controls">
                {many ? (
                  <>
                    <button aria-label="Previous image" onClick={() => step(-1)} type="button">
                      ←
                    </button>
                    <span aria-live="polite" className="jc-lightbox__count">
                      {String(state.index + 1).padStart(2, '0')} /{' '}
                      {String(state.items.length).padStart(2, '0')}
                    </span>
                    <button aria-label="Next image" onClick={() => step(1)} type="button">
                      →
                    </button>
                  </>
                ) : null}
                <button
                  aria-label="Close image viewer"
                  className="jc-lightbox__close"
                  onClick={close}
                  ref={closeButtonRef}
                  type="button"
                >
                  Close
                </button>
              </div>
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </LightboxContext.Provider>
  )
}
