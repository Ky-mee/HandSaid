import type { HandPoseSpec } from '../../data/types';
import type { Choreography3D, Vec3 } from './types3d';

const CHIN: Vec3 = [-0.01, 0.30, 0.20];
const FOREHEAD: Vec3 = [-0.01, 0.48, 0.19];
const TEMPLE_RIGHT: Vec3 = [-0.09, 0.45, 0.18];
const CHEEK_RIGHT: Vec3 = [-0.09, 0.37, 0.17];

const OPEN_PALM: HandPoseSpec = {
  curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 },
  spreads: { thumb: 0.35, indexMiddle: 0.08, middleRing: 0.08, ringPinky: 0.08 }
};

const SPREAD_FIVE: HandPoseSpec = {
  curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 },
  spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 }
};

const FIST_S_POSE: HandPoseSpec = {
  curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 },
  thumbAcross: true
};

const INDEX_UP_POSE: HandPoseSpec = {
  curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 },
  thumbAcross: true
};

const L_POSE: HandPoseSpec = {
  curls: { thumb: 0.06, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 },
  spreads: { thumb: 0.8 }
};

const F_POSE: HandPoseSpec = {
  curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 },
  pinchTo: 'index'
};

const FLAT_O_POSE: HandPoseSpec = {
  curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 },
  pinchTo: 'index'
};

const C_CUP_POSE: HandPoseSpec = {
  curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 },
  spreads: { thumb: 0.55 }
};

const CLAW_POSE: HandPoseSpec = {
  curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 },
  spreads: { thumb: 0.45, indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 }
};

const WAIT_WIGGLE_A: HandPoseSpec = {
  curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 },
  spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 }
};

const WAIT_WIGGLE_B: HandPoseSpec = {
  curls: { thumb: 0.18, index: 0.28, middle: 0.10, ring: 0.28, pinky: 0.10 },
  spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 }
};

const MOTHER_CHOREO: Choreography3D = {
  twoHands: false,
  baseExpression: { smile: 0.65, browLift: 0.15 },
  keyframes: [
    {
      t: 0,
      rightPos: [CHIN[0] - 0.04, CHIN[1] - 0.03, CHIN[2] + 0.08],
      rightRot: [0, Math.PI * 0.44, 0],
      rightPose: SPREAD_FIVE
    },
    {
      t: 0.5,
      rightPos: [CHIN[0] - 0.01, CHIN[1] - 0.03, CHIN[2] + 0.03],
      rightRot: [0, Math.PI * 0.44, 0],
      rightPose: SPREAD_FIVE
    },
    {
      t: 1,
      rightPos: [CHIN[0] - 0.04, CHIN[1] - 0.03, CHIN[2] + 0.08],
      rightRot: [0, Math.PI * 0.44, 0],
      rightPose: SPREAD_FIVE
    }
  ]
};

const FATHER_CHOREO: Choreography3D = {
  twoHands: false,
  baseExpression: { smile: 0.6, browLift: 0.2 },
  keyframes: [
    {
      t: 0,
      rightPos: [FOREHEAD[0] - 0.04, FOREHEAD[1] - 0.04, FOREHEAD[2] + 0.08],
      rightRot: [0, Math.PI * 0.44, 0],
      rightPose: SPREAD_FIVE
    },
    {
      t: 0.5,
      rightPos: [FOREHEAD[0] - 0.01, FOREHEAD[1] - 0.04, FOREHEAD[2] + 0.03],
      rightRot: [0, Math.PI * 0.44, 0],
      rightPose: SPREAD_FIVE
    },
    {
      t: 1,
      rightPos: [FOREHEAD[0] - 0.04, FOREHEAD[1] - 0.04, FOREHEAD[2] + 0.08],
      rightRot: [0, Math.PI * 0.44, 0],
      rightPose: SPREAD_FIVE
    }
  ]
};

