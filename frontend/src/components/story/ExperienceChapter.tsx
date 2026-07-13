import { PortfolioCarousel } from '../media/PortfolioCarousel'
import type { ExperienceStory, PortfolioMedia } from '../../data/types'

export type ExperienceLayout =
  | 'flagship-split'
  | 'systems-row'
  | 'alternating-chapter'
  | 'field-sticky'
  | 'research-pinned'
  | 'compact-timeline'
  | 'visual-finale'

type ExperienceChapterProps = {
  index: number
  layout: ExperienceLayout
  media: PortfolioMedia[]
  story: ExperienceStory
}

export function ExperienceChapter({ index, layout, media, story }: ExperienceChapterProps) {
  const titleId = `experience-${story.id}-title`
  const autoplayMs = story.id === 'notreDame' ? 9000 : undefined

  return (
    <article
      aria-labelledby={titleId}
      className="software-experience-chapter"
      data-layout={layout}
      data-media-count={media.length}
      data-story={story.id}
      data-testid="experience-chapter"
    >
      <div
        className="software-experience-chapter__copy"
        data-testid={`experience-${story.id}`}
        data-layout={layout}
        data-media-count={media.length}
      >
        <header className="software-experience-chapter__header">
          <p className="software-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </p>
          <div>
            <p className="software-kicker">{story.period}</p>
            <h3 id={titleId}>{story.title}</h3>
            <p className="software-experience-chapter__company">{story.company}</p>
          </div>
        </header>

        <p className="software-experience-chapter__summary">{story.summary}</p>
        <dl className="software-evidence-list">
          <div>
            <dt>Contribution</dt>
            <dd>{story.contribution}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{story.outcome}</dd>
          </div>
        </dl>

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

      <div className="software-experience-chapter__media">
        <PortfolioCarousel
          autoplayMs={autoplayMs}
          featured={layout === 'flagship-split' || layout === 'field-sticky'}
          id={`experience-${story.id}-gallery`}
          label={`${story.company} gallery`}
          media={media}
        />
      </div>
    </article>
  )
}
