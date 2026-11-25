import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Eye,
  EyeOff,
  FlipHorizontal2,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import type { FingerName, Point3D, SignDefinition, UiLang } from '../data/types';
import { renderStageCanvas } from '../engine/canvasRenderer';
import { MediaPipeHandTracker } from '../engine/handTracker';
import { sampleSignAnimation } from '../engine/poseSynthesizer';
import { DynamicMotionTracker, evaluateStaticSign } from '../engine/signRecognizer';
import { playMatchChime } from '../utils/sound';
import { SignAvatar3D } from './SignAvatar3D';

interface CameraCoachStageProps {
  uiLang: UiLang;
  sign: SignDefinition;
  showGhost: boolean;
  onToggleGhost: () => void;
  mirrorCamera: boolean;
  onToggleMirror: () => void;
  playbackSpeed: 0.5 | 1;
  onToggleSpeed: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  onPrevSign: () => void;
  onNextSign: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onSignMastered: (signId: string) => void;
}

export function CameraCoachStage({
  uiLang,
  sign,
  showGhost,
  onToggleGhost,
  mirrorCamera,
  onToggleMirror,
  playbackSpeed,
  onToggleSpeed,
  soundEnabled,
  onToggleSound,
  autoAdvance,
  onToggleAutoAdvance,
  onPrevSign,
  onNextSign,
  hasPrev,
  hasNext,
  onSignMastered
}: CameraCoachStageProps) {
  const t = UI_STRINGS[uiLang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<MediaPipeHandTracker | null>(null);
  const dynamicTrackerRef = useRef(new DynamicMotionTracker());
  const breadcrumbRef = useRef<Array<[number, number]>>([]);
  const holdMsRef = useRef(0);
  const holdProgressRef = useRef(0);
  const matchedNowRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const matchedCooldownRef = useRef(0);
  const loopProgressRef = useRef(0);
  const manualScrubRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [matchedNow, setMatchedNow] = useState(false);
  const [coachHint, setCoachHint] = useState<string>(t.previewModeBanner);
  const [scrubValue, setScrubValue] = useState<number>(0);
  const [paused, setPaused] = useState(false);
  const [show3dSplit, setShow3dSplit] = useState(true);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Reset per-sign state on sign change
  useEffect(() => {
    dynamicTrackerRef.current.reset();
    breadcrumbRef.current = [];
    holdMsRef.current = 0;
    holdProgressRef.current = 0;
    matchedNowRef.current = false;
    matchedCooldownRef.current = 0;
    manualScrubRef.current = null;
    loopProgressRef.current = 0;
    setScore(0);
    setMatchedNow(false);
    setScrubValue(0);
    setCoachHint(
      cameraActive
        ? sign.mode === 'dynamic'
          ? t.followTrailPrompt
          : t.showHandPrompt
        : t.previewModeBanner
    );
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, [sign.id, cameraActive, sign.mode, t.followTrailPrompt, t.previewModeBanner, t.showHandPrompt]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    holdMsRef.current = 0;
    holdProgressRef.current = 0;
    matchedNowRef.current = false;
    setCameraActive(false);
    setStartingCamera(false);
    setScore(0);
    setMatchedNow(false);
    breadcrumbRef.current = [];
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
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
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
      if (autoAdvanceTimerRef.current !== null) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [stopCamera]);

  // Main animation timing & MediaPipe inference loop
  useEffect(() => {
    let rafId = 0;

    const tick = (now: number) => {
      const dt = lastFrameTimeRef.current ? Math.min(80, now - lastFrameTimeRef.current) : 16;
      lastFrameTimeRef.current = now;

      const cycleMs = sign.mode === 'dynamic' ? 2400 / playbackSpeed : 3200 / playbackSpeed;
      if (manualScrubRef.current !== null) {
        loopProgressRef.current = manualScrubRef.current;
      } else if (!pausedRef.current) {
        loopProgressRef.current = (loopProgressRef.current + dt / cycleMs) % 1;
        const pct = Math.round(loopProgressRef.current * 100);
        setScrubValue((prev) => (prev === pct ? prev : pct));
      }

      if (cameraActive) {
        const sampled = sampleSignAnimation(sign, loopProgressRef.current);
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
              if (breadcrumbRef.current.length > 26) {
                breadcrumbRef.current.shift();
              }
            } else {
              breadcrumbRef.current = [];
            }

            if (sign.mode === 'static') {
              const res = evaluateStaticSign(sign, userHands, uiLang);
              currentScore = res.score;
              fingerStatus = res.fingerStatus;
              setScore(res.score);

              if (res.matched) {
                holdMsRef.current = Math.min(650, holdMsRef.current + dt);
                setCoachHint(holdMsRef.current >= 650 ? t.matchedBanner : t.holdSteadyPrompt);
              } else {
                holdMsRef.current = Math.max(0, holdMsRef.current - dt * 1.6);
                setCoachHint(res.hint || t.showHandPrompt);
              }

              const progress = holdMsRef.current / 650;
              holdProgressRef.current = progress;
              currentMatched = progress >= 1;
            } else {
              const res = dynamicTrackerRef.current.update(sign, userHands, now, uiLang);
              currentScore = res.score;
              fingerStatus = res.fingerStatus;
              setScore(res.score);
              holdProgressRef.current = res.progress;
              setCoachHint(res.hint || t.followTrailPrompt);
              currentMatched = res.matched;
            }

            if (currentMatched && matchedCooldownRef.current <= 0) {
              matchedCooldownRef.current = 2400;
              matchedNowRef.current = true;
              setMatchedNow(true);
              onSignMastered(sign.id);
              if (soundEnabled) playMatchChime();

              if (autoAdvance && hasNext) {
                autoAdvanceTimerRef.current = window.setTimeout(() => {
                  onNextSign();
                }, 1150);
              }
            }
          }
        }

        if (matchedCooldownRef.current > 0) {
          matchedCooldownRef.current = Math.max(0, matchedCooldownRef.current - dt);
          if (matchedCooldownRef.current === 0) {
            matchedNowRef.current = false;
            setMatchedNow(false);
          }
        }

        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const targetW = Math.max(320, Math.round(rect.width * dpr));
          const targetH = Math.max(240, Math.round(rect.height * dpr));
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
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
              showGhost,
              ghostPrimary: sampled.primary,
              ghostSecondary: sampled.secondary,
              trailPoints: sampled.trailPoints,
              currentTrailAnchor: sampled.currentAnchor,
              userHands,
              userBreadcrumbTrail: breadcrumbRef.current,
              fingerStatus,
              holdProgress: matchedNowRef.current ? 1 : currentScore > 0 ? holdProgressRef.current : 0,
              matched: matchedNowRef.current
            });
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [
    autoAdvance,
    cameraActive,
    hasNext,
    mirrorCamera,
    onNextSign,
    onSignMastered,
    playbackSpeed,
    showGhost,
    sign,
    soundEnabled,
    t.followTrailPrompt,
    t.holdSteadyPrompt,
    t.matchedBanner,
    t.showHandPrompt,
    uiLang
  ]);

  const handleScrubChange = (val: number) => {
    manualScrubRef.current = val / 100;
    loopProgressRef.current = val / 100;
    setScrubValue(val);
  };

  const releaseScrub = () => {
    manualScrubRef.current = null;
  };

  const show3dPane = !cameraActive || show3dSplit;

  return (
    <section className="stage-card" aria-label="Interactive 3D and camera practice stage">
      <video ref={videoRef} className="stage-video-hidden" playsInline muted />

      {!cameraActive ? (
        <div className="stage-viewport">
          <SignAvatar3D
            sign={sign}
            uiLang={uiLang}
            loopProgressRef={loopProgressRef}
            showTrail={showGhost}
            paused={paused}
            onTogglePaused={() => setPaused((p) => !p)}
          />

          <div className="stage-top-hud">
            <div className="stage-sign-badge">
              <div className="stage-sign-title-row">
                <span className="stage-sign-title">{sign.title}</span>
                <span className="stage-sign-gloss">
                  {uiLang === 'bm' ? sign.glossBm : sign.glossEn}
                </span>
              </div>
            </div>
          </div>

          <div className="stage-bottom-hud">
            <div className="coach-pill is-preview">
              <span>{coachHint}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={show3dSplit ? 'stage-split-layout' : ''}>
          {show3dSplit && (
            <div className="stage-viewport is-split-3d">
              <SignAvatar3D
                sign={sign}
                uiLang={uiLang}
                loopProgressRef={loopProgressRef}
                showTrail={showGhost}
                compact
                paused={paused}
                onTogglePaused={() => setPaused((p) => !p)}
              />
            </div>
          )}

          <div className={`stage-viewport ${show3dSplit ? 'is-split-cam' : ''}`}>
            <canvas ref={canvasRef} className="stage-canvas" />

            <div className="stage-top-hud">
              <div className="stage-sign-badge">
                <div className="stage-sign-title-row">
                  <span className="stage-sign-title">{sign.title}</span>
                  <span className="stage-sign-gloss">
                    {uiLang === 'bm' ? sign.glossBm : sign.glossEn}
                  </span>
                </div>
              </div>

              <div className="stage-score-box">
                <div>
                  <span className="stage-score-label">{t.matchLabel}</span>
                  <span className="stage-score-num">{score}%</span>
                </div>
              </div>
            </div>

            <div className="stage-bottom-hud">
              <div className={`coach-pill ${matchedNow ? 'is-matched' : ''}`}>
                {matchedNow && <CheckCircle2 size={16} />}
                <span>{loadingModel ? t.loadingModelBanner : coachHint}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {show3dPane && (
        <div className="stage-scrubber">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? t.playGuide : t.pauseGuide}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            <span>{paused ? t.playGuide : t.pauseGuide}</span>
          </button>
          <span>{t.previewScrubLabel}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={scrubValue}
            onChange={(e) => handleScrubChange(Number(e.target.value))}
            onMouseUp={releaseScrub}
            onTouchEnd={releaseScrub}
            aria-label={t.previewScrubLabel}
          />
          <span>{scrubValue}%</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-banner" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{errorMsg}</span>
        </div>
      )}

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

          {cameraActive && (
            <button
              type="button"
              className={`btn btn-sm btn-toggle ${show3dSplit ? 'is-on' : ''}`}
              onClick={() => setShow3dSplit((v) => !v)}
            >
              <Columns2 size={15} />
              <span>{show3dSplit ? t.splitViewOn : t.splitViewOff}</span>
            </button>
          )}

          <button
            type="button"
            className={`btn btn-sm btn-toggle ${showGhost ? 'is-on' : ''}`}
            onClick={onToggleGhost}
          >
            {showGhost ? <Eye size={15} /> : <EyeOff size={15} />}
            <span>
              {cameraActive
                ? showGhost
                  ? t.overlay2dOn
                  : t.overlay2dOff
                : showGhost
                  ? t.trail3dOn
                  : t.trail3dOff}
            </span>
          </button>

          <button
            type="button"
            className={`btn btn-sm btn-toggle ${mirrorCamera ? 'is-on' : ''}`}
            onClick={onToggleMirror}
          >
            <FlipHorizontal2 size={15} />
            <span>{mirrorCamera ? t.mirrorOn : t.mirrorOff}</span>
          </button>

          <button type="button" className="btn btn-sm" onClick={onToggleSpeed}>
            <span>
              {t.speedLabel}: {playbackSpeed}×
            </span>
          </button>

          <button
            type="button"
            className={`btn btn-sm btn-toggle ${soundEnabled ? 'is-on' : ''}`}
            onClick={onToggleSound}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundEnabled ? t.soundOn : t.soundOff}</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm btn-toggle ${autoAdvance ? 'is-on' : ''}`}
            onClick={onToggleAutoAdvance}
          >
            <span>{autoAdvance ? t.autoNextOn : t.autoNextOff}</span>
          </button>
        </div>

        <div className="control-group">
          <button type="button" className="btn btn-sm" onClick={onPrevSign} disabled={!hasPrev}>
            <ChevronLeft size={16} />
            <span>{t.prevSign}</span>
          </button>
          <button type="button" className="btn btn-sm" onClick={onNextSign} disabled={!hasNext}>
            <span>{t.nextSign}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
