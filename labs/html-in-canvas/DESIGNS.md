---
version: alpha
name: "TheHenryLabs Pixel-DOM Bridge"
description: "High-contrast engineering lab design system for the HTML-in-Canvas Interactive Web Platform Lab & Benchmark Suite"
colors:
  primary: "#F8FAFC"
  on-primary: "#090D16"
  secondary: "#38BDF8"
  on-secondary: "#090D16"
  tertiary: "#C084FC"
  on-tertiary: "#090D16"
  accent: "#34D399"
  surface: "#0F172A"
  surface-elevated: "#1E293B"
  neutral: "#CBD5E1"
  border: "#64748B"
  background: "#090D16"
  focus-ring: "#38BDF8"
  error: "#F87171"
  success: "#34D399"
typography:
  h1:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  h3:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "44px"
  button-tertiary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-elevated:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  badge-status:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  badge-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  badge-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  focus-indicator:
    backgroundColor: "{colors.focus-ring}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.xs}"
  divider:
    backgroundColor: "{colors.border}"
    height: "1px"
  input-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    height: "44px"
---

## Overview

**TheHenryLabs Pixel-DOM Bridge** is a high-precision engineering laboratory design system created specifically for the **HTML-in-Canvas Interactive Web Platform Lab & Benchmark Suite**.

- **Brand Identity & Aesthetic Vibe**: Inspired by modern developer laboratories (Linear, Vercel Labs, Chrome DevTools, and Stripe Press), the visual language blends tactile dark slate surfaces (`#090D16`), architectural blueprint coordinate grids, real-time oscilloscope telemetry, and luminous cyber-cyan (`#38BDF8`) and violet (`#C084FC`) signals.
- **Target Demographic**: Senior Frontend Engineers, Graphics/WebGL/WebGPU Developers, Browser Architects, and Tech Recruiters evaluating deep Web Platform expertise.
- **Trend Synthesis**:
  1. *Bento Telemetry Grids*: Asymmetric multi-panel laboratory modules combining live canvas viewports with real-time metric readouts.
  2. *Tactile Glassmorphism & Crisp Borders*: Translucent HUD panels (`backdrop-filter: blur(16px)`) framed by high-contrast `1px` borders (`#64748B`).
  3. *Optical Monospace Telemetry*: Tabular-numeral monospace readouts (`JetBrains Mono`) for 60–120 FPS counters, `DOMMatrix` 4x4 entries, and sub-pixel drift gauges.
  4. *Interactive Exploded 3D Layers*: Visual separation of GPU Pixel Buffers, Hit-Test Wireframes, and Accessibility Trees.

## Colors

All color tokens are engineered for strict **WCAG 2.2 AA and AAA compliance** against the deep obsidian background (`#090D16`):

- **Background (`#090D16`) & Surface (`#0F172A`)**: Low-luminance slate foundation that eliminates pure-black halation while maximizing shader vibrancy.
- **Primary Text (`#F8FAFC`)**: Contrast ratio **18.61:1** against `#090D16` (exceeds WCAG AAA 7.0:1).
- **Secondary / Interactive Cyan (`#38BDF8`)**: Contrast ratio **9.42:1** against `#090D16` (exceeds WCAG AAA). Used for primary actions, active `drawable` indicators, and focus rings.
- **Tertiary / Shader Violet (`#C084FC`)**: Contrast ratio **7.41:1** against `#090D16` (exceeds WCAG AAA). Used for WebGL/WebGPU shader pipelines and 3D matrix visualization.
- **Accent / Telemetry Emerald (`#34D399`)**: Contrast ratio **10.52:1** against `#090D16`. Indicates 60fps stability, native API support, and verified accessibility trees.
- **Neutral Body Text (`#CBD5E1`)**: Contrast ratio **12.91:1** against `#090D16` (exceeds WCAG AAA).
- **Border (`#64748B`)**: Contrast ratio **4.07:1** against `#090D16` (exceeds WCAG 2.2 SC 1.4.11 non-text 3.0:1 requirement).

## Typography

