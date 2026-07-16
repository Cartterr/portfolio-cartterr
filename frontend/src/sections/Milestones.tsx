import { getMedia } from '../data/media'
import type { MilestoneStory } from '../data/types'
import { LinkGroup } from '../components/ui/LinkGroup'

type MilestonesProps = {
  id?: string
  items: MilestoneStory[]
}

export function Milestones({ id = 'milestones', items }: MilestonesProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="software-section software-milestones"
      data-testid={id.startsWith('software-') ? 'software-section' : undefined}
      id={id}
    >
      <div className="software-section-heading software-section-heading--wide">
        <p className="software-kicker">Evidence · 02</p>
        <h2 id={`${id}-title`}>Milestones & credentials</h2>
        <p>
          Education, published research, teaching recognition, and technical communities backed by
          public evidence.
        </p>
      </div>

      <div className="software-milestones__grid">
        {items.map((item, index) => {
          const media = item.mediaId ? getMedia(item.mediaId) : undefined

          return (
            <article className="software-milestone" data-testid="milestone-story" key={item.id}>
              {media?.kind === 'image' ? (
                <div className="software-milestone__media">
                  <img
                    alt={media.alt}
                    height={media.height}
                    loading="lazy"
                    src={media.src}
                    style={{ objectPosition: media.objectPosition }}
                    width={media.width}
                  />
                </div>
              ) : null}
              <div className="software-milestone__copy">
                <p className="software-index" aria-hidden="true">
                  M{String(index + 1).padStart(2, '0')}
                </p>
                <p className="software-kicker">{item.category} · {item.period}</p>
                <h3>{item.title}</h3>
                <p className="software-milestone__issuer">{item.issuer}</p>
                <p className="software-milestone__summary">{item.summary}</p>
                {item.skills?.length ? (
                  <ul aria-label={`${item.title} skills`} className="software-chip-list">
                    {item.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                ) : null}
                <LinkGroup label={`${item.title} evidence`} links={item.links} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
