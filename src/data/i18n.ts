import type { UiLang, WorldRegion } from './types';

export interface UiStrings {
  brandSub: string;
  navLearn: string;
  navAtlas: string;
  navStudio: string;
  installApp: string;
  startCamera: string;
  stopCamera: string;
  startingCamera: string;
  ghostOn: string;
  ghostOff: string;
  mirrorOn: string;
  mirrorOff: string;
  speedLabel: string;
  soundOn: string;
  soundOff: string;
  autoNextOn: string;
  autoNextOff: string;
  prevSign: string;
  nextSign: string;
  previewScrubLabel: string;
  matchLabel: string;
  previewModeBanner: string;
  viewCharacter: string;
  viewCloseup: string;
  viewSide: string;
  viewPov: string;
  dragToRotateHint: string;
  playGuide: string;
  pauseGuide: string;
  splitViewOn: string;
  splitViewOff: string;
  overlay2dOn: string;
  overlay2dOff: string;
  trail3dOn: string;
  trail3dOff: string;
  loadingModelBanner: string;
  showHandPrompt: string;
  showBothHandsPrompt: string;
  holdSteadyPrompt: string;
  followTrailPrompt: string;
  matchedBanner: string;
  cameraDeniedError: string;
  cameraNotFoundError: string;
  cameraGenericError: string;
  modelLoadError: string;
  handsRequiredOne: string;
  handsRequiredTwo: string;
  modeStatic: string;
  modeDynamic: string;
  facialCueLabel: string;
  packProgressLabel: string;
  catAll: string;
  catAlphabet: string;
  catNumber: string;
  catEveryday: string;
  catCustom: string;
  searchSignsPlaceholder: string;
  noSignsFound: string;
  atlasTitle: string;
  atlasSubtitle: string;
  atlasSearchPlaceholder: string;
  atlasAllRegions: string;
  atlasBuiltInBadge: string;
  atlasCommunityBadge: string;
  atlasCustomCount: (n: number) => string;
  atlasPracticeBtn: string;
  atlasRecordBtn: string;
  atlasAlphabetLabel: Record<'one-handed' | 'two-handed' | 'syllabic' | 'mixed', string>;
  regionNames: Record<WorldRegion, string>;
  studioTitle: string;
  studioSubtitle: string;
  studioTargetLang: string;
  studioSignTitle: string;
  studioGlossEn: string;
  studioGlossBm: string;
  studioCategory: string;
  studioMode: string;
  studioHands: string;
  studioDescEn: string;
  studioDescBm: string;
  studioFacialCue: string;
  studioStartRecord: string;
  studioRecordingNow: string;
  studioResetCapture: string;
  studioSaveSign: string;
  studioTestSign: string;
  studioStopTest: string;
  studioSavedTitle: string;
  studioEmptySaved: string;
  studioExportBtn: string;
  studioImportBtn: string;
  studioImportSuccess: (count: number) => string;
  studioImportError: string;
  studioCaptureHintStatic: string;
  studioCaptureHintDynamic: string;
  studioCapturedFrames: (count: number) => string;
  studioPracticeBtn: string;
  studioDeleteBtn: string;
  studioNeedCameraMsg: string;
  studioNeedCaptureMsg: string;
  studioNeedTitleMsg: string;
}

