import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { getPortfolio } from './data/portfolio'

const setPath = (path: string, state: unknown = {}) => {
  window.history.replaceState(state, '', path)
}

describe('dual portfolio shell', () => {
  beforeEach(() => {
    setPath('/')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('derives the visual identity from pathname before the first render', () => {
    setPath('/visual/')
    render(<App />)

    const visual = getPortfolio('visual')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(visual.hero.title)
    expect(document.title).toBe(visual.meta.title)
    expect(document.documentElement).toHaveAttribute('data-portfolio-mode', 'visual')

    const modeNavigation = screen.getByRole('navigation', { name: 'Portfolio mode' })
    expect(within(modeNavigation).getByRole('link', { name: 'Software' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(within(modeNavigation).getByRole('link', { name: 'Visual' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(modeNavigation).getByRole('link', { name: 'Visual' })).toHaveAttribute(
      'href',
      '/visual',
    )
  })

  it('keeps the complete Visual document content-aware and isolated from Software sections', () => {
    setPath('/visual/')
    render(<App />)

    const visual = getPortfolio('visual')
    const page = document.querySelector<HTMLElement>('[data-visual-portfolio]')
    expect(page).toBeInTheDocument()
    expect(page).toHaveAttribute('data-presentation', 'visual-computing')
    expect(page).not.toHaveClass('software-document')
    expect(page?.querySelector('.software-hero, .software-section')).not.toBeInTheDocument()

    expect(within(page!).getByRole('heading', { level: 1 })).toHaveTextContent(visual.hero.title)
    const heroActions = within(page!).getByRole('group', { name: 'Visual portfolio actions' })
    const resumeCta = within(heroActions).getByRole('link', {
      name: visual.hero.secondaryCta.label,
    })
    expect(resumeCta).toHaveAttribute('href', '/resume')
    expect(within(heroActions).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '#contact',
    )

    const about = within(page!).getByRole('region', {
      name: 'Visual computing project gallery',
    })
    expect(about.querySelectorAll('.portfolio-carousel__slide')).toHaveLength(
      visual.about.mediaIds.length,
    )

    visual.experience.forEach((story) => {
      const chapter = within(page!).getByTestId(`visual-laboratory-${story.id}`)
      expect(within(chapter).getByText(story.outcome)).toBeInTheDocument()
    })
    expect(within(page!).queryByText('0 of 0')).not.toBeInTheDocument()

    expect(within(page!).getAllByTestId('visual-project-story')).toHaveLength(
      visual.projects.length,
    )
    visual.capabilities.forEach((capability) => {
      expect(within(page!).getByRole('heading', { name: capability.title })).toBeInTheDocument()
    })
    expect(within(page!).getByRole('heading', { name: visual.contact.heading })).toBeInTheDocument()
    visual.navigation.forEach(({ href }, index) => {
      expect(page?.querySelector(href)).toHaveAttribute(
        'data-section-index',
        String(index + 1).padStart(2, '0'),
      )
      expect(page?.querySelector(href)).toHaveAttribute('data-section-boundary')
    })
  })

  it('renders the active navigation and every destination section immediately', () => {
    render(<App />)

    const page = getPortfolio('software')
    expect(screen.getByRole('link', { name: `José Carter — ${page.hero.eyebrow}` })).toHaveClass(
      'jc-nav__brand',
    )
    const primaryNavigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    const navigationLabels = within(primaryNavigation)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(navigationLabels).toEqual(page.navigation.map(({ label }) => label))
    page.navigation.forEach(({ href }, index) => {
      expect(document.querySelector(href)).toBeInTheDocument()
      expect(document.querySelector(href)).toHaveAttribute(
        'data-section-index',
        String(index + 1).padStart(2, '0'),
      )
    })
    // The navigation lists the sections in the order the page presents them.
    const sectionOrder = [...document.querySelectorAll('[data-section-index]')].map(
      ({ id }) => `#${id}`,
    )
    expect(sectionOrder).toEqual(page.navigation.map(({ href }) => href))
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })

  it('honors an initial section hash after the portfolio document mounts', async () => {
    setPath('/#software-work')
    const scrollIntoView = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    })

    render(<App />)

    const target = document.querySelector('#software-work')
    const heading = screen.getByRole('heading', { level: 2, name: 'Selected work' })
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled())
    expect(scrollIntoView).toHaveBeenCalledWith()
    expect(target).toBeInTheDocument()
    expect(heading).toHaveFocus()
  })

  it('ignores a malformed percent-encoded hash without breaking the portfolio', () => {
    setPath('/#%E0%A4%A')

    expect(() => render(<App />)).not.toThrow()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      getPortfolio('software').hero.title,
    )
  })

  it('has no Software/Visual mode switch on the Software page', () => {
    render(<App />)

    expect(screen.queryByRole('navigation', { name: 'Portfolio mode' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Visual' })).not.toBeInTheDocument()
  })

  // The Software page has no mode switch, so mode changes start from the Visual page.
  it('switches mode with History API, resets scroll, updates metadata, focuses h1, and announces', async () => {
    setPath('/visual')
    const user = userEvent.setup()
    const pushState = vi.spyOn(window.history, 'pushState')
    const replaceState = vi.spyOn(window.history, 'replaceState')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 640 })
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Software' }))

    const software = getPortfolio('software')
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(software.hero.title)
      expect(screen.getByRole('heading', { level: 1 })).toHaveFocus()
    })
    expect(replaceState).toHaveBeenCalled()
    expect(pushState).toHaveBeenCalledWith(expect.any(Object), '', '/')
    expect(window.location.pathname).toBe('/')
    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 0 })
    expect(document.title).toBe(software.meta.title)
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      software.meta.description,
    )
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      software.meta.canonical,
    )
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      software.meta.themeColor,
    )
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      software.meta.socialTitle,
    )
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      software.meta.canonical,
    )
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      software.meta.socialImage,
    )
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      software.meta.socialImageAlt,
    )
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      software.meta.twitterCard,
    )
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      software.meta.socialTitle,
    )
    expect(document.querySelector('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      software.meta.socialImage,
    )
    expect(document.querySelector('meta[name="twitter:image:alt"]')).toHaveAttribute(
      'content',
      software.meta.socialImageAlt,
    )
    const structuredData = JSON.parse(
      document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]')?.textContent ??
        '{}',
    )
    expect(structuredData['@graph'][0].url).toBe(software.meta.canonical)
    expect(screen.getByText('Software portfolio loaded')).toHaveAttribute('aria-live', 'polite')
  })

  it('updates active navigation from the reading line while scrolling in both modes', async () => {
    setPath('/visual')
    const user = userEvent.setup()
    render(<App />)

    const positionSections = (mode: 'software' | 'visual', activeIndex: number) => {
      const page = getPortfolio(mode)
      page.navigation.forEach(({ href }, index) => {
        const section = document.querySelector<HTMLElement>(
          `[data-portfolio-page="${mode}"] ${href}`,
        )
        expect(section).not.toBeNull()
        vi.spyOn(section!, 'getBoundingClientRect').mockReturnValue({
          bottom: index <= activeIndex ? 700 : 1700,
          height: 900,
          left: 0,
          right: 1200,
          top: index <= activeIndex ? -400 + index * 180 : 900 + index * 200,
          width: 1200,
          x: 0,
          y: index <= activeIndex ? -400 + index * 180 : 900 + index * 200,
          toJSON: () => ({}),
        })
      })
    }

    // Each mode has its own header, so the landmark is looked up again after the switch.
    const primaryNavigation = () => screen.getByRole('navigation', { name: 'Primary navigation' })

    positionSections('visual', 3)
    window.dispatchEvent(new Event('scroll'))

    await waitFor(() =>
      expect(within(primaryNavigation()).getByRole('link', { name: 'Capabilities' })).toHaveAttribute(
        'aria-current',
        'location',
      ),
    )

    await user.click(screen.getByRole('link', { name: 'Software' }))
    await screen.findByText('Software portfolio loaded')

    positionSections('software', 1)
    window.dispatchEvent(new Event('scroll'))

    await waitFor(() =>
      expect(within(primaryNavigation()).getByRole('link', { name: 'Work' })).toHaveAttribute(
        'aria-current',
        'location',
      ),
    )
  })

  it('lets modified mode-link clicks retain normal browser-link behavior', () => {
    setPath('/visual')
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<App />)
    const preventDocumentNavigation = (event: MouseEvent) => event.preventDefault()
    document.addEventListener('click', preventDocumentNavigation)

    fireEvent.click(screen.getByRole('link', { name: 'Software' }), { ctrlKey: true })
    document.removeEventListener('click', preventDocumentNavigation)

    expect(pushState).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/visual')
  })

  it('restores stored scroll and active navigation on browser Back/Forward', async () => {
    setPath('/visual')
    const user = userEvent.setup()
    render(<App />)
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 480 })

    await user.click(screen.getByRole('link', { name: 'Software' }))
    await screen.findByText('Software portfolio loaded')
    vi.mocked(window.scrollTo).mockClear()

    const state = { portfolioRoute: { mode: 'visual', scrollY: 480 } }
    setPath('/visual', state)
    window.dispatchEvent(new PopStateEvent('popstate', { state }))

    const visual = getPortfolio('visual')
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(visual.hero.title)
      expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 480 })
    })
    expect(screen.getByRole('link', { name: 'Visual' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Visual portfolio restored')).toHaveAttribute('aria-live', 'polite')
  })

  it('opens and closes the mobile navigation disclosure accessibly', async () => {
    const user = userEvent.setup()
    render(<App />)
    const menu = screen.getByRole('button', { name: /open navigation/i })

    await user.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile navigation' })
    expect(within(mobileNavigation).getAllByRole('link')).toHaveLength(
      getPortfolio('software').navigation.length,
    )

    await user.tab()
    expect(within(mobileNavigation).getByRole('link', { name: 'About' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(menu).toHaveFocus()
  })

  it('moves focus to the destination heading after mobile same-page navigation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /open navigation/i }))
    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile navigation' })
    await user.click(within(mobileNavigation).getByRole('link', { name: 'Work' }))

    await waitFor(() => {
      expect(window.location.hash).toBe('#software-work')
      expect(screen.getByRole('heading', { level: 2, name: 'Selected work' })).toHaveFocus()
    })
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument()
  })

  it('moves keyboard focus to the stable main shell from the skip link', async () => {
    const user = userEvent.setup()
    render(<App />)
    const skipLink = screen.getByRole('link', { name: /skip to content/i })
    const main = screen.getByRole('main')

    await user.tab()
    expect(skipLink).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(main).toHaveAttribute('tabindex', '-1')
    expect(main).toHaveFocus()
  })
})
