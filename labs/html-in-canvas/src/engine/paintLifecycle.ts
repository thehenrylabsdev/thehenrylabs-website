export type CanvasContextKind = '2d' | 'webgl' | 'webgpu';

export interface PaintStepSpec {
  context: CanvasContextKind;
  titleVi: string;
  titleEn: string;
  apiMethod: string;
  allocationRequirementVi: string;
  allocationRequirementEn: string;
  codeExample: string;
}

export interface PaintCycleSimulationInput {
  triggerReason: 'text-edit' | 'css-hover' | 'layout-resize' | 'manual-paint-call';
  invalidatedIds: string[];
  mutateDomInsidePaintListener: boolean;
  maxCircuitBreakerFrames?: number;
}

export interface PaintFrameRecord {
  frameNumber: number;
  invalidatedElements: string[];
  domMutatedDuringPaint: boolean;
  scheduledNextFrameInvalidation: boolean;
}

export interface PaintCycleSimulationResult {
  triggerReason: PaintCycleSimulationInput['triggerReason'];
  framesExecuted: number;
  infiniteLoopDetected: boolean;
  circuitBreakerTripped: boolean;
  frameLog: PaintFrameRecord[];
  explanationVi: string;
  explanationEn: string;
}

export interface NestedCanvasNode {
  id: string;
  label: string;
  depth: number;
  children?: NestedCanvasNode[];
}

export function getContextSpec(context: CanvasContextKind): PaintStepSpec {
  switch (context) {
    case '2d':
      return {
        context: '2d',
        titleVi: '2D Rendering Context (Tự động đồng bộ Hit-box)',
        titleEn: '2D Rendering Context (Auto Hit-Box Sync)',
        apiMethod: 'ctx.drawElementImage(element, x, y)',
        allocationRequirementVi:
          'Không cần cấp phát texture trước. Trình duyệt tự động liên kết tọa độ vẽ với hộp giới hạn tương tác và cây trợ năng.',
        allocationRequirementEn:
          'No texture pre-allocation needed. Browser automatically links draw coordinates with DOM hit-testing and accessibility bounds.',
        codeExample: `<canvas id="hero-canvas" content="drawable" width="800" height="450">
  <div id="ui-card" drawable class="card-root">
    <button id="cta-btn" drawable>Interactive Action</button>
  </div>
</canvas>

<script>
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  const card = document.getElementById('ui-card');

  canvas.addEventListener('paint', (event) => {
    // event.invalidated contains modified drawable paint roots
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawElementImage(card, 48, 48);
  });
</script>`,
      };
    case 'webgl':
      return {
        context: 'webgl',
        titleVi: 'WebGL / WebGL2 Context (Cấp phát Texture + Shader)',
        titleEn: 'WebGL / WebGL2 Context (Pre-allocated Texture + Shader)',
        apiMethod: 'gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, el)',
        allocationRequirementVi:
          'Cần cấp phát trước bộ nhớ texture (dựa theo kích thước tự nhiên của phần tử) bằng gl.texImage2D, sau đó cập nhật qua texElementSubImage2D.',
        allocationRequirementEn:
          'Pre-allocate texture storage matching element natural dimensions via gl.texImage2D, then stream pixels via texElementSubImage2D.',
        codeExample: `const gl = canvas.getContext('webgl2');
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// 1. Pre-allocate texture memory matching natural element size
gl.texImage2D(
  gl.TEXTURE_2D, 0, gl.RGBA,
  card.offsetWidth, card.offsetHeight, 0,
  gl.RGBA, gl.UNSIGNED_BYTE, null
);

// 2. Update snapshot on paint event
canvas.addEventListener('paint', (event) => {
  if (event.invalidated.includes(card)) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texElementSubImage2D(
      gl.TEXTURE_2D, 0, 0, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, card
    );
    renderWebGLScene();
  }
});`,
      };
    case 'webgpu':
      return {
        context: 'webgpu',
        titleVi: 'WebGPU Context (Pipeline Đồ họa Thế hệ mới)',
        titleEn: 'WebGPU Context (Next-Gen Compute & Render Pipeline)',
        apiMethod: 'device.queue.drawElementImageToTexture({ source: el }, { texture }, extent)',
        allocationRequirementVi:
          'Cấp phát bộ đệm GPUTexture rỗng trước và gọi drawElementImageToTexture với nguồn là phần tử HTML và đích là texture vừa tạo.',
        allocationRequirementEn:
          'Allocate an empty GPUTexture buffer upfront and invoke drawElementImageToTexture from the HTML element to the target texture.',
        codeExample: `const uiTexture = device.createTexture({
  size: [card.offsetWidth, card.offsetHeight, 1],
  format: 'rgba8unorm',
  usage:
    GPUTextureUsage.TEXTURE_BINDING |
    GPUTextureUsage.COPY_DST |
    GPUTextureUsage.RENDER_ATTACHMENT,
});

canvas.addEventListener('paint', () => {
  device.queue.drawElementImageToTexture(
    { source: card },
    { texture: uiTexture },
    [card.offsetWidth, card.offsetHeight]
  );
  encodeAndSubmitWebGPUPass();
});`,
      };
  }
}

