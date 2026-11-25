import { CheckCircle2, Hand, Sparkles } from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import type { SignCategory, SignDefinition, UiLang } from '../data/types';

interface LessonRailProps {
  uiLang: UiLang;
  signs: SignDefinition[];
  selectedSign: SignDefinition;
  onSelectSign: (sign: SignDefinition) => void;
  masteredIds: string[];
  categoryFilter: SignCategory | 'all';
  onChangeCategory: (cat: SignCategory | 'all') => void;
  searchQuery: string;
  onChangeSearch: (q: string) => void;
}

export function LessonRail({
  uiLang,
  signs,
  selectedSign,
  onSelectSign,
  masteredIds,
  categoryFilter,
  onChangeCategory,
  searchQuery,
  onChangeSearch
}: LessonRailProps) {
  const t = UI_STRINGS[uiLang];
  const masteredSet = new Set(masteredIds);

  const filteredSigns = signs.filter((s) => {
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.glossEn.toLowerCase().includes(q) ||
        s.glossBm.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const masteredCount = signs.filter((s) => masteredSet.has(s.id)).length;
  const pct = signs.length > 0 ? Math.round((masteredCount / signs.length) * 100) : 0;
  const hasCustom = signs.some((s) => s.category === 'custom');

  return (
    <aside className="rail-stack">
      <section className="panel-card" aria-label="Sign guide">
        <div className="sign-guide-header">
          <div>
            <h2 className="sign-guide-title">{selectedSign.title}</h2>
            <p className="sign-guide-meaning">
              {uiLang === 'bm' ? selectedSign.glossBm : selectedSign.glossEn}
            </p>
          </div>
          {masteredSet.has(selectedSign.id) && (
            <span className="pill-tag is-jade">
              <CheckCircle2 size={14} />
              <span>{t.matchedBanner}</span>
            </span>
          )}
        </div>

        <div className="tag-row">
          <span className={`pill-tag ${selectedSign.mode === 'dynamic' ? 'is-amber' : 'is-jade'}`}>
            <Sparkles size={13} />
            <span>{selectedSign.mode === 'dynamic' ? t.modeDynamic : t.modeStatic}</span>
          </span>
          <span className="pill-tag">
            <Hand size={13} />
            <span>{selectedSign.hands === 2 ? t.handsRequiredTwo : t.handsRequiredOne}</span>
          </span>
        </div>

        <p className="sign-description">
          {uiLang === 'bm' ? selectedSign.descriptionBm : selectedSign.descriptionEn}
        </p>

        <div className="facial-cue-box">
          <strong>{t.facialCueLabel}: </strong>
          {uiLang === 'bm' ? selectedSign.facialCueBm : selectedSign.facialCueEn}
        </div>
      </section>

      <section className="panel-card" aria-label="Lesson browser">
        <div className="progress-row">
          <span>{t.packProgressLabel}</span>
          <span>
            {masteredCount} / {signs.length} ({pct}%)
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="category-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'all'}
            className={`cat-tab ${categoryFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => onChangeCategory('all')}
          >
            {t.catAll}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'alphabet'}
            className={`cat-tab ${categoryFilter === 'alphabet' ? 'is-active' : ''}`}
            onClick={() => onChangeCategory('alphabet')}
          >
            {t.catAlphabet}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'number'}
            className={`cat-tab ${categoryFilter === 'number' ? 'is-active' : ''}`}
            onClick={() => onChangeCategory('number')}
          >
            {t.catNumber}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'everyday'}
            className={`cat-tab ${categoryFilter === 'everyday' ? 'is-active' : ''}`}
            onClick={() => onChangeCategory('everyday')}
          >
            {t.catEveryday}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'people'}
            className={`cat-tab ${categoryFilter === 'people' ? 'is-active' : ''}`}
            onClick={() => onChangeCategory('people')}
          >
            {t.catPeople}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'feelings'}
            className={`cat-tab ${categoryFilter === 'feelings' ? 'is-active' : ''}`}
            onClick={() => onChangeCategory('feelings')}
          >
            {t.catFeelings}
          </button>
          {hasCustom && (
            <button
              type="button"
              role="tab"
              aria-selected={categoryFilter === 'custom'}
              className={`cat-tab ${categoryFilter === 'custom' ? 'is-active' : ''}`}
              onClick={() => onChangeCategory('custom')}
            >
              {t.catCustom}
            </button>
          )}
        </div>

        <input
          type="search"
          className="search-input"
          placeholder={t.searchSignsPlaceholder}
          value={searchQuery}
          onChange={(e) => onChangeSearch(e.target.value)}
        />

        {filteredSigns.length === 0 ? (
          <p className="sign-guide-meaning">{t.noSignsFound}</p>
        ) : (
          <div
            className={`sign-tile-grid ${
              categoryFilter === 'everyday' ||
              categoryFilter === 'people' ||
              categoryFilter === 'feelings' ||
              categoryFilter === 'custom'
                ? 'is-wide'
                : ''
            }`}
          >
            {filteredSigns.map((sign) => {
              const isSelected = sign.id === selectedSign.id;
              const isDone = masteredSet.has(sign.id);
              return (
                <button
                  key={sign.id}
                  type="button"
                  className={`sign-tile ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelectSign(sign)}
                >
                  {isDone && <CheckCircle2 size={14} className="sign-tile-check" />}
                  <span className="sign-tile-title">{sign.title}</span>
                  <span className="sign-tile-sub">
                    {uiLang === 'bm' ? sign.glossBm : sign.glossEn}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </aside>
  );
}
