import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const slug = args[0];

if (!slug) {
  console.error('Usage: pnpm new:lab <slug>');
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), 'labs', slug);

if (fs.existsSync(targetDir)) {
  console.error(`Lab directory already exists: ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

// 1. package.json
const pkgJson = {
  name: `thehenrylabs-lab-${slug}`,
  private: true,
  version: '1.0.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
    typecheck: 'tsc --noEmit',
  },
  dependencies: {
    'lucide-react': '^0.544.0',
    react: '^19.1.0',
    'react-dom': '^19.1.0',
  },
  devDependencies: {
    '@vitejs/plugin-react': '^4.4.1',
    typescript: '^5.8.3',
    vite: '^6.3.2',
  },
};

fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

// 2. lab.config.ts
const labConfigContent = `import type { LabManifest } from '@thehenrylabs/lab-sdk';

export const labConfig: LabManifest = {
  slug: '${slug}',
  title: {
    en: '${slug.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}',
    vi: '${slug.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}',
  },
  summary: {
    en: 'Interactive demonstration for ${slug}.',
    vi: 'Phòng thử nghiệm tương tác cho ${slug}.',
  },
  tier: 'static-app',
  stack: ['typescript', 'vite', 'react'],
  topics: ['web-platform'],
  status: 'wip',
  featured: false,
  publishedAt: '${new Date().toISOString().split('T')[0]}',
  repo: 'https://github.com/thehenrylabsdev/thehenrylabs-website/tree/main/labs/${slug}',
  embed: {
    mode: 'iframe',
    aspectRatio: '16/9',
    allowFullscreen: true,
  },
  entries: [],
  requirements: [],
  seo: {
    keywords: ['${slug}'],
  },
};

export default labConfig;
`;

fs.writeFileSync(path.join(targetDir, 'lab.config.ts'), labConfigContent);

// 3. vite.config.ts
const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.LAB_BASE || '/labs/${slug}/app/',
  plugins: [react()],
});
`;

fs.writeFileSync(path.join(targetDir, 'vite.config.ts'), viteConfigContent);

// 4. index.html
const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${slug}</title>
  </head>
  <body style="background: #090D16; color: #F8FAFC; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
    <div id="root">
      <h1>Lab: ${slug}</h1>
      <p>Scaffolded ready for implementation.</p>
    </div>
  </body>
</html>
`;

fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtmlContent);

console.log(`[new:lab] Successfully scaffolded new lab at labs/${slug}!`);
