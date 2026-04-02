import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import type { GalleryImage } from '../imageManifest'

type ImageGalleryProps = {
  images: GalleryImage[]
  label: string
  autoplay?: boolean
  intervalMs?: number
  priority?: boolean
}

const ImageGallery = ({
  images,
  label,
  autoplay = false,
  intervalMs = 4500,
  priority = false,
}: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  useEffect(() => {
    if (!autoplay || isPaused || images.length < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [autoplay, images.length, intervalMs, isPaused])

  const activeImage = useMemo(() => images[activeIndex] ?? null, [activeIndex, images])

  if (!activeImage) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-sm text-zinc-300">
        No visuals available for this section yet.
      </div>
    )
  }

  const goTo = (nextIndex: number) => setActiveIndex((nextIndex + images.length) % images.length)

  return (
    <>
      <div
        className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_30px_120px_rgba(0,0,0,0.28)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#171717]">
          <img
            key={activeImage.url}
            src={activeImage.url}
            alt={`${label} visual ${activeIndex + 1}`}
            className="gallery-image h-[22rem] w-full object-cover"
            loading={priority ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/20 to-transparent px-5 pb-5 pt-16">
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

        <div className="mt-3 flex items-center gap-3">
          <div className="flex gap-2">
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

          <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-6">
            {images.slice(0, 6).map((image, index) => (
              <button
                key={image.name}
                type="button"
                onClick={() => goTo(index)}
                className={`overflow-hidden rounded-2xl border transition ${
                  index === activeIndex
                    ? 'border-white opacity-100'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
                aria-label={`View ${label} image ${index + 1}`}
              >
                <img src={image.url} alt="" className="h-16 w-full object-cover" loading="lazy" />
              </button>
            ))}
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
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ImageGallery
