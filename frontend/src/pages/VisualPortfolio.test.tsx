import { render, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { visualPortfolio } from '../data/visual'
import { requestGraphicsFallback } from '../hooks/useGraphicsCapability'
import { VisualHeroErrorBoundary, VisualPortfolio } from './VisualPortfolio'

const requestGraphicsFallbackMock = vi.hoisted(() => vi.fn())

vi.mock('../hooks/useGraphicsCapability', () => ({
  requestGraphicsFallback: requestGraphicsFallbackMock,
  useGraphicsCapability: () => 'full',
}))

vi.mock('../visual/VisualHeroScene', () => ({
  default: function SuspendedVisualHeroScene() {
    throw new Promise<never>(() => undefined)
  },
}))

class ObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', ObserverMock)
  vi.stubGlobal('ResizeObserver', ObserverMock)
})

describe('VisualPortfolio', () => {
  it('renders the complete visual document while the scene import is suspended', () => {
    const { container } = render(<VisualPortfolio />)
    const page = container.querySelector<HTMLElement>('[data-visual-portfolio]')!

    expect(page).toBeInTheDocument()
    expect(
      Array.from(page.children)
        .filter((element) => element.tagName === 'SECTION')
        .map(({ id }) => id),
    ).toEqual(['hero', 'about', 'experience', 'work', 'capabilities', 'contact'])

    expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(
      visualPortfolio.hero.title,
    )
    expect(
      within(page).getByRole('link', { name: visualPortfolio.hero.primaryCta.label }),
    ).toHaveAttribute('href', '#work')
    expect(
      within(page).getByRole('link', { name: visualPortfolio.hero.secondaryCta.label }),
    ).toHaveAttribute('href', '#contact')
    expect(within(page).getByTestId('visual-hero-poster')).toBeInTheDocument()

    expect(within(page).getByRole('heading', { level: 2, name: /profile/i })).toBeInTheDocument()
    expect(within(page).getByRole('heading', { level: 2, name: /laborator/i })).toBeInTheDocument()
    expect(within(page).getByRole('heading', { level: 2, name: /selected visual work/i })).toBeInTheDocument()
    expect(within(page).getByRole('heading', { level: 2, name: /pipeline/i })).toBeInTheDocument()
    expect(within(page).getByRole('heading', { name: visualPortfolio.contact.heading })).toBeInTheDocument()
  })

  it('shows three cleared project stories as contextual single-image carousels', () => {
    const { container } = render(<VisualPortfolio />)
    const page = container.querySelector<HTMLElement>('[data-visual-portfolio]')!
    const stories = within(page).getAllByTestId('visual-project-story')

    expect(stories).toHaveLength(3)
    expect(within(page).getByRole('heading', { name: /Marga-Marga 3D geoscience pipeline/i })).toBeInTheDocument()
    expect(within(page).getByRole('heading', { name: /Parametric shelving configurator/i })).toBeInTheDocument()
    expect(within(page).getByRole('heading', { name: /Drone Response spatial autonomy/i })).toBeInTheDocument()

    stories.forEach((story) => {
      const carousel = within(story).getByRole('region', { name: /project evidence/i })
      expect(carousel.querySelectorAll('.portfolio-carousel__slide').length).toBeGreaterThan(0)
      expect(carousel.querySelectorAll('[data-active="true"]')).toHaveLength(1)
    })

    expect(page.querySelector('[data-layout="image-wall"]')).not.toBeInTheDocument()
  })

  it('keeps the visual narrative grounded in supported graphics and spatial work', () => {
    const { container } = render(<VisualPortfolio />)
    const copy = container.textContent ?? ''

    expect(copy).not.toMatch(/SIGGRAPH/i)
    expect(copy).not.toMatch(/demo reel|film credits?|visual effects supervisor|feature film artist/i)
    expect(copy).toMatch(/scientific visualization/i)
    expect(copy).toMatch(/parametric/i)
    expect(copy).toMatch(/spatial autonomy/i)
  })

  it('keeps the designed poster path available when the lazy scene rejects', () => {
    function RejectedScene(): never {
      throw new Error('scene import rejected')
    }

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { getByText } = render(
      <VisualHeroErrorBoundary fallback={<p>Static terrain remains available</p>}>
        <RejectedScene />
      </VisualHeroErrorBoundary>,
    )

    expect(getByText('Static terrain remains available')).toBeInTheDocument()
    expect(requestGraphicsFallback).toHaveBeenCalledWith('poster')
    consoleError.mockRestore()
  })
})
