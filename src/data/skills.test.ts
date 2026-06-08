// @vitest-environment jsdom
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
        `${skill.name} glbPath must be string or null`,
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
