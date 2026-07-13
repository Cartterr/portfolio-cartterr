import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import {
  requestGraphicsFallback,
  type GraphicsCapability,
} from '../hooks/useGraphicsCapability'
import { SpectralField } from './SpectralField'
import { TerrainLens } from './TerrainLens'

type VisualHeroSceneProps = {
  capability: Exclude<GraphicsCapability, 'poster'>
}

type SceneErrorBoundaryProps = {
  children: ReactNode
}

type SceneErrorBoundaryState = {
  failed: boolean
}

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state = { failed: false }

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    requestGraphicsFallback('poster')
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function DemandTicker({ active, fps }: { active: boolean; fps: number }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    if (!active) return
    let frame = 0
    let lastRender = 0
    const frameInterval = 1000 / fps

    const tick = (time: number) => {
      if (time - lastRender >= frameInterval) {
        lastRender = time
        invalidate()
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [active, fps, invalidate])

  return null
}

function RuntimeGovernor({ capability }: VisualHeroSceneProps) {
  const sampleRef = useRef({ count: 0, elapsed: 0, slowWindows: 0 })

  useFrame((_state, delta) => {
    if (delta > 0.25) return
    const sample = sampleRef.current
    sample.count += 1
    sample.elapsed += delta
    if (sample.count < 72) return

    const averageDelta = sample.elapsed / sample.count
    const threshold = capability === 'full' ? 0.034 : 0.055
    sample.slowWindows = averageDelta > threshold ? sample.slowWindows + 1 : 0
    sample.count = 0
    sample.elapsed = 0

    if (sample.slowWindows >= 2) {
      requestGraphicsFallback(capability === 'full' ? 'low' : 'poster')
      sample.slowWindows = 0
    }
  })

  return null
}

function SceneContents({ active, capability, interactive }: VisualHeroSceneProps & {
  active: boolean
  interactive: boolean
}) {
  const fps = capability === 'full' ? (interactive ? 45 : 28) : interactive ? 26 : 18

  return (
    <>
      <color args={['#0b090d']} attach="background" />
      <fog args={['#0b090d', 5.8, 12]} attach="fog" />
      <ambientLight intensity={0.7} />
      <directionalLight color="#9ff5f3" intensity={2.3} position={[2.8, 4.2, 4]} />
      <pointLight color="#9f7cff" intensity={14} position={[-3, 0.8, 2.2]} />
      <TerrainLens quality={capability} />
      <SpectralField quality={capability} />
      <DemandTicker active={active} fps={fps} />
      <RuntimeGovernor capability={capability} />
    </>
  )
}

export default function VisualHeroScene({ capability }: VisualHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(true)
  const [documentVisible, setDocumentVisible] = useState(() =>
    typeof document === 'undefined' ? false : document.visibilityState !== 'hidden',
  )
  const [interactive, setInteractive] = useState(false)
  const active = nearViewport && documentVisible

  useEffect(() => {
    const element = containerRef.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: '80px 0px', threshold: 0.02 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => setDocumentVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    requestGraphicsFallback('poster')
  }, [])

  return (
    <div
      aria-hidden="true"
      className="visual-hero-scene"
      data-dpr-max="1.5"
      data-quality={capability}
      data-rendering={active ? 'active' : 'paused'}
      data-testid="visual-hero-scene"
      onPointerEnter={() => setInteractive(true)}
      onPointerLeave={() => setInteractive(false)}
      ref={containerRef}
    >
      <SceneErrorBoundary>
        <Canvas
          camera={{ fov: 42, position: [0, 1.3, 7.6] }}
          dpr={capability === 'full' ? [1, 1.5] : 1}
          fallback={null}
          frameloop="demand"
          gl={{
            alpha: true,
            antialias: capability === 'full',
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', handleContextLost, { once: true })
          }}
        >
          <SceneContents active={active} capability={capability} interactive={interactive} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  )
}
