import Fade from 'embla-carousel-fade'
import useEmblaCarousel from 'embla-carousel-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { PortfolioMedia } from '../../data/types'
import { useNearViewport } from '../../hooks/useNearViewport'
import '../../styles/gallery.css'
import { LightboxDialog } from './LightboxDialog'
import { MediaFrame } from './MediaFrame'

type PortfolioCarouselProps = {
  id: string
  label: string
  media: PortfolioMedia[]
  autoplayMs?: number
  featured?: boolean
}

const wrapIndex = (index: number, length: number) =>
  length === 0 ? 0 : ((index % length) + length) % length

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function PortfolioCarousel({
  id,
  label,
  media,
  autoplayMs,
  featured = false,
}: PortfolioCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [autoplayStopped, setAutoplayStopped] = useState(false)
  const [motionReduced, setMotionReduced] = useState(prefersReducedMotion)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const pointerSelectionPendingRef = useRef(false)
  const [nearViewportRef, hasActivated, isNearViewport] = useNearViewport<HTMLDivElement>()
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { active: hasActivated, loop: media.length > 1, duration: 28 },
    [Fade()],
  )
  const total = media.length

  const viewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      emblaRef(node)
      nearViewportRef(node)
    },
    [emblaRef, nearViewportRef],
  )

  const stopAutoplay = useCallback(() => setAutoplayStopped(true), [])

  const selectIndex = useCallback(
    (nextIndex: number, announce: boolean) => {
      if (total === 0) return
      const normalizedIndex = wrapIndex(nextIndex, total)
      setActiveIndex(normalizedIndex)
      emblaApi?.scrollTo(normalizedIndex)
      if (announce) setAnnouncement(`Image ${normalizedIndex + 1} of ${total}`)
    },
    [emblaApi, total],
  )

  const selectManually = useCallback(
    (nextIndex: number) => {
      stopAutoplay()
      selectIndex(nextIndex, true)
    },
    [selectIndex, stopAutoplay],
  )

  useEffect(() => {
    if (!emblaApi) return
    const syncSelectedSlide = () => setActiveIndex(emblaApi.selectedScrollSnap())
    const handleSelection = () => {
      const selectedIndex = emblaApi.selectedScrollSnap()
      setActiveIndex(selectedIndex)
      if (pointerSelectionPendingRef.current) {
        setAnnouncement(`Image ${selectedIndex + 1} of ${total}`)
        pointerSelectionPendingRef.current = false
      }
    }
    emblaApi.on('select', handleSelection)
    emblaApi.on('reInit', syncSelectedSlide)
    return () => {
      emblaApi.off('select', handleSelection)
      emblaApi.off('reInit', syncSelectedSlide)
    }
  }, [emblaApi, total])

  useEffect(() => {
    if (
      !autoplayMs ||
      autoplayMs <= 0 ||
      autoplayStopped ||
      motionReduced ||
      !isNearViewport ||
      total < 2
    ) {
      return
    }
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = wrapIndex(currentIndex + 1, total)
        emblaApi?.scrollTo(nextIndex)
        return nextIndex
      })
    }, autoplayMs)
    return () => window.clearInterval(timer)
  }, [autoplayMs, autoplayStopped, emblaApi, isNearViewport, motionReduced, total])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      setMotionReduced(event.matches)
      if (event.matches) stopAutoplay()
    }
    mediaQuery.addEventListener('change', handleMotionPreference)
    return () => mediaQuery.removeEventListener('change', handleMotionPreference)
  }, [stopAutoplay])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') stopAutoplay()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [stopAutoplay])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    selectManually(activeIndex + (event.key === 'ArrowRight' ? 1 : -1))
  }

  const sourceIsEnabled = (index: number) => {
    if (!isNearViewport || total === 0) return false
    return (
      index === activeIndex ||
      index === wrapIndex(activeIndex - 1, total) ||
      index === wrapIndex(activeIndex + 1, total)
    )
  }

  return (
    <>
      <section
      aria-label={label}
      aria-roledescription="carousel"
      className="portfolio-carousel"
      data-autoplay-ms={autoplayMs}
      data-featured={featured || undefined}
      id={id}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest('[data-autoplay-control]')) stopAutoplay()
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={stopAutoplay}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest('[data-autoplay-control]')) return
        pointerSelectionPendingRef.current = true
        stopAutoplay()
      }}
      role="region"
      >
        <div className="portfolio-carousel__viewport" ref={viewportRef}>
        <div className="portfolio-carousel__container">
          {media.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <figure
                aria-hidden={isActive ? undefined : 'true'}
                aria-label={`Image ${index + 1} of ${total}`}
                aria-roledescription="slide"
                className="portfolio-carousel__slide"
                data-active={isActive || undefined}
                id={`${id}-slide-${index + 1}`}
                key={item.id}
                role="group"
              >
                <MediaFrame
                  active={isActive}
                  className="portfolio-carousel__media"
                  media={item}
                  priority={featured}
                  sourceEnabled={sourceIsEnabled(index)}
                />
                {isActive ? (
                  <button
                    aria-label={`Open ${item.alt} in expanded view`}
                    className="portfolio-carousel__expand"
                    onClick={() => {
                      stopAutoplay()
                      setLightboxOpen(true)
                    }}
                    ref={expandButtonRef}
                    type="button"
                  >
                    <span aria-hidden="true">↗</span>
                  </button>
                ) : null}
                <figcaption>{item.caption}</figcaption>
              </figure>
            )
          })}
        </div>
        </div>

        <div className="portfolio-carousel__meta">
        <div className="portfolio-carousel__controls">
          <button
            aria-label="Previous image"
            disabled={total < 2}
            onClick={() => selectManually(activeIndex - 1)}
            type="button"
          >
            <span aria-hidden="true">←</span>
          </button>
          <span aria-hidden="true" className="portfolio-carousel__count">
            {total === 0 ? 0 : activeIndex + 1} of {total}
          </span>
          <button
            aria-label="Next image"
            disabled={total < 2}
            onClick={() => selectManually(activeIndex + 1)}
            type="button"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <span aria-live="polite" aria-atomic="true" className="sr-only" role="status">
          {announcement}
        </span>
        {autoplayMs && autoplayMs > 0 && total > 1 && !motionReduced ? (
          <button
            aria-label={autoplayStopped ? 'Play slideshow' : 'Pause slideshow'}
            className="portfolio-carousel__autoplay"
            data-autoplay-control="true"
            onClick={() => setAutoplayStopped((stopped) => !stopped)}
            type="button"
          >
            <span aria-hidden="true">{autoplayStopped ? '▶' : 'Ⅱ'}</span>
            <span>{autoplayStopped ? 'Play' : 'Pause'}</span>
          </button>
        ) : null}
        </div>

        {total > 1 ? (
          <div aria-label={`${label} image selection`} className="portfolio-carousel__thumbnails">
            {media.map((item, index) => (
              <button
                aria-controls={`${id}-slide-${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                aria-label={`Image ${index + 1} of ${total}: ${item.alt}`}
                key={item.id}
                onClick={() => selectManually(index)}
                type="button"
              >
                <img alt="" height="64" loading="lazy" src={item.thumbnail} width="88" />
              </button>
            ))}
          </div>
        ) : null}
      </section>
      <LightboxDialog
        index={activeIndex}
        media={media}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={selectManually}
        open={lightboxOpen}
        returnFocusRef={expandButtonRef}
      />
    </>
  )
}
