// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import SkillsShowcase from './SkillsShowcase'
import { SKILLS, CATEGORY_LABELS, SKILL_CATEGORIES } from '#/data/skills'

// framer-motion's whileInView needs IntersectionObserver, absent in jsdom.
class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

describe('SkillsShowcase', () => {
  beforeAll(() => {
    vi.stubGlobal('IntersectionObserver', IOStub)
  })
  afterEach(() => cleanup())

  it('renders every skill name', () => {
    render(<SkillsShowcase />)
    for (const skill of SKILLS) {
      expect(screen.getByText(skill.name), `${skill.name} not rendered`).toBeTruthy()
    }
  })

  it('renders a labelled heading for each category', () => {
    render(<SkillsShowcase />)
    for (const cat of SKILL_CATEGORIES) {
      expect(screen.getByText(CATEGORY_LABELS[cat])).toBeTruthy()
    }
  })
})
