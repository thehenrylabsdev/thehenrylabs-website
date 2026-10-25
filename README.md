<div align="center">

# The Henry Labs (`thehenrylabs.dev`)

**Personal Engineering Portfolio, Interactive Web Platform Laboratories & High-Performance Distributed Systems Showcase**

[![Astro](https://img.shields.io/badge/Astro-7.4-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-Static_Assets-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=flat&logo=turborepo&logoColor=white)](https://turbo.build)
[![pnpm](https://img.shields.io/badge/pnpm-12.15-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io)

</div>

---

## Architecture Overview

This monorepo powers [thehenrylabs.dev](https://thehenrylabs.dev), engineered for maximum SEO, zero-runtime bloat, sub-second TTFB on Cloudflare's global edge network, and a multi-framework interactive laboratory showcase.

```text
thehenrylabs.dev/
├── apps/
│   └── web/                   # Astro 7 SSG + Workers Static Assets
├── labs/
│   └── html-in-canvas/        # WICG HTML-in-Canvas Benchmark Suite (React 19 + Vite + WebGL/WebGPU)
├── packages/
│   ├── lab-sdk/               # Zod-validated lab manifest contract & assembler integration
│   └── config/                # Shared tsconfig, eslint flat configs
└── brand/                     # Master SVG brand vector assets & tokens
```

## Multi-Framework Lab Architecture

Every interactive demonstration is cataloged and deployed under a unified domain path (`/labs/<slug>/`):
- **Tier 1 (Inline)**: Zero-overhead vanilla DOM/Canvas or micro-islands rendered directly in Astro.
- **Tier 2 (Static App)**: Isolated framework sandboxes (React, Vue, Svelte, Three.js, WebGPU, WASM) built to `/labs/<slug>/app/` and assembled during build.
- **Tier 3 (Service)**: Edge-isolated Cloudflare Workers for dynamic backend APIs and realtime collaboration.

## Getting Started

```bash
# Install dependencies across all packages
pnpm install

# Start local dev server (Astro + labs)
pnpm dev

# Build all applications and labs
pnpm build

# Run deterministic test suites
pnpm test
```

## License

MIT © [Henry Nguyen](mailto:thehenrylabs.dev@gmail.com)
