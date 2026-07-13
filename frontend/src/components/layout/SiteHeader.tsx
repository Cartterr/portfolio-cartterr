import brandAvatar from '../../assets/images/optimized/brand-avatar.webp'
import { useMemo } from 'react'
import type { PortfolioMode, PortfolioPage } from '../../data/portfolio'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { MobileNavigation } from './MobileNavigation'
import { ModeLink } from './ModeLink'

type SiteHeaderProps = {
  mode: PortfolioMode
  navigateMode: (mode: PortfolioMode) => void
  navigation: PortfolioPage['navigation']
  roleLabel: string
}

export function SiteHeader({ mode, navigateMode, navigation, roleLabel }: SiteHeaderProps) {
  const hrefs = useMemo(() => navigation.map(({ href }) => href), [navigation])
  const { activeHref, progress } = useScrollSpy(hrefs)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-identity" href="#main">
          <img alt="" className="site-identity__avatar" height="160" src={brandAvatar} width="160" />
          <span className="site-identity__text">
            <span className="wordmark">José Carter</span>
            <span className="site-role">{roleLabel}</span>
          </span>
        </a>

        <nav aria-label="Primary navigation" className="site-nav">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  aria-current={activeHref === item.href ? 'location' : undefined}
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__controls">
          <nav aria-label="Portfolio mode" className="mode-switch">
            <ModeLink currentMode={mode} mode="software" navigateMode={navigateMode}>
              Software
            </ModeLink>
            <ModeLink currentMode={mode} mode="visual" navigateMode={navigateMode}>
              Visual
            </ModeLink>
          </nav>
          <MobileNavigation activeHref={activeHref} items={navigation} routeKey={mode} />
        </div>

        <span aria-hidden="true" className="site-header__progress">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </header>
  )
}
