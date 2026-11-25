import type { FingerName, HandPoseSpec, Point3D, SignDefinition } from '../data/types';

export const HAND_CONNECTIONS: ReadonlyArray<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [5, 9],
  [9, 13],
  [13, 17]
];

export const FINGER_LANDMARK_INDICES: Record<FingerName, [number, number, number, number]> = {
  thumb: [1, 2, 3, 4],
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20]
};

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/**
 * Synthesize an anatomically proportioned 21-point 3D hand skeleton from a HandPoseSpec.
 * Coordinates are normalized in 0..1 screen space around `anchor` (wrist/palm center reference).
 */
export function synthesizeHandLandmarks(
  spec: HandPoseSpec,
  anchor: [number, number] = [0.5, 0.56],
  scale = 0.24,
  isLeftHand = false
): Point3D[] {
  const mirrorX = isLeftHand ? -1 : 1;
  const local: Point3D[] = new Array(21);

  // Wrist at local origin (0, 0, 0), fingers point upward (-y) before rotationZ
  local[0] = { x: 0, y: 0.42, z: 0 };

  const spreadIM = spec.spreads?.indexMiddle ?? 0.12;
  const spreadMR = spec.spreads?.middleRing ?? 0.1;
  const spreadRP = spec.spreads?.ringPinky ?? 0.1;
  const thumbSpread = spec.spreads?.thumb ?? 0.35;

  // MCP base positions relative to wrist
  const mcpX = {
    index: -0.22 - spreadIM * 0.08,
    middle: -0.02,
    ring: 0.17 + spreadMR * 0.08,
    pinky: 0.34 + (spreadMR + spreadRP) * 0.08
  };

  const mcpY = {
    index: -0.18,
    middle: -0.21,
    ring: -0.18,
    pinky: -0.12
  };

  const lengths: Record<Exclude<FingerName, 'thumb'>, [number, number, number]> = {
    index: [0.24, 0.17, 0.14],
    middle: [0.27, 0.19, 0.15],
    ring: [0.25, 0.17, 0.14],
    pinky: [0.2, 0.14, 0.12]
  };

  const splayAngles: Record<Exclude<FingerName, 'thumb'>, number> = {
    index: -0.18 * (spreadIM + 0.1),
    middle: 0.02 * (spreadIM - spreadMR),
    ring: 0.14 * (spreadMR + 0.1),
    pinky: 0.26 * (spreadRP + 0.15)
  };

  if (spec.crossIndexMiddle) {
    splayAngles.index = 0.09;
    splayAngles.middle = -0.14;
  }

  const fourFingers: Array<Exclude<FingerName, 'thumb'>> = ['index', 'middle', 'ring', 'pinky'];
  for (const name of fourFingers) {
    const curl = clamp(spec.curls[name], 0, 1);
    const [mcpIdx, pipIdx, dipIdx, tipIdx] = FINGER_LANDMARK_INDICES[name];
    const baseX = mcpX[name];
    const baseY = mcpY[name];
    const [l1, l2, l3] = lengths[name];

    local[mcpIdx] = { x: baseX, y: baseY, z: 0 };

    // As curl increases from 0..1, finger bends forward (+z toward palm/camera) then down (+y)
    // MCP flexion + PIP flexion + DIP flexion
    const a1 = curl * 1.45; // 0..~83 deg
    const a2 = a1 + curl * 1.45;
    const a3 = a2 + curl * 0.9;

    const splay = splayAngles[name];

    // Segment 1: MCP -> PIP
    const dx1 = Math.sin(splay) * l1 * Math.cos(a1 * 0.4);
    const dy1 = -Math.cos(a1) * l1;
    const dz1 = -Math.sin(a1) * l1 * 0.65;
    const pip = { x: baseX + dx1, y: baseY + dy1, z: dz1 };
    local[pipIdx] = pip;

    // Segment 2: PIP -> DIP
    const dx2 = Math.sin(splay) * l2 * 0.6;
    const dy2 = -Math.cos(a2) * l2;
    const dz2 = -Math.sin(a2) * l2 * 0.65;
    const dip = { x: pip.x + dx2, y: pip.y + dy2, z: pip.z + dz2 };
    local[dipIdx] = dip;

    // Segment 3: DIP -> TIP
    const dx3 = Math.sin(splay) * l3 * 0.35 + (spec.crossIndexMiddle && name === 'middle' ? -0.09 : 0);
    const dy3 = -Math.cos(a3) * l3;
    const dz3 = -Math.sin(a3) * l3 * 0.65 + (spec.crossIndexMiddle && name === 'middle' ? -0.05 : 0);
    local[tipIdx] = { x: dip.x + dx3, y: dip.y + dy3, z: dip.z + dz3 };
  }

  // Thumb synthesis (1..4)
  const thumbCurl = clamp(spec.curls.thumb, 0, 1);
  const cmc: Point3D = { x: -0.22, y: 0.25, z: -0.02 };
  local[1] = cmc;

  if (spec.thumbAcross) {
    // Thumb folds horizontally across palm/fingers
    const tuckOffset = (spec.thumbTuckIndex ?? 0) * 0.08;
    const mcp: Point3D = { x: -0.26, y: 0.1, z: -0.07 };
    const ip: Point3D = { x: -0.06 + tuckOffset * 0.4, y: 0.02, z: -0.14 };
    const tip: Point3D = {
      x: lerp(-0.08, 0.16 + tuckOffset, thumbCurl),
      y: lerp(-0.04, 0.04, thumbCurl),
      z: -0.17
    };
    local[2] = mcp;
    local[3] = ip;
    local[4] = tip;
  } else {
    const outAngle = 0.55 + thumbSpread * 0.7 - thumbCurl * 0.45;
    const flex = thumbCurl * 1.1;
    const mcp: Point3D = {
      x: cmc.x - Math.sin(outAngle) * 0.18,
      y: cmc.y - Math.cos(outAngle) * 0.18,
      z: -0.04
    };
    const ip: Point3D = {
      x: mcp.x - Math.sin(outAngle - flex * 0.5) * 0.17,
      y: mcp.y - Math.cos(outAngle - flex * 0.5) * 0.17,
      z: mcp.z - Math.sin(flex) * 0.08
    };
    const tip: Point3D = {
      x: ip.x - Math.sin(outAngle - flex * 0.95) * 0.15,
      y: ip.y - Math.cos(outAngle - flex * 0.95) * 0.15,
      z: ip.z - Math.sin(flex) * 0.09
    };
    local[2] = mcp;
    local[3] = ip;
    local[4] = tip;
  }

  // Pull thumb tip toward pinched fingertip when pinchTo is specified
  if (spec.pinchTo) {
    const targetTipIdx = FINGER_LANDMARK_INDICES[spec.pinchTo][3];
    const target = local[targetTipIdx];
    const mid: Point3D = {
      x: (local[4].x + target.x) * 0.5,
      y: (local[4].y + target.y) * 0.5,
      z: (local[4].z + target.z) * 0.5
    };
    local[4] = { ...mid };
    local[targetTipIdx] = { ...mid };
    local[3] = {
      x: lerp(local[2].x, mid.x, 0.55),
      y: lerp(local[2].y, mid.y, 0.55),
      z: lerp(local[2].z, mid.z, 0.55)
    };
  }

  // Apply Z rotation & left-hand mirroring, then translate to anchor
  const rad = ((spec.rotationZ ?? 0) * Math.PI) / 180;
  const cosR = Math.cos(rad);
  const sinR = Math.sin(rad);

  return local.map((pt) => {
    const mx = pt.x * mirrorX;
    const my = pt.y;
    const rx = mx * cosR - my * sinR;
    const ry = mx * sinR + my * cosR;
    return {
      x: anchor[0] + rx * scale,
      y: anchor[1] + ry * scale,
      z: pt.z * scale
    };
  });
}

