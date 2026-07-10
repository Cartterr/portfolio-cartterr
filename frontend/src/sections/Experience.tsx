import type { ExperienceItem } from '../data/portfolio'

type ExperienceProps = {
  items: ExperienceItem[]
}

export function Experience({ items }: ExperienceProps) {
  return (
    <section aria-labelledby="experience-title" className="section experience" id="experience">
      <div className="section-heading section-heading--split">
        <p className="eyebrow">Experience</p>
        <h2 id="experience-title">From product delivery to research infrastructure.</h2>
      </div>

      <ol className="timeline">
        {items.map((item) => (
          <li className="timeline__item" key={`${item.company}-${item.period}`}>
            <p className="timeline__period">{item.period}</p>
            <div className="timeline__role">
              <h3>{item.title}</h3>
              <p>{item.company}</p>
            </div>
            <p className="timeline__summary">{item.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
