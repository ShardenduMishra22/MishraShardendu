import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig(() => {
  // Always use /blog base path since it's accessed through microfrontends
  const basePath = '/blog'

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
