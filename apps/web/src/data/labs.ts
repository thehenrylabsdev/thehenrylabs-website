export interface LabItem {
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
}

export const labsData: Record<string, LabItem> = {
  'html-in-canvas': {
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
  },
};

export const labConfig = labsData['html-in-canvas'];
