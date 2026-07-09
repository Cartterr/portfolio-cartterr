import { useEffect, useState } from 'react'

type SiteHeaderProps = {
  cvHref: string
}

const navigationItems = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function SiteHeader({ cvHref }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return undefined

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const closeNavigation = () => setIsOpen(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="wordmark" href="#main" onClick={closeNavigation}>
          José Carter
        </a>

        <button
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          className="menu-button"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true" className="menu-button__lines">
            <span />
            <span />
          </span>
        </button>

        <nav
          aria-label="Primary navigation"
          className="site-nav"
          data-open={isOpen ? 'true' : 'false'}
          id="primary-navigation"
        >
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeNavigation}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a className="site-nav__cv" download href={cvHref} onClick={closeNavigation}>
                CV
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
