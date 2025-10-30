'use client'

import { useEffect, useState } from 'react'
import { navItems } from '@/data/static_link'
import { DesktopSidebar } from '@/components/extra/sidebar'
import { MobileNavigation } from '@/components/extra/mobile-nav'

export function ActiveSectionTracker() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.substring(1))
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <DesktopSidebar activeSection={activeSection} />
      <MobileNavigation activeSection={activeSection} />
    </>
  )
}
