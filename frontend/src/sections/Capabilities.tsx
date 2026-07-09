import type { CapabilityGroup } from '../data/portfolio'

type CapabilitiesProps = {
  groups: CapabilityGroup[]
}

function Capabilities({ groups }: CapabilitiesProps) {
  return (
    <section aria-labelledby="capabilities-title" className="section capabilities">
      <div className="section-heading">
        <p className="eyebrow">Capabilities</p>
        <h2 id="capabilities-title">A practical toolkit for complex systems.</h2>
      </div>

      <div className="capability-grid">
        {groups.map((group) => (
          <article className="capability-group" key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.summary}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Capabilities
