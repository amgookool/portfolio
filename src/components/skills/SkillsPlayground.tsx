import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion } from 'framer-motion'
import { Waves } from 'lucide-react'
import { SKILLS, SKILL_CATEGORIES, CATEGORY_LABELS } from '#/data/skills'
import type { Skill, SkillCategory } from '#/data/skills'

// ── tuning ────────────────────────────────────────────────────────────────────

const DAMPING = 1.6 // velocity decay per second
const CENTER_PULL = 1.1 // weak spring keeping the flotilla together
const FOCUS_PULL = 5.5 // spring toward center for the filtered category
const EXILE_PUSH = 4.0 // push toward the edges for filtered-out buoys
const BOB_FORCE = 0.55 // buoy bobbing amplitude (force, not position)
const WAKE_RADIUS = 2.2 // cursor wake reach, in multiples of buoy radius
const WAKE_PUSH = 14 // cursor wake strength
const RESTITUTION = 0.72 // wall + collision bounciness
const STIR_SPEED = 9 // tangential velocity from a stir
const MAX_DT = 1 / 30

const CATEGORY_ACCENT: Record<SkillCategory, string> = {
  languages: 'var(--lagoon)',
  frameworks: 'var(--lagoon2)',
  infrastructure: 'var(--amber)',
}

const PLAYABLE = SKILLS.filter(
  (s): s is Skill & { glbPath: string } => s.glbPath !== null,
)

// ── physics state (lives in refs, never re-renders React) ─────────────────────

type Body = {
  skill: Skill
  pos: THREE.Vector3
  vel: THREE.Vector3
  phase: number // per-buoy bob offset
  spin: number // idle rotation speed (rad/s)
  scale: number // current, lerped toward target each frame
  group: THREE.Group | null
}

type Shared = {
  bodies: Body[]
  radius: number
  filter: SkillCategory | null
  hoveredId: string | null
  dragId: string | null
  dragTarget: THREE.Vector3
  dragVel: THREE.Vector3
  pointer: THREE.Vector3 | null // cursor in world space (wake effect)
  stirQueued: boolean
}

function makeBodies(): Body[] {
  return PLAYABLE.map((skill, i) => {
    // Spawn scattered on a wide ring so the flotilla drifts in on mount.
    const angle = (i / PLAYABLE.length) * Math.PI * 2 + Math.random() * 0.5
    const dist = 4 + Math.random() * 3
    const pos = new THREE.Vector3(
      Math.cos(angle) * dist,
      Math.sin(angle) * dist,
      0,
    )
    return {
      skill,
      pos,
      // Drift inward on mount so the flotilla gathers quickly.
      vel: pos.clone().multiplyScalar(-0.6),
      phase: Math.random() * Math.PI * 2,
      spin: 0.25 + Math.random() * 0.35,
      scale: 0,
      group: null,
    }
  })
}

// ── buoy: one floating logo ───────────────────────────────────────────────────

function BuoyModel({ url, scale = 1 }: { url: string; scale?: number }) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => scene.clone(true), [scene])

  // Normalize wildly-different GLB sizes to a ~1 unit cube, then apply the
  // optional per-skill multiplier for aspect-ratio outliers.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const max = Math.max(size.x, size.y, size.z) || 1
    return (1 / max) * scale
  }, [model, scale])

  return (
    <Center scale={fit}>
      <primitive object={model} />
    </Center>
  )
}

function Buoy({
  body,
  shared,
  onHover,
}: {
  body: Body
  shared: Shared
  onHover: (skill: Skill | null) => void
}) {
  return (
    <group
      ref={(g) => {
        body.group = g
        g?.scale.setScalar(0.001)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        shared.hoveredId = body.skill.id
        onHover(body.skill)
        document.body.style.cursor = 'grab'
      }}
      onPointerOut={() => {
        if (shared.hoveredId === body.skill.id) shared.hoveredId = null
        onHover(null)
        if (!shared.dragId) document.body.style.cursor = ''
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        shared.dragId = body.skill.id
        shared.dragTarget.copy(body.pos)
        shared.dragVel.set(0, 0, 0)
        document.body.style.cursor = 'grabbing'
      }}
    >
      <Suspense fallback={null}>
        <BuoyModel
          url={body.skill.glbPath!}
          scale={body.skill.scale?.playground}
        />
      </Suspense>
    </group>
  )
}

