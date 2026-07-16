import type { CapabilityStory, ProjectStory } from '../data/types'

type CapabilitiesProps = {
  groups: CapabilityStory[]
  id?: string
  projects?: ProjectStory[]
}

export function Capabilities({ groups, id, projects = [] }: CapabilitiesProps) {
  const projectById = new Map(projects.map((project) => [project.id, project]))
  const titleId = `${id ?? 'capabilities'}-title`

  return (
    <section
      aria-labelledby={titleId}
      className="software-section software-capabilities"
      data-testid={id?.startsWith('software-') ? 'software-section' : undefined}
      id={id}
    >
      <header className="software-section-heading software-section-heading--wide">
        <p className="software-kicker">Capabilities · 04</p>
        <h2 id={titleId}>Four systems of practice, each tied to shipped proof.</h2>
      </header>

      <div className="software-capability-list">
        {groups.map((group, index) => (
          <article className="software-capability-system" data-testid="capability-system" key={group.id}>
            <p className="software-index" aria-hidden="true">
              C{String(index + 1).padStart(2, '0')}
            </p>
            <div className="software-capability-system__copy">
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
            </div>
            <ul aria-label={`${group.title} tools`} className="software-chip-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul aria-label={`${group.title} proof`} className="software-capability-system__proof">
              {group.proofStoryIds.map((storyId) => {
                const project = projectById.get(storyId)
                return (
                  <li key={storyId}>
                    <a href={`#project-${storyId}`}>
                      Proof: {project?.title ?? storyId}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