const FAMILY_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.78, browLift: 0.18 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.045, 0.14, 0.27],
      rightRot: [0.1, Math.PI * 0.28, 0],
      rightPose: F_POSE,
      leftPos: [0.045, 0.14, 0.27],
      leftRot: [0.1, -Math.PI * 0.28, 0],
      leftPose: F_POSE
    },
    {
      t: 0.5,
      rightPos: [-0.17, 0.14, 0.34],
      rightRot: [0.1, 0, 0],
      rightPose: F_POSE,
      leftPos: [0.17, 0.14, 0.34],
      leftRot: [0.1, 0, 0],
      leftPose: F_POSE
    },
    {
      t: 1,
      rightPos: [-0.045, 0.14, 0.39],
      rightRot: [0.1, -Math.PI * 0.35, 0],
      rightPose: F_POSE,
      leftPos: [0.045, 0.14, 0.39],
      leftRot: [0.1, Math.PI * 0.35, 0],
      leftPose: F_POSE
    }
  ]
};

const TEACHER_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.55, browLift: 0.25 },
  keyframes: [
    {
      t: 0,
      rightPos: [TEMPLE_RIGHT[0] - 0.04, TEMPLE_RIGHT[1] - 0.04, TEMPLE_RIGHT[2] + 0.06],
      rightRot: [0.1, Math.PI * 0.4, 0],
      rightPose: FLAT_O_POSE,
      leftPos: [-TEMPLE_RIGHT[0] + 0.04, TEMPLE_RIGHT[1] - 0.04, TEMPLE_RIGHT[2] + 0.06],
      leftRot: [0.1, -Math.PI * 0.4, 0],
      leftPose: FLAT_O_POSE
    },
    {
      t: 0.48,
      rightPos: [-0.15, 0.30, 0.34],
      rightRot: [0.15, Math.PI * 0.42, 0],
      rightPose: OPEN_PALM,
      leftPos: [0.15, 0.30, 0.34],
      leftRot: [0.15, -Math.PI * 0.42, 0],
      leftPose: OPEN_PALM
    },
    {
      t: 1,
      rightPos: [-0.17, 0.06, 0.34],
      rightRot: [0.1, Math.PI * 0.45, 0],
      rightPose: OPEN_PALM,
      leftPos: [0.17, 0.06, 0.34],
      leftRot: [0.1, -Math.PI * 0.45, 0],
      leftPose: OPEN_PALM
    }
  ]
};

const DOCTOR_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.35, browLift: 0.15 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.03, 0.18, 0.32],
      rightRot: [-0.65, Math.PI * 0.35, 0.3],
      rightPose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
      leftPos: [0.02, 0.08, 0.31],
      leftRot: [-1.25, 0.1, 0.45],
      leftPose: OPEN_PALM
    },
    {
      t: 0.5,
      rightPos: [-0.01, 0.11, 0.31],
      rightRot: [-0.85, Math.PI * 0.35, 0.3],
      rightPose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
      leftPos: [0.02, 0.08, 0.31],
      leftRot: [-1.25, 0.1, 0.45],
      leftPose: OPEN_PALM
    },
    {
      t: 1,
      rightPos: [-0.03, 0.18, 0.32],
      rightRot: [-0.65, Math.PI * 0.35, 0.3],
      rightPose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
      leftPos: [0.02, 0.08, 0.31],
      leftRot: [-1.25, 0.1, 0.45],
      leftPose: OPEN_PALM
    }
  ]
};

const BABY_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.85, browLift: 0.2 },
  keyframes: [
    {
      t: 0,
      rightPos: [0.04, 0.09, 0.30],
      rightRot: [-1.15, 0.15, -0.4],
      rightPose: OPEN_PALM,
      leftPos: [-0.04, 0.07, 0.32],
      leftRot: [-1.15, -0.15, 0.4],
      leftPose: OPEN_PALM,
      expression: { headRoll: 0.08 }
    },
    {
      t: 0.5,
      rightPos: [0.08, 0.10, 0.30],
      rightRot: [-1.15, 0.15, -0.32],
      rightPose: OPEN_PALM,
      leftPos: [0.01, 0.08, 0.32],
      leftRot: [-1.15, -0.15, 0.48],
      leftPose: OPEN_PALM,
      expression: { headRoll: -0.08 }
    },
    {
      t: 1,
      rightPos: [0.04, 0.09, 0.30],
      rightRot: [-1.15, 0.15, -0.4],
      rightPose: OPEN_PALM,
      leftPos: [-0.04, 0.07, 0.32],
      leftRot: [-1.15, -0.15, 0.4],
      leftPose: OPEN_PALM,
      expression: { headRoll: 0.08 }
    }
  ]
};

