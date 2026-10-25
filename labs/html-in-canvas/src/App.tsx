import React, { useMemo, useState } from 'react';
import {
  Activity,
  Cpu,
  Globe,
  Layers,
  Rotate3d,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { detectHtmlInCanvasCapabilities } from './engine/capabilityDetector';
import { HeroShaderLab } from './components/HeroShaderLab';
import { ArenaBenchmarkLab } from './components/ArenaBenchmarkLab';
import { PipelinePaintLab } from './components/PipelinePaintLab';
import { GeometrySyncLab } from './components/GeometrySyncLab';
import { EcosystemSection } from './components/EcosystemSection';

export const App: React.FC = () => {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const capabilityReport = useMemo(() => detectHtmlInCanvasCapabilities(), []);

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] lab-grid-bg">
      {/* Top Sticky Engineering Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#64748B]/60 bg-[#090D16]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="flex min-h-[44px] shrink-0 items-center gap-2.5 font-display text-base font-bold text-[#F8FAFC]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#38BDF8] text-[#090D16]">
              <Layers className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <span className="block leading-none">THEHENRYLABS</span>
              <span className="font-mono text-[11px] font-normal text-[#38BDF8]">
                HTML-in-Canvas Lab
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav
            aria-label={lang === 'vi' ? 'Điều hướng chính' : 'Primary Navigation'}
            className="hidden items-center gap-0.5 lg:flex"
          >
            <a
              href="#arena-benchmark"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
            >
              <Activity className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
              <span>{lang === 'vi' ? '1. Đấu Trường' : '1. 4-Way Arena'}</span>
            </a>
            <a
              href="#pipeline-lab"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
            >
              <Terminal className="h-3.5 w-3.5 text-[#C084FC]" aria-hidden="true" />
              <span>{lang === 'vi' ? '2. Pipeline & Paint' : '2. 3-Step Pipeline'}</span>
            </a>
            <a
              href="#geometry-lab"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
            >
              <Rotate3d className="h-3.5 w-3.5 text-[#34D399]" aria-hidden="true" />
              <span>{lang === 'vi' ? '3. Hình Học 3D' : '3. 3D Geometry'}</span>
            </a>
            <a
              href="#ecosystem"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
            >
              <Cpu className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
              <span>{lang === 'vi' ? '4. Hệ Sinh Thái' : '4. Ecosystem'}</span>
            </a>
          </nav>

          {/* Engine Badge & Language Switcher */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#64748B] bg-[#0F172A] px-3 py-1.5 font-mono text-xs text-[#34D399] xl:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {capabilityReport.isNativeSupported
                  ? 'Engine: Native Chrome API'
                  : 'Engine: High-Precision Sim'}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'vi' ? 'en' : 'vi'))}
              aria-label={
                lang === 'vi' ? 'Chuyển sang Tiếng Anh' : 'Switch language to Vietnamese'
              }
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#64748B] bg-[#1E293B] px-3.5 py-2 font-mono text-xs font-bold text-[#F8FAFC] hover:border-[#38BDF8]"
            >
              <Globe className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
              <span>{lang === 'vi' ? 'VI / EN' : 'EN / VI'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top">
        <HeroShaderLab lang={lang} />
        <ArenaBenchmarkLab lang={lang} />
        <PipelinePaintLab lang={lang} />
        <GeometrySyncLab lang={lang} />
        <EcosystemSection lang={lang} capabilityReport={capabilityReport} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#64748B]/50 bg-[#0F172A] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-[#CBD5E1] sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-mono">
            <Layers className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
            <span>
              TheHenryLabs • HTML-in-Canvas Empirical Research &amp; Interactive Performance Lab
            </span>
          </div>
          <div className="font-mono text-[#CBD5E1]">
            {lang === 'vi'
              ? 'Triển khai trên Cloudflare Pages • WCAG 2.2 AA Verified'
              : 'Deployed on Cloudflare Pages • WCAG 2.2 AA Verified'}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
