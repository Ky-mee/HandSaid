import type { HandPoseSpec, Point3D, SignDefinition } from '../../data/types';
import { extractHandFeatures } from '../handFeatures';
import type { CharacterPose3D, FacialExpression3D, HandTarget3D, Vec3 } from './types3d';

const CHIN: Vec3 = [-0.01, 0.30, 0.20];
const MOUTH: Vec3 = [-0.01, 0.34, 0.21];
const CHEEK_RIGHT: Vec3 = [-0.09, 0.37, 0.17];
const EYE_RIGHT: Vec3 = [-0.06, 0.42, 0.21];
const FOREHEAD_RIGHT: Vec3 = [-0.08, 0.48, 0.19];
const CHEST: Vec3 = [0, 0.06, 0.21];
const NEUTRAL_RIGHT: Vec3 = [-0.16, 0.16, 0.31];
const REST_RIGHT: Vec3 = [-0.27, -0.22, 0.08];
const REST_LEFT: Vec3 = [0.27, -0.22, 0.08];

const OPEN_PALM: HandPoseSpec = {
  curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 },
  spreads: { thumb: 0.35, indexMiddle: 0.08, middleRing: 0.08, ringPinky: 0.08 }
};

const RELAXED_REST_POSE: HandPoseSpec = {
  curls: { thumb: 0.28, index: 0.26, middle: 0.3, ring: 0.34, pinky: 0.38 },
  spreads: { thumb: 0.25 }
};

const FLAT_O_POSE: HandPoseSpec = {
  curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 },
  pinchTo: 'index'
};

const C_CUP_POSE: HandPoseSpec = {
  curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 },
  spreads: { thumb: 0.55 }
};

const FIST_A_POSE: HandPoseSpec = {
  curls: { thumb: 0.72, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 },
  thumbAcross: true
};

const HOOK_X_POSE: HandPoseSpec = {
  curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 },
  thumbAcross: true
};

const H_POSE: HandPoseSpec = {
  curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.94, pinky: 0.94 },
  spreads: { indexMiddle: 0.04 },
  thumbAcross: true
};

interface Keyframe3D {
  t: number;
  rightPos: Vec3;
  rightRot: Vec3;
  rightPose: HandPoseSpec;
  leftPos?: Vec3;
  leftRot?: Vec3;
  leftPose?: HandPoseSpec;
  expression?: Partial<FacialExpression3D>;
}

interface Choreography3D {
  twoHands: boolean;
  baseExpression?: Partial<FacialExpression3D>;
  keyframes: Keyframe3D[];
}

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

function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function lerpPoseSpec(a: HandPoseSpec, b: HandPoseSpec, alpha: number): HandPoseSpec {
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
    rotationZ: lerp(a.rotationZ ?? 0, b.rotationZ ?? 0, t),
    palmFacing: t < 0.5 ? a.palmFacing : b.palmFacing
  };
}

function defaultExpression(overrides?: Partial<FacialExpression3D>): FacialExpression3D {
  return {
    smile: overrides?.smile ?? 0.25,
    browLift: overrides?.browLift ?? 0.05,
    headPitch: overrides?.headPitch ?? 0,
    headYaw: overrides?.headYaw ?? 0,
    headRoll: overrides?.headRoll ?? 0,
    mouthOpen: overrides?.mouthOpen ?? 0
  };
}

function mergeExpression(
  base: FacialExpression3D,
  a?: Partial<FacialExpression3D>,
  b?: Partial<FacialExpression3D>,
  alpha = 0
): FacialExpression3D {
  return {
    smile: lerp(a?.smile ?? base.smile, b?.smile ?? base.smile, alpha),
    browLift: lerp(a?.browLift ?? base.browLift, b?.browLift ?? base.browLift, alpha),
    headPitch: lerp(a?.headPitch ?? base.headPitch, b?.headPitch ?? base.headPitch, alpha),
    headYaw: lerp(a?.headYaw ?? base.headYaw, b?.headYaw ?? base.headYaw, alpha),
    headRoll: lerp(a?.headRoll ?? base.headRoll, b?.headRoll ?? base.headRoll, alpha),
    mouthOpen: lerp(a?.mouthOpen ?? base.mouthOpen, b?.mouthOpen ?? base.mouthOpen, alpha)
  };
}

