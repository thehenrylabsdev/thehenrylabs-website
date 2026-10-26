import { describe, it, expect } from 'vitest';
import worker, { isCrawler, parseCookies } from '../index';

describe('Cloudflare Worker Locale & Security Architecture', () => {
  it('detects search engine crawlers accurately', () => {
    expect(isCrawler('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
    expect(isCrawler('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
    expect(isCrawler('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe(false);
    expect(isCrawler(null)).toBe(false);
  });

  it('parses cookies reliably', () => {
    const cookies = parseCookies('session_id=123; lang=vi; theme=dark');
    expect(cookies['lang']).toBe('vi');
    expect(cookies['theme']).toBe('dark');
    expect(cookies['session_id']).toBe('123');
  });

  it('redirects non-bot visitors from VN to /vi/ when requesting root', async () => {
    const mockEnv = {
      ASSETS: {
        fetch: async () => new Response('EN content', { status: 200 }),
      },
    };

    const req = new Request('https://thehenrylabs.dev/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    });
    // Inject Cloudflare CF object
    Object.defineProperty(req, 'cf', {
      value: { country: 'VN' },
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://thehenrylabs.dev/vi/');
  });

  it('does NOT redirect visitors from VN if they explicitly set cookie lang=en', async () => {
    const mockEnv = {
      ASSETS: {
        fetch: async () => new Response('EN content', { status: 200 }),
      },
    };

    const req = new Request('https://thehenrylabs.dev/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        cookie: 'lang=en',
      },
    });
    Object.defineProperty(req, 'cf', {
      value: { country: 'VN' },
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);
  });

  it('never redirects static assets or lab application files', async () => {
    const mockEnv = {
      ASSETS: {
        fetch: async () => new Response('JS bundle', { status: 200 }),
      },
    };

    const req = new Request('https://thehenrylabs.dev/labs/html-in-canvas/app/assets/index.js', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    });
    Object.defineProperty(req, 'cf', {
      value: { country: 'VN' },
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);
  });

  it('injects mandatory security headers into responses', async () => {
    const mockEnv = {
      ASSETS: {
        fetch: async () => new Response('Content', { status: 200 }),
      },
    };

    const req = new Request('https://thehenrylabs.dev/', {
      headers: {
        'user-agent': 'Googlebot/2.1',
      },
    });

    const res = await worker.fetch(req, mockEnv);
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });
});
