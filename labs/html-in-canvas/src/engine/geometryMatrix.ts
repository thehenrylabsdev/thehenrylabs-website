export interface Transform3DParams {
  rotateXDeg: number;
  rotateYDeg: number;
  rotateZDeg: number;
  scale: number;
  translateX: number;
  translateY: number;
}

export interface GeometrySyncReport {
  contextMode: '2d-auto' | '3d-shader';
  updateGeometryCalled: boolean;
  matrix16: readonly number[];
  cssMatrix3d: string;
  domMatrixCode: string;
  visualButtonCenter: { x: number; y: number };
  domHitboxCenter: { x: number; y: number };
  hitTestDriftPx: number;
  isHitAligned: boolean;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Computes a 4x4 3D transformation matrix (column-major, matching WebGL & DOMMatrix)
 * and evaluates hit-testing alignment between transformed GPU pixels and the DOM accessibility/pointer box.
 */
export function calculateGeometrySyncReport(
  params: Transform3DParams,
  contextMode: '2d-auto' | '3d-shader',
  updateGeometryCalled: boolean
): GeometrySyncReport {
  const rx = degToRad(params.rotateXDeg);
  const ry = degToRad(params.rotateYDeg);
  const rz = degToRad(params.rotateZDeg);
  const s = params.scale;

  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);

  // Combined rotation matrix R = Rz * Ry * Rx scaled by s
  const m11 = Number(((cosZ * cosY) * s).toFixed(4));
  const m12 = Number(((sinZ * cosY) * s).toFixed(4));
  const m13 = Number((-sinY * s).toFixed(4));
  const m14 = 0;

  const m21 = Number(((cosZ * sinY * sinX - sinZ * cosX) * s).toFixed(4));
  const m22 = Number(((sinZ * sinY * sinX + cosZ * cosX) * s).toFixed(4));
  const m23 = Number(((cosY * sinX) * s).toFixed(4));
  const m24 = 0;

  const m31 = Number(((cosZ * sinY * cosX + sinZ * sinX) * s).toFixed(4));
  const m32 = Number(((sinZ * sinY * cosX - cosZ * sinX) * s).toFixed(4));
  const m33 = Number(((cosY * cosX) * s).toFixed(4));
  const m34 = Number((-1 / 900).toFixed(5)); // Perspective foreshortening term

  const m41 = Number(params.translateX.toFixed(2));
  const m42 = Number(params.translateY.toFixed(2));
  const m43 = 0;
  const m44 = 1;

  const matrix16: readonly number[] = [
    m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44,
  ];

  // Reference button local offset from card center: (90, 45)
  const localX = 90;
  const localY = 45;

  const projectedX = localX * m11 + localY * m21 + m41;
  const projectedY = localX * m12 + localY * m22 + m42;

  const visualButtonCenter = {
    x: Number((240 + projectedX).toFixed(1)),
    y: Number((160 + projectedY).toFixed(1)),
  };

  // In 2D context, drawElementImage automatically syncs geometry.
  // In 3D context (WebGL/WebGPU), geometry only syncs if element.updateGeometry(domMatrix) is called!
  const effectivelySynced = contextMode === '2d-auto' || updateGeometryCalled;

  const domHitboxCenter = effectivelySynced
    ? { ...visualButtonCenter }
    : { x: 240 + localX, y: 160 + localY };

  const dx = visualButtonCenter.x - domHitboxCenter.x;
  const dy = visualButtonCenter.y - domHitboxCenter.y;
  const hitTestDriftPx = effectivelySynced ? 0 : Number(Math.hypot(dx, dy).toFixed(1));
  const isHitAligned = hitTestDriftPx <= 2.0;

  const cssMatrix3d = `matrix3d(${matrix16.join(', ')})`;

  const domMatrixCode =
    contextMode === '2d-auto'
      ? `// 2D Context: Trình duyệt tự động đồng bộ Hit-box & Focus Ring
ctx.drawElementImage(interactiveCard, ${240 + m41}, ${160 + m42});`
      : `// 3D Context (WebGL / WebGPU): Đồng bộ qua DOMMatrix
const matrix = new DOMMatrix([
  ${m11}, ${m12}, ${m13}, ${m14},
  ${m21}, ${m22}, ${m23}, ${m24},
  ${m31}, ${m32}, ${m33}, ${m34},
  ${m41}, ${m42}, ${m43}, ${m44}
]);
${updateGeometryCalled ? 'interactiveCard.updateGeometry(matrix); // Hit-test khớp 100%' : '// CHƯA GỌI updateGeometry(matrix) -> Lệch vùng click ' + hitTestDriftPx + 'px!'}`;

  return {
    contextMode,
    updateGeometryCalled,
    matrix16,
    cssMatrix3d,
    domMatrixCode,
    visualButtonCenter,
    domHitboxCenter,
    hitTestDriftPx,
    isHitAligned,
  };
}
