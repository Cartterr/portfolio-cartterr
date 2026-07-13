import {
  ExperienceChapter,
  type ExperienceLayout,
} from '../components/story/ExperienceChapter'
import type { ExperienceStory, PortfolioMedia } from '../data/types'

type ExperienceProps = {
  id?: string
  items: ExperienceStory[]
  media?: PortfolioMedia[]
}

const layoutByStory: Record<string, ExperienceLayout> = {
  dily: 'flagship-split',
  gridworks: 'systems-row',
  flair: 'alternating-chapter',
  notreDame: 'field-sticky',
  politiktok: 'research-pinned',
  teaching: 'compact-timeline',
  geoscience: 'visual-finale',
}

export function Experience({ id = 'experience', items, media = [] }: ExperienceProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="software-section software-experience"
      data-testid={id.startsWith('software-') ? 'software-section' : undefined}
      id={id}
    >
      <header className="software-section-heading software-section-heading--wide">
        <p className="software-kicker">Experience · 02</p>
        <h2 id={`${id}-title`}>Seven chapters. One systems practice.</h2>
        <p>
          Product delivery, research engineering, technical teaching, and scientific computing—
          each shaped around the constraints that made the work matter.
        </p>
      </header>

      <div className="software-experience__chapters">
        {items.map((story, index) => (
          <ExperienceChapter
            index={index}
            key={story.id}
            layout={layoutByStory[story.id] ?? 'alternating-chapter'}
            media={media.filter((item) => item.storyId === story.id)}
            story={story}
          />
        ))}
      </div>
    </section>
  )
}