// ── the lagoon: physics coordinator + pointer plumbing ────────────────────────

function Lagoon({
  shared,
  onHover,
}: {
  shared: Shared
  onHover: (skill: Skill | null) => void
}) {
  const { gl, camera, size } = useThree()

  // Convert a client-space pointer position to the z=0 world plane.
  const toWorld = useCallback(
    (clientX: number, clientY: number, out: THREE.Vector3) => {
      const rect = gl.domElement.getBoundingClientRect()
      out.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
        0.5,
      )
      out.unproject(camera)
      out.sub(camera.position).normalize()
      const t = -camera.position.z / out.z
      out.multiplyScalar(t).add(camera.position)
      out.z = 0
    },
    [gl, camera],
  )

  // Track the cursor for the wake effect, and drive drags at window level so a
  // fast fling can't escape the buoy's hitbox mid-gesture.
  useEffect(() => {
    const el = gl.domElement
    const pointerVec = new THREE.Vector3()
    const prev = new THREE.Vector3()

    const onMove = (e: PointerEvent) => {
      toWorld(e.clientX, e.clientY, pointerVec)
      if (shared.dragId) {
        prev.copy(shared.dragTarget)
        shared.dragTarget.copy(pointerVec)
        // Exponential moving average of drag velocity → throw momentum.
        shared.dragVel
          .multiplyScalar(0.6)
          .addScaledVector(pointerVec.clone().sub(prev), 24)
      }
      shared.pointer = shared.pointer ?? new THREE.Vector3()
      shared.pointer.copy(pointerVec)
    }
    const onLeave = () => {
      shared.pointer = null
    }
    const endDrag = () => {
      if (!shared.dragId) return
      const body = shared.bodies.find((b) => b.skill.id === shared.dragId)
      if (body) body.vel.copy(shared.dragVel).clampLength(0, 30)
      shared.dragId = null
      document.body.style.cursor = ''
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }
  }, [gl, shared, toWorld])

  // Scratch vectors reused across frames to avoid GC churn.
  const scratch = useMemo(
    () => ({ n: new THREE.Vector3(), rel: new THREE.Vector3() }),
    [],
  )

  useFrame((state, delta) => {
    const dt = Math.min(delta, MAX_DT)
    const t = state.clock.elapsedTime
    const { bodies } = shared

    // World-space half extents of the visible pool at z=0.
    const dist = camera.position.z
    const halfH =
      Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360) * dist
    const halfW = halfH * (size.width / size.height)

    // Size buoys so the flotilla fills ~a third of the pool, whatever its shape.
    const r = THREE.MathUtils.clamp(
      Math.sqrt((halfW * halfH * 4 * 0.3) / (bodies.length * Math.PI)),
      0.45,
      1.05,
    )
    shared.radius = r

    const boundX = halfW - r
    const boundY = halfH - r

    if (shared.stirQueued) {
      shared.stirQueued = false
      for (const b of bodies) {
        // Tangential kick around the center → the whole pool swirls.
        scratch.n.set(-b.pos.y, b.pos.x, 0).normalize()
        b.vel.addScaledVector(
          scratch.n,
          STIR_SPEED * (0.7 + Math.random() * 0.6),
        )
      }
    }

    for (const b of bodies) {
      const isDragged = shared.dragId === b.skill.id
      const isHovered = shared.hoveredId === b.skill.id
      const filtered = shared.filter !== null
      const inFocus = filtered && b.skill.category === shared.filter

      if (isDragged) {
        // Critically-damped chase of the cursor; velocity comes from dragVel.
        b.pos.lerp(shared.dragTarget, 1 - Math.exp(-18 * dt))
        b.vel.set(0, 0, 0)
      } else {
        // Buoyancy bob + gathering spring.
        b.vel.y += Math.sin(t * 1.4 + b.phase) * BOB_FORCE * dt
        b.vel.x += Math.cos(t * 1.1 + b.phase * 1.7) * BOB_FORCE * 0.6 * dt

        if (inFocus) {
          b.vel.addScaledVector(b.pos, -FOCUS_PULL * dt)
        } else if (filtered) {
          // Park off-category buoys in the pockets along the pool's longer
          // axis so they sit well clear of the focused cluster in the middle.
          const sideways = boundX >= boundY
          const axis = sideways ? b.pos.x : b.pos.y
          const side =
            Math.abs(axis) > 0.2 ? Math.sign(axis) : b.phase > Math.PI ? 1 : -1
          const edge = (sideways ? boundX : boundY) * 0.82 * side
          if (sideways) {
            b.vel.x += (edge - b.pos.x) * EXILE_PUSH * dt
          } else {
            b.vel.y += (edge - b.pos.y) * EXILE_PUSH * dt
          }
        } else {
          b.vel.addScaledVector(b.pos, -CENTER_PULL * dt)
        }

        // Cursor wake: wading through the water pushes buoys aside.
        if (shared.pointer && !shared.dragId) {
          scratch.rel.subVectors(b.pos, shared.pointer)
          const d = scratch.rel.length()
          const reach = r * WAKE_RADIUS
          if (d < reach && d > 0.0001) {
            b.vel.addScaledVector(
              scratch.rel.normalize(),
              ((reach - d) / reach) * WAKE_PUSH * dt,
            )
          }
        }

        b.vel.multiplyScalar(Math.exp(-DAMPING * dt))
        b.pos.addScaledVector(b.vel, dt)
      }

      // Walls.
      if (b.pos.x > boundX) {
        b.pos.x = boundX
        b.vel.x = -Math.abs(b.vel.x) * RESTITUTION
      }
      if (b.pos.x < -boundX) {
        b.pos.x = -boundX
        b.vel.x = Math.abs(b.vel.x) * RESTITUTION
      }
      if (b.pos.y > boundY) {
        b.pos.y = boundY
        b.vel.y = -Math.abs(b.vel.y) * RESTITUTION
      }
      if (b.pos.y < -boundY) {
        b.pos.y = -boundY
        b.vel.y = Math.abs(b.vel.y) * RESTITUTION
      }

      // Scale target: focused buoys swell, exiled ones shrink, hover perks up.
      let target = filtered ? (inFocus ? 1.18 : 0.48) : 1
      if (isHovered || isDragged) target *= 1.22
      b.scale = THREE.MathUtils.lerp(b.scale, target, 1 - Math.exp(-8 * dt))
    }

    // Pairwise collisions: positional separation + a soft velocity exchange.
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i]
        const b = bodies[j]
        scratch.n.subVectors(b.pos, a.pos)
        const minDist = r * (a.scale + b.scale) * 0.94
        const d = scratch.n.length()
        if (d >= minDist || d === 0) continue
        scratch.n.divideScalar(d)
        const overlap = minDist - d
        a.pos.addScaledVector(scratch.n, -overlap / 2)
        b.pos.addScaledVector(scratch.n, overlap / 2)
        const relVel = scratch.rel.subVectors(b.vel, a.vel).dot(scratch.n)
        if (relVel < 0) {
          const impulse = (-relVel * (1 + RESTITUTION)) / 2
          a.vel.addScaledVector(scratch.n, -impulse)
          b.vel.addScaledVector(scratch.n, impulse)
        }
      }
    }

    // Push state into the scene graph.
    for (const b of bodies) {
      const g = b.group
      if (!g) continue
      g.position.copy(b.pos)
      g.scale.setScalar(Math.max(b.scale * r * 1.9, 0.001))
      const boosted =
        shared.hoveredId === b.skill.id || shared.dragId === b.skill.id
      g.rotation.y += (boosted ? 2.2 : b.spin) * dt
      // Lean into horizontal motion like a buoy riding a wave.
      g.rotation.z = THREE.MathUtils.lerp(
        g.rotation.z,
        THREE.MathUtils.clamp(-b.vel.x * 0.05, -0.35, 0.35),
        1 - Math.exp(-6 * dt),
      )
    }
  })

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 8]} intensity={1.3} />
      <directionalLight position={[-6, -4, -2]} intensity={0.45} />
      {shared.bodies.map((body) => (
        <Buoy
          key={body.skill.id}
          body={body}
          shared={shared}
          onHover={onHover}
        />
      ))}
    </>
  )
}

