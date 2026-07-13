import type { ProjectStory } from '../../data/types'

type ProjectChapterProps = {
  index: number
  project: ProjectStory
}

export function ProjectChapter({ index, project }: ProjectChapterProps) {
  const titleId = `project-${project.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="software-project-chapter"
      data-direction={index % 2 === 0 ? 'media-first' : 'copy-first'}
      data-testid="project-chapter"
      id={`project-${project.id}`}
    >
      <figure className="software-project-chapter__media">
        <img
          alt={project.imageAlt}
          decoding="async"
          height={project.imageHeight}
          loading="lazy"
          src={project.image}
          width={project.imageWidth}
        />
        <figcaption>
          <span>{project.eyebrow}</span>
          <span>{project.status}</span>
        </figcaption>
      </figure>

      <div className="software-project-chapter__copy" data-testid={`project-${project.id}`}>
        <div className="software-project-chapter__heading">
          <p className="software-index" aria-hidden="true">
            W{String(index + 1).padStart(2, '0')}
          </p>
          <div>
            <p className="software-kicker">
              {project.role} · {project.period}
            </p>
            <h3 id={titleId}>{project.title}</h3>
          </div>
        </div>

        <dl className="software-project-evidence">
          <div>
            <dt>Constraint</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt>System</dt>
            <dd>{project.contribution}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{project.outcome}</dd>
          </div>
        </dl>

        <ul aria-label={`${project.title} technologies`} className="software-chip-list">
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>

        {project.link ? (
          <a
            className="software-text-link"
            href={project.link.href}
            rel={project.link.external ? 'noreferrer' : undefined}
            target={project.link.external ? '_blank' : undefined}
          >
            {project.link.label}
            <span aria-hidden="true"> ↗</span>
            {project.link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        ) : null}
      </div>
    </article>
  )
}
