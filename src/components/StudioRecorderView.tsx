import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Camera,
  CameraOff,
  CircleDot,
  Download,
  Play,
  RotateCcw,
  Save,
  Square,
  Trash2,
  Upload
} from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import { WORLD_SIGN_LANGUAGES } from '../data/worldLanguages';
import type { Point3D, RecordedFrame, SignCategory, SignDefinition, UiLang } from '../data/types';
import { renderStageCanvas } from '../engine/canvasRenderer';
import { MediaPipeHandTracker } from '../engine/handTracker';
import { sampleSignAnimation } from '../engine/poseSynthesizer';
import { DynamicMotionTracker, evaluateStaticSign } from '../engine/signRecognizer';
import { exportLanguagePackJson, importLanguagePackJson } from '../utils/storage';

interface StudioRecorderViewProps {
  uiLang: UiLang;
  defaultLanguageId: string;
  customSigns: SignDefinition[];
  onSaveSign: (sign: SignDefinition) => void;
  onDeleteSign: (signId: string) => void;
  onImportComplete: () => void;
  onPracticeSign: (languageId: string, signId: string) => void;
}

function resampleRecordedFrames(frames: RecordedFrame[], targetCount: number): RecordedFrame[] {
  if (frames.length <= targetCount) {
    return frames.map((f, i) => ({
      t: frames.length === 1 ? 0 : i / (frames.length - 1),
      landmarks: f.landmarks,
      secondLandmarks: f.secondLandmarks
    }));
  }
  const out: RecordedFrame[] = [];
  for (let i = 0; i < targetCount; i += 1) {
    const idx = Math.round((i / (targetCount - 1)) * (frames.length - 1));
    out.push({
      t: i / (targetCount - 1),
      landmarks: frames[idx].landmarks,
      secondLandmarks: frames[idx].secondLandmarks
    });
  }
  return out;
}

