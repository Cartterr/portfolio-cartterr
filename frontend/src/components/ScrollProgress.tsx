import { useEffect, useRef, useState } from 'react'

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  const raf = useRef<number | null>(null)
  const last = useRef(0)
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0
      if (Math.abs(pct - last.current) > 0.005) {
        last.current = pct
        setProgress(pct)
      }
      raf.current = null
    }
    const onScroll = () => {
      if (raf.current == null) raf.current = window.requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-1 pointer-events-none will-change-[width]">
      <div
        className="h-full bg-gradient-to-r from-white/20 via-orange-200/20 to-white/10 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

export default ScrollProgress


