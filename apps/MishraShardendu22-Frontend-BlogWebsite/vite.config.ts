import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { microfrontends } from '@vercel/microfrontends/experimental/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  // Use /blog base path for microfrontend deployment
  const basePath = '/blog'

  return {
    base: basePath,
    plugins: [
      svelte(),
      tailwindcss(),
      microfrontends(),
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
