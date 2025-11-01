'use client'

import { useEffect, useState, useRef } from 'react'
import { navItems } from '@/data/static_link'
import { DesktopSidebar } from '@/components/extra/sidebar'

export function ActiveSectionTracker() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isMobile, setIsMobile] = useState(true)
  const ticking = useRef(false)

  useEffect(() => {
    // Check if mobile on mount only
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()

    // Don't attach scroll listener on mobile at all
    if (window.innerWidth >= 768) {
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
    }
  }, [activeSection])

  // Don't render sidebar on mobile at all
  if (isMobile) return null

  return <DesktopSidebar activeSection={activeSection} />
}
