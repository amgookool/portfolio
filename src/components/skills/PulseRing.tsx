import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  color: [number, number, number]
  delay?: number
  duration?: number
  startRadius?: number
  onDone: () => void
}

export default function PulseRing({
  color,
  delay = 0,
  duration = 800,
  startRadius = 1.0,
  onDone,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const elapsed = useRef(0)
  const active = useRef(delay === 0)
  const done = useRef(false)

  useFrame((_, delta) => {
    if (done.current) return
    elapsed.current += delta * 1000

    if (!active.current) {
      if (elapsed.current >= delay) {
        active.current = true
        elapsed.current = 0
      }
      return
    }

    const t = Math.min(elapsed.current / duration, 1)
    if (meshRef.current) {
      const s = 1 + t * (3.5 / startRadius - 1)
      meshRef.current.scale.setScalar(s)
    }
    if (matRef.current) {
      matRef.current.opacity = 0.6 * (1 - t)
    }
    if (t >= 1) {
      done.current = true
      onDone()
    }
  })

  return (
    <mesh ref={meshRef}>
      <ringGeometry args={[startRadius - 0.12, startRadius + 0.12, 48]} />
      <meshBasicMaterial
        ref={matRef}
        color={new THREE.Color(...color)}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
