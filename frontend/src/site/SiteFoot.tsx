import { ModeLink } from '../components/layout/ModeLink'
import type { PortfolioLink, PortfolioMode } from '../data/portfolio'

type SiteFootProps = {
  links: PortfolioLink[]
  name: string
  navigateMode: (mode: PortfolioMode) => void
}

export function SiteFoot({ links, name, navigateMode }: SiteFootProps) {
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
      </div>
    </footer>
  )
}