export function interpolateLandmarks(a: Point3D[], b: Point3D[], alpha: number): Point3D[] {
  const t = clamp(alpha, 0, 1);
  return a.map((pt, i) => {
    const other = b[i] ?? pt;
    return {
      x: lerp(pt.x, other.x, t),
      y: lerp(pt.y, other.y, t),
      z: lerp(pt.z, other.z, t)
    };
  });
}

function interpolatePoseSpec(a: HandPoseSpec, b: HandPoseSpec, alpha: number): HandPoseSpec {
  const t = clamp(alpha, 0, 1);
  return {
    curls: {
      thumb: lerp(a.curls.thumb, b.curls.thumb, t),
      index: lerp(a.curls.index, b.curls.index, t),
      middle: lerp(a.curls.middle, b.curls.middle, t),
      ring: lerp(a.curls.ring, b.curls.ring, t),
      pinky: lerp(a.curls.pinky, b.curls.pinky, t)
    },
    spreads: {
      thumb: lerp(a.spreads?.thumb ?? 0.35, b.spreads?.thumb ?? 0.35, t),
      indexMiddle: lerp(a.spreads?.indexMiddle ?? 0.12, b.spreads?.indexMiddle ?? 0.12, t),
      middleRing: lerp(a.spreads?.middleRing ?? 0.1, b.spreads?.middleRing ?? 0.1, t),
      ringPinky: lerp(a.spreads?.ringPinky ?? 0.1, b.spreads?.ringPinky ?? 0.1, t)
    },
    thumbAcross: t < 0.5 ? a.thumbAcross : b.thumbAcross,
    thumbTuckIndex: t < 0.5 ? a.thumbTuckIndex : b.thumbTuckIndex,
    pinchTo: t < 0.5 ? a.pinchTo : b.pinchTo,
    crossIndexMiddle: t < 0.5 ? a.crossIndexMiddle : b.crossIndexMiddle,
    rotationZ: lerp(a.rotationZ ?? 0, b.rotationZ ?? 0, t)
  };
}

