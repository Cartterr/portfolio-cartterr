import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { legacyMedia } from '../data/media'
import { softwarePortfolio } from '../data/software'
import { SoftwarePortfolio } from './SoftwarePortfolio'

const sectionIds = [
  'software-home',
  'software-about',
  'software-experience',
  'software-work',
  'software-capabilities',
  'software-contact',
]

const experienceLayouts = {
  dily: 'flagship-split',
  gridworks: 'systems-row',
  flair: 'alternating-chapter',
  notreDame: 'field-sticky',
  politiktok: 'research-pinned',
  teaching: 'compact-timeline',
  geoscience: 'visual-finale',
} as const

const legacyGalleryCounts = {
  dily: 3,
  gridworks: 2,
  flair: 4,
  notreDame: 9,
  politiktok: 12,
  teaching: 5,
  geoscience: 9,
} as const

beforeEach(() => {
  class ObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('IntersectionObserver', ObserverMock)
  vi.stubGlobal('ResizeObserver', ObserverMock)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

describe('SoftwarePortfolio', () => {
  it('renders the complete long-form document in the approved order', () => {
    render(<SoftwarePortfolio />)

    const sections = screen.getAllByTestId('software-section')
    expect(sections.map(({ id }) => id)).toEqual(sectionIds)

    for (const id of sectionIds) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('keeps the hero to two actions and places the proof rail immediately after it', () => {
    render(<SoftwarePortfolio />)

    const hero = document.getElementById('software-home')!
    const actions = within(hero).getByRole('group', { name: 'Software portfolio actions' })
    expect(within(actions).getAllByRole('link')).toHaveLength(2)
    expect(within(actions).getByRole('link', { name: 'View Work' })).toHaveAttribute(
      'href',
      '#software-work',
    )
    expect(within(actions).getByRole('link', { name: 'Download CV' })).toHaveAttribute(
      'href',
      softwarePortfolio.hero.secondaryCta.href,
    )

    const proofRail = hero.nextElementSibling
    expect(proofRail).toHaveAttribute('data-software-proof-rail')
    expect(within(proofRail as HTMLElement).getAllByTestId('proof-metric')).toHaveLength(4)
  })

  it('restores the asymmetric About chapter with all thirteen profile images', () => {
    render(<SoftwarePortfolio />)

    const about = document.getElementById('software-about')!
    const profileMedia = legacyMedia.filter(({ storyId }) => storyId === 'profile')
    expect(profileMedia).toHaveLength(13)
    expect(about).toHaveAttribute('data-layout', 'asymmetric-about')

    const gallery = within(about).getByRole('region', { name: 'Profile gallery' })
    expect(gallery).toHaveAttribute('data-autoplay-ms', '7000')
    expect(gallery.querySelectorAll('.portfolio-carousel__slide')).toHaveLength(13)
  })

  it('maps seven Experience stories to distinct layouts and exact legacy galleries', () => {
    render(<SoftwarePortfolio />)

    const experience = document.getElementById('software-experience')!
    const stories = within(experience).getAllByTestId('experience-chapter')
    expect(stories).toHaveLength(7)

    for (const story of softwarePortfolio.experience) {
      const chapter = within(experience).getByTestId(`experience-${story.id}`)
      expect(chapter).toHaveAttribute('data-layout', experienceLayouts[story.id as keyof typeof experienceLayouts])
      expect(chapter).toHaveAttribute(
        'data-media-count',
        String(legacyGalleryCounts[story.id as keyof typeof legacyGalleryCounts]),
      )
      expect(within(chapter).getByText(story.period)).toBeInTheDocument()
      expect(within(chapter).getByText(story.contribution)).toBeInTheDocument()
      expect(within(chapter).getByText(story.outcome)).toBeInTheDocument()
    }

    const notreDameGallery = within(experience).getByRole('region', {
      name: 'Drone Response, University of Notre Dame gallery',
    })
    expect(notreDameGallery).toHaveAttribute('data-autoplay-ms', '9000')
  })

  it('renders six evidence-rich projects and four capability systems with linked proof', () => {
    render(<SoftwarePortfolio />)

    const work = document.getElementById('software-work')!
    const projects = within(work).getAllByTestId('project-chapter')
    expect(projects).toHaveLength(6)
    softwarePortfolio.projects.forEach((project) => {
      const chapter = within(work).getByTestId(`project-${project.id}`)
      expect(within(chapter).getByText(project.problem)).toBeInTheDocument()
      expect(within(chapter).getByText(project.contribution)).toBeInTheDocument()
      expect(within(chapter).getByText(project.outcome)).toBeInTheDocument()
      expect(within(chapter).queryByText(project.summary)).not.toBeInTheDocument()
    })

    const capabilities = document.getElementById('software-capabilities')!
    const systems = within(capabilities).getAllByTestId('capability-system')
    expect(systems).toHaveLength(4)
    systems.forEach((system) => {
      expect(within(system).getAllByRole('link', { name: /proof/i }).length).toBeGreaterThan(0)
    })
  })

  it('includes CV, social, and contact paths without an image wall or SIGGRAPH copy', () => {
    render(<SoftwarePortfolio />)

    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute(
      'href',
      softwarePortfolio.hero.secondaryCta.href,
    )
    expect(screen.getAllByRole('link', { name: /GitHub/ }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /LinkedIn/ }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:/),
    )
    expect(screen.getByRole('form', { name: 'Software project inquiry' })).toBeInTheDocument()

    expect(document.querySelector('[data-layout="image-wall"]')).not.toBeInTheDocument()
    expect(document.body).not.toHaveTextContent(/SIGGRAPH/i)
  })
})
