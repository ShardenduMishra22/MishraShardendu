import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/use-theme'
import { Button } from '../ui/button'

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="relative rounded-full w-10 h-10 bg-background border-border hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