const WORK_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.2, browLift: 0.1 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.03, 0.19, 0.30],
      rightRot: [0.25, Math.PI * 0.25, -0.35],
      rightPose: FIST_S_POSE,
      leftPos: [0.04, 0.09, 0.30],
      leftRot: [-0.95, 0, 0.35],
      leftPose: FIST_S_POSE
    },
    {
      t: 0.5,
      rightPos: [0.01, 0.13, 0.30],
      rightRot: [0.4, Math.PI * 0.25, -0.35],
      rightPose: FIST_S_POSE,
      leftPos: [0.04, 0.09, 0.30],
      leftRot: [-0.95, 0, 0.35],
      leftPose: FIST_S_POSE
    },
    {
      t: 1,
      rightPos: [-0.03, 0.19, 0.30],
      rightRot: [0.25, Math.PI * 0.25, -0.35],
      rightPose: FIST_S_POSE,
      leftPos: [0.04, 0.09, 0.30],
      leftRot: [-0.95, 0, 0.35],
      leftPose: FIST_S_POSE
    }
  ]
};

const SCHOOL_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.6, browLift: 0.15 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.04, 0.19, 0.31],
      rightRot: [0.2, Math.PI * 0.3, -0.3],
      rightPose: OPEN_PALM,
      leftPos: [0.03, 0.08, 0.31],
      leftRot: [-1.25, 0, 0.35],
      leftPose: OPEN_PALM
    },
    {
      t: 0.5,
      rightPos: [0.0, 0.12, 0.31],
      rightRot: [0.45, Math.PI * 0.3, -0.3],
      rightPose: OPEN_PALM,
      leftPos: [0.03, 0.08, 0.31],
      leftRot: [-1.25, 0, 0.35],
      leftPose: OPEN_PALM
    },
    {
      t: 1,
      rightPos: [-0.04, 0.19, 0.31],
      rightRot: [0.2, Math.PI * 0.3, -0.3],
      rightPose: OPEN_PALM,
      leftPos: [0.03, 0.08, 0.31],
      leftRot: [-1.25, 0, 0.35],
      leftPose: OPEN_PALM
    }
  ]
};

const WHERE_CHOREO: Choreography3D = {
  twoHands: false,
  baseExpression: { smile: -0.05, browLift: -0.45 },
  keyframes: [
    { t: 0, rightPos: [-0.21, 0.18, 0.31], rightRot: [0, 0, 0.22], rightPose: INDEX_UP_POSE, expression: { headRoll: 0.07 } },
    { t: 0.5, rightPos: [-0.09, 0.18, 0.31], rightRot: [0, 0, -0.22], rightPose: INDEX_UP_POSE, expression: { headRoll: -0.05 } },
    { t: 1, rightPos: [-0.21, 0.18, 0.31], rightRot: [0, 0, 0.22], rightPose: INDEX_UP_POSE, expression: { headRoll: 0.07 } }
  ]
};

const HAPPY_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.95, browLift: 0.35 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.09, 0.02, 0.23],
      rightRot: [-0.3, Math.PI * 0.85, 0],
      rightPose: OPEN_PALM,
      leftPos: [0.09, 0.02, 0.23],
      leftRot: [-0.3, -Math.PI * 0.85, 0],
      leftPose: OPEN_PALM
    },
    {
      t: 0.5,
      rightPos: [-0.11, 0.17, 0.27],
      rightRot: [-0.65, Math.PI * 0.8, 0],
      rightPose: OPEN_PALM,
      leftPos: [0.11, 0.17, 0.27],
      leftRot: [-0.65, -Math.PI * 0.8, 0],
      leftPose: OPEN_PALM
    },
    {
      t: 1,
      rightPos: [-0.09, 0.02, 0.23],
      rightRot: [-0.3, Math.PI * 0.85, 0],
      rightPose: OPEN_PALM,
      leftPos: [0.09, 0.02, 0.23],
      leftRot: [-0.3, -Math.PI * 0.85, 0],
      leftPose: OPEN_PALM
    }
  ]
};

