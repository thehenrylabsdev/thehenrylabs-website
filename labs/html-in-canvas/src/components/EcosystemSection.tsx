import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';
import type { CapabilityReport } from '../engine/capabilityDetector';

interface EcosystemSectionProps {
  lang: 'vi' | 'en';
  capabilityReport: CapabilityReport;
}

const ECOSYSTEM_ITEMS = [
  {
    name: 'Three.js & WebGL/WebGPU',
    category: '3D Graphics Engine',
    descVi:
      'Gắn trực tiếp thẻ HTML/CSS tương tác lên bề mặt Mesh 3D bằng texElementSubImage2D và đồng bộ raycasting/DOMMatrix.',
    descEn:
      'Maps live interactive HTML/CSS cards onto 3D Meshes via texElementSubImage2D with synchronized DOMMatrix hit-testing.',
    badge: '3D Texture Sync',
  },
  {
    name: 'Babylon.js & PlayCanvas',
    category: 'WebXR & Game Engines',
    descVi:
      'Xây dựng giao diện HUD trong game 3D và không gian thực tế ảo với đầy đủ khả năng nhập liệu bàn phím và Screen Reader.',
    descEn:
      'Builds in-game 3D HUDs and spatial UI panels with full native keyboard input, IME, and Screen Reader accessibility.',
    badge: 'Game HUD Ready',
  },
  {
    name: 'PixiJS & 2D Engines',
    category: 'High-Speed 2D Scene Graph',
    descVi:
      'Kết hợp tốc độ render Sprite hàng chục nghìn đối tượng của PixiJS với văn bản tự động xuống dòng và form HTML gốc.',
    descEn:
      'Combines PixiJS massive sprite batching speed with native browser word-wrapping, text selection, and HTML forms.',
    badge: '2D drawElementImage',
  },
  {
    name: 'Canvas UI & Component Kits',
    category: 'Open-Source UI Libraries',
    descVi:
      'Hệ sinh thái các bộ thành phần giao diện mã nguồn mở tận dụng HTML-in-Canvas cùng kho tài liệu Awesome HTML in Canvas.',
    descEn:
      'Emerging open-source UI component kits powered by HTML-in-Canvas alongside Modern Web Guidance & Awesome HTML in Canvas.',
    badge: 'UI Ecosystem',
  },
];

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({
  lang,
  capabilityReport,
}) => {
  const [copiedFlag, setCopiedFlag] = useState<boolean>(false);

  const handleCopyFlag = (): void => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(capabilityReport.chromeFlagUrl);
    }
    setCopiedFlag(true);
    window.setTimeout(() => setCopiedFlag(false), 2000);
  };

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left 6 Cols: Live Browser API Capability Matrix */}
        <div className="rounded-2xl border border-[#64748B] bg-[#0F172A] p-5 sm:p-7 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase text-[#38BDF8]">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              <span>LIVE BROWSER API PROBE</span>
            </div>
            <span className="rounded-full border border-[#64748B] bg-[#090D16] px-3 py-1 font-mono text-xs text-[#CBD5E1]">
              {capabilityReport.detectedBrowser}
            </span>
          </div>

          <h2
            id="ecosystem-heading"
            className="mt-2 font-display text-2xl font-bold text-[#F8FAFC]"
          >
            {lang === 'vi'
              ? 'Kiểm Tra Trực Tiếp Trình Duyệt & Cờ Thực Nghiệm'
              : 'Live Browser Capability Matrix & Chrome Flag'}
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[#CBD5E1] sm:text-sm">
            {lang === 'vi'
              ? 'Trang Lab này tích hợp Dual-Engine: tự động chạy Native API nếu Chrome đã bật cờ thực nghiệm, hoặc chạy High-Precision Simulation để bạn kiểm thử trên mọi thiết bị.'
              : 'This Lab runs a Dual-Engine architecture: executing Native Browser APIs when the Chrome flag is enabled, or High-Precision Simulation on any standard browser.'}
          </p>

          <div className="mt-4 space-y-2.5">
            {capabilityReport.features.map((feat) => (
              <div
                key={feat.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[#64748B]/70 bg-[#090D16] p-3"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-[#F8FAFC]">
                    {feat.name}
                  </div>
                  <p className="mt-0.5 text-xs text-[#CBD5E1]">
                    {lang === 'vi' ? feat.descriptionVi : feat.descriptionEn}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-bold ${
                    feat.supported
                      ? 'bg-[#34D399] text-[#090D16]'
                      : 'bg-[#38BDF8] text-[#090D16]'
                  }`}
                >
                  {feat.supported ? 'Native Active' : 'Simulated OK'}
                </span>
              </div>
            ))}
          </div>

          {/* Copy Chrome Flag Box */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#38BDF8] bg-[#1E293B] p-3">
            <div className="font-mono text-xs text-[#F8FAFC]">
              <span className="text-[#CBD5E1]">Chrome Flag: </span>
              <strong className="text-[#38BDF8]">{capabilityReport.chromeFlagUrl}</strong>
            </div>
            <button
              type="button"
              onClick={handleCopyFlag}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#38BDF8] px-3.5 py-2 font-mono text-xs font-bold text-[#090D16] hover:bg-[#7DD3FC]"
            >
              {copiedFlag ? (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>{lang === 'vi' ? 'Đã sao chép!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>{lang === 'vi' ? 'Copy Chrome Flag' : 'Copy Chrome Flag'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 6 Cols: Ecosystem & Framework Bento Grid */}
        <div className="rounded-2xl border border-[#64748B] bg-[#0F172A] p-5 sm:p-7 lg:col-span-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase text-[#C084FC]">
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span>
              {lang === 'vi'
                ? 'MỤC 4 • HỆ SINH THÁI & THƯ VIỆN ĐỒ HỌA'
                : 'SECTION 4 • ECOSYSTEM & ENGINE INTEGRATIONS'}
            </span>
          </div>

          <h3 className="mt-2 font-display text-2xl font-bold text-[#F8FAFC]">
            {lang === 'vi'
              ? 'Sẵn Sàng Cho Three.js, Babylon.js, PixiJS & PlayCanvas'
              : 'Ready for Three.js, Babylon.js, PixiJS & PlayCanvas'}
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {ECOSYSTEM_ITEMS.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-xl border border-[#64748B] bg-[#090D16] p-4"
              >
                <div>
                  <span className="inline-block rounded bg-[#1E293B] px-2 py-0.5 font-mono text-xs font-semibold text-[#38BDF8]">
                    {item.badge}
                  </span>
                  <h4 className="mt-2 font-display text-base font-bold text-[#F8FAFC]">
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#CBD5E1]">
                    {lang === 'vi' ? item.descVi : item.descEn}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-[#34D399]">
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Spec Reference Links */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="https://github.com/WICG/html-in-canvas"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[44px] items-center justify-between rounded-xl border border-[#64748B] bg-[#090D16] px-4 py-3 text-xs font-medium text-[#F8FAFC] hover:border-[#38BDF8]"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
                <span>WICG HTML-in-Canvas Specification</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-[#CBD5E1]" aria-hidden="true" />
            </a>

            <a
              href="https://developer.chrome.com/blog/html-in-canvas"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[44px] items-center justify-between rounded-xl border border-[#64748B] bg-[#090D16] px-4 py-3 text-xs font-medium text-[#F8FAFC] hover:border-[#38BDF8]"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C084FC]" aria-hidden="true" />
                <span>Chrome Developer Guidance &amp; Demos</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-[#CBD5E1]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
