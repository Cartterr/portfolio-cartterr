import type { ExperienceStory } from '../../data/types'
import { LinkGroup } from '../ui/LinkGroup'

type ExperienceChapterProps = {
  index: number
  story: ExperienceStory
}

export function ExperienceChapter({ index, story }: ExperienceChapterProps) {
  const titleId = `experience-${story.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="software-experience-chapter"
      data-story={story.id}
      data-testid="experience-chapter"
      id={`experience-${story.id}`}
    >
      <div className="software-experience-chapter__copy" data-testid={`experience-${story.id}`}>
        <p className="software-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </p>
        <div className="software-experience-chapter__role">
          <p className="software-kicker">{story.period}</p>
          <h3 id={titleId}>{story.title}</h3>
          <p className="software-experience-chapter__company">{story.company}</p>
        </div>
        <div className="software-experience-chapter__detail">
          <p className="software-experience-chapter__summary">{story.summary}</p>
          <ul aria-label={`${story.company} technologies`} className="software-chip-list">
            {story.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          <LinkGroup label={`${story.company} links`} links={story.links} />
        </div>
      </div>
    </article>
  )
}
