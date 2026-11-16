import type { CSSProperties } from 'react'
import type { ResearchOutput } from '../../data/research'
import type { ProjectStory } from '../../data/types'
import { ResearchDiagram } from '../fx/ResearchDiagram'
import { SectionLabel } from './SectionLabel'

type ResearchProps = {
  items: ResearchOutput[]
  projects: ProjectStory[]
}

export function Research({ items, projects }: ResearchProps) {
  const projectsById = new Map(projects.map((project) => [project.id, project]))

  return (
    <section
      aria-labelledby="software-research-title"
      className="jc-research"
      data-section-index="03"
      data-testid="software-section"
      id="research"
    >
      <div className="jc-wrap">
        <header className="jc-head">
          <SectionLabel
            index="03"
            label="Research"
            note={`${String(items.length).padStart(2, '0')} outputs`}
          />
          <h2 className="jc-title" data-reveal id="software-research-title">
            Research &amp; public work
          </h2>
          <p className="jc-head__lede" data-reveal style={{ '--rd': '120ms' } as CSSProperties}>
            Papers, abstracts and posters I co-authored, from earthquake simulation to youth on
            social platforms.
          </p>
        </header>

        <ol className="jc-pubs">
          {items.map((item) => {
            const related = item.relatedProjectId ? projectsById.get(item.relatedProjectId) : null
            const titleId = `research-${item.id}-title`
            return (
              <li data-reveal data-testid="research-output" key={item.id}>
                <article aria-labelledby={titleId} className="jc-cap jc-pub" id={`research-${item.id}`}>
                  <div className="jc-pub__copy">
                    <p className="jc-meta">
                      <span className="jc-pub__type">{item.type}</span> · {item.year}
                    </p>
                    <h3 id={titleId} lang={item.titleLang}>
                      {item.title}
                    </h3>
                    {item.subtitle ? <p className="jc-pub__subtitle">{item.subtitle}</p> : null}
                    <p className="jc-pub__venue">{item.venue}</p>
                    <p className="jc-pub__authors">
                      {item.authors.map((author, index) => (
                        <span key={author.name}>
                          {index ? ', ' : null}
                          {author.self ? <strong>{author.name}</strong> : author.name}
                        </span>
                      ))}
                    </p>
                    <p className="jc-cap__summary">{item.summary}</p>
                    <div className="jc-pub__links">
                      {item.url ? (
                        <a className="jc-link" href={item.url} rel="noopener noreferrer" target="_blank">
                          {item.linkLabel ?? 'Open'}
                          <span aria-hidden="true"> ↗</span>
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <p className="jc-meta">No public version yet</p>
                      )}
                      {item.doi ? <p className="jc-meta">DOI {item.doi}</p> : null}
                      {related ? (
                        <a className="jc-pub__related" href={`#project-${related.id}`}>
                          Related project: {related.title} <span aria-hidden="true">→</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <figure className="jc-pub__figure">
                    <ResearchDiagram id={item.diagram} />
                  </figure>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