// Explicit 3D body-anchored choreography for all 36 everyday signs (BIM + ASL)
const EVERYDAY_CHOREOGRAPHY: Record<string, Choreography3D> = {
  'bim-everyday-terima-kasih': {
    twoHands: false,
    baseExpression: { smile: 0.72, browLift: 0.15 },
    keyframes: [
      {
        t: 0,
        rightPos: [CHIN[0] - 0.01, CHIN[1] - 0.04, CHIN[2] + 0.04],
        rightRot: [-0.2, Math.PI * 0.92, 0.08],
        rightPose: OPEN_PALM,
        expression: { headPitch: -0.04 }
      },
      {
        t: 0.5,
        rightPos: [-0.03, 0.21, 0.34],
        rightRot: [-0.85, Math.PI * 0.92, 0.08],
        rightPose: OPEN_PALM,
        expression: { headPitch: 0.1 }
      },
      {
        t: 1,
        rightPos: [-0.04, 0.12, 0.43],
        rightRot: [-1.18, Math.PI * 0.92, 0.05],
        rightPose: OPEN_PALM,
        expression: { headPitch: 0.08 }
      }
    ]
  },
  'asl-everyday-thank-you': {
    twoHands: false,
    baseExpression: { smile: 0.72, browLift: 0.15 },
    keyframes: [
      {
        t: 0,
        rightPos: [CHIN[0] - 0.01, CHIN[1] - 0.04, CHIN[2] + 0.04],
        rightRot: [-0.2, Math.PI * 0.92, 0.08],
        rightPose: OPEN_PALM,
        expression: { headPitch: -0.04 }
      },
      {
        t: 1,
        rightPos: [-0.04, 0.12, 0.43],
        rightRot: [-1.18, Math.PI * 0.92, 0.05],
        rightPose: OPEN_PALM,
        expression: { headPitch: 0.08 }
      }
    ]
  },
  'asl-everyday-hello': {
    twoHands: false,
    baseExpression: { smile: 0.85, browLift: 0.3 },
    keyframes: [
      {
        t: 0,
        rightPos: [FOREHEAD_RIGHT[0] - 0.03, FOREHEAD_RIGHT[1] - 0.05, FOREHEAD_RIGHT[2] + 0.06],
        rightRot: [0.15, -0.25, -0.22],
        rightPose: OPEN_PALM,
        expression: { headRoll: 0.06 }
      },
      {
        t: 1,
        rightPos: [-0.27, 0.42, 0.36],
        rightRot: [0.22, -0.15, -0.35],
        rightPose: OPEN_PALM,
        expression: { headRoll: -0.03 }
      }
    ]
  },
  'bim-everyday-sama-sama': {
    twoHands: true,
    baseExpression: { smile: 0.65, browLift: 0.15 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.11, 0.10, 0.29],
        rightRot: [-1.15, 0.15, -0.15],
        rightPose: OPEN_PALM,
        leftPos: [0.11, 0.10, 0.29],
        leftRot: [-1.15, -0.15, 0.15],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [-0.24, 0.07, 0.41],
        rightRot: [-1.3, 0.35, -0.25],
        rightPose: OPEN_PALM,
        leftPos: [0.24, 0.07, 0.41],
        leftRot: [-1.3, -0.35, 0.25],
        leftPose: OPEN_PALM
      }
    ]
  },
  'bim-everyday-selamat-pagi': {
    twoHands: true,
    baseExpression: { smile: 0.85, browLift: 0.35 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.08, -0.02, 0.24],
        rightRot: [0, 0, 0],
        rightPose: OPEN_PALM,
        leftPos: [0.06, 0.08, 0.30],
        leftRot: [-1.42, 0.15, -1.35],
        leftPose: OPEN_PALM
      },
      {
        t: 0.5,
        rightPos: [-0.08, 0.14, 0.26],
        rightRot: [0, 0, 0],
        rightPose: OPEN_PALM,
        leftPos: [0.06, 0.08, 0.30],
        leftRot: [-1.42, 0.15, -1.35],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [-0.08, 0.28, 0.28],
        rightRot: [0, 0, 0.08],
        rightPose: OPEN_PALM,
        leftPos: [0.06, 0.08, 0.30],
        leftRot: [-1.42, 0.15, -1.35],
        leftPose: OPEN_PALM
      }
    ]
  },
  'bim-everyday-apa-khabar': {
    twoHands: true,
    baseExpression: { smile: 0.45, browLift: 0.72 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.17, 0.10, 0.32],
        rightRot: [-1.3, 0, 0.22],
        rightPose: OPEN_PALM,
        leftPos: [0.17, 0.10, 0.32],
        leftRot: [-1.3, 0, -0.22],
        leftPose: OPEN_PALM,
        expression: { headRoll: 0.06 }
      },
      {
        t: 0.5,
        rightPos: [-0.23, 0.12, 0.33],
        rightRot: [-1.3, 0, -0.24],
        rightPose: OPEN_PALM,
        leftPos: [0.23, 0.12, 0.33],
        leftRot: [-1.3, 0, 0.24],
        leftPose: OPEN_PALM,
        expression: { headRoll: -0.06 }
      },
      {
        t: 1,
        rightPos: [-0.17, 0.10, 0.32],
        rightRot: [-1.3, 0, 0.22],
        rightPose: OPEN_PALM,
        leftPos: [0.17, 0.10, 0.32],
        leftRot: [-1.3, 0, -0.22],
        leftPose: OPEN_PALM,
        expression: { headRoll: 0.06 }
      }
    ]
  },
  'bim-everyday-maaf': {
    twoHands: false,
    baseExpression: { smile: -0.35, browLift: -0.42 },
    keyframes: [
      { t: 0, rightPos: [0.0, 0.14, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 0.25, rightPos: [-0.07, 0.08, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 0.5, rightPos: [0.0, 0.02, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 0.75, rightPos: [0.07, 0.08, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 1, rightPos: [0.0, 0.14, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE }
    ]
  },
  'asl-everyday-sorry': {
    twoHands: false,
    baseExpression: { smile: -0.35, browLift: -0.42 },
    keyframes: [
      { t: 0, rightPos: [0.0, 0.14, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 0.25, rightPos: [-0.07, 0.08, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 0.5, rightPos: [0.0, 0.02, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 0.75, rightPos: [0.07, 0.08, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE },
      { t: 1, rightPos: [0.0, 0.14, 0.23], rightRot: [0, Math.PI, 0], rightPose: FIST_A_POSE }
    ]
  },
  'asl-everyday-please': {
    twoHands: false,
    baseExpression: { smile: 0.55, browLift: 0.2 },
    keyframes: [
      { t: 0, rightPos: [0.0, 0.13, 0.22], rightRot: [0, Math.PI, 0], rightPose: OPEN_PALM },
      { t: 0.25, rightPos: [-0.07, 0.07, 0.22], rightRot: [0, Math.PI, 0], rightPose: OPEN_PALM },
      { t: 0.5, rightPos: [0.0, 0.01, 0.22], rightRot: [0, Math.PI, 0], rightPose: OPEN_PALM },
      { t: 0.75, rightPos: [0.07, 0.07, 0.22], rightRot: [0, Math.PI, 0], rightPose: OPEN_PALM },
      { t: 1, rightPos: [0.0, 0.13, 0.22], rightRot: [0, Math.PI, 0], rightPose: OPEN_PALM }
    ]
  },
  'bim-everyday-tolong': {
    twoHands: true,
    baseExpression: { smile: 0.25, browLift: 0.45 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.01, 0.12, 0.29],
        rightRot: [0, Math.PI * 0.42, 0],
        rightPose: { curls: { thumb: 0.14, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.65 } },
        leftPos: [0.01, 0.04, 0.29],
        leftRot: [-1.42, 0, 0.35],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [-0.01, 0.28, 0.29],
        rightRot: [0, Math.PI * 0.42, 0],
        rightPose: { curls: { thumb: 0.14, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.65 } },
        leftPos: [0.01, 0.20, 0.29],
        leftRot: [-1.42, 0, 0.35],
        leftPose: OPEN_PALM
      }
    ]
  },
  'asl-everyday-help': {
    twoHands: true,
    baseExpression: { smile: 0.25, browLift: 0.45 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.01, 0.12, 0.29],
        rightRot: [0, Math.PI * 0.42, 0],
        rightPose: { curls: { thumb: 0.14, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.65 } },
        leftPos: [0.01, 0.04, 0.29],
        leftRot: [-1.42, 0, 0.35],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [-0.01, 0.28, 0.29],
        rightRot: [0, Math.PI * 0.42, 0],
        rightPose: { curls: { thumb: 0.14, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.65 } },
        leftPos: [0.01, 0.20, 0.29],
        leftRot: [-1.42, 0, 0.35],
        leftPose: OPEN_PALM
      }
    ]
  },
  'bim-everyday-ya': {
    twoHands: false,
    baseExpression: { smile: 0.55, browLift: 0.2 },
    keyframes: [
      { t: 0, rightPos: [-0.15, 0.21, 0.30], rightRot: [0.0, 0, 0], rightPose: FIST_A_POSE, expression: { headPitch: -0.05 } },
      { t: 0.5, rightPos: [-0.15, 0.13, 0.33], rightRot: [0.68, 0, 0], rightPose: FIST_A_POSE, expression: { headPitch: 0.15 } },
      { t: 1, rightPos: [-0.15, 0.21, 0.30], rightRot: [0.0, 0, 0], rightPose: FIST_A_POSE, expression: { headPitch: -0.05 } }
    ]
  },
  'asl-everyday-yes': {
    twoHands: false,
    baseExpression: { smile: 0.55, browLift: 0.2 },
    keyframes: [
      { t: 0, rightPos: [-0.15, 0.21, 0.30], rightRot: [0.0, 0, 0], rightPose: FIST_A_POSE, expression: { headPitch: -0.05 } },
      { t: 0.5, rightPos: [-0.15, 0.13, 0.33], rightRot: [0.68, 0, 0], rightPose: FIST_A_POSE, expression: { headPitch: 0.15 } },
      { t: 1, rightPos: [-0.15, 0.21, 0.30], rightRot: [0.0, 0, 0], rightPose: FIST_A_POSE, expression: { headPitch: -0.05 } }
    ]
  },
  'bim-everyday-tidak': {
    twoHands: false,
    baseExpression: { smile: -0.15, browLift: -0.2 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.21, 0.18, 0.31],
        rightRot: [0, 0, 0.22],
        rightPose: { curls: { thumb: 0.18, index: 0.1, middle: 0.1, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.5 } },
        expression: { headYaw: -0.14 }
      },
      {
        t: 0.5,
        rightPos: [-0.07, 0.18, 0.31],
        rightRot: [0, 0, -0.22],
        rightPose: { curls: { thumb: 0.18, index: 0.1, middle: 0.1, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.5 } },
        expression: { headYaw: 0.14 }
      },
      {
        t: 1,
        rightPos: [-0.21, 0.18, 0.31],
        rightRot: [0, 0, 0.22],
        rightPose: { curls: { thumb: 0.18, index: 0.1, middle: 0.1, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.5 } },
        expression: { headYaw: -0.14 }
      }
    ]
  },
  'asl-everyday-no': {
    twoHands: false,
    baseExpression: { smile: -0.15, browLift: -0.2 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.17, 0.20, 0.31],
        rightRot: [0.25, -0.45, 0],
        rightPose: { curls: { thumb: 0.2, index: 0.08, middle: 0.08, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.5 } },
        expression: { headYaw: -0.14 }
      },
      {
        t: 0.5,
        rightPos: [-0.10, 0.18, 0.33],
        rightRot: [0.35, -0.45, -0.15],
        rightPose: { curls: { thumb: 0.5, index: 0.6, middle: 0.6, ring: 0.94, pinky: 0.94 }, pinchTo: 'index' },
        expression: { headYaw: 0.14 }
      },
      {
        t: 1,
        rightPos: [-0.17, 0.20, 0.31],
        rightRot: [0.25, -0.45, 0],
        rightPose: { curls: { thumb: 0.2, index: 0.08, middle: 0.08, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.5 } },
        expression: { headYaw: -0.14 }
      }
    ]
  },
  'bim-everyday-saya': {
    twoHands: false,
    baseExpression: { smile: 0.35, browLift: 0.05 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.08, 0.10, 0.28],
        rightRot: [Math.PI * 0.48, -Math.PI * 0.18, -0.55],
        rightPose: { curls: { thumb: 0.72, index: 0.06, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
      },
      {
        t: 0.5,
        rightPos: [-0.05, 0.10, 0.24],
        rightRot: [Math.PI * 0.52, -Math.PI * 0.2, -0.55],
        rightPose: { curls: { thumb: 0.72, index: 0.06, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
      },
      {
        t: 1,
        rightPos: [-0.08, 0.10, 0.28],
        rightRot: [Math.PI * 0.48, -Math.PI * 0.18, -0.55],
        rightPose: { curls: { thumb: 0.72, index: 0.06, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
      }
    ]
  },
  'bim-everyday-awak': {
    twoHands: false,
    baseExpression: { smile: 0.4, browLift: 0.15 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.10, 0.16, 0.26],
        rightRot: [Math.PI * 0.42, 0.05, 0],
        rightPose: { curls: { thumb: 0.75, index: 0.08, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
      },
      {
        t: 1,
        rightPos: [-0.06, 0.17, 0.44],
        rightRot: [Math.PI * 0.50, 0, 0],
        rightPose: { curls: { thumb: 0.75, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
      }
    ]
  },
  'bim-everyday-nama': {
    twoHands: true,
    baseExpression: { smile: 0.35, browLift: 0.35 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.05, 0.19, 0.29],
        rightRot: [0.08, Math.PI * 0.78, Math.PI * 0.38],
        rightPose: H_POSE,
        leftPos: [0.05, 0.10, 0.29],
        leftRot: [0.08, -Math.PI * 0.78, -Math.PI * 0.38],
        leftPose: H_POSE
      },
      {
        t: 0.5,
        rightPos: [-0.02, 0.13, 0.29],
        rightRot: [0.08, Math.PI * 0.78, Math.PI * 0.38],
        rightPose: H_POSE,
        leftPos: [0.05, 0.10, 0.29],
        leftRot: [0.08, -Math.PI * 0.78, -Math.PI * 0.38],
        leftPose: H_POSE
      },
      {
        t: 1,
        rightPos: [-0.05, 0.19, 0.29],
        rightRot: [0.08, Math.PI * 0.78, Math.PI * 0.38],
        rightPose: H_POSE,
        leftPos: [0.05, 0.10, 0.29],
        leftRot: [0.08, -Math.PI * 0.78, -Math.PI * 0.38],
        leftPose: H_POSE
      }
    ]
  },
  'asl-everyday-name': {
    twoHands: true,
    baseExpression: { smile: 0.3, browLift: 0.4 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.05, 0.19, 0.29],
        rightRot: [0.08, Math.PI * 0.78, Math.PI * 0.38],
        rightPose: H_POSE,
        leftPos: [0.05, 0.10, 0.29],
        leftRot: [0.08, -Math.PI * 0.78, -Math.PI * 0.38],
        leftPose: H_POSE
      },
      {
        t: 0.5,
        rightPos: [-0.02, 0.13, 0.29],
        rightRot: [0.08, Math.PI * 0.78, Math.PI * 0.38],
        rightPose: H_POSE,
        leftPos: [0.05, 0.10, 0.29],
        leftRot: [0.08, -Math.PI * 0.78, -Math.PI * 0.38],
        leftPose: H_POSE
      },
      {
        t: 1,
        rightPos: [-0.05, 0.19, 0.29],
        rightRot: [0.08, Math.PI * 0.78, Math.PI * 0.38],
        rightPose: H_POSE,
        leftPos: [0.05, 0.10, 0.29],
        leftRot: [0.08, -Math.PI * 0.78, -Math.PI * 0.38],
        leftPose: H_POSE
      }
    ]
  },
  'bim-everyday-makan': {
    twoHands: false,
    baseExpression: { smile: 0.45, mouthOpen: 0.22 },
    keyframes: [
      { t: 0, rightPos: [-0.07, 0.19, 0.30], rightRot: [0.1, Math.PI * 0.85, 0], rightPose: FLAT_O_POSE },
      { t: 0.5, rightPos: [MOUTH[0] - 0.02, MOUTH[1] - 0.04, MOUTH[2] + 0.06], rightRot: [0.25, Math.PI * 0.9, 0], rightPose: FLAT_O_POSE, expression: { mouthOpen: 0.45 } },
      { t: 1, rightPos: [-0.07, 0.22, 0.28], rightRot: [0.1, Math.PI * 0.85, 0], rightPose: FLAT_O_POSE }
    ]
  },
  'asl-everyday-eat': {
    twoHands: false,
    baseExpression: { smile: 0.45, mouthOpen: 0.22 },
    keyframes: [
      { t: 0, rightPos: [-0.07, 0.19, 0.30], rightRot: [0.1, Math.PI * 0.85, 0], rightPose: FLAT_O_POSE },
      { t: 0.5, rightPos: [MOUTH[0] - 0.02, MOUTH[1] - 0.04, MOUTH[2] + 0.06], rightRot: [0.25, Math.PI * 0.9, 0], rightPose: FLAT_O_POSE, expression: { mouthOpen: 0.45 } },
      { t: 1, rightPos: [-0.07, 0.22, 0.28], rightRot: [0.1, Math.PI * 0.85, 0], rightPose: FLAT_O_POSE }
    ]
  },
  'bim-everyday-minum': {
    twoHands: false,
    baseExpression: { smile: 0.35, mouthOpen: 0.15 },
    keyframes: [
      { t: 0, rightPos: [-0.11, 0.16, 0.31], rightRot: [0, Math.PI * 0.42, 0], rightPose: C_CUP_POSE, expression: { headPitch: 0 } },
      { t: 1, rightPos: [MOUTH[0] - 0.04, MOUTH[1] - 0.03, MOUTH[2] + 0.08], rightRot: [-0.55, Math.PI * 0.42, -0.22], rightPose: C_CUP_POSE, expression: { headPitch: -0.14, mouthOpen: 0.35 } }
    ]
  },
  'asl-everyday-drink': {
    twoHands: false,
    baseExpression: { smile: 0.35, mouthOpen: 0.15 },
    keyframes: [
      { t: 0, rightPos: [-0.11, 0.16, 0.31], rightRot: [0, Math.PI * 0.42, 0], rightPose: C_CUP_POSE, expression: { headPitch: 0 } },
      { t: 1, rightPos: [MOUTH[0] - 0.04, MOUTH[1] - 0.03, MOUTH[2] + 0.08], rightRot: [-0.55, Math.PI * 0.42, -0.22], rightPose: C_CUP_POSE, expression: { headPitch: -0.14, mouthOpen: 0.35 } }
    ]
  },
  'bim-everyday-rumah': {
    twoHands: true,
    baseExpression: { smile: 0.35, browLift: 0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.09, 0.29, 0.30],
        rightRot: [0, Math.PI * 0.3, -0.72],
        rightPose: OPEN_PALM,
        leftPos: [0.09, 0.29, 0.30],
        leftRot: [0, -Math.PI * 0.3, 0.72],
        leftPose: OPEN_PALM
      },
      {
        t: 0.5,
        rightPos: [-0.19, 0.20, 0.30],
        rightRot: [0, Math.PI * 0.42, -0.1],
        rightPose: OPEN_PALM,
        leftPos: [0.19, 0.20, 0.30],
        leftRot: [0, -Math.PI * 0.42, 0.1],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [-0.19, 0.02, 0.30],
        rightRot: [0, Math.PI * 0.42, 0],
        rightPose: OPEN_PALM,
        leftPos: [0.19, 0.02, 0.30],
        leftRot: [0, -Math.PI * 0.42, 0],
        leftPose: OPEN_PALM
      }
    ]
  },
  'asl-everyday-home': {
    twoHands: false,
    baseExpression: { smile: 0.45, browLift: 0.1 },
    keyframes: [
      { t: 0, rightPos: [MOUTH[0] - 0.04, MOUTH[1] - 0.03, MOUTH[2] + 0.05], rightRot: [0.15, Math.PI * 0.75, 0], rightPose: FLAT_O_POSE },
      { t: 1, rightPos: [CHEEK_RIGHT[0] - 0.04, CHEEK_RIGHT[1] - 0.04, CHEEK_RIGHT[2] + 0.05], rightRot: [0.1, Math.PI * 0.6, 0.12], rightPose: FLAT_O_POSE }
    ]
  },
  'bim-everyday-kawan': {
    twoHands: true,
    baseExpression: { smile: 0.75, browLift: 0.15 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.10, 0.14, 0.30],
        rightRot: [0.25, -Math.PI * 0.35, -0.3],
        rightPose: HOOK_X_POSE,
        leftPos: [0.10, 0.14, 0.30],
        leftRot: [0.25, Math.PI * 0.35, 0.3],
        leftPose: HOOK_X_POSE
      },
      {
        t: 0.5,
        rightPos: [-0.03, 0.12, 0.31],
        rightRot: [-0.45, -Math.PI * 0.35, 0.25],
        rightPose: HOOK_X_POSE,
        leftPos: [0.03, 0.15, 0.29],
        leftRot: [0.45, Math.PI * 0.35, -0.25],
        leftPose: HOOK_X_POSE
      },
      {
        t: 1,
        rightPos: [-0.10, 0.14, 0.30],
        rightRot: [0.25, -Math.PI * 0.35, -0.3],
        rightPose: HOOK_X_POSE,
        leftPos: [0.10, 0.14, 0.30],
        leftRot: [0.25, Math.PI * 0.35, 0.3],
        leftPose: HOOK_X_POSE
      }
    ]
  },
  'asl-everyday-friend': {
    twoHands: true,
    baseExpression: { smile: 0.75, browLift: 0.15 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.10, 0.14, 0.30],
        rightRot: [0.25, -Math.PI * 0.35, -0.3],
        rightPose: HOOK_X_POSE,
        leftPos: [0.10, 0.14, 0.30],
        leftRot: [0.25, Math.PI * 0.35, 0.3],
        leftPose: HOOK_X_POSE
      },
      {
        t: 0.5,
        rightPos: [-0.03, 0.12, 0.31],
        rightRot: [-0.45, -Math.PI * 0.35, 0.25],
        rightPose: HOOK_X_POSE,
        leftPos: [0.03, 0.15, 0.29],
        leftRot: [0.45, Math.PI * 0.35, -0.25],
        leftPose: HOOK_X_POSE
      },
      {
        t: 1,
        rightPos: [-0.10, 0.14, 0.30],
        rightRot: [0.25, -Math.PI * 0.35, -0.3],
        rightPose: HOOK_X_POSE,
        leftPos: [0.10, 0.14, 0.30],
        leftRot: [0.25, Math.PI * 0.35, 0.3],
        leftPose: HOOK_X_POSE
      }
    ]
  },
  'bim-everyday-sayang': {
    twoHands: true,
    baseExpression: { smile: 0.85, browLift: 0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.04, 0.08, 0.22],
        rightRot: [0, Math.PI, -0.45],
        rightPose: FIST_A_POSE,
        leftPos: [0.04, 0.09, 0.25],
        leftRot: [0, Math.PI, 0.45],
        leftPose: FIST_A_POSE,
        expression: { headRoll: 0.06 }
      },
      {
        t: 0.5,
        rightPos: [-0.02, 0.09, 0.22],
        rightRot: [0, Math.PI, -0.5],
        rightPose: FIST_A_POSE,
        leftPos: [0.02, 0.10, 0.25],
        leftRot: [0, Math.PI, 0.5],
        leftPose: FIST_A_POSE,
        expression: { headRoll: 0.08 }
      },
      {
        t: 1,
        rightPos: [-0.04, 0.08, 0.22],
        rightRot: [0, Math.PI, -0.45],
        rightPose: FIST_A_POSE,
        leftPos: [0.04, 0.09, 0.25],
        leftRot: [0, Math.PI, 0.45],
        leftPose: FIST_A_POSE,
        expression: { headRoll: 0.06 }
      }
    ]
  },
  'asl-everyday-ily': {
    twoHands: false,
    baseExpression: { smile: 0.9, browLift: 0.2 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.15, 0.17, 0.32],
        rightRot: [0, 0, -0.05],
        rightPose: { curls: { thumb: 0.05, index: 0.04, middle: 0.94, ring: 0.94, pinky: 0.05 }, spreads: { thumb: 0.8 } }
      },
      {
        t: 0.5,
        rightPos: [-0.15, 0.19, 0.33],
        rightRot: [0, 0, 0.05],
        rightPose: { curls: { thumb: 0.05, index: 0.04, middle: 0.94, ring: 0.94, pinky: 0.05 }, spreads: { thumb: 0.8 } }
      },
      {
        t: 1,
        rightPos: [-0.15, 0.17, 0.32],
        rightRot: [0, 0, -0.05],
        rightPose: { curls: { thumb: 0.05, index: 0.04, middle: 0.94, ring: 0.94, pinky: 0.05 }, spreads: { thumb: 0.8 } }
      }
    ]
  },
  'bim-everyday-bagus': {
    twoHands: false,
    baseExpression: { smile: 0.8, browLift: 0.2 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.14, 0.12, 0.28],
        rightRot: [0, Math.PI * 0.4, 0],
        rightPose: { curls: { thumb: 0.08, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.7 } },
        expression: { headPitch: -0.02 }
      },
      {
        t: 1,
        rightPos: [-0.14, 0.22, 0.39],
        rightRot: [0, Math.PI * 0.4, 0],
        rightPose: { curls: { thumb: 0.08, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.7 } },
        expression: { headPitch: 0.1 }
      }
    ]
  },
  'asl-everyday-good': {
    twoHands: false,
    baseExpression: { smile: 0.75, browLift: 0.2 },
    keyframes: [
      {
        t: 0,
        rightPos: [CHIN[0] - 0.01, CHIN[1] - 0.04, CHIN[2] + 0.04],
        rightRot: [-0.15, Math.PI * 0.92, 0.05],
        rightPose: OPEN_PALM,
        expression: { headPitch: -0.02 }
      },
      {
        t: 1,
        rightPos: [-0.03, 0.08, 0.38],
        rightRot: [-1.3, Math.PI * 0.92, 0],
        rightPose: OPEN_PALM,
        expression: { headPitch: 0.1 }
      }
    ]
  },
  'bim-everyday-jumpa-lagi': {
    twoHands: false,
    baseExpression: { smile: 0.78, browLift: 0.2 },
    keyframes: [
      {
        t: 0,
        rightPos: [EYE_RIGHT[0] - 0.03, EYE_RIGHT[1] - 0.08, EYE_RIGHT[2] + 0.05],
        rightRot: [0.15, Math.PI * 0.85, 0],
        rightPose: { curls: { thumb: 0.78, index: 0.05, middle: 0.05, ring: 0.94, pinky: 0.94 }, spreads: { indexMiddle: 0.65 }, thumbAcross: true }
      },
      {
        t: 1,
        rightPos: [-0.17, 0.20, 0.42],
        rightRot: [0.65, Math.PI * 0.85, -0.25],
        rightPose: { curls: { thumb: 0.78, index: 0.05, middle: 0.05, ring: 0.94, pinky: 0.94 }, spreads: { indexMiddle: 0.65 }, thumbAcross: true }
      }
    ]
  },
  'asl-everyday-more': {
    twoHands: true,
    baseExpression: { smile: 0.5, browLift: 0.4 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.15, 0.14, 0.31],
        rightRot: [0.15, Math.PI * 0.45, -0.2],
        rightPose: FLAT_O_POSE,
        leftPos: [0.15, 0.14, 0.31],
        leftRot: [0.15, -Math.PI * 0.45, 0.2],
        leftPose: FLAT_O_POSE
      },
      {
        t: 0.5,
        rightPos: [-0.045, 0.14, 0.31],
        rightRot: [0.15, Math.PI * 0.45, -0.35],
        rightPose: FLAT_O_POSE,
        leftPos: [0.045, 0.14, 0.31],
        leftRot: [0.15, -Math.PI * 0.45, 0.35],
        leftPose: FLAT_O_POSE
      },
      {
        t: 1,
        rightPos: [-0.15, 0.14, 0.31],
        rightRot: [0.15, Math.PI * 0.45, -0.2],
        rightPose: FLAT_O_POSE,
        leftPos: [0.15, 0.14, 0.31],
        leftRot: [0.15, -Math.PI * 0.45, 0.2],
        leftPose: FLAT_O_POSE
      }
    ]
  },
  'asl-everyday-water': {
    twoHands: false,
    baseExpression: { smile: 0.25, browLift: 0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.09, 0.24, 0.27],
        rightRot: [0.1, Math.PI * 0.45, 0],
        rightPose: { curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.06, pinky: 0.92 }, spreads: { indexMiddle: 0.4, middleRing: 0.4 }, thumbAcross: true }
      },
      {
        t: 0.5,
        rightPos: [CHIN[0] - 0.03, CHIN[1] - 0.05, CHIN[2] + 0.03],
        rightRot: [0.1, Math.PI * 0.45, 0],
        rightPose: { curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.06, pinky: 0.92 }, spreads: { indexMiddle: 0.4, middleRing: 0.4 }, thumbAcross: true }
      },
      {
        t: 1,
        rightPos: [-0.09, 0.24, 0.27],
        rightRot: [0.1, Math.PI * 0.45, 0],
        rightPose: { curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.06, pinky: 0.92 }, spreads: { indexMiddle: 0.4, middleRing: 0.4 }, thumbAcross: true }
      }
    ]
  },
  'asl-everyday-learn': {
    twoHands: true,
    baseExpression: { smile: 0.3, browLift: 0.35 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.02, 0.13, 0.30],
        rightRot: [Math.PI * 0.45, 0, 0],
        rightPose: OPEN_PALM,
        leftPos: [0.05, 0.06, 0.30],
        leftRot: [-1.42, 0, 0.2],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [FOREHEAD_RIGHT[0] + 0.02, FOREHEAD_RIGHT[1] - 0.05, FOREHEAD_RIGHT[2] + 0.04],
        rightRot: [0.1, Math.PI * 0.85, 0],
        rightPose: FLAT_O_POSE,
        leftPos: [0.05, 0.06, 0.30],
        leftRot: [-1.42, 0, 0.2],
        leftPose: OPEN_PALM
      }
    ]
  },
  'asl-everyday-goodbye': {
    twoHands: false,
    baseExpression: { smile: 0.85, browLift: 0.25 },
    keyframes: [
      { t: 0, rightPos: [-0.22, 0.25, 0.31], rightRot: [0, 0, 0.24], rightPose: OPEN_PALM },
      { t: 0.5, rightPos: [-0.14, 0.25, 0.31], rightRot: [0, 0, -0.24], rightPose: OPEN_PALM },
      { t: 1, rightPos: [-0.22, 0.25, 0.31], rightRot: [0, 0, 0.24], rightPose: OPEN_PALM }
    ]
  }
};

