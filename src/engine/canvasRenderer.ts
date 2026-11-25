import type { FingerName, Point3D } from '../data/types';
import { FINGER_LANDMARK_INDICES, HAND_CONNECTIONS } from './poseSynthesizer';

export interface RenderStageOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  video?: HTMLVideoElement | null;
  cameraActive: boolean;
  mirror: boolean;
  showGhost: boolean;
  ghostPrimary?: Point3D[];
  ghostSecondary?: Point3D[];
  trailPoints?: Array<[number, number]>;
  currentTrailAnchor?: [number, number];
  userHands: Point3D[][];
  userBreadcrumbTrail?: Array<[number, number]>;
  fingerStatus?: Record<FingerName, 'match' | 'adjust'>;
  holdProgress: number; // 0..1
  matched: boolean;
}

const FINGERTIPS = new Set([4, 8, 12, 16, 20]);

function getFingerForLandmark(idx: number): FingerName | null {
  for (const [finger, indices] of Object.entries(FINGER_LANDMARK_INDICES) as Array<
    [FingerName, [number, number, number, number]]
  >) {
    if (indices.includes(idx)) return finger;
  }
  return null;
}

function drawStudioBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#132234');
  grad.addColorStop(1, '#0c1622');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle calibration grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const step = Math.max(36, Math.round(width / 14));
  for (let x = step; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = step; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Framing reticle for signing chest/chin zone
  ctx.strokeStyle = 'rgba(224, 142, 27, 0.16)';
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(width * 0.22, height * 0.18, width * 0.56, height * 0.66);
  ctx.setLineDash([]);
}

function drawMotionTrail(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  trailPoints: Array<[number, number]>,
  currentAnchor?: [number, number]
): void {
  if (trailPoints.length < 2) return;

  ctx.save();
  // Soft glow path
  ctx.beginPath();
  trailPoints.forEach(([nx, ny], idx) => {
    const px = nx * width;
    const py = ny * height;
    if (idx === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.strokeStyle = 'rgba(224, 142, 27, 0.35)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Crisp dashed inner path
  ctx.beginPath();
  trailPoints.forEach(([nx, ny], idx) => {
    const px = nx * width;
    const py = ny * height;
    if (idx === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.strokeStyle = '#E08E1B';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Directional arrowhead at midpoint and end
  const arrowIndices = [Math.floor(trailPoints.length * 0.5), trailPoints.length - 1];
  for (const idx of arrowIndices) {
    if (idx <= 0 || idx >= trailPoints.length) continue;
    const [x1, y1] = [trailPoints[idx - 1][0] * width, trailPoints[idx - 1][1] * height];
    const [x2, y2] = [trailPoints[idx][0] * width, trailPoints[idx][1] * height];
    if (Math.hypot(x2 - x1, y2 - y1) < 3) continue;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const size = 9;
    ctx.fillStyle = '#F6B64D';
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - size * Math.cos(ang - 0.5), y2 - size * Math.sin(ang - 0.5));
    ctx.lineTo(x2 - size * Math.cos(ang + 0.5), y2 - size * Math.sin(ang + 0.5));
    ctx.closePath();
    ctx.fill();
  }

  // Animated target bead
  if (currentAnchor) {
    const cx = currentAnchor[0] * width;
    const cy = currentAnchor[1] * height;
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(224, 142, 27, 0.28)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#F7B94B';
    ctx.fill();
  }
  ctx.restore();
}

function drawGhostHand(ctx: CanvasRenderingContext2D, width: number, height: number, landmarks: Point3D[]): void {
  if (landmarks.length < 21) return;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer translucent bone stroke
  ctx.strokeStyle = 'rgba(247, 198, 114, 0.48)';
  ctx.lineWidth = 7;
  for (const [a, b] of HAND_CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height);
    ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height);
    ctx.stroke();
  }

  // Inner bright guide line
  ctx.strokeStyle = 'rgba(255, 241, 214, 0.72)';
  ctx.lineWidth = 2.2;
  for (const [a, b] of HAND_CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height);
    ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height);
    ctx.stroke();
  }

  // Joints & fingertips
  for (let i = 0; i < landmarks.length; i += 1) {
    const x = landmarks[i].x * width;
    const y = landmarks[i].y * height;
    const isTip = FINGERTIPS.has(i);
    ctx.beginPath();
    ctx.arc(x, y, isTip ? 5.5 : 3.2, 0, Math.PI * 2);
    ctx.fillStyle = isTip ? '#F5A623' : 'rgba(255, 246, 229, 0.85)';
    ctx.fill();
  }
  ctx.restore();
}

function drawUserHand(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  landmarks: Point3D[],
  fingerStatus?: Record<FingerName, 'match' | 'adjust'>,
  matched?: boolean
): void {
  if (landmarks.length < 21) return;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const [a, b] of HAND_CONNECTIONS) {
    const finger = getFingerForLandmark(b) ?? getFingerForLandmark(a);
    const needsAdjust = finger && fingerStatus && fingerStatus[finger] === 'adjust' && !matched;
    ctx.strokeStyle = needsAdjust ? 'rgba(235, 112, 92, 0.92)' : 'rgba(30, 158, 107, 0.95)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height);
    ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height);
    ctx.stroke();
  }

  for (let i = 0; i < landmarks.length; i += 1) {
    const finger = getFingerForLandmark(i);
    const needsAdjust = finger && fingerStatus && fingerStatus[finger] === 'adjust' && !matched;
    const x = landmarks[i].x * width;
    const y = landmarks[i].y * height;
    ctx.beginPath();
    ctx.arc(x, y, FINGERTIPS.has(i) ? 5.5 : 3.8, 0, Math.PI * 2);
    ctx.fillStyle = needsAdjust ? '#FF7B67' : '#3DE09C';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0D1B2A';
    ctx.stroke();
  }
  ctx.restore();
}

