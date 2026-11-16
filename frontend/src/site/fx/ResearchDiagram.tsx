import { type ReactElement, useId } from 'react'
import type { ResearchOutput } from '../../data/research'

/**
 * Hand-drawn schematics for the research entries. Strokes use currentColor and the accent
 * comes from the page variables, so they follow the paper and the inverted ink panels.
 */

// Three actors on one affect loop, all feeding the subjectification node in the middle.
const affectNodes = [
  { x: 103, y: 53, tx: 130, ty: 88 },
  { x: 217, y: 53, tx: 190, ty: 88 },
  { x: 160, y: 190, tx: 160, ty: 134 },
] as const

function AffectNetwork() {
  return (
    <>
      <defs>
        <marker id="jc-dia-arrow" markerHeight="6" markerWidth="6" orient="auto" refX="5" refY="3">
          <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
        </marker>
      </defs>
      <circle className="jc-dia__accent jc-dia__dash" cx="160" cy="110" fill="none" r="80" />
      <text className="jc-dia__accent-text" x="246" y="148">
        affect
      </text>
      {affectNodes.map((node) => (
        <g key={`${node.x}-${node.y}`}>
          <line
            className="jc-dia__thin"
            markerEnd="url(#jc-dia-arrow)"
            x1={node.x + (node.tx - node.x) * 0.3}
            x2={node.tx}
            y1={node.y + (node.ty - node.y) * 0.3}
            y2={node.ty}
          />
          <circle className="jc-dia__node" cx={node.x} cy={node.y} r="8" />
        </g>
      ))}
      <text textAnchor="end" x="89" y="49">
        youth
      </text>
      <text x="231" y="42">
        platform
      </text>
      <text x="231" y="57">
        features
      </text>
      <text textAnchor="middle" x="160" y="218">
        recommendation algorithm
      </text>
      <rect className="jc-dia__node" height="44" rx="10" width="140" x="90" y="89" />
      <circle className="jc-dia__accent-fill jc-dia__pulse" cx="103" cy="111" r="3.5" />
      <text className="jc-dia__strong" textAnchor="middle" x="166" y="107">
        political
      </text>
      <text className="jc-dia__strong" textAnchor="middle" x="166" y="122">
        subjectification
      </text>
    </>
  )
}

// The megathrust dips from the trench, y = 40 + 0.5 (x - 30); the crustal fault meets it at x = 180.
function FaultSection() {
  return (
    <>
      <line className="jc-dia__thin" x1="12" x2="308" y1="40" y2="40" />
      <text x="12" y="28">
        trench
      </text>
      <text textAnchor="end" x="308" y="28">
        surface
      </text>
      <line x1="30" x2="300" y1="40" y2="175" />
      <line className="jc-dia__accent jc-dia__thick" x1="50" x2="168" y1="50" y2="109" />
      <text x="16" y="124">
        megathrust
      </text>
      <text className="jc-dia__accent-text" x="16" y="139">
        Mw~8.6 rupture
      </text>
      <line x1="220" x2="180" y1="40" y2="115" />
      <line className="jc-dia__accent jc-dia__thick" x1="215" x2="194" y1="49" y2="89" />
      <text className="jc-dia__accent-text" x="226" y="68">
        Mw 7 crustal
      </text>
      <circle className="jc-dia__accent-fill jc-dia__pulse" cx="180" cy="115" r="4.5" />
      <text x="202" y="98">
        segment boundary
      </text>
      <text className="jc-dia__mute" x="202" y="112">
        Mw~9 stops here
      </text>
      <text textAnchor="middle" x="160" y="200">
        Mw 7 crustal events
      </text>
      <line className="jc-dia__thin" x1="30" x2="290" y1="212" y2="212" />
      {[30, 160, 290].map((x) => (
        <line className="jc-dia__thin" key={x} x1={x} x2={x} y1="206" y2="218" />
      ))}
      {[95, 225].map((x) => (
        <text className="jc-dia__mute" key={x} textAnchor="middle" x={x} y="232">
          ~1,100 yr
        </text>
      ))}
    </>
  )
}

