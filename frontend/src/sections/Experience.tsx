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
        <h2 id={`${id}-title`}>Seven roles. One systems practice.</h2>
        <p>
          Product delivery, research engineering, technical teaching, and scientific computing —
          the career line at a glance. The deep dives live in Selected Work below.
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
