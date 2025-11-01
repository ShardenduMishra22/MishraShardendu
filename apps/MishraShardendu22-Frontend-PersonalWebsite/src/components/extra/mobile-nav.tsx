'use client'

import { NavLink } from './nav'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { navItems } from '@/data/static_link'
import { Menu, Dribbble, X } from 'lucide-react'

export function MobileNavigation({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.mobile-nav') && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="md:hidden mobile-nav">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-4 right-4 z-50 p-3 rounded-xl transition-all duration-300',
          'bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 shadow-lg',
          'hover:bg-sidebar-accent/20 hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'touch-target' // Better touch target for mobile
        )}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-sidebar-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-sidebar-foreground" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] z-40 transition-transform duration-300 ease-out',
          'bg-sidebar/95 backdrop-blur-xl border-l border-sidebar-border/50 shadow-2xl',
          'overflow-x-hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="absolute inset-0 bg-linear-to-b from-sidebar-primary/10 via-transparent to-sidebar-accent/10 opacity-50 pointer-events-none" />

        <div className="p-6 pt-20 border-b border-sidebar-border/50 overflow-hidden">
          <div className="flex items-center gap-3 max-w-full">
            <div className="relative group shrink-0">
              <div className="w-12 h-12 bg-linear-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center shadow-lg shadow-sidebar-primary/25">
                <Dribbble className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-sidebar animate-pulse" />
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="text-lg font-bold text-sidebar-foreground mb-1 truncate">
                Shardendu Mishra
              </div>
              <div className="text-sm font-semibold bg-linear-to-r from-pink-500 via-yellow-400 to-green-500 bg-size-[200%_100%] bg-clip-text text-transparent animate-blast truncate">
                Made Linux in Kernel and Go Lang in Mind
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-200px)]">
          {navItems.map((item, index) => (
            <div
              key={item.href}
              className="animate-in slide-in-from-right duration-300 w-full"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NavLink
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={activeSection === item.href.substring(1)}
                isExpanded={true}
                isMobile={true}
                onClick={closeMobileMenu}
              />
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border/50 overflow-hidden">
          <div className="text-xs text-sidebar-foreground/70 text-center flex items-center justify-center gap-2 flex-wrap">
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse shrink-0" />
            <span className="whitespace-nowrap">Tap to navigate</span>
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
