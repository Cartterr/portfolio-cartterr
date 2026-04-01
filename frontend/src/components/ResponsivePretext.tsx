import {
  layoutWithLines,
  prepareWithSegments,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

type ResponsivePretextProps<T extends ElementType> = {
  as?: T
  text: string
  className?: string
  lineClassName?: string
  style?: CSSProperties
  linePrefix?: ReactNode
}

const resolveCanvasFont = (style: CSSStyleDeclaration) =>
  [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].filter(Boolean).join(' ')

const ResponsivePretext = <T extends ElementType = 'div'>({
  as,
  text,
  className,
  lineClassName,
  style,
  linePrefix,
}: ResponsivePretextProps<T>) => {
  const Component = (as || 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const preparedRef = useRef<{ key: string; value: PreparedTextWithSegments } | null>(null)
  const [lines, setLines] = useState<string[]>([text])
  const [minHeight, setMinHeight] = useState<number>()

  useEffect(() => {
    let cancelled = false
    let frame = 0

    const update = async () => {
      const element = ref.current
      if (!element) return

      if ('fonts' in document) {
        try {
          await document.fonts.ready
        } catch {
          // Ignore font readiness issues and fall back to current metrics.
        }
      }

      if (cancelled || !ref.current) return

      const target = ref.current
      const width = target.clientWidth
      if (width === 0) return

      const computed = window.getComputedStyle(target)
      const font = resolveCanvasFont(computed)
      const fontSize = Number.parseFloat(computed.fontSize) || 16
      const lineHeight = Number.parseFloat(computed.lineHeight) || fontSize * 1.18
      const key = `${text}__${font}`

      const prepared =
        preparedRef.current?.key === key
          ? preparedRef.current.value
          : prepareWithSegments(text, font)

      preparedRef.current = { key, value: prepared }

      const result = layoutWithLines(prepared, width, lineHeight)
      if (cancelled) return

      setLines(result.lines.length > 0 ? result.lines.map((line) => line.text) : [text])
      setMinHeight(result.height)
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        void update()
      })
    }

    const observer = new ResizeObserver(schedule)
    if (ref.current) observer.observe(ref.current)
    schedule()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [text])

  return (
    <Component
      ref={ref}
      className={className}
      style={{ ...style, minHeight }}
      aria-label={text}
    >
      {lines.map((line, index) => (
        <span key={`${index}-${line}`} className={lineClassName || 'block'}>
          {index === 0 ? linePrefix : null}
          {line || '\u00A0'}
        </span>
      ))}
    </Component>
  )
}

export default ResponsivePretext
