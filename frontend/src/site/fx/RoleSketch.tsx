import type { ReactNode } from 'react'

/*
 * One small line drawing per role, for the empty left column of Experience.
 * Everything is drawn in `currentColor` on a shared ground line; one detail per
 * drawing (`.jc-sketch__accent`) takes the signal orange.
 */

const sketches: Record<string, { label: string; body: ReactNode; accent: ReactNode }> = {
  tek: {
    label: 'A robot arm lifting a box',
    body: (
      <>
        <path d="M44 100 v-10 h22 v10" />
        <circle cx="55" cy="84" r="5" />
        <path d="M58 80 L80 54" />
        <circle cx="82" cy="51" r="4" />
        <path d="M86 52 L110 60" />
        <circle cx="112" cy="61" r="2.5" />
        <path d="M112 64 v6 M106 70 h12 M106 70 v6 M118 70 v6" />
      </>
    ),
    accent: <rect height="12" rx="1.5" width="16" x="104" y="88" />,
  },
  dictuc: {
    label: 'A VR headset above a block tower',
    body: (
      <>
        <rect height="34" rx="12" width="80" x="40" y="20" />
        <circle cx="64" cy="37" r="9" />
        <circle cx="96" cy="37" r="9" />
        <path d="M74 54 q6 -7 12 0" />
        <path d="M40 34 C 28 34 24 42 24 50 M120 34 C 132 34 136 42 136 50" />
        <rect height="8" width="22" x="69" y="92" />
        <rect height="8" width="22" x="69" y="76" />
      </>
    ),
    accent: (
      <>
        <rect height="8" width="22" x="69" y="84" />
        <path d="M80 58 V70" strokeDasharray="1.5 3.5" />
      </>
    ),
  },
  gridworks: {
    label: 'A signal mast sending alerts',
    body: (
      <>
        <path d="M70 100 L80 42 L90 100 M73 82 h14 M76 62 h8" />
        <path d="M58 20 q-10 16 0 32 M102 20 q10 16 0 32" />
      </>
    ),
    accent: (
      <>
        <circle cx="80" cy="36" r="3.5" />
        <path d="M67 26 q-6 10 0 20 M93 26 q6 10 0 20" />
      </>
    ),
  },
  siggraph: {
    label: 'A teapot lit by a ray-traced light',
    body: (
      <>
        <path d="M52 94 C 40 92 38 70 52 63 C 62 57 98 57 108 63 C 122 70 120 92 108 94 Z" />
        <path d="M60 94 v6 M100 94 v6" />
        <path d="M64 61 Q 80 49 96 61" />
        <circle cx="80" cy="51" r="3" />
        <path d="M52 84 C 40 82 34 70 30 56 M53 74 C 44 73 38 66 30 56 M30 56 l-5 -3" />
        <path d="M108 68 C 124 64 128 86 110 89" />
      </>
    ),
    accent: (
      <>
        <circle cx="136" cy="22" r="4" />
        <path d="M131 26 L99 58 M133 29 L117 66" strokeDasharray="2 4" />
      </>
    ),
  },
  dily: {
    label: 'A car with a loan tag',
    body: (
      <>
        <path d="M40 90 H32 Q30 90 30 88 V78 Q30 72 36 71 L58 67 L71 54 Q74 51 79 51 H104 Q109 51 112 55 L122 67 L128 69 Q132 70 132 75 V88 Q132 90 130 90 H122 M102 90 H60" />
        <path d="M40 90 a10 10 0 0 1 20 0 M102 90 a10 10 0 0 1 20 0" />
        <circle cx="50" cy="92" r="7.5" />
        <circle cx="112" cy="92" r="7.5" />
        <circle cx="50" cy="92" r="2" />
        <circle cx="112" cy="92" r="2" />
        <path d="M64 67 L74 56 H89 V67 Z M93 56 H104 Q106 56 108 58 L115 67 H93 Z" />
        <path d="M91 70 V86 M84 74 h4 M128 74 h3" />
      </>
    ),
    accent: (
      <>
        <path d="M104 51 Q 110 40 118 33" strokeDasharray="1.5 3.5" />
        <path d="M121 24 H142 V42 H121 L115 33 Z" />
        <path d="M126 38 L137 28" />
        <circle cx="127.5" cy="29.5" r="1.6" />
        <circle cx="135.5" cy="36.5" r="1.6" />
      </>
    ),
  },
  flair: {
    label: 'A building with rooftop HVAC and an outdoor condenser',
    body: (
      <>
        <path d="M28 100 V48 H84 V100" />
        <path d="M38 60 h8 M52 60 h8 M66 60 h8 M38 72 h8 M52 72 h8 M66 72 h8 M38 84 h8 M52 84 h8 M66 84 h8" />
        <rect height="16" rx="2" width="28" x="36" y="32" />
        <circle cx="50" cy="40" r="5" />
        <path d="M50 36 v8 M46 40 h8" />
        <path d="M84 78 H100 M84 82 H100" />
        <rect height="28" rx="2.5" width="36" x="100" y="72" />
        <circle cx="118" cy="86" r="9" />
        <path d="M118 79 v14 M111 86 h14 M113 81 l10 10 M123 81 l-10 10" />
      </>
    ),
    accent: (
      <path d="M43 26 q3 -4 0 -8 q-3 -4 0 -8 M50 26 q3 -4 0 -8 q-3 -4 0 -8 M57 26 q3 -4 0 -8 q-3 -4 0 -8 M140 80 q2 3 5 0 M140 88 q2 3 5 0" />
    ),
  },
  notreDame: {
    label: 'A drone flying a route to a target',
    body: (
      <>
        <rect height="10" rx="3" width="28" x="60" y="40" />
        <path d="M60 44 L42 36 M88 44 L106 36 M60 48 L42 56 M88 48 L106 56" />
        <ellipse cx="42" cy="33" rx="11" ry="2.5" />
        <ellipse cx="106" cy="33" rx="11" ry="2.5" />
        <ellipse cx="42" cy="59" rx="11" ry="2.5" />
        <ellipse cx="106" cy="59" rx="11" ry="2.5" />
      </>
    ),
    accent: (
      <>
        <path d="M74 54 Q 96 90 126 95" strokeDasharray="2 4" />
        <circle cx="130" cy="96" r="3" />
      </>
    ),
  },
  politiktok: {
    label: 'A phone playing a video beside a bar chart',
    body: (
      <>
        <rect height="62" rx="5" width="32" x="40" y="30" />
        <path d="M52 54 l10 6 l-10 6 z" />
        <path d="M96 100 V80 M108 100 V66 M120 100 V72" strokeWidth="5" />
      </>
    ),
    accent: <path d="M132 100 V48" strokeWidth="5" />,
  },
  teaching: {
    label: 'A board on an easel with code on it',
    body: (
      <>
        <rect height="44" rx="2" width="76" x="42" y="26" />
        <path d="M56 70 L48 100 M104 70 L112 100 M80 70 V100" />
        <path d="M52 40 h24 M52 50 h34 M52 60 h18" />
      </>
    ),
    accent: <path d="M98 38 l-6 7 l6 7 M104 38 l6 7 l-6 7" />,
  },
  geoscience: {
    label: 'Two tectonic plates under a seismograph trace',
    body: (
      <>
        <path d="M24 72 L80 76 L136 68" />
        <path d="M24 72 V100 M136 68 V100 M80 76 L84 100" />
        <path d="M40 86 l8 -3 M104 84 l8 -3" />
      </>
    ),
    accent: <path d="M24 40 h30 l4 -10 l5 22 l5 -30 l5 26 l4 -8 h59" />,
  },
}

export function RoleSketch({ id }: { id: string }) {
  const sketch = sketches[id]
  if (!sketch) return null
  return (
    <svg
      aria-hidden="true"
      className="jc-sketch"
      data-sketch={id}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
      viewBox="0 0 160 110"
    >
      <path className="jc-sketch__ground" d="M12 100 H148" />
      <g className="jc-sketch__body">{sketch.body}</g>
      <g className="jc-sketch__accent">{sketch.accent}</g>
    </svg>
  )
}
