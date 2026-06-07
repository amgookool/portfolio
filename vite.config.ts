import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      // SSG: prerender every route to fully-rendered static HTML at build time.
      // crawlLinks follows in-app links so new routes are discovered
      // automatically. Output (e.g. index.html, about/index.html) is served
      // directly by Firebase Hosting; the client hydrates on load.
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      // Emit a static 404.html (renders the root notFoundComponent) so Firebase
      // Hosting can serve a real 404 instead of falling back to the home page.
      pages: [{ path: '/404', prerender: { outputPath: '/404.html' } }],
    }),
    viteReact(),
  ],
})

export default config
