import {
  Award,
  BookOpen,
  Camera,
  Download,
  Globe2,
  Home,
  LayoutDashboard,
  Video
} from 'lucide-react';
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

  const navItems: Array<{ id: AppView; label: string; icon: typeof Home }> = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'learn', label: t.navLearn, icon: BookOpen },
    { id: 'test', label: t.navTest, icon: Award },
    { id: 'freecam', label: t.navFreeCam, icon: Camera },
    { id: 'atlas', label: t.navAtlas, icon: Globe2 },
    { id: 'studio', label: t.navStudio, icon: Video }
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand-group brand-button"
          onClick={() => onChangeView('home')}
        >
          <img className="brand-mark" src="/favicon.svg" alt="HandSaid emblem" />
          <div style={{ textAlign: 'left' }}>
            <div className="brand-name">HandSaid</div>
            <div className="brand-sub">{t.brandSub}</div>
          </div>
        </button>

        <nav className="nav-tabs" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-tab ${activeView === item.id ? 'is-active' : ''}`}
                onClick={() => onChangeView(item.id)}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
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
