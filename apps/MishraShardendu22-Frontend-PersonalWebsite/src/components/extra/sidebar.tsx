'use client'

import { NavLink } from './nav'
import { cn } from '@/lib/utils'
import { Dribbble } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems } from '@/data/static_link'

export function DesktopSidebar({ activeSection }: { activeSection: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isExpanded) setHasAnimated(false)
  }, [isExpanded])

  return (
    <div className="hidden md:block fixed left-0 top-0 h-full z-50">
      <div
        className={cn(
          'h-full bg-gradient-to-b from-card/95 via-card/90 to-background/95 backdrop-blur-xl border-r-2 border-border/80 shadow-2xl transition-all duration-500 ease-out relative',
          isExpanded ? 'w-72' : 'w-20'
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Subtle accent line on the right border */}
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-primary/30 via-secondary/30 to-accent/30 opacity-50" />

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

        <div className="p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center border border-border/40 shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/40">
                <Dribbble className="h-5 w-5 text-primary" />
              </div>
            </div>

            {isExpanded && (
              <div
                className="flex-1 animate-in slide-in-from-left duration-300"
                onAnimationEnd={() => setHasAnimated(true)}
              >
                {hasAnimated && (
                  <div className="text-sm font-semibold bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-[length:200%_100%] bg-clip-text text-transparent animate-blast">
                    Made Linux in Kernel and Go Lang in Mind
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <div
              key={item.href}
              className="animate-in slide-in-from-left duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NavLink
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={activeSection === item.href.substring(1)}
                isExpanded={isExpanded}
              />
            </div>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div
            className={cn(
              'text-xs text-foreground/60 text-center transition-all duration-300 flex items-center justify-center gap-2 bg-card/50 backdrop-blur-sm py-2 px-3 rounded-lg border border-border/40',
              isExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="w-1 h-1 bg-primary/70 rounded-full animate-pulse" />
            <span className="font-medium">Hover to expand</span>
            <div className="w-1 h-1 bg-primary/70 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