function drawHoldRing(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number, matched: boolean): void {
  if (progress <= 0.02 && !matched) return;
  const cx = width - 44;
  const cy = height - 48;
  const radius = 20;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, progress));
  ctx.strokeStyle = matched ? '#3DE09C' : '#E08E1B';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

export function renderStageCanvas(opts: RenderStageOptions): void {
  const {
    ctx,
    width,
    height,
    video,
    cameraActive,
    mirror,
    showGhost,
    ghostPrimary,
    ghostSecondary,
    trailPoints,
    currentTrailAnchor,
    userHands,
    userBreadcrumbTrail,
    fingerStatus,
    holdProgress,
    matched
  } = opts;

  ctx.clearRect(0, 0, width, height);

  if (cameraActive && video && video.readyState >= 2) {
    ctx.save();
    // Cover-crop video cleanly onto canvas aspect ratio
    const vw = video.videoWidth || width;
    const vh = video.videoHeight || height;
    const videoRatio = vw / vh;
    const canvasRatio = width / height;
    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;
    if (videoRatio > canvasRatio) {
      drawW = height * videoRatio;
      offsetX = (width - drawW) * 0.5;
    } else {
      drawH = width / videoRatio;
      offsetY = (height - drawH) * 0.5;
    }

    if (mirror) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, offsetX, offsetY, drawW, drawH);
    ctx.restore();

    // Subtle edge vignette so amber/jade overlays stay legible in bright rooms
    ctx.fillStyle = 'rgba(10, 18, 28, 0.14)';
    ctx.fillRect(0, 0, width, height);
  } else {
    drawStudioBackdrop(ctx, width, height);
  }

  // Hand-follow motion trail
  if (showGhost && trailPoints && trailPoints.length >= 2) {
    drawMotionTrail(ctx, width, height, trailPoints, currentTrailAnchor);
  }

  // Ghost target hand(s)
  if (showGhost) {
    if (ghostSecondary) drawGhostHand(ctx, width, height, ghostSecondary);
    if (ghostPrimary) drawGhostHand(ctx, width, height, ghostPrimary);
  }

  // User live motion breadcrumb trail
  if (userBreadcrumbTrail && userBreadcrumbTrail.length >= 2) {
    ctx.save();
    for (let i = 1; i < userBreadcrumbTrail.length; i += 1) {
      const alpha = (i / userBreadcrumbTrail.length) * 0.7;
      ctx.strokeStyle = `rgba(61, 224, 156, ${alpha.toFixed(2)})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(userBreadcrumbTrail[i - 1][0] * width, userBreadcrumbTrail[i - 1][1] * height);
      ctx.lineTo(userBreadcrumbTrail[i][0] * width, userBreadcrumbTrail[i][1] * height);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Live tracked hand skeletons
  for (const hand of userHands) {
    drawUserHand(ctx, width, height, hand, fingerStatus, matched);
  }

  if (cameraActive) {
    drawHoldRing(ctx, width, height, holdProgress, matched);
  }
}
