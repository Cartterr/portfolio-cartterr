import type { PortfolioMedia } from '../../data/types'

type MediaFrameProps = {
  media: PortfolioMedia
  sourceEnabled: boolean
  active: boolean
  priority?: boolean
  className?: string
}

export function MediaFrame({
  media,
  sourceEnabled,
  active,
  priority = false,
  className,
}: MediaFrameProps) {
  const style = {
    objectFit: media.fit,
    objectPosition: media.objectPosition,
  }

  if (media.kind === 'video') {
    return (
      <video
        aria-label={media.alt}
        className={className}
        controls={active}
        height={media.height}
        poster={media.thumbnail}
        preload={sourceEnabled && active ? 'metadata' : 'none'}
        src={sourceEnabled ? media.src : undefined}
        style={style}
        width={media.width}
      />
    )
  }

  return (
    <picture className={className}>
      {media.sources?.map((source) => (
        <source
          key={source.type}
          srcSet={sourceEnabled ? source.srcSet : undefined}
          type={source.type}
        />
      ))}
      <img
        alt={media.alt}
        data-placeholder={sourceEnabled ? undefined : 'true'}
        decoding="async"
        fetchPriority={priority && active ? 'high' : 'auto'}
        height={media.height}
        loading={priority && active ? 'eager' : 'lazy'}
        src={sourceEnabled ? media.src : media.thumbnail}
        style={
          sourceEnabled ? style : { ...style, filter: 'blur(14px)', transform: 'scale(1.04)' }
        }
        width={media.width}
      />
    </picture>
  )
}
