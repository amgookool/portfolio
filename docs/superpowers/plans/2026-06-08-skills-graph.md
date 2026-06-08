# Skills Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static skills card grid with an interactive 3D force-directed graph where each skill is a GLB logo node clustered by category, with hover glow rings, floating labels, and full orbit/drag interaction.

**Architecture:** React Three Fiber canvas owns the scene. D3-force (2D) computes x/y positions; z is a per-node random offset within each cluster range, giving depth without requiring a 3D physics library. Each skill is either a loaded GLB model or a placeholder sphere until the asset is ready. All three category colors are resolved from CSS custom properties so dark mode works automatically.

**Tech Stack:** React 19, React Three Fiber v8, @react-three/drei, d3-force, Three.js (already installed), TanStack Start, Tailwind v4, Vitest

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/utils/theme.ts` | **Create** | `resolveCssColor()` — extracted from HeroCanvas |
| `src/data/skills.ts` | **Create** | SKILLS array, SkillCategory type, helpers |
| `src/components/skills/PulseRing.tsx` | **Create** | Self-animating expanding ring, unmounts when done |
| `src/components/skills/SkillLabel.tsx` | **Create** | R3F Html chip floating above hovered node |
| `src/components/skills/EdgeLines.tsx` | **Create** | BufferGeometry LineSegments from skills → anchors |
| `src/components/skills/CategoryAnchor.tsx` | **Create** | Anchor sphere + label + pulse rings on click |
| `src/components/skills/SkillNode.tsx` | **Create** | GLB model or placeholder sphere, hover rings, drag |
| `src/components/skills/SkillsGraph.tsx` | **Create** | Canvas + d3-force simulation + scene root |
| `src/styles.css` | **Modify** | Add `--amber` and `--amber-soft` tokens |
| `src/components/HeroCanvas.tsx` | **Modify** | Import `resolveCssColor` from `utils/theme` |
| `src/sections/SkillsSection.tsx` | **Modify** | Replace card grid with SkillsGraph + hidden a11y list |

---

## Task 1: Install dependencies

**Files:** `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Add runtime dependencies**

```bash
cd /Users/adrian/Development/amgookool/portfolio
pnpm add @react-three/fiber @react-three/drei d3-force
```

Expected: packages resolve without peer dep errors. Three.js is already installed so no conflict.

- [ ] **Step 2: Add type definitions**

```bash
pnpm add -D @types/d3-force
```

- [ ] **Step 3: Verify build still works**

```bash
pnpm build
```

Expected: build completes — new packages don't break anything since nothing imports them yet.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @react-three/fiber, drei, d3-force"
```

---

## Task 2: Add CSS tokens and extract theme utility

**Files:** `src/styles.css`, `src/utils/theme.ts`, `src/components/HeroCanvas.tsx`

- [ ] **Step 1: Add `--amber` tokens to `src/styles.css`**

In the `:root` block, after the `--lagoon2` line, add:

```css
/* accent3 (amber, for infrastructure category) */
--amber:         oklch(75% 0.16 70);
--amber-soft:    color-mix(in oklch, var(--amber) 10%, transparent);
```

In the `[data-theme="dark"]` block, after `--lagoon2` line, add:

```css
--amber:         oklch(80% 0.15 70);
```

In the `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` block, after `--lagoon2`, add:

```css
--amber:         oklch(80% 0.15 70);
```

- [ ] **Step 2: Create `src/utils/theme.ts`**

```ts
export function resolveCssColor(cssVarName: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVarName)
    .trim()
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = raw
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}
```

- [ ] **Step 3: Write a test for `resolveCssColor`**

Create `src/utils/theme.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('resolveCssColor', () => {
  let origGetComputedStyle: typeof window.getComputedStyle
  let origCreateElement: typeof document.createElement

  beforeEach(() => {
    origGetComputedStyle = window.getComputedStyle
    origCreateElement = document.createElement.bind(document)

    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => ' #0ea5e9 ',
    } as unknown as CSSStyleDeclaration)

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag !== 'canvas') return origCreateElement(tag)
      return {
        width: 0,
        height: 0,
        getContext: () => ({
          fillStyle: '',
          fillRect: vi.fn(),
          getImageData: vi.fn().mockReturnValue({ data: [14, 165, 233, 255] }),
        }),
      } as unknown as HTMLCanvasElement
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a normalized [r, g, b] tuple', async () => {
    const { resolveCssColor } = await import('./theme')
    const result = resolveCssColor('--lagoon')
    expect(result).toHaveLength(3)
    expect(result[0]).toBeCloseTo(14 / 255, 3)
    expect(result[1]).toBeCloseTo(165 / 255, 3)
    expect(result[2]).toBeCloseTo(233 / 255, 3)
  })

  it('each channel is in [0, 1]', async () => {
    const { resolveCssColor } = await import('./theme')
    const [r, g, b] = resolveCssColor('--lagoon')
    expect(r).toBeGreaterThanOrEqual(0)
    expect(r).toBeLessThanOrEqual(1)
    expect(g).toBeGreaterThanOrEqual(0)
    expect(g).toBeLessThanOrEqual(1)
    expect(b).toBeGreaterThanOrEqual(0)
    expect(b).toBeLessThanOrEqual(1)
  })
})
```

- [ ] **Step 4: Run the test**

```bash
pnpm vitest run src/utils/theme.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Update `HeroCanvas.tsx` to import from the shared utility**

