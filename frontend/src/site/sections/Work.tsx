import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getMedia } from '../../data/media'
import type { PortfolioImageMedia, ProjectStory } from '../../data/types'
import { CursorPreview } from '../fx/CursorPreview'
import { useLightbox } from '../fx/lightboxContext'
import { OrgText } from '../fx/OrgText'
import { SectionLabel } from './SectionLabel'

const FEATURED_COUNT = 2

const imagesFor = (project: ProjectStory) =>
  project.mediaIds
    .map(getMedia)
    .filter((media): media is PortfolioImageMedia => media.kind === 'image')

function ProjectFacts({ project }: { project: ProjectStory }) {
  return (
    <dl className="jc-facts">
      <div>
        <dt>Challenge</dt>
        <dd>{project.problem}</dd>
      </div>
      <div>
        <dt>Implementation</dt>
        <dd>{project.contribution}</dd>
      </div>
      <div>
        <dt>Outcome</dt>
        <dd>{project.outcome}</dd>
      </div>
    </dl>
  )
}

function ProjectFooter({ project }: { project: ProjectStory }) {
  return (
    <>
      <ul aria-label={`${project.title} technologies`} className="jc-chips">
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      {project.link ? (
        <a
          className="jc-link"
          href={project.link.href}
          rel={project.link.external ? 'noreferrer' : undefined}
          target={project.link.external ? '_blank' : undefined}
        >
          {project.link.label}
          <span aria-hidden="true"> ↗</span>
          {project.link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      ) : null}
    </>
  )
}

/** The large viewer on a featured project: one image, its caption, and a row of thumbnails. */
function Stage({ label, media }: { label: string; media: PortfolioImageMedia[] }) {
  const [active, setActive] = useState(0)
  const openLightbox = useLightbox()
  const current = media[active]
  if (!current) return null

  return (
    <div className="jc-stage" data-project-gallery>
      <button
        aria-label={`Open image: ${current.alt}`}
        className="jc-stage__main"
        onClick={(event) => openLightbox(media, active, event.currentTarget.querySelector('img'))}
        type="button"
      >
        <img
          alt={current.alt}
          data-fit={current.fit}
          decoding="async"
          height={current.height}
          key={current.id}
          loading="lazy"
          src={current.src}
          style={{ objectFit: current.fit, objectPosition: current.objectPosition }}
          width={current.width}
        />
        <span aria-hidden="true" className="jc-stage__zoom">
          View ↗
        </span>
      </button>
      <div className="jc-stage__bar">
        <p className="jc-stage__caption" key={current.id}>
          {current.caption}
        </p>
        <ul aria-label={`${label} images`} className="jc-stage__thumbs">
          {media.map((item, index) => (
            <li key={item.id}>
              <button
                aria-label={`Show image ${index + 1} of ${media.length}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
                type="button"
              >
                <img alt="" decoding="async" loading="lazy" src={item.thumbnail} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Feature({ index, project }: { index: number; project: ProjectStory }) {
  const titleId = `project-${project.id}-title`
  const media = useMemo(() => imagesFor(project), [project])

  return (
    <article
      aria-labelledby={titleId}
      className="jc-feature"
      data-flip={index % 2 === 1 ? 'true' : 'false'}
      data-media-count={media.length}
      data-reveal
      data-testid="project-chapter"
      id={`project-${project.id}`}
    >
      <div className="jc-feature__media">
        <Stage label={project.title} media={media} />
      </div>
      <div className="jc-feature__copy" data-testid={`project-${project.id}`}>
        <p className="jc-meta jc-feature__status">
          <span aria-hidden="true" className="jc-pulse" />
          {project.status} · {project.period}
        </p>
        <h3 id={titleId}>{project.title}</h3>
        <p className="jc-feature__role">
          {project.role} · <OrgText text={project.eyebrow} />
        </p>
        <p className="jc-feature__summary">{project.summary}</p>
        <ProjectFacts project={project} />
        <ProjectFooter project={project} />
      </div>
    </article>
  )
}

type RowProps = {
  index: number
  isOpen: boolean
  onHover: (id: string | null, anchor?: HTMLElement) => void
  onToggle: () => void
  project: ProjectStory
}

function Row({ index, isOpen, onHover, onToggle, project }: RowProps) {
  const titleId = `project-${project.id}-title`
  const panelId = `project-${project.id}-panel`
  const media = useMemo(() => imagesFor(project), [project])
  const openLightbox = useLightbox()

  return (
    <li
      className="jc-row"
      data-media-count={media.length}
      data-open={isOpen ? 'true' : 'false'}
      data-reveal
      data-testid="project-chapter"
      id={`project-${project.id}`}
    >
      <h3 className="jc-row__heading" id={titleId}>
        <button
          aria-controls={panelId}
          aria-expanded={isOpen}
          className="jc-row__button"
          onClick={onToggle}
          onPointerEnter={(event) => onHover(isOpen ? null : project.id, event.currentTarget)}
          onPointerLeave={() => onHover(null)}
          type="button"
        >
          <span aria-hidden="true" className="jc-row__index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="jc-row__title">{project.title}</span>
          <span className="jc-row__meta">
            <span>
              <OrgText text={project.eyebrow} />
            </span>
            <span>{project.period}</span>
          </span>
          <span aria-hidden="true" className="jc-row__icon" />
        </button>
      </h3>
      <div
        aria-labelledby={titleId}
        className="jc-row__panel"
        id={panelId}
        inert={!isOpen}
        role="region"
      >
        <div className="jc-row__clip">
          <div className="jc-row__body" data-testid={`project-${project.id}`}>
            <ul aria-label={`${project.title} images`} className="jc-row__media" data-project-gallery>
              {media.map((item, mediaIndex) => (
                <li key={item.id}>
                  <button
                    aria-label={`Open image: ${item.alt}`}
                    className="jc-shot"
                    onClick={(event) =>
                      openLightbox(media, mediaIndex, event.currentTarget.querySelector('img'))
                    }
                    type="button"
                  >
                    <img
                      alt={item.alt}
                      decoding="async"
                      height={item.height}
                      loading="lazy"
                      src={item.src}
                      style={{ aspectRatio: `${item.width} / ${item.height}` }}
                      width={item.width}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div className="jc-row__copy">
              <p className="jc-meta">
                {project.role} · {project.status}
              </p>
              <p className="jc-row__summary">{project.summary}</p>
              <ProjectFacts project={project} />
              <ProjectFooter project={project} />
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

type WorkProps = {
  projects: ProjectStory[]
}

export function Work({ projects }: WorkProps) {
  const featured = projects.slice(0, FEATURED_COUNT)
  const archive = useMemo(() => projects.slice(FEATURED_COUNT), [projects])
  const [openId, setOpenId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const hover = useCallback((id: string | null, anchor?: HTMLElement) => {
    if (anchor) anchorRef.current = anchor
    setHoverId(id)
  }, [])

  const previews = useMemo(
    () =>
      archive.flatMap((project) => {
        const first = imagesFor(project)[0]
        return first ? [{ id: project.id, src: first.src }] : []
      }),
    [archive],
  )

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace(/^#project-/, '')
      if (id !== window.location.hash && archive.some((project) => project.id === id)) {
        setOpenId(id)
      }
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [archive])

  return (
    <section
      aria-labelledby="software-work-title"
      className="jc-work"
      data-section-index="02"
      data-testid="software-section"
      id="software-work"
    >
      <div className="jc-wrap">
        <header className="jc-head">
          <SectionLabel
            index="02"
            label="Work"
            note={`${String(projects.length).padStart(2, '0')} projects`}
          />
          <h2 className="jc-title" data-reveal id="software-work-title">
            Selected work
          </h2>
          <p className="jc-head__lede" data-reveal style={{ '--rd': '120ms' } as CSSProperties}>
            Robots that pack and patrol, headsets that measure collaboration, and the platforms and
            research pipelines behind them.
          </p>
        </header>

        <div className="jc-features">
          {featured.map((project, index) => (
            <Feature index={index} key={project.id} project={project} />
          ))}
        </div>

        <p className="jc-meta jc-rows__label" data-reveal>
          Earlier work · open a row for the case study
        </p>
        <ol className="jc-rows">
          {archive.map((project, index) => (
            <Row
              index={index + FEATURED_COUNT}
              isOpen={openId === project.id}
              key={project.id}
              onHover={hover}
              onToggle={() => {
                setHoverId(null)
                setOpenId((current) => (current === project.id ? null : project.id))
              }}
              project={project}
            />
          ))}
        </ol>
      </div>
      <CursorPreview activeId={hoverId} anchorRef={anchorRef} items={previews} />
    </section>
  )
}
