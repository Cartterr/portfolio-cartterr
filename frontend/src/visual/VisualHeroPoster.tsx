import terrainPoster from '../assets/images/optimized/geoscience7-main.webp'

type VisualHeroPosterProps = {
  capability: 'poster' | 'low' | 'full'
}

export function VisualHeroPoster({ capability }: VisualHeroPosterProps) {
  return (
    <figure
      className="visual-hero-poster"
      data-capability={capability}
      data-testid="visual-hero-poster"
    >
      <img
        alt="Close view of the Marga-Marga terrain model meeting a translucent tectonic section"
        decoding="sync"
        fetchPriority="high"
        height="898"
        src={terrainPoster}
        width="1600"
      />
      <figcaption>
        <span>Marga-Marga terrain model</span>
        <span>Scientific visualization · real project evidence</span>
      </figcaption>
    </figure>
  )
}
