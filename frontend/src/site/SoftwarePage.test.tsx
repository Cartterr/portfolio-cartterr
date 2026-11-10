import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getMedia, legacyMedia } from '../data/media'
import { softwarePortfolio } from '../data/software'
import { SoftwarePage } from './SoftwarePage'

const sectionIds = [
  'software-home',
  'software-about',
  'software-work',
  'software-experience',
  'software-capabilities',
  'software-contact',
]

const projectGalleryCounts = {
  'tek-physical-ai': 4,
  'dictuc-xr-ar-research': 5,
  'gridworks-alerting-platform': 4,
  'notre-dame-drone-response': 9,
  'politiktok-research-infrastructure': 12,
  'geoscience-simulation': 9,
  'dily-fintech-systems': 3,
  'flair-energy-systems': 4,
} as const

beforeEach(() => {
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SoftwarePage', () => {
  it('renders the complete page in reading order', () => {
    render(<SoftwarePage />)

    const sections = screen.getAllByTestId('software-section')
    expect(sections.map(({ id }) => id)).toEqual(sectionIds)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(softwarePortfolio.hero.title)
  })

  it('keeps the hero to two actions, names the current roles, and follows with the outcomes', () => {
    render(<SoftwarePage />)

    const hero = document.getElementById('software-home')!
    const actions = within(hero).getByRole('group', { name: 'Software portfolio actions' })
    expect(within(actions).getAllByRole('link')).toHaveLength(2)
    expect(within(actions).getByRole('link', { name: /view work/i })).toHaveAttribute(
      'href',
      '#software-work',
    )
    expect(within(actions).getByRole('link', { name: /download résumé/i })).toHaveAttribute(
      'href',
      '/resume',
    )
    expect(within(hero).getByText(softwarePortfolio.hero.summary)).toBeInTheDocument()
    const now = within(hero.querySelector<HTMLElement>('.jc-now')!)
    expect(now.getByText('TEK Chile')).toBeInTheDocument()
    expect(now.getByText('DICTUC')).toBeInTheDocument()

    const outcomes = screen.getByRole('region', { name: 'Selected outcomes' })
    expect(hero.nextElementSibling).toBe(outcomes)
    const metrics = within(outcomes).getAllByTestId('proof-metric')
    expect(metrics).toHaveLength(softwarePortfolio.metrics.length)
    softwarePortfolio.metrics.forEach((metric, index) => {
      // The rolling digits are decorative; the plain value is what is read out.
      expect(within(metrics[index]).getByText(metric.value)).toHaveClass('sr-only')
      expect(within(metrics[index]).getByText(metric.label)).toBeInTheDocument()
      expect(within(metrics[index]).getByText(metric.context)).toBeInTheDocument()
    })
  })

  it('tells the About story with every profile photo plus SIGGRAPH and the Dily team', () => {
    render(<SoftwarePage />)

    const about = document.getElementById('software-about')!
    const profileMedia = legacyMedia.filter(({ storyId }) => storyId === 'profile')
    expect(profileMedia).toHaveLength(13)
    const photos = [...about.querySelectorAll('img[data-about-photo]')]
    expect(photos).toHaveLength(profileMedia.length + 4)
    expect(photos.slice(4, 8).map((img) => img.getAttribute('alt'))).toEqual([
      getMedia('siggraph-sign').alt,
      getMedia('treyarch-portrait').alt,
      getMedia('dily1').alt,
      getMedia('treyarch-group').alt,
    ])
    expect(
      within(about).getByRole('heading', { level: 2, name: softwarePortfolio.about.heading }),
    ).toBeInTheDocument()
    for (const paragraph of softwarePortfolio.about.paragraphs) {
      expect(about).toHaveTextContent(paragraph)
    }
  })

  it('renders ten Experience stories as a compact timeline without galleries', () => {
    render(<SoftwarePage />)

    const experience = document.getElementById('software-experience')!
    const stories = within(experience).getAllByTestId('experience-story')
    expect(stories).toHaveLength(10)
    // Organization logos are allowed; photo galleries are not.
    expect(experience.querySelectorAll('img:not(.jc-org-mark)')).toHaveLength(0)
    softwarePortfolio.experience.forEach((story, index) => {
      expect(within(stories[index]).getByRole('heading', { level: 3, name: story.title })).toBeInTheDocument()
      expect(stories[index].querySelector('.jc-xp__role p')).toHaveTextContent(story.company)
      expect(stories[index].querySelector('.jc-xp__outcome')).toHaveTextContent(story.outcome)
    })
    expect(within(experience).getAllByRole('link', { name: /,/ }).length).toBeGreaterThanOrEqual(9)
  })

  it('renders eight projects with their evidence and galleries, two featured and six as rows', () => {
    render(<SoftwarePage />)

    const work = document.getElementById('software-work')!
    const chapters = within(work).getAllByTestId('project-chapter')
    expect(chapters).toHaveLength(8)
    expect(chapters.filter((chapter) => chapter.matches('article'))).toHaveLength(2)

    softwarePortfolio.projects.forEach((project, index) => {
      const chapter = chapters[index]
      expect(chapter).toHaveAttribute('id', `project-${project.id}`)
      expect(chapter).toHaveAttribute(
        'data-media-count',
        String(projectGalleryCounts[project.id as keyof typeof projectGalleryCounts]),
      )
      expect(chapter.querySelector('[data-project-gallery]')).toBeInTheDocument()
      const copy = within(chapter).getByTestId(`project-${project.id}`)
      expect(within(copy).getByText(project.problem)).toBeInTheDocument()
      expect(within(copy).getByText(project.contribution)).toBeInTheDocument()
      expect(within(copy).getByText(project.outcome)).toBeInTheDocument()
      expect(within(chapter).getByRole('heading', { level: 3 })).toHaveTextContent(project.title)
    })
  })

  it('opens one earlier project at a time and keeps closed case studies out of reach', async () => {
    const user = userEvent.setup()
    render(<SoftwarePage />)

    const [third, fourth] = softwarePortfolio.projects.slice(2)
    const thirdButton = screen.getByRole('button', { name: new RegExp(third.title) })
    const fourthButton = screen.getByRole('button', { name: new RegExp(fourth.title) })
    const thirdPanel = document.getElementById(thirdButton.getAttribute('aria-controls')!)!
    expect(thirdButton).toHaveAttribute('aria-expanded', 'false')
    expect(thirdPanel).toHaveAttribute('inert')

    await user.click(thirdButton)
    expect(thirdButton).toHaveAttribute('aria-expanded', 'true')
    expect(thirdPanel).not.toHaveAttribute('inert')

    await user.click(fourthButton)
    expect(fourthButton).toHaveAttribute('aria-expanded', 'true')
    expect(thirdButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(fourthButton)
    expect(fourthButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the project a deep link points at', () => {
    const project = softwarePortfolio.projects[4]
    window.history.replaceState({}, '', `/#project-${project.id}`)
    render(<SoftwarePage />)

    expect(screen.getByRole('button', { name: new RegExp(project.title) })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('links four capability areas to the projects that prove them', () => {
    render(<SoftwarePage />)

    const capabilities = within(document.getElementById('software-capabilities')!)
    const systems = capabilities.getAllByTestId('capability-system')
    expect(systems).toHaveLength(4)
    softwarePortfolio.capabilities.forEach((capability, index) => {
      const system = within(systems[index])
      expect(system.getByRole('heading', { level: 3, name: capability.title })).toBeInTheDocument()
      const proof = system.getByRole('list', { name: `${capability.title} related work` })
      const links = within(proof).getAllByRole('link')
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        capability.proofStoryIds.map((id) => `#project-${id}`),
      )
    })
  })

  it('shows a photo in the viewer and steps through its set', async () => {
    const user = userEvent.setup()
    render(<SoftwarePage />)

    const featured = softwarePortfolio.projects[0]
    const chapter = document.getElementById(`project-${featured.id}`)!
    await user.click(within(chapter).getByRole('button', { name: /^open image:/i }))

    const viewer = document.querySelector<HTMLDialogElement>('dialog.jc-lightbox')!
    expect(viewer).toHaveAttribute('open')
    const count = viewer.querySelector('.jc-lightbox__count')!
    expect(count).toHaveTextContent('01 / 04')
    await user.click(within(viewer).getByRole('button', { name: 'Next image', hidden: true }))
    expect(count).toHaveTextContent('02 / 04')
    await user.click(within(viewer).getByRole('button', { name: 'Close image viewer', hidden: true }))
    expect(viewer).not.toHaveAttribute('open')
  })

  it('includes résumé, email, social, and form paths', () => {
    render(<SoftwarePage />)

    const contact = document.getElementById('software-contact')!
    expect(
      within(contact).getByRole('heading', { level: 2, name: softwarePortfolio.contact.heading }),
    ).toBeInTheDocument()
    const links = within(contact).getByRole('list', { name: 'Direct contact links' })
    expect(within(links).getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/Cartterr',
    )
    expect(within(links).getByRole('link', { name: /linkedin/i })).toHaveAttribute('target', '_blank')
    expect(within(links).getByRole('link', { name: /download résumé/i })).toHaveAttribute(
      'href',
      '/resume',
    )
    expect(within(contact).getByRole('link', { name: /jose\.carterx@gmail\.com/ })).toHaveAttribute(
      'href',
      'mailto:jose.carterx@gmail.com',
    )
    const form = within(contact).getByRole('form', { name: 'Software project inquiry' })
    expect(within(form).getByLabelText('Name')).toBeRequired()
    expect(within(form).getByLabelText('Email')).toBeRequired()
    expect(within(form).getByLabelText('Message')).toBeRequired()
    expect(contact).not.toHaveTextContent(/siggraph/i)
  })

  it('posts the contact form with the software context and confirms it', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    render(<SoftwarePage />)

    const form = screen.getByRole('form', { name: 'Software project inquiry' })
    await user.type(within(form).getByLabelText('Name'), 'Ada')
    await user.type(within(form).getByLabelText('Email'), 'ada@example.com')
    await user.type(within(form).getByLabelText('Message'), 'Hello')
    await user.click(within(form).getByRole('button', { name: /send message/i }))

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Ada',
          email: 'ada@example.com',
          message: 'Hello',
          website: '',
          portfolioMode: 'software',
        }),
      }),
    )
    const status = await within(form).findByText(/your message has been received/i)
    expect(status).toHaveFocus()
    expect(within(form).getByLabelText('Name')).toHaveValue('')
    vi.unstubAllGlobals()
  })
})