// Bars shrink stage by stage; the last stage is the finding, not a count.
const funnelStages = [
  { x: 10, h: 132, value: '386', label: 'scraped', notes: ['138 IG', '248 TikTok'] },
  { x: 120, h: 70, value: '45', label: 'selected', notes: ['21 IG', '24 TikTok'] },
  { x: 230, h: 36, value: '15', label: 'focus group', notes: ['adolescents', 'aged 14-18'] },
] as const

function CorpusFunnel() {
  const mid = 80
  const w = 80
  return (
    <>
      {funnelStages.slice(0, -1).map((stage, index) => {
        const next = funnelStages[index + 1]
        return (
          <polygon
            className="jc-dia__chip"
            key={stage.label}
            points={`${stage.x + w},${mid - stage.h / 2} ${next.x},${mid - next.h / 2} ${next.x},${mid + next.h / 2} ${stage.x + w},${mid + stage.h / 2}`}
          />
        )
      })}
      {funnelStages.map((stage, index) => (
        <g key={stage.label}>
          <rect
            className={index === funnelStages.length - 1 ? 'jc-dia__accent' : undefined}
            fill="none"
            height={stage.h}
            rx="4"
            width={w}
            x={stage.x}
            y={mid - stage.h / 2}
          />
          <text className="jc-dia__value" textAnchor="middle" x={stage.x + w / 2} y={mid + 8}>
            {stage.value}
          </text>
          <text className="jc-dia__strong" textAnchor="middle" x={stage.x + w / 2} y="166">
            {stage.label}
          </text>
          {stage.notes.map((note, line) => (
            <text
              className="jc-dia__mute"
              key={note}
              textAnchor="middle"
              x={stage.x + w / 2}
              y={182 + line * 14}
            >
              {note}
            </text>
          ))}
        </g>
      ))}
      <line className="jc-dia__accent jc-dia__dash" x1="10" x2="298" y1="214" y2="214" />
      <circle className="jc-dia__accent-fill jc-dia__pulse" cx="306" cy="214" r="4" />
      <text className="jc-dia__accent-text" x="10" y="234">
        gap: computational criteria
      </text>
      <text className="jc-dia__accent-text" x="10" y="249">
        vs. real consumption
      </text>
    </>
  )
}

const diagrams = {
  'affect-network': {
    title: 'Political subjectification as an affect loop',
    desc: 'Youth, platform features and the recommendation algorithm sit on one loop labelled affect, and each feeds a central node labelled political subjectification.',
    Body: AffectNetwork,
    height: 230,
  },
  'fault-section': {
    title: 'Megathrust and crustal fault cross-section',
    desc: 'A dipping megathrust (the subduction interface) with a Mw~8.6 rupture, a connected crustal fault with a Mw 7 rupture, the junction marked as the segment boundary where Mw~9 ruptures stop, and a timeline of Mw 7 crustal events about 1,100 years apart.',
    Body: FaultSection,
    height: 240,
  },
  'corpus-funnel': {
    title: 'From scraped accounts to the focus group',
    desc: 'A funnel from 386 scraped accounts (138 Instagram, 248 TikTok) to 45 selected (21 Instagram, 24 TikTok) to a focus group of 15 adolescents aged 14 to 18, ending in the gap between computational criteria and real consumption.',
    Body: CorpusFunnel,
    height: 256,
  },
} satisfies Record<
  ResearchOutput['diagram'],
  { title: string; desc: string; Body: () => ReactElement; height: number }
>

export function ResearchDiagram({ id }: { id: ResearchOutput['diagram'] }) {
  const { title, desc, Body, height } = diagrams[id]
  const uid = useId()
  return (
    <svg
      aria-describedby={`${uid}-desc`}
      aria-labelledby={`${uid}-title`}
      className="jc-dia"
      role="img"
      viewBox={`0 0 320 ${height}`}
    >
      <title id={`${uid}-title`}>{title}</title>
      <desc id={`${uid}-desc`}>{desc}</desc>
      <Body />
    </svg>
  )
}
