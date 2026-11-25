import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CameraOff,
  Check,
  Copy,
  Delete,
  FlipHorizontal2,
  Play,
  Space,
  Square,
  Trash2,
  Volume2,
  X
} from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import type { Point3D, SignDefinition, UiLang } from '../data/types';
import { renderStageCanvas } from '../engine/canvasRenderer';
import {
  ContinuousSignRecognizer,
  formatStatementFromSigns,
  type FreeCamCandidate,
  type FreeCamScope,
  type StatementToken
} from '../engine/freeCameraRecognizer';
import { MediaPipeHandTracker } from '../engine/handTracker';
import { playMatchChime } from '../utils/sound';
import { SignAvatar3D } from './SignAvatar3D';

interface FreeCameraViewProps {
  uiLang: UiLang;
  signs: SignDefinition[];
  mirrorCamera: boolean;
  onToggleMirror: () => void;
  soundEnabled: boolean;
  onStatementBuilt: () => void;
}

export function FreeCameraView({
  uiLang,
  signs,
  mirrorCamera,
  onToggleMirror,
  soundEnabled,
  onStatementBuilt
}: FreeCameraViewProps) {
  const t = UI_STRINGS[uiLang];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<MediaPipeHandTracker | null>(null);
  const recognizerRef = useRef(new ContinuousSignRecognizer());
  const breadcrumbRef = useRef<Array<[number, number]>>([]);
  const loopProgressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const statementLoggedRef = useRef(false);

  const [scope, setScope] = useState<FreeCamScope>('words');
  const [cameraActive, setCameraActive] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<FreeCamCandidate[]>([]);
  const [lockProgress, setLockProgress] = useState(0);
  const [handsDetected, setHandsDetected] = useState(0);
  const [lockedFlash, setLockedFlash] = useState<string | null>(null);
  const [tokens, setTokens] = useState<StatementToken[]>([]);
  const [copied, setCopied] = useState(false);
  const [replayOpen, setReplayOpen] = useState(false);
  const [replayIdx, setReplayIdx] = useState(0);

  const scopeRef = useRef(scope);
  const signsRef = useRef(signs);
  const soundRef = useRef(soundEnabled);

  useEffect(() => {
    scopeRef.current = scope;
    recognizerRef.current.reset();
    setCandidates([]);
    setLockProgress(0);
  }, [scope]);

  useEffect(() => {
    signsRef.current = signs;
  }, [signs]);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    recognizerRef.current.reset();
    breadcrumbRef.current = [];
    setCameraActive(false);
    setStartingCamera(false);
    setCandidates([]);
    setLockProgress(0);
    setHandsDetected(0);
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMsg(null);
    setStartingCamera(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg(t.cameraGenericError);
        setStartingCamera(false);
        return;
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
      setStartingCamera(false);

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
    } catch (err) {
      stopCamera();
      const domErr = err as DOMException;
      if (domErr?.name === 'NotAllowedError' || domErr?.name === 'PermissionDeniedError') {
        setErrorMsg(t.cameraDeniedError);
      } else if (domErr?.name === 'NotFoundError' || domErr?.name === 'DevicesNotFoundError') {
        setErrorMsg(t.cameraNotFoundError);
      } else {
        setErrorMsg(t.cameraGenericError);
      }
    }
  }, [stopCamera, t.cameraDeniedError, t.cameraGenericError, t.cameraNotFoundError, t.modelLoadError]);

  useEffect(() => {
    return () => {
      stopCamera();
      trackerRef.current?.dispose();
    };
  }, [stopCamera]);

  const appendSignToken = useCallback(
    (sign: SignDefinition) => {
      setTokens((prev) => {
        const next = [...prev, sign];
        const wordCount = next.filter((tk) => !('space' in tk)).length;
        if (wordCount >= 2 && !statementLoggedRef.current) {
          statementLoggedRef.current = true;
          onStatementBuilt();
        }
        return next;
      });
      setLockedFlash(sign.title);
      if (soundRef.current) playMatchChime();
      window.setTimeout(() => {
        setLockedFlash((cur) => (cur === sign.title ? null : cur));
      }, 1100);
    },
    [onStatementBuilt]
  );

  const replaySigns = useMemo(
    () => tokens.filter((tk): tk is SignDefinition => !('space' in tk)),
    [tokens]
  );

  // Main inference + 3D replay clock loop
  useEffect(() => {
    let rafId = 0;

    const tick = (now: number) => {
      const dt = lastTimeRef.current ? Math.min(80, now - lastTimeRef.current) : 16;
      lastTimeRef.current = now;

      if (replayOpen && replaySigns.length > 0) {
        const curSign = replaySigns[replayIdx % replaySigns.length];
        const stepMs = curSign?.mode === 'dynamic' ? 2100 : 1600;
        const nextProg = loopProgressRef.current + dt / stepMs;
        if (nextProg >= 1) {
          loopProgressRef.current = 0;
          setReplayIdx((idx) => (idx + 1) % replaySigns.length);
        } else {
          loopProgressRef.current = nextProg;
        }
      }

      if (cameraActive) {
        let userHands: Point3D[][] = [];
        if (videoRef.current && trackerRef.current) {
          const tracked = trackerRef.current.detect(videoRef.current, now, mirrorCamera);
          if (tracked) {
            userHands = tracked.hands;
            if (userHands.length > 0) {
              const center = userHands[0][9] ?? userHands[0][0];
              breadcrumbRef.current.push([center.x, center.y]);
              if (breadcrumbRef.current.length > 26) breadcrumbRef.current.shift();
            } else {
              breadcrumbRef.current = [];
            }

            const result = recognizerRef.current.update(
              signsRef.current,
              userHands,
              now,
              scopeRef.current,
              uiLang
            );
            setCandidates(result.candidates);
            setLockProgress(result.lockProgress);
            setHandsDetected(result.handsDetected);

            if (result.committedSign) {
              appendSignToken(result.committedSign);
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
              holdProgress: lockProgress,
              matched: Boolean(lockedFlash)
            });
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [
    appendSignToken,
    cameraActive,
    lockProgress,
    lockedFlash,
    mirrorCamera,
    replayIdx,
    replayOpen,
    replaySigns,
    uiLang
  ]);

  const formatted = useMemo(() => formatStatementFromSigns(tokens, uiLang), [tokens, uiLang]);

  const handleSpeak = () => {
    if (!formatted.text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(formatted.text);
    utter.lang = uiLang === 'bm' ? 'ms-MY' : 'en-US';
    window.speechSynthesis.speak(utter);
  };

  const handleCopy = async () => {
    if (!formatted.text) return;
    try {
      await navigator.clipboard.writeText(formatted.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard optional
    }
  };

  const topCandidate = candidates[0];
  const currentReplaySign = replaySigns[replayIdx % Math.max(1, replaySigns.length)];

  return (
    <div>
      <video ref={videoRef} className="stage-video-hidden" playsInline muted />

      <div className="section-header">
        <div>
          <h1 className="section-title">{t.freeCamTitle}</h1>
          <p className="section-subtitle">{t.freeCamSubtitle}</p>
        </div>

        <div className="category-tabs" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`cat-tab ${scope === 'words' ? 'is-active' : ''}`}
            onClick={() => setScope('words')}
          >
            {t.freeCamScopeWords}
          </button>
          <button
            type="button"
            className={`cat-tab ${scope === 'alphanum' ? 'is-active' : ''}`}
            onClick={() => setScope('alphanum')}
          >
            {t.freeCamScopeAlphaNum}
          </button>
          <button
            type="button"
            className={`cat-tab ${scope === 'all' ? 'is-active' : ''}`}
            onClick={() => setScope('all')}
          >
            {t.freeCamScopeAll}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="alert-banner" role="alert" style={{ margin: '0 0 14px' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="freecam-grid">
        <section className="stage-card">
          <div className="stage-viewport">
            <canvas ref={canvasRef} className="stage-canvas" />

            {!cameraActive && (
              <div className="freecam-idle-overlay">
                <Camera size={32} />
                <p>{t.freeCamStatementEmpty}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startCamera}
                  disabled={startingCamera}
                >
                  <Camera size={16} />
                  <span>{startingCamera ? t.startingCamera : t.startCamera}</span>
                </button>
              </div>
            )}

            {cameraActive && (
              <>
                <div className="stage-top-hud">
                  <div className="stage-sign-badge">
                    <div className="stage-sign-title-row">
                      <span className="pulse-dot" aria-hidden="true" />
                      <span className="stage-sign-title">
                        {topCandidate ? topCandidate.sign.title : '—'}
                      </span>
                      {topCandidate && (
                        <span className="stage-sign-gloss">{topCandidate.score}%</span>
                      )}
                    </div>
                    <div className="lock-progress-track">
                      <div
                        className="lock-progress-fill"
                        style={{ width: `${Math.round(lockProgress * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="stage-bottom-hud">
                  <div className={`coach-pill ${lockedFlash ? 'is-matched' : ''}`}>
                    <span>
                      {loadingModel
                        ? t.loadingModelBanner
                        : lockedFlash
                          ? t.freeCamLockedBanner(lockedFlash)
                          : handsDetected === 0
                            ? t.freeCamNoHandHint
                            : t.freeCamHoldLockHint}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="stage-controls">
            <div className="control-group">
              {!cameraActive ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startCamera}
                  disabled={startingCamera}
                >
                  <Camera size={16} />
                  <span>{startingCamera ? t.startingCamera : t.startCamera}</span>
                </button>
              ) : (
                <button type="button" className="btn btn-amber" onClick={stopCamera}>
                  <CameraOff size={16} />
                  <span>{t.stopCamera}</span>
                </button>
              )}

              <button
                type="button"
                className={`btn btn-sm btn-toggle ${mirrorCamera ? 'is-on' : ''}`}
                onClick={onToggleMirror}
              >
                <FlipHorizontal2 size={15} />
                <span>{mirrorCamera ? t.mirrorOn : t.mirrorOff}</span>
              </button>
            </div>
          </div>
        </section>

        <div className="rail-stack">
          <section className="panel-card">
            <div className="sign-guide-header" style={{ marginBottom: 10 }}>
              <h2 className="dash-panel-title">{t.freeCamStatementTitle}</h2>
              {replaySigns.length > 0 && (
                <button
                  type="button"
                  className={`btn btn-sm btn-toggle ${replayOpen ? 'is-on' : ''}`}
                  onClick={() => {
                    setReplayIdx(0);
                    loopProgressRef.current = 0;
                    setReplayOpen((v) => !v);
                  }}
                >
                  {replayOpen ? <Square size={14} /> : <Play size={14} />}
                  <span>{replayOpen ? t.freeCamCloseReplayBtn : t.freeCamReplayBtn}</span>
                </button>
              )}
            </div>

            <div className="statement-output-box">
              {formatted.text ? (
                <>
                  <div className="statement-text">{formatted.text}</div>
                  {formatted.translation && (
                    <div className="sign-tile-sub" style={{ marginTop: 4 }}>
                      {formatted.translation}
                    </div>
                  )}
                </>
              ) : (
                <div className="sign-guide-meaning">{t.freeCamStatementEmpty}</div>
              )}
            </div>

            {tokens.length > 0 && (
              <div className="statement-word-track" style={{ padding: '10px 0 0', border: 0 }}>
                {tokens.map((tok, idx) =>
                  'space' in tok ? (
                    <span key={`sp-${idx}`} className="pill-tag">
                      ␣
                    </span>
                  ) : (
                    <button
                      key={`${tok.id}-${idx}`}
                      type="button"
                      className="statement-chip chip-pop"
                      onClick={() =>
                        setTokens((prev) => prev.filter((_, itemIdx) => itemIdx !== idx))
                      }
                      title="Remove"
                    >
                      <span>{tok.title}</span>
                      <X size={12} />
                    </button>
                  )
                )}
              </div>
            )}

            <div className="control-group" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setTokens((prev) => [...prev, { space: true }])}
              >
                <Space size={14} />
                <span>{t.freeCamSpaceBtn}</span>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                disabled={tokens.length === 0}
                onClick={() => setTokens((prev) => prev.slice(0, -1))}
              >
                <Delete size={14} />
                <span>{t.freeCamBackspaceBtn}</span>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                disabled={tokens.length === 0}
                onClick={() => {
                  setTokens([]);
                  setReplayOpen(false);
                  statementLoggedRef.current = false;
                }}
              >
                <Trash2 size={14} />
                <span>{t.freeCamClearBtn}</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={!formatted.text}
                onClick={handleSpeak}
              >
                <Volume2 size={14} />
                <span>{t.freeCamSpeakBtn}</span>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                disabled={!formatted.text}
                onClick={handleCopy}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? t.freeCamCopiedBtn : t.freeCamCopyBtn}</span>
              </button>
            </div>
          </section>

          {replayOpen && currentReplaySign && (
            <section className="stage-card">
              <div className="stage-viewport" style={{ aspectRatio: '16 / 10' }}>
                <SignAvatar3D
                  sign={currentReplaySign}
                  uiLang={uiLang}
                  loopProgressRef={loopProgressRef}
                  showTrail
                  compact
                  paused={false}
                  onTogglePaused={() => undefined}
                />
                <div className="stage-top-hud">
                  <div className="stage-sign-badge">
                    <span className="stage-sign-title">{currentReplaySign.title}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="panel-card">
            <h2 className="dash-panel-title">{t.freeCamCandidatesTitle}</h2>
            {candidates.length === 0 ? (
              <p className="sign-guide-meaning" style={{ marginTop: 8 }}>
                {t.freeCamNoHandHint}
              </p>
            ) : (
              <div className="candidates-list">
                {candidates.map((cand) => (
                  <button
                    key={cand.sign.id}
                    type="button"
                    className="candidate-row"
                    onClick={() => appendSignToken(cand.sign)}
                  >
                    <div className="progress-row" style={{ marginBottom: 5 }}>
                      <span>
                        <strong>{cand.sign.title}</strong> ·{' '}
                        <span className="sign-tile-sub" style={{ width: 'auto' }}>
                          {uiLang === 'bm' ? cand.sign.glossBm : cand.sign.glossEn}
                        </span>
                      </span>
                      <span>{cand.score}%</span>
                    </div>
                    <div className="candidate-bar-track">
                      <div
                        className="candidate-bar-fill"
                        style={{ width: `${cand.score}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
