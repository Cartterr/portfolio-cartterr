import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { getPortfolio } from './data/portfolio'

const setPath = (path: string, state: unknown = {}) => {
  window.history.replaceState(state, '', path)
}

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []

  observed = new Set<Element>()
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    IntersectionObserverMock.instances.push(this)
  }

  disconnect() {
    this.observed.clear()
  }

  observe(target: Element) {
    this.observed.add(target)
  }

  emit(target: Element) {
    this.callback(
      [{ isIntersecting: true, intersectionRatio: 1, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }

  takeRecords() {
    return []
  }

  unobserve(target: Element) {
    this.observed.delete(target)
  }
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
    IntersectionObserverMock.instances = []
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
    const contactCta = within(page!).getByRole('link', { name: visual.hero.secondaryCta.label })
    expect(contactCta).toHaveAttribute('href', '#contact')
    expect(contactCta).not.toHaveAttribute('download')

    const about = within(page!).getByRole('region', {
      name: 'Visual profile field and practice gallery',
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
  })

  it('renders the active navigation and every destination section immediately', () => {
    render(<App />)

    const page = getPortfolio('software')
    expect(screen.getByRole('link', { name: `José Carter — ${page.hero.eyebrow}` })).toHaveClass(
      'site-identity',
    )
    const primaryNavigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    const navigationLabels = within(primaryNavigation)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(navigationLabels).toEqual(page.navigation.map(({ label }) => label))
    for (const { href } of page.navigation) {
      expect(document.querySelector(href)).toBeInTheDocument()
    }
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
    const heading = screen.getByRole('heading', { level: 2, name: 'Evidence, not a second résumé.' })
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

  it('switches mode with History API, resets scroll, updates metadata, focuses h1, and announces', async () => {
    const user = userEvent.setup()
    const pushState = vi.spyOn(window.history, 'pushState')
    const replaceState = vi.spyOn(window.history, 'replaceState')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 640 })
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Visual' }))

    const visual = getPortfolio('visual')
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(visual.hero.title)
      expect(screen.getByRole('heading', { level: 1 })).toHaveFocus()
    })
    expect(replaceState).toHaveBeenCalled()
    expect(pushState).toHaveBeenCalledWith(expect.any(Object), '', '/visual')
    expect(window.location.pathname).toBe('/visual')
    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 0 })
    expect(document.title).toBe(visual.meta.title)
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      visual.meta.description,
    )
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      visual.meta.canonical,
    )
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      visual.meta.themeColor,
    )
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      visual.meta.title,
    )
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      visual.meta.canonical,
    )
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      visual.meta.twitterCard,
    )
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      visual.meta.title,
    )
    const structuredData = JSON.parse(
      document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]')?.textContent ??
        '{}',
    )
    expect(structuredData['@graph'][0].url).toBe(visual.meta.canonical)
    expect(screen.getByText('Visual portfolio loaded')).toHaveAttribute('aria-live', 'polite')
  })

  it('observes destination sections after the mode transition mounts them', async () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Visual' }))
    await screen.findByText('Visual portfolio loaded')

    const destinationWork = document.querySelector('[data-portfolio-page="visual"] #work')
    expect(destinationWork).not.toBeNull()
    const destinationObserver = IntersectionObserverMock.instances.find((observer) =>
      observer.observed.has(destinationWork!),
    )
    expect(destinationObserver).toBeDefined()

    act(() => destinationObserver?.emit(destinationWork!))

    const primaryNavigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    expect(within(primaryNavigation).getByRole('link', { name: 'Work' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  it('lets modified mode-link clicks retain normal browser-link behavior', () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<App />)
    const preventDocumentNavigation = (event: MouseEvent) => event.preventDefault()
    document.addEventListener('click', preventDocumentNavigation)

    fireEvent.click(screen.getByRole('link', { name: 'Visual' }), { ctrlKey: true })
    document.removeEventListener('click', preventDocumentNavigation)

    expect(pushState).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/')
  })

  it('restores stored scroll and active navigation on browser Back/Forward', async () => {
    const user = userEvent.setup()
    render(<App />)
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 480 })

    await user.click(screen.getByRole('link', { name: 'Visual' }))
    await screen.findByText('Visual portfolio loaded')
    vi.mocked(window.scrollTo).mockClear()

    const state = { portfolioRoute: { mode: 'software', scrollY: 480 } }
    setPath('/', state)
    window.dispatchEvent(new PopStateEvent('popstate', { state }))

    const software = getPortfolio('software')
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(software.hero.title)
      expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 480 })
    })
    expect(screen.getByRole('link', { name: 'Software' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Software portfolio restored')).toHaveAttribute('aria-live', 'polite')
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
      expect(
        screen.getByRole('heading', { level: 2, name: 'Evidence, not a second résumé.' }),
      ).toHaveFocus()
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
