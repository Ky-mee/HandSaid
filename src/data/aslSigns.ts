import type { SignDefinition } from './types';

export const ASL_EVERYDAY_SIGNS: SignDefinition[] = [
  {
    id: 'asl-everyday-hello',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Hello',
    glossEn: 'Hello',
    glossBm: 'Helo / Salam',
    descriptionEn:
      'Touch the side of your forehead with a flat B-hand, then sweep your hand outward in a relaxed salute.',
    descriptionBm:
      'Sentuh tepi dahi dengan tangan rata (bentuk B), kemudian hayunkan ke luar seperti tabik mesra.',
    facialCueEn: 'Warm, welcoming smile.',
    facialCueBm: 'Senyuman mesra menyambut.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.46, 0.35], pose: { curls: { thumb: 0.3, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: -12 } },
      { t: 1, anchor: [0.66, 0.42], pose: { curls: { thumb: 0.25, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: 18 } }
    ],
    matcherRule: {
      curls: { thumb: 0.3, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.18, 0.06]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'asl-everyday-thank-you',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Thank You',
    glossEn: 'Thank you',
    glossBm: 'Terima kasih',
    descriptionEn:
      'Start with flat fingertips against your chin, then move your hand forward and slightly down toward the listener.',
    descriptionBm:
      'Mulakan hujung jari tangan rata di dagu, kemudian gerakkan ke hadapan dan sedikit ke bawah.',
    facialCueEn: 'Sincere smile and gentle nod.',
    facialCueBm: 'Senyuman ikhlas dan anggukan kecil.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.38], pose: { curls: { thumb: 0.22, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: -10 } },
      { t: 1, anchor: [0.5, 0.65], pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: -52 } }
    ],
    matcherRule: {
      curls: { thumb: 0.22, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.24]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'asl-everyday-please',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Please',
    glossEn: 'Please',
    glossBm: 'Tolong / Sila',
    descriptionEn:
      'Place an open flat palm against the center of your chest and trace a smooth circle.',
    descriptionBm:
      'Letakkan tapak tangan terbuka dan rata di tengah dada lalu buat gerakan bulatan lembut.',
    facialCueEn: 'Polite, warm expression.',
    facialCueBm: 'Ekspresi sopan dan mesra.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.46], pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } } },
      { t: 0.25, anchor: [0.58, 0.54], pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } } },
      { t: 0.5, anchor: [0.5, 0.62], pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } } },
      { t: 0.75, anchor: [0.42, 0.54], pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } } },
      { t: 1, anchor: [0.5, 0.46], pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.22, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, -0.08],
        [0.08, 0],
        [0, 0.08],
        [-0.08, 0],
        [0, -0.08]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'asl-everyday-sorry',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Sorry',
    glossEn: 'Sorry',
    glossBm: 'Maaf',
    descriptionEn:
      'Make a closed A/S fist and rub it in a smooth circle over your chest.',
    descriptionBm:
      'Genggam tangan (bentuk A/S) dan pusingkan dalam bulatan lembut di atas dada.',
    facialCueEn: 'Sincere, apologetic expression.',
    facialCueBm: 'Ekspresi tulus memohon maaf.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.46], pose: { curls: { thumb: 0.75, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 0.25, anchor: [0.58, 0.54], pose: { curls: { thumb: 0.75, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 0.5, anchor: [0.5, 0.62], pose: { curls: { thumb: 0.75, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 0.75, anchor: [0.42, 0.54], pose: { curls: { thumb: 0.75, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 1, anchor: [0.5, 0.46], pose: { curls: { thumb: 0.75, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.75, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, -0.08],
        [0.08, 0],
        [0, 0.08],
        [-0.08, 0],
        [0, -0.08]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'asl-everyday-yes',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Yes',
    glossEn: 'Yes',
    glossBm: 'Ya',
    descriptionEn:
      'Hold a closed S-fist and nod your wrist down and up smoothly.',
    descriptionBm:
      'Bentuk genggaman S dan anggukkan pergelangan tangan ke bawah dan ke atas.',
    facialCueEn: 'Affirmative head nod.',
    facialCueBm: 'Anggukan kepala yang jelas.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.44], pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } },
      { t: 0.5, anchor: [0.5, 0.58], pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: -24 } },
      { t: 1, anchor: [0.5, 0.44], pose: { curls: { thumb: 0.8, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.78, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, 0],
        [0, 0.14],
        [0, 0]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'asl-everyday-no',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'No',
    glossEn: 'No',
    glossBm: 'Tidak',
    descriptionEn:
      'Snap your extended index and middle fingertips down onto your thumb tip, moving gently sideways.',
    descriptionBm:
      'Rapati hujung jari telunjuk dan tengah ke ibu jari sambil menggerakkan tangan sedikit ke sisi.',
    facialCueEn: 'Gentle head shake.',
    facialCueBm: 'Gelengan kepala ringan.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.46, 0.5], pose: { curls: { thumb: 0.2, index: 0.08, middle: 0.08, ring: 0.94, pinky: 0.94 } } },
      { t: 0.5, anchor: [0.56, 0.54], pose: { curls: { thumb: 0.5, index: 0.6, middle: 0.6, ring: 0.94, pinky: 0.94 }, pinchTo: 'index' } },
      { t: 1, anchor: [0.46, 0.5], pose: { curls: { thumb: 0.2, index: 0.08, middle: 0.08, ring: 0.94, pinky: 0.94 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.35, index: 0.32, middle: 0.32, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.45, index: 0.45, middle: 0.45, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.1, 0.04],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-everyday-help',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Help',
    glossEn: 'Help',
    glossBm: 'Tolong / Bantu',
    descriptionEn:
      'Place an A/thumbs-up fist onto your flat non-dominant palm and lift both hands upward together.',
    descriptionBm:
      'Letakkan genggaman A di atas tapak tangan rata sebelah lagi dan angkat kedua-dua tangan ke atas.',
    facialCueEn: 'Look toward who is helping or receiving help.',
    facialCueBm: 'Pandang ke arah orang yang membantu atau dibantu.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.15, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 } },
        secondHand: {
          anchor: [0.46, 0.68],
          pose: { curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, rotationZ: 75 }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.42],
        pose: { curls: { thumb: 0.15, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 } },
        secondHand: {
          anchor: [0.46, 0.48],
          pose: { curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, rotationZ: 75 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.18, index: 0.9, middle: 0.92, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, -0.18]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-everyday-ily',
    languageId: 'asl',
    category: 'everyday',
    mode: 'static',
    hands: 1,
    title: 'I Love You',
    glossEn: 'I love you (ILY)',
    glossBm: 'Saya sayang awak (ILY)',
    descriptionEn:
      'Extend your thumb, index finger, and pinky straight out while folding your middle and ring fingers into your palm.',
    descriptionBm:
      'Tegakkan ibu jari, jari telunjuk, dan kelingking sambil melipat jari tengah dan jari manis.',
    facialCueEn: 'Warm, affectionate smile.',
    facialCueBm: 'Senyuman mesra dan penuh kasih.',
    difficulty: 1,
    poseSpec: {
      curls: { thumb: 0.05, index: 0.04, middle: 0.94, ring: 0.94, pinky: 0.05 },
      spreads: { thumb: 0.8 }
    },
    matcherRule: {
      curls: { thumb: 0.08, index: 0.06, middle: 0.93, ring: 0.93, pinky: 0.08 },
      curlTolerance: { thumb: 0.3, index: 0.25, middle: 0.26, ring: 0.26, pinky: 0.26 }
    }
  },
  {
    id: 'asl-everyday-more',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'More',
    glossEn: 'More',
    glossBm: 'Lagi / Tambah',
    descriptionEn:
      'Form flattened O shapes with both hands and tap the clustered fingertips together in front of you.',
    descriptionBm:
      'Bentuk O leper pada kedua-dua tangan dan temukan hujung jari bersama di hadapan dada.',
    facialCueEn: 'Neutral or enthusiastic brows for asking for more.',
    facialCueBm: 'Angkat kening jika meminta tambahan.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.62, 0.54],
        pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index', rotationZ: -35 },
        secondHand: {
          anchor: [0.38, 0.54],
          pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index', rotationZ: 35 }
        }
      },
      {
        t: 0.5,
        anchor: [0.53, 0.54],
        pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index', rotationZ: -35 },
        secondHand: {
          anchor: [0.47, 0.54],
          pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index', rotationZ: 35 }
        }
      },
      {
        t: 1,
        anchor: [0.62, 0.54],
        pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index', rotationZ: -35 },
        secondHand: {
          anchor: [0.38, 0.54],
          pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index', rotationZ: 35 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 },
      curlTolerance: { thumb: 0.38, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pinchTo: 'index',
      pathWaypoints: [
        [0, 0],
        [-0.09, 0],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-everyday-eat',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Eat',
    glossEn: 'Eat / Food',
    glossBm: 'Makan / Makanan',
    descriptionEn:
      'Bring a flattened O hand up toward your mouth twice in a smooth feeding motion.',
    descriptionBm:
      'Gerakkan tangan bentuk O leper ke arah mulut dalam gerakan menyuap makanan.',
    facialCueEn: 'Relaxed mouth posture.',
    facialCueBm: 'Ekspresi wajah tenang.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.52, 0.62], pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' } },
      { t: 0.5, anchor: [0.5, 0.42], pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' } },
      { t: 1, anchor: [0.52, 0.58], pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' } }
    ],
    matcherRule: {
      curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 },
      curlTolerance: { thumb: 0.38, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pinchTo: 'index',
      pathWaypoints: [
        [0, 0],
        [-0.02, -0.18],
        [0, -0.04]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-everyday-drink',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Drink',
    glossEn: 'Drink',
    glossBm: 'Minum',
    descriptionEn:
      'Hold a loose C-cup hand and tip it upward toward your lips as if drinking from a cup.',
    descriptionBm:
      'Bentuk tangan seperti memegang cawan (C) dan condongkan ke atas menghala ke bibir.',
    facialCueEn: 'Slight chin lift.',
    facialCueBm: 'Angkat sedikit dagu.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.56, 0.62], pose: { curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 } } },
      { t: 1, anchor: [0.5, 0.42], pose: { curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 }, rotationZ: -38 } }
    ],
    matcherRule: {
      curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 },
      curlTolerance: { thumb: 0.36, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pathWaypoints: [
        [0, 0],
        [-0.06, -0.18]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-everyday-home',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Home',
    glossEn: 'Home',
    glossBm: 'Rumah / Kediaman',
    descriptionEn:
      'Tap your flattened O fingertips near the corner of your mouth (eat), then arc smoothly over to your cheek near the ear (sleep).',
    descriptionBm:
      'Sentuh hujung jari O leper di tepi mulut, kemudian gerakkan melengkung ke pipi berhampiran telinga.',
    facialCueEn: 'Relaxed, comforting expression.',
    facialCueBm: 'Ekspresi tenang dan selesa.',
    difficulty: 2,
    motionKeyframes: [
      { t: 0, anchor: [0.46, 0.44], pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' } },
      { t: 1, anchor: [0.64, 0.38], pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' } }
    ],
    matcherRule: {
      curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 },
      curlTolerance: { thumb: 0.38, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pinchTo: 'index',
      pathWaypoints: [
        [0, 0],
        [0.18, -0.05]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'asl-everyday-friend',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Friend',
    glossEn: 'Friend',
    glossBm: 'Kawan / Sahabat',
    descriptionEn:
      'Hook both X-shaped index fingers together, then flip them so the opposite hand hooks on top.',
    descriptionBm:
      'Kaitkan kedua-dua jari telunjuk berbentuk X, kemudian tukar posisi supaya bersilang.',
    facialCueEn: 'Friendly smile.',
    facialCueBm: 'Senyuman mesra.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.52],
        pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: -20 },
        secondHand: {
          anchor: [0.42, 0.52],
          pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: 20 }
        }
      },
      {
        t: 0.5,
        anchor: [0.5, 0.58],
        pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: 10 },
        secondHand: {
          anchor: [0.5, 0.58],
          pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: -10 }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.52],
        pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: -20 },
        secondHand: {
          anchor: [0.42, 0.52],
          pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: 20 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.72, index: 0.48, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.08, 0.06],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-everyday-name',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Name',
    glossEn: 'Name',
    glossBm: 'Nama',
    descriptionEn:
      'Form H hands (index and middle straight together) and tap the dominant fingers across the non-dominant fingers twice.',
    descriptionBm:
      'Bentuk tangan H pada kedua-dua tangan dan ketukkan jari tangan dominan ke atas tangan sebelah lagi.',
    facialCueEn: 'Lower brows if asking a Wh-question ("What is your name?").',
    facialCueBm: 'Turunkan sedikit kening jika bertanya "Siapa nama anda?".',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.45],
        pose: { curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -70 },
        secondHand: {
          anchor: [0.42, 0.58],
          pose: { curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 70 }
        }
      },
      {
        t: 0.5,
        anchor: [0.52, 0.54],
        pose: { curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -70 },
        secondHand: {
          anchor: [0.42, 0.58],
          pose: { curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 70 }
        }
      },
      {
        t: 1,
        anchor: [0.58, 0.45],
        pose: { curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -70 },
        secondHand: {
          anchor: [0.42, 0.58],
          pose: { curls: { thumb: 0.72, index: 0.06, middle: 0.06, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 70 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.72, index: 0.08, middle: 0.08, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.06, 0.09],
        [0, 0]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'asl-everyday-good',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Good',
    glossEn: 'Good',
    glossBm: 'Baik / Bagus',
    descriptionEn:
      'Touch your chin with flat fingertips, then bring your open hand smoothly down onto your waiting space in front of your chest.',
    descriptionBm:
      'Sentuh dagu dengan tangan rata, kemudian gerakkan ke bawah dan ke hadapan di paras dada.',
    facialCueEn: 'Positive nod and gentle smile.',
    facialCueBm: 'Anggukan positif dan senyuman ringan.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.36], pose: { curls: { thumb: 0.22, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 } } },
      { t: 1, anchor: [0.5, 0.64], pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: -45 } }
    ],
    matcherRule: {
      curls: { thumb: 0.22, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.25]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'asl-everyday-water',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Water',
    glossEn: 'Water',
    glossBm: 'Air',
    descriptionEn:
      'Form the letter W (three middle fingers up) and tap your index finger gently against your chin twice.',
    descriptionBm:
      'Bentuk huruf W (tiga jari di atas) dan ketuk perlahan jari telunjuk ke dagu sebanyak dua kali.',
    facialCueEn: 'Keep chin level and steady.',
    facialCueBm: 'Kekalkan kedudukan dagu yang stabil.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.56, 0.46], pose: { curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.06, pinky: 0.92 }, spreads: { indexMiddle: 0.4, middleRing: 0.4 }, thumbAcross: true } },
      { t: 0.5, anchor: [0.48, 0.4], pose: { curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.06, pinky: 0.92 }, spreads: { indexMiddle: 0.4, middleRing: 0.4 }, thumbAcross: true } },
      { t: 1, anchor: [0.56, 0.46], pose: { curls: { thumb: 0.72, index: 0.05, middle: 0.05, ring: 0.06, pinky: 0.92 }, spreads: { indexMiddle: 0.4, middleRing: 0.4 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.72, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.9 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.08, -0.06],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'asl-everyday-learn',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Learn',
    glossEn: 'Learn',
    glossBm: 'Belajar',
    descriptionEn:
      'Pick knowledge up from your flat non-dominant palm and lift your closing fingers smoothly upward to your forehead.',
    descriptionBm:
      'Angkat tangan dari tapak tangan terbuka sebelah lagi sambil merapatkan hujung jari ke arah dahi.',
    facialCueEn: 'Focused, attentive expression.',
    facialCueBm: 'Ekspresi fokus dan ingin belajar.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.54, 0.62],
        pose: { curls: { thumb: 0.15, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 } },
        secondHand: {
          anchor: [0.42, 0.68],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 75 }
        }
      },
      {
        t: 1,
        anchor: [0.52, 0.34],
        pose: { curls: { thumb: 0.54, index: 0.62, middle: 0.64, ring: 0.66, pinky: 0.68 }, pinchTo: 'index' },
        secondHand: {
          anchor: [0.42, 0.68],
          pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 75 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.35, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35 },
      curlTolerance: { thumb: 0.45, index: 0.45, middle: 0.45, ring: 0.45, pinky: 0.45 },
      pathWaypoints: [
        [0, 0],
        [0, -0.24]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'asl-everyday-goodbye',
    languageId: 'asl',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Goodbye',
    glossEn: 'Goodbye',
    glossBm: 'Selamat tinggal',
    descriptionEn:
      'Hold your open palm facing forward and wave smoothly from side to side.',
    descriptionBm:
      'Angkat tapak tangan terbuka ke hadapan dan lambai perlahan ke kiri dan kanan.',
    facialCueEn: 'Warm farewell smile.',
    facialCueBm: 'Senyuman mesra melambai pergi.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.42, 0.48], pose: { curls: { thumb: 0.08, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -16 } },
      { t: 0.5, anchor: [0.6, 0.48], pose: { curls: { thumb: 0.08, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 16 } },
      { t: 1, anchor: [0.42, 0.48], pose: { curls: { thumb: 0.08, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -16 } }
    ],
    matcherRule: {
      curls: { thumb: 0.12, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.18, 0],
        [0, 0]
      ],
      minDisplacement: 0.1
    }
  }
];
