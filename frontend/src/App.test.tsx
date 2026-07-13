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

  it('renders the active navigation and every destination section immediately', () => {
    render(<App />)

    const page = getPortfolio('software')
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
