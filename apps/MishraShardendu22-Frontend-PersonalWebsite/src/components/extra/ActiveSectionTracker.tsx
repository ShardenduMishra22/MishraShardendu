'use client'

import { useEffect, useState, useRef } from 'react'
import { navItems } from '@/data/static_link'
import { DesktopSidebar } from '@/components/extra/sidebar'

export function ActiveSectionTracker() {
  const [activeSection, setActiveSection] = useState('hero')
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const sections = navItems.map((item) => item.href.substring(1))
          const currentSection = sections.find((section) => {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              return rect.top <= 100 && rect.bottom >= 100
            }
            return false
          })

          if (currentSection && currentSection !== activeSection) {
            setActiveSection(currentSection)
          }
          ticking.current = false
        })
        ticking.current = true
      }
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  return <DesktopSidebar activeSection={activeSection} />
}
