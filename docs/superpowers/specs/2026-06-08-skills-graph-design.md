# Skills Graph — Design Spec
**Date:** 2026-06-08
**Branch:** updated-skills-section

---

## Overview

Rework the Skills section from a static three-column card grid into an interactive 3D force-directed graph. Each skill is a node in the graph, rendered as its real 3D GLB logo (or a placeholder sphere for skills awaiting assets). Nodes cluster by category, connected by edges to a per-category anchor node. The scene lives in a React Three Fiber canvas and the user can orbit, drag nodes, and hover for detailed callouts.

---

## Decisions

| Dimension | Choice |
|---|---|
| Graph type | Force-directed physics (d3-force) |
| Category representation | Color-coded anchor nodes per category + skill nodes pulled toward their anchor |
| Hover interaction | Multi-ring glow ripple + floating label chip above node |
| Anchor click interaction | Expanding pulse ring animation |
| GLB rendering | Full 3D scene — logos float as real Three.js objects |
| Missing GLB fallback | Placeholder sphere (category color) with abbreviated text label |

---

## New Dependencies

```
@react-three/fiber      React renderer for Three.js
@react-three/drei       useGLTF, OrbitControls, Html, Sphere helpers
d3-force                Force simulation (positions only, not rendering)
@types/d3-force         TypeScript types
```

`HeroCanvas.tsx` (raw Three.js) is untouched — the new graph uses R3F independently.

---

## File Structure

### New files

```
src/
  components/
    skills/
      SkillsGraph.tsx       R3F Canvas + d3-force simulation + scene root
      SkillNode.tsx         Individual node: GLB model or placeholder sphere
      CategoryAnchor.tsx    Large anchor node per category with click pulse
      EdgeLines.tsx         LineSegments connecting skill nodes to anchors
      SkillLabel.tsx        Html chip that floats above a hovered node
  data/
    skills.ts               Skill records: { id, name, category, glbPath | null }
  utils/
    theme.ts                Exports resolveCssColor() — extracted from HeroCanvas
```

### Modified files

```
src/sections/SkillsSection.tsx   Replaces card grid with <SkillsGraph />
src/styles.css                   Adds --amber and --amber-soft tokens
src/components/HeroCanvas.tsx    Imports resolveCssColor from utils/theme instead of inline
```

---

## CSS Tokens

Three new tokens added to `src/styles.css` alongside the existing lagoon palette. All category colors are resolved at runtime via `getComputedStyle` so they respond to theme switches.

```css
/* :root */
--amber:      oklch(75% 0.16 70);
--amber-soft: color-mix(in oklch, var(--amber) 10%, transparent);

/* [data-theme="dark"] and @media dark block */
--amber:      oklch(80% 0.15 70);
```

| Category | Token | Role |
|---|---|---|
| Languages | `--lagoon` | teal |
| Frameworks | `--lagoon2` | blue-purple |
| Infrastructure | `--amber` | amber |

Colors are resolved via `resolveCssColor(cssVarName)` from `src/utils/theme.ts` — extracted from `HeroCanvas` where it currently lives inline. It reads computed style into a 1×1 canvas to get linear RGB. `HeroCanvas` is updated to import it from there instead. Both components then resolve colors the same way and dark mode re-resolution via `MutationObserver` works for all three.

---

## Data Model

**`src/data/skills.ts`**

```ts
type SkillCategory = 'languages' | 'frameworks' | 'infrastructure'

type Skill = {
  id: string
  name: string           // full display name e.g. "TypeScript"
  shortName: string      // abbreviation for placeholder chips e.g. "TS", "AWS", "Git"
  category: SkillCategory
  glbPath: string | null // null = placeholder sphere; set path when GLB is ready
}
```

Adding a GLB for a placeholder skill requires only updating `glbPath` in `skills.ts` — no other code changes.

**Full node list:**

| Name | Category | GLB |
|---|---|---|
| TypeScript | languages | `/3d/typescript-logo.glb` |
| Java | languages | `/3d/java-logo.glb` |
| Dart | languages | `/3d/dart-logo.glb` |
| Python | languages | `/3d/python-logo.glb` |
| C | languages | `/3d/c-logo.glb` |
| C++ | languages | `/3d/cpp-logo.glb` |
| Rust | languages | `/3d/rust-logo.glb` |
| Bash | languages | `/3d/bash-logo.glb` |
| JavaScript | languages | `null` |
| Node.js | frameworks | `/3d/node-logo.glb` |
| React | frameworks | `/3d/react-logo.glb` |
| Angular | frameworks | `/3d/angular-logo.glb` |
| SvelteKit | frameworks | `/3d/svelte-logo.glb` |
| Flutter | frameworks | `/3d/flutter-logo.glb` |
| Express | frameworks | `null` |
| Spring Boot | frameworks | `null` |
| jQuery | frameworks | `null` |
| Tailwind CSS | frameworks | `null` |
| Firebase | infrastructure | `/3d/firebase-logo.glb` |
| PostgreSQL | infrastructure | `/3d/postgresql-logo.glb` |
| MongoDB | infrastructure | `/3d/mongodb-logo.glb` |
| Docker | infrastructure | `null` |
| GCP | infrastructure | `null` |
| AWS | infrastructure | `null` |
| GitHub Actions | infrastructure | `null` |
| Git | infrastructure | `null` |

The 3 category anchors are derived at runtime from the unique categories — they are not entries in `skills.ts`.

---

## Scene & Camera

