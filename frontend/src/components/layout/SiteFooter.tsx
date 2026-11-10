import type { PortfolioLink, PortfolioMode } from '../../data/portfolio'
import { ModeLink } from './ModeLink'

type SiteFooterProps = {
  links: PortfolioLink[]
  mode: PortfolioMode
  name: string
  navigateMode: (mode: PortfolioMode) => void
}

export function SiteFooter({ links, mode, name, navigateMode }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
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
        <nav aria-label="Portfolio mode" className="site-footer__modes">
          <ModeLink currentMode={mode} mode="software" navigateMode={navigateMode}>
            Software
          </ModeLink>
          <ModeLink currentMode={mode} mode="visual" navigateMode={navigateMode}>
            Visual
          </ModeLink>
        </nav>
      </div>
    </footer>
  )
}
