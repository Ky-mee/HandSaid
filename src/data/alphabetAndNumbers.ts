import type { HandPoseSpec, MatcherRule, MotionKeyframe, SignDefinition } from './types';

interface BaseAlphaNumTemplate {
  key: string;
  category: 'alphabet' | 'number';
  mode: 'static' | 'dynamic';
  title: string;
  glossEn: string;
  glossBm: string;
  descriptionEn: string;
  descriptionBm: string;
  facialCueEn: string;
  facialCueBm: string;
  difficulty: 1 | 2 | 3;
  poseSpec?: HandPoseSpec;
  motionKeyframes?: MotionKeyframe[];
  matcherRule: MatcherRule;
}

const DEFAULT_FACIAL_EN = 'Keep your shoulder relaxed, hand at chest-to-chin height facing the camera.';
const DEFAULT_FACIAL_BM = 'Rehatkan bahu anda dan letakkan tangan pada paras dada hingga dagu menghadap kamera.';

const ALPHA_TEMPLATES: BaseAlphaNumTemplate[] = [
  {
    key: 'a',
    category: 'alphabet',
    mode: 'static',
    title: 'A',
    glossEn: 'Letter A',
    glossBm: 'Huruf A',
    descriptionEn: 'Curl all four fingers into a neat fist with your thumb resting upright along the side of your index finger.',
    descriptionBm: 'Genggam keempat-empat jari dengan kemas dan letakkan ibu jari tegak di sisi jari telunjuk.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.12, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 },
      spreads: { thumb: 0.15 }
    },
    matcherRule: {
      curls: { thumb: 0.12, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'b',
    category: 'alphabet',
    mode: 'static',
    title: 'B',
    glossEn: 'Letter B',
    glossBm: 'Huruf B',
    descriptionEn: 'Hold all four fingers straight up together and tuck your thumb flat across the front of your palm.',
    descriptionBm: 'Tegakkan keempat-empat jari rapat ke atas dan lipat ibu jari melintasi tapak tangan.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.85, index: 0.04, middle: 0.04, ring: 0.04, pinky: 0.04 },
      spreads: { indexMiddle: 0.04, middleRing: 0.04, ringPinky: 0.04 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.82, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.24, ring: 0.24, pinky: 0.24 },
      maxIndexMiddleSpread: 0.32,
      requireThumbAcross: true,
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'c',
    category: 'alphabet',
    mode: 'static',
    title: 'C',
    glossEn: 'Letter C',
    glossBm: 'Huruf C',
    descriptionEn: 'Curve your thumb and four fingers evenly into an open C-shape as if holding a cup.',
    descriptionBm: 'Lengkungkan ibu jari dan semua jari membentuk huruf C yang terbuka seperti memegang cawan.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 },
      spreads: { thumb: 0.55 }
    },
    matcherRule: {
      curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 },
      curlTolerance: { thumb: 0.32, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      targetTiltDeg: 0,
      tiltToleranceDeg: 45
    }
  },
  {
    key: 'd',
    category: 'alphabet',
    mode: 'static',
    title: 'D',
    glossEn: 'Letter D',
    glossBm: 'Huruf D',
    descriptionEn: 'Point your index finger straight up while your thumb touches the middle, ring, and pinky tips in a loop.',
    descriptionBm: 'Tegakkan jari telunjuk ke atas manakala ibu jari menyentuh hujung jari tengah, manis, dan kelingking.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.55, index: 0.04, middle: 0.78, ring: 0.82, pinky: 0.84 },
      pinchTo: 'middle'
    },
    matcherRule: {
      curls: { thumb: 0.52, index: 0.06, middle: 0.78, ring: 0.82, pinky: 0.84 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pinchTo: 'middle',
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'e',
    category: 'alphabet',
    mode: 'static',
    title: 'E',
    glossEn: 'Letter E',
    glossBm: 'Huruf E',
    descriptionEn: 'Bend all four fingertips down so they rest near the folded thumb across your palm.',
    descriptionBm: 'Bengkokkan keempat-empat hujung jari ke bawah supaya rapat di atas ibu jari yang dilipat.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.82, index: 0.72, middle: 0.72, ring: 0.72, pinky: 0.72 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.82, index: 0.74, middle: 0.74, ring: 0.74, pinky: 0.74 },
      curlTolerance: { thumb: 0.3, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.25 },
      requireThumbAcross: true
    }
  },
  {
    key: 'f',
    category: 'alphabet',
    mode: 'static',
    title: 'F',
    glossEn: 'Letter F',
    glossBm: 'Huruf F',
    descriptionEn: 'Touch your thumb and index fingertip together in an O-ring while spreading the other three fingers straight up.',
    descriptionBm: 'Cantumkan hujung ibu jari dan jari telunjuk membentuk bulatan, sambil menegakkan tiga jari lain.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 },
      spreads: { middleRing: 0.25, ringPinky: 0.25 },
      pinchTo: 'index'
    },
    matcherRule: {
      curls: { thumb: 0.45, index: 0.6, middle: 0.06, ring: 0.06, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.32, middle: 0.24, ring: 0.24, pinky: 0.25 },
      pinchTo: 'index'
    }
  },
  {
    key: 'g',
    category: 'alphabet',
    mode: 'static',
    title: 'G',
    glossEn: 'Letter G',
    glossBm: 'Huruf G',
    descriptionEn: 'Extend your index finger and thumb parallel pointing sideways to the left, keeping other fingers curled.',
    descriptionBm: 'Luruskan jari telunjuk dan ibu jari secara selari menghala ke sisi, dengan jari lain digenggam.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.15, index: 0.06, middle: 0.92, ring: 0.94, pinky: 0.94 },
      rotationZ: -86
    },
    matcherRule: {
      curls: { thumb: 0.18, index: 0.08, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.32, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: -86,
      tiltToleranceDeg: 45
    }
  },
  {
    key: 'h',
    category: 'alphabet',
    mode: 'static',
    title: 'H',
    glossEn: 'Letter H',
    glossBm: 'Huruf H',
    descriptionEn: 'Hold your index and middle fingers together pointing sideways horizontally; tuck ring, pinky, and thumb.',
    descriptionBm: 'Rapatkan jari telunjuk dan jari tengah menghala ke sisi secara mendatar; lipat jari lain.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.94, pinky: 0.94 },
      spreads: { indexMiddle: 0.04 },
      thumbAcross: true,
      rotationZ: -88
    },
    matcherRule: {
      curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.24, ring: 0.25, pinky: 0.25 },
      maxIndexMiddleSpread: 0.32,
      targetTiltDeg: -88,
      tiltToleranceDeg: 45
    }
  },
  {
    key: 'i',
    category: 'alphabet',
    mode: 'static',
    title: 'I',
    glossEn: 'Letter I',
    glossBm: 'Huruf I',
    descriptionEn: 'Raise only your pinky finger straight up while folding all other fingers and crossing your thumb in front.',
    descriptionBm: 'Angkat jari kelingking tegak ke atas sahaja sementara jari lain digenggam dan ibu jari dilipat di hadapan.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.04 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.75, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.06 },
      curlTolerance: { thumb: 0.35, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'j',
    category: 'alphabet',
    mode: 'dynamic',
    title: 'J',
    glossEn: 'Letter J',
    glossBm: 'Huruf J',
    descriptionEn: 'Start in the I handshape with your pinky up, then trace a smooth J-hook downward and inward.',
    descriptionBm: 'Mulakan dengan bentuk huruf I (kelingking ke atas), kemudian lakarkan bentuk huruf J melengkung ke bawah dan ke dalam.',
    facialCueEn: 'Follow the amber J-curve smoothly with your pinky leading.',
    facialCueBm: 'Ikut laluan lengkung J berwarna ambar dengan jari kelingking.',
    difficulty: 2,
    motionKeyframes: [
      { t: 0, anchor: [0.58, 0.44], pose: { curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 }, thumbAcross: true, rotationZ: 0 } },
      { t: 0.55, anchor: [0.55, 0.64], pose: { curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 }, thumbAcross: true, rotationZ: -20 } },
      { t: 1, anchor: [0.4, 0.6], pose: { curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 }, thumbAcross: true, rotationZ: -45 } }
    ],
    matcherRule: {
      curls: { thumb: 0.75, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.08 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.3 },
      pathWaypoints: [
        [0, 0],
        [-0.03, 0.14],
        [-0.1, 0.19],
        [-0.18, 0.13]
      ],
      minDisplacement: 0.1
    }
  },
  {
    key: 'k',
    category: 'alphabet',
    mode: 'static',
    title: 'K',
    glossEn: 'Letter K',
    glossBm: 'Huruf K',
    descriptionEn: 'Spread your index and middle fingers in a V while placing your thumb tip right between their bases.',
    descriptionBm: 'Buka jari telunjuk dan jari tengah seperti huruf V dan letakkan hujung ibu jari di celah pangkal kedua-duanya.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.38, index: 0.05, middle: 0.12, ring: 0.94, pinky: 0.94 },
      spreads: { indexMiddle: 0.45 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.4, index: 0.07, middle: 0.14, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.38, index: 0.25, middle: 0.28, ring: 0.25, pinky: 0.25 },
      minIndexMiddleSpread: 0.2
    }
  },
  {
    key: 'l',
    category: 'alphabet',
    mode: 'static',
    title: 'L',
    glossEn: 'Letter L',
    glossBm: 'Huruf L',
    descriptionEn: 'Extend your index finger straight up and your thumb straight out to the side in an L-shape.',
    descriptionBm: 'Tegakkan jari telunjuk ke atas dan luruskan ibu jari ke sisi membentuk huruf L.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.05, index: 0.04, middle: 0.94, ring: 0.94, pinky: 0.94 },
      spreads: { thumb: 0.85 }
    },
    matcherRule: {
      curls: { thumb: 0.08, index: 0.06, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.28, index: 0.24, middle: 0.25, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'm',
    category: 'alphabet',
    mode: 'static',
    title: 'M',
    glossEn: 'Letter M',
    glossBm: 'Huruf M',
    descriptionEn: 'Tuck your thumb under your index, middle, and ring fingers folded forward; pinky stays tucked beneath.',
    descriptionBm: 'Selitkan ibu jari di bawah tiga jari (telunjuk, tengah, manis) yang dilipat ke hadapan.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 3,
    poseSpec: {
      curls: { thumb: 0.82, index: 0.85, middle: 0.85, ring: 0.85, pinky: 0.96 },
      thumbAcross: true,
      thumbTuckIndex: 3
    },
    matcherRule: {
      curls: { thumb: 0.82, index: 0.86, middle: 0.86, ring: 0.86, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.25 },
      requireThumbAcross: true
    }
  },
  {
    key: 'n',
    category: 'alphabet',
    mode: 'static',
    title: 'N',
    glossEn: 'Letter N',
    glossBm: 'Huruf N',
    descriptionEn: 'Fold your index and middle fingers over your tucked thumb while ring and pinky curl down.',
    descriptionBm: 'Lipat jari telunjuk dan jari tengah di atas ibu jari; jari manis dan kelingking digenggam.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 3,
    poseSpec: {
      curls: { thumb: 0.8, index: 0.85, middle: 0.85, ring: 0.95, pinky: 0.95 },
      thumbAcross: true,
      thumbTuckIndex: 2
    },
    matcherRule: {
      curls: { thumb: 0.8, index: 0.85, middle: 0.85, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.26, middle: 0.26, ring: 0.25, pinky: 0.25 },
      requireThumbAcross: true
    }
  },
  {
    key: 'o',
    category: 'alphabet',
    mode: 'static',
    title: 'O',
    glossEn: 'Letter O',
    glossBm: 'Huruf O',
    descriptionEn: 'Curve all fingertips smoothly to meet your thumb tip, forming a closed O-ring.',
    descriptionBm: 'Lengkungkan semua hujung jari untuk bertemu dengan hujung ibu jari membentuk bulatan O.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.56, index: 0.65, middle: 0.66, ring: 0.68, pinky: 0.7 },
      pinchTo: 'index'
    },
    matcherRule: {
      curls: { thumb: 0.54, index: 0.65, middle: 0.66, ring: 0.68, pinky: 0.7 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pinchTo: 'index'
    }
  },
  {
    key: 'p',
    category: 'alphabet',
    mode: 'static',
    title: 'P',
    glossEn: 'Letter P',
    glossBm: 'Huruf P',
    descriptionEn: 'Make the K handshape (index & middle open, thumb between) and tilt your wrist downward.',
    descriptionBm: 'Bentuk isyarat K (telunjuk dan tengah terbuka dengan ibu jari di celah) dan halakan ke bawah.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.4, index: 0.06, middle: 0.14, ring: 0.94, pinky: 0.94 },
      spreads: { indexMiddle: 0.42 },
      thumbAcross: true,
      rotationZ: 155
    },
    matcherRule: {
      curls: { thumb: 0.42, index: 0.08, middle: 0.16, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.38, index: 0.25, middle: 0.28, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: 155,
      tiltToleranceDeg: 55
    }
  },
  {
    key: 'q',
    category: 'alphabet',
    mode: 'static',
    title: 'Q',
    glossEn: 'Letter Q',
    glossBm: 'Huruf Q',
    descriptionEn: 'Point your index finger and thumb straight downward together, keeping the remaining three fingers closed.',
    descriptionBm: 'Halakan jari telunjuk dan ibu jari ke bawah bersama-sama sambil jari lain digenggam.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.15, index: 0.06, middle: 0.94, ring: 0.94, pinky: 0.94 },
      rotationZ: 165
    },
    matcherRule: {
      curls: { thumb: 0.18, index: 0.08, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.32, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: 165,
      tiltToleranceDeg: 55
    }
  },
  {
    key: 'r',
    category: 'alphabet',
    mode: 'static',
    title: 'R',
    glossEn: 'Letter R',
    glossBm: 'Huruf R',
    descriptionEn: 'Cross your middle finger cleanly over your upright index finger while curling the other fingers.',
    descriptionBm: 'Silangkan jari tengah di atas jari telunjuk yang tegak sambil menggenggam jari lain.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.78, index: 0.05, middle: 0.08, ring: 0.94, pinky: 0.94 },
      crossIndexMiddle: true,
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.75, index: 0.07, middle: 0.1, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.35, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.25 },
      requireCrossIndexMiddle: true
    }
  },
  {
    key: 's',
    category: 'alphabet',
    mode: 'static',
    title: 'S',
    glossEn: 'Letter S',
    glossBm: 'Huruf S',
    descriptionEn: 'Make a tight fist with all four fingers and fold your thumb firmly across the front of your fingers.',
    descriptionBm: 'Genggam keempat-empat jari dengan rapat dan lipat ibu jari melintasi bahagian hadapan jari.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.85, index: 0.96, middle: 0.96, ring: 0.96, pinky: 0.96 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.82, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.32, index: 0.22, middle: 0.22, ring: 0.22, pinky: 0.22 },
      requireThumbAcross: true
    }
  },
  {
    key: 't',
    category: 'alphabet',
    mode: 'static',
    title: 'T',
    glossEn: 'Letter T',
    glossBm: 'Huruf T',
    descriptionEn: 'Tuck your thumb tip up between your bent index finger and middle finger while making a fist.',
    descriptionBm: 'Selitkan hujung ibu jari di antara jari telunjuk dan jari tengah dalam genggaman.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.65, index: 0.88, middle: 0.94, ring: 0.95, pinky: 0.95 },
      thumbAcross: true,
      thumbTuckIndex: 1
    },
    matcherRule: {
      curls: { thumb: 0.65, index: 0.88, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.25 },
      requireThumbAcross: true
    }
  },
  {
    key: 'u',
    category: 'alphabet',
    mode: 'static',
    title: 'U',
    glossEn: 'Letter U',
    glossBm: 'Huruf U',
    descriptionEn: 'Extend your index and middle fingers straight up pressed closely together; fold ring, pinky, and thumb.',
    descriptionBm: 'Tegakkan jari telunjuk dan jari tengah rapat bersama ke atas; lipat jari manis, kelingking, dan ibu jari.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.78, index: 0.04, middle: 0.04, ring: 0.95, pinky: 0.95 },
      spreads: { indexMiddle: 0.03 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.76, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.24, ring: 0.25, pinky: 0.25 },
      maxIndexMiddleSpread: 0.28,
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'v',
    category: 'alphabet',
    mode: 'static',
    title: 'V',
    glossEn: 'Letter V',
    glossBm: 'Huruf V',
    descriptionEn: 'Raise and spread your index and middle fingers wide into a clear V-shape.',
    descriptionBm: 'Angkat dan buka jari telunjuk serta jari tengah membentuk huruf V yang jelas.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.78, index: 0.04, middle: 0.04, ring: 0.95, pinky: 0.95 },
      spreads: { indexMiddle: 0.72 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.76, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.24, ring: 0.25, pinky: 0.25 },
      minIndexMiddleSpread: 0.3,
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'w',
    category: 'alphabet',
    mode: 'static',
    title: 'W',
    glossEn: 'Letter W',
    glossBm: 'Huruf W',
    descriptionEn: 'Spread your index, middle, and ring fingers straight up while your thumb holds down your pinky.',
    descriptionBm: 'Tegakkan dan buka tiga jari (telunjuk, tengah, manis) manakala ibu jari menahan jari kelingking.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.75, index: 0.04, middle: 0.04, ring: 0.05, pinky: 0.92 },
      spreads: { indexMiddle: 0.45, middleRing: 0.45 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.07, pinky: 0.9 },
      curlTolerance: { thumb: 0.38, index: 0.24, middle: 0.24, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: 'x',
    category: 'alphabet',
    mode: 'static',
    title: 'X',
    glossEn: 'Letter X',
    glossBm: 'Huruf X',
    descriptionEn: 'Curl your index finger into a hook while keeping the middle, ring, and pinky fingers closed.',
    descriptionBm: 'Lengkungkan jari telunjuk seperti cangkuk sambil menutup jari tengah, manis, dan kelingking.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.72, index: 0.48, middle: 0.95, ring: 0.95, pinky: 0.95 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.72, index: 0.48, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.25, ring: 0.25, pinky: 0.25 }
    }
  },
  {
    key: 'y',
    category: 'alphabet',
    mode: 'static',
    title: 'Y',
    glossEn: 'Letter Y',
    glossBm: 'Huruf Y',
    descriptionEn: 'Extend your thumb and pinky wide outward while folding the middle three fingers cleanly into your palm.',
    descriptionBm: 'Luruskan ibu jari dan kelingking ke luar sambil melipat tiga jari tengah ke tapak tangan.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.05, index: 0.94, middle: 0.95, ring: 0.95, pinky: 0.05 },
      spreads: { thumb: 0.85 }
    },
    matcherRule: {
      curls: { thumb: 0.08, index: 0.93, middle: 0.94, ring: 0.94, pinky: 0.08 },
      curlTolerance: { thumb: 0.3, index: 0.25, middle: 0.25, ring: 0.25, pinky: 0.26 },
      targetTiltDeg: 0,
      tiltToleranceDeg: 45
    }
  },
  {
    key: 'z',
    category: 'alphabet',
    mode: 'dynamic',
    title: 'Z',
    glossEn: 'Letter Z',
    glossBm: 'Huruf Z',
    descriptionEn: 'Point your index finger out and draw a crisp Z in the air: right, diagonal down-left, then right.',
    descriptionBm: 'Tegakkan jari telunjuk dan lakarkan huruf Z di udara: ke kanan, serong ke kiri-bawah, kemudian ke kanan.',
    facialCueEn: 'Follow the 3-stroke Z trail cleanly with your index finger.',
    facialCueBm: 'Ikut laluan Z tiga garisan dengan jari telunjuk anda.',
    difficulty: 2,
    motionKeyframes: [
      { t: 0, anchor: [0.38, 0.42], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } },
      { t: 0.33, anchor: [0.62, 0.42], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } },
      { t: 0.67, anchor: [0.38, 0.64], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } },
      { t: 1, anchor: [0.62, 0.64], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.74, index: 0.08, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.2, 0],
        [0, 0.2],
        [0.2, 0.2]
      ],
      minDisplacement: 0.12
    }
  }
];

