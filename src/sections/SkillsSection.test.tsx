// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import SkillsSection from './SkillsSection'
import { SKILLS } from '#/data/skills'

vi.mock('#/components/skills/SkillsGraph', () => ({
  default: () => <div data-testid="skills-graph" />,
}))

vi.mock('#/components/Section', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('#/components/SectionHeader', () => ({
  default: ({ title }: { title: string }) => <h2>{title}</h2>,
}))

vi.mock('#/components/ScrollReveal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('SkillsSection', () => {
  afterEach(() => cleanup())

  it('renders the SkillsGraph canvas', () => {
    render(<SkillsSection />)
    expect(screen.getByTestId('skills-graph')).toBeTruthy()
  })

  it('renders a hidden accessibility list with all skills', () => {
    render(<SkillsSection />)
    const list = screen.getByRole('list', { hidden: true, name: 'Technical skills' })
    expect(list).toBeTruthy()
    expect(screen.getByText('TypeScript')).toBeTruthy()
    expect(screen.getByText('Rust')).toBeTruthy()
    expect(screen.getByText('Firebase')).toBeTruthy()
    expect(screen.getAllByRole('listitem', { hidden: true }).length).toBe(SKILLS.length)
  })
})
