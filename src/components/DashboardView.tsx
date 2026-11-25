import { useMemo } from 'react';
import { Award, BookOpen, Camera, Flame, MessageSquareQuote } from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import type {
  AppView,
  PracticeActivity,
  SignCategory,
  SignDefinition,
  TestSessionRecord,
  UiLang
} from '../data/types';
import { computeStreakDays } from '../utils/storage';

interface DashboardViewProps {
  uiLang: UiLang;
  activeLanguageName: string;
  signs: SignDefinition[];
  masteredIds: string[];
  testHistory: TestSessionRecord[];
  activity: PracticeActivity;
  onNavigate: (view: AppView) => void;
  onOpenCategory: (category: SignCategory | 'all') => void;
  onOpenSign: (signId: string) => void;
}

const CATEGORIES: SignCategory[] = ['alphabet', 'number', 'everyday', 'people', 'feelings', 'custom'];

export function DashboardView({
  uiLang,
  activeLanguageName,
  signs,
  masteredIds,
  testHistory,
  activity,
  onNavigate,
  onOpenCategory,
  onOpenSign
}: DashboardViewProps) {
  const t = UI_STRINGS[uiLang];
  const masteredSet = useMemo(() => new Set(masteredIds), [masteredIds]);
  const masteredCount = useMemo(
    () => signs.filter((s) => masteredSet.has(s.id)).length,
    [signs, masteredSet]
  );
  const overallPct = signs.length > 0 ? Math.round((masteredCount / signs.length) * 100) : 0;

  const streakDays = useMemo(() => computeStreakDays(activity.datesActive), [activity.datesActive]);
  const bestAccuracy = useMemo(() => {
    if (testHistory.length === 0) return 0;
    return Math.max(...testHistory.map((r) => r.accuracyPct));
  }, [testHistory]);

  const categoryRows = useMemo(() => {
    const labelMap: Record<SignCategory, string> = {
      alphabet: t.catAlphabet,
      number: t.catNumber,
      everyday: t.catEveryday,
      people: t.catPeople,
      feelings: t.catFeelings,
      custom: t.catCustom
    };
    return CATEGORIES.map((cat) => {
      const catSigns = signs.filter((s) => s.category === cat);
      const done = catSigns.filter((s) => masteredSet.has(s.id)).length;
      return {
        category: cat,
        label: labelMap[cat],
        total: catSigns.length,
        done,
        pct: catSigns.length > 0 ? Math.round((done / catSigns.length) * 100) : 0
      };
    }).filter((row) => row.total > 0);
  }, [signs, masteredSet, t]);

  const recommended = useMemo(() => {
    return signs.filter((s) => !masteredSet.has(s.id)).slice(0, 6);
  }, [signs, masteredSet]);

  const ringRadius = 48;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - overallPct / 100);

  return (
    <div className="dash-wrap">
      <div className="section-header">
        <div>
          <h1 className="section-title">{t.dashTitle}</h1>
          <p className="section-subtitle">
            {activeLanguageName} — {t.dashSubtitle}
          </p>
        </div>
        <div className="control-group">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onNavigate('learn')}>
            <BookOpen size={15} />
            <span>{t.homeCtaLearn}</span>
          </button>
          <button type="button" className="btn btn-amber btn-sm" onClick={() => onNavigate('freecam')}>
            <Camera size={15} />
            <span>{t.navFreeCam}</span>
          </button>
          <button type="button" className="btn btn-sm" onClick={() => onNavigate('test')}>
            <Award size={15} />
            <span>{t.navTest}</span>
          </button>
        </div>
      </div>

      <div className="stat-strip">
        <div className="stat-cell">
          <span className="stat-label">
            <Flame size={15} />
            <span>{t.dashStreakLabel}</span>
          </span>
          <strong className="stat-value">{t.dashStreakUnit(streakDays)}</strong>
        </div>
        <div className="stat-cell">
          <span className="stat-label">
            <BookOpen size={15} />
            <span>{t.dashSignedLabel}</span>
          </span>
          <strong className="stat-value">
            {masteredCount} / {signs.length}
          </strong>
        </div>
        <div className="stat-cell">
          <span className="stat-label">
            <Award size={15} />
            <span>{t.dashTestsLabel}</span>
          </span>
          <strong className="stat-value">
            {testHistory.length}
            {testHistory.length > 0 ? ` (${bestAccuracy}%)` : ''}
          </strong>
        </div>
        <div className="stat-cell">
          <span className="stat-label">
            <MessageSquareQuote size={15} />
            <span>{t.dashStatementsLabel}</span>
          </span>
          <strong className="stat-value">{activity.statementsBuilt}</strong>
        </div>
      </div>

      <div className="dash-grid">
        <section className="panel-card">
          <div className="dash-ring-header">
            <div className="mastery-ring-wrap" aria-label={`${overallPct}% ${t.dashOverallMastery}`}>
              <svg width="116" height="116" viewBox="0 0 116 116">
                <circle
                  cx="58"
                  cy="58"
                  r={ringRadius}
                  fill="none"
                  stroke="var(--bg-subtle)"
                  strokeWidth="10"
                />
                <circle
                  cx="58"
                  cy="58"
                  r={ringRadius}
                  fill="none"
                  stroke="var(--accent-jade)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 58 58)"
                  className="mastery-ring-progress"
                />
              </svg>
              <span className="mastery-ring-pct">{overallPct}%</span>
            </div>
            <div>
              <h2 className="dash-panel-title">{t.dashCategoriesTitle}</h2>
              <p className="sign-guide-meaning">
                {masteredCount} / {signs.length} {t.dashOverallMastery.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="cat-progress-list">
            {categoryRows.map((row) => (
              <button
                key={row.category}
                type="button"
                className="cat-progress-row"
                onClick={() => onOpenCategory(row.category)}
              >
                <div className="progress-row">
                  <span>{row.label}</span>
                  <span>
                    {row.done} / {row.total} ({row.pct}%)
                  </span>
                </div>
                <div className="progress-track" style={{ marginBottom: 0 }}>
                  <div className="progress-fill" style={{ width: `${row.pct}%` }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="rail-stack">
          <section className="panel-card">
            <h2 className="dash-panel-title">{t.dashRecommendedTitle}</h2>
            {recommended.length === 0 ? (
              <p className="sign-guide-meaning" style={{ marginTop: 10 }}>
                {t.dashAllMastered}
              </p>
            ) : (
              <div className="recommended-grid">
                {recommended.map((sign) => (
                  <button
                    key={sign.id}
                    type="button"
                    className="sign-tile"
                    onClick={() => onOpenSign(sign.id)}
                  >
                    <span className="sign-tile-title">{sign.title}</span>
                    <span className="sign-tile-sub">
                      {uiLang === 'bm' ? sign.glossBm : sign.glossEn}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="panel-card">
            <div className="sign-guide-header" style={{ marginBottom: 10 }}>
              <h2 className="dash-panel-title">{t.dashHistoryTitle}</h2>
              <button type="button" className="btn btn-sm" onClick={() => onNavigate('test')}>
                {t.dashStartFirstTest}
              </button>
            </div>
            {testHistory.length === 0 ? (
              <p className="sign-guide-meaning">{t.dashHistoryEmpty}</p>
            ) : (
              <div className="history-list">
                {testHistory.slice(0, 6).map((item) => {
                  const modeLabel =
                    item.mode === 'camera-quiz'
                      ? t.testModeCamera
                      : item.mode === 'visual-quiz'
                        ? t.testModeVisual
                        : t.testModeStatement;
                  return (
                    <div key={item.id} className="history-row">
                      <div>
                        <strong>{modeLabel}</strong>
                        <div className="sign-tile-sub">
                          {item.languageId.toUpperCase()} · {new Date(item.dateIso).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="history-score">
                        <span className="pill-tag is-jade">{item.accuracyPct}%</span>
                        <span className="sign-tile-sub">
                          {item.correctCount}/{item.totalQuestions} · {item.durationSec}s
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
