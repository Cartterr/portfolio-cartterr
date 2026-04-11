import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import type { GalleryImage } from '../imageManifest'

type ImageGalleryProps = {
  images: GalleryImage[]
  label: string
  autoplay?: boolean
  intervalMs?: number
  priority?: boolean
  variant?: 'default' | 'featured' | 'portrait'
}

const ImageGallery = ({
  images,
  label,
  autoplay = false,
  intervalMs = 4500,
  priority = false,
  variant = 'default',
}: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [renderedIndex, setRenderedIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const stageRef = useRef<HTMLDivElement | null>(null)
  const thumbnailRailRef = useRef<HTMLDivElement | null>(null)
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([])
  const loadedImageUrlsRef = useRef<Set<string>>(new Set())
  const transitionTokenRef = useRef(0)

  useEffect(() => {
    setActiveIndex(0)
    setRenderedIndex(0)
    setPreviousIndex(null)
  }, [images])

  useEffect(() => {
    if (!autoplay || images.length < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [autoplay, images.length, intervalMs])

  useLayoutEffect(() => {
    const rail = thumbnailRailRef.current
    const activeThumbnail = thumbnailRefs.current[activeIndex]
    if (!rail || !activeThumbnail) return

    const syncThumbnailRail = (behavior: ScrollBehavior) => {
      const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0)
      if (maxScrollLeft <= 0) return

      const railRect = rail.getBoundingClientRect()
      const thumbRect = activeThumbnail.getBoundingClientRect()
      const edgePadding = 12
      const visibleLeft = railRect.left + edgePadding
      const visibleRight = railRect.right - edgePadding

      let targetScrollLeft = rail.scrollLeft

      if (thumbRect.left < visibleLeft) {
        targetScrollLeft += thumbRect.left - visibleLeft
      } else if (thumbRect.right > visibleRight) {
        targetScrollLeft += thumbRect.right - visibleRight
      } else {
        return
      }

      rail.scrollTo({
        left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
        behavior,
      })
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'
    const frame = window.requestAnimationFrame(() => {
      syncThumbnailRail(scrollBehavior)
    })
    const correctionTimer = prefersReducedMotion
      ? null
      : window.setTimeout(() => {
          syncThumbnailRail('auto')
        }, 260)

    return () => {
      window.cancelAnimationFrame(frame)
      if (correctionTimer !== null) {
        window.clearTimeout(correctionTimer)
      }
    }
  }, [activeIndex])

  const preloadImage = (image: GalleryImage) =>
    new Promise<void>((resolve) => {
      if (loadedImageUrlsRef.current.has(image.url)) {
        resolve()
        return
      }

      const preloadTarget = new window.Image()
      preloadTarget.src = image.url

      const markLoaded = () => {
        loadedImageUrlsRef.current.add(image.url)
        resolve()
      }

      if (preloadTarget.complete) {
        markLoaded()
        return
      }

      preloadTarget.onload = markLoaded
      preloadTarget.onerror = () => resolve()
      preloadTarget.decode?.().then(markLoaded).catch(() => undefined)
    })

  useEffect(() => {
    images.forEach((image) => {
      void preloadImage(image)
    })
  }, [images])

  useEffect(() => {
    const nextImage = images[activeIndex]
    if (!nextImage || activeIndex === renderedIndex) return

    const transitionToken = ++transitionTokenRef.current

    void preloadImage(nextImage).then(() => {
      if (transitionToken !== transitionTokenRef.current) return

      setPreviousIndex(renderedIndex)
      setRenderedIndex(activeIndex)
    })
  }, [activeIndex, images, renderedIndex])

  useEffect(() => {
    if (previousIndex === null) return

    const timer = window.setTimeout(() => {
      setPreviousIndex(null)
    }, 260)

    return () => window.clearTimeout(timer)
  }, [previousIndex])

  const activeImage = images[activeIndex] ?? null
  const renderedImage = images[renderedIndex] ?? null
  const previousImage = previousIndex === null ? null : images[previousIndex] ?? null

  const getImageFrame = (image: GalleryImage | null) => {
    const stage = stageRef.current
    const stageWidth = stageSize.width || stage?.clientWidth || 0
    const stageHeight = stageSize.height || stage?.clientHeight || 0
    if (!image || !stageWidth || !stageHeight) {
      return {
        className: 'gallery-stage-media gallery-stage-media-square',
        style: {
          width: '100%',
          height: '100%',
        } as CSSProperties,
      }
    }

    const imageRatio = image.width / image.height
    const stageRatio = stageWidth / stageHeight

    if (Math.abs(imageRatio - stageRatio) < 0.08) {
      return {
        className: 'gallery-stage-media gallery-stage-media-square',
        style: {
          width: '100%',
          height: '100%',
        } as CSSProperties,
      }
    }

    if (imageRatio > stageRatio) {
      const renderedWidth = stageHeight * imageRatio
      const overflowX = Math.max(renderedWidth - stageWidth, 0)
      const startOffsetX = overflowX * 0.25
      const endOffsetX = overflowX * 0.75

      return {
        className: 'gallery-stage-media gallery-stage-media-landscape',
        style: {
          width: `${renderedWidth}px`,
          height: `${stageHeight}px`,
          '--gallery-pan-start-x': `${startOffsetX}px`,
          '--gallery-pan-end-x': `${endOffsetX}px`,
        } as CSSProperties,
      }
    }

    const renderedHeight = stageWidth / imageRatio
    const overflowY = Math.max(renderedHeight - stageHeight, 0)
    const startOffsetY = overflowY * 0.25
    const endOffsetY = overflowY * 0.75

    return {
      className: 'gallery-stage-media gallery-stage-media-portrait',
      style: {
        width: `${stageWidth}px`,
        height: `${renderedHeight}px`,
        '--gallery-pan-start-y': `${startOffsetY}px`,
        '--gallery-pan-end-y': `${endOffsetY}px`,
      } as CSSProperties,
    }
  }

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || !renderedImage) return

    const updateStageSize = () => {
      setStageSize({
        width: stage.clientWidth,
        height: stage.clientHeight,
      })
    }

    updateStageSize()

    const resizeObserver = new ResizeObserver(() => {
      updateStageSize()
    })

    resizeObserver.observe(stage)
    return () => resizeObserver.disconnect()
  }, [renderedImage])

  if (!activeImage || !renderedImage) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-sm text-zinc-300">
        No visuals available for this section yet.
      </div>
    )
  }

  const goTo = (nextIndex: number) => setActiveIndex((nextIndex + images.length) % images.length)
  const isFeatured = variant === 'featured'
  const isPortrait = variant === 'portrait'
  const stageHeightClass = isFeatured
    ? 'h-[24rem] xl:h-[26rem]'
    : isPortrait
      ? 'h-[28rem] sm:h-[31rem] lg:h-[34rem]'
      : 'h-[22rem]'
  const thumbClass = isFeatured ? 'h-[4.5rem] w-32' : isPortrait ? 'h-[4.25rem] w-24 sm:w-28' : 'h-16 w-28'
  const shellClassName = isPortrait
    ? 'mx-auto w-full max-w-[40rem] rounded-[1.9rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.28)]'
    : `min-w-0 rounded-[1.9rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.28)] ${isFeatured ? 'flex h-full flex-col justify-between' : ''}`
  const renderedFrame = getImageFrame(renderedImage)
  const previousFrame = getImageFrame(previousImage)
  const renderedStageMediaClass = `${renderedFrame.className}${autoplay ? ' gallery-stage-media-once' : ''}${previousImage ? ' gallery-stage-media-enter' : ''}`
  const renderedStageMediaStyle = {
    ...renderedFrame.style,
    '--gallery-pan-duration': `${autoplay ? intervalMs : 12000}ms`,
  } as CSSProperties
  const previousStageMediaClass = `${previousFrame.className}${autoplay ? ' gallery-stage-media-once' : ''} gallery-stage-media-exit`
  const previousStageMediaStyle = {
    ...previousFrame.style,
    '--gallery-pan-duration': `${autoplay ? intervalMs : 12000}ms`,
  } as CSSProperties

  return (
    <>
      <div
        className={shellClassName}
      >
        <div className="relative overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#101010]">
          <div ref={stageRef} className={`relative overflow-hidden rounded-[1.15rem] bg-[#111111] ${stageHeightClass}`}>
            {previousImage ? (
              <img
                key={`${previousImage.url}-previous`}
                src={previousImage.url}
                alt=""
                aria-hidden="true"
                className={previousStageMediaClass}
                style={previousStageMediaStyle}
                width={previousImage.width}
                height={previousImage.height}
                decoding="async"
              />
            ) : null}
            <img
              key={renderedImage.url}
              src={renderedImage.url}
              alt={`${label} visual ${activeIndex + 1}`}
              className={renderedStageMediaClass}
              style={renderedStageMediaStyle}
              width={renderedImage.width}
              height={renderedImage.height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/82 via-black/28 to-transparent px-5 pb-5 pt-16">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white/18"
            >
              <Expand className="h-4 w-4" />
              Expand
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/12"
              aria-label={`Previous ${label} image`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/12"
              aria-label={`Next ${label} image`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div ref={thumbnailRailRef} className="gallery-thumbnail-rail min-w-0 flex-1 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
            {images.map((image, index) => (
              <button
                key={image.name}
                type="button"
                onClick={() => goTo(index)}
                ref={(node) => {
                  thumbnailRefs.current[index] = node
                }}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={`${thumbClass} shrink-0 overflow-hidden rounded-[1rem] border bg-[#111111] transition ${
                  index === activeIndex
                    ? 'border-orange-300/70 bg-[#17120f] opacity-100 ring-1 ring-orange-200/35 shadow-[0_0_0_1px_rgba(253,186,116,0.16),0_12px_26px_rgba(0,0,0,0.3)]'
                    : 'border-white/10 opacity-60 hover:border-white/20 hover:opacity-100'
                }`}
                aria-label={`View ${label} image ${index + 1}`}
              >
                <img
                  src={image.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  width="320"
                  height="320"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 px-4 py-6"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={activeImage.url}
              alt={`${label} expanded visual ${activeIndex + 1}`}
              className="max-h-[82vh] w-full rounded-[2rem] object-contain"
              width={activeImage.width}
              height={activeImage.height}
              decoding="async"
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ImageGallery
