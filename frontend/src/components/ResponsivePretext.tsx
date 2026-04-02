import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

type ResponsivePretextProps<T extends ElementType> = {
  as?: T
  text: string
  className?: string
  lineClassName?: string
  style?: CSSProperties
  linePrefix?: ReactNode
}

const ResponsivePretext = <T extends ElementType = 'div'>({
  as,
  text,
  className,
  style,
  linePrefix,
}: ResponsivePretextProps<T>) => {
  const Component = (as || 'div') as ElementType

  return (
    <Component
      className={className}
      style={style}
    >
      {linePrefix}
      {text}
    </Component>
  )
}

export default ResponsivePretext
