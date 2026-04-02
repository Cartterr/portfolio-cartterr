import { useEffect, useState } from 'react'

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

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[rgba(10,10,10,0.76)] px-4 py-3 backdrop-blur-md">
        <a href="#home" className="text-sm font-semibold uppercase tracking-[0.25em] text-[#f8f5ec]">
          JC
        </a>
        <div className="flex gap-1 overflow-x-auto">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition ${
                activeId === item.id
                  ? 'bg-zinc-100 text-black text-[#1a120d]'
                  : 'text-zinc-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Navigation
