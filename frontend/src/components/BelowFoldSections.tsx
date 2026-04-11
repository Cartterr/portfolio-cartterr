import Experience from './Experience'
import Projects from './Projects'
import Skills from './Skills'
import Contact from './Contact'

const BelowFoldSections = () => {
  return (
    <>
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm uppercase tracking-[0.2em] text-zinc-500">
        <div className="mx-auto max-w-6xl">
          <p>&copy; 2026 José Carter Arriagada · Built to feel more like engineering work than a template demo.</p>
        </div>
      </footer>
    </>
  )
}

export default BelowFoldSections