function getAlphaNumRotation(key: string): Vec3 {
  switch (key) {
    case 'c':
    case 'o':
    case '0':
      return [0.05, Math.PI * 0.42, 0];
    case 'g':
      return [0.08, Math.PI * 0.78, Math.PI * 0.48];
    case 'h':
      return [0.06, Math.PI * 0.85, Math.PI * 0.48];
    case 'p':
      return [Math.PI * 0.58, Math.PI * 0.18, 0];
    case 'q':
      return [Math.PI * 0.60, Math.PI * 0.22, 0];
    default:
      return [0, 0.08, 0];
  }
}

function getAlphaNumChoreography(sign: SignDefinition): Choreography3D {
  const parts = sign.id.split('-');
  const key = parts[parts.length - 1] ?? '';

  if (key === 'j') {
    const iPose: HandPoseSpec = {
      curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 },
      thumbAcross: true
    };
    return {
      twoHands: false,
      baseExpression: { smile: 0.3, browLift: 0.1 },
      keyframes: [
        { t: 0, rightPos: [-0.19, 0.24, 0.30], rightRot: [0, 0.08, 0], rightPose: iPose },
        { t: 0.55, rightPos: [-0.17, 0.09, 0.32], rightRot: [0.15, 0.35, 0.25], rightPose: iPose },
        { t: 1, rightPos: [-0.04, 0.13, 0.31], rightRot: [0.25, Math.PI * 0.65, 0.42], rightPose: iPose }
      ]
    };
  }

  if (key === 'z') {
    const zPose: HandPoseSpec = {
      curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 },
      thumbAcross: true
    };
    return {
      twoHands: false,
      baseExpression: { smile: 0.3, browLift: 0.1 },
      keyframes: [
        { t: 0, rightPos: [-0.23, 0.26, 0.32], rightRot: [0.32, 0, 0], rightPose: zPose },
        { t: 0.33, rightPos: [-0.06, 0.26, 0.32], rightRot: [0.32, 0, 0], rightPose: zPose },
        { t: 0.67, rightPos: [-0.23, 0.09, 0.32], rightRot: [0.32, 0, 0], rightPose: zPose },
        { t: 1, rightPos: [-0.06, 0.09, 0.32], rightRot: [0.32, 0, 0], rightPose: zPose }
      ]
    };
  }

  const basePose: HandPoseSpec = sign.poseSpec ?? OPEN_PALM;
  const baseRot = getAlphaNumRotation(key);
  return {
    twoHands: false,
    baseExpression: { smile: 0.28, browLift: 0.05 },
    keyframes: [
      { t: 0, rightPos: [...NEUTRAL_RIGHT], rightRot: baseRot, rightPose: basePose },
      {
        t: 0.5,
        rightPos: [NEUTRAL_RIGHT[0], NEUTRAL_RIGHT[1] + 0.012, NEUTRAL_RIGHT[2]],
        rightRot: [baseRot[0], baseRot[1] + 0.04, baseRot[2]],
        rightPose: basePose
      },
      { t: 1, rightPos: [...NEUTRAL_RIGHT], rightRot: baseRot, rightPose: basePose }
    ]
  };
}