/**
 * Simulates the HTML-in-Canvas paint event lifecycle, proving why mutating DOM
 * inside a paint listener causes a frame-by-frame infinite rendering loop.
 */
export function simulatePaintEventCycle(
  input: PaintCycleSimulationInput
): PaintCycleSimulationResult {
  const maxFrames = input.maxCircuitBreakerFrames ?? 60;
  const initialTargets =
    input.invalidatedIds.length > 0 ? input.invalidatedIds : ['#drawable-root'];
  const frameLog: PaintFrameRecord[] = [];

  if (!input.mutateDomInsidePaintListener) {
    frameLog.push({
      frameNumber: 1,
      invalidatedElements: [...initialTargets],
      domMutatedDuringPaint: false,
      scheduledNextFrameInvalidation: false,
    });

    return {
      triggerReason: input.triggerReason,
      framesExecuted: 1,
      infiniteLoopDetected: false,
      circuitBreakerTripped: false,
      frameLog,
      explanationVi:
        'Chuẩn xác: Sự kiện paint chỉ chạy 1 lần duy nhất cho các phần tử bị invalidated, chụp snapshot mới lên Canvas và hoàn tất ở Frame #1.',
      explanationEn:
        'Optimal: The paint event fired once for invalidated elements, updated the Canvas snapshot cleanly, and settled at Frame #1.',
    };
  }

  for (let frame = 1; frame <= maxFrames; frame += 1) {
    frameLog.push({
      frameNumber: frame,
      invalidatedElements: [...initialTargets],
      domMutatedDuringPaint: true,
      scheduledNextFrameInvalidation: true,
    });
  }

  return {
    triggerReason: input.triggerReason,
    framesExecuted: maxFrames,
    infiniteLoopDetected: true,
    circuitBreakerTripped: true,
    frameLog,
    explanationVi: `CẢNH BÁO VÒNG LẶP VÔ TẬN: Việc thay đổi DOM bên trong paint listener khiến trình duyệt đánh dấu phần tử bị invalidated ở frame kế tiếp (Frame N+1), kích hoạt lại sự kiện paint liên tục! Hệ thống đã tự động ngắt ở Frame #${maxFrames}.`,
    explanationEn: `INFINITE RENDER LOOP DETECTED: Mutating DOM inside the paint listener marks the element dirty for Frame N+1, re-triggering paint endlessly! Circuit breaker halted execution at Frame #${maxFrames}.`,
  };
}

/**
 * For nested canvases, paint events fire in reverse (bottom-up: deepest child canvas first,
 * parent canvas last) so parent snapshots always contain up-to-date child renderings.
 */
export function resolveNestedCanvasPaintOrder(root: NestedCanvasNode): string[] {
  const order: string[] = [];

  function traversePostOrder(node: NestedCanvasNode): void {
    if (node.children) {
      for (const child of node.children) {
        traversePostOrder(child);
      }
    }
    order.push(node.id);
  }

  traversePostOrder(root);
  return order;
}
