// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import SkillMarker from './SkillMarker'
import { SkillsLayerContext } from './SkillsCanvas'
import type { Skill } from '#/data/skills'

const withGlb: Skill = {
  id: 'typescript',
  name: 'TypeScript',
  shortName: 'TS',
  category: 'languages',
  glbPath: '/3d/typescript-logo.glb',
}

const noGlb: Skill = {
  id: 'javascript',
  name: 'JavaScript',
  shortName: 'JS',
  category: 'languages',
  glbPath: null,
}

function renderMarker(skill: Skill, active: boolean) {
  return render(
    <SkillsLayerContext.Provider value={{ active }}>
      <SkillMarker skill={skill} accent="#0aa" />
    </SkillsLayerContext.Provider>,
  )
}

describe('SkillMarker', () => {
  afterEach(cleanup)

  it('shows the colored dot when the 3D layer is inactive', () => {
    renderMarker(withGlb, false)
    expect(screen.getByTestId('skill-dot')).toBeTruthy()
    expect(screen.queryByTestId('skill-logo')).toBeNull()
  })

  it('shows the 3D logo mount for a skill with a GLB when the layer is active', () => {
    renderMarker(withGlb, true)
    expect(screen.getByTestId('skill-logo')).toBeTruthy()
    expect(screen.queryByTestId('skill-dot')).toBeNull()
  })

  it('falls back to the dot for an asset-less skill even when active', () => {
    renderMarker(noGlb, true)
    expect(screen.getByTestId('skill-dot')).toBeTruthy()
    expect(screen.queryByTestId('skill-logo')).toBeNull()
  })
})
