import { useEffect, useRef, useState } from 'react'

type NavigationItem = {
  label: string
  href: string
}

type MobileNavigationProps = {
  activeHref: string
  items: NavigationItem[]
  routeKey: string
}

export function MobileNavigation({ activeHref, items, routeKey }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsOpen(false)
  }, [routeKey])

  useEffect(() => {
    if (!isOpen) return undefined
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      buttonRef.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  return (
    <div className="mobile-navigation-shell">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        className="menu-button"
        onClick={() => setIsOpen((open) => !open)}
        ref={buttonRef}
        type="button"
      >
        <span aria-hidden="true" className="menu-button__lines">
          <span />
          <span />
        </span>
      </button>

      {isOpen ? (
        <nav aria-label="Mobile navigation" className="mobile-navigation" id="mobile-navigation">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  aria-current={activeHref === item.href ? 'location' : undefined}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