const NUMBER_TEMPLATES: BaseAlphaNumTemplate[] = [
  {
    key: '0',
    category: 'number',
    mode: 'static',
    title: '0',
    glossEn: 'Zero',
    glossBm: 'Sifar (0)',
    descriptionEn: 'Touch all curved fingertips to your thumb tip in an upright O shape.',
    descriptionBm: 'Temukan semua hujung jari yang melengkung dengan ibu jari membentuk bulatan O.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: { curls: { thumb: 0.56, index: 0.66, middle: 0.67, ring: 0.68, pinky: 0.7 }, pinchTo: 'index' },
    matcherRule: {
      curls: { thumb: 0.54, index: 0.65, middle: 0.66, ring: 0.68, pinky: 0.7 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pinchTo: 'index'
    }
  },
  {
    key: '1',
    category: 'number',
    mode: 'static',
    title: '1',
    glossEn: 'One',
    glossBm: 'Satu (1)',
    descriptionEn: 'Point your index finger straight up; curl middle, ring, and pinky with thumb folded over.',
    descriptionBm: 'Tegakkan jari telunjuk ke atas; genggam jari tengah, manis, dan kelingking.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: { curls: { thumb: 0.76, index: 0.04, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
    matcherRule: {
      curls: { thumb: 0.74, index: 0.06, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.25, ring: 0.25, pinky: 0.25 },
      targetTiltDeg: 0,
      tiltToleranceDeg: 40
    }
  },
  {
    key: '2',
    category: 'number',
    mode: 'static',
    title: '2',
    glossEn: 'Two',
    glossBm: 'Dua (2)',
    descriptionEn: 'Raise and spread your index and middle fingers in a V while keeping ring, pinky, and thumb folded.',
    descriptionBm: 'Tegakkan dan buka jari telunjuk dan jari tengah sambil melipat jari lain.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.78, index: 0.04, middle: 0.04, ring: 0.95, pinky: 0.95 },
      spreads: { indexMiddle: 0.7 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.76, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.24, ring: 0.25, pinky: 0.25 },
      minIndexMiddleSpread: 0.28
    }
  },
  {
    key: '3',
    category: 'number',
    mode: 'static',
    title: '3',
    glossEn: 'Three',
    glossBm: 'Tiga (3)',
    descriptionEn: 'Extend your thumb, index, and middle fingers out clearly while folding ring and pinky down.',
    descriptionBm: 'Luruskan ibu jari, jari telunjuk, dan jari tengah; lipat jari manis dan kelingking ke bawah.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.06, index: 0.04, middle: 0.04, ring: 0.94, pinky: 0.94 },
      spreads: { thumb: 0.75, indexMiddle: 0.45 }
    },
    matcherRule: {
      curls: { thumb: 0.08, index: 0.06, middle: 0.06, ring: 0.93, pinky: 0.94 },
      curlTolerance: { thumb: 0.3, index: 0.24, middle: 0.24, ring: 0.25, pinky: 0.25 }
    }
  },
  {
    key: '4',
    category: 'number',
    mode: 'static',
    title: '4',
    glossEn: 'Four',
    glossBm: 'Empat (4)',
    descriptionEn: 'Raise and spread your four fingers upward while tucking your thumb across the palm.',
    descriptionBm: 'Tegakkan dan renggangkan empat jari ke atas manakala ibu jari dilipat merentasi tapak tangan.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.85, index: 0.04, middle: 0.04, ring: 0.05, pinky: 0.05 },
      spreads: { indexMiddle: 0.42, middleRing: 0.4, ringPinky: 0.42 },
      thumbAcross: true
    },
    matcherRule: {
      curls: { thumb: 0.82, index: 0.06, middle: 0.06, ring: 0.07, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.24, middle: 0.24, ring: 0.25, pinky: 0.26 },
      minIndexMiddleSpread: 0.24,
      requireThumbAcross: true
    }
  },
  {
    key: '5',
    category: 'number',
    mode: 'static',
    title: '5',
    glossEn: 'Five',
    glossBm: 'Lima (5)',
    descriptionEn: 'Open all five fingers wide and relaxed facing forward.',
    descriptionBm: 'Buka kesemua lima jari dengan luas menghadap ke hadapan.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.04, index: 0.04, middle: 0.04, ring: 0.04, pinky: 0.05 },
      spreads: { thumb: 0.85, indexMiddle: 0.48, middleRing: 0.44, ringPinky: 0.48 }
    },
    matcherRule: {
      curls: { thumb: 0.08, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.08 },
      curlTolerance: { thumb: 0.3, index: 0.24, middle: 0.24, ring: 0.24, pinky: 0.25 }
    }
  },
  {
    key: '6',
    category: 'number',
    mode: 'static',
    title: '6',
    glossEn: 'Six',
    glossBm: 'Enam (6)',
    descriptionEn: 'Touch your thumb tip to your pinky tip while extending index, middle, and ring fingers straight up.',
    descriptionBm: 'Temukan hujung ibu jari dengan jari kelingking sambil menegakkan tiga jari lain.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.56, index: 0.04, middle: 0.04, ring: 0.06, pinky: 0.72 },
      spreads: { indexMiddle: 0.3, middleRing: 0.3 },
      pinchTo: 'pinky'
    },
    matcherRule: {
      curls: { thumb: 0.54, index: 0.06, middle: 0.06, ring: 0.08, pinky: 0.7 },
      curlTolerance: { thumb: 0.38, index: 0.25, middle: 0.25, ring: 0.28, pinky: 0.35 },
      pinchTo: 'pinky'
    }
  },
  {
    key: '7',
    category: 'number',
    mode: 'static',
    title: '7',
    glossEn: 'Seven',
    glossBm: 'Tujuh (7)',
    descriptionEn: 'Touch your thumb tip to your ring fingertip while keeping index, middle, and pinky extended.',
    descriptionBm: 'Temukan hujung ibu jari dengan jari manis sambil menegakkan telunjuk, tengah, dan kelingking.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.54, index: 0.04, middle: 0.05, ring: 0.7, pinky: 0.08 },
      pinchTo: 'ring'
    },
    matcherRule: {
      curls: { thumb: 0.52, index: 0.06, middle: 0.07, ring: 0.68, pinky: 0.1 },
      curlTolerance: { thumb: 0.38, index: 0.25, middle: 0.25, ring: 0.35, pinky: 0.28 },
      pinchTo: 'ring'
    }
  },
  {
    key: '8',
    category: 'number',
    mode: 'static',
    title: '8',
    glossEn: 'Eight',
    glossBm: 'Lapan (8)',
    descriptionEn: 'Touch your thumb tip to your middle fingertip while keeping index, ring, and pinky extended.',
    descriptionBm: 'Temukan hujung ibu jari dengan jari tengah sambil menegakkan jari telunjuk, manis, dan kelingking.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 2,
    poseSpec: {
      curls: { thumb: 0.5, index: 0.05, middle: 0.68, ring: 0.06, pinky: 0.08 },
      pinchTo: 'middle'
    },
    matcherRule: {
      curls: { thumb: 0.48, index: 0.07, middle: 0.66, ring: 0.08, pinky: 0.1 },
      curlTolerance: { thumb: 0.38, index: 0.25, middle: 0.35, ring: 0.28, pinky: 0.28 },
      pinchTo: 'middle'
    }
  },
  {
    key: '9',
    category: 'number',
    mode: 'static',
    title: '9',
    glossEn: 'Nine',
    glossBm: 'Sembilan (9)',
    descriptionEn: 'Touch your thumb tip to your index fingertip (like F) while keeping middle, ring, and pinky extended.',
    descriptionBm: 'Temukan hujung ibu jari dengan jari telunjuk (seperti F) sambil menegakkan tiga jari lain.',
    facialCueEn: DEFAULT_FACIAL_EN,
    facialCueBm: DEFAULT_FACIAL_BM,
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 },
      spreads: { middleRing: 0.25, ringPinky: 0.25 },
      pinchTo: 'index'
    },
    matcherRule: {
      curls: { thumb: 0.45, index: 0.6, middle: 0.06, ring: 0.06, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.32, middle: 0.24, ring: 0.24, pinky: 0.25 },
      pinchTo: 'index'
    }
  }
];

export function buildAlphabetAndNumbersForLanguage(languageId: 'bim' | 'asl'): SignDefinition[] {
  const langLabelEn = languageId === 'bim' ? 'BIM' : 'ASL';
  const langLabelBm = languageId === 'bim' ? 'BIM' : 'ASL';

  return [...ALPHA_TEMPLATES, ...NUMBER_TEMPLATES].map((tpl) => ({
    id: `${languageId}-${tpl.category}-${tpl.key}`,
    languageId,
    category: tpl.category,
    mode: tpl.mode,
    hands: 1,
    title: tpl.title,
    glossEn: `${tpl.glossEn} (${langLabelEn})`,
    glossBm: `${tpl.glossBm} (${langLabelBm})`,
    descriptionEn: tpl.descriptionEn,
    descriptionBm: tpl.descriptionBm,
    facialCueEn: tpl.facialCueEn,
    facialCueBm: tpl.facialCueBm,
    difficulty: tpl.difficulty,
    poseSpec: tpl.poseSpec,
    motionKeyframes: tpl.motionKeyframes,
    matcherRule: tpl.matcherRule
  }));
}
