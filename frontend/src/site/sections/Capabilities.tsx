import { type CSSProperties, type PointerEvent } from 'react'
import type { CapabilityStory, ProjectStory } from '../../data/types'
import { SectionLabel } from './SectionLabel'

type CapabilitiesProps = {
  groups: CapabilityStory[]
  projects: ProjectStory[]
}

/** Moves each card's highlight to the pointer; only two custom properties change. */
const trackPointer = (event: PointerEvent<HTMLLIElement>) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--sx', `${event.clientX - rect.left}px`)
  card.style.setProperty('--sy', `${event.clientY - rect.top}px`)
}

export function Capabilities({ groups, projects }: CapabilitiesProps) {
  const projectsById = new Map(projects.map((project) => [project.id, project]))

  return (
    <section
      aria-labelledby="software-capabilities-title"
      className="jc-capabilities"
      data-section-index="04"
      data-testid="software-section"
      id="software-capabilities"
    >
      <div className="jc-wrap">
        <header className="jc-head">
          <SectionLabel index="04" label="Capabilities" />
          <h2 className="jc-title" data-reveal id="software-capabilities-title">
            Capabilities
          </h2>
          <p className="jc-head__lede" data-reveal style={{ '--rd': '120ms' } as CSSProperties}>
            Four areas I work in, each linked to the projects that prove it.
          </p>
        </header>

        <ul className="jc-caps">
          {groups.map((group, index) => (
            <li
              className="jc-cap"
              data-reveal
              data-testid="capability-system"
              key={group.id}
              onPointerMove={trackPointer}
              style={{ '--rd': `${index * 80}ms` } as CSSProperties}
            >
              <p aria-hidden="true" className="jc-cap__index">
                C{index + 1}
              </p>
              <h3>{group.title}</h3>
              <p className="jc-cap__summary">{group.summary}</p>
              <ul aria-label={`${group.title} skills`} className="jc-chips">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="jc-cap__proof">
                <p className="jc-meta">Proof</p>
                <ul aria-label={`${group.title} related work`}>
                  {group.proofStoryIds.map((storyId) => {
                    const project = projectsById.get(storyId)
                    return project ? (
                      <li key={storyId}>
                        <a href={`#project-${project.id}`}>
                          <span>{project.title}</span>
                          <span aria-hidden="true">→</span>
                        </a>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
