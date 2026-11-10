import { ModeLink } from '../components/layout/ModeLink'
import type { PortfolioLink, PortfolioMode } from '../data/portfolio'
import { useRefreshRate, useSantiagoTime } from './lib/hooks'

type SiteFootProps = {
  links: PortfolioLink[]
  location: string
  name: string
  navigateMode: (mode: PortfolioMode) => void
}

export function SiteFoot({ links, location, name, navigateMode }: SiteFootProps) {
  const time = useSantiagoTime()
  const refreshRate = useRefreshRate()

  return (
    <footer className="jc-foot jc-ink">
      <div className="jc-wrap">
        <p aria-hidden="true" className="jc-foot__mark">
          José Carter
        </p>

        <div className="jc-foot__row">
          <p>
            © {new Date().getFullYear()} {name}
          </p>

          <ul aria-label="Contact links">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel={link.external ? 'noreferrer' : undefined}
                  target={link.external ? '_blank' : undefined}
                >
                  {link.label}
                  {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>

          <nav aria-label="Portfolio mode" className="jc-foot__modes">
            <ModeLink currentMode="software" mode="software" navigateMode={navigateMode}>
              Software
            </ModeLink>
            <ModeLink currentMode="software" mode="visual" navigateMode={navigateMode}>
              Visual
            </ModeLink>
          </nav>

          <a className="jc-foot__top" href="#main">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>

        <p className="jc-meta jc-foot__colophon">
          <span>
            {location} · <span className="jc-tabular">{time}</span>
          </span>
          <span>
            Hand-built with React, WebGL and CSS
            {refreshRate ? ` · drawn at ${refreshRate} Hz on this display` : ''}
          </span>
        </p>
      </div>
    </footer>
  )
}
