import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { legacyMedia } from '../data/media'
import { softwarePortfolio } from '../data/software'
import { SoftwarePortfolio } from './SoftwarePortfolio'

const sectionIds = [
  'software-home',
  'software-about',
  'software-milestones',
  'software-experience',
  'software-work',
  'software-capabilities',
  'software-contact',
]

const projectGalleryCounts = {
  'gridworks-alerting-platform': 3,
  'notre-dame-drone-response': 9,
  'politiktok-research-infrastructure': 12,
  'geoscience-simulation': 9,
  'dily-fintech-systems': 3,
  'flair-energy-systems': 4,
} as const

const politiktokPaperTitle =
  'Political Subjectification on TikTok: A Postdigital Mode of Inquiry for Tracing Affects Among Chilean Youth'
const politiktokPaperUrl = 'https://doi.org/10.1007/s42438-026-00638-4'
const politiktokProjectUrl = 'https://politiktok.cl/'
const politiktokPostUrl =
  'https://www.linkedin.com/feed/update/urn:li:activity:7450175859099095041/'

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

  it('renders eight corrected Experience stories as a compact timeline without duplicate galleries', () => {
    render(<SoftwarePortfolio />)

    const experience = document.getElementById('software-experience')!
    const stories = within(experience).getAllByTestId('experience-chapter')
    expect(stories).toHaveLength(8)
    expect(within(experience).getByRole('heading', { name: 'Eight roles. One systems practice.' })).toBeInTheDocument()

    for (const story of softwarePortfolio.experience) {
      const chapter = within(experience).getByTestId(`experience-${story.id}`)
      expect(within(chapter).getByText(story.period)).toBeInTheDocument()
      expect(within(chapter).getByText(story.company)).toBeInTheDocument()
      expect(within(chapter).getByText(story.summary)).toBeInTheDocument()
    }

    expect(experience.querySelectorAll('.portfolio-carousel')).toHaveLength(0)
    expect(softwarePortfolio.experience[0].id).toBe('gridworks')

    const dily = document.getElementById('experience-dily')!
    expect(within(dily).getByRole('heading', { name: 'Software Engineer · Full Stack Developer' })).toBeInTheDocument()

    const flair = document.getElementById('experience-flair')!
    expect(within(flair).getByText('Dec 2024 - Aug 2025')).toBeInTheDocument()

    expect(document.getElementById('experience-teaching-puc')).toBeInTheDocument()
    expect(document.getElementById('experience-escuela-militar')).toBeInTheDocument()
    expect(document.getElementById('experience-teaching')).not.toBeInTheDocument()
  })

  it('presents the Politiktok Springer paper in both the experience and case study', () => {
    render(<SoftwarePortfolio />)

    const experience = document.getElementById('experience-politiktok')!
    expect(within(experience).getByText(politiktokPaperTitle, { exact: false })).toBeInTheDocument()
    expect(within(experience).getByText(/second published paper/i)).toBeInTheDocument()
    expect(within(experience).getByText(/6 April 2026/i)).toBeInTheDocument()
    expect(
      within(experience).getByRole('link', { name: /Read the published Springer paper/ }),
    ).toHaveAttribute('href', politiktokPaperUrl)
    expect(within(experience).getByRole('link', { name: /Explore Politiktok/ })).toHaveAttribute(
      'href',
      politiktokProjectUrl,
    )
    expect(
      within(experience).getByRole('link', { name: /Read the publication announcement/ }),
    ).toHaveAttribute('href', politiktokPostUrl)

    const project = document.getElementById('project-politiktok-research-infrastructure')!
    expect(within(project).getByText(politiktokPaperTitle, { exact: false })).toBeInTheDocument()
    expect(within(project).getByText(/transcription filtering/i)).toBeInTheDocument()
    expect(within(project).getByText(/research-ready datasets/i)).toBeInTheDocument()
    expect(within(project).getByText(/noisy, real-world social-media data/i)).toBeInTheDocument()
    expect(within(project).getByText(/computational analysis of political discourse/i)).toBeInTheDocument()
    expect(within(project).getByText(/ANID.*Fondecyt/i)).toBeInTheDocument()
    expect(
      within(project).getByRole('link', { name: /Read the published Springer paper/ }),
    ).toHaveAttribute('href', politiktokPaperUrl)
    expect(within(project).getByRole('link', { name: /Explore Politiktok/ })).toHaveAttribute(
      'href',
      politiktokProjectUrl,
    )
    expect(
      within(project).getByRole('link', { name: /Read the publication announcement/ }),
    ).toHaveAttribute('href', politiktokPostUrl)
  })

  it('links the Dily experience and case study to the canonical company website', () => {
    render(<SoftwarePortfolio />)

    const experience = document.getElementById('experience-dily')!
    expect(within(experience).getByRole('link', { name: /Visit Dily/ })).toHaveAttribute(
      'href',
      'https://www.dily.cl/',
    )

    const project = document.getElementById('project-dily-fintech-systems')!
    expect(within(project).getByRole('link', { name: /Visit Dily/ })).toHaveAttribute(
      'href',
      'https://www.dily.cl/',
    )
  })

  it('links Drone Response stories to the product and authored research-fair evidence', () => {
    render(<SoftwarePortfolio />)

    for (const id of ['experience-notreDame', 'project-notre-dame-drone-response']) {
      const story = document.getElementById(id)!
      expect(within(story).getByRole('link', { name: /Visit Drone Response/ })).toHaveAttribute(
        'href',
        'https://droneresponse.ai/',
      )
      expect(within(story).getByRole('link', { name: /View the research-fair presentation/ })).toHaveAttribute(
        'href',
        'https://es.linkedin.com/posts/jose-carter-arriagada_investigaci%C3%B3n-innovaci%C3%B3n-tecnolog%C3%ADa-activity-7254333344656584704-uCV_',
      )
    }
  })

  it('renders eight source-backed education, publication, and recognition milestones', () => {
    render(<SoftwarePortfolio />)

    const milestones = document.getElementById('software-milestones')!
    expect(within(milestones).getAllByTestId('milestone-story')).toHaveLength(8)
    expect(within(milestones).getByRole('heading', { name: /Computer Engineering/ })).toBeInTheDocument()
    expect(within(milestones).getByText(/Major in Software Engineering/)).toBeInTheDocument()
    expect(within(milestones).getByText(/Minor in Data Science/)).toBeInTheDocument()
    expect(within(milestones).getByText(/graduated with distinction/i)).toBeInTheDocument()
    expect(within(milestones).getByRole('heading', { name: /SIGGRAPH 2026 Student Volunteer/ })).toBeInTheDocument()
    expect(within(milestones).getByRole('heading', { name: /SA-SGW 2026 Delegate/ })).toBeInTheDocument()
    expect(within(milestones).getByRole('heading', { name: /Ayudante Senior DCC UC/ })).toBeInTheDocument()
    expect(within(milestones).getByRole('heading', { name: /Escuela Militar Teaching Recognition/ })).toBeInTheDocument()
    expect(within(milestones).getByRole('heading', { name: /KHIPU 2025/ })).toBeInTheDocument()
    const publicationHeading = within(milestones).getByRole('heading', {
      name: /Second published paper/,
    })
    expect(publicationHeading).toBeInTheDocument()
    expect(publicationHeading.closest('article')?.querySelector('img')).toHaveAccessibleName(
      /Politiktok public website/i,
    )
    expect(within(milestones).getByRole('heading', { name: /Drone Response Research-Fair Presentation/ })).toBeInTheDocument()

    expect(within(milestones).getByRole('link', { name: /SIGGRAPH announcement/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/feed/update/urn:li:activity:7483217477687160832/',
    )
    expect(within(milestones).getByRole('link', { name: /Verify KHIPU credential/ })).toHaveAttribute(
      'href',
      'https://www.ecertificate.cl/certificate/572/29865?correlativo=1',
    )
  })

  it('renders six evidence-rich projects with legacy galleries and four capability systems with linked proof', () => {
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

      const article = document.getElementById(`project-${project.id}`)!
      expect(article).toHaveAttribute(
        'data-media-count',
        String(projectGalleryCounts[project.id as keyof typeof projectGalleryCounts]),
      )
      expect(article.querySelectorAll('.portfolio-carousel__slide')).toHaveLength(
        projectGalleryCounts[project.id as keyof typeof projectGalleryCounts],
      )
    })

    const notreDameGallery = within(work).getByRole('region', {
      name: 'Autonomous drone mission planning gallery',
    })
    expect(notreDameGallery).toHaveAttribute('data-autoplay-ms', '9000')

    const capabilities = document.getElementById('software-capabilities')!
    const systems = within(capabilities).getAllByTestId('capability-system')
    expect(systems).toHaveLength(4)
    systems.forEach((system) => {
      const proofLinks = within(system).getAllByRole('link', { name: /proof/i })
      expect(proofLinks.length).toBeGreaterThan(0)
      proofLinks.forEach((link) => {
        expect(link.getAttribute('href')).toMatch(/^(https?:\/\/|\/visual#)/)
      })
    })
  })

  it('does not render unresolved same-page links', () => {
    const { container } = render(<SoftwarePortfolio />)

    container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      expect(container.querySelector(link.hash)).not.toBeNull()
    })
  })

  it('presents expanded engineering evidence and a concise services offer', () => {
    render(<SoftwarePortfolio />)

    const capabilities = document.getElementById('software-capabilities')!
    for (const item of [
      'Flask',
      'Django',
      'Pandas',
      'NumPy',
      'Docker',
      'AWS EC2 / S3 / Lambda',
      'Distributed Systems',
      'Design Patterns',
      'Functional Programming',
      'Unit Testing',
      'Azure',
    ]) {
      expect(within(capabilities).getAllByText(item).length).toBeGreaterThan(0)
    }

    expect(within(capabilities).getByRole('heading', { name: 'Services' })).toBeInTheDocument()
    expect(within(capabilities).getByRole('heading', { name: 'Research engineering' })).toBeInTheDocument()
    expect(within(capabilities).getByRole('heading', { name: 'Custom software & SaaS' })).toBeInTheDocument()
    expect(within(capabilities).getByRole('heading', { name: 'Data & analytics' })).toBeInTheDocument()
    expect(within(capabilities).getByRole('heading', { name: 'Cloud & database delivery' })).toBeInTheDocument()
    expect(
      within(capabilities).getByRole('heading', {
        name: 'Spatial computing & AR prototyping',
      }),
    ).toBeInTheDocument()
    expect(
      within(capabilities).getByRole('heading', { name: 'Agentic AI & automation' }),
    ).toBeInTheDocument()
  })

  it('stacks the About layout before intermediate-width copy can clip', () => {
    render(<SoftwarePortfolio />)

    expect(document.getElementById('software-about')).toHaveAttribute(
      'data-responsive-layout',
      'stack-before-1100',
    )
  })

  it('includes CV, social, and contact paths without an image wall', () => {
    render(<SoftwarePortfolio />)

    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute(
      'href',
      softwarePortfolio.hero.secondaryCta.href,
    )
    expect(screen.getAllByRole('link', { name: /GitHub/ }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /LinkedIn/ }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /LeetCode/ })).toHaveAttribute(
      'href',
      'https://leetcode.com/u/Cartterr/',
    )
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:/),
    )
    expect(screen.getByRole('form', { name: 'Software project inquiry' })).toBeInTheDocument()

    expect(document.querySelector('[data-layout="image-wall"]')).not.toBeInTheDocument()
    expect(softwarePortfolio.navigation).toContainEqual({
      label: 'Milestones',
      href: '#software-milestones',
    })
  })
})
