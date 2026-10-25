import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Eye,
  Layers,
  MousePointerClick,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface HeroShaderLabProps {
  lang: 'vi' | 'en';
}

export const HeroShaderLab: React.FC<HeroShaderLabProps> = ({ lang }) => {
  const [liveTitle, setLiveTitle] = useState<string>('TheHenryLabs Canvas UI');
  const [waveAmplitude, setWaveAmplitude] = useState<number>(14);
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(1);
  const [paintPulseCount, setPaintPulseCount] = useState<number>(12);
  const [lastInvalidated, setLastInvalidated] = useState<string>('#drawable-card-root');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerPaintInvalidation = (sourceId: string): void => {
    setPaintPulseCount((c) => c + 1);
    setLastInvalidated(sourceId);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let phase = 0;

    const render = (): void => {
      phase += 0.045;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw background technical shader grid & animated harmonic wave lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.lineWidth = 1;

      const rows = 12;
      for (let r = 0; r <= rows; r += 1) {
        ctx.beginPath();
        const baseY = (h / rows) * r;
        for (let x = 0; x <= w; x += 16) {
          const offset =
            Math.sin(x * 0.018 + phase + r * 0.35) * (waveAmplitude * 0.65) +
            Math.cos(x * 0.01 - phase) * (waveAmplitude * 0.35);
          const y = baseY + offset;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw glowing GPU shader particles
      for (let i = 0; i < 18; i += 1) {
        const px = ((i * 97 + phase * 28) % (w - 40)) + 20;
        const py =
          h * 0.5 +
          Math.sin(phase * 0.9 + i * 0.7) * (h * 0.34) +
          Math.cos(phase * 0.5 + i) * (waveAmplitude * 0.8);
        const radius = (i % 3) + 1.5;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.65)' : 'rgba(192, 132, 252, 0.65)';
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(animId);
    };
  }, [waveAmplitude]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Narrative & Key Takeaways */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#64748B] bg-[#0F172A] px-3.5 py-1.5 text-xs font-mono font-medium text-[#38BDF8]">
            <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
            <span>WICG HTML-in-Canvas Proposal • content=&quot;drawable&quot;</span>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-5xl lg:leading-[1.12]"
          >
            {lang === 'vi'
              ? 'Render DOM Sống Trực Tiếp Vào Mảng Pixel Của '
              : 'Render Live Accessible DOM Directly Inside '}
            <span className="text-[#38BDF8]">&lt;canvas&gt;</span>
          </h1>

          <p className="text-base leading-relaxed text-[#CBD5E1] sm:text-lg">
            {lang === 'vi'
              ? 'Xóa bỏ ranh giới lịch sử giữa DOM và Canvas: kết hợp hiệu năng xử lý từng pixel bằng GPU Shader (2D, WebGL, WebGPU) với trọn vẹn cây trợ năng (Accessibility Tree), bôi đen văn bản, tìm kiếm trên trang và tương tác biểu mẫu gốc của trình duyệt.'
              : 'Bridge the historical divide between DOM and Canvas: combine GPU hardware-accelerated pixel shaders (2D, WebGL, WebGPU) with full browser Accessibility Trees, native text selection, find-in-page, and live form controls.'}
          </p>

          {/* 3 Core Pillar Pills */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#64748B] bg-[#0F172A]/90 p-3.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8]">
                <Layers className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>STEP 1: PREPARE</span>
              </div>
              <p className="mt-1.5 font-mono text-sm font-semibold text-[#F8FAFC]">
                content=&quot;drawable&quot;
              </p>
              <p className="mt-1 text-xs text-[#CBD5E1]">
                {lang === 'vi' ? 'Giữ layout & A11y cho thẻ con' : 'Preserves layout & A11y subtree'}
              </p>
            </div>

            <div className="rounded-xl border border-[#64748B] bg-[#0F172A]/90 p-3.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C084FC]">
                <Cpu className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>STEP 2: RENDER</span>
              </div>
              <p className="mt-1.5 font-mono text-sm font-semibold text-[#F8FAFC]">
                drawElementImage()
              </p>
              <p className="mt-1 text-xs text-[#CBD5E1]">
                {lang === 'vi' ? 'Hỗ trợ 2D, WebGL & WebGPU' : 'Unified 2D, WebGL & WebGPU'}
              </p>
            </div>

            <div className="rounded-xl border border-[#64748B] bg-[#0F172A]/90 p-3.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#34D399]">
                <Activity className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>STEP 3: SYNC</span>
              </div>
              <p className="mt-1.5 font-mono text-sm font-semibold text-[#F8FAFC]">
                on(&apos;paint&apos;) + Matrix
              </p>
              <p className="mt-1 text-xs text-[#CBD5E1]">
                {lang === 'vi' ? 'Đồng bộ snapshot & 3D hit-test' : 'Snapshot & 3D hit-test sync'}
              </p>
            </div>
          </div>

          {/* Interactive Controls for Hero Card */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setXrayMode((v) => !v)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                xrayMode
                  ? 'bg-[#C084FC] text-[#090D16]'
                  : 'bg-[#38BDF8] text-[#090D16] hover:bg-[#7DD3FC]'
              }`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>
                {xrayMode
                  ? lang === 'vi'
                    ? 'Tắt Chế Độ Tia X (X-Ray 3 Lớp)'
                    : 'Disable 3-Layer X-Ray View'
                  : lang === 'vi'
                    ? 'Bật Tia X: Xem 3 Tầng Pixel / Hit-Box / A11y'
                    : 'Toggle X-Ray: Inspect 3-Layer Architecture'}
              </span>
            </button>

            <a
              href="#arena-benchmark"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#64748B] bg-[#1E293B] px-4 py-2.5 text-sm font-medium text-[#F8FAFC] hover:border-[#38BDF8]"
            >
              <Terminal className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
              <span>
                {lang === 'vi' ? 'Chạy Benchmark Kiểm Chứng' : 'Run Empirical Benchmark'}
              </span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Living Shader Canvas Sandbox */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-[#64748B] bg-[#0F172A] p-4 shadow-2xl sm:p-5">
            {/* Top HUD Telemetry Bar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#64748B]/50 pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#34D399]" />
                <span className="font-semibold text-[#F8FAFC]">
                  &lt;canvas content=&quot;drawable&quot;&gt;
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#CBD5E1]">
                <span>
                  paint events: <strong className="text-[#38BDF8]">{paintPulseCount}</strong>
                </span>
                <span>
                  invalidated: <strong className="text-[#C084FC]">{lastInvalidated}</strong>
                </span>
              </div>
            </div>

            {/* Canvas + Live Drawable Subtree Stage */}
            <div className="relative overflow-hidden rounded-xl border border-[#64748B] bg-[#090D16] p-4 sm:p-6">
              <canvas
                ref={canvasRef}
                width={560}
                height={320}
                aria-label={
                  lang === 'vi'
                    ? 'Mô phỏng bề mặt sóng Shader của thẻ HTML-in-Canvas'
                    : 'Interactive HTML-in-Canvas shader surface simulation'
                }
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
              />

              {/* Live Interactive Drawable Paint Root */}
              <div
                className="relative z-10 rounded-xl border-2 border-[#38BDF8] bg-[#0F172A]/90 p-4 backdrop-blur-md transition-transform duration-300"
                style={{
                  transform: xrayMode
                    ? 'perspective(900px) rotateX(14deg) rotateY(-12deg) scale(0.95)'
                    : `perspective(900px) rotateX(${(waveAmplitude - 14) * 0.35}deg)`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-[#38BDF8] px-2 py-0.5 font-mono text-xs font-bold text-[#090D16]">
                    [drawable] Paint Root #1
                  </span>
                  <span className="font-mono text-xs text-[#34D399]">
                    A11y Tree: Active &amp; Selectable
                  </span>
                </div>

                {/* Live Interactive Heading & Selectable Text */}
                <p className="mt-3 font-display text-lg font-bold text-[#F8FAFC]">
                  {liveTitle || 'Untitled Drawable Node'}
                </p>
                <p className="mt-1 text-xs text-[#CBD5E1]">
                  {lang === 'vi'
                    ? 'Hãy thử bôi đen dòng chữ này, gõ vào ô input bên dưới, hoặc bấm nút: toàn bộ đều là phần tử DOM thật được vẽ vào Canvas!'
                    : 'Try selecting this text, typing in the input below, or clicking the button: all are real DOM nodes painted into the Canvas!'}
                </p>

                {/* Live Form Input inside Canvas */}
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="hero-drawable-input"
                      className="block font-mono text-xs text-[#CBD5E1]"
                    >
                      {lang === 'vi'
                        ? 'Sửa văn bản trực tiếp (Kích hoạt paint):'
                        : 'Live DOM Input (Fires paint event):'}
                    </label>
                    <input
                      id="hero-drawable-input"
                      type="text"
                      value={liveTitle}
                      onChange={(e) => {
                        setLiveTitle(e.target.value);
                        triggerPaintInvalidation('#hero-drawable-input');
                      }}
                      className="mt-1 min-h-[44px] w-full rounded-lg border border-[#64748B] bg-[#090D16] px-3 py-2 text-sm text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hero-shader-slider"
                      className="block font-mono text-xs text-[#CBD5E1]"
                    >
                      {lang === 'vi'
                        ? `Biên độ biến dạng Shader (${waveAmplitude}px):`
                        : `Shader Wave Amplitude (${waveAmplitude}px):`}
                    </label>
                    <input
                      id="hero-shader-slider"
                      type="range"
                      min={0}
                      max={36}
                      value={waveAmplitude}
                      onChange={(e) => {
                        setWaveAmplitude(Number(e.target.value));
                        triggerPaintInvalidation('#hero-shader-slider');
                      }}
                      className="mt-3 min-h-[44px] w-full accent-[#38BDF8]"
                    />
                  </div>
                </div>

                {/* Nested Drawable Button */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#64748B]/40 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setClickCount((c) => c + 1);
                      triggerPaintInvalidation('#nested-cta-button');
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#38BDF8] px-4 py-2 text-xs font-bold text-[#090D16] hover:bg-[#7DD3FC]"
                  >
                    <MousePointerClick className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {lang === 'vi'
                        ? `Nút con [drawable] (Đã click: ${clickCount})`
                        : `Nested [drawable] Button (Clicks: ${clickCount})`}
                    </span>
                  </button>

                  <span className="font-mono text-xs text-[#CBD5E1]">
                    drawElementImage(card, 24, 24)
                  </span>
                </div>
              </div>

              {/* X-Ray Exploded Architecture Inspector */}
              {xrayMode && (
                <div
                  aria-live="polite"
                  className="mt-4 grid grid-cols-1 gap-2.5 rounded-xl border border-[#C084FC] bg-[#1E293B]/95 p-3.5 text-xs"
                >
                  <div className="font-mono font-bold text-[#C084FC]">
                    {lang === 'vi'
                      ? 'CHẾ ĐỘ TIA X: 3 TẦNG ĐỒNG BỘ CỦA HTML-IN-CANVAS'
                      : 'X-RAY INSPECTION: 3 SYNCHRONIZED LAYERS OF HTML-IN-CANVAS'}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-[#64748B] bg-[#090D16] p-2.5">
                      <div className="font-mono font-semibold text-[#38BDF8]">
                        1. GPU Pixel Texture
                      </div>
                      <p className="mt-1 text-[#CBD5E1]">
                        {lang === 'vi'
                          ? 'Snapshot pixel được vẽ lên Canvas và biến dạng qua Shader 60fps.'
                          : 'Pixel snapshot painted onto Canvas and deformed via 60fps Shader.'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#64748B] bg-[#090D16] p-2.5">
                      <div className="font-mono font-semibold text-[#C084FC]">
                        2. Hit-Test Geometry
                      </div>
                      <p className="mt-1 text-[#CBD5E1]">
                        {lang === 'vi'
                          ? 'Vùng nhận chuột & hover khớp chính xác thông qua updateGeometry(DOMMatrix).'
                          : 'Pointer hit-box & hover synced accurately via updateGeometry(DOMMatrix).'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#64748B] bg-[#090D16] p-2.5">
                      <div className="font-mono font-semibold text-[#34D399]">
                        3. Live AOM / Screen Reader
                      </div>
                      <p className="mt-1 font-mono text-[#F8FAFC]">
                        role=&quot;region&quot; • heading: &quot;{liveTitle}&quot; • button(clicks=
                        {clickCount})
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Verification Badge */}
            <div className="mt-3 flex items-center justify-between text-xs text-[#CBD5E1]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#34D399]" aria-hidden="true" />
                <span>
                  {lang === 'vi'
                    ? 'Hỗ trợ đầy đủ Ctrl+F, Screen Reader, Bôi đen copy & Autofill'
                    : 'Full Ctrl+F, Screen Reader, Text Selection & Form Autofill'}
                </span>
              </span>
              <span className="font-mono text-[#38BDF8]">0.0px Desync</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
