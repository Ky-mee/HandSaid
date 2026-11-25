import type { SignDefinition } from './types';

export const BIM_EVERYDAY_SIGNS: SignDefinition[] = [
  {
    id: 'bim-everyday-terima-kasih',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Terima Kasih',
    glossEn: 'Thank you',
    glossBm: 'Terima kasih',
    descriptionEn:
      'Place the fingertips of your flat dominant hand near your chin, then sweep your hand smoothly forward and slightly downward.',
    descriptionBm:
      'Sentuhkan hujung jari tangan yang rata berhampiran dagu, kemudian gerakkan tangan ke hadapan dan sedikit ke bawah dengan lancar.',
    facialCueEn: 'Offer a warm, appreciative smile and slight nod.',
    facialCueBm: 'Berikan senyuman mesra dan anggukan kecil tanda penghargaan.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.38], pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -12 } },
      { t: 0.5, anchor: [0.5, 0.52], pose: { curls: { thumb: 0.18, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -36 } },
      { t: 1, anchor: [0.5, 0.66], pose: { curls: { thumb: 0.16, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -55 } }
    ],
    matcherRule: {
      curls: { thumb: 0.2, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, 0.14],
        [0, 0.26]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'bim-everyday-sama-sama',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Sama-sama',
    glossEn: "You're welcome",
    glossBm: 'Sama-sama',
    descriptionEn:
      'Hold both open palms comfortably near chest height and glide them smoothly outward and forward.',
    descriptionBm:
      'Angkat kedua-dua tapak tangan terbuka di paras dada dan gerakkan ke hadapan serta keluar secara lancar.',
    facialCueEn: 'Friendly relaxed expression with soft eye contact.',
    facialCueBm: 'Ekspresi mesra dan tenang dengan kontak mata.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.58, 0.55],
        pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 12 },
        secondHand: {
          anchor: [0.42, 0.55],
          pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -12 }
        }
      },
      {
        t: 1,
        anchor: [0.7, 0.62],
        pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 28 },
        secondHand: {
          anchor: [0.3, 0.62],
          pose: { curls: { thumb: 0.12, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: -28 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.12, 0.06]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'bim-everyday-selamat-pagi',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Selamat Pagi',
    glossEn: 'Good morning',
    glossBm: 'Selamat pagi',
    descriptionEn:
      'Hold your non-dominant hand horizontally as the horizon, then raise your dominant open hand smoothly upward like the rising sun.',
    descriptionBm:
      'Letakkan tangan bukan dominan secara mendatar sebagai ufuk, kemudian naikkan tapak tangan dominan ke atas seperti matahari terbit.',
    facialCueEn: 'Bright morning smile with lifted eyebrows.',
    facialCueBm: 'Senyuman ceria dengan kening sedikit terangkat.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.6, 0.66],
        pose: { curls: { thumb: 0.15, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 0 },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 88 }
        }
      },
      {
        t: 0.5,
        anchor: [0.6, 0.52],
        pose: { curls: { thumb: 0.12, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: 0 },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 88 }
        }
      },
      {
        t: 1,
        anchor: [0.6, 0.36],
        pose: { curls: { thumb: 0.1, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: 0 },
        secondHand: {
          anchor: [0.42, 0.56],
          pose: { curls: { thumb: 0.2, index: 0.06, middle: 0.06, ring: 0.06, pinky: 0.06 }, rotationZ: 88 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, -0.14],
        [0, -0.26]
      ],
      minDisplacement: 0.1
    }
  },
  {
    id: 'bim-everyday-apa-khabar',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Apa Khabar',
    glossEn: 'How are you?',
    glossBm: 'Apa khabar?',
    descriptionEn:
      'Hold both open palms facing upward and gently sway them side-to-side in a welcoming questioning motion.',
    descriptionBm:
      'Tadahkan kedua-dua tapak tangan ke atas dan goyangkan perlahan ke kiri dan kanan seperti bertanya khabar.',
    facialCueEn: 'Raise eyebrows slightly in a polite question expression.',
    facialCueBm: 'Angkat sedikit kening untuk menandakan soalan yang sopan.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.62, 0.56],
        pose: { curls: { thumb: 0.15, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, rotationZ: -15 },
        secondHand: {
          anchor: [0.38, 0.56],
          pose: { curls: { thumb: 0.15, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, rotationZ: 15 }
        }
      },
      {
        t: 0.5,
        anchor: [0.68, 0.56],
        pose: { curls: { thumb: 0.15, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, rotationZ: 15 },
        secondHand: {
          anchor: [0.32, 0.56],
          pose: { curls: { thumb: 0.15, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, rotationZ: -15 }
        }
      },
      {
        t: 1,
        anchor: [0.6, 0.56],
        pose: { curls: { thumb: 0.15, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, rotationZ: -10 },
        secondHand: {
          anchor: [0.4, 0.56],
          pose: { curls: { thumb: 0.15, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0.12 }, rotationZ: 10 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.15, index: 0.14, middle: 0.14, ring: 0.14, pinky: 0.14 },
      curlTolerance: { thumb: 0.35, index: 0.3, middle: 0.3, ring: 0.3, pinky: 0.3 },
      pathWaypoints: [
        [0, 0],
        [0.08, 0],
        [-0.02, 0]
      ],
      minDisplacement: 0.08
    }
  },
  {
    id: 'bim-everyday-maaf',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Maaf',
    glossEn: 'Sorry',
    glossBm: 'Maaf',
    descriptionEn:
      'Form a loose S/A fist and rub it in a gentle circle over the center of your chest.',
    descriptionBm:
      'Bentuk genggaman tangan dan pusingkan dalam bulatan lembut di bahagian tengah dada anda.',
    facialCueEn: 'Show a sincere, apologetic facial expression.',
    facialCueBm: 'Tunjukkan ekspresi wajah yang tulus memohon maaf.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.46], pose: { curls: { thumb: 0.72, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 0.25, anchor: [0.58, 0.54], pose: { curls: { thumb: 0.72, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 0.5, anchor: [0.5, 0.62], pose: { curls: { thumb: 0.72, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 0.75, anchor: [0.42, 0.54], pose: { curls: { thumb: 0.72, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 1, anchor: [0.5, 0.46], pose: { curls: { thumb: 0.72, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.72, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
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
    id: 'bim-everyday-tolong',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Tolong',
    glossEn: 'Please / Help',
    glossBm: 'Tolong',
    descriptionEn:
      'Rest your dominant fist/thumbs-up on your flat non-dominant palm, then lift both hands upward together.',
    descriptionBm:
      'Letakkan genggaman tangan dominan di atas tapak tangan rata sebelah lagi, lalu angkat kedua-duanya ke atas.',
    facialCueEn: 'Direct your gaze politely toward the person you are asking.',
    facialCueBm: 'Pandang dengan sopan ke arah orang yang diminta pertolongan.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.56, 0.62],
        pose: { curls: { thumb: 0.18, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 } },
        secondHand: {
          anchor: [0.46, 0.68],
          pose: { curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, rotationZ: 75 }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.42],
        pose: { curls: { thumb: 0.18, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 } },
        secondHand: {
          anchor: [0.46, 0.48],
          pose: { curls: { thumb: 0.15, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 }, rotationZ: 75 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.2, index: 0.9, middle: 0.92, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0, -0.18]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'bim-everyday-ya',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Ya',
    glossEn: 'Yes',
    glossBm: 'Ya',
    descriptionEn:
      'Form a neat fist and nod your wrist smoothly downward and back up like a head nodding yes.',
    descriptionBm:
      'Genggam tangan anda dan anggukkan pergelangan tangan ke bawah dan ke atas seperti mengangguk.',
    facialCueEn: 'Pair with a clear affirmative head nod.',
    facialCueBm: 'Sertakan dengan anggukan kepala yang jelas.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.44], pose: { curls: { thumb: 0.78, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: 0 } },
      { t: 0.5, anchor: [0.5, 0.58], pose: { curls: { thumb: 0.78, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: -25 } },
      { t: 1, anchor: [0.5, 0.44], pose: { curls: { thumb: 0.78, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 }, thumbAcross: true, rotationZ: 0 } }
    ],
    matcherRule: {
      curls: { thumb: 0.76, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
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
    id: 'bim-everyday-tidak',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Tidak',
    glossEn: 'No',
    glossBm: 'Tidak',
    descriptionEn:
      'Extend your thumb, index, and middle fingers and sweep or shake your hand firmly from side to side.',
    descriptionBm:
      'Buka ibu jari, jari telunjuk, dan jari tengah lalu gerakkan tangan ke kiri dan kanan sebagai tanda tidak.',
    facialCueEn: 'Shake your head gently in negation.',
    facialCueBm: 'Gelengkan kepala perlahan menandakan penafian.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.42, 0.52], pose: { curls: { thumb: 0.18, index: 0.1, middle: 0.1, ring: 0.94, pinky: 0.94 }, rotationZ: -12 } },
      { t: 0.5, anchor: [0.6, 0.52], pose: { curls: { thumb: 0.18, index: 0.1, middle: 0.1, ring: 0.94, pinky: 0.94 }, rotationZ: 12 } },
      { t: 1, anchor: [0.42, 0.52], pose: { curls: { thumb: 0.18, index: 0.1, middle: 0.1, ring: 0.94, pinky: 0.94 }, rotationZ: -12 } }
    ],
    matcherRule: {
      curls: { thumb: 0.22, index: 0.14, middle: 0.14, ring: 0.92, pinky: 0.92 },
      curlTolerance: { thumb: 0.4, index: 0.32, middle: 0.32, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.16, 0],
        [0, 0]
      ],
      minDisplacement: 0.09
    }
  },
  {
    id: 'bim-everyday-saya',
    languageId: 'bim',
    category: 'everyday',
    mode: 'static',
    hands: 1,
    title: 'Saya',
    glossEn: 'I / Me',
    glossBm: 'Saya',
    descriptionEn:
      'Point your index finger gently inward toward the center of your own chest while folding other fingers.',
    descriptionBm:
      'Tunjukkan jari telunjuk ke arah dada anda sendiri dengan lembut sambil menutup jari lain.',
    facialCueEn: 'Neutral, calm posture.',
    facialCueBm: 'Postur tenang dan semula jadi.',
    difficulty: 1,
    poseSpec: { curls: { thumb: 0.72, index: 0.06, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 35 },
    matcherRule: {
      curls: { thumb: 0.72, index: 0.08, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 }
    }
  },
  {
    id: 'bim-everyday-awak',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Awak',
    glossEn: 'You',
    glossBm: 'Awak / Anda',
    descriptionEn:
      'Extend your index finger smoothly forward toward the person you are addressing.',
    descriptionBm:
      'Luruskan jari telunjuk dengan sopan ke hadapan ke arah lawan bicara anda.',
    facialCueEn: 'Maintain eye contact with the listener.',
    facialCueBm: 'Kekalkan kontak mata dengan penerima.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.56], pose: { curls: { thumb: 0.75, index: 0.08, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } },
      { t: 1, anchor: [0.5, 0.44], pose: { curls: { thumb: 0.75, index: 0.05, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true } }
    ],
    matcherRule: {
      curls: { thumb: 0.75, index: 0.08, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, 0],
        [0, -0.11]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'bim-everyday-nama',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Nama',
    glossEn: 'Name',
    glossBm: 'Nama',
    descriptionEn:
      'Extend index and middle fingers together (H-shape) on both hands and tap the top hand lightly onto the lower hand.',
    descriptionBm:
      'Tegakkan jari telunjuk dan tengah bersama pada kedua-dua tangan, lalu ketukkan tangan atas perlahan ke atas tangan bawah.',
    facialCueEn: 'Use raised brows if asking someone their name.',
    facialCueBm: 'Angkat kening jika bertanya nama seseorang.',
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
    id: 'bim-everyday-makan',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Makan',
    glossEn: 'Eat',
    glossBm: 'Makan',
    descriptionEn:
      'Pinch all fingertips together with your thumb (flattened O) and lift toward your mouth in a gentle eating motion.',
    descriptionBm:
      'Cantumkan semua hujung jari bersama ibu jari dan bawa ke arah mulut dengan gerakan menyuap makanan.',
    facialCueEn: 'Relaxed mouth posture.',
    facialCueBm: 'Bibir dalam keadaan tenang.',
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
    id: 'bim-everyday-minum',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Minum',
    glossEn: 'Drink',
    glossBm: 'Minum',
    descriptionEn:
      'Shape your hand into a C-cup and tilt it upward toward your mouth as if sipping from a glass.',
    descriptionBm:
      'Bentuk tangan seperti huruf C dan condongkan ke atas menghala ke mulut seperti sedang minum dari gelas.',
    facialCueEn: 'Slightly tilt your chin up as you sip.',
    facialCueBm: 'Dongakkan sedikit dagu ketika meniru gerakan minum.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.56, 0.62], pose: { curls: { thumb: 0.42, index: 0.48, middle: 0.48, ring: 0.48, pinky: 0.48 }, rotationZ: 0 } },
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
    id: 'bim-everyday-rumah',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Rumah',
    glossEn: 'House / Home',
    glossBm: 'Rumah',
    descriptionEn:
      'Touch both flat fingertips overhead in a pitched roof angle, then trace outward and straight down for the walls.',
    descriptionBm:
      'Temukan hujung kedua-dua tangan di atas membentuk bumbung, kemudian gerakkan ke sisi dan lurus ke bawah seperti dinding rumah.',
    facialCueEn: 'Neutral, clear spatial outline.',
    facialCueBm: 'Lakaran ruang yang kemas dan jelas.',
    difficulty: 2,
    motionKeyframes: [
      {
        t: 0,
        anchor: [0.54, 0.36],
        pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: -38 },
        secondHand: {
          anchor: [0.46, 0.36],
          pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: 38 }
        }
      },
      {
        t: 0.5,
        anchor: [0.66, 0.48],
        pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: -15 },
        secondHand: {
          anchor: [0.34, 0.48],
          pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: 15 }
        }
      },
      {
        t: 1,
        anchor: [0.66, 0.68],
        pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: 0 },
        secondHand: {
          anchor: [0.34, 0.68],
          pose: { curls: { thumb: 0.2, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 }, rotationZ: 0 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.2, index: 0.08, middle: 0.08, ring: 0.08, pinky: 0.08 },
      curlTolerance: { thumb: 0.35, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [0.12, 0.12],
        [0.12, 0.3]
      ],
      minDisplacement: 0.12
    }
  },
  {
    id: 'bim-everyday-kawan',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 2,
    title: 'Kawan',
    glossEn: 'Friend',
    glossBm: 'Kawan',
    descriptionEn:
      'Hook both index fingers (X-shape) and link them together in front of your chest, flipping once to connect.',
    descriptionBm:
      'Lengkungkan kedua-dua jari telunjuk seperti cangkuk dan kaitkan di hadapan dada.',
    facialCueEn: 'Warm, friendly expression.',
    facialCueBm: 'Senyuman mesra melambangkan persahabatan.',
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
        anchor: [0.51, 0.56],
        pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: 10 },
        secondHand: {
          anchor: [0.49, 0.56],
          pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: -10 }
        }
      },
      {
        t: 1,
        anchor: [0.56, 0.5],
        pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: -20 },
        secondHand: {
          anchor: [0.44, 0.5],
          pose: { curls: { thumb: 0.72, index: 0.48, middle: 0.94, ring: 0.94, pinky: 0.94 }, rotationZ: 20 }
        }
      }
    ],
    matcherRule: {
      curls: { thumb: 0.72, index: 0.48, middle: 0.92, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.28, middle: 0.28, ring: 0.28, pinky: 0.28 },
      pathWaypoints: [
        [0, 0],
        [-0.07, 0.04],
        [0, 0]
      ],
      minDisplacement: 0.06
    }
  },
  {
    id: 'bim-everyday-sayang',
    languageId: 'bim',
    category: 'everyday',
    mode: 'static',
    hands: 2,
    title: 'Sayang',
    glossEn: 'Love / Dear',
    glossBm: 'Sayang / Kasih',
    descriptionEn:
      'Cross both fists gently over your chest like hugging someone close to your heart.',
    descriptionBm:
      'Silangkan kedua-dua genggaman tangan di atas dada seperti memeluk erat penuh kasih.',
    facialCueEn: 'Warm, affectionate expression.',
    facialCueBm: 'Ekspresi wajah yang lembut dan penyayang.',
    difficulty: 1,
    poseSpec: { curls: { thumb: 0.75, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: -25 },
    secondHandPose: { curls: { thumb: 0.75, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 }, thumbAcross: true, rotationZ: 25 },
    matcherRule: {
      curls: { thumb: 0.75, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 }
    }
  },
  {
    id: 'bim-everyday-bagus',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Bagus',
    glossEn: 'Good',
    glossBm: 'Bagus / Baik',
    descriptionEn:
      'Hold a crisp thumbs-up (or flat palm near chin) and move smoothly forward to express approval.',
    descriptionBm:
      'Angkat ibu jari dengan kemas (atau tapak tangan dari dagu) dan gerakkan sedikit ke hadapan tanda bagus.',
    facialCueEn: 'Smile and nod approvingly.',
    facialCueBm: 'Senyum dan angguk sebagai tanda puji.',
    difficulty: 1,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.56], pose: { curls: { thumb: 0.08, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 } } },
      { t: 1, anchor: [0.5, 0.42], pose: { curls: { thumb: 0.08, index: 0.94, middle: 0.94, ring: 0.94, pinky: 0.94 } } }
    ],
    matcherRule: {
      curls: { thumb: 0.1, index: 0.92, middle: 0.94, ring: 0.94, pinky: 0.94 },
      curlTolerance: { thumb: 0.35, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 },
      pathWaypoints: [
        [0, 0],
        [0, -0.12]
      ],
      minDisplacement: 0.07
    }
  },
  {
    id: 'bim-everyday-jumpa-lagi',
    languageId: 'bim',
    category: 'everyday',
    mode: 'dynamic',
    hands: 1,
    title: 'Jumpa Lagi',
    glossEn: 'See you again',
    glossBm: 'Jumpa lagi',
    descriptionEn:
      'Hold a V-shape with index and middle fingers near eye level, then arc your hand forward toward the other person.',
    descriptionBm:
      'Bentuk huruf V dengan jari telunjuk dan tengah berhampiran aras mata, lalu lengkungkan ke hadapan.',
    facialCueEn: 'Warm farewell smile.',
    facialCueBm: 'Senyuman manis mengucapkan selamat tinggal.',
    difficulty: 2,
    motionKeyframes: [
      { t: 0, anchor: [0.5, 0.38], pose: { curls: { thumb: 0.78, index: 0.05, middle: 0.05, ring: 0.94, pinky: 0.94 }, spreads: { indexMiddle: 0.65 }, thumbAcross: true } },
      { t: 1, anchor: [0.62, 0.56], pose: { curls: { thumb: 0.78, index: 0.05, middle: 0.05, ring: 0.94, pinky: 0.94 }, spreads: { indexMiddle: 0.65 }, thumbAcross: true, rotationZ: -25 } }
    ],
    matcherRule: {
      curls: { thumb: 0.76, index: 0.06, middle: 0.06, ring: 0.93, pinky: 0.94 },
      curlTolerance: { thumb: 0.4, index: 0.26, middle: 0.26, ring: 0.26, pinky: 0.26 },
      minIndexMiddleSpread: 0.28,
      pathWaypoints: [
        [0, 0],
        [0.12, 0.16]
      ],
      minDisplacement: 0.1
    }
  }
];