function retargetRecordedLandmarks(landmarks: Point3D[]): { pos: Vec3; rot: Vec3; pose: HandPoseSpec } {
  const feats = extractHandFeatures(landmarks);
  const pos: Vec3 = [
    clamp((0.5 - feats.palmCenter[0]) * 0.55, -0.28, 0.28),
    clamp((0.55 - feats.palmCenter[1]) * 0.55 + 0.14, -0.05, 0.48),
    clamp(0.30 - (landmarks[9]?.z ?? 0) * 0.25, 0.18, 0.44)
  ];

  const tiltRad = (clamp(feats.handTiltDeg, -165, 165) * Math.PI) / 180;
  // Estimate palm facing from wrist -> index MCP x wrist -> pinky MCP cross product
  const w = landmarks[0];
  const iMcp = landmarks[5];
  const pMcp = landmarks[17];
  const ax = iMcp.x - w.x;
  const ay = iMcp.y - w.y;
  const az = iMcp.z - w.z;
  const bx = pMcp.x - w.x;
  const by = pMcp.y - w.y;
  const bz = pMcp.z - w.z;
  const nx = ay * bz - az * by;
  const nz = ax * by - ay * bx;
  const rotY = clamp(Math.atan2(nx, nz) * 0.5, -Math.PI * 0.85, Math.PI * 0.85);

  const pose: HandPoseSpec = {
    curls: feats.curls,
    spreads: {
      indexMiddle: clamp(feats.indexMiddleSpread * 0.9, 0.03, 0.8)
    },
    thumbAcross: feats.thumbAcross,
    crossIndexMiddle: feats.indexMiddleCrossed
  };

  return { pos, rot: [0, rotY, -tiltRad * 0.65], pose };
}

