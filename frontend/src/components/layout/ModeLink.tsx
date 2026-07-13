import type { MouseEvent, PropsWithChildren } from 'react'
import { getPortfolio, type PortfolioMode } from '../../data/portfolio'

type ModeLinkProps = PropsWithChildren<{
  currentMode: PortfolioMode
  mode: PortfolioMode
  navigateMode: (mode: PortfolioMode) => void
}>

export function ModeLink({ children, currentMode, mode, navigateMode }: ModeLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget.target
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== '_self')
    ) {
      return
    }

    const destination = new URL(event.currentTarget.href, window.location.href)
    if (destination.origin !== window.location.origin) return
    event.preventDefault()
    navigateMode(mode)
  }

  return (
    <a
      aria-current={currentMode === mode ? 'page' : undefined}
      className="mode-switch__link"
      data-active={currentMode === mode ? 'true' : 'false'}
      href={getPortfolio(mode).path}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
