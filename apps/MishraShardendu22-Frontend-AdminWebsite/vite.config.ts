import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { microfrontends } from '@vercel/microfrontends/experimental/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = mode === 'production' ? '/vc-ap-mishrashardendu22-admin' : '/admin'

  return {
    plugins: [
      preact(),
      tailwindcss(),
      microfrontends({ basePath }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Core vendor chunk - Framework and routing
            'vendor-core': ['preact', 'preact/hooks', 'preact-router', 'preact-compat'],
            // UI components chunk - Radix UI components
            'vendor-ui': [
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-tabs',
              '@radix-ui/react-tooltip',
              'lucide-react',
            ],
            // TipTap editor chunk - Rich text editor
            'vendor-editor': [
              '@tiptap/react',
              '@tiptap/starter-kit',
              '@tiptap/extension-character-count',
              '@tiptap/extension-code',
              '@tiptap/extension-code-block-lowlight',
              '@tiptap/extension-hard-break',
              '@tiptap/extension-horizontal-rule',
              '@tiptap/extension-image',
              '@tiptap/extension-link',
              '@tiptap/extension-placeholder',
              '@tiptap/extension-strike',
              '@tiptap/extension-text-style',
              '@tiptap/extension-underline',
              'tiptap-markdown',
              'lowlight',
            ],
            // Form and validation chunk
            'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // DnD and utilities chunk
            'vendor-utils': [
              '@dnd-kit/core',
              '@dnd-kit/sortable',
              '@dnd-kit/utilities',
              'axios',
              'react-hot-toast',
              'react-markdown',
            ],
          },
        },
      },
      // Increase the chunk size warning limit to 600 KB
      chunkSizeWarningLimit: 600,
    },
    server: {
      proxy: {
        '/api/proxy': {
          target: env.VITE_BACKEND_1 || 'https://portfolio-backend-1p9d.onrender.com',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/proxy/, '/api'),
          configure: (proxy: any, _options: any) => {
            proxy.on('error', (err: any, _req: any, _res: any) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (_proxyReq: any, req: any, _res: any) => {
              console.log('Sending Request to the Target:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
            })
          },
        },
      },
    },
  }
})
