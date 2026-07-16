import type { ExperienceStory } from '../../data/types'

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
          {story.link ? (
            <a
              className="software-text-link"
              href={story.link.href}
              rel={story.link.external ? 'noreferrer' : undefined}
              target={story.link.external ? '_blank' : undefined}
            >
              {story.link.label}
              <span aria-hidden="true"> ↗</span>
              {story.link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
