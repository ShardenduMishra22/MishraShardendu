import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// Initialize theme before mounting to prevent FOUC
function initTheme() {
  try {
    const theme = localStorage.getItem('blog-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Failed to initialize theme:', e);
  }
}

// Initialize theme immediately
initTheme();

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
