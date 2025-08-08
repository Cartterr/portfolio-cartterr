import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }))

      const current = sections.find(section => {
        if (!section.element) return false
        const rect = section.element.getBoundingClientRect()
        return rect.top <= 200 && rect.bottom >= 200
      })

      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      document.documentElement.style.setProperty('--x', `${x}px`)
      document.documentElement.style.setProperty('--y', `${y}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
      className="fixed top-4 sm:top-8 left-4 right-4 sm:left-auto sm:right-8 z-50 glass-effect rounded-full px-4 sm:px-6 py-3"
    >
      <div className="flex gap-2 sm:gap-6 justify-center sm:justify-end overflow-x-auto">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className={`text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
              activeSection === item.id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}

export default Navigation
