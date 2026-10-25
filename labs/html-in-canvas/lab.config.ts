export interface LabConfig {
  slug: string;
  title: {
    en: string;
    vi: string;
  };
  summary: {
    en: string;
    vi: string;
  };
  tier: 'inline' | 'static-app' | 'service';
  stack: string[];
  topics: string[];
  status: 'live' | 'wip' | 'archived';
  featured: boolean;
  publishedAt: string;
  repo: string;
  embed: {
    mode: 'iframe' | 'inline';
    aspectRatio: string;
    allowFullscreen: boolean;
  };
  entries: string[];
  requirements: string[];
  headers?: Record<string, string>;
  seo: {
    keywords: string[];
  };
}

export const labConfig: LabConfig = {
  slug: 'html-in-canvas',
  title: {
    en: 'HTML-in-Canvas Lab & Benchmark Suite',
    vi: 'Phòng thí nghiệm HTML-in-Canvas & Bộ chuẩn hiệu năng',
  },
  summary: {
    en: 'Interactive Web Platform Engineering Lab & Empirical Benchmark for the WICG HTML-in-Canvas API (content="drawable", drawElementImage, texElementSubImage2D, drawElementImageToTexture, updateGeometry).',
    vi: 'Phòng thí nghiệm kỹ thuật Web Platform & Bộ đo lường thực nghiệm API WICG HTML-in-Canvas (content="drawable", drawElementImage, texElementSubImage2D, drawElementImageToTexture, updateGeometry).',
  },
  tier: 'static-app',
  stack: ['react', 'vite', 'webgl', 'webgpu', 'typescript', 'tailwindcss'],
  topics: ['web-platform', 'graphics', 'performance', 'accessibility'],
  status: 'live',
  featured: true,
  publishedAt: '2026-10-25',
  repo: 'https://github.com/thehenrylabsdev/thehenrylabs-website/tree/main/labs/html-in-canvas',
  embed: {
    mode: 'iframe',
    aspectRatio: '16/9',
    allowFullscreen: true,
  },
  entries: ['shader', 'geometry-sync', 'paint-pipeline', 'arena-benchmark'],
  requirements: [
    'Google Chrome 155+ with Chrome Origin Trial or chrome://flags/#canvas-draw-element',
  ],
  headers: {
    'Origin-Trial': 'env:HTML_IN_CANVAS_OT_TOKEN',
  },
  seo: {
    keywords: [
      'HTML-in-Canvas',
      'drawElementImage',
      'texElementSubImage2D',
      'WebGPU',
      'Canvas 2D',
      'WICG',
    ],
  },
};

export default labConfig;
