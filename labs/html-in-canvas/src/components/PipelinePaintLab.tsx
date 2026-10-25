import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Code2,
  GitBranch,
  Layers,
  Play,
  ShieldAlert,
} from 'lucide-react';
import {
  type CanvasContextKind,
  getContextSpec,
  resolveNestedCanvasPaintOrder,
  simulatePaintEventCycle,
} from '../engine/paintLifecycle';

interface PipelinePaintLabProps {
  lang: 'vi' | 'en';
}

const NESTED_CANVAS_TREE = {
  id: 'parent-scene-canvas',
  label: 'Outer 3D Scene <canvas content="drawable">',
  depth: 0,
  children: [
    {
      id: 'hud-overlay-canvas',
      label: 'Child HUD <canvas content="drawable" drawable>',
      depth: 1,
      children: [
        {
          id: 'minimap-radar-canvas',
          label: 'Deepest Minimap <canvas content="drawable" drawable>',
          depth: 2,
        },
      ],
    },
    {
      id: 'dialog-box-canvas',
      label: 'Sibling Dialog <canvas content="drawable" drawable>',
      depth: 1,
    },
  ],
};

export const PipelinePaintLab: React.FC<PipelinePaintLabProps> = ({ lang }) => {
  const [activeContext, setActiveContext] = useState<CanvasContextKind>('2d');
  const [triggerReason, setTriggerReason] = useState<
    'text-edit' | 'css-hover' | 'layout-resize' | 'manual-paint-call'
  >('css-hover');
  const [mutateInPaintListener, setMutateInPaintListener] = useState<boolean>(false);

  const contextSpec = useMemo(() => getContextSpec(activeContext), [activeContext]);

  const simulation = useMemo(
    () =>
      simulatePaintEventCycle({
        triggerReason,
        invalidatedIds: ['#ui-card', '#cta-btn'],
        mutateDomInsidePaintListener: mutateInPaintListener,
        maxCircuitBreakerFrames: 60,
      }),
    [triggerReason, mutateInPaintListener]
  );

  const nestedOrder = useMemo(
    () => resolveNestedCanvasPaintOrder(NESTED_CANVAS_TREE),
    []
  );

  return (
    <section
      id="pipeline-lab"
      aria-labelledby="pipeline-heading"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-[#64748B] bg-[#0F172A] p-5 sm:p-8">
        {/* Header */}
        <div className="border-b border-[#64748B]/50 pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
            <Code2 className="h-4 w-4" aria-hidden="true" />
            <span>
              {lang === 'vi'
                ? 'PHÒNG THÍ NGHIỆM #2 • KIỂM CHỨNG LUẬN ĐIỂM 2 (QUY TRÌNH 3 BƯỚC & SỰ KIỆN PAINT)'
                : 'LAB #2 • EMPIRICAL VERIFICATION OF SECTION 2 (3-STEP PIPELINE & PAINT LIFECYCLE)'}
            </span>
          </div>
          <h2
            id="pipeline-heading"
            className="mt-2 font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl"
          >
            {lang === 'vi'
              ? 'Trình Phân Tích 3 Ngữ Cảnh Render & Vòng Đời Sự Kiện Paint'
              : '3-Context Rendering Inspector & Paint Event Lifecycle Simulator'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[#CBD5E1]">
            {lang === 'vi'
              ? 'Khám phá quy trình 3 bước thống nhất trên 2D, WebGL và WebGPU, kiểm tra danh sách phần tử bị vô hiệu hóa (event.invalidated), thứ tự vẽ ngược của Canvas lồng nhau và thử nghiệm lỗi vòng lặp render vô tận khi mutate DOM trong paint listener.'
              : 'Explore the unified 3-step pipeline across 2D, WebGL, and WebGPU, inspect event.invalidated paint roots, verify bottom-up nested canvas firing order, and test the infinite rendering loop circuit breaker.'}
          </p>
        </div>

        {/* Context Switcher: 2D vs WebGL vs WebGPU */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Rendering Context">
              {(['2d', 'webgl', 'webgpu'] as const).map((ctxKey) => {
                const isSelected = activeContext === ctxKey;
                return (
                  <button
                    key={ctxKey}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => setActiveContext(ctxKey)}
                    className={`min-h-[44px] rounded-lg border px-4 py-2 font-mono text-xs font-bold uppercase transition ${
                      isSelected
                        ? 'border-[#38BDF8] bg-[#38BDF8] text-[#090D16]'
                        : 'border-[#64748B] bg-[#090D16] text-[#F8FAFC] hover:border-[#38BDF8]'
                    }`}
                  >
                    {ctxKey === '2d'
                      ? '1. 2D Context'
                      : ctxKey === 'webgl'
                        ? '2. WebGL / WebGL2'
                        : '3. WebGPU'}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-[#64748B] bg-[#090D16] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                  {lang === 'vi' ? contextSpec.titleVi : contextSpec.titleEn}
                </h3>
                <span className="rounded bg-[#1E293B] px-2.5 py-1 font-mono text-xs text-[#38BDF8]">
                  Snapshot API
                </span>
              </div>
              <p className="mt-2 font-mono text-xs text-[#C084FC]">{contextSpec.apiMethod}</p>
              <p className="mt-2 text-xs leading-relaxed text-[#CBD5E1]">
                {lang === 'vi'
                  ? contextSpec.allocationRequirementVi
                  : contextSpec.allocationRequirementEn}
              </p>

              <pre className="mt-4 overflow-x-auto rounded-lg border border-[#64748B]/50 bg-[#0F172A] p-3.5 font-mono text-xs leading-relaxed text-[#F8FAFC]">
                <code>{contextSpec.codeExample}</code>
              </pre>
            </div>
          </div>

          {/* Right 6 Cols: Live Paint Event Simulator & Infinite Loop Trap */}
          <div className="space-y-4 lg:col-span-6">
            <div className="rounded-xl border border-[#64748B] bg-[#090D16] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#34D399]">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {lang === 'vi'
                      ? 'MÔ PHỎNG VÒNG ĐỜI SỰ KIỆN PAINT'
                      : 'PAINT EVENT LIFECYCLE SIMULATOR'}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#CBD5E1]">
                  Frames Executed: <strong>{simulation.framesExecuted}</strong>
                </span>
              </div>

              {/* Trigger Reason Selector */}
              <div className="mt-3">
                <span className="block font-mono text-xs text-[#CBD5E1]">
                  {lang === 'vi'
                    ? '1. Chọn tác nhân kích hoạt sự kiện paint:'
                    : '1. Select paint event trigger source:'}
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    [
                      { id: 'css-hover', labelVi: 'CSS :hover', labelEn: 'CSS :hover' },
                      { id: 'text-edit', labelVi: 'Sửa văn bản', labelEn: 'Text Edit' },
                      { id: 'layout-resize', labelVi: 'Đổi bố cục', labelEn: 'Layout Resize' },
                      {
                        id: 'manual-paint-call',
                        labelVi: 'Gọi canvas.paint()',
                        labelEn: 'canvas.paint()',
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTriggerReason(item.id)}
                      className={`min-h-[44px] rounded-lg border px-2.5 py-1.5 font-mono text-xs font-medium transition ${
                        triggerReason === item.id
                          ? 'border-[#38BDF8] bg-[#1E293B] text-[#38BDF8]'
                          : 'border-[#64748B] bg-[#0F172A] text-[#CBD5E1]'
                      }`}
                    >
                      <Play className="mr-1 inline h-3 w-3" aria-hidden="true" />
                      {lang === 'vi' ? item.labelVi : item.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anti-pattern Toggle: Mutate DOM inside paint listener */}
              <div className="mt-4 rounded-xl border border-[#64748B] bg-[#0F172A] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-display text-sm font-bold text-[#F8FAFC]">
                      {lang === 'vi'
                        ? '2. Thử nghiệm Cạm bẫy: Sửa DOM bên trong paint listener'
                        : '2. Test Anti-Pattern: Mutate DOM inside paint listener'}
                    </div>
                    <p className="text-xs text-[#CBD5E1]">
                      {lang === 'vi'
                        ? 'Kiểm chứng lý do bài viết cảnh báo tuyệt đối không mutate DOM trong hàm lắng nghe paint.'
                        : 'Empirically verify why mutating DOM inside the paint callback causes an infinite render loop.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMutateInPaintListener((v) => !v)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold transition ${
                      mutateInPaintListener
                        ? 'bg-[#F87171] text-[#090D16]'
                        : 'bg-[#34D399] text-[#090D16]'
                    }`}
                  >
                    {mutateInPaintListener ? (
                      <>
                        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {lang === 'vi'
                            ? 'ĐANG BẬT MUTATE DOM (LỖI VÒNG LẶP!)'
                            : 'DOM MUTATION ACTIVE (LOOP TRAP!)'}
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {lang === 'vi'
                            ? 'CHẾ ĐỘ AN TOÀN (Bấm để thử lỗi Loop)'
                            : 'SAFE MODE (Click to Trigger Loop Trap)'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Visual Frame Pulse Bars */}
                <div className="mt-3 flex h-12 items-end gap-1 overflow-hidden rounded-lg border border-[#64748B]/50 bg-[#090D16] p-2">
                  {simulation.frameLog.slice(0, 36).map((f) => (
                    <div
                      key={f.frameNumber}
                      title={`Frame #${f.frameNumber}: ${f.invalidatedElements.join(', ')}`}
                      className={`flex-1 rounded-t ${
                        simulation.infiniteLoopDetected ? 'bg-[#F87171]' : 'bg-[#34D399]'
                      }`}
                      style={{
                        height: simulation.infiniteLoopDetected ? '100%' : '85%',
                      }}
                    />
                  ))}
                </div>

                <div
                  className={`mt-3 flex items-start gap-2 rounded-lg p-2.5 text-xs ${
                    simulation.infiniteLoopDetected
                      ? 'border border-[#F87171] bg-[#090D16] text-[#F87171]'
                      : 'border border-[#34D399] bg-[#090D16] text-[#34D399]'
                  }`}
                >
                  {simulation.infiniteLoopDetected ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {lang === 'vi' ? simulation.explanationVi : simulation.explanationEn}
                  </span>
                </div>
              </div>

              {/* Nested Canvas Reverse Order Verification */}
              <div className="mt-4 rounded-xl border border-[#64748B] bg-[#0F172A] p-3.5">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#38BDF8]">
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {lang === 'vi'
                      ? 'THỨ TỰ KÍCH HOẠT PAINT VỚI CANVAS LỒNG NHAU (BOTTOM-UP)'
                      : 'NESTED CANVAS BOTTOM-UP PAINT EXECUTION ORDER'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#CBD5E1]">
                  {lang === 'vi'
                    ? 'Canvas con vẽ trước, Canvas cha vẽ sau để đảm bảo hình chụp của cha luôn chứa nội dung mới nhất của con:'
                    : 'Child canvases fire paint before parent canvases so parent snapshots always capture updated child pixels:'}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-xs">
                  {nestedOrder.map((nodeId, idx) => (
                    <React.Fragment key={nodeId}>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#38BDF8] bg-[#090D16] px-2.5 py-1 text-[#F8FAFC]">
                        <Layers className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                        <span>
                          #{idx + 1}: {nodeId}
                        </span>
                      </span>
                      {idx < nestedOrder.length - 1 && (
                        <span className="font-bold text-[#38BDF8]">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
