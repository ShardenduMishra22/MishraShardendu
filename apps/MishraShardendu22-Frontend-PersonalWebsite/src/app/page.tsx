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
    <div className="min-h-screen bg-background">
      {/* Structured data - doesn't block rendering */}
      <PersonJsonLd />
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <HomeBreadcrumb />

      <ActiveSectionTracker />

      <div className="md:pl-20 will-change-auto">
        {/* Above the fold - critical content with minimal height to prevent CLS */}
        <section id="hero" className="relative min-h-[500px] sm:min-h-[600px]">
          <HeroSection />
        </section>

        {/* Below the fold - lazy loaded with intersection observer */}
        <section id="education" className="scroll-mt-20 relative min-h-[500px] sm:min-h-[600px]">
          <Education />
        </section>

        <section id="skills" className="scroll-mt-20 relative min-h-[400px]">
          <LazySkillsSection />
        </section>

        <section id="timeline" className="min-h-[400px]">
          <LazyTimelineSection />
        </section>

        <section id="projects" className="min-h-[600px]">
          <LazyProjectsSection />
        </section>

        <section id="experience" className="min-h-[600px]">
          <LazyExperienceSection />
        </section>

        <section id="volunteer" className="min-h-[500px]">
          <LazyVExperienceSection />
        </section>

        <section id="certifications" className="min-h-[500px]">
          <LazyCertificationsSection />
        </section>

        <section id="contact" className="scroll-mt-20 relative min-h-[400px]">
          <LazyContactSection />
        </section>

        <section className="min-h-[300px]">
          <LazyFooterSection />
        </section>
      </div>
    </div>
  )
}