function sampleRecordedCharacterPose(sign: SignDefinition, t: number): CharacterPose3D {
  const frames = sign.recordedFrames!;
  const trailRight: Vec3[] = [];
  const trailLeft: Vec3[] = [];

  for (const f of frames) {
    trailRight.push(retargetRecordedLandmarks(f.landmarks).pos);
    if (f.secondLandmarks) {
      trailLeft.push(retargetRecordedLandmarks(f.secondLandmarks).pos);
    }
  }

  const scaled = frames.length === 1 ? 0 : t * (frames.length - 1);
  const idx = frames.length === 1 ? 0 : Math.min(frames.length - 2, Math.floor(scaled));
  const nextIdx = frames.length === 1 ? 0 : idx + 1;
  const alpha = frames.length === 1 ? 0 : easeInOut(scaled - idx);

  const rA = retargetRecordedLandmarks(frames[idx].landmarks);
  const rB = retargetRecordedLandmarks(frames[nextIdx].landmarks);
  const rightHand: HandTarget3D = {
    position: lerpVec3(rA.pos, rB.pos, alpha),
    rotationEuler: lerpVec3(rA.rot, rB.rot, alpha),
    pose: lerpPoseSpec(rA.pose, rB.pose, alpha),
    active: true
  };

  let leftHand: HandTarget3D = {
    position: [...REST_LEFT],
    rotationEuler: [0.1, 0, -0.08],
    pose: RELAXED_REST_POSE,
    active: false
  };

  if (frames[idx].secondLandmarks && frames[nextIdx].secondLandmarks) {
    const lA = retargetRecordedLandmarks(frames[idx].secondLandmarks!);
    const lB = retargetRecordedLandmarks(frames[nextIdx].secondLandmarks!);
    leftHand = {
      position: lerpVec3(lA.pos, lB.pos, alpha),
      rotationEuler: lerpVec3(lA.rot, lB.rot, alpha),
      pose: lerpPoseSpec(lA.pose, lB.pose, alpha),
      active: true
    };
  }

  const focusCenter = leftHand.active
    ? lerpVec3(rightHand.position, leftHand.position, 0.5)
    : ([rightHand.position[0], rightHand.position[1] + 0.04, rightHand.position[2]] as Vec3);

  return {
    rightHand,
    leftHand,
    expression: defaultExpression({ smile: 0.35 }),
    trailRight: frames.length > 1 ? trailRight : [],
    trailLeft: frames.length > 1 ? trailLeft : [],
    currentRightAnchor: rightHand.position,
    focusCenter
  };
}