// ── chrome: category currents + stir ──────────────────────────────────────────

function CurrentChip({
  label,
  accent,
  active,
  onClick,
}: {
  label: string
  accent: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      aria-pressed={active}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide transition-colors duration-150"
      style={{
        borderColor: active ? accent : 'var(--line)',
        color: active ? accent : 'var(--sea-ink-soft)',
        background: active
          ? `color-mix(in oklch, ${accent} 12%, transparent)`
          : 'var(--surface)',
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: accent, opacity: active ? 1 : 0.5 }}
      />
      {label}
    </motion.button>
  )
}

// ── playground shell ──────────────────────────────────────────────────────────

// Client + WebGL + motion-ok check, shared with the showcase so it can hide
// the playground view entirely where it can't render.
export function usePlaygroundSupported() {
  const [supported, setSupported] = useState(false)
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try {
      const probe = document.createElement('canvas')
      if (!probe.getContext('webgl2') && !probe.getContext('webgl')) return
    } catch {
      return
    }
    setSupported(true)
  }, [])
  return supported
}

// `paused` halts the render/physics loop while the playground is hidden behind
// the list view, without tearing down the WebGL context or uploaded assets.
export default function SkillsPlayground({
  paused = false,
}: {
  paused?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const supported = usePlaygroundSupported()
  const [ready, setReady] = useState(false) // supported + near viewport
  const [hovered, setHovered] = useState<Skill | null>(null)
  const [filter, setFilter] = useState<SkillCategory | null>(null)

  const shared = useMemo<Shared>(
    () => ({
      bodies: makeBodies(),
      radius: 0.8,
      filter: null,
      hoveredId: null,
      dragId: null,
      dragTarget: new THREE.Vector3(),
      dragVel: new THREE.Vector3(),
      pointer: null,
      stirQueued: false,
    }),
    [],
  )
  shared.filter = filter

  // Mount the canvas only once the panel approaches the viewport.
  useEffect(() => {
    if (!supported) return
    const el = panelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setReady(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '240px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [supported])

  return (
    <div ref={panelRef} className="mb-4">
      {ready && (
        <>
          {/* currents + stir */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <CurrentChip
              label="Everyone in the water"
              accent="var(--sea-ink-soft)"
              active={filter === null}
              onClick={() => setFilter(null)}
            />
            {SKILL_CATEGORIES.map((cat) => (
              <CurrentChip
                key={cat}
                label={CATEGORY_LABELS[cat]}
                accent={CATEGORY_ACCENT[cat]}
                active={filter === cat}
                onClick={() => setFilter((f) => (f === cat ? null : cat))}
              />
            ))}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9, rotate: -12 }}
              onClick={() => {
                shared.stirQueued = true
              }}
              className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-full border border-(--line) bg-(--surface) px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-(--sea-ink) transition-colors duration-150 hover:border-(--lagoon) hover:text-(--lagoon)"
            >
              <Waves className="size-3.5" aria-hidden />
              Stir the lagoon
            </motion.button>
          </div>

          {/* the pool */}
          <div
            className="island-shell relative h-104 overflow-hidden rounded-3xl sm:h-120"
            style={{
              background: `
                radial-gradient(120% 90% at 20% 0%, color-mix(in oklch, var(--lagoon) 10%, transparent), transparent 55%),
                radial-gradient(110% 100% at 85% 100%, color-mix(in oklch, var(--lagoon2) 9%, transparent), transparent 60%),
                var(--surface2)`,
            }}
          >
            <Canvas
              frameloop={paused ? 'never' : 'always'}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              camera={{ position: [0, 0, 14], fov: 38 }}
              style={{ touchAction: 'pan-y' }}
              aria-label="Interactive pool of floating 3D skill logos — drag to toss them"
              role="img"
            >
              <Lagoon shared={shared} onHover={setHovered} />
            </Canvas>

            {/* status bar */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={hovered?.id ?? 'hint'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  className={
                    hovered
                      ? 'display-title text-lg font-bold text-(--sea-ink)'
                      : 'font-mono text-[11px] tracking-wide text-(--sea-ink-soft) opacity-80'
                  }
                >
                  {hovered
                    ? hovered.name
                    : 'grab a buoy · toss it · stir the water'}
                </motion.span>
              </AnimatePresence>
              {hovered && (
                <span
                  className="font-mono text-[11px] tracking-wide"
                  style={{ color: CATEGORY_ACCENT[hovered.category] }}
                >
                  {CATEGORY_LABELS[hovered.category]}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