- **Canvas:** transparent background, `600px` tall on desktop, `420px` on mobile (via `useMediaQuery`)
- **Camera:** `PerspectiveCamera` at `z=18`, FOV 60°
- **OrbitControls:** damping enabled, vertical orbit clamped to ±50°, auto-rotate at ~0.3 rpm when idle
- **Lighting:**
  - `<ambientLight intensity={0.6}>`
  - Two `<pointLight>` sources (above-left, below-right) with teal tint matching `--lagoon`

---

## Force Simulation

Library: `d3-force` operating in 3D (x, y, z).

| Force | Config |
|---|---|
| `forceManyBody` | strength `-80` — nodes repel each other |
| `forceLink` | each skill linked to its category anchor |
| `forceCenter` | pulls whole graph toward origin |
| `forceCollide` | radius `2.5` — prevents overlap |

**Anchor seeding:** Anchors start with fixed `fx/fy/fz` positions (triangle, spread ~8 units apart) for the first 200 ticks so clusters form cleanly, then released.

**Settling:** Simulation runs until `alphaMin` threshold, then stops. Zero CPU at rest.

**Reheating:** Dragging a node clears its `fx/fy/fz` on release and calls `simulation.alpha(0.3).restart()` so neighbors adjust.

---

## Component Design

### SkillsGraph.tsx
- Owns `d3-force` simulation instance and node position array
- Passes positions to child components each frame via `useFrame`
- Owns `hoveredId` state — set by `SkillNode` pointer events, consumed by `SkillLabel`
- Renders: `<CategoryAnchor>` × 3, `<SkillNode>` × N, `<EdgeLines>`, `<SkillLabel>`
- `<Canvas frameloop="always">`. An `IntersectionObserver` sets a `isVisible` ref; all `useFrame` callbacks check this ref and early-return when the canvas is scrolled out of view — preventing GPU work without unmounting/remounting the scene

### SkillNode.tsx
- **GLB path set:** `useGLTF(glbPath)` loads the model. `useGLTF.preload()` called at module level for all 16 paths.
- **GLB path null:** `<Sphere args={[0.9, 32, 32]}>` with `MeshStandardMaterial` in category color (metalness `0.4`, roughness `0.3`) plus a small always-visible `<Html center>` abbreviation chip
- All nodes: slow Y-axis rotation via `useFrame` (`delta * 0.4` rad/s); increases to `1.8` briefly on hover then settles back
- All nodes: `emissiveIntensity` lerps `0.15→0.8` on hover, back on leave
- Pointer events: `onPointerOver`, `onPointerOut`, `onPointerDown` (drag start), `onPointerMove`, `onPointerUp` (drag end), all call `stopPropagation()` to prevent OrbitControls interference
- GLB models normalized to uniform `1.8` unit diameter via bounding box measurement on load

### CategoryAnchor.tsx
- `<Sphere args={[1.6, 32, 32]}>` with `MeshStandardMaterial`, `emissive` set to category color at intensity `0.25`
- Always-visible `<Html center>` label: "Languages" / "Frameworks" / "Infrastructure" in `.island-kicker` style, category color
- `onClick`: spawns 2 `<Ring>` meshes with staggered start (0ms, 300ms), each scales `1.0→3.5` and fades opacity `0.7→0` over 1s via `useFrame`, then unmounts

### EdgeLines.tsx
- Single `<lineSegments>` with a `BufferGeometry` updated each frame from simulation positions
- `LineBasicMaterial` with `vertexColors: true` — each edge pair colored by its category token
- Opacity `0.3`, `transparent: true`, `depthWrite: false`

### SkillLabel.tsx
- `<Html center>` positioned `[0, 1.6, 0]` above the hovered node
- Chip: monospace font (`.island-kicker`), category-colored border `1px solid`, `--surface` background, skill full name
- CSS `opacity` transition `0.15s ease` — no framer-motion dependency added

---

## Interactions Summary

| Action | Result |
|---|---|
| Hover skill node | 3 concentric rings expand + fade (0ms / 120ms / 240ms stagger, 800ms duration); node emissive ramps up; label chip appears above |
| Leave skill node | Rings finish and unmount; emissive lerps back; label unmounts |
| Click category anchor | 2 expanding pulse rings emitted from anchor, fade over 1s |
| Drag node | Node pinned to pointer; simulation reheats on release |
| Orbit (empty canvas) | Camera orbits with damping; vertical clamped to ±50° |
| Touch (mobile) | Same — OrbitControls handles pinch/pan natively |

---

## Performance

- `useGLTF.preload()` for all 16 GLB paths at module level — loads in background before section is in view
- `frameloop="always"` with `IntersectionObserver`-gated `useFrame` callbacks — no GPU work when scrolled away, no scene teardown on re-entry
- Physics simulation stops at `alphaMin` — zero CPU overhead at rest
- On devices with `navigator.hardwareConcurrency <= 4`: reduced `alphaDecay` for faster settling to avoid initial render jank

---

## Accessibility

- Canvas wrapper: `role="img"`, `aria-label="Interactive 3D skills graph"`
- Visually-hidden `<ul>` below the canvas listing all skill names from `skills.ts` — readable by screen readers
- `ScrollReveal` wrapper removed for this section — canvas handles its own entrance (nodes animate in from origin on mount)

---

## Dark Mode

All three category colors resolved via `getComputedStyle` at mount. A `MutationObserver` on `document.documentElement` watches for `data-theme` attribute changes and re-resolves all three colors, updating the Three.js `MeshStandardMaterial` instances in place.
