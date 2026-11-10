import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import brandAvatar from '../assets/images/optimized/brand-avatar.webp'
import type { PortfolioLink, PortfolioPage } from '../data/portfolio'
import { useScrollSpy } from '../hooks/useScrollSpy'

type SiteNavProps = {
  navigation: PortfolioPage['navigation']
  roleLabel: string
  resume: PortfolioLink
}

type Pill = { left: number; width: number; visible: boolean }

/**
 * The floating navigation: one pill slides under whichever link is hovered, and rests
 * under the section being read. On small screens it folds into a full-width sheet.
 */
export function SiteNav({ navigation, roleLabel, resume }: SiteNavProps) {
  const hrefs = useMemo(() => navigation.map(({ href }) => href), [navigation])
  const { activeHref, progress } = useScrollSpy(hrefs, 'software')
  const [hoverHref, setHoverHref] = useState<string | null>(null)
  const [pill, setPill] = useState<Pill>({ left: 0, width: 0, visible: false })
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const targetHref = hoverHref ?? (pastHero ? activeHref : null)

  const measure = useCallback(() => {
    const list = listRef.current
    const link = targetHref
      ? list?.querySelector<HTMLAnchorElement>(`a[href="${targetHref}"]`)
      : null
    if (!link) {
      setPill((current) => (current.visible ? { ...current, visible: false } : current))
      return
    }
    setPill({ left: link.offsetLeft, width: link.offsetWidth, visible: true })
  }, [targetHref])

  useEffect(() => {
    measure()
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    if (listRef.current) observer?.observe(listRef.current)
    window.addEventListener('resize', measure)
    return () => {
      cancelled = true
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24)
      setPastHero(window.scrollY > window.innerHeight * 0.45)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const pillStyle = {
    '--pill-x': `${pill.left}px`,
    '--pill-w': `${pill.width}px`,
  } as CSSProperties

  return (
    <header
      className="jc-nav"
      data-open={isOpen ? 'true' : 'false'}
      data-scrolled={scrolled ? 'true' : 'false'}
    >
      <div className="jc-nav__bar">
        <a aria-label={`José Carter — ${roleLabel}`} className="jc-nav__brand" href="#main">
          <img alt="" height="160" src={brandAvatar} width="160" />
          <span>José Carter</span>
        </a>

        <nav aria-label="Primary navigation" className="jc-nav__links">
          <span
            aria-hidden="true"
            className="jc-nav__pill"
            data-visible={pill.visible ? 'true' : 'false'}
            style={pillStyle}
          />
          <ul onPointerLeave={() => setHoverHref(null)} ref={listRef}>
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  aria-current={activeHref === item.href ? 'location' : undefined}
                  href={item.href}
                  onBlur={() => setHoverHref(null)}
                  onFocus={() => setHoverHref(item.href)}
                  onPointerEnter={() => setHoverHref(item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="jc-nav__cta" href={resume.href}>
          <span>Résumé</span>
          <span aria-hidden="true">↓</span>
        </a>

        <button
          aria-controls="jc-mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          className="jc-nav__menu"
          onClick={() => setIsOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <span aria-hidden="true" className="jc-nav__progress">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>

      {isOpen ? (
        <div className="jc-nav__sheet" id="jc-mobile-navigation">
          <nav aria-label="Mobile navigation">
            <ul>
              {navigation.map((item, index) => (
                <li key={item.href} style={{ '--i': index } as CSSProperties}>
                  <a
                    aria-current={activeHref === item.href ? 'location' : undefined}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="jc-nav__sheet-cta" href={resume.href} onClick={() => setIsOpen(false)}>
            {resume.label} <span aria-hidden="true">↓</span>
          </a>
        </div>
      ) : null}
    </header>
  )
}
