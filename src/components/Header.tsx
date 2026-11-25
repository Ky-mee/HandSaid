import { BookOpen, Download, Globe2, Video } from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import type { AppView, SignLanguageInfo, UiLang } from '../data/types';

interface HeaderProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  uiLang: UiLang;
  onChangeUiLang: (lang: UiLang) => void;
  activeLanguageId: string;
  onChangeSignLanguage: (langId: string) => void;
  availableLanguages: SignLanguageInfo[];
  canInstall: boolean;
  onInstallClick: () => void;
}

export function Header({
  activeView,
  onChangeView,
  uiLang,
  onChangeUiLang,
  activeLanguageId,
  onChangeSignLanguage,
  availableLanguages,
  canInstall,
  onInstallClick
}: HeaderProps) {
  const t = UI_STRINGS[uiLang];

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-group">
          <img className="brand-mark" src="/favicon.svg" alt="HandSaid emblem" />
          <div>
            <div className="brand-name">HandSaid</div>
            <div className="brand-sub">{t.brandSub}</div>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Main navigation">
          <button
            type="button"
            className={`nav-tab ${activeView === 'learn' ? 'is-active' : ''}`}
            onClick={() => onChangeView('learn')}
          >
            <BookOpen size={16} />
            <span>{t.navLearn}</span>
          </button>
          <button
            type="button"
            className={`nav-tab ${activeView === 'atlas' ? 'is-active' : ''}`}
            onClick={() => onChangeView('atlas')}
          >
            <Globe2 size={16} />
            <span>{t.navAtlas}</span>
          </button>
          <button
            type="button"
            className={`nav-tab ${activeView === 'studio' ? 'is-active' : ''}`}
            onClick={() => onChangeView('studio')}
          >
            <Video size={16} />
            <span>{t.navStudio}</span>
          </button>
        </nav>

        <div className="header-actions">
          <select
            aria-label="Sign language pack"
            className="lang-select"
            value={activeLanguageId}
            onChange={(e) => onChangeSignLanguage(e.target.value)}
          >
            {availableLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {uiLang === 'bm' ? lang.nameBm : lang.nameEn}
              </option>
            ))}
          </select>

          <div className="ui-lang-toggle" role="group" aria-label="Interface language">
            <button
              type="button"
              className={`ui-lang-btn ${uiLang === 'en' ? 'is-active' : ''}`}
              onClick={() => onChangeUiLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`ui-lang-btn ${uiLang === 'bm' ? 'is-active' : ''}`}
              onClick={() => onChangeUiLang('bm')}
            >
              BM
            </button>
          </div>

          {canInstall && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onInstallClick}>
              <Download size={15} />
              <span>{t.installApp}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
