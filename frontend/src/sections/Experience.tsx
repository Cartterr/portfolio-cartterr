import { ExperienceChapter } from '../components/story/ExperienceChapter'
import type { ExperienceStory } from '../data/types'

type ExperienceProps = {
  id?: string
  items: ExperienceStory[]
}

export function Experience({ id = 'experience', items }: ExperienceProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="software-section software-experience"
      data-section-boundary
      data-section-index="02"
      data-section-label="Experience"
      data-testid={id.startsWith('software-') ? 'software-section' : undefined}
      id={id}
    >
      <header className="software-section-heading software-section-heading--wide">
        <p className="software-kicker">Experience · 02</p>
        <h2 id={`${id}-title`}>Professional experience</h2>
        <p>
          Roles in product engineering, research, technical education, and scientific computing.
          Detailed project case studies appear in Selected Work above.
        </p>
      </header>

      <div className="software-experience__chapters">
        {items.map((story, index) => (
          <ExperienceChapter index={index} key={story.id} story={story} />
        ))}
      </div>
    </section>
  )
}