Remove lines 10–20 (the inline `resolveCssColor` function definition) from `src/components/HeroCanvas.tsx` and add this import at the top:

```ts
import { resolveCssColor } from '#/utils/theme'
```

- [ ] **Step 6: Verify HeroCanvas still works**

```bash
pnpm build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/styles.css src/utils/theme.ts src/utils/theme.test.ts src/components/HeroCanvas.tsx
git commit -m "feat: add --amber token, extract resolveCssColor to utils/theme"
```

---

## Task 3: Create skills data

**Files:** `src/data/skills.ts`, `src/data/skills.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/skills.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { SKILLS, SKILL_CATEGORIES, CATEGORY_LABELS } from './skills'

describe('SKILLS data', () => {
  it('every skill has all required fields', () => {
    for (const skill of SKILLS) {
      expect(skill.id, `${skill.name} missing id`).toBeTruthy()
      expect(skill.name, `id=${skill.id} missing name`).toBeTruthy()
      expect(skill.shortName, `${skill.name} missing shortName`).toBeTruthy()
      expect(SKILL_CATEGORIES, `${skill.name} invalid category`).toContain(skill.category)
      expect(
        skill.glbPath === null || typeof skill.glbPath === 'string',
        `${skill.name} glbPath must be string or null`
      ).toBe(true)
    }
  })

  it('GLB paths start with /3d/ and end with .glb', () => {
    for (const skill of SKILLS) {
      if (skill.glbPath !== null) {
        expect(skill.glbPath).toMatch(/^\/3d\/.+\.glb$/)
      }
    }
  })

  it('ids are unique', () => {
    const ids = SKILLS.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all three categories are represented', () => {
    for (const cat of SKILL_CATEGORIES) {
      expect(SKILLS.some(s => s.category === cat)).toBe(true)
    }
  })

  it('CATEGORY_LABELS covers all categories', () => {
    for (const cat of SKILL_CATEGORIES) {
      expect(CATEGORY_LABELS[cat]).toBeTruthy()
    }
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
pnpm vitest run src/data/skills.test.ts
```

Expected: FAIL — module `./skills` not found.

- [ ] **Step 3: Create `src/data/skills.ts`**

