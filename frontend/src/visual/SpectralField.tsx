import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, type Points } from 'three'

type SpectralFieldProps = {
  quality: 'low' | 'full'
}

function buildSpectralPoints(count: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  let seed = 0x9e3779b9

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3
    const angle = random() * Math.PI * 2
    const radius = 1.55 + random() * 3.35
    const lift = (random() - 0.5) * 3.3
    positions[stride] = Math.cos(angle) * radius
    positions[stride + 1] = lift + Math.sin(angle * 2.1) * 0.28
    positions[stride + 2] = Math.sin(angle) * radius * 0.42 - random() * 0.9

    const color = new Color().lerpColors(
      new Color('#78edf4'),
      new Color('#ae8cff'),
      random(),
    )
    colors[stride] = color.r
    colors[stride + 1] = color.g
    colors[stride + 2] = color.b
  }

  return { colors, positions }
}

export function SpectralField({ quality }: SpectralFieldProps) {
  const pointsRef = useRef<Points>(null)
  const pointData = useMemo(
    () => buildSpectralPoints(quality === 'full' ? 160 : 72),
    [quality],
  )

  useFrame(({ pointer }, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.z += delta * 0.012
    pointsRef.current.rotation.x +=
      (pointer.y * 0.025 - pointsRef.current.rotation.x) * Math.min(1, delta * 1.5)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pointData.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[pointData.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        blending={2}
        depthWrite={false}
        opacity={0.76}
        size={quality === 'full' ? 0.045 : 0.052}
        sizeAttenuation
        transparent
        vertexColors
      />
    </points>
  )
}
