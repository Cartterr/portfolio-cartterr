import type { ReactNode } from 'react'

/*
 * A line symbol per capability area, in the same hand as the Experience
 * sketches (RoleSketch): ink lines in `currentColor`, one detail in orange.
 */

const symbols: Record<string, { body: ReactNode; accent: ReactNode }> = {
  // A web view built from components, wired to a stack of services.
  'product-platforms': {
    body: (
      <>
        <rect height="46" rx="4" width="64" x="8" y="14" />
        <path d="M8 23 H72" />
        <path d="M14 18.5 h0.01 M19 18.5 h0.01 M24 18.5 h0.01" strokeWidth="2.2" />
        <path d="M42 32 h22 M42 40 h16 M42 48 h20" />
        <rect height="10" rx="2" width="28" x="86" y="20" />
        <rect height="10" rx="2" width="28" x="86" y="34" />
        <rect height="10" rx="2" width="28" x="86" y="48" />
        <path d="M91 25 h0.01 M91 39 h0.01 M91 53 h0.01" strokeWidth="2.2" />
        <path d="M72 39 H86" strokeDasharray="1.5 3.5" />
      </>
    ),
    accent: <rect height="20" rx="2" width="20" x="15" y="30" />,
  },
  // A small network: inputs, a hidden layer and two outputs.
  'ai-data-research': {
    body: (
      <>
        <path d="M20 22 L60 16 M20 22 L60 40 M20 22 L60 64 M20 40 L60 16 M20 40 L60 40 M20 40 L60 64 M20 58 L60 16 M20 58 L60 40 M20 58 L60 64" />
        <path d="M60 16 L100 30 M60 16 L100 52 M60 40 L100 30 M60 40 L100 52 M60 64 L100 30 M60 64 L100 52" />
        <circle cx="20" cy="22" r="4.5" />
        <circle cx="20" cy="40" r="4.5" />
        <circle cx="20" cy="58" r="4.5" />
        <circle cx="60" cy="16" r="4.5" />
        <circle cx="60" cy="40" r="4.5" />
        <circle cx="60" cy="64" r="4.5" />
      </>
    ),
    accent: (
      <>
        <circle cx="100" cy="30" r="5" />
        <circle cx="100" cy="52" r="5" />
      </>
    ),
  },
  // A GPU die with its pins and a grid of cores.
  'simulation-gpu': {
    body: (
      <>
        <rect height="52" rx="4" width="52" x="34" y="12" />
        <path d="M44 12 V4 M54 12 V4 M66 12 V4 M76 12 V4 M44 64 V72 M54 64 V72 M66 64 V72 M76 64 V72" />
        <path d="M34 22 H26 M34 34 H26 M34 46 H26 M34 56 H26 M86 22 H94 M86 34 H94 M86 46 H94 M86 56 H94" />
      </>
    ),
    accent: (
      <>
        <rect height="28" rx="2" width="28" x="46" y="24" />
        <path d="M55.3 24 V52 M64.6 24 V52 M46 33.3 H74 M46 42.6 H74" />
      </>
    ),
  },
  // Devices and an operator console joined through one hub.
  'production-autonomy': {
    body: (
      <>
        <rect height="22" rx="2.5" width="26" x="8" y="28" />
        <path d="M14 56 h14 M21 50 v6" />
        <circle cx="102" cy="16" r="7" />
        <path d="M102 23 V30" />
        <rect height="14" rx="3" width="22" x="91" y="52" />
        <circle cx="96" cy="70" r="3" />
        <circle cx="108" cy="70" r="3" />
        <path d="M34 39 H52 M67 34 L95 21 M67 45 L91 57" strokeDasharray="1.5 3.5" />
      </>
    ),
    accent: (
      <>
        <circle cx="60" cy="40" r="8" />
        <path d="M60 22 a18 18 0 0 1 14 7 M60 58 a18 18 0 0 1 -14 -7" />
      </>
    ),
  },
}

export function CapabilitySymbol({ id }: { id: string }) {
  const symbol = symbols[id]
  if (!symbol) return null
  return (
    <svg
      aria-hidden="true"
      className="jc-sketch jc-sketch--cap"
      data-symbol={id}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
      viewBox="0 0 120 80"
    >
      <g className="jc-sketch__body">{symbol.body}</g>
      <g className="jc-sketch__accent">{symbol.accent}</g>
    </svg>
  )
}