```ts
export type SkillCategory = 'languages' | 'frameworks' | 'infrastructure'

export type Skill = {
  id: string
  name: string
  shortName: string
  category: SkillCategory
  glbPath: string | null
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  'languages',
  'frameworks',
  'infrastructure',
]

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  infrastructure: 'Infrastructure',
}

export const SKILLS: Skill[] = [
  { id: 'typescript',     name: 'TypeScript',     shortName: 'TS',     category: 'languages',      glbPath: '/3d/typescript-logo.glb' },
  { id: 'javascript',     name: 'JavaScript',     shortName: 'JS',     category: 'languages',      glbPath: null },
  { id: 'java',           name: 'Java',           shortName: 'Java',   category: 'languages',      glbPath: '/3d/java-logo.glb' },
  { id: 'dart',           name: 'Dart',           shortName: 'Dart',   category: 'languages',      glbPath: '/3d/dart-logo.glb' },
  { id: 'python',         name: 'Python',         shortName: 'Py',     category: 'languages',      glbPath: '/3d/python-logo.glb' },
  { id: 'c',              name: 'C',              shortName: 'C',      category: 'languages',      glbPath: '/3d/c-logo.glb' },
  { id: 'cpp',            name: 'C++',            shortName: 'C++',    category: 'languages',      glbPath: '/3d/cpp-logo.glb' },
  { id: 'rust',           name: 'Rust',           shortName: 'Rust',   category: 'languages',      glbPath: '/3d/rust-logo.glb' },
  { id: 'bash',           name: 'Bash',           shortName: 'Bash',   category: 'languages',      glbPath: '/3d/bash-logo.glb' },
  { id: 'nodejs',         name: 'Node.js',        shortName: 'Node',   category: 'frameworks',     glbPath: '/3d/node-logo.glb' },
  { id: 'react',          name: 'React',          shortName: 'React',  category: 'frameworks',     glbPath: '/3d/react-logo.glb' },
  { id: 'angular',        name: 'Angular',        shortName: 'Ng',     category: 'frameworks',     glbPath: '/3d/angular-logo.glb' },
  { id: 'sveltekit',      name: 'SvelteKit',      shortName: 'Svelte', category: 'frameworks',     glbPath: '/3d/svelte-logo.glb' },
  { id: 'flutter',        name: 'Flutter',        shortName: 'Fltr',   category: 'frameworks',     glbPath: '/3d/flutter-logo.glb' },
  { id: 'express',        name: 'Express',        shortName: 'Expr',   category: 'frameworks',     glbPath: null },
  { id: 'springboot',     name: 'Spring Boot',    shortName: 'Spring', category: 'frameworks',     glbPath: null },
  { id: 'jquery',         name: 'jQuery',         shortName: 'jQ',     category: 'frameworks',     glbPath: null },
  { id: 'tailwind',       name: 'Tailwind CSS',   shortName: 'TW',     category: 'frameworks',     glbPath: null },
  { id: 'firebase',       name: 'Firebase',       shortName: 'FB',     category: 'infrastructure', glbPath: '/3d/firebase-logo.glb' },
  { id: 'postgresql',     name: 'PostgreSQL',     shortName: 'PG',     category: 'infrastructure', glbPath: '/3d/postgresql-logo.glb' },
  { id: 'mongodb',        name: 'MongoDB',        shortName: 'Mongo',  category: 'infrastructure', glbPath: '/3d/mongodb-logo.glb' },
  { id: 'docker',         name: 'Docker',         shortName: 'Docker', category: 'infrastructure', glbPath: null },
  { id: 'gcp',            name: 'GCP',            shortName: 'GCP',    category: 'infrastructure', glbPath: null },
  { id: 'aws',            name: 'AWS',            shortName: 'AWS',    category: 'infrastructure', glbPath: null },
  { id: 'github-actions', name: 'GitHub Actions', shortName: 'GHA',    category: 'infrastructure', glbPath: null },
  { id: 'git',            name: 'Git',            shortName: 'Git',    category: 'infrastructure', glbPath: null },
]
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
pnpm vitest run src/data/skills.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/skills.ts src/data/skills.test.ts
git commit -m "feat: add skills data with category types and GLB paths"
```

---

## Task 4: Create PulseRing component

**Files:** `src/components/skills/PulseRing.tsx`

- [ ] **Step 1: Create `src/components/skills/PulseRing.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/skills/PulseRing.tsx
git commit -m "feat: add PulseRing component for hover/click animations"
```

---

## Task 5: Create SkillLabel and EdgeLines components

**Files:** `src/components/skills/SkillLabel.tsx`, `src/components/skills/EdgeLines.tsx`

- [ ] **Step 1: Create `src/components/skills/SkillLabel.tsx`**