const SAD_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: -0.5, browLift: -0.45 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.09, 0.30, 0.26],
      rightRot: [0, Math.PI * 0.85, 0],
      rightPose: SPREAD_FIVE,
      leftPos: [0.09, 0.30, 0.26],
      leftRot: [0, -Math.PI * 0.85, 0],
      leftPose: SPREAD_FIVE,
      expression: { headPitch: 0.05 }
    },
    {
      t: 1,
      rightPos: [-0.10, 0.10, 0.26],
      rightRot: [0.1, Math.PI * 0.85, 0],
      rightPose: SPREAD_FIVE,
      leftPos: [0.10, 0.10, 0.26],
      leftRot: [0.1, -Math.PI * 0.85, 0],
      leftPose: SPREAD_FIVE,
      expression: { headPitch: 0.22 }
    }
  ]
};

const PAIN_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: -0.42, browLift: -0.55 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.12, 0.14, 0.31],
      rightRot: [0, Math.PI * 0.3, Math.PI * 0.42],
      rightPose: INDEX_UP_POSE,
      leftPos: [0.12, 0.14, 0.31],
      leftRot: [0, -Math.PI * 0.3, -Math.PI * 0.42],
      leftPose: INDEX_UP_POSE
    },
    {
      t: 0.5,
      rightPos: [-0.055, 0.14, 0.31],
      rightRot: [0.25, Math.PI * 0.35, Math.PI * 0.45],
      rightPose: INDEX_UP_POSE,
      leftPos: [0.055, 0.14, 0.31],
      leftRot: [-0.25, -Math.PI * 0.35, -Math.PI * 0.45],
      leftPose: INDEX_UP_POSE
    },
    {
      t: 1,
      rightPos: [-0.12, 0.14, 0.31],
      rightRot: [0, Math.PI * 0.3, Math.PI * 0.42],
      rightPose: INDEX_UP_POSE,
      leftPos: [0.12, 0.14, 0.31],
      leftRot: [0, -Math.PI * 0.3, -Math.PI * 0.42],
      leftPose: INDEX_UP_POSE
    }
  ]
};

const HUNGRY_CHOREO: Choreography3D = {
  twoHands: false,
  baseExpression: { smile: -0.1, browLift: -0.15 },
  keyframes: [
    { t: 0, rightPos: [-0.01, 0.17, 0.22], rightRot: [0, Math.PI * 0.9, 0], rightPose: C_CUP_POSE },
    { t: 1, rightPos: [-0.01, -0.02, 0.23], rightRot: [0, Math.PI * 0.9, 0], rightPose: C_CUP_POSE }
  ]
};

const TIRED_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: -0.25, browLift: -0.3, mouthOpen: 0.12 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.11, 0.15, 0.24],
      rightRot: [0.25, Math.PI * 0.8, 0.15],
      rightPose: C_CUP_POSE,
      leftPos: [0.11, 0.15, 0.24],
      leftRot: [0.25, -Math.PI * 0.8, -0.15],
      leftPose: C_CUP_POSE,
      expression: { headPitch: 0.04 }
    },
    {
      t: 1,
      rightPos: [-0.13, 0.01, 0.27],
      rightRot: [0.65, Math.PI * 0.65, 0],
      rightPose: C_CUP_POSE,
      leftPos: [0.13, 0.01, 0.27],
      leftRot: [0.65, -Math.PI * 0.65, 0],
      leftPose: C_CUP_POSE,
      expression: { headPitch: 0.18 }
    }
  ]
};

const UNDERSTAND_CHOREO: Choreography3D = {
  twoHands: false,
  baseExpression: { smile: 0.62, browLift: 0.55 },
  keyframes: [
    {
      t: 0,
      rightPos: [TEMPLE_RIGHT[0] - 0.03, TEMPLE_RIGHT[1] - 0.04, TEMPLE_RIGHT[2] + 0.06],
      rightRot: [0, Math.PI * 0.78, 0],
      rightPose: FIST_S_POSE,
      expression: { headPitch: -0.02 }
    },
    {
      t: 1,
      rightPos: [TEMPLE_RIGHT[0] - 0.03, TEMPLE_RIGHT[1] - 0.01, TEMPLE_RIGHT[2] + 0.07],
      rightRot: [0, Math.PI * 0.78, 0],
      rightPose: INDEX_UP_POSE,
      expression: { headPitch: 0.08 }
    }
  ]
};

