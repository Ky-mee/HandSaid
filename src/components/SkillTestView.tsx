import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  Camera,
  CameraOff,
  CheckCircle2,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  SkipForward,
  Square,
  Trash2,
  XCircle
} from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import { getStatementsForLanguage } from '../data/statements';
import type {
  FingerName,
  Point3D,
  SignCategory,
  SignDefinition,
  TestSessionRecord,
  UiLang
} from '../data/types';
import { renderStageCanvas } from '../engine/canvasRenderer';
import { MediaPipeHandTracker } from '../engine/handTracker';
import { DynamicMotionTracker, evaluateStaticSign } from '../engine/signRecognizer';
import { playMatchChime } from '../utils/sound';
import { SignAvatar3D } from './SignAvatar3D';

interface SkillTestViewProps {
  uiLang: UiLang;
  activeLanguageId: string;
  signs: SignDefinition[];
  mirrorCamera: boolean;
  soundEnabled: boolean;
  initialStatementId?: string;
  onClearInitialStatement?: () => void;
  onSignMastered: (signId: string) => void;
  onSaveTestSession: (record: TestSessionRecord) => void;
  onStatementCompleted: () => void;
  onPracticeSign: (signId: string) => void;
}

type TestModeTab = 'camera' | 'visual' | 'statement';

