import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import brandAvatar from '../assets/images/optimized/brand-avatar.webp'

const items = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

const Navigation = () => {
  const [activeId, setActiveId] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const topSurfaceClass = isScrolled
    ? 'border-transparent bg-black/78 shadow-[0_18px_50px_rgba(0,0,0,0.35)]'
    : 'border-white/10 bg-black/52 shadow-[0_10px_30px_rgba(0,0,0,0.22)]'
  const mobileSurfaceClass = isScrolled
    ? 'border-transparent bg-black/82 shadow-[0_18px_50px_rgba(0,0,0,0.35)]'
    : 'border-white/10 bg-black/60 shadow-[0_10px_30px_rgba(0,0,0,0.22)]'

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.2, 0.4, 0.65] },
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeMenu = () => setMobileOpen(false)
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    window.addEventListener('hashchange', closeMenu)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('hashchange', closeMenu)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-3">
        <a
          href="#home"
          className={`group flex items-center gap-3 rounded-[1.35rem] border px-4 py-3 backdrop-blur-xl transition ${topSurfaceClass}`}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition group-hover:border-orange-300/30">
            <img
              src={brandAvatar}
              alt="José Carter"
              className="h-full w-full object-cover"
              width="160"
              height="160"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block text-[10px] uppercase tracking-[0.24em] text-zinc-500">José Carter</span>
            <span className="block text-sm font-medium text-zinc-200">AI Systems and Software</span>
          </span>
        </a>

        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border text-zinc-100 backdrop-blur-xl transition md:hidden ${topSurfaceClass}`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <nav
            className={`hidden items-center gap-1 rounded-[1.6rem] border px-2 py-2 backdrop-blur-xl md:flex ${topSurfaceClass}`}
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group relative rounded-xl px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition ${
                  activeId === item.id
                    ? 'text-[#f8f5ec]'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute inset-x-4 bottom-2 h-px origin-left rounded-full bg-gradient-to-r from-orange-300 via-orange-200 to-transparent transition ${
                    activeId === item.id ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
                  }`}
                />
              </a>
            ))}
          </nav>

          {mobileOpen ? (
            <div
              id="mobile-navigation"
              className={`grid w-[min(22rem,calc(100vw-2rem))] grid-cols-2 gap-2 rounded-[1.6rem] border p-3 backdrop-blur-xl md:hidden ${mobileSurfaceClass}`}
            >
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-[1rem] border px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.18em] transition ${
                    activeId === item.id
                      ? 'border-orange-300/30 bg-orange-300/10 text-orange-100'
                      : 'border-white/8 bg-white/[0.03] text-zinc-200 hover:border-white/12 hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Navigation
