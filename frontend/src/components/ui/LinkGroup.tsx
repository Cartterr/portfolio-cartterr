import type { PortfolioLink } from '../../data/types'

type LinkGroupProps = {
  label: string
  links?: PortfolioLink[]
}

export function LinkGroup({ label, links }: LinkGroupProps) {
  if (!links?.length) return null

  return (
    <div aria-label={label} className="software-link-group" role="group">
      {links.map((link) => (
        <a
          className="software-text-link"
          download={link.download}
          href={link.href}
          key={`${link.label}-${link.href}`}
          rel={link.external ? 'noreferrer' : undefined}
          target={link.external ? '_blank' : undefined}
        >
          {link.label}
          {link.external ? <span aria-hidden="true"> ↗</span> : null}
          {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      ))}
    </div>
  )
}
