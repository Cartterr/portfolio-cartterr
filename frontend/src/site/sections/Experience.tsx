import type { CSSProperties, ReactNode } from 'react'
import type { ExperienceStory } from '../../data/types'
import { SectionLabel } from './SectionLabel'

const isCurrent = (period: string) => /present/i.test(period)

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** Short names for the timeline chart, where the full company line does not fit. */
const shortLabels: Record<string, string> = {
  dictuc: 'DICTUC XR Lab',
  notreDame: 'Notre Dame',
  politiktok: 'Politiktok',
  teaching: 'Teaching, UC',
  geoscience: 'Simulation, UC',
}

type Span = { start: number; end: number; approximate: boolean }

/** Months since year 0, so spans can be compared and subtracted. */
const monthIndex = (year: number, month: number) => year * 12 + month

const parseEdge = (edge: string, now: number, isEnd: boolean): number | null => {
  const text = edge.trim().toLowerCase()
  if (text === 'present') return now
  const match = /^([a-z]{3})[a-z]*\s+(\d{4})$/.exec(text)
  if (match) {
    const month = MONTHS.indexOf(match[1])
    return month < 0 ? null : monthIndex(Number(match[2]), month)
  }
  const year = /^(\d{4})$/.exec(text)
  if (year) return monthIndex(Number(year[1]), isEnd ? 11 : 0)
  return null
}

const parseSpan = (period: string, now: number): Span | null => {
  const [from, to = from] = period.split(/\s+[-–]\s+/)
  const start = parseEdge(from, now, false)
  const end = parseEdge(to, now, true)
  if (start === null || end === null) return null
  // A bare year ("2026") gives no months, so the chart marks it as approximate.
  const approximate = /^\s*\d{4}\s*$/.test(period)
  return { start, end: Math.min(end, now), approximate }
}

const formatTenure = (months: number) => {
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 0) return `${rest} mo`
  return rest === 0 ? `${years} yr` : `${years} yr ${rest} mo`
}

/** Numbers in an outcome (18 runs, 0.48 s, 10x, 50%) get their own emphasis. */
const FIGURE = /(\d(?:[\d,.]*\d)?(?:\s?(?:x|fps|ms|s)\b|%)?)/g

const withFigures = (text: string): ReactNode[] =>
  text.split(FIGURE).map((part, index) =>
    index % 2 === 1 ? (
      <strong className="jc-figure" key={index}>
        {part}
      </strong>
    ) : (
      part
    ),
  )

export function Experience({ items }: { items: ExperienceStory[] }) {
  const today = new Date()
  const now = monthIndex(today.getFullYear(), today.getMonth())
  const spans = items.map((item) => parseSpan(item.period, now))
  const known = spans.filter((span): span is Span => span !== null)
  const firstYear = Math.floor(Math.min(...known.map((span) => span.start), now) / 12)
  const axisStart = monthIndex(firstYear, 0)
  const axisEnd = now + 3
  const axisLength = axisEnd - axisStart
  const years = Array.from(
    { length: Math.floor(axisEnd / 12) - firstYear + 1 },
    (_, index) => firstYear + index,
  ).filter((year) => monthIndex(year, 0) <= now)
  const pct = (month: number) => `${((month - axisStart) / axisLength) * 100}%`

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

        {known.length > 0 ? (
          <figure className="jc-span" data-reveal>
            <figcaption className="jc-span__caption">
              <span>Timeline</span>
              <span className="jc-span__legend">
                <span className="jc-span__key jc-span__key--now">Current</span>
                <span className="jc-span__key">Past</span>
                {known.some((span) => span.approximate) ? (
                  <span className="jc-span__key jc-span__key--approx">Year only</span>
                ) : null}
              </span>
            </figcaption>
            <div className="jc-span__chart">
              <div aria-hidden="true" className="jc-span__axis">
                {years.map((year) => (
                  <span key={year} style={{ left: pct(monthIndex(year, 0)) }}>
                    {year}
                  </span>
                ))}
                <span className="jc-span__now" style={{ left: pct(now) }}>
                  Now
                </span>
              </div>
              <ol aria-label="Roles over time" className="jc-span__rows">
                {items.map((item, index) => {
                  const span = spans[index]
                  if (!span) return null
                  const current = isCurrent(item.period)
                  const style = {
                    '--x': pct(span.start),
                    '--w': `${(Math.max(span.end - span.start + 1, 1) / axisLength) * 100}%`,
                    '--i': index,
                  } as CSSProperties
                  return (
                    <li key={item.id}>
                      <a className="jc-span__row" href={`#xp-${item.id}`}>
                        <span className="jc-span__label">
                          {shortLabels[item.id] ?? item.company.split(',')[0]}
                        </span>
                        <span className="jc-span__track">
                          <span
                            className="jc-span__bar"
                            data-approx={span.approximate || undefined}
                            data-current={current || undefined}
                            style={style}
                          />
                        </span>
                        <span className="sr-only">, {item.period}</span>
                      </a>
                    </li>
                  )
                })}
              </ol>
              <div aria-hidden="true" className="jc-span__grid">
                {years.map((year) => (
                  <span key={year} style={{ left: pct(monthIndex(year, 0)) }} />
                ))}
                <span className="jc-span__nowline" style={{ left: pct(now) }} />
              </div>
            </div>
          </figure>
        ) : null}

        <ol className="jc-xp">
          {items.map((item, index) => {
            const span = spans[index]
            const current = isCurrent(item.period)
            return (
              <li
                className="jc-xp__row"
                data-current={current || undefined}
                data-reveal
                data-testid="experience-story"
                id={`xp-${item.id}`}
                key={item.id}
              >
                <div className="jc-xp__when">
                  <span aria-hidden="true" className="jc-xp__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="jc-xp__period">
                    {current ? <span aria-hidden="true" className="jc-pulse" /> : null}
                    {item.period}
                  </p>
                  {span && !span.approximate ? (
                    <p className="jc-xp__tenure">{formatTenure(span.end - span.start + 1)}</p>
                  ) : null}
                </div>
                <div className="jc-xp__role">
                  <h3>{item.title}</h3>
                  <p>{item.company}</p>
                </div>
                <div className="jc-xp__detail">
                  <p>{item.summary}</p>
                  <p className="jc-xp__outcome">{withFigures(item.outcome)}</p>
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
            )
          })}
        </ol>
      </div>
    </section>
  )
}
