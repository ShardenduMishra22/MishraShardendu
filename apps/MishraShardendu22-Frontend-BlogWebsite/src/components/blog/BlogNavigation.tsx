'use client'

import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useState, useMemo } from 'react'
import { authClient } from '../../lib/authClient'
import { BookOpen, Plus, LogOut, Menu, X, Glasses, LayoutDashboard, User2Icon } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

const navigationItems = [
  {
    name: 'Read Blogs',
    href: '/blog',
    icon: Glasses,
    description: 'Read the latest blog posts',
    showForAll: true,
  },
  {
    name: 'Dashboard',
    href: '/blog/dashboard',
    icon: LayoutDashboard,
    description: 'Manage your blog posts',
    showForAll: false,
  },
  {
    name: 'Create Post',
    href: '/blog/create',
    icon: Plus,
    description: 'Write a new blog post',
    showForAll: false,
  },
  {
    name: 'Main Website',
    href: '/',
    icon: User2Icon,
    description: 'Go back to the main website',
    showForAll: true,
  },
]

export default function BlogNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const session = authClient.useSession()

  const isOwner = useMemo(() => {
    const userEmail = session?.data?.user?.email
    return userEmail === OWNER_EMAIL
  }, [session?.data?.user?.email])

  const visibleNavItems = useMemo(() => {
    return navigationItems.filter((item) => {
      if (item.showForAll) return true
      return isOwner
    })
  }, [isOwner])

  const isRouteActive = (href: string) => {
    if (typeof window === 'undefined') return false
    
    const currentPath = window.location.pathname
    
    // Special handling for "Read Blogs" route
    if (href === '/blog') {
      // Exclude dashboard and create pages
      if (currentPath === '/blog/dashboard' || currentPath === '/blog/create') {
        return false
      }
      // Active if on /blog or any blog detail page (e.g., /blog/1, /blog/2/edit)
      return currentPath === '/blog' || (currentPath.startsWith('/blog/') && !currentPath.includes('/dashboard') && !currentPath.includes('/create'))
    }
    
    // For other routes, check exact match or starts with for nested routes
    if (href === '/blog/dashboard') {
      return currentPath === '/blog/dashboard'
    }
    if (href === '/blog/create') {
      return currentPath === '/blog/create'
    }
    
    return currentPath === href
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      window.location.href = '/blog'
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const handleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/blog',
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login error:', error)
    }
  }

  return (
    <>
      {/* Fixed Theme Toggle - Bottom right position */}
      <div className="fixed bottom-4 right-4 z-[60]">
        <ThemeToggle />
      </div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background border-border"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background">
          <div className="flex flex-col justify-center items-center h-full space-y-3 p-6">
            {visibleNavItems.map((item) => {
              const isActive = isRouteActive(item.href)
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 w-full max-w-md p-4 rounded-lg border transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs opacity-80">{item.description}</div>
                  </div>
                </a>
              )
            })}

            {session.data ? (
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full max-w-md border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <Button onClick={handleLogin} className="w-full max-w-md">
                Login with Google
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-background border-r">
          <div className="flex items-center gap-3 p-6 border-b">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base text-foreground whitespace-nowrap">Blog Hub</h1>
              <p className="text-xs text-muted-foreground">Share your thoughts</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {visibleNavItems.map((item) => {
              const isActive = isRouteActive(item.href)
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  </div>
                </a>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            {session.data ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <Avatar className="w-10 h-10 border-2 border-primary/20">
                    <AvatarImage 
                      src={session.data.user.image ?? undefined}
                      alt={session.data.user?.name || session.data.user?.email || 'User'} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {session.data.user?.name?.charAt(0) || session.data.user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {session.data.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.data.user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  {isLoggingOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Please log in to continue
                </p>
                <Button onClick={handleLogin} className="w-full">
                  Login with Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
