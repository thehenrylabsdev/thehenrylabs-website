export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  HTML_IN_CANVAS_OT_TOKEN?: string;
}

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebot',
  'facebookexternalhit',
  'ia_archiver',
  'twitterbot',
  'linkedinbot',
  'applebot',
  'petalbot',
];

export function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  for (const cookie of cookieHeader.split(';')) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      list[name] = decodeURIComponent(rest.join('='));
    }
  }
  return list;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Skip static assets, lab apps, and API routes from locale redirection
    const isStaticAsset =
      pathname.startsWith('/_astro/') ||
      pathname.startsWith('/labs/') && pathname.includes('/app/') ||
      pathname.startsWith('/brand/') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.json') ||
      pathname.endsWith('.txt') ||
      pathname.endsWith('.xml');

    if (!isStaticAsset) {
      const userAgent = request.headers.get('user-agent');
      const isBot = isCrawler(userAgent);

      // Only perform geo-redirect if visitor is not a bot and not already on /vi/
      if (!isBot && !pathname.startsWith('/vi/') && pathname !== '/vi') {
        const cookies = parseCookies(request.headers.get('cookie'));
        const userLangPreference = cookies['lang'];

        // If user explicitly chose 'en', do not redirect
        if (userLangPreference !== 'en') {
          // Check Cloudflare CF country header
          const cf = (request as unknown as { cf?: { country?: string } }).cf;
          const country = cf?.country;

          if (country === 'VN' || userLangPreference === 'vi') {
            const viUrl = new URL(url.toString());
            viUrl.pathname = `/vi${pathname === '/' ? '/' : pathname}`;
            return Response.redirect(viUrl.toString(), 302);
          }
        }
      }
    }

    // 2. Fetch the pre-rendered static asset from Cloudflare Workers ASSETS binding
    const response = await env.ASSETS.fetch(request);

    // 3. Inject Security Headers
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), microphone=()');

    // 4. Inject Chrome Origin Trial Token for HTML-in-Canvas routes if available
    if (pathname.includes('html-in-canvas') && env.HTML_IN_CANVAS_OT_TOKEN) {
      headers.set('Origin-Trial', env.HTML_IN_CANVAS_OT_TOKEN);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
