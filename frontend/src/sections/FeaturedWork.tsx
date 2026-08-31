import { ProjectChapter } from '../components/story/ProjectChapter'
import type { ProjectStory } from '../data/types'

type FeaturedWorkProps = {
  caseStudies: ProjectStory[]
  id?: string
}

export function FeaturedWork({ caseStudies, id = 'work' }: FeaturedWorkProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="software-section software-work"
      data-section-boundary
      data-section-index="03"
      data-section-label="Selected work"
      data-testid={id.startsWith('software-') ? 'software-section' : undefined}
      id={id}
    >
      <header className="software-section-heading">
        <p className="software-kicker">Selected work · 03</p>
        <h2 id={`${id}-title`}>Selected engineering projects</h2>
        <p>
          Six case studies covering the project context, implementation, and operational or
          measurable outcome.
        </p>
      </header>

      <div className="software-project-list">
        {caseStudies.map((project, index) => (
          <ProjectChapter index={index} key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
