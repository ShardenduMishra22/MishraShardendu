import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { microfrontends } from '@vercel/microfrontends/experimental/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  // Always use /blog/ base path for microfrontends integration
  const basePath = '/blog/'

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
    appType: 'spa' as const,
    build: {
      outDir: 'dist', // Explicitly set output directory for Vercel
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
