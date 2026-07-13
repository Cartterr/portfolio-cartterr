import { ReactLenis } from 'lenis/react'
import { useEffect, useState, type PropsWithChildren } from 'react'

type SaveDataConnection = EventTarget & {
  saveData?: boolean
}

const lenisOptions = {
  anchors: true,
  autoRaf: true,
  syncTouch: false,
} as const

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

  if (!isEnabled) return children

  return (
    <ReactLenis options={lenisOptions} root>
      {children}
    </ReactLenis>
  )
}
