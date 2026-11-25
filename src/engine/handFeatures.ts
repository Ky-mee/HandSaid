import type { FingerName, Point3D } from '../data/types';
import { FINGER_LANDMARK_INDICES } from './poseSynthesizer';

export interface HandFeatures {
  curls: Record<FingerName, number>;
  pinchDistances: Record<'index' | 'middle' | 'ring' | 'pinky', number>;
  indexMiddleSpread: number;
  indexMiddleCrossed: boolean;
  thumbAcross: boolean;
  handTiltDeg: number;
  wristPos: [number, number];
  palmCenter: [number, number];
  palmScale: number;
}

function dist3(a: Point3D, b: Point3D): number {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z - b.z) * 0.7);
}

function dist2(a: Point3D, b: Point3D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function angleBetween(a: Point3D, b: Point3D, c: Point3D): number {
  // Angle at vertex b between ba and bc in radians (pi = straight, 0 = folded)
  const v1x = a.x - b.x;
  const v1y = a.y - b.y;
  const v1z = (a.z - b.z) * 0.7;
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;
  const v2z = (c.z - b.z) * 0.7;
  const m1 = Math.hypot(v1x, v1y, v1z);
  const m2 = Math.hypot(v2x, v2y, v2z);
  if (m1 < 1e-6 || m2 < 1e-6) return Math.PI;
  const cos = clamp((v1x * v2x + v1y * v2y + v1z * v2z) / (m1 * m2), -1, 1);
  return Math.acos(cos);
}

function computeFingerCurl(landmarks: Point3D[], finger: FingerName, palmScale: number): number {
  const wrist = landmarks[0];
  const [i1, i2, i3, i4] = FINGER_LANDMARK_INDICES[finger];
  const p1 = landmarks[i1];
  const p2 = landmarks[i2];
  const p3 = landmarks[i3];
  const p4 = landmarks[i4];

  if (finger === 'thumb') {
    const ipAngle = angleBetween(p2, p3, p4);
    const mcpAngle = angleBetween(p1, p2, p3);
    const tipToPinkyMcp = dist3(p4, landmarks[17]) / palmScale;
    const tipToIndexMcp = dist3(p4, landmarks[5]) / palmScale;
    const angleCurl = clamp((Math.PI * 1.9 - (ipAngle + mcpAngle)) / 1.35, 0, 1);
    const foldCurl = clamp((1.25 - Math.min(tipToPinkyMcp * 1.05, tipToIndexMcp * 1.2)) / 0.85, 0, 1);
    return clamp(angleCurl * 0.5 + foldCurl * 0.5, 0, 1);
  }

  // Non-thumb finger: combine joint angles + tip-to-wrist vs mcp-to-wrist ratio
  const pipAngle = angleBetween(p1, p2, p3);
  const dipAngle = angleBetween(p2, p3, p4);
  const angleSum = pipAngle + dipAngle; // ~2*pi when straight, ~2.3..3.5 when curled
  const angleCurl = clamp((Math.PI * 1.92 - angleSum) / 2.25, 0, 1);

  const tipWrist = dist3(p4, wrist) / palmScale;
  const mcpWrist = dist3(p1, wrist) / palmScale;
  const ratio = tipWrist / Math.max(0.25, mcpWrist);
  // Straight finger ratio is ~1.8..2.2, curled finger ratio is ~0.55..1.05
  const ratioCurl = clamp((1.88 - ratio) / 1.12, 0, 1);

  return clamp(angleCurl * 0.45 + ratioCurl * 0.55, 0, 1);
}

export function extractHandFeatures(landmarks: Point3D[]): HandFeatures {
  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  const palmScale = Math.max(0.03, dist3(wrist, middleMcp));

  const curls: Record<FingerName, number> = {
    thumb: computeFingerCurl(landmarks, 'thumb', palmScale),
    index: computeFingerCurl(landmarks, 'index', palmScale),
    middle: computeFingerCurl(landmarks, 'middle', palmScale),
    ring: computeFingerCurl(landmarks, 'ring', palmScale),
    pinky: computeFingerCurl(landmarks, 'pinky', palmScale)
  };

  const thumbTip = landmarks[4];
  const pinchDistances = {
    index: dist3(thumbTip, landmarks[8]) / palmScale,
    middle: dist3(thumbTip, landmarks[12]) / palmScale,
    ring: dist3(thumbTip, landmarks[16]) / palmScale,
    pinky: dist3(thumbTip, landmarks[20]) / palmScale
  };

  const indexMiddleSpread = dist2(landmarks[8], landmarks[12]) / palmScale;

  // Check if index and middle fingers cross each other in screen X
  const mcpDx = landmarks[9].x - landmarks[5].x;
  const tipDx = landmarks[12].x - landmarks[8].x;
  const indexMiddleCrossed =
    curls.index < 0.35 &&
    curls.middle < 0.35 &&
    Math.abs(mcpDx) > 1e-4 &&
    (mcpDx * tipDx <= 0 || Math.abs(tipDx) < Math.abs(mcpDx) * 0.38);

  // Check if thumb lies inward across palm (near middle MCP / ring MCP)
  const thumbToMiddleMcp = dist2(thumbTip, middleMcp) / palmScale;
  const thumbToIndexMcp = dist2(thumbTip, landmarks[5]) / palmScale;
  const thumbAcross = Math.min(thumbToMiddleMcp, thumbToIndexMcp) < 0.68 || curls.thumb > 0.62;

  // Hand tilt in degrees: 0 = pointing straight up (-y), -90 = pointing left, +90 = pointing right, +-180 = down
  const dx = middleMcp.x - wrist.x;
  const dy = middleMcp.y - wrist.y;
  const handTiltDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;

  return {
    curls,
    pinchDistances,
    indexMiddleSpread,
    indexMiddleCrossed,
    thumbAcross,
    handTiltDeg,
    wristPos: [wrist.x, wrist.y],
    palmCenter: [middleMcp.x, middleMcp.y],
    palmScale
  };
}

/**
 * Translation- and scale-normalized 63-float vector for custom recorded sign matching.
 */
export function normalizeLandmarkVector(landmarks: Point3D[]): number[] {
  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  const scale = Math.max(0.02, Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y, middleMcp.z - wrist.z));
  const vec: number[] = new Array(landmarks.length * 3);
  for (let i = 0; i < landmarks.length; i += 1) {
    vec[i * 3] = (landmarks[i].x - wrist.x) / scale;
    vec[i * 3 + 1] = (landmarks[i].y - wrist.y) / scale;
    vec[i * 3 + 2] = (landmarks[i].z - wrist.z) / scale;
  }
  return vec;
}
