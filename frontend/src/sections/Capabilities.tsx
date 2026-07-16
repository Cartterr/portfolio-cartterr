import type { CapabilityStory, ProjectStory, ServiceStory } from '../data/types'

type CapabilitiesProps = {
  groups: CapabilityStory[]
  id?: string
  projects?: ProjectStory[]
  services?: ServiceStory[]
}

export function Capabilities({ groups, id, projects = [], services = [] }: CapabilitiesProps) {
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
                const proofLink = project?.links?.[0] ?? {
                  href: `#project-${storyId}`,
                  external: false,
                }
                return (
                  <li key={storyId}>
                    <a
                      href={proofLink.href}
                      rel={proofLink.external ? 'noreferrer' : undefined}
                      target={proofLink.external ? '_blank' : undefined}
                    >
                      Proof: {project?.title ?? storyId}
                      <span aria-hidden="true"> ↗</span>
                      {proofLink.external ? (
                        <span className="sr-only"> (opens in a new tab)</span>
                      ) : null}
                    </a>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </div>

      {services.length > 0 ? (
        <div className="software-services">
          <header className="software-services__heading">
            <p className="software-kicker">Available collaboration</p>
            <h2>Services</h2>
          </header>
          <div className="software-services__grid">
            {services.map((service, index) => (
              <article className="software-service" key={service.id}>
                <p className="software-index" aria-hidden="true">
                  S{String(index + 1).padStart(2, '0')}
                </p>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul className="software-chip-list" aria-label={`${service.title} deliverables`}>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
