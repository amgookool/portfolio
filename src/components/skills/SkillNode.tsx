import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import PulseRing from '#/components/skills/PulseRing'
import type { SimNode } from '#/components/skills/SkillsGraph'

type Props = {
  node: SimNode
  color: [number, number, number]
  isHovered: boolean
  onHover: (id: string | null) => void
  onDragStart: () => void
  onDragEnd: () => void
  isVisible: React.RefObject<boolean>
}

type RingInstance = { id: number; delay: number }

function GlbModel({
  glbPath,
  color,
  isHovered,
  isVisible,
}: {
  glbPath: string
  color: [number, number, number]
  isHovered: boolean
  isVisible: React.RefObject<boolean>
}) {
  const { scene } = useGLTF(glbPath)
  const groupRef = useRef<THREE.Group>(null)
  const rotSpeed = useRef(0.4)

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) c.scale.setScalar(1.8 / maxDim)
    return c
  }, [scene])

  useEffect(() => {
    const emissiveIntensity = isHovered ? 0.8 : 0.15
    cloned.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.emissive.setRGB(...color)
        child.material.emissiveIntensity = emissiveIntensity
        child.material.needsUpdate = true
      }
    })
    rotSpeed.current = isHovered ? 1.8 : 0.4
  }, [isHovered, color, cloned])

  useFrame((_, delta) => {
    if (!isVisible.current || !groupRef.current) return
    groupRef.current.rotation.y += delta * rotSpeed.current
    rotSpeed.current += ((isHovered ? 1.8 : 0.4) - rotSpeed.current) * 0.05
  })

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  )
}

function PlaceholderSphere({
  shortName,
  color,
  isHovered,
  isVisible,
}: {
  shortName: string
  color: [number, number, number]
  isHovered: boolean
  isVisible: React.RefObject<boolean>
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)
  const rotSpeed = useRef(0.4)
  const threeColor = useMemo(() => new THREE.Color(...color), [color])
  const [r, g, b] = color.map(c => Math.round(c * 255))

  useFrame((_, delta) => {
    if (!isVisible.current || !groupRef.current) return
    groupRef.current.rotation.y += delta * rotSpeed.current
    rotSpeed.current += ((isHovered ? 1.8 : 0.4) - rotSpeed.current) * 0.05
    if (matRef.current) {
      matRef.current.emissiveIntensity +=
        ((isHovered ? 0.8 : 0.15) - matRef.current.emissiveIntensity) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={0.15}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <Html center position={[0, 0, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily: "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace",
            fontSize: '9px',
            fontWeight: 700,
            color: `rgb(${r},${g},${b})`,
            textShadow: '0 0 4px rgba(0,0,0,0.8)',
          }}
        >
          {shortName}
        </div>
      </Html>
    </group>
  )
}

export default function SkillNode({
  node,
  color,
  isHovered,
  onHover,
  onDragStart,
  onDragEnd,
  isVisible,
}: Props) {
  const [rings, setRings] = useState<RingInstance[]>([])
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const intersection = useRef(new THREE.Vector3())
  const raycaster = useRef(new THREE.Raycaster())

  const handlePointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      onHover(node.id)
      setRings([
        { id: Date.now(), delay: 0 },
        { id: Date.now() + 1, delay: 120 },
        { id: Date.now() + 2, delay: 240 },
      ])
    },
    [node.id, onHover],
  )

  const handlePointerOut = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      onHover(null)
    },
    [onHover],
  )

  const removeRing = useCallback((id: number) => {
    setRings(prev => prev.filter(r => r.id !== id))
  }, [])

  const handlePointerDown = useCallback(
    (e: { stopPropagation: () => void; nativeEvent: PointerEvent }) => {
      e.stopPropagation()
      node.fx = node.x
      node.fy = node.y
      onDragStart()
      isDragging.current = true
      dragPlane.current.constant = -node.z

      const rect = gl.domElement.getBoundingClientRect()

      const handleMove = (ev: PointerEvent) => {
        if (!isDragging.current) return
        const ndcX = ((ev.clientX - rect.left) / rect.width) * 2 - 1
        const ndcY = -((ev.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.current.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)
        if (raycaster.current.ray.intersectPlane(dragPlane.current, intersection.current)) {
          node.fx = intersection.current.x
          node.fy = intersection.current.y
        }
      }

      const handleUp = () => {
        isDragging.current = false
        node.fx = undefined
        node.fy = undefined
        onDragEnd()
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [node, camera, gl, onDragStart, onDragEnd],
  )

  return (
    <group position={[node.x ?? 0, node.y ?? 0, node.z]}>
      {/* Invisible hit area — ensures pointer events fire even for small/irregular GLB shapes */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      {node.glbPath ? (
        <GlbModel
          glbPath={node.glbPath}
          color={color}
          isHovered={isHovered}
          isVisible={isVisible}
        />
      ) : (
        <PlaceholderSphere
          shortName={node.shortName}
          color={color}
          isHovered={isHovered}
          isVisible={isVisible}
        />
      )}

      {rings.map(ring => (
        <PulseRing
          key={ring.id}
          color={color}
          delay={ring.delay}
          duration={800}
          startRadius={1.2}
          onDone={() => removeRing(ring.id)}
        />
      ))}
    </group>
  )
}
