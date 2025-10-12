import './index.css'
import App from './app'
import { render } from 'preact'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './hooks/use-theme'

render(
  <ThemeProvider>
    <App />
    <Toaster position="top-right" />
  </ThemeProvider>,
  document.getElementById('app')!
)
