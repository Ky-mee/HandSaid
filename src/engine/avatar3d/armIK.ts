import type { Vec3 } from './types3d';

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function len(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

function normalize(v: Vec3): Vec3 {
  const m = len(v);
  if (m < 1e-6) return [0, -1, 0];
  return [v[0] / m, v[1] / m, v[2] / m];
}

/**
 * Analytical 2-bone Inverse Kinematics solver for upper arm + forearm.
 * Guarantees finite elbow and wrist coordinates even for near or over-extended targets.
 */
export function solveTwoBoneIK(
  shoulder: Vec3,
  target: Vec3,
  upperLen: number,
  lowerLen: number,
  poleHint: Vec3
): { elbow: Vec3; wrist: Vec3 } {
  const rawDelta = sub(target, shoulder);
  const rawDist = len(rawDelta);
  const dir = rawDist > 1e-6 ? scale(rawDelta, 1 / rawDist) : ([0, -1, 0] as Vec3);

  const minReach = Math.abs(upperLen - lowerLen) + 0.02;
  const maxReach = upperLen + lowerLen - 0.005;
  const d = Math.max(minReach, Math.min(maxReach, rawDist));

  const wrist: Vec3 = add(shoulder, scale(dir, d));

  // Law of cosines for shoulder angle
  const cosAlpha = Math.max(
    -1,
    Math.min(1, (upperLen * upperLen + d * d - lowerLen * lowerLen) / (2 * upperLen * d))
  );
  const sinAlpha = Math.sqrt(Math.max(0, 1 - cosAlpha * cosAlpha));

  // Build bend direction orthogonal to `dir` biased toward `poleHint`
  const toPole = sub(poleHint, shoulder);
  const proj = dot(toPole, dir);
  let bend = sub(toPole, scale(dir, proj));
  if (len(bend) < 1e-4) {
    // Deterministic fallback perpendicular vector if target aligns with poleHint
    const fallback: Vec3 = Math.abs(dir[1]) < 0.9 ? [0, -1, -0.5] : [0, 0, -1];
    const fProj = dot(fallback, dir);
    bend = sub(fallback, scale(dir, fProj));
  }
  const bendDir = normalize(bend);

  const along = upperLen * cosAlpha;
  const out = upperLen * sinAlpha;
  const elbow: Vec3 = add(add(shoulder, scale(dir, along)), scale(bendDir, out));

  return { elbow, wrist };
}
