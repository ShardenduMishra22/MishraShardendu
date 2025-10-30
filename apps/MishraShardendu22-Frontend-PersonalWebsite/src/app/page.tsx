import HeroSection from '@/components/main/hero'
import Education from '@/components/main/education'
import { LazySkillsSection } from '@/components/lazy/skills'
import { LazyFooterSection } from '@/components/lazy/footer'
import { LazyProjectsSection } from '@/components/lazy/proj'
import { LazyExperienceSection } from '@/components/lazy/exp'
import { LazyContactSection } from '@/components/lazy/contact'
import { LazyTimelineSection } from '@/components/lazy/timeline'
import { LazyCertificationsSection } from '@/components/lazy/cert'
import { HomeBreadcrumb } from '@/components/seo/BreadcrumbJsonLd'
import { LazyVExperienceSection } from '@/components/lazy/volunteer'
import { ActiveSectionTracker } from '@/components/extra/ActiveSectionTracker'
import { PersonJsonLd, WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo/StructuredData'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Structured data - doesn't block rendering */}
      <PersonJsonLd />
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <HomeBreadcrumb />

      <ActiveSectionTracker />

      <div className="md:pl-20 transition-all duration-500 ease-out will-change-auto">
        {/* Above the fold - critical content */}
        <section id="hero" className="relative">
          <HeroSection />
        </section>

        {/* Below the fold - lazy loaded with intersection observer */}
        <section id="education" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          <Education />
        </section>

        <section id="skills" className="scroll-mt-20 relative">
          <LazySkillsSection />
        </section>

        <section id="timeline">
          <LazyTimelineSection />
        </section>

        <section id="projects">
          <LazyProjectsSection />
        </section>

        <section id="experience">
          <LazyExperienceSection />
        </section>

        <section id="volunteer">
          <LazyVExperienceSection />
        </section>

        <section id="certifications">
          <LazyCertificationsSection />
        </section>

        <section id="contact" className="scroll-mt-20 relative">
          <LazyContactSection />
        </section>

        <section>
          <LazyFooterSection />
        </section>
      </div>
    </div>
  )
}
