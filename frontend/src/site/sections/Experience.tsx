import type { ExperienceStory } from '../../data/types'
import { SectionLabel } from './SectionLabel'

const isCurrent = (period: string) => /present/i.test(period)

export function Experience({ items }: { items: ExperienceStory[] }) {
  return (
    <section
      aria-labelledby="software-experience-title"
      className="jc-experience"
      data-section-index="03"
      data-testid="software-section"
      id="software-experience"
    >
      <div className="jc-wrap">
        <header className="jc-head">
          <SectionLabel
            index="03"
            label="Experience"
            note={`${String(items.length).padStart(2, '0')} roles`}
          />
          <h2 className="jc-title" data-reveal id="software-experience-title">
            Experience
          </h2>
        </header>

        <ol className="jc-xp">
          {items.map((item) => (
            <li className="jc-xp__row" data-reveal data-testid="experience-story" key={item.id}>
              <p className="jc-xp__period">
                {isCurrent(item.period) ? <span aria-hidden="true" className="jc-pulse" /> : null}
                {item.period}
              </p>
              <div className="jc-xp__role">
                <h3>{item.title}</h3>
                <p>{item.company}</p>
              </div>
              <div className="jc-xp__detail">
                <p>{item.summary}</p>
                <p className="jc-xp__outcome">{item.outcome}</p>
                <ul aria-label={`${item.company} technologies`} className="jc-chips jc-chips--quiet">
                  {item.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                {item.link ? (
                  <a
                    className="jc-link"
                    href={item.link.href}
                    rel={item.link.external ? 'noreferrer' : undefined}
                    target={item.link.external ? '_blank' : undefined}
                  >
                    {item.link.label}
                    <span aria-hidden="true"> ↗</span>
                    {item.link.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
