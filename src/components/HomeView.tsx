import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Camera,
  Globe2,
  Hand,
  MessageSquareQuote,
  Sparkles,
  Video
} from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import { getStatementsForLanguage } from '../data/statements';
import type { AppView, SignDefinition, UiLang } from '../data/types';
import { SignAvatar3D } from './SignAvatar3D';

interface HomeViewProps {
  uiLang: UiLang;
  activeLanguageId: string;
  signs: SignDefinition[];
  onNavigate: (view: AppView) => void;
  onOpenLearnSign: (signId: string) => void;
  onOpenStatementChallenge: (statementId: string) => void;
}

const SHOWCASE_IDS: Record<string, string[]> = {
  bim: [
    'bim-everyday-terima-kasih',
    'bim-everyday-selamat-pagi',
    'bim-feelings-gembira',
    'bim-everyday-sayang'
  ],
  asl: [
    'asl-everyday-hello',
    'asl-everyday-thank-you',
    'asl-everyday-ily',
    'asl-feelings-happy'
  ]
};

export function HomeView({
  uiLang,
  activeLanguageId,
  signs,
  onNavigate,
  onOpenLearnSign,
  onOpenStatementChallenge
}: HomeViewProps) {
  const t = UI_STRINGS[uiLang];
  const loopProgressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const showcaseSigns = useMemo(() => {
    const preferredIds = SHOWCASE_IDS[activeLanguageId] ?? [];
    const mapped = preferredIds
      .map((id) => signs.find((s) => s.id === id))
      .filter((s): s is SignDefinition => Boolean(s));
    return mapped.length > 0 ? mapped : signs.slice(0, 4);
  }, [activeLanguageId, signs]);

  const [showcaseIndex, setShowcaseIndex] = useState(0);

  useEffect(() => {
    setShowcaseIndex(0);
    loopProgressRef.current = 0;
  }, [activeLanguageId]);

  const activeShowcase = showcaseSigns[showcaseIndex] ?? showcaseSigns[0];

  useEffect(() => {
    let rafId = 0;
    const tick = (now: number) => {
      const dt = lastTimeRef.current ? Math.min(80, now - lastTimeRef.current) : 16;
      lastTimeRef.current = now;
      if (!pausedRef.current) {
        const cycleMs = activeShowcase?.mode === 'dynamic' ? 2400 : 3000;
        loopProgressRef.current = (loopProgressRef.current + dt / cycleMs) % 1;
      }
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [activeShowcase?.mode]);

  const featuredStatements = useMemo(() => {
    const list = getStatementsForLanguage(activeLanguageId);
    return (list.length > 0 ? list : getStatementsForLanguage('bim')).slice(0, 4);
  }, [activeLanguageId]);

  const signById = useMemo(() => {
    return new Map(signs.map((s) => [s.id, s]));
  }, [signs]);

  return (
    <div className="home-wrap">
      <section className="home-hero">
        <div className="hero-copy">
          <h1 className="hero-title">{t.homeTitle}</h1>
          <p className="hero-subtitle">{t.homeSubtitle}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('learn')}
            >
              <BookOpen size={18} />
              <span>{t.homeCtaLearn}</span>
            </button>
            <button
              type="button"
              className="btn btn-amber btn-lg"
              onClick={() => onNavigate('freecam')}
            >
              <Camera size={18} />
              <span>{t.homeCtaFreeCam}</span>
            </button>
            <button
              type="button"
              className="btn btn-lg"
              onClick={() => onNavigate('test')}
            >
              <Award size={18} />
              <span>{t.homeCtaTest}</span>
            </button>
          </div>

          <div className="hero-facts">
            <span className="hero-fact">
              <Hand size={15} />
              <span>{t.homeFactSigns}</span>
            </span>
            <span className="hero-fact">
              <Globe2 size={15} />
              <span>{t.homeFactLanguages}</span>
            </span>
            <span className="hero-fact">
              <Sparkles size={15} />
              <span>{t.homeFactPrivate}</span>
            </span>
          </div>
        </div>

        {activeShowcase && (
          <div className="hero-stage-shell">
            <div className="hero-stage-viewport">
              <SignAvatar3D
                sign={activeShowcase}
                uiLang={uiLang}
                loopProgressRef={loopProgressRef}
                showTrail
                paused={paused}
                onTogglePaused={() => setPaused((p) => !p)}
              />
              <div className="stage-top-hud">
                <div className="stage-sign-badge">
                  <div className="stage-sign-title-row">
                    <span className="stage-sign-title">{activeShowcase.title}</span>
                    <span className="stage-sign-gloss">
                      {uiLang === 'bm' ? activeShowcase.glossBm : activeShowcase.glossEn}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-showcase-bar">
              <span className="hero-showcase-label">{t.homeShowcaseLabel}</span>
              <div className="hero-demo-pills">
                {showcaseSigns.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`cat-tab ${idx === showcaseIndex ? 'is-active' : ''}`}
                    onClick={() => {
                      setShowcaseIndex(idx);
                      loopProgressRef.current = 0;
                    }}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => onOpenLearnSign(activeShowcase.id)}
              >
                {t.dashPracticeBtn}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">{t.homeStatementsHeading}</h2>
            <p className="section-subtitle">{t.homeStatementsSub}</p>
          </div>
          <button type="button" className="btn btn-sm" onClick={() => onNavigate('test')}>
            <MessageSquareQuote size={15} />
            <span>{t.testModeStatement}</span>
          </button>
        </div>

        <div className="statement-showcase-grid">
          {featuredStatements.map((stmt) => (
            <article key={stmt.id} className="statement-preview-card">
              <div>
                <h3 className="statement-card-title">
                  {uiLang === 'bm' ? stmt.titleBm : stmt.titleEn}
                </h3>
                <p className="statement-card-translation">
                  {uiLang === 'bm' ? stmt.translationBm : stmt.translationEn}
                </p>
                <div className="statement-chip-row">
                  {stmt.signIds.map((id) => (
                    <span key={id} className="pill-tag is-jade">
                      {signById.get(id)?.title ?? id}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => onOpenStatementChallenge(stmt.id)}
              >
                <span>{t.homePracticeStatement}</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">{t.homeModesHeading}</h2>
        </div>
        <div className="mode-grid">
          <button type="button" className="mode-card" onClick={() => onNavigate('learn')}>
            <div className="mode-icon is-jade">
              <BookOpen size={20} />
            </div>
            <h3>{t.homeModeCoachTitle}</h3>
            <p>{t.homeModeCoachDesc}</p>
          </button>

          <button type="button" className="mode-card" onClick={() => onNavigate('freecam')}>
            <div className="mode-icon is-amber">
              <Camera size={20} />
            </div>
            <h3>{t.homeModeFreeCamTitle}</h3>
            <p>{t.homeModeFreeCamDesc}</p>
          </button>

          <button type="button" className="mode-card" onClick={() => onNavigate('test')}>
            <div className="mode-icon is-jade">
              <Award size={20} />
            </div>
            <h3>{t.homeModeTestTitle}</h3>
            <p>{t.homeModeTestDesc}</p>
          </button>

          <button type="button" className="mode-card" onClick={() => onNavigate('studio')}>
            <div className="mode-icon is-amber">
              <Video size={20} />
            </div>
            <h3>{t.homeModeStudioTitle}</h3>
            <p>{t.homeModeStudioDesc}</p>
          </button>
        </div>
      </section>
    </div>
  );
}