const CONFUSED_CHOREO: Choreography3D = {
  twoHands: false,
  baseExpression: { smile: -0.2, browLift: -0.55 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.04, 0.36, 0.26],
      rightRot: [0.1, Math.PI * 0.82, 0.18],
      rightPose: CLAW_POSE,
      expression: { headRoll: 0.1 }
    },
    {
      t: 0.5,
      rightPos: [-0.11, 0.36, 0.27],
      rightRot: [0.1, Math.PI * 0.82, -0.18],
      rightPose: CLAW_POSE,
      expression: { headRoll: -0.08 }
    },
    {
      t: 1,
      rightPos: [-0.04, 0.36, 0.26],
      rightRot: [0.1, Math.PI * 0.82, 0.18],
      rightPose: CLAW_POSE,
      expression: { headRoll: 0.1 }
    }
  ]
};

const WAIT_CHOREO: Choreography3D = {
  twoHands: true,
  baseExpression: { smile: 0.25, browLift: 0.1 },
  keyframes: [
    {
      t: 0,
      rightPos: [-0.14, 0.10, 0.32],
      rightRot: [-1.2, 0, 0.1],
      rightPose: WAIT_WIGGLE_A,
      leftPos: [0.14, 0.10, 0.32],
      leftRot: [-1.2, 0, -0.1],
      leftPose: WAIT_WIGGLE_A
    },
    {
      t: 0.5,
      rightPos: [-0.14, 0.13, 0.33],
      rightRot: [-1.15, 0, 0.1],
      rightPose: WAIT_WIGGLE_B,
      leftPos: [0.14, 0.13, 0.33],
      leftRot: [-1.15, 0, -0.1],
      leftPose: WAIT_WIGGLE_B
    },
    {
      t: 1,
      rightPos: [-0.14, 0.10, 0.32],
      rightRot: [-1.2, 0, 0.1],
      rightPose: WAIT_WIGGLE_A,
      leftPos: [0.14, 0.10, 0.32],
      leftRot: [-1.2, 0, -0.1],
      leftPose: WAIT_WIGGLE_A
    }
  ]
};