```tsx
import { Html } from '@react-three/drei'
import type { SkillCategory } from '#/data/skills'

type Props = {
  position: [number, number, number]
  name: string
  category: SkillCategory
  color: [number, number, number]
}

export default function SkillLabel({ position, name, category, color }: Props) {
  const [r, g, b] = color.map(c => Math.round(c * 255))
  const borderColor = `rgb(${r},${g},${b})`

  return (
    <Html center position={position} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: `1px solid ${borderColor}`,
          borderRadius: '999px',
          padding: '3px 10px',
          whiteSpace: 'nowrap',
          fontFamily: "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: `rgb(${r},${g},${b})`,
          opacity: 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {name}
      </div>
    </Html>
  )
}
```

- [ ] **Step 2: Create `src/components/skills/EdgeLines.tsx`**

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { SimNode } from '#/components/skills/SkillsGraph'

type Props = {
  nodes: SimNode[]
  isVisible: React.RefObject<boolean>
}

export default function EdgeLines({ nodes, isVisible }: Props) {
  const ref = useRef<THREE.LineSegments>(null)

  const skillNodes = useMemo(() => nodes.filter(n => !n.isAnchor), [nodes])
  const count = skillNodes.length

  const [posAttr, colAttr] = useMemo(() => {
    const pos = new THREE.Float32BufferAttribute(new Float32Array(count * 6), 3)
    const col = new THREE.Float32BufferAttribute(new Float32Array(count * 6), 3)
    pos.setUsage(THREE.DynamicDrawUsage)
    col.setUsage(THREE.DynamicDrawUsage)
    return [pos, col]
  }, [count])

  useFrame(() => {
    if (!isVisible.current || !ref.current) return

    const anchors: Record<string, SimNode> = {}
    for (const n of nodes) {
      if (n.isAnchor) anchors[n.category] = n
    }

    for (let i = 0; i < skillNodes.length; i++) {
      const skill = skillNodes[i]
      const anchor = anchors[skill.category]
      if (!anchor) continue
      const [r, g, b] = skill.categoryColor

      posAttr.setXYZ(i * 2,     skill.x,  skill.y,  skill.z)
      posAttr.setXYZ(i * 2 + 1, anchor.x, anchor.y, anchor.z)
      colAttr.setXYZ(i * 2,     r, g, b)
      colAttr.setXYZ(i * 2 + 1, r, g, b)
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    ref.current.geometry.setDrawRange(0, skillNodes.length * 2)
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" {...posAttr} />
        <bufferAttribute attach="attributes-color" {...colAttr} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.3} depthWrite={false} />
    </lineSegments>
  )
}
```

> **Note:** `SimNode` will be exported from `SkillsGraph.tsx` in Task 8. This file will have a TypeScript error until then — that is expected and will be resolved in Task 8.

- [ ] **Step 3: Commit**

```bash
git add src/components/skills/SkillLabel.tsx src/components/skills/EdgeLines.tsx
git commit -m "feat: add SkillLabel and EdgeLines components"
```

---

## Task 6: Create CategoryAnchor component

**Files:** `src/components/skills/CategoryAnchor.tsx`

- [ ] **Step 1: Create `src/components/skills/CategoryAnchor.tsx`**

```tsx
import { useState, useCallback } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import PulseRing from '#/components/skills/PulseRing'
import type { SkillCategory } from '#/data/skills'

type Props = {
  position: [number, number, number]
  category: SkillCategory
  label: string
  color: [number, number, number]
  isVisible: React.RefObject<boolean>
}

type RingInstance = { id: number; delay: number }

export default function CategoryAnchor({
  position,
  category,
  label,
  color,
  isVisible,
}: Props) {
  const [rings, setRings] = useState<RingInstance[]>([])

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    const id = Date.now()
    setRings(prev => [...prev, { id, delay: 0 }, { id: id + 1, delay: 300 }])
  }, [])

  const removeRing = useCallback((id: number) => {
    setRings(prev => prev.filter(r => r.id !== id))
  }, [])

  const [r, g, b] = color.map(c => Math.round(c * 255))
  const threeColor = new THREE.Color(...color)

  return (
    <group position={position}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={0.25}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      <Html center position={[0, 2.4, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily: "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.13em',
            textTransform: 'uppercase' as const,
            color: `rgb(${r},${g},${b})`,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      </Html>

      {rings.map(ring => (
        <PulseRing
          key={ring.id}
          color={color}
          delay={ring.delay}
          duration={1000}
          startRadius={1.8}
          onDone={() => removeRing(ring.id)}
        />
      ))}
    </group>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/skills/CategoryAnchor.tsx
git commit -m "feat: add CategoryAnchor with pulse ring on click"
```

---

## Task 7: Create SkillNode component

**Files:** `src/components/skills/SkillNode.tsx`

- [ ] **Step 1: Create `src/components/skills/SkillNode.tsx`**

```tsx
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
    const target = isHovered ? 1.8 : 0.4
    const emissiveIntensity = isHovered ? 0.8 : 0.15
    cloned.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.emissive.setRGB(...color)
        child.material.emissiveIntensity = emissiveIntensity
        child.material.needsUpdate = true
      }
    })
    rotSpeed.current = target
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
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)
  const rotSpeed = useRef(0.4)
  const threeColor = useMemo(() => new THREE.Color(...color), [color])

  useFrame((_, delta) => {
    if (!isVisible.current || !groupRef.current) return
    groupRef.current.rotation.y += delta * rotSpeed.current
    rotSpeed.current += ((isHovered ? 1.8 : 0.4) - rotSpeed.current) * 0.05
    if (matRef.current) {
      matRef.current.emissiveIntensity +=
        ((isHovered ? 0.8 : 0.15) - matRef.current.emissiveIntensity) * 0.1
    }
  })

  const [r, g, b] = color.map(c => Math.round(c * 255))

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
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
        { id: Date.now(),     delay: 0 },
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
    <group position={[node.x, node.y, node.z]}>
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
```

> **Note:** `node.fx`, `node.fy` are mutated directly on the d3-force node reference — d3-force reads these each simulation tick. This is intentional mutable side-effect access, not a React state update.

- [ ] **Step 2: Commit**

```bash
git add src/components/skills/SkillNode.tsx
git commit -m "feat: add SkillNode with GLB/placeholder rendering, hover rings, drag"
```

---

## Task 8: Create SkillsGraph (Canvas + simulation)

**Files:** `src/components/skills/SkillsGraph.tsx`

- [ ] **Step 1: Create `src/components/skills/SkillsGraph.tsx`**

```tsx
import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force'
import { SKILLS, SKILL_CATEGORIES, CATEGORY_LABELS, type SkillCategory } from '#/data/skills'
import { resolveCssColor } from '#/utils/theme'
import CategoryAnchor from '#/components/skills/CategoryAnchor'
import SkillNode from '#/components/skills/SkillNode'
import EdgeLines from '#/components/skills/EdgeLines'
import SkillLabel from '#/components/skills/SkillLabel'

