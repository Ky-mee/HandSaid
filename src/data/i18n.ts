import type { UiLang, WorldRegion } from './types';

export interface UiStrings {
  brandSub: string;
  navHome: string;
  navDashboard: string;
  navLearn: string;
  navTest: string;
  navFreeCam: string;
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
  catPeople: string;
  catFeelings: string;
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
  footerTagline: string;
  homeTitle: string;
  homeSubtitle: string;
  homeCtaLearn: string;
  homeCtaFreeCam: string;
  homeCtaTest: string;
  homeFactSigns: string;
  homeFactLanguages: string;
  homeFactPrivate: string;
  homeShowcaseLabel: string;
  homeStatementsHeading: string;
  homeStatementsSub: string;
  homePracticeStatement: string;
  homeModesHeading: string;
  homeModeCoachTitle: string;
  homeModeCoachDesc: string;
  homeModeFreeCamTitle: string;
  homeModeFreeCamDesc: string;
  homeModeTestTitle: string;
  homeModeTestDesc: string;
  homeModeStudioTitle: string;
  homeModeStudioDesc: string;
  dashTitle: string;
  dashSubtitle: string;
  dashOverallMastery: string;
  dashStreakLabel: string;
  dashStreakUnit: (n: number) => string;
  dashSignedLabel: string;
  dashTestsLabel: string;
  dashBestAccLabel: string;
  dashStatementsLabel: string;
  dashCategoriesTitle: string;
  dashRecommendedTitle: string;
  dashAllMastered: string;
  dashHistoryTitle: string;
  dashHistoryEmpty: string;
  dashStartFirstTest: string;
  dashPracticeBtn: string;
  testTitle: string;
  testSubtitle: string;
  testModeCamera: string;
  testModeVisual: string;
  testModeStatement: string;
  testCategoryLabel: string;
  testCountLabel: string;
  testStartBtn: string;
  testPeekHint: string;
  testHideHint: string;
  testSkipBtn: string;
  testQuestionLabel: (cur: number, total: number) => string;
  testSignPrompt: string;
  testVisualPrompt: string;
  testReportTitle: string;
  testAccuracyLabel: string;
  testTimeLabel: string;
  testRetakeBtn: string;
  testPracticeMissedBtn: string;
  testMissedLabel: string;
  stmtPresetsLabel: string;
  stmtCustomToggle: string;
  stmtCustomEmpty: string;
  stmtWatch3dBtn: string;
  stmtStop3dBtn: string;
  stmtSignLiveBtn: string;
  stmtClearBtn: string;
  stmtCompletedBanner: string;
  freeCamTitle: string;
  freeCamSubtitle: string;
  freeCamScopeWords: string;
  freeCamScopeAlphaNum: string;
  freeCamScopeAll: string;
  freeCamCandidatesTitle: string;
  freeCamStatementTitle: string;
  freeCamStatementEmpty: string;
  freeCamSpaceBtn: string;
  freeCamBackspaceBtn: string;
  freeCamClearBtn: string;
  freeCamSpeakBtn: string;
  freeCamCopyBtn: string;
  freeCamCopiedBtn: string;
  freeCamReplayBtn: string;
  freeCamCloseReplayBtn: string;
  freeCamHoldLockHint: string;
  freeCamNoHandHint: string;
  freeCamLockedBanner: (title: string) => string;
}

