# Project Rules — TheHenryLabs HTML-in-Canvas Lab

## Design System Governance
This project strictly follows the design system defined in [`DESIGNS.md`](./DESIGNS.md).
All UI components, styles, colors, typography, and icon choices must adhere to `DESIGNS.md`.
No deviations are permitted.

## Engineering & Accessibility Standards
- Strict TypeScript (`strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`).
- Zero generic unicode emojis in the UI; exclusively use `lucide-react` vector icons.
- WCAG 2.2 AA compliance across all viewports down to `320px`.
