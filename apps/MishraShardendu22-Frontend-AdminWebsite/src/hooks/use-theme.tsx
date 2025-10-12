import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import type { JSX } from 'preact'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(newTheme)
    setResolvedTheme(newTheme)
  }

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'system') {
      applyTheme(getSystemTheme())
    } else {
      applyTheme(newTheme)
    }
  }

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = storedTheme || 'system'
    setThemeState(initialTheme)

    if (initialTheme === 'system') {
      applyTheme(getSystemTheme())
    } else {
      applyTheme(initialTheme)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
