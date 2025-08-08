import React from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import ScrollProgress from './components/ScrollProgress'

function App() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <footer className="text-center py-12 text-gray-400 border-t border-glass-border">
        <div className="container mx-auto px-6">
          <p>&copy; 2025 José Carter Arriagada. Designed with passion for innovation and excellence.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