export const EXTRA_CHOREOGRAPHY: Record<string, Choreography3D> = {
  // BIM Everyday (+6)
  'bim-everyday-selamat-malam': {
    twoHands: true,
    baseExpression: { smile: 0.45, browLift: 0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.08, 0.26, 0.29],
        rightRot: [0.1, 0, 0],
        rightPose: OPEN_PALM,
        leftPos: [0.06, 0.08, 0.30],
        leftRot: [-1.42, 0.15, -1.35],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [-0.08, -0.02, 0.26],
        rightRot: [-0.4, 0, -0.22],
        rightPose: OPEN_PALM,
        leftPos: [0.06, 0.08, 0.30],
        leftRot: [-1.42, 0.15, -1.35],
        leftPose: OPEN_PALM
      }
    ]
  },
  'bim-everyday-tidur': {
    twoHands: false,
    baseExpression: { smile: 0.25, browLift: -0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [CHEEK_RIGHT[0] - 0.05, CHEEK_RIGHT[1] - 0.02, CHEEK_RIGHT[2] + 0.04],
        rightRot: [0, Math.PI * 0.45, -0.25],
        rightPose: OPEN_PALM,
        expression: { headRoll: 0.16 }
      },
      {
        t: 1,
        rightPos: [CHEEK_RIGHT[0] - 0.05, CHEEK_RIGHT[1] - 0.05, CHEEK_RIGHT[2] + 0.04],
        rightRot: [0, Math.PI * 0.45, -0.30],
        rightPose: FLAT_O_POSE,
        expression: { headRoll: 0.20 }
      }
    ]
  },
  'bim-everyday-kerja': WORK_CHOREO,
  'bim-everyday-sekolah': SCHOOL_CHOREO,
  'bim-everyday-di-mana': WHERE_CHOREO,
  'bim-everyday-bila': {
    twoHands: true,
    baseExpression: { smile: 0.2, browLift: 0.45 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.11, 0.20, 0.32],
        rightRot: [0.1, 0, 0],
        rightPose: INDEX_UP_POSE,
        leftPos: [0.04, 0.12, 0.31],
        leftRot: [0.1, 0, 0],
        leftPose: INDEX_UP_POSE
      },
      {
        t: 0.5,
        rightPos: [-0.01, 0.25, 0.34],
        rightRot: [0.15, 0, -0.15],
        rightPose: INDEX_UP_POSE,
        leftPos: [0.04, 0.12, 0.31],
        leftRot: [0.1, 0, 0],
        leftPose: INDEX_UP_POSE
      },
      {
        t: 1,
        rightPos: [0.02, 0.15, 0.32],
        rightRot: [0.25, 0, -0.25],
        rightPose: INDEX_UP_POSE,
        leftPos: [0.04, 0.12, 0.31],
        leftRot: [0.1, 0, 0],
        leftPose: INDEX_UP_POSE
      }
    ]
  },

  // BIM People (8)
  'bim-people-ibu': MOTHER_CHOREO,
  'bim-people-ayah': FATHER_CHOREO,
  'bim-people-keluarga': FAMILY_CHOREO,
  'bim-people-adik': {
    twoHands: false,
    baseExpression: { smile: 0.55, browLift: 0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.15, 0.22, 0.31],
        rightRot: [0, 0.1, 0],
        rightPose: { curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 }, thumbAcross: true }
      },
      {
        t: 1,
        rightPos: [-0.15, 0.04, 0.31],
        rightRot: [0, 0.1, 0],
        rightPose: { curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 }, thumbAcross: true }
      }
    ]
  },
  'bim-people-abang': {
    twoHands: false,
    baseExpression: { smile: 0.5, browLift: 0.15 },
    keyframes: [
      {
        t: 0,
        rightPos: [FOREHEAD[0] - 0.04, FOREHEAD[1] - 0.04, FOREHEAD[2] + 0.06],
        rightRot: [0, Math.PI * 0.35, 0],
        rightPose: L_POSE
      },
      {
        t: 1,
        rightPos: [-0.12, 0.14, 0.33],
        rightRot: [0.25, 0.1, 0],
        rightPose: L_POSE
      }
    ]
  },
  'bim-people-guru': TEACHER_CHOREO,
  'bim-people-doktor': DOCTOR_CHOREO,
  'bim-people-bayi': BABY_CHOREO,

  // BIM Feelings & Needs (8)
  'bim-feelings-gembira': HAPPY_CHOREO,
  'bim-feelings-sedih': SAD_CHOREO,
  'bim-feelings-sakit': PAIN_CHOREO,
  'bim-feelings-lapar': HUNGRY_CHOREO,
  'bim-feelings-penat': TIRED_CHOREO,
  'bim-feelings-faham': UNDERSTAND_CHOREO,
  'bim-feelings-tidak-faham': CONFUSED_CHOREO,
  'bim-feelings-tunggu': WAIT_CHOREO,

  // ASL Everyday (+6)
  'asl-everyday-good-morning': {
    twoHands: true,
    baseExpression: { smile: 0.85, browLift: 0.35 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.08, -0.01, 0.25],
        rightRot: [0, 0, 0],
        rightPose: OPEN_PALM,
        leftPos: [0.06, 0.07, 0.30],
        leftRot: [-1.42, 0.15, -1.35],
        leftPose: OPEN_PALM
      },
      {
        t: 1,
        rightPos: [-0.08, 0.27, 0.29],
        rightRot: [0, 0, 0.08],
        rightPose: OPEN_PALM,
        leftPos: [0.06, 0.07, 0.30],
        leftRot: [-1.42, 0.15, -1.35],
        leftPose: OPEN_PALM
      }
    ]
  },
  'asl-everyday-sleep': {
    twoHands: false,
    baseExpression: { smile: 0.2, browLift: -0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [0, 0.38, 0.26],
        rightRot: [0, Math.PI * 0.88, 0],
        rightPose: SPREAD_FIVE,
        expression: { headPitch: 0.04 }
      },
      {
        t: 1,
        rightPos: [CHIN[0] - 0.01, CHIN[1] - 0.04, CHIN[2] + 0.06],
        rightRot: [0.1, Math.PI * 0.88, 0],
        rightPose: FLAT_O_POSE,
        expression: { headPitch: 0.12 }
      }
    ]
  },
  'asl-everyday-work': WORK_CHOREO,
  'asl-everyday-school': SCHOOL_CHOREO,
  'asl-everyday-where': WHERE_CHOREO,
  'asl-everyday-what': {
    twoHands: true,
    baseExpression: { smile: -0.05, browLift: -0.45 },
    keyframes: [
      {
        t: 0,
        rightPos: [-0.15, 0.10, 0.32],
        rightRot: [-1.25, 0, 0.2],
        rightPose: OPEN_PALM,
        leftPos: [0.15, 0.10, 0.32],
        leftRot: [-1.25, 0, -0.2],
        leftPose: OPEN_PALM,
        expression: { headRoll: 0.06 }
      },
      {
        t: 0.5,
        rightPos: [-0.21, 0.10, 0.32],
        rightRot: [-1.25, 0, -0.2],
        rightPose: OPEN_PALM,
        leftPos: [0.21, 0.10, 0.32],
        leftRot: [-1.25, 0, 0.2],
        leftPose: OPEN_PALM,
        expression: { headRoll: -0.06 }
      },
      {
        t: 1,
        rightPos: [-0.15, 0.10, 0.32],
        rightRot: [-1.25, 0, 0.2],
        rightPose: OPEN_PALM,
        leftPos: [0.15, 0.10, 0.32],
        leftRot: [-1.25, 0, -0.2],
        leftPose: OPEN_PALM,
        expression: { headRoll: 0.06 }
      }
    ]
  },

  // ASL People (8)
  'asl-people-mother': MOTHER_CHOREO,
  'asl-people-father': FATHER_CHOREO,
  'asl-people-family': FAMILY_CHOREO,
  'asl-people-sister': {
    twoHands: true,
    baseExpression: { smile: 0.55, browLift: 0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [CHIN[0] - 0.03, CHIN[1] - 0.04, CHIN[2] + 0.06],
        rightRot: [0, Math.PI * 0.4, 0],
        rightPose: L_POSE,
        leftPos: [0.04, 0.09, 0.32],
        leftRot: [0.45, 0, 0],
        leftPose: INDEX_UP_POSE
      },
      {
        t: 1,
        rightPos: [-0.04, 0.09, 0.32],
        rightRot: [0.45, 0, 0],
        rightPose: INDEX_UP_POSE,
        leftPos: [0.04, 0.09, 0.32],
        leftRot: [0.45, 0, 0],
        leftPose: INDEX_UP_POSE
      }
    ]
  },
  'asl-people-brother': {
    twoHands: true,
    baseExpression: { smile: 0.55, browLift: 0.1 },
    keyframes: [
      {
        t: 0,
        rightPos: [FOREHEAD[0] - 0.03, FOREHEAD[1] - 0.04, FOREHEAD[2] + 0.06],
        rightRot: [0, Math.PI * 0.4, 0],
        rightPose: L_POSE,
        leftPos: [0.04, 0.09, 0.32],
        leftRot: [0.45, 0, 0],
        leftPose: INDEX_UP_POSE
      },
      {
        t: 1,
        rightPos: [-0.04, 0.09, 0.32],
        rightRot: [0.45, 0, 0],
        rightPose: INDEX_UP_POSE,
        leftPos: [0.04, 0.09, 0.32],
        leftRot: [0.45, 0, 0],
        leftPose: INDEX_UP_POSE
      }
    ]
  },
  'asl-people-teacher': TEACHER_CHOREO,
  'asl-people-doctor': DOCTOR_CHOREO,
  'asl-people-baby': BABY_CHOREO,

  // ASL Feelings & Needs (8)
  'asl-feelings-happy': HAPPY_CHOREO,
  'asl-feelings-sad': SAD_CHOREO,
  'asl-feelings-hurt': PAIN_CHOREO,
  'asl-feelings-hungry': HUNGRY_CHOREO,
  'asl-feelings-tired': TIRED_CHOREO,
  'asl-feelings-understand': UNDERSTAND_CHOREO,
  'asl-feelings-confused': CONFUSED_CHOREO,
  'asl-feelings-wait': WAIT_CHOREO
};
