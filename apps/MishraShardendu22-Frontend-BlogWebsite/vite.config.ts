import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig(() => {
  // Use root path for standalone deployment, /blog for microfrontend
  // Set VITE_BASE_PATH=blog when building for microfrontend integration
  const basePath = process.env.VITE_BASE_PATH ? `/${process.env.VITE_BASE_PATH}` : '/'

  return {
    base: basePath,
    plugins: [
      svelte(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Core vendor chunk - Framework
            'vendor-core': ['svelte'],
            // UI components chunk
            'vendor-ui': [
              'lucide-svelte',
              'lucide-react',
            ],
          },
        },
      },
    },
  }
})
