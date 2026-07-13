import { useCallback, useEffect, useState, type RefCallback } from 'react'

export const useNearViewport = <T extends Element>(
  rootMargin = '360px 0px',
): [RefCallback<T>, boolean, boolean] => {
  const [element, setElement] = useState<T | null>(null)
  const [hasActivated, setHasActivated] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const ref = useCallback<RefCallback<T>>((node) => setElement(node), [])

  useEffect(() => {
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setHasActivated(true)
      setIsNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nearViewport = entries.some((entry) => entry.isIntersecting)
        setIsNearViewport(nearViewport)
        if (nearViewport) setHasActivated(true)
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, rootMargin])

  return [ref, hasActivated, isNearViewport]
}
