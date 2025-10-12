// @ts-check

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vc-ap-mishrashardendu22-blog' : '/',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
    },
    server: {
      fs: {
        allow: ['..', '../..', '../../node_modules'],
      },
    },
  },

  integrations: [react()],
});