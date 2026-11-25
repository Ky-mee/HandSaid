import type { SignDefinition } from './types';

export const BIM_EXTRA_SIGNS: SignDefinition[] = [
  // Everyday (+6)
  {
    id: 'bim-everyday-selamat-malam',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Selamat Malam',
    glossEn: 'Good night',
    glossBm: 'Selamat malam',
    descriptionEn:
      'Hold your non-dominant forearm flat as the horizon, then arc your dominant open hand softly downward past it like the setting sun.',
    descriptionBm:
      'Letakkan lengan bawah bukan dominan secara mendatar sebagai ufuk, kemudian turunkan tapak tangan dominan perlahan ke bawah seperti matahari terbenam.',
    facialCueEn: 'Calm, gentle expression and relaxed eyelids.',
    facialCueBm: 'Ekspresi tenang dan lembut.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.42],
        pose: { curls: { thumb: 0.14, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 88 }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.66],
        pose: { curls: { thumb: 0.14, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -25 },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 88 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.16, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.22]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'bim-everyday-tidur',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Tidur',
    glossEn: 'Sleep',
    glossBm: 'Tidur',
    descriptionEn:
      'Press both open palms together beside your tilted cheek as if resting your head on a pillow, or sweep an open hand down in front of your face while closing your fingers.',
    descriptionBm:
      'Rapikan tapak tangan di sisi pipi sambil mencondongkan kepala sedikit seperti berbaring tidur.',
    facialCueEn: 'Tilt head softly to the side with relaxed sleepy eyes.',
    facialCueBm: 'Condongkan kepala sedikit ke sisi dengan mata yang tenang.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.34], pose: { curls: { thumb: 0.18, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 } } },
      { t: 1, anchor: [0.54, 0.44], pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' } }
    ],
    matcherRule: {
      curls: { thumb: 0.35, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35 },
      curlTolerance: { thumb: 0.45, index: 0.45, middle: 0.45, ring: 0.45, pinky: 0.45 },
      pathWaypoints: [
        [0, 0],
        [0.04, 0.1]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'bim-everyday-kerja',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Kerja',
    glossEn: 'Work',
    glossBm: 'Kerja',
    descriptionEn:
      'Form closed S-fists on both hands and tap the heel of your dominant fist onto the back of your non-dominant wrist twice.',
    descriptionBm:
      'Genggam kedua-dua tangan (bentuk S) dan ketukkan pangkal tangan dominan ke belakang pergelangan tangan sebelah lagi.',
    facialCueEn: 'Focused, purposeful expression.',
    facialCueBm: 'Ekspresi fokus dan bersungguh-sungguh.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.46],
        pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      },
      {
        t: 0.5,
        anchor: [0.48, 0.56],
        pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.46],
        pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.78, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.08, 0.1],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'bim-everyday-sekolah',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Sekolah',
    glossEn: 'School',
    glossBm: 'Sekolah',
    descriptionEn:
      'Hold your non-dominant open palm flat facing up and lightly clap your dominant flat palm down onto it twice.',
    descriptionBm:
      'Tadahkan tapak tangan bukan dominan dan tepukkan tapak tangan dominan ke atasnya dua kali dengan kemas.',
    facialCueEn: 'Attentive, bright expression.',
    facialCueBm: 'Ekspresi ceria dan bersedia belajar.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.44],
        pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.48, 0.56],
        pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.44],
        pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.16, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.08, 0.12],
        [0, 0]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'bim-everyday-di-mana',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Di Mana?',
    glossEn: 'Where?',
    glossBm: 'Di mana?',
    descriptionEn:
      'Hold your index finger upright and gently wag it side-to-side with inquisitive eyebrows.',
    descriptionBm:
      'Tegakkan jari telunjuk ke atas dan goyangkan perlahan ke kiri dan kanan sambil menyoal.',
    facialCueEn: 'Furrow or raise eyebrows slightly to mark a Wh-question.',
    facialCueBm: 'Kerutkan sedikit kening sebagai tanda soalan.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.44, 0.52], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: -14 } },
      { t: 0.5, anchor: [0.58, 0.52], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: 14 } },
      { t: 1, anchor: [0.44, 0.52], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: -14 } }
    ],
    matcherRule: {
      curls: { thumb: 0.74, index: 0.08, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, 0],
        [0.14, 0],
        [0, 0]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'bim-everyday-bila',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Bila?',
    glossEn: 'When?',
    glossBm: 'Bila?',
    descriptionEn:
      'Hold your non-dominant index finger upright, circle your dominant index finger around it once, and tap the tips together.',
    descriptionBm:
      'Tegakkan jari telunjuk sebelah lagi, pusingkan jari telunjuk dominan mengelilinginya lalu temukan hujung kedua-duanya.',
    facialCueEn: 'Questioning expression with tilted head.',
    facialCueBm: 'Ekspresi bertanya dengan kepala sedikit condong.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.6, 0.48],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.45, 0.56],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      },
      {
        t: 0.5,
        anchor: [0.54, 0.42],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.45, 0.56],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      },
      {
        t: 1,
        anchor: [0.49, 0.53],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.45, 0.56],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.74, index: 0.08, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.06, -0.06],
        [-0.11, 0.05]
      ],
      minDisplacement: 0.06
    }
  },

  // Family & People (8)
  {
    id: 'bim-people-ibu',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 1,
    title: 'Ibu',
    glossEn: 'Mother / Mom',
    glossBm: 'Ibu / Emak',
    descriptionEn:
      'Open all five fingers (5-hand) and gently tap your thumb tip against your chin twice.',
    descriptionBm:
      'Buka kesemua lima jari dan sentuhkan hujung ibu jari perlahan ke dagu sebanyak dua kali.',
    facialCueEn: 'Warm, affectionate smile.',
    facialCueBm: 'Senyuman mesra dan lembut.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.54, 0.44], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 0.5, anchor: [0.49, 0.39], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 1, anchor: [0.54, 0.44], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.1 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.05, -0.05],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },
  {
    id: 'bim-people-ayah',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 1,
    title: 'Ayah',
    glossEn: 'Father / Dad',
    glossBm: 'Ayah / Bapa',
    descriptionEn:
      'Open all five fingers (5-hand) and gently tap your thumb tip against the center of your forehead twice.',
    descriptionBm:
      'Buka kesemua lima jari dan sentuhkan hujung ibu jari perlahan ke dahi sebanyak dua kali.',
    facialCueEn: 'Warm, respectful smile.',
    facialCueBm: 'Senyuman mesra dan hormat.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.54, 0.34], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 0.5, anchor: [0.49, 0.29], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 1, anchor: [0.54, 0.34], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.1 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.05, -0.05],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },
  {
    id: 'bim-people-keluarga',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Keluarga',
    glossEn: 'Family',
    glossBm: 'Keluarga',
    descriptionEn:
      'Form F-hands on both sides with thumb and index touching in front, then sweep both hands outward in a circle until pinky sides meet.',
    descriptionBm:
      'Bentuk huruf F pada kedua-dua tangan di hadapan, kemudian gerakkan melengkung ke luar membentuk bulatan hingga jari kelingking bertemu.',
    facialCueEn: 'Warm, inclusive smile.',
    facialCueBm: 'Senyuman mesra penuh kasih.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.54, 0.54],
        pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.46, 0.54],
          pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' }
        }
      },
      {
        t: 0.5,
        anchor: [0.66, 0.54],
        pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.34, 0.54],
          pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' }
        }
      },
      {
        t: 1,
        anchor: [0.55, 0.56],
        pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.45, 0.56],
          pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.45, index: 0.6, middle: 0.08, ring: 0.08, pinky: 0.1 },
      curlTolerance: { thumb: 0.38, index: 0.34, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pinchTo: 'index',
      pathWaypoints: [
        [0, 0],
        [0.12, 0],
        [0.01, 0.02]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'bim-people-adik',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 1,
    title: 'Adik',
    glossEn: 'Younger sibling',
    glossBm: 'Adik',
    descriptionEn:
      'Raise your pinky finger (I-hand) or flat hand and lower it smoothly downward to indicate younger height/age.',
    descriptionBm:
      'Angkat jari kelingking (atau tapak tangan kecil) dan turunkan perlahan ke bawah menandakan adik yang lebih muda.',
    facialCueEn: 'Friendly, gentle expression.',
    facialCueBm: 'Ekspresi mesra dan ceria.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.54, 0.45], pose: { curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 }, thumbAcross: true } },
      { t: 1, anchor: [0.54, 0.65], pose: { curls: { thumb: 0.78, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.05 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.76, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.08 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.3 },
      pathWaypoints: [
        [0, 0],
        [0, 0.18]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'bim-people-abang',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 1,
    title: 'Abang',
    glossEn: 'Older brother',
    glossBm: 'Abang',
    descriptionEn:
      'Form an L-hand near your temple/forehead and bring it forward down to chest space.',
    descriptionBm:
      'Bentuk huruf L berhampiran pelipis atau dahi lalu bawa ke hadapan paras dada.',
    facialCueEn: 'Confident, warm expression.',
    facialCueBm: 'Ekspresi mesra dan yakin.',
    difficulty: 2,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.34], pose: { curls: { thumb: 0.06, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.8 } } },
      { t: 1, anchor: [0.54, 0.56], pose: { curls: { thumb: 0.06, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.8 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.1, index: 0.08, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.32, index: 0.26, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.04, 0.2]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'bim-people-guru',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Guru',
    glossEn: 'Teacher',
    glossBm: 'Guru / Cikgu',
    descriptionEn:
      'Hold flattened-O hands near both temples and move them smoothly forward, then lower open palms downward for the person marker.',
    descriptionBm:
      'Letakkan tangan bentuk O leper berhampiran pelipis dan gerakkan ke hadapan, kemudian turunkan tapak tangan ke bawah.',
    facialCueEn: 'Engaged, guiding expression.',
    facialCueBm: 'Ekspresi membimbing yang ramah.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.38],
        pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.42, 0.38],
          pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' }
        }
      },
      {
        t: 0.5,
        anchor: [0.6, 0.48],
        pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.4, 0.48],
          pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 1,
        anchor: [0.6, 0.68],
        pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.4, 0.68],
          pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.28, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      curlTolerance: { thumb: 0.45, index: 0.45, middle: 0.45, ring: 0.45, pinky: 0.45 },
      pathWaypoints: [
        [0, 0],
        [0.02, 0.1],
        [0.02, 0.28]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'bim-people-doktor',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Doktor',
    glossEn: 'Doctor',
    glossBm: 'Doktor',
    descriptionEn:
      'Hold your non-dominant palm facing up and tap the inside of its wrist gently twice with your dominant M/flat fingertips (checking pulse).',
    descriptionBm:
      'Tadahkan tapak tangan bukan dominan dan sentuhkan hujung jari tangan dominan ke pergelangan tangan seperti memeriksa nadi.',
    facialCueEn: 'Calm, attentive expression.',
    facialCueBm: 'Ekspresi tenang dan prihatin.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.48],
        pose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.48, 0.6],
        pose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.48],
        pose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.24, index: 0.18, middle: 0.18, ring: 0.18, pinky: 0.85 },
      curlTolerance: { thumb: 0.4, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.4 },
      pathWaypoints: [
        [0, 0],
        [-0.08, 0.12],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'bim-people-bayi',
    languageId: 'bim',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Bayi',
    glossEn: 'Baby',
    glossBm: 'Bayi',
    descriptionEn:
      'Cradle both forearms together in front of your chest and rock them gently side-to-side.',
    descriptionBm:
      'Silangkan kedua-dua lengan di hadapan dada seperti mendodoi dan buaikan perlahan ke kiri dan kanan.',
    facialCueEn: 'Soft, loving smile.',
    facialCueBm: 'Senyuman lembut penuh kasih sayang.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.56],
        pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.4, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.62, 0.56],
        pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.46, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.56],
        pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.4, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.2, index: 0.14, middle: 0.14, ring: 0.14, pinky: 0.14 },
      curlTolerance: { thumb: 0.4, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35 },
      pathWaypoints: [
        [0, 0],
        [0.06, 0],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },

  // Feelings & Needs (8)
  {
    id: 'bim-feelings-gembira',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Gembira',
    glossEn: 'Happy',
    glossBm: 'Gembira',
    descriptionEn:
      'Brush both open flat palms upward twice across your chest with light, joyful energy.',
    descriptionBm:
      'Sapukan kedua-dua tapak tangan terbuka ke atas di bahagian dada dengan ceria sebanyak dua kali.',
    facialCueEn: 'Bright, joyful smile with lifted cheeks.',
    facialCueBm: 'Senyuman lebar yang ceria dan bertenaga.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.56, 0.44],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } },
        secondHand: {
          anchor: [0.44, 0.44],
          pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, -0.18],
        [0, 0]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'bim-feelings-sedih',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Sedih',
    glossEn: 'Sad',
    glossBm: 'Sedih',
    descriptionEn:
      'Hold both spread open hands in front of your face and lower them slowly downward while tilting your head slightly down.',
    descriptionBm:
      'Letakkan kedua-dua tapak tangan terbuka di hadapan wajah dan turunkan perlahan ke bawah dengan ekspresi sayu.',
    facialCueEn: 'Soft downturned mouth and slightly tilted head.',
    facialCueBm: 'Ekspresi wajah sayu dengan kepala sedikit tunduk.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.4],
        pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } },
        secondHand: {
          anchor: [0.44, 0.4],
          pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.14, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.2]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'bim-feelings-sakit',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Sakit',
    glossEn: 'Pain / Hurt',
    glossBm: 'Sakit',
    descriptionEn:
      'Point both index fingers toward each other in front of your chest and twist or pulse them sharply inward.',
    descriptionBm:
      'Halakan kedua-dua jari telunjuk ke arah satu sama lain di hadapan dada dan gerakkan mendekat secara berulang.',
    facialCueEn: 'Show discomfort with slightly furrowed brows.',
    facialCueBm: 'Kerutkan kening sedikit menandakan rasa sakit.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.6, 0.54],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -80 },
        secondHand: {
          anchor: [0.4, 0.54],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 80 }
        }
      },
      {
        t: 0.5,
        anchor: [0.53, 0.54],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -60 },
        secondHand: {
          anchor: [0.47, 0.54],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 60 }
        }
      },
      {
        t: 1,
        anchor: [0.6, 0.54],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -80 },
        secondHand: {
          anchor: [0.4, 0.54],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 80 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.74, index: 0.08, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.07, 0],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },
  {
    id: 'bim-feelings-lapar',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 1,
    title: 'Lapar',
    glossEn: 'Hungry',
    glossBm: 'Lapar',
    descriptionEn:
      'Curve your hand into a C-shape facing your chest and slide it smoothly downward from upper chest to stomach.',
    descriptionBm:
      'Lengkungkan tangan membentuk huruf C menghadap dada dan gerakkan ke bawah menghala ke perut.',
    facialCueEn: 'Slightly eager or hungry expression.',
    facialCueBm: 'Ekspresi sedikit lesu atau lapar.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.44], pose: { curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 } } },
      { t: 1, anchor: [0.5, 0.66], pose: { curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 },
      curlTolerance: { thumb: 0.36, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pathWaypoints: [
        [0, 0],
        [0, 0.2]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'bim-feelings-penat',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Penat',
    glossEn: 'Tired',
    glossBm: 'Penat / Letih',
    descriptionEn:
      'Rest both curved open palms gently near your upper chest/shoulders, then let your hands and wrists droop softly downward.',
    descriptionBm:
      'Sentuhkan hujung jari kedua-dua tangan di bahagian dada dan turunkan perlahan ke bawah seperti keletihan.',
    facialCueEn: 'Relaxed shoulders and slightly tired eyes.',
    facialCueBm: 'Rehatkan bahu dengan ekspresi wajah yang letih.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.48],
        pose: { curls: { thumb: 0.25, index: 0.32, middle: 0.32, ring: 0.32, pinky: 0.32 } },
        secondHand: {
          anchor: [0.42, 0.48],
          pose: { curls: { thumb: 0.25, index: 0.32, middle: 0.32, ring: 0.32, pinky: 0.32 } }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.66],
        pose: { curls: { thumb: 0.3, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.42 } },
        secondHand: {
          anchor: [0.42, 0.66],
          pose: { curls: { thumb: 0.3, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.42 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.28, index: 0.36, middle: 0.36, ring: 0.36, pinky: 0.36 },
      curlTolerance: { thumb: 0.4, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35 },
      pathWaypoints: [
        [0, 0],
        [0, 0.16]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'bim-feelings-faham',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 1,
    title: 'Faham',
    glossEn: 'Understand',
    glossBm: 'Faham',
    descriptionEn:
      'Place a closed fist near your forehead/temple and flick your index finger straight upward like a lightbulb turning on.',
    descriptionBm:
      'Letakkan genggaman tangan di sisi dahi kemudian tegakkan jari telunjuk ke atas dengan pantas menandakan faham.',
    facialCueEn: 'Light affirmative nod and lifted eyebrows.',
    facialCueBm: 'Anggukan ringan bersama kening yang terangkat.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.52, 0.36], pose: { curls: { thumb: 0.8, index: 0.94, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } },
      { t: 1, anchor: [0.52, 0.32], pose: { curls: { thumb: 0.76, index: 0.04, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.76, index: 0.25, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.45, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, 0],
        [0, -0.04]
      ],
      minDisplacement: 0.03
    }
  },
  {
    id: 'bim-feelings-tidak-faham',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 1,
    title: 'Tidak Faham',
    glossEn: 'Do not understand / Confused',
    glossBm: 'Tidak faham / Keliru',
    descriptionEn:
      'Curve your open hand into a claw near your forehead and twist or sway it gently while furrowing your brows.',
    descriptionBm:
      'Lengkungkan jari di hadapan dahi dan gerakkan sedikit ke kiri dan kanan sambil mengerutkan kening.',
    facialCueEn: 'Furrowed brows and puzzled head tilt.',
    facialCueBm: 'Kerutkan kening dan condongkan kepala tanda keliru.',
    difficulty: 2,
    motionKeyframes: [
      { t: 0, anchor: [0.48, 0.36], pose: { curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 }, rotationZ: -15 } },
      { t: 0.5, anchor: [0.58, 0.36], pose: { curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 }, rotationZ: 15 } },
      { t: 1, anchor: [0.48, 0.36], pose: { curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 }, rotationZ: -15 } }
    ],
    matcherRule: {
      curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 },
      curlTolerance: { thumb: 0.38, index: 0.32, middle: 0.32, ring: 0.32, pinky: 0.32 },
      pathWaypoints: [
        [0, 0],
        [0.1, 0],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'bim-feelings-tunggu',
    languageId: 'bim',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Tunggu',
    glossEn: 'Wait',
    glossBm: 'Tunggu',
    descriptionEn:
      'Hold both spread open palms facing upward in front of your torso and wiggle your fingers lightly.',
    descriptionBm:
      'Tadahkan kedua-dua tapak tangan terbuka ke atas di hadapan badan dan gerakkan jari perlahan menandakan tunggu.',
    facialCueEn: 'Patient, calm expression.',
    facialCueBm: 'Ekspresi sabar dan tenang.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.56],
        pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.58, 0.52],
        pose: { curls: { thumb: 0.18, index: 0.25, middle: 0.12, ring: 0.25, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } },
        secondHand: {
          anchor: [0.42, 0.52],
          pose: { curls: { thumb: 0.18, index: 0.12, middle: 0.25, ring: 0.12, pinky: 0.25 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.56],
        pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.16, index: 0.18, middle: 0.18, ring: 0.18, pinky: 0.18 },
      curlTolerance: { thumb: 0.38, index: 0.34, middle: 0.34, ring: 0.34, pinky: 0.34 },
      pathWaypoints: [
        [0, 0],
        [0, -0.04],
        [0, 0]
      ],
      minDisplacement: 0.03
    }
  }
];

export const ASL_EXTRA_SIGNS: SignDefinition[] = [
  // Everyday (+6)
  {
    id: 'asl-everyday-good-morning',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Good Morning',
    glossEn: 'Good morning',
    glossBm: 'Selamat pagi',
    descriptionEn:
      'Rest your non-dominant hand across your elbow crease, then raise your dominant open palm smoothly upward like the morning sun.',
    descriptionBm:
      'Letakkan tapak tangan bukan dominan di lipatan siku dan angkat tangan dominan terbuka ke atas seperti matahari terbit.',
    facialCueEn: 'Warm morning smile with lifted eyebrows.',
    facialCueBm: 'Senyuman pagi yang ceria.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.64],
        pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.42, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 88 }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.38],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } },
        secondHand: {
          anchor: [0.42, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 88 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, -0.22]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-everyday-sleep',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Sleep',
    glossEn: 'Sleep',
    glossBm: 'Tidur',
    descriptionEn:
      'Start with an open spread hand in front of your face and draw it smoothly down toward your chin while closing into a flattened-O.',
    descriptionBm:
      'Mulakan dengan tangan terbuka di hadapan muka lalu turunkan perlahan ke dagu sambil merapatkan hujung jari.',
    facialCueEn: 'Calm, drowsy expression.',
    facialCueBm: 'Ekspresi tenang dan mengantuk.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.34], pose: { curls: { thumb: 0.14, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 } } },
      { t: 1, anchor: [0.52, 0.48], pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' } }
    ],
    matcherRule: {
      curls: { thumb: 0.35, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35 },
      curlTolerance: { thumb: 0.45, index: 0.45, middle: 0.45, ring: 0.45, pinky: 0.45 },
      pathWaypoints: [
        [0, 0],
        [0.02, 0.12]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-everyday-work',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Work',
    glossEn: 'Work',
    glossBm: 'Kerja',
    descriptionEn:
      'Form two closed S-fists and tap the heel of your dominant fist onto the back of your non-dominant wrist twice.',
    descriptionBm:
      'Bentuk dua genggaman S dan ketukkan pangkal tangan dominan ke pergelangan tangan sebelah lagi.',
    facialCueEn: 'Focused expression.',
    facialCueBm: 'Ekspresi fokus.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.46],
        pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      },
      {
        t: 0.5,
        anchor: [0.48, 0.56],
        pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.46],
        pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.78, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.08, 0.1],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-everyday-school',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'School',
    glossEn: 'School',
    glossBm: 'Sekolah',
    descriptionEn:
      'Hold your non-dominant palm flat facing up and clap your dominant palm neatly onto it twice.',
    descriptionBm:
      'Tadahkan tapak tangan bukan dominan dan tepukkan tapak tangan dominan ke atasnya dua kali.',
    facialCueEn: 'Bright, attentive expression.',
    facialCueBm: 'Ekspresi ceria dan fokus.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.44],
        pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.48, 0.56],
        pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.44],
        pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.16, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.08, 0.12],
        [0, 0]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'asl-everyday-where',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Where?',
    glossEn: 'Where?',
    glossBm: 'Di mana?',
    descriptionEn:
      'Point your index finger upward and wag it smoothly side-to-side while lowering your eyebrows slightly.',
    descriptionBm:
      'Tegakkan jari telunjuk ke atas dan goyangkan ke kiri dan kanan sambil mengerutkan sedikit kening.',
    facialCueEn: 'Furrowed brows for an ASL Wh-question.',
    facialCueBm: 'Kerutkan kening sedikit untuk soalan Wh.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.44, 0.52], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: -14 } },
      { t: 0.5, anchor: [0.58, 0.52], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: 14 } },
      { t: 1, anchor: [0.44, 0.52], pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: -14 } }
    ],
    matcherRule: {
      curls: { thumb: 0.74, index: 0.08, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, 0],
        [0.14, 0],
        [0, 0]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'asl-everyday-what',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'What?',
    glossEn: 'What?',
    glossBm: 'Apa?',
    descriptionEn:
      'Hold both open palms facing upward and shake them gently side-to-side with furrowed Wh-question brows.',
    descriptionBm:
      'Tadahkan kedua-dua tapak tangan ke atas dan goyangkan perlahan ke sisi sambil bertanya.',
    facialCueEn: 'Furrowed eyebrows and slight head tilt.',
    facialCueBm: 'Kerutkan kening dengan kepala sedikit condong.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.6, 0.56],
        pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.4, 0.56],
          pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.66, 0.56],
        pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.34, 0.56],
          pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      },
      {
        t: 1,
        anchor: [0.6, 0.56],
        pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.4, 0.56],
          pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.16, index: 0.14, middle: 0.14, ring: 0.14, pinky: 0.14 },
      curlTolerance: { thumb: 0.35, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pathWaypoints: [
        [0, 0],
        [0.06, 0],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },

  // Family & People (8)
  {
    id: 'asl-people-mother',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 1,
    title: 'Mother',
    glossEn: 'Mother / Mom',
    glossBm: 'Ibu / Emak',
    descriptionEn:
      'Open all five fingers (5-hand) and gently tap your thumb tip against your chin twice.',
    descriptionBm:
      'Buka lima jari dan sentuhkan hujung ibu jari perlahan ke dagu dua kali.',
    facialCueEn: 'Warm, affectionate smile.',
    facialCueBm: 'Senyuman mesra.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.54, 0.44], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 0.5, anchor: [0.49, 0.39], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 1, anchor: [0.54, 0.44], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.1 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.05, -0.05],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },
  {
    id: 'asl-people-father',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 1,
    title: 'Father',
    glossEn: 'Father / Dad',
    glossBm: 'Ayah / Bapa',
    descriptionEn:
      'Open all five fingers (5-hand) and gently tap your thumb tip against your forehead twice.',
    descriptionBm:
      'Buka lima jari dan sentuhkan hujung ibu jari perlahan ke dahi dua kali.',
    facialCueEn: 'Warm, confident smile.',
    facialCueBm: 'Senyuman mesra dan yakin.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.54, 0.34], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 0.5, anchor: [0.49, 0.29], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } },
      { t: 1, anchor: [0.54, 0.34], pose: { curls: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.06 }, spreads: { thumb: 0.75, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.1 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.05, -0.05],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },
  {
    id: 'asl-people-family',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Family',
    glossEn: 'Family',
    glossBm: 'Keluarga',
    descriptionEn:
      'Start with both F-hands touching in front of your chest, then arc them smoothly outward to form a circle.',
    descriptionBm:
      'Mulakan dengan bentuk F pada kedua-dua tangan di hadapan dada, lalu gerakkan melingkar hingga bertemu semula.',
    facialCueEn: 'Warm, happy smile.',
    facialCueBm: 'Senyuman mesra penuh kasih.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.54, 0.54],
        pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.46, 0.54],
          pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' }
        }
      },
      {
        t: 0.5,
        anchor: [0.66, 0.54],
        pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.34, 0.54],
          pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' }
        }
      },
      {
        t: 1,
        anchor: [0.55, 0.56],
        pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.45, 0.56],
          pose: { curls: { thumb: 0.45, index: 0.62, middle: 0.05, ring: 0.05, pinky: 0.06 }, pinchTo: 'index' }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.45, index: 0.6, middle: 0.08, ring: 0.08, pinky: 0.1 },
      curlTolerance: { thumb: 0.38, index: 0.34, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pinchTo: 'index',
      pathWaypoints: [
        [0, 0],
        [0.12, 0],
        [0.01, 0.02]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'asl-people-sister',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Sister',
    glossEn: 'Sister',
    glossBm: 'Kakak / Adik perempuan',
    descriptionEn:
      'Start with an L-hand at your chin, then bring both index fingers down parallel side-by-side.',
    descriptionBm:
      'Mulakan dengan bentuk L di dagu, kemudian turunkan jari telunjuk selari bersama tangan sebelah lagi.',
    facialCueEn: 'Friendly smile.',
    facialCueBm: 'Senyuman ramah.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.54, 0.42],
        pose: { curls: { thumb: 0.06, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.8 } },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
        }
      },
      {
        t: 1,
        anchor: [0.54, 0.58],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.45, index: 0.08, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.45, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.16]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'asl-people-brother',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Brother',
    glossEn: 'Brother',
    glossBm: 'Abang / Adik lelaki',
    descriptionEn:
      'Start with an L-hand at your forehead, then bring it smoothly down to meet your non-dominant index finger in front.',
    descriptionBm:
      'Mulakan bentuk L di dahi lalu turunkan ke hadapan untuk sejajar dengan jari telunjuk sebelah lagi.',
    facialCueEn: 'Warm smile.',
    facialCueBm: 'Senyuman mesra.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.54, 0.34],
        pose: { curls: { thumb: 0.06, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, spreads: { thumb: 0.8 } },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
        }
      },
      {
        t: 1,
        anchor: [0.54, 0.58],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true },
        secondHand: {
          anchor: [0.44, 0.6],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.45, index: 0.08, middle: 0.93, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.45, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.22]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-people-teacher',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Teacher',
    glossEn: 'Teacher',
    glossBm: 'Guru',
    descriptionEn:
      'Move flattened-O hands forward from both temples (teach), then sweep open palms straight down along your sides (person marker).',
    descriptionBm:
      'Gerakkan tangan bentuk O leper ke hadapan dari kedua-dua pelipis, kemudian turunkan tapak tangan ke bawah.',
    facialCueEn: 'Warm, instructive expression.',
    facialCueBm: 'Ekspresi membimbing dan mesra.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.38],
        pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.42, 0.38],
          pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' }
        }
      },
      {
        t: 0.5,
        anchor: [0.6, 0.48],
        pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.4, 0.48],
          pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 1,
        anchor: [0.6, 0.68],
        pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } },
        secondHand: {
          anchor: [0.4, 0.68],
          pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.28, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      curlTolerance: { thumb: 0.45, index: 0.45, middle: 0.45, ring: 0.45, pinky: 0.45 },
      pathWaypoints: [
        [0, 0],
        [0.02, 0.1],
        [0.02, 0.28]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'asl-people-doctor',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Doctor',
    glossEn: 'Doctor',
    glossBm: 'Doktor',
    descriptionEn:
      'Tap the fingertips of your dominant D/M hand onto the inside of your upturned non-dominant wrist twice.',
    descriptionBm:
      'Ketukkan hujung jari tangan dominan ke bahagian dalam pergelangan tangan sebelah lagi seperti memeriksa nadi.',
    facialCueEn: 'Calm, caring expression.',
    facialCueBm: 'Ekspresi tenang dan prihatin.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.48],
        pose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.48, 0.6],
        pose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.48],
        pose: { curls: { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.9 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.24, index: 0.18, middle: 0.18, ring: 0.18, pinky: 0.85 },
      curlTolerance: { thumb: 0.4, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.4 },
      pathWaypoints: [
        [0, 0],
        [-0.08, 0.12],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-people-baby',
    languageId: 'asl',
    category: 'people',
    mode: 'dynamic',
    hands: 2,
    title: 'Baby',
    glossEn: 'Baby',
    glossBm: 'Bayi',
    descriptionEn:
      'Cradle both forearms together in front of your chest and sway them gently from side to side.',
    descriptionBm:
      'Silangkan kedua-dua lengan di hadapan dada seperti mendodoi dan buaikan perlahan ke kiri dan kanan.',
    facialCueEn: 'Warm, gentle smile.',
    facialCueBm: 'Senyuman lembut dan mesra.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.56],
        pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.4, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.62, 0.56],
        pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.46, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.56],
        pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } },
        secondHand: {
          anchor: [0.4, 0.58],
          pose: { curls: { thumb: 0.2, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.2, index: 0.14, middle: 0.14, ring: 0.14, pinky: 0.14 },
      curlTolerance: { thumb: 0.4, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35 },
      pathWaypoints: [
        [0, 0],
        [0.06, 0],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },

  // Feelings & Needs (8)
  {
    id: 'asl-feelings-happy',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Happy',
    glossEn: 'Happy',
    glossBm: 'Gembira',
    descriptionEn:
      'Brush both open flat palms lightly upward over your chest twice with uplifting energy.',
    descriptionBm:
      'Sapukan kedua-dua tapak tangan terbuka ke atas di hadapan dada sebanyak dua kali dengan ceria.',
    facialCueEn: 'Joyful, bright smile.',
    facialCueBm: 'Senyuman lebar dan gembira.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.56, 0.44],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } },
        secondHand: {
          anchor: [0.44, 0.44],
          pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, -0.18],
        [0, 0]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'asl-feelings-sad',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Sad',
    glossEn: 'Sad',
    glossBm: 'Sedih',
    descriptionEn:
      'Hold both spread open hands in front of your face and lower them smoothly downward.',
    descriptionBm:
      'Letakkan kedua-dua tangan terbuka di hadapan wajah dan turunkan perlahan ke bawah.',
    facialCueEn: 'Soft downturned expression and slight downward gaze.',
    facialCueBm: 'Ekspresi wajah sayu dan pandangan tunduk.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.4],
        pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } },
        secondHand: {
          anchor: [0.44, 0.4],
          pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } },
        secondHand: {
          anchor: [0.44, 0.62],
          pose: { curls: { thumb: 0.1, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, spreads: { indexMiddle: 0.35, middleRing: 0.35, ringPinky: 0.35 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.14, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.2]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-feelings-hurt',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Hurt / Pain',
    glossEn: 'Hurt / Pain',
    glossBm: 'Sakit / Terluka',
    descriptionEn:
      'Point both index fingers toward one another and jab/twist them gently toward the center.',
    descriptionBm:
      'Halakan kedua-dua jari telunjuk ke arah satu sama lain dan gerakkan mendekat secara berulang.',
    facialCueEn: 'Furrowed brows expressing discomfort.',
    facialCueBm: 'Kerutkan kening sedikit menandakan kesakitan.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.6, 0.54],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -80 },
        secondHand: {
          anchor: [0.4, 0.54],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 80 }
        }
      },
      {
        t: 0.5,
        anchor: [0.53, 0.54],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -60 },
        secondHand: {
          anchor: [0.47, 0.54],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 60 }
        }
      },
      {
        t: 1,
        anchor: [0.6, 0.54],
        pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -80 },
        secondHand: {
          anchor: [0.4, 0.54],
          pose: { curls: { thumb: 0.76, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 80 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.74, index: 0.08, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.07, 0],
        [0, 0]
      ],
      minDisplacement: 0.05
    }
  },
  {
    id: 'asl-feelings-hungry',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 1,
    title: 'Hungry',
    glossEn: 'Hungry',
    glossBm: 'Lapar',
    descriptionEn:
      'Cup your hand into a C-shape facing your chest and glide it smoothly down toward your stomach.',
    descriptionBm:
      'Bentuk huruf C menghadap dada dan gerakkan perlahan ke bawah menghala ke perut.',
    facialCueEn: 'Subtle hungry expression.',
    facialCueBm: 'Ekspresi lapar yang semula jadi.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.44], pose: { curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 } } },
      { t: 1, anchor: [0.5, 0.66], pose: { curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 },
      curlTolerance: { thumb: 0.36, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pathWaypoints: [
        [0, 0],
        [0, 0.2]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-feelings-tired',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Tired',
    glossEn: 'Tired',
    glossBm: 'Penat / Letih',
    descriptionEn:
      'Touch both curved hands near your upper chest and let them drop gently downward as your shoulders relax.',
    descriptionBm:
      'Sentuhkan kedua-dua tangan melengkung di bahagian dada lalu turunkan perlahan ke bawah.',
    facialCueEn: 'Relaxed shoulders and slightly drooped eyelids.',
    facialCueBm: 'Rehatkan bahu dan kelihatan letih.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.48],
        pose: { curls: { thumb: 0.25, index: 0.32, middle: 0.32, ring: 0.32, pinky: 0.32 } },
        secondHand: {
          anchor: [0.42, 0.48],
          pose: { curls: { thumb: 0.25, index: 0.32, middle: 0.32, ring: 0.32, pinky: 0.32 } }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.66],
        pose: { curls: { thumb: 0.3, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.42 } },
        secondHand: {
          anchor: [0.42, 0.66],
          pose: { curls: { thumb: 0.3, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.42 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.28, index: 0.36, middle: 0.36, ring: 0.36, pinky: 0.36 },
      curlTolerance: { thumb: 0.4, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35 },
      pathWaypoints: [
        [0, 0],
        [0, 0.16]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'asl-feelings-understand',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 1,
    title: 'Understand',
    glossEn: 'Understand',
    glossBm: 'Faham',
    descriptionEn:
      'Hold a closed fist near your temple and flick your index finger straight up as if an idea clicked.',
    descriptionBm:
      'Bentuk genggaman di sisi dahi dan tegakkan jari telunjuk ke atas dengan pantas menandakan faham.',
    facialCueEn: 'Light nod and raised eyebrows.',
    facialCueBm: 'Anggukan kecil dengan kening terangkat.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.52, 0.36], pose: { curls: { thumb: 0.8, index: 0.94, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } },
      { t: 1, anchor: [0.52, 0.32], pose: { curls: { thumb: 0.76, index: 0.04, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.76, index: 0.25, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.45, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, 0],
        [0, -0.04]
      ],
      minDisplacement: 0.03
    }
  },
  {
    id: 'asl-feelings-confused',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 1,
    title: 'Confused',
    glossEn: 'Confused',
    glossBm: 'Keliru / Tidak faham',
    descriptionEn:
      'Bend your fingers into a loose claw near your forehead and sway/circle gently while furrowing your brows.',
    descriptionBm:
      'Lengkungkan jari di hadapan dahi dan gerakkan sedikit ke sisi dengan ekspresi keliru.',
    facialCueEn: 'Furrowed brows and puzzled look.',
    facialCueBm: 'Kerutkan kening dengan ekspresi tertanya-tanya.',
    difficulty: 2,
    motionKeyframes: [
      { t: 0, anchor: [0.48, 0.36], pose: { curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 }, rotationZ: -15 } },
      { t: 0.5, anchor: [0.58, 0.36], pose: { curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 }, rotationZ: 15 } },
      { t: 1, anchor: [0.48, 0.36], pose: { curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 }, rotationZ: -15 } }
    ],
    matcherRule: {
      curls: { thumb: 0.35, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55 },
      curlTolerance: { thumb: 0.38, index: 0.32, middle: 0.32, ring: 0.32, pinky: 0.32 },
      pathWaypoints: [
        [0, 0],
        [0.1, 0],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-feelings-wait',
    languageId: 'asl',
    category: 'feelings',
    mode: 'dynamic',
    hands: 2,
    title: 'Wait',
    glossEn: 'Wait',
    glossBm: 'Tunggu',
    descriptionEn:
      'Hold both spread open palms facing upward in front of you and wiggle your fingers lightly.',
    descriptionBm:
      'Tadahkan kedua-dua tapak tangan terbuka ke atas dan gerakkan jari perlahan.',
    facialCueEn: 'Calm, patient expression.',
    facialCueBm: 'Ekspresi tenang dan sabar.',
    difficulty: 1,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.56],
        pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } }
        }
      },
      {
        t: 0.5,
        anchor: [0.58, 0.52],
        pose: { curls: { thumb: 0.18, index: 0.25, middle: 0.12, ring: 0.25, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } },
        secondHand: {
          anchor: [0.42, 0.52],
          pose: { curls: { thumb: 0.18, index: 0.12, middle: 0.25, ring: 0.12, pinky: 0.25 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.56],
        pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.14, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, spreads: { indexMiddle: 0.3, middleRing: 0.3, ringPinky: 0.3 } }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.16, index: 0.18, middle: 0.18, ring: 0.18, pinky: 0.18 },
      curlTolerance: { thumb: 0.38, index: 0.34, middle: 0.34, ring: 0.34, pinky: 0.34 },
      pathWaypoints: [
        [0, 0],
        [0, -0.04],
        [0, 0]
      ],
      minDisplacement: 0.03
    }
  }
];