- **Display & Section Headings (`Space Grotesk` / `Inter`)**: Geometric display typography with tight optical tracking (`-0.03em` on `h1`, `-0.025em` on `h2`) for technical authority.
- **Body Copy (`Inter`)**: Generous `1.6` line height for effortless reading of Vietnamese and English technical explanations.
- **Telemetry, Code & Matrix Readouts (`JetBrains Mono`)**: Configured with `font-variant-numeric: tabular-nums` so rapidly updating FPS counters, frame times, and `DOMMatrix` values never cause horizontal layout jitter.

## Layout

- **Container Architecture**: Maximum width of `1280px` (`80rem`) with `16px` (`1rem`) horizontal padding on mobile (`320px`) scaling to `32px` (`2rem`) on desktop.
- **Responsive Breakpoints**:
  - `sm`: `640px` (Single-column stacked lab controls)
  - `md`: `768px` (2-column split telemetry grids)
  - `lg`: `1024px` (12-column asymmetric Bento layout: 7 columns live Canvas viewport + 5 columns interactive inspector)
  - `xl`: `1280px` (Full laboratory dashboard)
- **Reflow Guarantee (SC 1.4.10)**: Every interactive lab, matrix table, and canvas viewport scales cleanly down to `320px` width without horizontal page overflow.

## Elevation & Depth

- **Level 0 (Base Canvas)**: `#090D16` with subtle radial grid pattern (`rgba(148, 163, 184, 0.07)`).
- **Level 1 (Lab Cards)**: `#0F172A` surface with `1px solid #64748B` border and subtle ambient shadow `0 12px 32px -8px rgba(0, 0, 0, 0.6)`.
- **Level 2 (Interactive Controls & Overlays)**: `#1E293B` elevated surface with `backdrop-filter: blur(12px)`.
- **Level 3 (Sticky Navigation & Capability Bar)**: `rgba(9, 13, 22, 0.88)` with `backdrop-filter: blur(16px)` and bottom border `#64748B`.

## Shapes

- **Micro Badges & Matrix Cells (`xs: 4px`, `sm: 6px`)**: Sharp technical framing for code tags and matrix indices.
- **Interactive Buttons & Inputs (`md: 10px`)**: Ergonomic tactile corners for controls and context tabs.
- **Laboratory Modules (`lg: 16px`, `xl: 24px`)**: Smooth outer containers housing canvas sandboxes and telemetry charts.
- **Status Pills (`full: 9999px`)**: Used for live browser support indicators and FPS health badges.

## Components

- **Primary Button (`button-primary`)**: `#38BDF8` background, `#090D16` bold text, minimum `44px` height and width (SC 2.5.8), hover transition to `#7DD3FC`, `2px solid #38BDF8` focus ring with `2px` offset.
- **Secondary / Mode Selector Button (`button-secondary`)**: `#1E293B` background, `#F8FAFC` text, `1px solid #64748B` border, minimum `44px` height.
- **Interactive Lab Canvas Viewport**: Framed container with top telemetry bar (FPS, Frame Time, Active Context, Invalidated Count) and live accessible DOM subtree Controls.
- **Dual-Coded Status Badges**: Every status indicator pairs high-contrast color with a distinct `lucide-react` vector icon (`CheckCircle2`, `AlertTriangle`, `XCircle`, `Activity`) so state is never conveyed by color alone (SC 1.4.1).

## Do's and Don'ts

- **DO**: Strictly use `lucide-react` vector icons (`Layers`, `Cpu`, `Gauge`, `Eye`, `Box`, `Sparkles`, `ShieldAlert`, `CheckCircle2`, `Terminal`, `Sliders`) for all interface iconography.
- **DO**: Ensure all interactive buttons, tabs, sliders, and toggles maintain a minimum hit target of `44x44px` (`min-h-[44px]`).
- **DO**: Provide dual-language support (Vietnamese & English) with accurate technical terminology.
- **DON'T**: **NEVER** use raw unicode emojis (such as rocket, chart, gear, or lightning symbols) anywhere in the UI.
- **DON'T**: Never mutate DOM state inside a real `paint` event listener without a circuit-breaker guard.
- **DON'T**: Never use low-contrast borders or text below WCAG 2.2 AA thresholds.
