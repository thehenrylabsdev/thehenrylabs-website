export type RenderingMode =
  | 'pure-dom'
  | 'floating-overlay'
  | 'pure-canvas'
  | 'html-in-canvas';

export interface ModeCapabilities {
  responsiveTextWrap: boolean;
  nativeFormControls: boolean;
  copyPasteAndFind: boolean;
  screenReaderA11y: boolean;
  autoTranslateAutofill: boolean;
  gpuPixelShaders: boolean;
  massiveNodeScalability: boolean;
  zeroScrollZoomDesync: boolean;
}

export interface BenchmarkMetrics {
  mode: RenderingMode;
  nodeCount: number;
  panZoomSpeed: number;
  fps: number;
  onePercentLowFps: number;
  frameTimeMs: number;
  layoutRecalcMs: number;
  gpuDrawMs: number;
  subpixelDesyncPx: number;
  jsBundleOverheadKb: number;
  accessibilityScore: number;
  capabilities: ModeCapabilities;
}

export function getModeCapabilities(mode: RenderingMode): ModeCapabilities {
  switch (mode) {
    case 'pure-dom':
      return {
        responsiveTextWrap: true,
        nativeFormControls: true,
        copyPasteAndFind: true,
        screenReaderA11y: true,
        autoTranslateAutofill: true,
        gpuPixelShaders: false,
        massiveNodeScalability: false,
        zeroScrollZoomDesync: true,
      };
    case 'floating-overlay':
      return {
        responsiveTextWrap: true,
        nativeFormControls: true,
        copyPasteAndFind: true,
        screenReaderA11y: true,
        autoTranslateAutofill: true,
        gpuPixelShaders: true,
        massiveNodeScalability: false,
        zeroScrollZoomDesync: false,
      };
    case 'pure-canvas':
      return {
        responsiveTextWrap: false,
        nativeFormControls: false,
        copyPasteAndFind: false,
        screenReaderA11y: false,
        autoTranslateAutofill: false,
        gpuPixelShaders: true,
        massiveNodeScalability: true,
        zeroScrollZoomDesync: true,
      };
    case 'html-in-canvas':
      return {
        responsiveTextWrap: true,
        nativeFormControls: true,
        copyPasteAndFind: true,
        screenReaderA11y: true,
        autoTranslateAutofill: true,
        gpuPixelShaders: true,
        massiveNodeScalability: true,
        zeroScrollZoomDesync: true,
      };
  }
}

/**
 * Empirically models frame timing, layout cost, and scroll/zoom desync drift
 * across the 4 rendering architectures based on node count and camera velocity.
 */
export function computeArenaMetrics(
  mode: RenderingMode,
  nodeCount: number,
  panZoomSpeed: number
): BenchmarkMetrics {
  const clampedNodes = Math.max(50, Math.min(20000, nodeCount));
  const clampedSpeed = Math.max(0, Math.min(10, panZoomSpeed));
  const capabilities = getModeCapabilities(mode);

  let layoutRecalcMs = 0.4;
  let gpuDrawMs = 0.8;
  let subpixelDesyncPx = 0;
  let jsBundleOverheadKb = 0;
  let accessibilityScore = 100;

  if (mode === 'pure-dom') {
    // DOM suffers exponential layout & compositing layer overhead with thousands of moving 3D/animated nodes
    layoutRecalcMs = Number((0.8 + (clampedNodes / 1000) * 6.2 + Math.pow(clampedNodes / 2500, 1.85) * 4.5).toFixed(2));
    gpuDrawMs = Number((1.1 + (clampedNodes / 1000) * 1.4).toFixed(2));
    subpixelDesyncPx = 0;
    jsBundleOverheadKb = 0;
    accessibilityScore = 100;
  } else if (mode === 'floating-overlay') {
    // Floating HTML overlays require manual JS getBoundingClientRect/matrix3d sync each frame, causing main-thread lag & scroll/zoom desync
    layoutRecalcMs = Number((1.5 + (clampedNodes / 1000) * 5.4 + clampedSpeed * 0.95).toFixed(2));
    gpuDrawMs = Number((1.4 + (clampedNodes / 1000) * 1.2).toFixed(2));
    // Desync increases with camera pan/zoom speed and main-thread frame time
    subpixelDesyncPx = Number(
      (clampedSpeed * 1.85 * (1 + clampedNodes / 4000)).toFixed(2)
    );
    jsBundleOverheadKb = 18.5;
    accessibilityScore = 92;
  } else if (mode === 'pure-canvas') {
    // Pure Canvas is blazing fast on GPU, but opaque pixel grid loses all DOM A11y, text selection, find-in-page, and requires heavy JS text/UI layout engine
    layoutRecalcMs = Number((0.15 + (clampedNodes / 10000) * 0.6).toFixed(2));
    gpuDrawMs = Number((0.65 + (clampedNodes / 5000) * 1.35).toFixed(2));
    subpixelDesyncPx = 0;
    jsBundleOverheadKb = 142.0; // Custom text shaping, word-wrap, input & UI re-implementation bundle cost
    accessibilityScore = 8; // Opaque pixel grid
  } else {
    // HTML-in-Canvas: Browser native layout on drawable paint roots + direct GPU texture upload + zero overlay desync
    layoutRecalcMs = Number((0.45 + (clampedNodes / 5000) * 1.45).toFixed(2));
    gpuDrawMs = Number((0.75 + (clampedNodes / 5000) * 1.4).toFixed(2));
    subpixelDesyncPx = 0;
    jsBundleOverheadKb = 2.4;
    accessibilityScore = 100;
  }

  const totalFrameTime = Number((layoutRecalcMs + gpuDrawMs).toFixed(2));
  const rawFps = totalFrameTime > 0 ? Math.min(120, Math.round(1000 / totalFrameTime)) : 120;
  const fps = Math.max(4, rawFps);
  const onePercentLowFps = Math.max(
    2,
    Math.round(fps * (mode === 'floating-overlay' ? 0.68 : mode === 'pure-dom' ? 0.74 : 0.91))
  );

  return {
    mode,
    nodeCount: clampedNodes,
    panZoomSpeed: clampedSpeed,
    fps,
    onePercentLowFps,
    frameTimeMs: totalFrameTime,
    layoutRecalcMs,
    gpuDrawMs,
    subpixelDesyncPx,
    jsBundleOverheadKb,
    accessibilityScore,
    capabilities,
  };
}
