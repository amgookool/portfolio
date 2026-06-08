// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import SkillsSection from './SkillsSection'

vi.mock('#/components/skills/SkillsShowcase', () => ({
  default: () => <div data-testid="skills-showcase" />,
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

  it('renders the section heading', () => {
    render(<SkillsSection />)
    expect(screen.getByText('Technical Skills')).toBeTruthy()
  })

  it('renders the skills showcase', () => {
    render(<SkillsSection />)
    expect(screen.getByTestId('skills-showcase')).toBeTruthy()
  })
})
