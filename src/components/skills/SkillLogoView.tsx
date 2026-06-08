import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Center, PerspectiveCamera, View, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const SPIN_SPEED = 1.6 // radians / second while hovered
const HOVER_SCALE = 1.18
const SETTLE = 0.18 // scale lerp factor toward target

// ── model: normalized, spins + grows on hover ────────────────────────────────

function Model({ url, hovered }: { url: string; hovered: boolean }) {
  const { scene } = useGLTF(url)
  const invalidate = useThree((s) => s.invalidate)
  const spinRef = useRef<THREE.Group>(null)

  // Clone so each pill gets its own instance (useGLTF caches the source scene).
  const model = useMemo(() => scene.clone(true), [scene])

  // Normalize wildly-different GLB sizes to ~1 unit so framing is consistent.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const max = Math.max(size.x, size.y, size.z) || 1
    return 1 / max
  }, [model])

  // Render once when the model becomes available (frameloop is "demand").
  useEffect(() => invalidate(), [model, invalidate])

  useFrame((_, delta) => {
    const g = spinRef.current
    if (!g) return

    const target = hovered ? HOVER_SCALE : 1
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, SETTLE))

    if (hovered) {
      g.rotation.y += delta * SPIN_SPEED
      invalidate() // keep the loop alive while hovered
    } else if (Math.abs(g.scale.x - target) > 0.001) {
      invalidate() // keep rendering until the scale has settled back
    }
  })

  return (
    <Center>
      <group scale={fit}>
        <group ref={spinRef}>
          <primitive object={model} />
        </group>
      </group>
    </Center>
  )
}

// ── per-pill view ─────────────────────────────────────────────────────────────
// When View is used outside Canvas, drei creates its own DOM element for
// tracking (the `track` prop is ignored by OuterView). We pass `as="span"` and
// the size classes directly so that tracking element has the right dimensions —
// otherwise drei creates a zero-size div, which causes the framebuffer error.

export default function SkillLogoView({
  glbPath,
  hovered,
}: {
  glbPath: string
  hovered: boolean
}) {
  return (
    <View
      as="span"
      data-testid="skill-logo"
      aria-hidden
      className="inline-block size-5 shrink-0"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 2.6]} fov={40} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[2, 3, 4]} intensity={1.3} />
      <directionalLight position={[-3, -2, -1]} intensity={0.45} />
      <Suspense fallback={null}>
        <Model url={glbPath} hovered={hovered} />
      </Suspense>
    </View>
  )
}
