'use client'

import Link from 'next/link'
import { navItems } from '@/data/static'

export function Navbar() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="relative w-full bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="shrink-0">
            <Link
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#hero')
              }}
              className="text-xl lg:text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              Shardendu Mishra
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                  }}
                  className="group relative px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    <span className="text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                      {item.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
