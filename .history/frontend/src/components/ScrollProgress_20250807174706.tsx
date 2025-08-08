import React, { useEffect, useState } from 'react'

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0
      setProgress(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60]">
      <div
        className="h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

export default ScrollProgress


