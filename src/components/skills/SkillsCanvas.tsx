import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { View, useGLTF } from '@react-three/drei'
import { SKILLS } from '#/data/skills'

// ── shared-layer context ────────────────────────────────────────────────────
// `active` flips true once we're client-side AND WebGL is available. Until then
// (SSR, jsdom tests, GL-less browsers) every pill falls back to its dot, so
// there's no flash and no WebGL is touched off the happy path.

export type SkillsLayerValue = { active: boolean }

export const SkillsLayerContext = createContext<SkillsLayerValue>({ active: false })

export function useSkillsLayer(): SkillsLayerValue {
  return useContext(SkillsLayerContext)
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

// Re-render (under frameloop="demand") whenever the page scrolls or resizes so
// each <View> re-scissors to its pill's current viewport position.
function FrameSync() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const onChange = () => invalidate()
    window.addEventListener('scroll', onChange, { passive: true })
    window.addEventListener('resize', onChange)
    invalidate()
    return () => {
      window.removeEventListener('scroll', onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [invalidate])
  return null
}

// ── provider + single shared canvas ──────────────────────────────────────────

export default function SkillsLayerProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!hasWebGL()) return
    setActive(true)
    // Warm the cache so logos don't pop in one-by-one on first paint.
    for (const skill of SKILLS) {
      if (skill.glbPath) useGLTF.preload(skill.glbPath)
    }
  }, [])

  return (
    <SkillsLayerContext.Provider value={{ active }}>
      {children}
      {active && (
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
          }}
          aria-hidden
        >
          <FrameSync />
          <View.Port />
        </Canvas>
      )}
    </SkillsLayerContext.Provider>
  )
}
