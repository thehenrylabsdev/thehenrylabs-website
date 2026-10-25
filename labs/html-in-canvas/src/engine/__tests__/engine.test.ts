import { describe, expect, it } from 'vitest';
import { computeArenaMetrics, getModeCapabilities } from '../benchmarkEngine';
import {
  getContextSpec,
  resolveNestedCanvasPaintOrder,
  simulatePaintEventCycle,
} from '../paintLifecycle';
import { calculateGeometrySyncReport } from '../geometryMatrix';
import { detectHtmlInCanvasCapabilities } from '../capabilityDetector';

describe('HTML-in-Canvas Empirical Verification Engine', () => {
  describe('1. DOM vs. Canvas vs. Overlay vs. HTML-in-Canvas Benchmark', () => {
    it('verifies Pure DOM suffers layout bottleneck at high node counts while retaining A11y', () => {
      const lowNodes = computeArenaMetrics('pure-dom', 200, 2);
      const highNodes = computeArenaMetrics('pure-dom', 10000, 2);

      expect(highNodes.layoutRecalcMs).toBeGreaterThan(lowNodes.layoutRecalcMs * 10);
      expect(highNodes.fps).toBeLessThan(lowNodes.fps);
      expect(highNodes.capabilities.screenReaderA11y).toBe(true);
      expect(highNodes.capabilities.gpuPixelShaders).toBe(false);
    });

    it('verifies Floating HTML Overlays introduce sub-pixel scroll/zoom desync lag', () => {
      const staticCamera = computeArenaMetrics('floating-overlay', 2000, 0);
      const fastPanZoom = computeArenaMetrics('floating-overlay', 4000, 8);

      expect(staticCamera.subpixelDesyncPx).toBe(0);
      expect(fastPanZoom.subpixelDesyncPx).toBeGreaterThan(15);
      expect(fastPanZoom.capabilities.zeroScrollZoomDesync).toBe(false);
    });

    it('verifies Pure Canvas achieves high FPS but loses Accessibility and text selection', () => {
      const canvasMetrics = computeArenaMetrics('pure-canvas', 10000, 8);
      const caps = getModeCapabilities('pure-canvas');

      expect(canvasMetrics.fps).toBeGreaterThanOrEqual(60);
      expect(canvasMetrics.accessibilityScore).toBeLessThan(20);
      expect(caps.screenReaderA11y).toBe(false);
      expect(caps.copyPasteAndFind).toBe(false);
    });

    it('verifies HTML-in-Canvas combines GPU speed, zero desync, and 100% Accessibility', () => {
      const hicMetrics = computeArenaMetrics('html-in-canvas', 10000, 8);

      expect(hicMetrics.fps).toBeGreaterThanOrEqual(60);
      expect(hicMetrics.subpixelDesyncPx).toBe(0);
      expect(hicMetrics.accessibilityScore).toBe(100);
      expect(hicMetrics.capabilities.gpuPixelShaders).toBe(true);
      expect(hicMetrics.capabilities.screenReaderA11y).toBe(true);
    });
  });

  describe('2. 3-Step Pipeline & Paint Event Lifecycle', () => {
    it('provides accurate API specifications for 2D, WebGL, and WebGPU contexts', () => {
      expect(getContextSpec('2d').apiMethod).toContain('drawElementImage');
      expect(getContextSpec('webgl').apiMethod).toContain('texElementSubImage2D');
      expect(getContextSpec('webgpu').apiMethod).toContain('drawElementImageToTexture');
    });

    it('executes a single clean paint cycle when DOM is not mutated inside paint listener', () => {
      const res = simulatePaintEventCycle({
        triggerReason: 'css-hover',
        invalidatedIds: ['#cta-btn'],
        mutateDomInsidePaintListener: false,
      });

      expect(res.framesExecuted).toBe(1);
      expect(res.infiniteLoopDetected).toBe(false);
      expect(res.circuitBreakerTripped).toBe(false);
    });

    it('detects and halts infinite rendering loop when DOM is mutated inside paint listener', () => {
      const res = simulatePaintEventCycle({
        triggerReason: 'text-edit',
        invalidatedIds: ['#live-input'],
        mutateDomInsidePaintListener: true,
        maxCircuitBreakerFrames: 45,
      });

      expect(res.framesExecuted).toBe(45);
      expect(res.infiniteLoopDetected).toBe(true);
      expect(res.circuitBreakerTripped).toBe(true);
    });

    it('resolves nested canvas paint events in reverse bottom-up order (child before parent)', () => {
      const order = resolveNestedCanvasPaintOrder({
        id: 'outer-root-canvas',
        label: 'Outer Scene Canvas',
        depth: 0,
        children: [
          {
            id: 'hud-panel-canvas',
            label: 'HUD Panel Canvas',
            depth: 1,
            children: [
              {
                id: 'minimap-badge-canvas',
                label: 'Minimap Badge Canvas',
                depth: 2,
              },
            ],
          },
          {
            id: 'chat-widget-canvas',
            label: 'Chat Widget Canvas',
            depth: 1,
          },
        ],
      });

      expect(order).toEqual([
        'minimap-badge-canvas',
        'hud-panel-canvas',
        'chat-widget-canvas',
        'outer-root-canvas',
      ]);
    });
  });

  describe('3. 3D Geometry Synchronization (DOMMatrix & updateGeometry)', () => {
    it('automatically aligns hit-box in 2D context without manual updateGeometry call', () => {
      const report = calculateGeometrySyncReport(
        {
          rotateXDeg: 0,
          rotateYDeg: 0,
          rotateZDeg: 15,
          scale: 1,
          translateX: 25,
          translateY: -10,
        },
        '2d-auto',
        false
      );

      expect(report.hitTestDriftPx).toBe(0);
      expect(report.isHitAligned).toBe(true);
    });

    it('detects hit-test drift in 3D shader context when updateGeometry is NOT called', () => {
      const unsynced = calculateGeometrySyncReport(
        {
          rotateXDeg: 28,
          rotateYDeg: -34,
          rotateZDeg: 12,
          scale: 1.1,
          translateX: 40,
          translateY: 20,
        },
        '3d-shader',
        false
      );

      expect(unsynced.hitTestDriftPx).toBeGreaterThan(20);
      expect(unsynced.isHitAligned).toBe(false);
    });

    it('eliminates hit-test drift in 3D shader context when updateGeometry(DOMMatrix) IS called', () => {
      const synced = calculateGeometrySyncReport(
        {
          rotateXDeg: 28,
          rotateYDeg: -34,
          rotateZDeg: 12,
          scale: 1.1,
          translateX: 40,
          translateY: 20,
        },
        '3d-shader',
        true
      );

      expect(synced.hitTestDriftPx).toBe(0);
      expect(synced.isHitAligned).toBe(true);
      expect(synced.matrix16).toHaveLength(16);
    });
  });

  describe('4. Browser Capability Probe', () => {
    it('returns all 5 core HTML-in-Canvas specification checks', () => {
      const report = detectHtmlInCanvasCapabilities();
      expect(report.features).toHaveLength(5);
      expect(report.chromeFlagUrl).toBe('chrome://flags/#canvas-draw-element');
    });
  });
});
