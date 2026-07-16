import { MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  Color,
  Float32BufferAttribute,
  PlaneGeometry,
  type Group,
  type Mesh,
} from 'three'

type TerrainLensProps = {
  quality: 'low' | 'full'
  scrollProgress: number
}

function buildTerrainGeometry(quality: TerrainLensProps['quality']) {
  const columns = quality === 'full' ? 28 : 18
  const rows = quality === 'full' ? 18 : 12
  const geometry = new PlaneGeometry(7.2, 4.8, columns, rows)
  const positions = geometry.attributes.position
  const colors: number[] = []
  const low = new Color('#15272a')
  const middle = new Color('#4d5b67')
  const high = new Color('#7ee8ee')

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const y = positions.getY(index)
    const ridge = Math.sin(x * 1.15) * 0.22 + Math.cos(y * 1.7) * 0.16
    const basin = Math.sin((x + y) * 2.35) * 0.075
    const edge = Math.cos(x * 0.48 - y * 0.3) * 0.12
    const height = ridge + basin + edge
    positions.setZ(index, height)

    const normalized = Math.max(0, Math.min(1, (height + 0.48) / 0.96))
    const color = new Color()
    if (normalized < 0.6) {
      color.lerpColors(low, middle, normalized / 0.6)
    } else {
      color.lerpColors(middle, high, (normalized - 0.6) / 0.4)
    }
    colors.push(color.r, color.g, color.b)
  }

  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}

export function TerrainLens({ quality, scrollProgress }: TerrainLensProps) {
  const groupRef = useRef<Group>(null)
  const lensRef = useRef<Mesh>(null)
  const geometry = useMemo(() => buildTerrainGeometry(quality), [quality])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame(({ clock, pointer }, delta) => {
    const entrance = Math.min(1, clock.getElapsedTime() / 1.4)
    if (groupRef.current) {
      const target = pointer.x * 0.045 + scrollProgress * 0.08 - (1 - entrance) * 0.06
      groupRef.current.rotation.y += (target - groupRef.current.rotation.y) * Math.min(1, delta * 2)
    }
    if (lensRef.current) {
      const targetX = 0.22 + scrollProgress * 0.16 - pointer.y * 0.035
      const targetY = 0.36 + scrollProgress * 0.22 + pointer.x * 0.04
      lensRef.current.rotation.x +=
        (targetX - lensRef.current.rotation.x) * Math.min(1, delta * 2.2)
      lensRef.current.rotation.y +=
        (targetY - lensRef.current.rotation.y) * Math.min(1, delta * 2.2)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        geometry={geometry}
        position={[-0.15, -0.82, -0.35]}
        rotation={[-0.9, 0, -0.08]}
      >
        <meshStandardMaterial metalness={0.18} roughness={0.72} vertexColors />
      </mesh>
      <mesh
        geometry={geometry}
        position={[-0.15, -0.78, -0.32]}
        rotation={[-0.9, 0, -0.08]}
      >
        <meshBasicMaterial color="#74e7f2" opacity={0.14} transparent wireframe />
      </mesh>

      <mesh position={[0.72, 0.18, 0.42]} ref={lensRef} rotation={[0.22, 0.36, -0.14]}>
        <dodecahedronGeometry args={[1.02, 0]} />
        <MeshTransmissionMaterial
          backside
          chromaticAberration={quality === 'full' ? 0.035 : 0.018}
          color="#b9f6ff"
          ior={1.18}
          resolution={quality === 'full' ? 128 : 64}
          roughness={0.13}
          samples={quality === 'full' ? 4 : 2}
          thickness={0.72}
          transmission={0.96}
        />
      </mesh>
    </group>
  )
}
