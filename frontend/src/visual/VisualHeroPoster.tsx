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
        alt="Rendered coastal terrain and modeled plate geometry from the Marga-Marga geoscience project"
        decoding="sync"
        fetchPriority="high"
        height="898"
        src={terrainPoster}
        width="1600"
      />
      <figcaption>
        <span>Marga-Marga geoscience study</span>
        <span>Authentic project render</span>
      </figcaption>
    </figure>
  )
}
