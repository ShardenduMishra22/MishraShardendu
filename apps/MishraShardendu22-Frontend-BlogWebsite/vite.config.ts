import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig(() => {
  // Always use /blog/ as base path for microfrontend deployment
  // The build script sets VITE_BASE_PATH=blog for production builds
  const basePath = process.env.VITE_BASE_PATH ? `/${process.env.VITE_BASE_PATH}/` : '/'

  console.log(`Building with base path: ${basePath}`)

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
