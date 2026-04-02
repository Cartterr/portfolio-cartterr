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
    <div className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      <div className="relative overflow-x-hidden">

      <ScrollProgress />
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm uppercase tracking-[0.2em] text-zinc-500">
        <div className="mx-auto max-w-6xl">
          <p>&copy; 2026 José Carter Arriagada · Built to feel more like engineering work than a template demo.</p>
        </div>
      </footer>
      </div>
    </div>
  )
}

export default App
