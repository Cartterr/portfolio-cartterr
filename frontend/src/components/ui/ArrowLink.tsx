import type { PortfolioLink } from '../../data/portfolio'

type ArrowLinkProps = PortfolioLink & {
  className?: string
}

export function ArrowLink({ label, href, external = false, className = '' }: ArrowLinkProps) {
  return (
    <a
      className={`arrow-link ${className}`.trim()}
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span>{label}</span>
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      <span aria-hidden="true">{external ? '↗' : '→'}</span>
    </a>
  )
}