export const UI_STRINGS: Record<UiLang, UiStrings> = {
  en: {
    brandSub: 'Camera & hand-follow sign studio',
    navLearn: 'Learn',
    navAtlas: 'World Atlas',
    navStudio: 'Studio Recorder',
    installApp: 'Install app',
    startCamera: 'Start camera',
    stopCamera: 'Stop camera',
    startingCamera: 'Starting camera...',
    ghostOn: 'Ghost guide on',
    ghostOff: 'Ghost guide off',
    mirrorOn: 'Mirror on',
    mirrorOff: 'Mirror off',
    speedLabel: 'Speed',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    autoNextOn: 'Auto-next on',
    autoNextOff: 'Auto-next off',
    prevSign: 'Previous',
    nextSign: 'Next',
    previewScrubLabel: 'Motion frame',
    matchLabel: 'Match',
    previewModeBanner: '3D Sign Coach — drag to rotate, switch angles, or start camera to practice live',
    viewCharacter: 'Character',
    viewCloseup: 'Hand close-up',
    viewSide: 'Side 45°',
    viewPov: 'Your POV',
    dragToRotateHint: 'Drag to rotate 3D',
    playGuide: 'Play',
    pauseGuide: 'Pause',
    splitViewOn: '3D + Camera',
    splitViewOff: 'Camera only',
    overlay2dOn: '2D guide on',
    overlay2dOff: '2D guide off',
    trail3dOn: 'Motion trail on',
    trail3dOff: 'Motion trail off',
    loadingModelBanner: 'Loading on-device hand tracking model...',
    showHandPrompt: 'Raise one hand comfortably in frame to begin',
    showBothHandsPrompt: 'Bring both hands into frame for this sign',
    holdSteadyPrompt: 'Great shape — hold steady to confirm',
    followTrailPrompt: 'Follow the amber path smoothly with your hand',
    matchedBanner: 'Sign matched',
    cameraDeniedError:
      'Camera permission was denied. Allow camera access in your browser site settings, then click Start camera.',
    cameraNotFoundError: 'No camera was detected on this device. Connect a webcam or switch to a phone camera.',
    cameraGenericError: 'Could not start the camera. Close other apps using the webcam and try again.',
    modelLoadError:
      'Hand tracking model failed to load. Check your connection once so the PWA can cache the model offline.',
    handsRequiredOne: '1 hand',
    handsRequiredTwo: '2 hands',
    modeStatic: 'Static pose',
    modeDynamic: 'Hand-follow motion',
    facialCueLabel: 'Expression & posture cue',
    packProgressLabel: 'Pack mastery',
    catAll: 'All',
    catAlphabet: 'Alphabet A–Z',
    catNumber: 'Numbers 0–9',
    catEveryday: 'Everyday',
    catCustom: 'My Signs',
    searchSignsPlaceholder: 'Search signs or meanings...',
    noSignsFound: 'No signs match your filter.',
    atlasTitle: 'World Sign Language Atlas',
    atlasSubtitle:
      'More than 300 distinct sign languages exist worldwide. Explore built-in packs for BIM and ASL, or record signs for any language in Studio Recorder.',
    atlasSearchPlaceholder: 'Search language, country, or ISO code...',
    atlasAllRegions: 'All regions',
    atlasBuiltInBadge: 'Interactive pack ready',
    atlasCommunityBadge: 'Ready for Studio recording',
    atlasCustomCount: (n) => `${n} custom sign${n === 1 ? '' : 's'}`,
    atlasPracticeBtn: 'Practice pack',
    atlasRecordBtn: 'Record in Studio',
    atlasAlphabetLabel: {
      'one-handed': 'One-handed alphabet',
      'two-handed': 'Two-handed alphabet',
      syllabic: 'Syllabic / character signs',
      mixed: 'Mixed manual alphabet'
    },
    regionNames: {
      'Southeast Asia': 'Southeast Asia',
      'East Asia': 'East Asia',
      'South Asia': 'South Asia',
      Americas: 'Americas',
      Europe: 'Europe',
      Oceania: 'Oceania',
      'Middle East & Africa': 'Middle East & Africa'
    },
    studioTitle: 'Studio Sign Recorder',
    studioSubtitle:
      'Record new static or moving signs directly from your webcam to expand Malay, English, or any language in the World Atlas.',
    studioTargetLang: 'Target sign language',
    studioSignTitle: 'Sign name / word',
    studioGlossEn: 'Meaning (English)',
    studioGlossBm: 'Meaning (Bahasa Melayu)',
    studioCategory: 'Category',
    studioMode: 'Motion type',
    studioHands: 'Hands used',
    studioDescEn: 'How to sign (English)',
    studioDescBm: 'How to sign (Bahasa Melayu)',
    studioFacialCue: 'Facial expression / posture cue',
    studioStartRecord: 'Record from camera (3s countdown)',
    studioRecordingNow: 'Recording movement...',
    studioResetCapture: 'Clear capture',
    studioSaveSign: 'Save sign to library',
    studioTestSign: 'Test recognition',
    studioStopTest: 'Stop test',
    studioSavedTitle: 'Your recorded signs',
    studioEmptySaved: 'No custom signs recorded yet. Record one on the left or import a JSON language pack.',
    studioExportBtn: 'Export pack JSON',
    studioImportBtn: 'Import pack JSON',
    studioImportSuccess: (count) => `Imported ${count} sign${count === 1 ? '' : 's'} into your library.`,
    studioImportError: 'Invalid sign pack JSON file. Export a pack first to see the expected format.',
    studioCaptureHintStatic: 'After countdown, hold your target handshape steady for 1 second.',
    studioCaptureHintDynamic: 'After countdown, perform the full sign smoothly over 2 seconds.',
    studioCapturedFrames: (count) => `${count} tracked frame${count === 1 ? '' : 's'} captured`,
    studioPracticeBtn: 'Practice',
    studioDeleteBtn: 'Delete',
    studioNeedCameraMsg: 'Start the camera first before recording a sign.',
    studioNeedCaptureMsg: 'Record a hand pose or movement first before saving.',
    studioNeedTitleMsg: 'Enter a sign name before saving.'
  },
  bm: {
    brandSub: 'Studio isyarat kamera & ikut-gerakan',
    navLearn: 'Belajar',
    navAtlas: 'Atlas Dunia',
    navStudio: 'Perakam Studio',
    installApp: 'Pasang aplikasi',
    startCamera: 'Buka kamera',
    stopCamera: 'Tutup kamera',
    startingCamera: 'Membuka kamera...',
    ghostOn: 'Panduan bayang aktif',
    ghostOff: 'Panduan bayang mati',
    mirrorOn: 'Cermin aktif',
    mirrorOff: 'Cermin mati',
    speedLabel: 'Kelajuan',
    soundOn: 'Bunyi aktif',
    soundOff: 'Bunyi senyap',
    autoNextOn: 'Seterusnya automatik',
    autoNextOff: 'Manual',
    prevSign: 'Sebelumnya',
    nextSign: 'Seterusnya',
    previewScrubLabel: 'Bingkai gerakan',
    matchLabel: 'Padanan',
    previewModeBanner: 'Jurulatih Isyarat 3D — seret untuk pusing, tukar sudut, atau buka kamera untuk latihan langsung',
    viewCharacter: 'Watak',
    viewCloseup: 'Dekat tangan',
    viewSide: 'Sisi 45°',
    viewPov: 'Sudut anda',
    dragToRotateHint: 'Seret untuk pusing 3D',
    playGuide: 'Main',
    pauseGuide: 'Jeda',
    splitViewOn: '3D + Kamera',
    splitViewOff: 'Kamera sahaja',
    overlay2dOn: 'Panduan 2D aktif',
    overlay2dOff: 'Panduan 2D mati',
    trail3dOn: 'Laluan gerakan aktif',
    trail3dOff: 'Laluan gerakan mati',
    loadingModelBanner: 'Memuatkan model penjejak tangan pada peranti...',
    showHandPrompt: 'Angkat sebelah tangan di hadapan kamera untuk mula',
    showBothHandsPrompt: 'Tunjukkan kedua-dua tangan di dalam bingkai kamera',
    holdSteadyPrompt: 'Bentuk tepat — kekalkan seketika untuk sahkan',
    followTrailPrompt: 'Ikut laluan ambar dengan gerakan tangan yang lancar',
    matchedBanner: 'Isyarat berjaya dipadankan',
    cameraDeniedError:
      'Kebenaran kamera ditolak. Benarkan akses kamera dalam tetapan pelayar anda, kemudian tekan Buka kamera.',
    cameraNotFoundError: 'Tiada kamera dikesan pada peranti ini. Sambungkan kamera web atau guna kamera telefon.',
    cameraGenericError: 'Kamera gagal dimulakan. Tutup aplikasi lain yang menggunakan kamera dan cuba lagi.',
    modelLoadError:
      'Model penjejak tangan gagal dimuatkan. Pastikan sambungan internet tersedia sekali untuk simpanan luar talian PWA.',
    handsRequiredOne: '1 tangan',
    handsRequiredTwo: '2 tangan',
    modeStatic: 'Bentuk statik',
    modeDynamic: 'Gerakan ikut-tangan',
    facialCueLabel: 'Ekspresi muka & postur',
    packProgressLabel: 'Penguasaan pek',
    catAll: 'Semua',
    catAlphabet: 'Abjad A–Z',
    catNumber: 'Nombor 0–9',
    catEveryday: 'Harian',
    catCustom: 'Isyarat Saya',
    searchSignsPlaceholder: 'Cari isyarat atau maksud...',
    noSignsFound: 'Tiada isyarat sepadan dengan carian.',
    atlasTitle: 'Atlas Bahasa Isyarat Dunia',
    atlasSubtitle:
      'Lebih 300 bahasa isyarat wujud di seluruh dunia. Terokai pek sedia ada untuk BIM dan ASL, atau rakam isyarat baharu untuk mana-mana bahasa di Perakam Studio.',
    atlasSearchPlaceholder: 'Cari bahasa, negara, atau kod ISO...',
    atlasAllRegions: 'Semua rantau',
    atlasBuiltInBadge: 'Pek interaktif tersedia',
    atlasCommunityBadge: 'Sedia untuk rakaman Studio',
    atlasCustomCount: (n) => `${n} isyarat tersuai`,
    atlasPracticeBtn: 'Latih pek',
    atlasRecordBtn: 'Rakam di Studio',
    atlasAlphabetLabel: {
      'one-handed': 'Abjad satu tangan',
      'two-handed': 'Abjad dua tangan',
      syllabic: 'Isyarat suku kata / aksara',
      mixed: 'Abjad manual campuran'
    },
    regionNames: {
      'Southeast Asia': 'Asia Tenggara',
      'East Asia': 'Asia Timur',
      'South Asia': 'Asia Selatan',
      Americas: 'Amerika',
      Europe: 'Eropah',
      Oceania: 'Oceania',
      'Middle East & Africa': 'Timur Tengah & Afrika'
    },
    studioTitle: 'Perakam Isyarat Studio',
    studioSubtitle:
      'Rakam isyarat statik atau bergerak terus daripada kamera anda untuk menambah kosa kata Bahasa Melayu, Inggeris, atau mana-mana bahasa dunia.',
    studioTargetLang: 'Bahasa isyarat sasaran',
    studioSignTitle: 'Nama isyarat / perkataan',
    studioGlossEn: 'Maksud (Bahasa Inggeris)',
    studioGlossBm: 'Maksud (Bahasa Melayu)',
    studioCategory: 'Kategori',
    studioMode: 'Jenis gerakan',
    studioHands: 'Bilangan tangan',
    studioDescEn: 'Cara membuat isyarat (Bahasa Inggeris)',
    studioDescBm: 'Cara membuat isyarat (Bahasa Melayu)',
    studioFacialCue: 'Petunjuk ekspresi muka / postur',
    studioStartRecord: 'Rakam dari kamera (kiraan 3s)',
    studioRecordingNow: 'Sedang merakam gerakan...',
    studioResetCapture: 'Padam rakaman',
    studioSaveSign: 'Simpan ke pustaka',
    studioTestSign: 'Uji pengecaman',
    studioStopTest: 'Henti ujian',
    studioSavedTitle: 'Isyarat rakaman anda',
    studioEmptySaved: 'Belum ada isyarat tersuai dirakam. Rakam di sebelah kiri atau import fail JSON.',
    studioExportBtn: 'Eksport pek JSON',
    studioImportBtn: 'Import pek JSON',
    studioImportSuccess: (count) => `Berjaya mengimport ${count} isyarat ke dalam pustaka anda.`,
    studioImportError: 'Fail JSON pek isyarat tidak sah. Eksport pek dahulu untuk melihat format yang betul.',
    studioCaptureHintStatic: 'Selepas kiraan tamat, kekalkan bentuk tangan sasaran selama 1 saat.',
    studioCaptureHintDynamic: 'Selepas kiraan tamat, lakukan gerakan penuh isyarat dengan lancar selama 2 saat.',
    studioCapturedFrames: (count) => `${count} bingkai dijejak telah dirakam`,
    studioPracticeBtn: 'Latih',
    studioDeleteBtn: 'Padam',
    studioNeedCameraMsg: 'Buka kamera dahulu sebelum merakam isyarat.',
    studioNeedCaptureMsg: 'Rakam bentuk atau gerakan tangan dahulu sebelum menyimpan.',
    studioNeedTitleMsg: 'Masukkan nama isyarat sebelum menyimpan.'
  }
};