// Preload all GLB assets at module level
import { useGLTF } from '@react-three/drei'
SKILLS.filter(s => s.glbPath !== null).forEach(s => useGLTF.preload(s.glbPath!))

export type SimNode = SimulationNodeDatum & {
  id: string
  isAnchor: boolean
  category: SkillCategory
  name: string
  shortName: string
  glbPath: string | null
  z: number
  vz: number
  categoryColor: [number, number, number]
}

type SimLink = SimulationLinkDatum<SimNode>

const ANCHOR_STARTS: Record<SkillCategory, [number, number, number]> = {
  languages:      [-9,  6,  0],
  frameworks:     [ 9,  6,  0],
  infrastructure: [ 0, -10, 0],
}

const Z_SPREAD = 2.5

type CategoryColors = Record<SkillCategory, [number, number, number]>

function resolveColors(): CategoryColors {
  return {
    languages:      resolveCssColor('--lagoon'),
    frameworks:     resolveCssColor('--lagoon2'),
    infrastructure: resolveCssColor('--amber'),
  }
}

function Scene({ isVisible }: { isVisible: React.RefObject<boolean> }) {
  const [nodes, setNodes] = useState<SimNode[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const simRef = useRef<ReturnType<typeof forceSimulation> | null>(null)
  const colorsRef = useRef<CategoryColors>(resolveColors())

  // Re-resolve colors on theme toggle
  useEffect(() => {
    const obs = new MutationObserver(() => {
      colorsRef.current = resolveColors()
      // Update categoryColor on each node in-place
      setNodes(prev =>
        prev.map(n => ({
          ...n,
          categoryColor: colorsRef.current[n.category],
        })),
      )
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  // Build nodes and run simulation
  useEffect(() => {
    const colors = colorsRef.current

    const anchorNodes: SimNode[] = SKILL_CATEGORIES.map(cat => ({
      id: `anchor-${cat}`,
      isAnchor: true,
      category: cat,
      name: CATEGORY_LABELS[cat],
      shortName: CATEGORY_LABELS[cat],
      glbPath: null,
      x: ANCHOR_STARTS[cat][0],
      y: ANCHOR_STARTS[cat][1],
      z: ANCHOR_STARTS[cat][2],
      vz: 0,
      categoryColor: colors[cat],
      fx: ANCHOR_STARTS[cat][0],
      fy: ANCHOR_STARTS[cat][1],
    }))

    const skillNodes: SimNode[] = SKILLS.map(skill => ({
      id: skill.id,
      isAnchor: false,
      category: skill.category,
      name: skill.name,
      shortName: skill.shortName,
      glbPath: skill.glbPath,
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 18,
      z: ANCHOR_STARTS[skill.category][2] + (Math.random() - 0.5) * Z_SPREAD,
      vz: 0,
      categoryColor: colors[skill.category],
    }))

    const allNodes = [...anchorNodes, ...skillNodes]

    const links: SimLink[] = skillNodes.map(n => ({
      source: n.id,
      target: `anchor-${n.category}`,
    }))

    const sim = forceSimulation<SimNode>(allNodes)
      .force('charge', forceManyBody<SimNode>().strength(-80))
      .force(
        'link',
        forceLink<SimNode, SimLink>(links)
          .id(d => d.id)
          .distance(5)
          .strength(0.8),
      )
      .force('center', forceCenter<SimNode>(0, 0))
      .force('collide', forceCollide<SimNode>(2.5))

    let tick = 0
    sim.on('tick', () => {
      tick++

      // Release anchors after 200 ticks so the graph floats freely
      if (tick === 200) {
        anchorNodes.forEach(n => {
          n.fx = undefined
          n.fy = undefined
        })
      }

      // Custom z spring toward category anchor z
      for (const n of allNodes) {
        const targetZ = ANCHOR_STARTS[n.category][2] + (n.isAnchor ? 0 : 0)
        n.vz = (n.vz + (targetZ - n.z) * 0.05) * 0.9
        n.z += n.vz
      }

      setNodes([...allNodes])
    })

    simRef.current = sim

    return () => {
      sim.stop()
    }
  }, [])

  const handleDragStart = useCallback(() => {
    simRef.current?.alphaTarget(0.3).restart()
  }, [])

  const handleDragEnd = useCallback(() => {
    simRef.current?.alphaTarget(0).alpha(0.3).restart()
  }, [])

  const anchorNodes = nodes.filter(n => n.isAnchor)
  const skillNodes = nodes.filter(n => !n.isAnchor)
  const hoveredNode = hoveredId ? nodes.find(n => n.id === hoveredId) : null

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[-8, 8, 5]} intensity={1.2} color="#0ea5e9" />
      <pointLight position={[8, -5, -3]} intensity={0.8} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2 - Math.PI * (50 / 180)}
        maxPolarAngle={Math.PI / 2 + Math.PI * (50 / 180)}
        autoRotate
        autoRotateSpeed={0.3}
        makeDefault
      />

      {anchorNodes.map(n => (
        <CategoryAnchor
          key={n.id}
          position={[n.x ?? 0, n.y ?? 0, n.z]}
          category={n.category}
          label={n.name}
          color={colorsRef.current[n.category]}
          isVisible={isVisible}
        />
      ))}

      {skillNodes.map(n => (
        <SkillNode
          key={n.id}
          node={n}
          color={colorsRef.current[n.category]}
          isHovered={hoveredId === n.id}
          onHover={setHoveredId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isVisible={isVisible}
        />
      ))}

      <EdgeLines nodes={nodes} isVisible={isVisible} />

      {hoveredNode && !hoveredNode.isAnchor && (
        <SkillLabel
          position={[hoveredNode.x ?? 0, (hoveredNode.y ?? 0) + 1.8, hoveredNode.z]}
          name={hoveredNode.name}
          category={hoveredNode.category}
          color={colorsRef.current[hoveredNode.category]}
        />
      )}
    </>
  )
}

export default function SkillsGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-[420px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene isVisible={isVisible} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles (this resolves the import error in EdgeLines from Task 5)**

```bash
pnpm build
```

Expected: build succeeds. All `SimNode` import errors from Task 5 resolve.

- [ ] **Step 3: Commit**

```bash
git add src/components/skills/SkillsGraph.tsx src/components/skills/EdgeLines.tsx
git commit -m "feat: add SkillsGraph with d3-force simulation and full scene"
```

---

## Task 9: Update SkillsSection and add accessibility list

**Files:** `src/sections/SkillsSection.tsx`

- [ ] **Step 1: Write the test first**

Create `src/sections/SkillsSection.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkillsSection from './SkillsSection'
import { SKILLS } from '#/data/skills'

vi.mock('#/components/skills/SkillsGraph', () => ({
  default: () => <div data-testid="skills-graph" />,
}))

// Stub Section and SectionHeader to avoid router/SSR context issues
vi.mock('#/components/Section', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('#/components/SectionHeader', () => ({
  default: ({ title }: { title: string }) => <h2>{title}</h2>,
}))

describe('SkillsSection', () => {
  it('renders the SkillsGraph canvas', () => {
    render(<SkillsSection />)
    expect(screen.getByTestId('skills-graph')).toBeTruthy()
  })

  it('renders a hidden accessibility list with all skills', () => {
    render(<SkillsSection />)
    const list = screen.getByRole('list', { hidden: true })
    expect(list).toBeTruthy()
    // Spot-check a few skills by their names
    expect(screen.getByText('TypeScript')).toBeTruthy()
    expect(screen.getByText('Rust')).toBeTruthy()
    expect(screen.getByText('Firebase')).toBeTruthy()
    // All skills present
    expect(screen.getAllByRole('listitem', { hidden: true }).length).toBe(SKILLS.length)
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
pnpm vitest run src/sections/SkillsSection.test.tsx
```

Expected: FAIL — existing SkillsSection doesn't have the graph or hidden list.

- [ ] **Step 3: Replace `src/sections/SkillsSection.tsx`**

```tsx
import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'
import SkillsGraph from '#/components/skills/SkillsGraph'
import { SKILLS } from '#/data/skills'

export default function SkillsSection() {
  return (
    <Section id="skills">
      <ScrollReveal>
        <SectionHeader eyebrow="Expertise" title="Technical Skills" className="pb-8" />
      </ScrollReveal>

      <SkillsGraph />

      {/* Screen-reader accessible skill list — visually hidden */}
      <ul
        aria-label="Technical skills"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {SKILLS.map(skill => (
          <li key={skill.id}>{skill.name}</li>
        ))}
      </ul>
    </Section>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
pnpm vitest run src/sections/SkillsSection.test.tsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Run all tests to check for regressions**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/sections/SkillsSection.tsx src/sections/SkillsSection.test.tsx
git commit -m "feat: replace skills card grid with 3D force-directed graph"
```

---

## Task 10: Verify in browser

**Files:** none — observation only

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Open http://localhost:3000 and scroll to the Skills section**

Verify:
- [ ] 3D canvas renders with skill nodes visible
- [ ] Nodes are grouped by category (teal cluster, purple cluster, amber cluster)
- [ ] Edges connect each skill to its category anchor
- [ ] Anchor labels ("Languages", "Frameworks", "Infrastructure") visible
- [ ] Hovering a skill node triggers glow rings and a label chip
- [ ] Clicking a category anchor triggers pulse ring animation
- [ ] Dragging a skill node repositions it and the graph reacts
- [ ] Camera orbits when dragging on empty canvas space
- [ ] Dark mode toggle updates node/edge/anchor colors correctly
- [ ] No console errors

- [ ] **Step 3: Check mobile view (DevTools device emulation)**

Verify:
- [ ] Canvas height is `420px` on narrow viewport
- [ ] Touch orbit and pinch-zoom work
- [ ] Nodes are still visible and labeled

- [ ] **Step 4: Final commit**

```bash
git add -p  # stage only any fixes made during verification
git commit -m "fix: visual tweaks from browser verification"
```

> If no fixes were needed, skip the commit.
