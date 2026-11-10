/**
 * Jumps to a stored scroll position. The Software page opts into smooth scrolling for its
 * in-page links; restoring a position (Back, Forward, a mode switch) must not animate.
 */
export const forceScrollTo = (top: number) => {
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo({ behavior: 'auto', left: 0, top })
  root.style.scrollBehavior = previous
}
