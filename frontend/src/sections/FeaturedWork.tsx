import { ArrowLink } from '../components/ui/ArrowLink'
import type { CaseStudy } from '../data/portfolio'

type FeaturedWorkProps = {
  caseStudies: CaseStudy[]
}

export function FeaturedWork({ caseStudies }: FeaturedWorkProps) {
  return (
    <section aria-labelledby="work-title" className="section featured-work" id="work">
      <div className="section-heading">
        <p className="eyebrow">Selected case studies</p>
        <h2 id="work-title">Reliable systems, measured in the real world.</h2>
      </div>

      <div className="case-study-list">
        {caseStudies.map((study, index) => (
          <article className="case-study" data-direction={index % 2 === 0 ? 'media-first' : 'copy-first'} key={study.slug}>
            <figure className="case-study__media">
              <img
                alt={study.imageAlt}
                decoding="async"
                height={study.imageHeight}
                loading="lazy"
                src={study.image}
                width={study.imageWidth}
              />
            </figure>

            <div className="case-study__copy">
              <p
                className={
                  study.slug === 'gridworks-alerting-platform'
                    ? 'eyebrow'
                    : 'eyebrow eyebrow--research'
                }
              >
                {study.eyebrow}
              </p>
              <h3>{study.title}</h3>
              <p className="case-study__meta">
                {study.role} <span aria-hidden="true">·</span> {study.period}
              </p>
              <p className="case-study__summary">{study.summary}</p>
              <dl className="case-study__details">
                <div>
                  <dt>Problem</dt>
                  <dd>{study.problem}</dd>
                </div>
                <div>
                  <dt>Contribution</dt>
                  <dd>{study.contribution}</dd>
                </div>
                <div>
                  <dt>Outcome</dt>
                  <dd>{study.outcome}</dd>
                </div>
              </dl>
              <ul aria-label={`${study.title} technologies`} className="technology-list">
                {study.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
              {study.link ? <ArrowLink className="case-study__link" {...study.link} /> : null}
              {study.private ? <p className="private-label">Private engagement</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