export const UI_STRINGS: Record<UiLang, UiStrings> = {
  en: {
    brandSub: '3D & camera sign studio',
    navHome: 'Home',
    navDashboard: 'Dashboard',
    navLearn: 'Learn',
    navTest: 'Skill Test',
    navFreeCam: 'Free Camera',
    navAtlas: 'World Atlas',
    navStudio: 'Studio',
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
    catPeople: 'Family & People',
    catFeelings: 'Feelings & Needs',
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
    studioNeedTitleMsg: 'Enter a sign name before saving.',
    footerTagline: 'HandSaid — On-device 3D sign coach & MediaPipe camera studio',
    homeTitle: 'Learn, sign, and converse in 3D & live camera.',
    homeSubtitle:
      'Practice 152 Malaysian (BIM) and American (ASL) signs with an anatomically accurate 3D character coach, test your skills, build statements, and translate live signs from your webcam.',
    homeCtaLearn: 'Start learning',
    homeCtaFreeCam: 'Open free camera',
    homeCtaTest: 'Take skill test',
    homeFactSigns: '152 built-in signs',
    homeFactLanguages: '32 world languages',
    homeFactPrivate: '100% on-device vision',
    homeShowcaseLabel: 'Live 3D preview',
    homeStatementsHeading: 'Practice real statements',
    homeStatementsSub: 'Watch multi-sign sentences in 3D and perform each word on camera.',
    homePracticeStatement: 'Try statement',
    homeModesHeading: 'Explore HandSaid',
    homeModeCoachTitle: 'Interactive 3D Sign Coach',
    homeModeCoachDesc:
      'Orbit 360°, switch between front, close-up, side 45°, and your own POV, and match your hand live.',
    homeModeFreeCamTitle: 'Free Camera Recognizer',
    homeModeFreeCamDesc:
      'Sign freely in front of your webcam to build words and complete statements with speech output.',
    homeModeTestTitle: 'Skill Tests & Quizzes',
    homeModeTestDesc:
      'Challenge yourself with blind camera drills, 3D visual quizzes, and custom statement chains.',
    homeModeStudioTitle: 'Atlas & Custom Studio',
    homeModeStudioDesc:
      'Browse 32 sign languages worldwide and record, test, and share your own custom sign packs.',
    dashTitle: 'Your Learning Dashboard',
    dashSubtitle: 'Track mastery, daily streak, skill test accuracy, and next signs to practice.',
    dashOverallMastery: 'Pack mastery',
    dashStreakLabel: 'Daily streak',
    dashStreakUnit: (n) => `${n} day${n === 1 ? '' : 's'}`,
    dashSignedLabel: 'Signs mastered',
    dashTestsLabel: 'Tests taken',
    dashBestAccLabel: 'Best accuracy',
    dashStatementsLabel: 'Statements signed',
    dashCategoriesTitle: 'Progress by category',
    dashRecommendedTitle: 'Recommended next signs',
    dashAllMastered: 'You have mastered every sign in this pack! Try a Skill Test or Free Camera.',
    dashHistoryTitle: 'Recent skill tests',
    dashHistoryEmpty: 'No tests completed yet. Run a Camera Skill Test or Visual Quiz to log your first score.',
    dashStartFirstTest: 'Start a skill test',
    dashPracticeBtn: 'Practice',
    testTitle: 'Skill Test & Statement Challenge',
    testSubtitle:
      'Verify your signing accuracy without ghost hints, quiz yourself visually, or perform multi-sign statements.',
    testModeCamera: 'Camera Skill Test',
    testModeVisual: '3D Visual Quiz',
    testModeStatement: 'Statement Challenge',
    testCategoryLabel: 'Category',
    testCountLabel: 'Questions',
    testStartBtn: 'Start test',
    testPeekHint: 'Peek 3D hint',
    testHideHint: 'Hide 3D hint',
    testSkipBtn: 'Skip',
    testQuestionLabel: (cur, total) => `Prompt ${cur} of ${total}`,
    testSignPrompt: 'Perform this sign clearly in front of your camera',
    testVisualPrompt: 'Which sign is the 3D coach performing?',
    testReportTitle: 'Session Report',
    testAccuracyLabel: 'Accuracy',
    testTimeLabel: 'Time',
    testRetakeBtn: 'Run another test',
    testPracticeMissedBtn: 'Practice in Learn',
    testMissedLabel: 'Review',
    stmtPresetsLabel: 'Curated statements',
    stmtCustomToggle: 'Custom composer',
    stmtCustomEmpty: 'Click signs below to compose your own multi-sign statement.',
    stmtWatch3dBtn: 'Watch full 3D statement',
    stmtStop3dBtn: 'Stop 3D playback',
    stmtSignLiveBtn: 'Sign statement on camera',
    stmtClearBtn: 'Clear',
    stmtCompletedBanner: 'Statement completed cleanly!',
    freeCamTitle: 'Free Camera Sign & Statement Builder',
    freeCamSubtitle:
      'Sign naturally without selecting a target first. Hold a handshape or complete a movement to append words into a live statement.',
    freeCamScopeWords: 'Words & Phrases',
    freeCamScopeAlphaNum: 'Letters & Numbers',
    freeCamScopeAll: 'All Signs',
    freeCamCandidatesTitle: 'Live recognition candidates',
    freeCamStatementTitle: 'Built statement',
    freeCamStatementEmpty: 'Start the camera and perform any sign to build words or a full statement.',
    freeCamSpaceBtn: 'Space',
    freeCamBackspaceBtn: 'Undo last',
    freeCamClearBtn: 'Clear',
    freeCamSpeakBtn: 'Speak',
    freeCamCopyBtn: 'Copy',
    freeCamCopiedBtn: 'Copied',
    freeCamReplayBtn: 'Replay in 3D',
    freeCamCloseReplayBtn: 'Hide 3D replay',
    freeCamHoldLockHint: 'Hold or finish motion to lock in',
    freeCamNoHandHint: 'Show your hand in frame to start recognizing',
    freeCamLockedBanner: (title) => `Added "${title}"`
  },
  bm: {
    brandSub: 'Studio isyarat 3D & kamera',
    navHome: 'Utama',
    navDashboard: 'Papan Pemuka',
    navLearn: 'Belajar',
    navTest: 'Ujian Kemahiran',
    navFreeCam: 'Kamera Bebas',
    navAtlas: 'Atlas Dunia',
    navStudio: 'Studio',
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
    catPeople: 'Keluarga & Orang',
    catFeelings: 'Perasaan & Keperluan',
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
    studioNeedTitleMsg: 'Masukkan nama isyarat sebelum menyimpan.',
    footerTagline: 'HandSaid — Jurulatih isyarat 3D & studio kamera MediaPipe pada peranti',
    homeTitle: 'Belajar, berisyarat, dan bina ayat dengan 3D & kamera langsung.',
    homeSubtitle:
      'Latih 152 isyarat BIM dan ASL dengan jurulatih watak 3D anatomi tepat, uji kemahiran anda, bina pernyataan, dan terjemah isyarat secara langsung.',
    homeCtaLearn: 'Mula belajar',
    homeCtaFreeCam: 'Buka kamera bebas',
    homeCtaTest: 'Ambil ujian',
    homeFactSigns: '152 isyarat terbina',
    homeFactLanguages: '32 bahasa dunia',
    homeFactPrivate: '100% pada peranti',
    homeShowcaseLabel: 'Pratonton 3D langsung',
    homeStatementsHeading: 'Latih pernyataan sebenar',
    homeStatementsSub: 'Tonton ayat berbilang isyarat dalam 3D dan lakukan setiap perkataan di kamera.',
    homePracticeStatement: 'Cuba ayat ini',
    homeModesHeading: 'Terokai HandSaid',
    homeModeCoachTitle: 'Jurulatih Isyarat 3D Interaktif',
    homeModeCoachDesc:
      'Pusing 360°, tukar sudut hadapan, dekat tangan, sisi 45°, dan sudut pandangan anda sendiri.',
    homeModeFreeCamTitle: 'Pengecam Kamera Bebas',
    homeModeFreeCamDesc:
      'Berisyarat secara bebas di hadapan kamera untuk membina perkataan dan ayat lengkap dengan suara.',
    homeModeTestTitle: 'Ujian Kemahiran & Kuiz',
    homeModeTestDesc:
      'Uji ketepatan anda melalui latihan kamera tanpa panduan, kuiz visual 3D, dan cabaran ayat.',
    homeModeStudioTitle: 'Atlas & Perakam Studio',
    homeModeStudioDesc:
      'Terokai 32 bahasa isyarat dunia serta rakam, uji, dan kongsi pek isyarat tersuai anda.',
    dashTitle: 'Papan Pemuka Pembelajaran',
    dashSubtitle: 'Pantau penguasaan, rentetan harian, ketepatan ujian, dan isyarat seterusnya.',
    dashOverallMastery: 'Penguasaan pek',
    dashStreakLabel: 'Rentetan harian',
    dashStreakUnit: (n) => `${n} hari`,
    dashSignedLabel: 'Isyarat dikuasai',
    dashTestsLabel: 'Ujian diambil',
    dashBestAccLabel: 'Ketepatan terbaik',
    dashStatementsLabel: 'Pernyataan dibina',
    dashCategoriesTitle: 'Kemajuan mengikut kategori',
    dashRecommendedTitle: 'Isyarat disyorkan seterusnya',
    dashAllMastered: 'Tahniah! Semua isyarat dalam pek ini telah dikuasai. Cuba Ujian Kemahiran atau Kamera Bebas.',
    dashHistoryTitle: 'Sejarah ujian terkini',
    dashHistoryEmpty: 'Belum ada ujian diselesaikan. Cuba Ujian Kamera atau Kuiz Visual untuk rekod pertama.',
    dashStartFirstTest: 'Mulakan ujian',
    dashPracticeBtn: 'Latih',
    testTitle: 'Ujian Kemahiran & Cabaran Pernyataan',
    testSubtitle:
      'Uji ketepatan isyarat tanpa panduan bayang, jawab kuiz visual 3D, atau susun ayat isyarat.',
    testModeCamera: 'Ujian Kamera',
    testModeVisual: 'Kuiz Visual 3D',
    testModeStatement: 'Cabaran Pernyataan',
    testCategoryLabel: 'Kategori',
    testCountLabel: 'Soalan',
    testStartBtn: 'Mula ujian',
    testPeekHint: 'Intai panduan 3D',
    testHideHint: 'Tutup panduan 3D',
    testSkipBtn: 'Langkau',
    testQuestionLabel: (cur, total) => `Soalan ${cur} daripada ${total}`,
    testSignPrompt: 'Lakukan isyarat ini dengan jelas di hadapan kamera',
    testVisualPrompt: 'Apakah isyarat yang ditunjukkan oleh jurulatih 3D?',
    testReportTitle: 'Laporan Sesi',
    testAccuracyLabel: 'Ketepatan',
    testTimeLabel: 'Masa',
    testRetakeBtn: 'Uji semula',
    testPracticeMissedBtn: 'Latih di Belajar',
    testMissedLabel: 'Ulang kaji',
    stmtPresetsLabel: 'Pernyataan pilihan',
    stmtCustomToggle: 'Susun ayat sendiri',
    stmtCustomEmpty: 'Klik isyarat di bawah untuk menyusun pernyataan anda sendiri.',
    stmtWatch3dBtn: 'Tonton ayat penuh 3D',
    stmtStop3dBtn: 'Henti tontonan 3D',
    stmtSignLiveBtn: 'Lakukan ayat di kamera',
    stmtClearBtn: 'Kosongkan',
    stmtCompletedBanner: 'Pernyataan berjaya diselesaikan!',
    freeCamTitle: 'Kamera Bebas & Pembina Pernyataan',
    freeCamSubtitle:
      'Berisyarat secara bebas tanpa memilih sasaran. Kekalkan bentuk atau lengkapkan gerakan untuk menambah perkataan.',
    freeCamScopeWords: 'Perkataan & Frasa',
    freeCamScopeAlphaNum: 'Huruf & Nombor',
    freeCamScopeAll: 'Semua Isyarat',
    freeCamCandidatesTitle: 'Calon pengecaman langsung',
    freeCamStatementTitle: 'Pernyataan dibina',
    freeCamStatementEmpty: 'Buka kamera dan lakukan sebarang isyarat untuk membina perkataan atau ayat.',
    freeCamSpaceBtn: 'Ruang',
    freeCamBackspaceBtn: 'Batal terakhir',
    freeCamClearBtn: 'Kosongkan',
    freeCamSpeakBtn: 'Sebut',
    freeCamCopyBtn: 'Salin',
    freeCamCopiedBtn: 'Disalin',
    freeCamReplayBtn: 'Main semula 3D',
    freeCamCloseReplayBtn: 'Tutup 3D',
    freeCamHoldLockHint: 'Kekalkan atau habiskan gerakan untuk mengunci',
    freeCamNoHandHint: 'Tunjukkan tangan di dalam kamera untuk mula mengecam',
    freeCamLockedBanner: (title) => `"${title}" ditambah`
  }
};
