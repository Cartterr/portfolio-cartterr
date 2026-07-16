import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PortfolioMedia } from '../../data/types'
import { PortfolioCarousel } from './PortfolioCarousel'

const embla = vi.hoisted(() => {
  const listeners = new Map<string, Set<() => void>>()
  let selectedIndex = 0

  const emit = (event: string) => {
    for (const listener of listeners.get(event) ?? []) listener()
  }

  const api = {
    off: (event: string, listener: () => void) => listeners.get(event)?.delete(listener),
    on: (event: string, listener: () => void) => {
      const eventListeners = listeners.get(event) ?? new Set<() => void>()
      eventListeners.add(listener)
      listeners.set(event, eventListeners)
    },
    scrollTo: (index: number) => {
      selectedIndex = index
      emit('select')
    },
    selectedScrollSnap: () => selectedIndex,
  }

  return {
    api,
    ref: vi.fn(),
    reset: () => {
      listeners.clear()
      selectedIndex = 0
    },
    selectFromDrag: (index: number) => {
      selectedIndex = index
      emit('select')
    },
  }
})

vi.mock('embla-carousel-react', () => ({
  default: () => [embla.ref, embla.api],
}))

const media = Array.from({ length: 3 }, (_, index) => ({
  id: `drag-${index + 1}`,
  kind: 'image' as const,
  src: `/drag-${index + 1}.jpg`,
  thumbnail: `/drag-${index + 1}-thumb.jpg`,
  width: 1200,
  height: 800,
  alt: `Drag photograph ${index + 1}`,
  caption: `Drag photograph caption ${index + 1}.`,
  fit: 'cover' as const,
  objectPosition: '50% 50%',
  rights: {
    owner: 'Test owner',
    source: 'Test fixture',
    clearance: 'cleared-project-capture' as const,
  },
  publication: 'approved' as const,
  storyId: 'drag-story',
})) satisfies PortfolioMedia[]

let intersectionCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined

class IntersectionObserverMock {
  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    intersectionCallback = callback
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  embla.reset()
  intersectionCallback = undefined
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('PortfolioCarousel Embla selection', () => {
  it('announces a pointer-driven Embla selection through the polite status', () => {
    render(<PortfolioCarousel id="drag" label="Drag gallery" media={media} />)

    fireEvent.pointerDown(screen.getByRole('region', { name: 'Drag gallery' }))
    act(() => embla.selectFromDrag(1))

    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Image 2 of 3')
  })

  it('keeps an autoplay-driven Embla selection silent', () => {
    vi.useFakeTimers()
    render(
      <PortfolioCarousel
        autoplayMs={100}
        id="autoplay-drag"
        label="Autoplay drag gallery"
        media={media}
      />,
    )
    act(() => {
      intersectionCallback?.([{ isIntersecting: true } as IntersectionObserverEntry])
    })
    act(() => vi.advanceTimersByTime(100))

    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
