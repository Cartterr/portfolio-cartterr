export const FORCE_SCROLL_EVENT = 'portfolio:force-scroll'

export type ForceScrollDetail = {
  top: number
}

export const forceScrollTo = (top: number) => {
  window.scrollTo({ behavior: 'auto', left: 0, top })
  window.dispatchEvent(
    new CustomEvent<ForceScrollDetail>(FORCE_SCROLL_EVENT, { detail: { top } }),
  )
}
