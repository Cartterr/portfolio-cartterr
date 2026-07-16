import { ReactLenis, useLenis } from 'lenis/react'
import { Fragment, useEffect, useState, type PropsWithChildren } from 'react'
import { FORCE_SCROLL_EVENT, type ForceScrollDetail } from '../../hooks/forceScroll'

type SaveDataConnection = EventTarget & {
  saveData?: boolean
}

const lenisOptions = {
  anchors: true,
  autoRaf: true,
  syncTouch: false,
} as const

function ForceScrollListener() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return undefined
    const handleForceScroll = (event: Event) => {
      const detail = (event as CustomEvent<ForceScrollDetail>).detail
      if (!detail) return
      lenis.scrollTo(detail.top, { force: true, immediate: true })
    }

    window.addEventListener(FORCE_SCROLL_EVENT, handleForceScroll)
    return () => window.removeEventListener(FORCE_SCROLL_EVENT, handleForceScroll)
  }, [lenis])

  return null
}

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia) return undefined
    const capablePointer = window.matchMedia('(min-width: 769px) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (
      navigator as Navigator & { connection?: SaveDataConnection }
    ).connection
    const update = () => {
      setIsEnabled(capablePointer.matches && !reducedMotion.matches && !connection?.saveData)
    }

    update()
    capablePointer.addEventListener('change', update)
    reducedMotion.addEventListener('change', update)
    connection?.addEventListener('change', update)
    return () => {
      capablePointer.removeEventListener('change', update)
      reducedMotion.removeEventListener('change', update)
      connection?.removeEventListener('change', update)
    }
  }, [])

  return (
    <>
      <Fragment key="application">{children}</Fragment>
      {isEnabled ? (
        <ReactLenis options={lenisOptions} root>
          <ForceScrollListener />
          <span aria-hidden="true" data-lenis-controller hidden />
        </ReactLenis>
      ) : null}
    </>
  )
}
