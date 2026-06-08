import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '#/sections/HeroSection'
import AboutSection from '#/sections/AboutSection'
import ExperienceSection from '#/sections/ExperienceSection'
import SkillsSection from '#/sections/SkillsSection'
import EducationSection from '#/sections/EducationSection'
import ProjectsSection from '#/sections/ProjectsSection'
import ContactSection from '#/sections/ContactSection'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}
