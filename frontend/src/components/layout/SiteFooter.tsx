import type { PortfolioLink, PortfolioMode } from '../../data/portfolio'

type SiteFooterProps = {
  links: PortfolioLink[]
  mode: PortfolioMode
  name: string
}

export function SiteFooter({ links, mode, name }: SiteFooterProps) {
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
        <p>{mode === 'software' ? 'Software portfolio' : 'Visual / 3D portfolio'}</p>
      </div>
    </footer>
  )
}
