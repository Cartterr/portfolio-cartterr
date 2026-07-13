import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PortfolioMedia } from '../../data/types'
import { PortfolioCarousel } from './PortfolioCarousel'

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void

let intersectionCallbacks: IntersectionCallback[] = []
let reducedMotion = false

const media = Array.from({ length: 5 }, (_, index) => ({
  id: `media-${index + 1}`,
  kind: 'image' as const,
  src: `/media-${index + 1}.jpg`,
  thumbnail: `/media-${index + 1}-thumb.jpg`,
  width: 1200,
  height: 800,
  alt: `Portfolio photograph ${index + 1}`,
  caption: `Context for portfolio photograph ${index + 1}.`,
  fit: index === 1 ? ('contain' as const) : ('cover' as const),
  objectPosition: index === 2 ? '30% 45%' : '50% 50%',
  sources: [
    { type: 'image/webp' as const, srcSet: `/media-${index + 1}.webp 1x` },
  ],
  rights: {
    owner: 'Test owner',
    source: 'Test fixture',
    clearance: 'cleared-project-capture' as const,
  },
  publication: 'approved' as const,
  storyId: 'test-story',
})) satisfies PortfolioMedia[]

class IntersectionObserverMock {
  constructor(callback: IntersectionCallback) {
    intersectionCallbacks.push(callback)
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const activateGallery = () => {
  act(() => {
    for (const callback of intersectionCallbacks) {
      callback([{ isIntersecting: true } as IntersectionObserverEntry])
    }
  })
}

const mainImage = (galleryId: string, number: number) => {
  const slide = document.getElementById(`${galleryId}-slide-${number}`)
  const image = slide?.querySelector('img')
  expect(image).not.toBeNull()
  return image as HTMLImageElement
}

beforeEach(() => {
  intersectionCallbacks = []
  reducedMotion = false
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: reducedMotion,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('PortfolioCarousel', () => {
  it('exposes carousel and slide semantics with one active image', () => {
    render(<PortfolioCarousel id="profile" label="Profile gallery" media={media.slice(0, 3)} />)

    const region = screen.getByRole('region', { name: 'Profile gallery' })
    expect(region).toHaveAttribute('aria-roledescription', 'carousel')
    expect(screen.getByRole('group', { name: 'Image 1 of 3' })).toHaveAttribute(
      'aria-roledescription',
      'slide',
    )
    expect(document.querySelectorAll('.portfolio-carousel__slide:not([aria-hidden="true"])')).toHaveLength(1)
    expect(screen.getByRole('button', { name: /image 1 of 3/i })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('supports native controls, selected thumbnails, and arrow keys', async () => {
    const user = userEvent.setup()
    render(<PortfolioCarousel id="profile" label="Profile gallery" media={media.slice(0, 3)} />)

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /image 2 of 3/i })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Image 2 of 3')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('3 of 3')).toBeInTheDocument()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('opens the active image in the lightbox and restores focus when closed', async () => {
    const user = userEvent.setup()
    render(<PortfolioCarousel id="expand" label="Expanded gallery" media={media.slice(0, 3)} />)
    activateGallery()

    const expand = screen.getByRole('button', {
      name: 'Open Portfolio photograph 1 in expanded view',
    })
    await user.click(expand)
    expect(screen.getByRole('dialog', { name: 'Expanded media viewer' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close expanded view' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(expand).toHaveFocus()
  })

  it('omits full-size sources while dormant and loads only active and adjacent slides nearby', () => {
    render(<PortfolioCarousel id="load" label="Loading gallery" media={media} />)

    for (let number = 1; number <= media.length; number += 1) {
      expect(mainImage('load', number)).not.toHaveAttribute('src')
      expect(document.querySelector(`#load-slide-${number} source`)).not.toHaveAttribute('srcset')
    }

    activateGallery()

    expect(mainImage('load', 1)).toHaveAttribute('src', '/media-1.jpg')
    expect(mainImage('load', 2)).toHaveAttribute('src', '/media-2.jpg')
    expect(mainImage('load', 5)).toHaveAttribute('src', '/media-5.jpg')
    expect(mainImage('load', 3)).not.toHaveAttribute('src')
    expect(mainImage('load', 4)).not.toHaveAttribute('src')

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(mainImage('load', 1)).toHaveAttribute('src', '/media-1.jpg')
    expect(mainImage('load', 2)).toHaveAttribute('src', '/media-2.jpg')
    expect(mainImage('load', 3)).toHaveAttribute('src', '/media-3.jpg')
    expect(mainImage('load', 5)).not.toHaveAttribute('src')
  })

  it('does not autoplay when reduced motion is requested', () => {
    vi.useFakeTimers()
    reducedMotion = true
    render(
      <PortfolioCarousel
        id="reduced"
        label="Reduced-motion gallery"
        media={media.slice(0, 3)}
        autoplayMs={100}
      />,
    )
    activateGallery()

    act(() => vi.advanceTimersByTime(500))

    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('keeps autoplay changes out of the live region and stops permanently on focus', () => {
    vi.useFakeTimers()
    render(
      <PortfolioCarousel
        id="auto"
        label="Autoplay gallery"
        media={media.slice(0, 3)}
        autoplayMs={100}
      />,
    )
    activateGallery()

    act(() => vi.advanceTimersByTime(100))
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()

    fireEvent.focus(screen.getByRole('button', { name: 'Next image' }))
    act(() => vi.advanceTimersByTime(500))
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
  })

  it('stops autoplay permanently after manual interaction', () => {
    vi.useFakeTimers()
    render(
      <PortfolioCarousel
        id="manual"
        label="Manual gallery"
        media={media.slice(0, 3)}
        autoplayMs={100}
      />,
    )
    activateGallery()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(500))
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
  })
})
