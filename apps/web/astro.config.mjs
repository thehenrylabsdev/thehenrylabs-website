import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Custom integration to assemble static lab builds into dist/client/labs/<slug>/app/
function labsIntegration() {
  return {
    name: 'thehenrylabs-labs-assembler',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const labsDir = fileURLToPath(new URL('../../labs', import.meta.url));
        if (!fs.existsSync(labsDir)) return;

        const resolvedDir = dir instanceof URL ? dir.pathname : String(dir);

        const labs = fs.readdirSync(labsDir, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .map(d => d.name);

        for (const slug of labs) {
          const labDist = path.resolve(labsDir, slug, 'dist');
          if (fs.existsSync(labDist)) {
            const targetDir = path.resolve(resolvedDir, 'labs', slug, 'app');
            fs.mkdirSync(targetDir, { recursive: true });
            fs.cpSync(labDist, targetDir, { recursive: true });
            console.log(`[labs-assembler] Copied lab ${slug} to ${targetDir}`);
          }
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://thehenrylabs.dev',
  trailingSlash: 'always',
  output: 'static',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          vi: 'vi-VN',
        },
      },
    }),
    mdx(),
    labsIntegration(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
