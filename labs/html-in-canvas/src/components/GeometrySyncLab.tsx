import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Box,
  CheckCircle2,
  Crosshair,
  MousePointerClick,
  Rotate3d,
} from 'lucide-react';
import { calculateGeometrySyncReport } from '../engine/geometryMatrix';

interface GeometrySyncLabProps {
  lang: 'vi' | 'en';
}

export const GeometrySyncLab: React.FC<GeometrySyncLabProps> = ({ lang }) => {
  const [contextMode, setContextMode] = useState<'2d-auto' | '3d-shader'>('3d-shader');
  const [updateGeometryEnabled, setUpdateGeometryEnabled] = useState<boolean>(true);
  const [rotateXDeg, setRotateXDeg] = useState<number>(24);
  const [rotateYDeg, setRotateYDeg] = useState<number>(-28);
  const [rotateZDeg, setRotateZDeg] = useState<number>(8);
  const [translateX, setTranslateX] = useState<number>(18);
  const [hitSuccessCount, setHitSuccessCount] = useState<number>(0);
  const [hitMissCount, setHitMissCount] = useState<number>(0);

  const report = useMemo(
    () =>
      calculateGeometrySyncReport(
        {
          rotateXDeg: contextMode === '2d-auto' ? 0 : rotateXDeg,
          rotateYDeg: contextMode === '2d-auto' ? 0 : rotateYDeg,
          rotateZDeg,
          scale: 1,
          translateX,
          translateY: 0,
        },
        contextMode,
        updateGeometryEnabled
      ),
    [contextMode, updateGeometryEnabled, rotateXDeg, rotateYDeg, rotateZDeg, translateX]
  );

  const handle3DButtonAttempt = (): void => {
    if (report.isHitAligned) {
      setHitSuccessCount((c) => c + 1);
    } else {
      setHitMissCount((c) => c + 1);
    }
  };

  return (
    <section
      id="geometry-lab"
      aria-labelledby="geometry-heading"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-[#64748B] bg-[#0F172A] p-5 sm:p-8">
        {/* Header */}
        <div className="border-b border-[#64748B]/50 pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#34D399]">
            <Rotate3d className="h-4 w-4" aria-hidden="true" />
            <span>
              {lang === 'vi'
                ? 'PHÒNG THÍ NGHIỆM #3 • KIỂM CHỨNG LUẬN ĐIỂM 3 (ĐỒNG BỘ HÓA HÌNH HỌC 3D)'
                : 'LAB #3 • EMPIRICAL VERIFICATION OF SECTION 3 (GEOMETRY SYNCHRONIZATION)'}
            </span>
          </div>
          <h2
            id="geometry-heading"
            className="mt-2 font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl"
          >
            {lang === 'vi'
              ? 'Đồng Bộ Hóa Ma Trận Tương Tác 3D (updateGeometry & DOMMatrix)'
              : '3D Hit-Test & Focus Ring Synchronization (updateGeometry & DOMMatrix)'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[#CBD5E1]">
            {lang === 'vi'
              ? 'Trong 2D Context, trình duyệt tự động liên kết tọa độ drawElementImage với hộp giới hạn DOM. Nhưng trong 3D Context (WebGL / WebGPU), các pixel bị biến đổi qua Vertex Shader nên nhà phát triển cần truyền DOMMatrix vào updateGeometry() để con trỏ chuột và Screen Reader Focus Ring khớp chính xác.'
              : 'In 2D Context, drawElementImage auto-links coordinates with the DOM bounding box. In 3D Contexts (WebGL / WebGPU), pixels are warped by Vertex Shaders—requiring developers to pass a 4x4 DOMMatrix into updateGeometry() so pointer events and focus rings align.'}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 Cols: 3D Interactive Stage */}
          <div className="space-y-4 lg:col-span-7">
            {/* Mode & updateGeometry Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#64748B] bg-[#090D16] p-3.5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setContextMode('2d-auto')}
                  className={`min-h-[44px] rounded-lg px-3.5 py-2 font-mono text-xs font-bold transition ${
                    contextMode === '2d-auto'
                      ? 'bg-[#38BDF8] text-[#090D16]'
                      : 'border border-[#64748B] bg-[#0F172A] text-[#F8FAFC]'
                  }`}
                >
                  2D Context (Auto-Sync)
                </button>
                <button
                  type="button"
                  onClick={() => setContextMode('3d-shader')}
                  className={`min-h-[44px] rounded-lg px-3.5 py-2 font-mono text-xs font-bold transition ${
                    contextMode === '3d-shader'
                      ? 'bg-[#C084FC] text-[#090D16]'
                      : 'border border-[#64748B] bg-[#0F172A] text-[#F8FAFC]'
                  }`}
                >
                  3D WebGL / WebGPU Shader
                </button>
              </div>

              {contextMode === '3d-shader' && (
                <button
                  type="button"
                  onClick={() => setUpdateGeometryEnabled((v) => !v)}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold transition ${
                    updateGeometryEnabled
                      ? 'bg-[#34D399] text-[#090D16]'
                      : 'bg-[#F87171] text-[#090D16]'
                  }`}
                >
                  <Crosshair className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {updateGeometryEnabled
                      ? 'updateGeometry(matrix): ON'
                      : 'updateGeometry(matrix): OFF (Broken Hit-Box)'}
                  </span>
                </button>
              )}
            </div>

            {/* 3D Rotation Sliders */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#64748B] bg-[#090D16] p-4 sm:grid-cols-4">
              <div>
                <label htmlFor="rot-x" className="block font-mono text-xs text-[#CBD5E1]">
                  Rotate X ({contextMode === '2d-auto' ? 0 : rotateXDeg}°):
                </label>
                <input
                  id="rot-x"
                  type="range"
                  min={-45}
                  max={45}
                  disabled={contextMode === '2d-auto'}
                  value={rotateXDeg}
                  onChange={(e) => setRotateXDeg(Number(e.target.value))}
                  className="mt-2 min-h-[44px] w-full accent-[#38BDF8]"
                />
              </div>
              <div>
                <label htmlFor="rot-y" className="block font-mono text-xs text-[#CBD5E1]">
                  Rotate Y ({contextMode === '2d-auto' ? 0 : rotateYDeg}°):
                </label>
                <input
                  id="rot-y"
                  type="range"
                  min={-45}
                  max={45}
                  disabled={contextMode === '2d-auto'}
                  value={rotateYDeg}
                  onChange={(e) => setRotateYDeg(Number(e.target.value))}
                  className="mt-2 min-h-[44px] w-full accent-[#C084FC]"
                />
              </div>
              <div>
                <label htmlFor="rot-z" className="block font-mono text-xs text-[#CBD5E1]">
                  Rotate Z ({rotateZDeg}°):
                </label>
                <input
                  id="rot-z"
                  type="range"
                  min={-30}
                  max={30}
                  value={rotateZDeg}
                  onChange={(e) => setRotateZDeg(Number(e.target.value))}
                  className="mt-2 min-h-[44px] w-full accent-[#34D399]"
                />
              </div>
              <div>
                <label htmlFor="trans-x" className="block font-mono text-xs text-[#CBD5E1]">
                  Translate X ({translateX}px):
                </label>
                <input
                  id="trans-x"
                  type="range"
                  min={-60}
                  max={60}
                  value={translateX}
                  onChange={(e) => setTranslateX(Number(e.target.value))}
                  className="mt-2 min-h-[44px] w-full accent-[#38BDF8]"
                />
              </div>
            </div>

            {/* 3D Perspective Stage */}
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-[#64748B] bg-[#090D16] p-6">
              {/* Un-synced Ghost DOM Hit-Box when updateGeometry is OFF in 3D mode */}
              {!report.isHitAligned && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute z-20 flex h-44 w-72 flex-col justify-between rounded-xl border-2 border-dashed border-[#F87171] bg-[#F87171]/10 p-4"
                >
                  <span className="font-mono text-xs font-bold text-[#F87171]">
                    Un-synced DOM Hit-Box (Flat 2D Position)
                  </span>
                  <span className="font-mono text-xs text-[#F87171]">
                    Drift Error: {report.hitTestDriftPx}px!
                  </span>
                </div>
              )}

              {/* 3D Transformed Visual Card */}
              <div
                className={`relative z-10 w-72 rounded-xl border-2 p-4 transition-transform duration-150 ${
                  report.isHitAligned
                    ? 'border-[#34D399] bg-[#1E293B]/95'
                    : 'border-[#C084FC] bg-[#1E293B]/85'
                }`}
                style={{
                  transform:
                    contextMode === '2d-auto'
                      ? `translateX(${translateX}px) rotateZ(${rotateZDeg}deg)`
                      : `perspective(700px) translateX(${translateX}px) rotateX(${rotateXDeg}deg) rotateY(${rotateYDeg}deg) rotateZ(${rotateZDeg}deg)`,
                }}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#38BDF8]">3D Polygon Surface</span>
                  <span
                    className={
                      report.isHitAligned ? 'text-[#34D399]' : 'font-bold text-[#F87171]'
                    }
                  >
                    {report.isHitAligned ? 'Hit-Box Synced' : `Drift: ${report.hitTestDriftPx}px`}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#CBD5E1]">
                  {lang === 'vi'
                    ? 'Bấm thử vào nút bên dưới khi bật và tắt updateGeometry(DOMMatrix):'
                    : 'Click the button below with updateGeometry(DOMMatrix) toggled ON vs OFF:'}
                </p>

                <button
                  type="button"
                  onClick={handle3DButtonAttempt}
                  className={`mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-3 py-2 font-mono text-xs font-bold transition ${
                    report.isHitAligned
                      ? 'bg-[#34D399] text-[#090D16] hover:bg-[#6EE7B7]'
                      : 'bg-[#F87171] text-[#090D16]'
                  }`}
                >
                  <MousePointerClick className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {report.isHitAligned
                      ? lang === 'vi'
                        ? `Click Khớp 3D! (Thành công: ${hitSuccessCount})`
                        : `3D Hit Aligned! (Hits: ${hitSuccessCount})`
                      : lang === 'vi'
                        ? `Lệch Vùng Click ${report.hitTestDriftPx}px! (Trượt: ${hitMissCount})`
                        : `Misaligned by ${report.hitTestDriftPx}px! (Misses: ${hitMissCount})`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: 4x4 DOMMatrix Inspector & Code Output */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-xl border border-[#64748B] bg-[#090D16] p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#38BDF8]">
                  <Box className="h-4 w-4" aria-hidden="true" />
                  <span>LIVE 4×4 DOMMATRIX TELEMETRY</span>
                </span>
                <span className="font-mono text-xs text-[#CBD5E1]">
                  Drift: <strong>{report.hitTestDriftPx} px</strong>
                </span>
              </div>

              {/* 4x4 Matrix Grid */}
              <div className="mt-3 grid grid-cols-4 gap-1.5 font-mono text-xs">
                {report.matrix16.map((val, idx) => (
                  <div
                    key={idx}
                    className="rounded border border-[#64748B]/50 bg-[#0F172A] px-2 py-1.5 text-center text-[#F8FAFC]"
                  >
                    {val}
                  </div>
                ))}
              </div>

              <pre className="mt-4 overflow-x-auto rounded-lg border border-[#64748B]/50 bg-[#0F172A] p-3 font-mono text-xs leading-relaxed text-[#CBD5E1]">
                <code>{report.domMatrixCode}</code>
              </pre>

              <div
                className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-xs ${
                  report.isHitAligned
                    ? 'border border-[#34D399] bg-[#0F172A] text-[#34D399]'
                    : 'border border-[#F87171] bg-[#0F172A] text-[#F87171]'
                }`}
              >
                {report.isHitAligned ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {report.isHitAligned
                    ? lang === 'vi'
                      ? 'Trạng thái chuẩn: Hộp giới hạn tương tác và Focus Ring của Screen Reader khớp 100% với vị trí pixel trên bề mặt 3D.'
                      : 'Synchronized: Pointer hit-testing and Screen Reader Focus Rings match the 3D shader surface with 0.0px drift.'
                    : lang === 'vi'
                      ? 'Cảnh báo lệch hình học: Bề mặt 3D đã xoay qua Vertex Shader nhưng chưa gọi updateGeometry(DOMMatrix), khiến vùng nhận click bị lệch ' +
                        report.hitTestDriftPx +
                        'px!'
                      : 'Geometry Desync: The 3D mesh rotated via Vertex Shader without calling updateGeometry(DOMMatrix), causing a ' +
                        report.hitTestDriftPx +
                        'px hit-test error!'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
