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
    ).toEqual(['hero', 'about', 'work', 'experience', 'capabilities', 'contact'])

    const heroHeading = within(page).getByRole('heading', {
      level: 1,
      name: visualPortfolio.hero.title,
    })
    expect(heroHeading).toHaveTextContent(visualPortfolio.hero.title)
    expect(heroHeading.querySelectorAll('.visual-hero__title-line')).toHaveLength(3)
    const heroActions = within(page).getByRole('group', { name: 'Visual portfolio actions' })
    expect(
      within(heroActions).getByRole('link', { name: visualPortfolio.hero.primaryCta.label }),
    ).toHaveAttribute('href', '#work')
    expect(
      within(heroActions).getByRole('link', { name: visualPortfolio.hero.secondaryCta.label }),
    ).toHaveAttribute('href', '/resume')
    expect(within(heroActions).getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/jose-carter-arriagada',
    )
    expect(within(heroActions).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '#contact',
    )
    expect(within(page).getByTestId('visual-hero-poster')).toBeInTheDocument()

    expect(
      within(page).getByRole('heading', { level: 2, name: /visual computing and technical 3d work/i }),
    ).toBeInTheDocument()
    expect(within(page).getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument()
    expect(within(page).getByRole('heading', { level: 2, name: /education/i })).toBeInTheDocument()
    expect(
      within(page).getByRole('heading', { level: 2, name: /research & recognition/i }),
    ).toBeInTheDocument()
    expect(
      within(page).getByRole('heading', { level: 2, name: /selected visual computing projects/i }),
    ).toBeInTheDocument()
    expect(
      within(page).getByRole('heading', { level: 2, name: /workflow and capabilities/i }),
    ).toBeInTheDocument()
    expect(within(page).getByRole('heading', { name: visualPortfolio.contact.heading })).toBeInTheDocument()
    expect(within(page).getAllByRole('link', { name: 'Download Résumé' })[0]).toHaveAttribute(
      'href',
      '/resume',
    )
    expect(within(page).getByText('Software Engineer at Dily')).toBeInTheDocument()
    expect(within(page).getByText('ACM SIGGRAPH 2026 Student Volunteer')).toBeInTheDocument()
    expect(within(page).getByText('Springer Co-author')).toBeInTheDocument()
    expect(within(page).getByTestId('visual-hero-poster')).toHaveAttribute(
      'data-capability',
      'poster',
    )
    expect(within(page).queryByTestId('visual-hero-scene')).not.toBeInTheDocument()
  })

  it('shows five WDAS-aligned project stories in priority order with detailed case studies', () => {
    const { container } = render(<VisualPortfolio />)
    const page = container.querySelector<HTMLElement>('[data-visual-portfolio]')!
    const stories = within(page).getAllByTestId('visual-project-story')

    expect(stories).toHaveLength(5)
    expect(stories.map((story) => within(story).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Parametric 3D Configurator',
      'Personal VFX & Look Development Studies',
      'Drone Response Mission Planner',
      'Research Data Platform',
      '3D Geoscience Simulation Pipeline',
    ])

    stories.forEach((story) => {
      const carousel = within(story).getByRole('region', { name: /project gallery/i })
      expect(carousel.querySelectorAll('.portfolio-carousel__slide').length).toBeGreaterThan(0)
      expect(carousel.querySelectorAll('[data-active="true"]')).toHaveLength(1)
      expect(within(story).getByText('Problem')).toBeInTheDocument()
      expect(within(story).getByText('What I built')).toBeInTheDocument()
      expect(within(story).getByText('Technical challenge')).toBeInTheDocument()
      expect(within(story).getByText('My contribution')).toBeInTheDocument()
      expect(within(story).getByText('Result')).toBeInTheDocument()
    })

    expect(page.querySelector('[data-layout="image-wall"]')).not.toBeInTheDocument()
  })

  it('keeps the visual narrative grounded in supported graphics and spatial work', () => {
    const { container } = render(<VisualPortfolio />)
    const copy = container.textContent ?? ''

    expect(copy).not.toMatch(/demo reel|film credits?|visual effects supervisor|feature film artist/i)
    expect(copy).toMatch(/ACM SIGGRAPH 2026 Student Volunteer/i)
    expect(copy).toMatch(/scientific visualization/i)
    expect(copy).toMatch(/parametric/i)
    expect(copy).toMatch(/spatial autonomy/i)
    expect(copy).toMatch(/Houdini/i)
    expect(copy).toMatch(/Nuke/i)
    expect(copy).toMatch(/Cinema 4D/i)
    expect(copy).toMatch(/Blender/i)
    expect(copy).toMatch(/Arnold/i)
    expect(copy).toMatch(/Octane/i)
    expect(copy).toMatch(/Redshift/i)
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