export interface SampledSignAnimation {
  primary: Point3D[];
  secondary?: Point3D[];
  trailPoints: Array<[number, number]>;
  currentAnchor: [number, number];
}

export function sampleSignAnimation(sign: SignDefinition, tRaw: number): SampledSignAnimation {
  const t = clamp(tRaw, 0, 1);

  // Studio-recorded sign playback
  if (sign.recordedFrames && sign.recordedFrames.length > 0) {
    const frames = sign.recordedFrames;
    const trailPoints: Array<[number, number]> = frames.map((f) => {
      const lm = f.landmarks[9] ?? f.landmarks[0];
      return [lm.x, lm.y];
    });

    if (frames.length === 1) {
      const lm = frames[0].landmarks[9] ?? frames[0].landmarks[0];
      return {
        primary: frames[0].landmarks,
        secondary: frames[0].secondLandmarks,
        trailPoints,
        currentAnchor: [lm.x, lm.y]
      };
    }

    const scaled = t * (frames.length - 1);
    const idx = Math.min(frames.length - 2, Math.floor(scaled));
    const localAlpha = easeInOut(scaled - idx);
    const primary = interpolateLandmarks(frames[idx].landmarks, frames[idx + 1].landmarks, localAlpha);
    const secondary =
      frames[idx].secondLandmarks && frames[idx + 1].secondLandmarks
        ? interpolateLandmarks(frames[idx].secondLandmarks!, frames[idx + 1].secondLandmarks!, localAlpha)
        : undefined;
    const center = primary[9] ?? primary[0];
    return {
      primary,
      secondary,
      trailPoints,
      currentAnchor: [center.x, center.y]
    };
  }

  // Built-in dynamic keyframes
  if (sign.motionKeyframes && sign.motionKeyframes.length > 0) {
    const kfs = sign.motionKeyframes;
    const trailPoints: Array<[number, number]> = [];
    const steps = 24;
    for (let i = 0; i <= steps; i += 1) {
      const st = i / steps;
      const seg = findKeyframePair(kfs, st);
      const ax = lerp(seg.a.anchor[0], seg.b.anchor[0], seg.alpha);
      const ay = lerp(seg.a.anchor[1], seg.b.anchor[1], seg.alpha);
      trailPoints.push([ax, ay]);
    }

    const seg = findKeyframePair(kfs, t);
    const anchor: [number, number] = [
      lerp(seg.a.anchor[0], seg.b.anchor[0], seg.alpha),
      lerp(seg.a.anchor[1], seg.b.anchor[1], seg.alpha)
    ];
    const pose = interpolatePoseSpec(seg.a.pose, seg.b.pose, seg.alpha);
    const primary = synthesizeHandLandmarks(pose, anchor, 0.24, false);

    let secondary: Point3D[] | undefined;
    if (seg.a.secondHand && seg.b.secondHand) {
      const secAnchor: [number, number] = [
        lerp(seg.a.secondHand.anchor[0], seg.b.secondHand.anchor[0], seg.alpha),
        lerp(seg.a.secondHand.anchor[1], seg.b.secondHand.anchor[1], seg.alpha)
      ];
      const secPose = interpolatePoseSpec(seg.a.secondHand.pose, seg.b.secondHand.pose, seg.alpha);
      secondary = synthesizeHandLandmarks(secPose, secAnchor, 0.24, true);
    }

    return {
      primary,
      secondary,
      trailPoints,
      currentAnchor: anchor
    };
  }

  // Built-in static pose
  const fallbackPose: HandPoseSpec = sign.poseSpec ?? {
    curls: { thumb: 0.1, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 }
  };
  const primaryAnchor: [number, number] = sign.hands === 2 ? [0.6, 0.54] : [0.5, 0.54];
  const primary = synthesizeHandLandmarks(fallbackPose, primaryAnchor, 0.25, false);
  const secondary =
    sign.hands === 2 && sign.secondHandPose
      ? synthesizeHandLandmarks(sign.secondHandPose, [0.4, 0.54], 0.25, true)
      : undefined;

  return {
    primary,
    secondary,
    trailPoints: [],
    currentAnchor: primaryAnchor
  };
}

function findKeyframePair<T extends { t: number }>(kfs: T[], t: number): { a: T; b: T; alpha: number } {
  if (kfs.length === 1) return { a: kfs[0], b: kfs[0], alpha: 0 };
  for (let i = 0; i < kfs.length - 1; i += 1) {
    if (t >= kfs[i].t && t <= kfs[i + 1].t) {
      const span = Math.max(1e-5, kfs[i + 1].t - kfs[i].t);
      return { a: kfs[i], b: kfs[i + 1], alpha: easeInOut((t - kfs[i].t) / span) };
    }
  }
  const last = kfs[kfs.length - 1];
  return { a: last, b: last, alpha: 0 };
}