interface QuizResultItem {
  sign: SignDefinition;
  passed: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuizOptions(target: SignDefinition, pool: SignDefinition[]): SignDefinition[] {
  const sameCat = pool.filter((s) => s.id !== target.id && s.category === target.category);
  const others = pool.filter((s) => s.id !== target.id && s.category !== target.category);
  const distractors = [...shuffle(sameCat), ...shuffle(others)].slice(0, 3);
  return shuffle([target, ...distractors]);
}

export function SkillTestView({
  uiLang,
  activeLanguageId,
  signs,
  mirrorCamera,
  soundEnabled,
  initialStatementId,
  onClearInitialStatement,
  onSignMastered,
  onSaveTestSession,
  onStatementCompleted,
  onPracticeSign
}: SkillTestViewProps) {
  const t = UI_STRINGS[uiLang];

  const [modeTab, setModeTab] = useState<TestModeTab>(initialStatementId ? 'statement' : 'camera');
  const [category, setCategory] = useState<SignCategory | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Camera & shared 3D loop refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<MediaPipeHandTracker | null>(null);
  const dynamicTrackerRef = useRef(new DynamicMotionTracker());
  const breadcrumbRef = useRef<Array<[number, number]>>([]);
  const holdMsRef = useRef(0);
  const holdProgressRef = useRef(0);
  const loopProgressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const advanceLockRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Camera Skill Test state
  const [camPhase, setCamPhase] = useState<'setup' | 'running' | 'report'>('setup');
  const [camQuestions, setCamQuestions] = useState<SignDefinition[]>([]);
  const [camIndex, setCamIndex] = useState(0);
  const [camResults, setCamResults] = useState<QuizResultItem[]>([]);
  const [camScore, setCamScore] = useState(0);
  const [camHint, setCamHint] = useState('');
  const [peek3d, setPeek3d] = useState(false);
  const [camStartMs, setCamStartMs] = useState(0);
  const [camDurationSec, setCamDurationSec] = useState(0);

  // Visual 3D Quiz state
  const [visPhase, setVisPhase] = useState<'setup' | 'running' | 'report'>('setup');
  const [visQuestions, setVisQuestions] = useState<SignDefinition[]>([]);
  const [visIndex, setVisIndex] = useState(0);
  const [visOptions, setVisOptions] = useState<SignDefinition[]>([]);
  const [visPickedId, setVisPickedId] = useState<string | null>(null);
  const [visResults, setVisResults] = useState<QuizResultItem[]>([]);
  const [visStartMs, setVisStartMs] = useState(0);
  const [visDurationSec, setVisDurationSec] = useState(0);
  const [visPaused, setVisPaused] = useState(false);

  // Statement Challenge state
  const curatedStatements = useMemo(() => {
    const list = getStatementsForLanguage(activeLanguageId);
    return list.length > 0 ? list : getStatementsForLanguage('bim');
  }, [activeLanguageId]);

  const signMap = useMemo(() => new Map(signs.map((s) => [s.id, s])), [signs]);

  const [selectedStmtId, setSelectedStmtId] = useState<string>(
    () => initialStatementId || curatedStatements[0]?.id || ''
  );
  const [customMode, setCustomMode] = useState(false);
  const [customStmtSigns, setCustomStmtSigns] = useState<SignDefinition[]>([]);
  const [stmtPlaying3d, setStmtPlaying3d] = useState(false);
  const [stmt3dIndex, setStmt3dIndex] = useState(0);
  const [stmtLiveActive, setStmtLiveActive] = useState(false);
  const [stmtLiveIndex, setStmtLiveIndex] = useState(0);
  const [stmtCompleted, setStmtCompleted] = useState(false);
  const [stmtLiveScore, setStmtLiveScore] = useState(0);
  const [stmtStartMs, setStmtStartMs] = useState(0);

  useEffect(() => {
    if (initialStatementId) {
      setModeTab('statement');
      setCustomMode(false);
      setSelectedStmtId(initialStatementId);
      onClearInitialStatement?.();
    }
  }, [initialStatementId, onClearInitialStatement]);

  useEffect(() => {
    if (!curatedStatements.some((s) => s.id === selectedStmtId) && curatedStatements[0]) {
      setSelectedStmtId(curatedStatements[0].id);
    }
  }, [curatedStatements, selectedStmtId]);

  const activeStatementSigns = useMemo(() => {
    if (customMode) return customStmtSigns;
    const found = curatedStatements.find((s) => s.id === selectedStmtId) ?? curatedStatements[0];
    if (!found) return [];
    return found.signIds
      .map((id) => signMap.get(id))
      .filter((s): s is SignDefinition => Boolean(s));
  }, [customMode, customStmtSigns, curatedStatements, selectedStmtId, signMap]);

  const activeStatementTemplate = useMemo(
    () => curatedStatements.find((s) => s.id === selectedStmtId) ?? curatedStatements[0],
    [curatedStatements, selectedStmtId]
  );

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    holdMsRef.current = 0;
    holdProgressRef.current = 0;
    breadcrumbRef.current = [];
    setCameraActive(false);
    setStmtLiveActive(false);
  }, []);

  const startCameraStream = useCallback(async (): Promise<boolean> => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg(t.cameraGenericError);
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      if (!trackerRef.current) {
        trackerRef.current = new MediaPipeHandTracker();
      }
      setLoadingModel(true);
      try {
        await trackerRef.current.init();
      } catch {
        setErrorMsg(t.modelLoadError);
      } finally {
        setLoadingModel(false);
      }
      return true;
    } catch (err) {
      stopCamera();
      const domErr = err as DOMException;
      if (domErr?.name === 'NotAllowedError' || domErr?.name === 'PermissionDeniedError') {
        setErrorMsg(t.cameraDeniedError);
      } else {
        setErrorMsg(t.cameraGenericError);
      }
      return false;
    }
  }, [stopCamera, t.cameraDeniedError, t.cameraGenericError, t.modelLoadError]);

  useEffect(() => {
    return () => {
      stopCamera();
      trackerRef.current?.dispose();
    };
  }, [stopCamera]);

  const handleSwitchMode = (next: TestModeTab) => {
    stopCamera();
    setStmtPlaying3d(false);
    setCamPhase('setup');
    setVisPhase('setup');
    setModeTab(next);
  };

  // --- Camera Skill Test flow ---
  const filteredPool = useMemo(() => {
    if (category === 'all') return signs;
    const match = signs.filter((s) => s.category === category);
    return match.length > 0 ? match : signs;
  }, [category, signs]);

  const handleStartCameraTest = async () => {
    const picked = shuffle(filteredPool).slice(0, Math.min(questionCount, filteredPool.length));
    if (picked.length === 0) return;
    const ok = await startCameraStream();
    if (!ok) return;
    dynamicTrackerRef.current.reset();
    holdMsRef.current = 0;
    holdProgressRef.current = 0;
    advanceLockRef.current = false;
    setCamQuestions(picked);
    setCamIndex(0);
    setCamResults([]);
    setCamScore(0);
    setCamHint(t.testSignPrompt);
    setPeek3d(false);
    setCamStartMs(Date.now());
    setCamPhase('running');
  };

  const advanceCameraQuestion = useCallback(
    (passed: boolean) => {
      if (advanceLockRef.current) return;
      advanceLockRef.current = true;
      const currentSign = camQuestions[camIndex];
      if (!currentSign) return;

      if (passed) {
        onSignMastered(currentSign.id);
        if (soundEnabled) playMatchChime();
      }

      const nextResults = [...camResults, { sign: currentSign, passed }];
      setCamResults(nextResults);

      if (camIndex + 1 >= camQuestions.length) {
        const durationSec = Math.max(1, Math.round((Date.now() - camStartMs) / 1000));
        const correctCount = nextResults.filter((r) => r.passed).length;
        const accuracyPct = Math.round((correctCount / nextResults.length) * 100);
        setCamDurationSec(durationSec);
        onSaveTestSession({
          id: `test-cam-${Date.now()}`,
          languageId: activeLanguageId,
          mode: 'camera-quiz',
          dateIso: new Date().toISOString(),
          totalQuestions: nextResults.length,
          correctCount,
          accuracyPct,
          durationSec
        });
        stopCamera();
        setCamPhase('report');
        advanceLockRef.current = false;
      } else {
        window.setTimeout(() => {
          dynamicTrackerRef.current.reset();
          holdMsRef.current = 0;
          holdProgressRef.current = 0;
          breadcrumbRef.current = [];
          setCamIndex((i) => i + 1);
          setCamScore(0);
          setCamHint(t.testSignPrompt);
          advanceLockRef.current = false;
        }, 650);
      }
    },
    [
      activeLanguageId,
      camIndex,
      camQuestions,
      camResults,
      camStartMs,
      onSaveTestSession,
      onSignMastered,
      soundEnabled,
      stopCamera,
      t.testSignPrompt
    ]
  );

  // --- Visual Quiz flow ---
  const handleStartVisualQuiz = () => {
    const picked = shuffle(filteredPool).slice(0, Math.min(questionCount, filteredPool.length));
    if (picked.length === 0) return;
    setVisQuestions(picked);
    setVisIndex(0);
    setVisOptions(buildQuizOptions(picked[0], signs));
    setVisPickedId(null);
    setVisResults([]);
    setVisStartMs(Date.now());
    setVisPaused(false);
    loopProgressRef.current = 0;
    setVisPhase('running');
  };

  const handlePickVisualOption = (optionId: string) => {
    if (visPickedId !== null) return;
    const target = visQuestions[visIndex];
    if (!target) return;
    const passed = optionId === target.id;
    setVisPickedId(optionId);
    if (passed && soundEnabled) playMatchChime();

    const nextResults = [...visResults, { sign: target, passed }];
    setVisResults(nextResults);

    window.setTimeout(() => {
      if (visIndex + 1 >= visQuestions.length) {
        const durationSec = Math.max(1, Math.round((Date.now() - visStartMs) / 1000));
        const correctCount = nextResults.filter((r) => r.passed).length;
        const accuracyPct = Math.round((correctCount / nextResults.length) * 100);
        setVisDurationSec(durationSec);
        onSaveTestSession({
          id: `test-vis-${Date.now()}`,
          languageId: activeLanguageId,
          mode: 'visual-quiz',
          dateIso: new Date().toISOString(),
          totalQuestions: nextResults.length,
          correctCount,
          accuracyPct,
          durationSec
        });
        setVisPhase('report');
      } else {
        const nextIdx = visIndex + 1;
        setVisIndex(nextIdx);
        setVisOptions(buildQuizOptions(visQuestions[nextIdx], signs));
        setVisPickedId(null);
        loopProgressRef.current = 0;
      }
    }, 850);
  };

  // --- Statement Challenge flow ---
  const handleStartLiveStatement = async () => {
    if (activeStatementSigns.length === 0) return;
    setStmtPlaying3d(false);
    setStmtCompleted(false);
    setStmtLiveIndex(0);
    setStmtLiveScore(0);
    dynamicTrackerRef.current.reset();
    holdMsRef.current = 0;
    holdProgressRef.current = 0;
    advanceLockRef.current = false;
    const ok = await startCameraStream();
    if (!ok) return;
    setStmtStartMs(Date.now());
    setStmtLiveActive(true);
  };

  const advanceLiveStatement = useCallback(() => {
    if (advanceLockRef.current) return;
    advanceLockRef.current = true;
    const curSign = activeStatementSigns[stmtLiveIndex];
    if (curSign) onSignMastered(curSign.id);
    if (soundEnabled) playMatchChime();

    if (stmtLiveIndex + 1 >= activeStatementSigns.length) {
      const durationSec = Math.max(1, Math.round((Date.now() - stmtStartMs) / 1000));
      setStmtCompleted(true);
      onStatementCompleted();
      onSaveTestSession({
        id: `test-stmt-${Date.now()}`,
        languageId: activeLanguageId,
        mode: 'statement',
        dateIso: new Date().toISOString(),
        totalQuestions: activeStatementSigns.length,
        correctCount: activeStatementSigns.length,
        accuracyPct: 100,
        durationSec
      });
      stopCamera();
      advanceLockRef.current = false;
    } else {
      window.setTimeout(() => {
        dynamicTrackerRef.current.reset();
        holdMsRef.current = 0;
        holdProgressRef.current = 0;
        breadcrumbRef.current = [];
        setStmtLiveIndex((i) => i + 1);
        setStmtLiveScore(0);
        advanceLockRef.current = false;
      }, 650);
    }
  }, [
    activeLanguageId,
    activeStatementSigns,
    onSaveTestSession,
    onSignMastered,
    onStatementCompleted,
    soundEnabled,
    stmtLiveIndex,
    stmtStartMs,
    stopCamera
  ]);

  // Unified RAF loop for 3D timers + Camera Test / Live Statement inference
  useEffect(() => {
    let rafId = 0;

    const tick = (now: number) => {
      const dt = lastTimeRef.current ? Math.min(80, now - lastTimeRef.current) : 16;
      lastTimeRef.current = now;

      // Update 3D animation clock
      if (modeTab === 'visual' && visPhase === 'running' && !visPaused) {
        const curVis = visQuestions[visIndex];
        const cycleMs = curVis?.mode === 'dynamic' ? 2400 : 3000;
        loopProgressRef.current = (loopProgressRef.current + dt / cycleMs) % 1;
      } else if (modeTab === 'statement' && stmtPlaying3d && activeStatementSigns.length > 0) {
        const curStmt = activeStatementSigns[stmt3dIndex] ?? activeStatementSigns[0];
        const stepMs = curStmt?.mode === 'dynamic' ? 2100 : 1700;
        const nextProg = loopProgressRef.current + dt / stepMs;
        if (nextProg >= 1) {
          loopProgressRef.current = 0;
          setStmt3dIndex((idx) => (idx + 1) % activeStatementSigns.length);
        } else {
          loopProgressRef.current = nextProg;
        }
      } else {
        loopProgressRef.current = (loopProgressRef.current + dt / 2400) % 1;
      }

      // Run MediaPipe inference when camera is active for Camera Test or Statement Challenge
      const targetSign =
        modeTab === 'camera' && camPhase === 'running'
          ? camQuestions[camIndex]
          : modeTab === 'statement' && stmtLiveActive
            ? activeStatementSigns[stmtLiveIndex]
            : undefined;

      if (cameraActive && targetSign) {
        let userHands: Point3D[][] = [];
        let fingerStatus: Record<FingerName, 'match' | 'adjust'> | undefined;
        let currentScore = 0;
        let currentMatched = false;

        if (videoRef.current && trackerRef.current) {
          const tracked = trackerRef.current.detect(videoRef.current, now, mirrorCamera);
          if (tracked) {
            userHands = tracked.hands;
            if (userHands.length > 0) {
              const center = userHands[0][9] ?? userHands[0][0];
              breadcrumbRef.current.push([center.x, center.y]);
              if (breadcrumbRef.current.length > 24) breadcrumbRef.current.shift();
            } else {
              breadcrumbRef.current = [];
            }

            if (targetSign.mode === 'static') {
              const res = evaluateStaticSign(targetSign, userHands, uiLang);
              currentScore = res.score;
              fingerStatus = res.fingerStatus;
              if (res.matched) {
                holdMsRef.current = Math.min(620, holdMsRef.current + dt);
              } else {
                holdMsRef.current = Math.max(0, holdMsRef.current - dt * 1.6);
              }
              const prog = holdMsRef.current / 620;
              holdProgressRef.current = prog;
              currentMatched = prog >= 1;
              if (modeTab === 'camera') {
                setCamScore(res.score);
                setCamHint(res.hint || t.testSignPrompt);
              } else {
                setStmtLiveScore(res.score);
              }
            } else {
              const res = dynamicTrackerRef.current.update(targetSign, userHands, now, uiLang);
              currentScore = res.score;
              fingerStatus = res.fingerStatus;
              holdProgressRef.current = res.progress;
              currentMatched = res.matched;
              if (modeTab === 'camera') {
                setCamScore(res.score);
                setCamHint(res.hint || t.followTrailPrompt);
              } else {
                setStmtLiveScore(res.score);
              }
            }

            if (currentMatched) {
              if (modeTab === 'camera' && camPhase === 'running') {
                advanceCameraQuestion(true);
              } else if (modeTab === 'statement' && stmtLiveActive) {
                advanceLiveStatement();
              }
            }
          }
        }

        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = Math.max(320, Math.round(rect.width * dpr));
          const h = Math.max(240, Math.round(rect.height * dpr));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            renderStageCanvas({
              ctx,
              width: canvas.width,
              height: canvas.height,
              video: videoRef.current,
              cameraActive,
              mirror: mirrorCamera,
              showGhost: false,
              userHands,
              userBreadcrumbTrail: breadcrumbRef.current,
              fingerStatus,
              holdProgress: currentScore > 0 ? holdProgressRef.current : 0,
              matched: advanceLockRef.current
            });
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [
    activeStatementSigns,
    advanceCameraQuestion,
    advanceLiveStatement,
    camIndex,
    camPhase,
    camQuestions,
    cameraActive,
    mirrorCamera,
    modeTab,
    stmt3dIndex,
    stmtLiveActive,
    stmtLiveIndex,
    stmtPlaying3d,
    t.followTrailPrompt,
    t.testSignPrompt,
    uiLang,
    visIndex,
    visPaused,
    visPhase,
    visQuestions
  ]);

  const currentCamSign = camQuestions[camIndex];
  const currentVisSign = visQuestions[visIndex];
  const currentStmtSign = stmtLiveActive
    ? activeStatementSigns[stmtLiveIndex]
    : activeStatementSigns[stmt3dIndex] ?? activeStatementSigns[0];

  const renderReportCard = (
    results: QuizResultItem[],
    durationSec: number,
    onRetake: () => void
  ) => {
    const passedCount = results.filter((r) => r.passed).length;
    const accuracy = results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0;
    return (
      <section className="panel-card report-card">
        <div className="report-header">
          <div>
            <h2 className="dash-panel-title">{t.testReportTitle}</h2>
            <p className="sign-guide-meaning">
              {passedCount} / {results.length} · {t.testAccuracyLabel}: {accuracy}% · {t.testTimeLabel}:{' '}
              {durationSec}s
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onRetake}>
            <RotateCcw size={15} />
            <span>{t.testRetakeBtn}</span>
          </button>
        </div>

        <div className="report-list">
          {results.map((item, idx) => (
            <div key={`${item.sign.id}-${idx}`} className="report-row">
              <div className="control-group">
                {item.passed ? (
                  <CheckCircle2 size={17} style={{ color: 'var(--status-ok)' }} />
                ) : (
                  <XCircle size={17} style={{ color: 'var(--status-warn)' }} />
                )}
                <strong>{item.sign.title}</strong>
                <span className="sign-tile-sub" style={{ width: 'auto' }}>
                  {uiLang === 'bm' ? item.sign.glossBm : item.sign.glossEn}
                </span>
              </div>
              {!item.passed && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => onPracticeSign(item.sign.id)}
                >
                  <span>{t.testPracticeMissedBtn}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div>
      <video ref={videoRef} className="stage-video-hidden" playsInline muted />

      <div className="section-header">
        <div>
          <h1 className="section-title">{t.testTitle}</h1>
          <p className="section-subtitle">{t.testSubtitle}</p>
        </div>

        <div className="nav-tabs" role="tablist" aria-label="Skill test mode">
          <button
            type="button"
            role="tab"
            aria-selected={modeTab === 'camera'}
            className={`nav-tab ${modeTab === 'camera' ? 'is-active' : ''}`}
            onClick={() => handleSwitchMode('camera')}
          >
            <Camera size={15} />
            <span>{t.testModeCamera}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modeTab === 'visual'}
            className={`nav-tab ${modeTab === 'visual' ? 'is-active' : ''}`}
            onClick={() => handleSwitchMode('visual')}
          >
            <Eye size={15} />
            <span>{t.testModeVisual}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modeTab === 'statement'}
            className={`nav-tab ${modeTab === 'statement' ? 'is-active' : ''}`}
            onClick={() => handleSwitchMode('statement')}
          >
            <Award size={15} />
            <span>{t.testModeStatement}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="alert-banner" role="alert" style={{ margin: '0 0 14px' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. CAMERA SKILL TEST */}
      {modeTab === 'camera' && (
        <div>
          {camPhase === 'setup' && (
            <section className="panel-card test-setup-card">
              <div className="form-grid">
                <label className="form-field">
                  <span className="form-label">{t.testCategoryLabel}</span>
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SignCategory | 'all')}
                  >
                    <option value="all">{t.catAll}</option>
                    <option value="alphabet">{t.catAlphabet}</option>
                    <option value="number">{t.catNumber}</option>
                    <option value="everyday">{t.catEveryday}</option>
                    <option value="people">{t.catPeople}</option>
                    <option value="feelings">{t.catFeelings}</option>
                  </select>
                </label>

                <label className="form-field">
                  <span className="form-label">{t.testCountLabel}</span>
                  <select
                    className="form-input"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                  </select>
                </label>
              </div>

              <div style={{ marginTop: 16 }}>
                <button type="button" className="btn btn-primary" onClick={handleStartCameraTest}>
                  <Camera size={16} />
                  <span>{t.testStartBtn}</span>
                </button>
              </div>
            </section>
          )}

          {camPhase === 'running' && currentCamSign && (
            <div className="stage-card">
              <div className={peek3d ? 'stage-split-layout' : ''}>
                {peek3d && (
                  <div className="stage-viewport is-split-3d">
                    <SignAvatar3D
                      sign={currentCamSign}
                      uiLang={uiLang}
                      loopProgressRef={loopProgressRef}
                      showTrail
                      compact
                      paused={false}
                      onTogglePaused={() => undefined}
                    />
                  </div>
                )}

                <div className={`stage-viewport ${peek3d ? 'is-split-cam' : ''}`}>
                  <canvas ref={canvasRef} className="stage-canvas" />
                  <div className="stage-top-hud">
                    <div className="stage-sign-badge">
                      <div className="sign-tile-sub" style={{ color: 'var(--ink-muted-stage)' }}>
                        {t.testQuestionLabel(camIndex + 1, camQuestions.length)}
                      </div>
                      <div className="stage-sign-title-row">
                        <span className="stage-sign-title">{currentCamSign.title}</span>
                        <span className="stage-sign-gloss">
                          {uiLang === 'bm' ? currentCamSign.glossBm : currentCamSign.glossEn}
                        </span>
                      </div>
                    </div>

                    <div className="stage-score-box">
                      <div>
                        <span className="stage-score-label">{t.matchLabel}</span>
                        <span className="stage-score-num">{camScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="stage-bottom-hud">
                    <div className="coach-pill">
                      <span>{loadingModel ? t.loadingModelBanner : camHint}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stage-controls">
                <div className="control-group">
                  <button
                    type="button"
                    className={`btn btn-sm btn-toggle ${peek3d ? 'is-on' : ''}`}
                    onClick={() => setPeek3d((v) => !v)}
                  >
                    {peek3d ? <EyeOff size={15} /> : <Eye size={15} />}
                    <span>{peek3d ? t.testHideHint : t.testPeekHint}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => advanceCameraQuestion(false)}
                  >
                    <SkipForward size={15} />
                    <span>{t.testSkipBtn}</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-amber"
                  onClick={() => {
                    stopCamera();
                    setCamPhase('setup');
                  }}
                >
                  <CameraOff size={15} />
                  <span>{t.stopCamera}</span>
                </button>
              </div>
            </div>
          )}

          {camPhase === 'report' &&
            renderReportCard(camResults, camDurationSec, () => setCamPhase('setup'))}
        </div>
      )}

      {/* 2. VISUAL 3D QUIZ */}
      {modeTab === 'visual' && (
        <div>
          {visPhase === 'setup' && (
            <section className="panel-card test-setup-card">
              <div className="form-grid">
                <label className="form-field">
                  <span className="form-label">{t.testCategoryLabel}</span>
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SignCategory | 'all')}
                  >
                    <option value="all">{t.catAll}</option>
                    <option value="alphabet">{t.catAlphabet}</option>
                    <option value="number">{t.catNumber}</option>
                    <option value="everyday">{t.catEveryday}</option>
                    <option value="people">{t.catPeople}</option>
                    <option value="feelings">{t.catFeelings}</option>
                  </select>
                </label>

                <label className="form-field">
                  <span className="form-label">{t.testCountLabel}</span>
                  <select
                    className="form-input"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                  </select>
                </label>
              </div>

              <div style={{ marginTop: 16 }}>
                <button type="button" className="btn btn-primary" onClick={handleStartVisualQuiz}>
                  <Play size={16} />
                  <span>{t.testStartBtn}</span>
                </button>
              </div>
            </section>
          )}

          {visPhase === 'running' && currentVisSign && (
            <div className="learn-grid">
              <div className="stage-card">
                <div className="stage-viewport">
                  <SignAvatar3D
                    sign={currentVisSign}
                    uiLang={uiLang}
                    loopProgressRef={loopProgressRef}
                    showTrail
                    paused={visPaused}
                    onTogglePaused={() => setVisPaused((p) => !p)}
                  />
                  <div className="stage-top-hud">
                    <div className="stage-sign-badge">
                      <span className="stage-sign-gloss">
                        {t.testQuestionLabel(visIndex + 1, visQuestions.length)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <section className="panel-card">
                <h2 className="dash-panel-title">{t.testVisualPrompt}</h2>
                <div className="quiz-options-grid">
                  {visOptions.map((opt) => {
                    const isPicked = visPickedId === opt.id;
                    const isCorrect = opt.id === currentVisSign.id;
                    let cls = 'quiz-option-btn';
                    if (visPickedId !== null) {
                      if (isCorrect) cls += ' is-correct';
                      else if (isPicked) cls += ' is-wrong';
                    }
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={cls}
                        disabled={visPickedId !== null}
                        onClick={() => handlePickVisualOption(opt.id)}
                      >
                        <strong>{opt.title}</strong>
                        <span className="sign-tile-sub">
                          {uiLang === 'bm' ? opt.glossBm : opt.glossEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {visPhase === 'report' &&
            renderReportCard(visResults, visDurationSec, () => setVisPhase('setup'))}
        </div>
      )}

      {/* 3. STATEMENT CHALLENGE & COMPOSER */}
      {modeTab === 'statement' && (
        <div className="learn-grid">
          <div className="stage-card">
            {stmtLiveActive ? (
              <div className="stage-viewport">
                <canvas ref={canvasRef} className="stage-canvas" />
                {currentStmtSign && (
                  <div className="stage-top-hud">
                    <div className="stage-sign-badge">
                      <div className="stage-sign-title-row">
                        <span className="stage-sign-title">{currentStmtSign.title}</span>
                        <span className="stage-sign-gloss">
                          {uiLang === 'bm' ? currentStmtSign.glossBm : currentStmtSign.glossEn}
                        </span>
                      </div>
                    </div>
                    <div className="stage-score-box">
                      <div>
                        <span className="stage-score-label">{t.matchLabel}</span>
                        <span className="stage-score-num">{stmtLiveScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="stage-viewport">
                {currentStmtSign ? (
                  <SignAvatar3D
                    sign={currentStmtSign}
                    uiLang={uiLang}
                    loopProgressRef={loopProgressRef}
                    showTrail
                    paused={!stmtPlaying3d}
                    onTogglePaused={() => {
                      if (!stmtPlaying3d) loopProgressRef.current = 0;
                      setStmtPlaying3d((v) => !v);
                    }}
                  />
                ) : (
                  <div className="avatar-webgl-fallback">{t.stmtCustomEmpty}</div>
                )}

                {currentStmtSign && (
                  <div className="stage-top-hud">
                    <div className="stage-sign-badge">
                      <div className="stage-sign-title-row">
                        <span className="stage-sign-title">{currentStmtSign.title}</span>
                        <span className="stage-sign-gloss">
                          {uiLang === 'bm' ? currentStmtSign.glossBm : currentStmtSign.glossEn}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Statement word sequence track */}
            <div className="statement-word-track">
              {activeStatementSigns.length === 0 ? (
                <span className="sign-tile-sub">{t.stmtCustomEmpty}</span>
              ) : (
                activeStatementSigns.map((s, idx) => {
                  const isCurrent = stmtLiveActive
                    ? idx === stmtLiveIndex
                    : stmtPlaying3d && idx === stmt3dIndex;
                  const isDone = stmtCompleted || (stmtLiveActive && idx < stmtLiveIndex);
                  return (
                    <button
                      key={`${s.id}-${idx}`}
                      type="button"
                      className={`statement-chip ${isCurrent ? 'is-current' : ''} ${
                        isDone ? 'is-done' : ''
                      }`}
                      onClick={() => {
                        if (!stmtLiveActive) {
                          setStmt3dIndex(idx);
                          loopProgressRef.current = 0;
                        }
                      }}
                    >
                      {isDone && <CheckCircle2 size={14} />}
                      <span>{s.title}</span>
                    </button>
                  );
                })
              )}
            </div>

            {stmtCompleted && (
              <div
                className="alert-banner"
                style={{ background: '#E5F3F0', borderColor: '#0E6B5E', color: '#0A5349' }}
              >
                <CheckCircle2 size={18} />
                <span>{t.stmtCompletedBanner}</span>
              </div>
            )}

            <div className="stage-controls">
              <div className="control-group">
                {!stmtLiveActive ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={activeStatementSigns.length === 0}
                      onClick={handleStartLiveStatement}
                    >
                      <Camera size={16} />
                      <span>{t.stmtSignLiveBtn}</span>
                    </button>
                    <button
                      type="button"
                      className="btn"
                      disabled={activeStatementSigns.length === 0}
                      onClick={() => {
                        if (!stmtPlaying3d) {
                          setStmt3dIndex(0);
                          loopProgressRef.current = 0;
                        }
                        setStmtPlaying3d((v) => !v);
                      }}
                    >
                      {stmtPlaying3d ? <Square size={15} /> : <Play size={15} />}
                      <span>{stmtPlaying3d ? t.stmtStop3dBtn : t.stmtWatch3dBtn}</span>
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-amber" onClick={stopCamera}>
                    <CameraOff size={16} />
                    <span>{t.stopCamera}</span>
                  </button>
                )}
              </div>

              {customMode && customStmtSigns.length > 0 && !stmtLiveActive && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setCustomStmtSigns([]);
                    setStmt3dIndex(0);
                    setStmtCompleted(false);
                  }}
                >
                  <Trash2 size={14} />
                  <span>{t.stmtClearBtn}</span>
                </button>
              )}
            </div>
          </div>

          <section className="panel-card">
            <div className="category-tabs">
              <button
                type="button"
                className={`cat-tab ${!customMode ? 'is-active' : ''}`}
                onClick={() => {
                  setCustomMode(false);
                  setStmt3dIndex(0);
                  setStmtCompleted(false);
                }}
              >
                {t.stmtPresetsLabel}
              </button>
              <button
                type="button"
                className={`cat-tab ${customMode ? 'is-active' : ''}`}
                onClick={() => {
                  setCustomMode(true);
                  setStmt3dIndex(0);
                  setStmtCompleted(false);
                }}
              >
                {t.stmtCustomToggle}
              </button>
            </div>

            {!customMode ? (
              <div className="history-list">
                {curatedStatements.map((stmt) => {
                  const isActive = activeStatementTemplate?.id === stmt.id;
                  return (
                    <button
                      key={stmt.id}
                      type="button"
                      className={`statement-select-row ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelectedStmtId(stmt.id);
                        setStmt3dIndex(0);
                        setStmtCompleted(false);
                        loopProgressRef.current = 0;
                      }}
                    >
                      <strong>{uiLang === 'bm' ? stmt.titleBm : stmt.titleEn}</strong>
                      <span className="sign-tile-sub">
                        {uiLang === 'bm' ? stmt.translationBm : stmt.translationEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="sign-tile-grid is-wide">
                {signs
                  .filter((s) => s.category !== 'alphabet' && s.category !== 'number')
                  .map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="sign-tile"
                      onClick={() => {
                        setCustomStmtSigns((prev) => [...prev, s]);
                        setStmtCompleted(false);
                      }}
                    >
                      <span className="sign-tile-title">+ {s.title}</span>
                      <span className="sign-tile-sub">
                        {uiLang === 'bm' ? s.glossBm : s.glossEn}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
