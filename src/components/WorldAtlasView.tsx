import { useMemo, useState } from 'react';
import { BookOpen, Video } from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import { WORLD_SIGN_LANGUAGES } from '../data/worldLanguages';
import type { SignDefinition, UiLang, WorldRegion } from '../data/types';

interface WorldAtlasViewProps {
  uiLang: UiLang;
  customSigns: SignDefinition[];
  onPracticeLanguage: (languageId: string) => void;
  onRecordLanguage: (languageId: string) => void;
}

const REGIONS: WorldRegion[] = [
  'Southeast Asia',
  'East Asia',
  'South Asia',
  'Americas',
  'Europe',
  'Oceania',
  'Middle East & Africa'
];

export function WorldAtlasView({
  uiLang,
  customSigns,
  onPracticeLanguage,
  onRecordLanguage
}: WorldAtlasViewProps) {
  const t = UI_STRINGS[uiLang];
  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<WorldRegion | 'all'>('all');

  const customCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of customSigns) {
      map.set(s.languageId, (map.get(s.languageId) ?? 0) + 1);
    }
    return map;
  }, [customSigns]);

  const filtered = WORLD_SIGN_LANGUAGES.filter((lang) => {
    if (regionFilter !== 'all' && lang.region !== regionFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      lang.nameEn.toLowerCase().includes(q) ||
      lang.nameBm.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.countryOrArea.toLowerCase().includes(q) ||
      lang.isoCode.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">{t.atlasTitle}</h1>
          <p className="section-subtitle">{t.atlasSubtitle}</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="search"
          className="search-input"
          placeholder={t.atlasSearchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="category-tabs" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`cat-tab ${regionFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setRegionFilter('all')}
          >
            {t.atlasAllRegions}
          </button>
          {REGIONS.map((reg) => (
            <button
              key={reg}
              type="button"
              className={`cat-tab ${regionFilter === reg ? 'is-active' : ''}`}
              onClick={() => setRegionFilter(reg)}
            >
              {t.regionNames[reg]}
            </button>
          ))}
        </div>
      </div>

      <div className="atlas-grid">
        {filtered.map((lang) => {
          const customCount = customCounts.get(lang.id) ?? 0;
          const canPractice = lang.hasBuiltInPack || customCount > 0;
          return (
            <article key={lang.id} className="atlas-card">
              <div>
                <div className="atlas-card-top">
                  <div>
                    <h2 className="atlas-lang-name">
                      {uiLang === 'bm' ? lang.nameBm : lang.nameEn}
                    </h2>
                    <div className="atlas-native">
                      {lang.nativeName} — {lang.countryOrArea}
                    </div>
                  </div>
                  <span className="pill-tag">{lang.isoCode.toUpperCase()}</span>
                </div>

                <div className="tag-row" style={{ marginTop: 10 }}>
                  <span className={`pill-tag ${lang.hasBuiltInPack ? 'is-jade' : ''}`}>
                    {lang.hasBuiltInPack ? t.atlasBuiltInBadge : t.atlasCommunityBadge}
                  </span>
                  <span className="pill-tag">{t.atlasAlphabetLabel[lang.alphabetSystem]}</span>
                  {customCount > 0 && (
                    <span className="pill-tag is-amber">{t.atlasCustomCount(customCount)}</span>
                  )}
                </div>

                <p className="atlas-note">{uiLang === 'bm' ? lang.noteBm : lang.noteEn}</p>
              </div>

              <div className="atlas-actions">
                {canPractice && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onPracticeLanguage(lang.id)}
                  >
                    <BookOpen size={15} />
                    <span>{t.atlasPracticeBtn}</span>
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => onRecordLanguage(lang.id)}
                >
                  <Video size={15} />
                  <span>{t.atlasRecordBtn}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
