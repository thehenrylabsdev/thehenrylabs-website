export interface FeatureCheck {
  id: string;
  name: string;
  specMethod: string;
  supported: boolean;
  contextType: 'html' | '2d' | 'webgl' | 'webgpu' | 'geometry';
  descriptionVi: string;
  descriptionEn: string;
}

export interface CapabilityReport {
  isNativeSupported: boolean;
  engineMode: 'native' | 'simulation';
  chromeFlagUrl: string;
  cliFlag: string;
  features: FeatureCheck[];
  detectedBrowser: string;
}

export function detectHtmlInCanvasCapabilities(
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined
): CapabilityReport {
  let hasDrawableAttr = false;
  let hasDrawElementImage2D = false;
  let hasTexElementSubImage2D = false;
  let hasDrawElementImageToTexture = false;
  let hasUpdateGeometry = false;
  let detectedBrowser = 'SSR / Headless Environment';

  if (win && typeof document !== 'undefined') {
    const ua = win.navigator?.userAgent ?? '';
    if (ua.includes('Chrome/')) {
      const match = /Chrome\/([0-9.]+)/.exec(ua);
      detectedBrowser = match?.[1] ? `Google Chrome ${match[1]}` : 'Google Chrome';
    } else if (ua.includes('Firefox/')) {
      detectedBrowser = 'Mozilla Firefox';
    } else if (ua.includes('Safari/')) {
      detectedBrowser = 'Apple Safari';
    } else {
      detectedBrowser = 'Modern Web Browser';
    }

    const canvas = document.createElement('canvas');
    hasDrawableAttr = 'content' in canvas || 'layoutSubtree' in canvas;

    if (typeof CanvasRenderingContext2D !== 'undefined') {
      hasDrawElementImage2D =
        'drawElementImage' in CanvasRenderingContext2D.prototype ||
        'drawElement' in CanvasRenderingContext2D.prototype;
    }

    if (typeof WebGLRenderingContext !== 'undefined') {
      hasTexElementSubImage2D =
        'texElementSubImage2D' in WebGLRenderingContext.prototype ||
        'texElementImage2D' in WebGLRenderingContext.prototype;
    }

    const navWithGpu = win.navigator as Navigator & { gpu?: unknown };
    if (navWithGpu?.gpu && typeof win !== 'undefined') {
      const gpuQueueProto = (win as unknown as Record<string, { prototype?: object }>)['GPUQueue']
        ?.prototype;
      hasDrawElementImageToTexture = Boolean(
        gpuQueueProto && 'drawElementImageToTexture' in gpuQueueProto
      );
    }

    if (typeof Element !== 'undefined') {
      hasUpdateGeometry = 'updateGeometry' in Element.prototype;
    }
  }

  const isNativeSupported = hasDrawElementImage2D || hasTexElementSubImage2D;

  const features: FeatureCheck[] = [
    {
      id: 'content-drawable',
      name: '<canvas content="drawable">',
      specMethod: 'HTMLCanvasElement[content="drawable"] & [drawable]',
      supported: hasDrawableAttr,
      contextType: 'html',
      descriptionVi:
        'Báo cho trình duyệt tính toán layout, style và cây trợ năng cho các phần tử con bên trong thẻ <canvas>.',
      descriptionEn:
        'Instructs the browser to compute layout, styles, and accessibility tree for child elements inside <canvas>.',
    },
    {
      id: 'draw-element-image-2d',
      name: '2D drawElementImage()',
      specMethod: 'ctx.drawElementImage(element, x, y)',
      supported: hasDrawElementImage2D,
      contextType: '2d',
      descriptionVi:
        'Vẽ trực tiếp snapshot của phần tử DOM drawable vào ngữ cảnh Canvas 2D và tự động đồng bộ hộp giới hạn tương tác.',
      descriptionEn:
        'Paints a live DOM drawable subtree snapshot onto a 2D Canvas and auto-syncs the interactive bounding box.',
    },
    {
      id: 'tex-element-sub-image-2d',
      name: 'WebGL texElementSubImage2D()',
      specMethod: 'gl.texElementSubImage2D(target, level, xoffset, yoffset, format, type, element)',
      supported: hasTexElementSubImage2D,
      contextType: 'webgl',
      descriptionVi:
        'Nạp trực tiếp pixel của phần tử HTML vào bộ nhớ WebGL Texture đã cấp phát trước để áp dụng Vertex/Fragment Shader.',
      descriptionEn:
        'Uploads live HTML element pixels directly into a pre-allocated WebGL Texture for custom Vertex/Fragment Shaders.',
    },
    {
      id: 'draw-element-image-to-texture',
      name: 'WebGPU drawElementImageToTexture()',
      specMethod: 'queue.drawElementImageToTexture({ source: el }, { texture }, extent)',
      supported: hasDrawElementImageToTexture,
      contextType: 'webgpu',
      descriptionVi:
        'Đưa phần tử HTML trực tiếp vào GPUTexture trong pipeline đồ họa thế hệ mới WebGPU.',
      descriptionEn:
        'Copies an HTML drawable paint root directly into a GPUTexture within modern WebGPU pipelines.',
    },
    {
      id: 'update-geometry',
      name: '3D Geometry updateGeometry()',
      specMethod: 'element.updateGeometry(new DOMMatrix(...))',
      supported: hasUpdateGeometry,
      contextType: 'geometry',
      descriptionVi:
        'Đồng bộ ma trận biến đổi 3D (DOMMatrix) để con trỏ chuột, hover, click và vòng Focus Ring của Screen Reader khớp với bề mặt 3D.',
      descriptionEn:
        'Synchronizes a 4x4 DOMMatrix transform so pointer hit-testing, hover, click, and screen reader focus rings align with 3D surfaces.',
    },
  ];

  return {
    isNativeSupported,
    engineMode: isNativeSupported ? 'native' : 'simulation',
    chromeFlagUrl: 'chrome://flags/#canvas-draw-element',
    cliFlag: '--enable-blink-features=CanvasDrawElement',
    features,
    detectedBrowser,
  };
}
