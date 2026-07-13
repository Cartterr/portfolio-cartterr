import { useCallback, useEffect, useState, type RefCallback } from 'react'

export const useNearViewport = <T extends Element>(
  rootMargin = '360px 0px',
): [RefCallback<T>, boolean] => {
  const [element, setElement] = useState<T | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const ref = useCallback<RefCallback<T>>((node) => setElement(node), [])

  useEffect(() => {
    if (!element || isNearViewport) return
    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setIsNearViewport(true)
        observer.disconnect()
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, isNearViewport, rootMargin])

  return [ref, isNearViewport]
}