function findKeyframePair(kfs: Keyframe3D[], t: number): { a: Keyframe3D; b: Keyframe3D; alpha: number } {
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

function buildChoreographyFromGenericSign(sign: SignDefinition): Choreography3D {
  if (sign.motionKeyframes && sign.motionKeyframes.length > 0) {
    const kfs: Keyframe3D[] = sign.motionKeyframes.map((kf) => ({
      t: kf.t,
      rightPos: [
        clamp((0.5 - kf.anchor[0]) * 0.55 - 0.12, -0.28, 0.24),
        clamp((0.55 - kf.anchor[1]) * 0.55 + 0.16, -0.02, 0.48),
        0.31
      ],
      rightRot: [0, 0, -((kf.pose.rotationZ ?? 0) * Math.PI) / 180],
      rightPose: kf.pose,
      leftPos: kf.secondHand
        ? [
            clamp((0.5 - kf.secondHand.anchor[0]) * 0.55 + 0.12, -0.24, 0.28),
            clamp((0.55 - kf.secondHand.anchor[1]) * 0.55 + 0.16, -0.02, 0.48),
            0.31
          ]
        : undefined,
      leftRot: kf.secondHand ? [0, 0, -((kf.secondHand.pose.rotationZ ?? 0) * Math.PI) / 180] : undefined,
      leftPose: kf.secondHand?.pose
    }));
    return { twoHands: sign.hands === 2, keyframes: kfs };
  }

  return {
    twoHands: sign.hands === 2,
    keyframes: [
      {
        t: 0,
        rightPos: sign.hands === 2 ? [-0.14, 0.16, 0.31] : [...NEUTRAL_RIGHT],
        rightRot: [0, 0, -((sign.poseSpec?.rotationZ ?? 0) * Math.PI) / 180],
        rightPose: sign.poseSpec ?? OPEN_PALM,
        leftPos: sign.hands === 2 ? [0.14, 0.16, 0.31] : undefined,
        leftRot: sign.hands === 2 ? [0, 0, -((sign.secondHandPose?.rotationZ ?? 0) * Math.PI) / 180] : undefined,
        leftPose: sign.secondHandPose ?? OPEN_PALM
      }
    ]
  };
}

function getChoreography(sign: SignDefinition): Choreography3D {
  if (EVERYDAY_CHOREOGRAPHY[sign.id]) {
    return EVERYDAY_CHOREOGRAPHY[sign.id];
  }
  if (sign.category === 'alphabet' || sign.category === 'number') {
    return getAlphaNumChoreography(sign);
  }
  return buildChoreographyFromGenericSign(sign);
}

/**
 * Sample full 3D upper-body character pose, hand orientations, facial expression,
 * and 3D motion trails for any built-in or Studio-recorded sign at normalized time `tRaw` (0..1).
 */
export function sampleCharacterPose3D(sign: SignDefinition, tRaw: number): CharacterPose3D {
  const t = clamp(tRaw, 0, 1);

  if (sign.recordedFrames && sign.recordedFrames.length > 0) {
    return sampleRecordedCharacterPose(sign, t);
  }

  const choreo = getChoreography(sign);
  const kfs = choreo.keyframes;
  const baseExpr = defaultExpression(choreo.baseExpression);
  const seg = findKeyframePair(kfs, t);

  const rightPos = lerpVec3(seg.a.rightPos, seg.b.rightPos, seg.alpha);
  const rightRot = lerpVec3(seg.a.rightRot, seg.b.rightRot, seg.alpha);
  const rightPose = lerpPoseSpec(seg.a.rightPose, seg.b.rightPose, seg.alpha);

  const rightHand: HandTarget3D = {
    position: rightPos,
    rotationEuler: rightRot,
    pose: rightPose,
    active: true
  };

  let leftHand: HandTarget3D = {
    position: [...REST_LEFT],
    rotationEuler: [0.12, 0.1, -0.06],
    pose: RELAXED_REST_POSE,
    active: false
  };

  if (choreo.twoHands && seg.a.leftPos && seg.b.leftPos && seg.a.leftPose && seg.b.leftPose) {
    leftHand = {
      position: lerpVec3(seg.a.leftPos, seg.b.leftPos, seg.alpha),
      rotationEuler: lerpVec3(seg.a.leftRot ?? [0, 0, 0], seg.b.leftRot ?? [0, 0, 0], seg.alpha),
      pose: lerpPoseSpec(seg.a.leftPose, seg.b.leftPose, seg.alpha),
      active: true
    };
  }

  // Build 3D trail points when dynamic sign has significant travel
  const trailRight: Vec3[] = [];
  const trailLeft: Vec3[] = [];
  if (sign.mode === 'dynamic' && kfs.length >= 2) {
    const steps = 28;
    for (let i = 0; i <= steps; i += 1) {
      const st = i / steps;
      const pSeg = findKeyframePair(kfs, st);
      trailRight.push(lerpVec3(pSeg.a.rightPos, pSeg.b.rightPos, pSeg.alpha));
      if (choreo.twoHands && pSeg.a.leftPos && pSeg.b.leftPos) {
        trailLeft.push(lerpVec3(pSeg.a.leftPos, pSeg.b.leftPos, pSeg.alpha));
      }
    }
  }

  const focusCenter: Vec3 = leftHand.active
    ? lerpVec3(rightHand.position, leftHand.position, 0.5)
    : [rightHand.position[0], rightHand.position[1] + 0.045, rightHand.position[2]];

  return {
    rightHand,
    leftHand,
    expression: mergeExpression(baseExpr, seg.a.expression, seg.b.expression, seg.alpha),
    trailRight,
    trailLeft,
    currentRightAnchor: rightHand.position,
    focusCenter
  };
}

export { CHEST, REST_LEFT, REST_RIGHT };