export function StudioRecorderView({
  uiLang,
  defaultLanguageId,
  customSigns,
  onSaveSign,
  onDeleteSign,
  onImportComplete,
  onPracticeSign
}: StudioRecorderViewProps) {
  const t = UI_STRINGS[uiLang];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<MediaPipeHandTracker | null>(null);
  const dynamicTestTrackerRef = useRef(new DynamicMotionTracker());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [languageId, setLanguageId] = useState(defaultLanguageId);
  const [title, setTitle] = useState('');
  const [glossEn, setGlossEn] = useState('');
  const [glossBm, setGlossBm] = useState('');
  const [category, setCategory] = useState<SignCategory>('custom');
  const [mode, setMode] = useState<'static' | 'dynamic'>('dynamic');
  const [handsCount, setHandsCount] = useState<1 | 2>(1);
  const [descEn, setDescEn] = useState('');
  const [descBm, setDescBm] = useState('');
  const [facialCue, setFacialCue] = useState('');

  const [cameraActive, setCameraActive] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState<RecordedFrame[]>([]);
  const [testingMode, setTestingMode] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recordingFramesRef = useRef<RecordedFrame[]>([]);
  const isRecordingRef = useRef(false);
  const testingModeRef = useRef(false);
  const playbackProgressRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    setLanguageId(defaultLanguageId);
  }, [defaultLanguageId]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    testingModeRef.current = testingMode;
    dynamicTestTrackerRef.current.reset();
  }, [testingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setTestingMode(false);
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    try {
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
    } catch {
      stopCamera();
      setErrorMsg(t.cameraDeniedError);
    }
  }, [stopCamera, t.cameraDeniedError, t.modelLoadError]);

  useEffect(() => {
    return () => {
      stopCamera();
      trackerRef.current?.dispose();
    };
  }, [stopCamera]);

  const draftSign: SignDefinition | null =
    capturedFrames.length > 0
      ? {
          id: 'studio-draft',
          languageId,
          category,
          mode,
          hands: handsCount,
          title: title || 'Draft',
          glossEn: glossEn || title || 'Draft',
          glossBm: glossBm || title || 'Draf',
          descriptionEn: descEn || 'Custom recorded sign.',
          descriptionBm: descBm || 'Isyarat rakaman tersuai.',
          facialCueEn: facialCue || 'Natural expression.',
          facialCueBm: facialCue || 'Ekspresi semula jadi.',
          difficulty: 1,
          recordedFrames: capturedFrames
        }
      : null;

  // Render & capture loop
  useEffect(() => {
    let rafId = 0;

    const tick = (now: number) => {
      const dt = lastTimeRef.current ? Math.min(80, now - lastTimeRef.current) : 16;
      lastTimeRef.current = now;
      playbackProgressRef.current = (playbackProgressRef.current + dt / 2200) % 1;

      let userHands: Point3D[][] = [];
      if (cameraActive && videoRef.current && trackerRef.current) {
        const tracked = trackerRef.current.detect(videoRef.current, now, true);
        if (tracked) {
          userHands = tracked.hands;

          if (isRecordingRef.current && userHands.length > 0) {
            recordingFramesRef.current.push({
              t: recordingFramesRef.current.length,
              landmarks: userHands[0].map((p) => ({ ...p })),
              secondLandmarks: handsCount === 2 && userHands[1] ? userHands[1].map((p) => ({ ...p })) : undefined
            });
          }

          if (testingModeRef.current && draftSign) {
            if (mode === 'static') {
              const res = evaluateStaticSign(draftSign, userHands, uiLang);
              setTestScore(res.score);
            } else {
              const res = dynamicTestTrackerRef.current.update(draftSign, userHands, now, uiLang);
              setTestScore(res.score);
            }
          }
        }
      }

      const sampled = draftSign ? sampleSignAnimation(draftSign, playbackProgressRef.current) : null;
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
            mirror: true,
            showGhost: Boolean(sampled),
            ghostPrimary: sampled?.primary,
            ghostSecondary: sampled?.secondary,
            trailPoints: sampled?.trailPoints,
            currentTrailAnchor: sampled?.currentAnchor,
            userHands,
            holdProgress: testingMode ? testScore / 100 : 0,
            matched: testingMode && testScore >= 75
          });
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [cameraActive, draftSign, handsCount, mode, testScore, testingMode, uiLang]);

  const handleBeginRecord = () => {
    if (!cameraActive) {
      setErrorMsg(t.studioNeedCameraMsg);
      return;
    }
    setErrorMsg(null);
    setStatusMsg(null);
    setTestingMode(false);
    setCountdown(3);

    const step = (rem: number) => {
      if (rem > 1) {
        window.setTimeout(() => {
          setCountdown(rem - 1);
          step(rem - 1);
        }, 850);
      } else {
        window.setTimeout(() => {
          setCountdown(null);
          recordingFramesRef.current = [];
          setIsRecording(true);

          const captureMs = mode === 'static' ? 1000 : 2000;
          window.setTimeout(() => {
            setIsRecording(false);
            const raw = recordingFramesRef.current;
            if (raw.length === 0) {
              setErrorMsg(t.showHandPrompt);
              return;
            }
            if (mode === 'static') {
              const mid = raw[Math.floor(raw.length / 2)];
              setCapturedFrames([{ t: 0, landmarks: mid.landmarks, secondLandmarks: mid.secondLandmarks }]);
            } else {
              setCapturedFrames(resampleRecordedFrames(raw, 24));
            }
          }, captureMs);
        }, 850);
      }
    };
    step(3);
  };

  const handleSave = () => {
    setErrorMsg(null);
    if (!title.trim()) {
      setErrorMsg(t.studioNeedTitleMsg);
      return;
    }
    if (capturedFrames.length === 0) {
      setErrorMsg(t.studioNeedCaptureMsg);
      return;
    }
    const newSign: SignDefinition = {
      id: `custom-${languageId}-${Date.now()}`,
      languageId,
      category,
      mode,
      hands: handsCount,
      title: title.trim(),
      glossEn: glossEn.trim() || title.trim(),
      glossBm: glossBm.trim() || title.trim(),
      descriptionEn: descEn.trim() || 'Custom sign recorded in HandSaid Studio.',
      descriptionBm: descBm.trim() || 'Isyarat tersuai dirakam di Studio HandSaid.',
      facialCueEn: facialCue.trim() || 'Keep natural expression and clear hand placement.',
      facialCueBm: facialCue.trim() || 'Kekalkan ekspresi semula jadi dan kedudukan tangan yang jelas.',
      difficulty: 1,
      recordedFrames: capturedFrames,
      isCustom: true
    };
    onSaveSign(newSign);
    setTitle('');
    setGlossEn('');
    setGlossBm('');
    setDescEn('');
    setDescBm('');
    setFacialCue('');
    setCapturedFrames([]);
    setTestingMode(false);
  };

  const handleExport = () => {
    const json = exportLanguagePackJson(languageId, customSigns);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handsaid-${languageId}-pack.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const text = await file.text();
      const imported = importLanguagePackJson(text);
      onImportComplete();
      setStatusMsg(t.studioImportSuccess(imported.length));
    } catch {
      setErrorMsg(t.studioImportError);
    }
  };

  const langSigns = customSigns.filter((s) => s.languageId === languageId);

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">{t.studioTitle}</h1>
          <p className="section-subtitle">{t.studioSubtitle}</p>
        </div>
        <div className="control-group">
          <button type="button" className="btn btn-sm" onClick={handleExport} disabled={langSigns.length === 0}>
            <Download size={15} />
            <span>{t.studioExportBtn}</span>
          </button>
          <button type="button" className="btn btn-sm" onClick={() => fileInputRef.current?.click()}>
            <Upload size={15} />
            <span>{t.studioImportBtn}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </div>

      <div className="studio-grid">
        <section className="stage-card">
          <div className="stage-viewport">
            <video ref={videoRef} className="stage-video-hidden" playsInline muted />
            <canvas ref={canvasRef} className="stage-canvas" />

            {countdown !== null && (
              <div className="countdown-overlay">
                <div className="countdown-number">{countdown}</div>
              </div>
            )}

            <div className="stage-bottom-hud">
              <div className={`coach-pill ${isRecording ? 'is-matched' : 'is-preview'}`}>
                <span>
                  {loadingModel
                    ? t.loadingModelBanner
                    : isRecording
                      ? t.studioRecordingNow
                      : capturedFrames.length > 0
                        ? t.studioCapturedFrames(capturedFrames.length)
                        : mode === 'static'
                          ? t.studioCaptureHintStatic
                          : t.studioCaptureHintDynamic}
                </span>
              </div>
              {testingMode && (
                <div className="coach-pill is-matched">
                  <span>
                    {t.matchLabel}: {testScore}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="alert-banner" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {statusMsg && (
            <div
              className="alert-banner"
              style={{ background: '#E5F3F0', borderColor: '#0E6B5E', color: '#0A5349' }}
            >
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="stage-controls">
            <div className="control-group">
              {!cameraActive ? (
                <button type="button" className="btn btn-primary" onClick={startCamera}>
                  <Camera size={16} />
                  <span>{t.startCamera}</span>
                </button>
              ) : (
                <button type="button" className="btn" onClick={stopCamera}>
                  <CameraOff size={16} />
                  <span>{t.stopCamera}</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-amber"
                onClick={handleBeginRecord}
                disabled={!cameraActive || isRecording || countdown !== null}
              >
                <CircleDot size={16} />
                <span>{t.studioStartRecord}</span>
              </button>

              {capturedFrames.length > 0 && (
                <>
                  <button
                    type="button"
                    className={`btn btn-sm btn-toggle ${testingMode ? 'is-on' : ''}`}
                    onClick={() => setTestingMode((v) => !v)}
                    disabled={!cameraActive}
                  >
                    {testingMode ? <Square size={14} /> : <Play size={14} />}
                    <span>{testingMode ? t.studioStopTest : t.studioTestSign}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => {
                      setCapturedFrames([]);
                      setTestingMode(false);
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>{t.studioResetCapture}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="rail-stack">
          <section className="panel-card">
            <div className="form-grid">
              <label className="form-field is-full">
                <span className="form-label">{t.studioTargetLang}</span>
                <select
                  className="form-input"
                  value={languageId}
                  onChange={(e) => setLanguageId(e.target.value)}
                >
                  {WORLD_SIGN_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {uiLang === 'bm' ? lang.nameBm : lang.nameEn}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field is-full">
                <span className="form-label">{t.studioSignTitle}</span>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Selamat Datang / Welcome"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{t.studioGlossEn}</span>
                <input
                  type="text"
                  className="form-input"
                  value={glossEn}
                  onChange={(e) => setGlossEn(e.target.value)}
                  placeholder="Welcome"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{t.studioGlossBm}</span>
                <input
                  type="text"
                  className="form-input"
                  value={glossBm}
                  onChange={(e) => setGlossBm(e.target.value)}
                  placeholder="Selamat datang"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{t.studioMode}</span>
                <select
                  className="form-input"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'static' | 'dynamic')}
                >
                  <option value="dynamic">{t.modeDynamic}</option>
                  <option value="static">{t.modeStatic}</option>
                </select>
              </label>

              <label className="form-field">
                <span className="form-label">{t.studioHands}</span>
                <select
                  className="form-input"
                  value={handsCount}
                  onChange={(e) => setHandsCount(Number(e.target.value) as 1 | 2)}
                >
                  <option value={1}>{t.handsRequiredOne}</option>
                  <option value={2}>{t.handsRequiredTwo}</option>
                </select>
              </label>

              <label className="form-field">
                <span className="form-label">{t.studioCategory}</span>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SignCategory)}
                >
                  <option value="custom">{t.catCustom}</option>
                  <option value="everyday">{t.catEveryday}</option>
                  <option value="alphabet">{t.catAlphabet}</option>
                  <option value="number">{t.catNumber}</option>
                </select>
              </label>

              <label className="form-field">
                <span className="form-label">{t.studioFacialCue}</span>
                <input
                  type="text"
                  className="form-input"
                  value={facialCue}
                  onChange={(e) => setFacialCue(e.target.value)}
                  placeholder="Warm smile"
                />
              </label>

              <label className="form-field is-full">
                <span className="form-label">{t.studioDescEn}</span>
                <textarea
                  className="form-textarea"
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                />
              </label>

              <label className="form-field is-full">
                <span className="form-label">{t.studioDescBm}</span>
                <textarea
                  className="form-textarea"
                  value={descBm}
                  onChange={(e) => setDescBm(e.target.value)}
                />
              </label>
            </div>

            <div style={{ marginTop: 14 }}>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                <span>{t.studioSaveSign}</span>
              </button>
            </div>
          </section>

          <section className="panel-card">
            <h2 style={{ margin: 0, fontSize: '1.05rem' }}>{t.studioSavedTitle}</h2>
            {langSigns.length === 0 ? (
              <p className="sign-guide-meaning" style={{ marginTop: 8 }}>
                {t.studioEmptySaved}
              </p>
            ) : (
              <div className="custom-list">
                {langSigns.map((s) => (
                  <div key={s.id} className="custom-item">
                    <div>
                      <strong>{s.title}</strong>
                      <div className="sign-tile-sub">
                        {uiLang === 'bm' ? s.glossBm : s.glossEn}
                      </div>
                    </div>
                    <div className="control-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => onPracticeSign(s.languageId, s.id)}
                      >
                        <BookOpen size={14} />
                        <span>{t.studioPracticeBtn}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => onDeleteSign(s.id)}
                        aria-label={`${t.studioDeleteBtn} ${s.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
