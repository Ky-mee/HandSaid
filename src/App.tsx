import { useCallback, useEffect, useMemo, useState } from 'react';
import { CameraCoachStage } from './components/CameraCoachStage';
import { Header } from './components/Header';
import { LessonRail } from './components/LessonRail';
import { StudioRecorderView } from './components/StudioRecorderView';
import { WorldAtlasView } from './components/WorldAtlasView';
import { getSignsForLanguage } from './data';
import { WORLD_SIGN_LANGUAGES } from './data/worldLanguages';
import type { AppPreferences, AppView, SignCategory, SignDefinition, UiLang } from './data/types';
import {
  deleteCustomSign,
  loadCustomSigns,
  loadPrefs,
  loadProgress,
  markSignMastered,
  saveCustomSign,
  savePrefs,
  type MasteryProgress
} from './utils/storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function App() {
  const [prefs, setPrefs] = useState<AppPreferences>(() => loadPrefs());
  const [activeView, setActiveView] = useState<AppView>('learn');
  const [customSigns, setCustomSigns] = useState<SignDefinition[]>(() => loadCustomSigns());
  const [progress, setProgress] = useState<MasteryProgress>(() => loadProgress());
  const [categoryFilter, setCategoryFilter] = useState<SignCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSignId, setSelectedSignId] = useState<string>('');
  const [studioTargetLanguageId, setStudioTargetLanguageId] = useState<string>(prefs.activeLanguageId);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const availableLanguages = useMemo(() => {
    const customLangIds = new Set(customSigns.map((s) => s.languageId));
    return WORLD_SIGN_LANGUAGES.filter((l) => l.hasBuiltInPack || customLangIds.has(l.id));
  }, [customSigns]);

  const activeSigns = useMemo(
    () => getSignsForLanguage(prefs.activeLanguageId, customSigns),
    [prefs.activeLanguageId, customSigns]
  );

  // Ensure valid active sign
  const selectedSign = useMemo(() => {
    const found = activeSigns.find((s) => s.id === selectedSignId);
    return found ?? activeSigns[0];
  }, [activeSigns, selectedSignId]);

  const selectedIndex = useMemo(() => {
    if (!selectedSign) return 0;
    return Math.max(
      0,
      activeSigns.findIndex((s) => s.id === selectedSign.id)
    );
  }, [activeSigns, selectedSign]);

  const handleChangeUiLang = (uiLang: UiLang) => {
    setPrefs((prev) => ({ ...prev, uiLang }));
  };

  const handleChangeSignLanguage = (langId: string) => {
    setPrefs((prev) => ({ ...prev, activeLanguageId: langId }));
    setCategoryFilter('all');
    setSearchQuery('');
    setSelectedSignId('');
  };

  const handleSignMastered = useCallback(
    (signId: string) => {
      setProgress(markSignMastered(prefs.activeLanguageId, signId));
    },
    [prefs.activeLanguageId]
  );

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleSaveCustomSign = (sign: SignDefinition) => {
    setCustomSigns(saveCustomSign(sign));
  };

  const handleDeleteCustomSign = (signId: string) => {
    setCustomSigns(deleteCustomSign(signId));
  };

  const handlePracticeLanguageFromAtlas = (languageId: string) => {
    handleChangeSignLanguage(languageId);
    setActiveView('learn');
  };

  const handleRecordLanguageFromAtlas = (languageId: string) => {
    setStudioTargetLanguageId(languageId);
    setActiveView('studio');
  };

  const handlePracticeCustomSign = (languageId: string, signId: string) => {
    setPrefs((prev) => ({ ...prev, activeLanguageId: languageId }));
    setCategoryFilter('all');
    setSearchQuery('');
    setSelectedSignId(signId);
    setActiveView('learn');
  };

  return (
    <div className="app-shell">
      <Header
        activeView={activeView}
        onChangeView={setActiveView}
        uiLang={prefs.uiLang}
        onChangeUiLang={handleChangeUiLang}
        activeLanguageId={prefs.activeLanguageId}
        onChangeSignLanguage={handleChangeSignLanguage}
        availableLanguages={availableLanguages}
        canInstall={Boolean(installPrompt)}
        onInstallClick={handleInstallClick}
      />

      <main className="main-wrap">
        {activeView === 'learn' && selectedSign && (
          <div className="learn-grid">
            <CameraCoachStage
              uiLang={prefs.uiLang}
              sign={selectedSign}
              showGhost={prefs.showGhost}
              onToggleGhost={() => setPrefs((p) => ({ ...p, showGhost: !p.showGhost }))}
              mirrorCamera={prefs.mirrorCamera}
              onToggleMirror={() => setPrefs((p) => ({ ...p, mirrorCamera: !p.mirrorCamera }))}
              playbackSpeed={prefs.playbackSpeed}
              onToggleSpeed={() =>
                setPrefs((p) => ({ ...p, playbackSpeed: p.playbackSpeed === 1 ? 0.5 : 1 }))
              }
              soundEnabled={prefs.soundEnabled}
              onToggleSound={() => setPrefs((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
              autoAdvance={prefs.autoAdvance}
              onToggleAutoAdvance={() => setPrefs((p) => ({ ...p, autoAdvance: !p.autoAdvance }))}
              hasPrev={selectedIndex > 0}
              hasNext={selectedIndex < activeSigns.length - 1}
              onPrevSign={() => {
                if (selectedIndex > 0) setSelectedSignId(activeSigns[selectedIndex - 1].id);
              }}
              onNextSign={() => {
                if (selectedIndex < activeSigns.length - 1) {
                  setSelectedSignId(activeSigns[selectedIndex + 1].id);
                }
              }}
              onSignMastered={handleSignMastered}
            />

            <LessonRail
              uiLang={prefs.uiLang}
              signs={activeSigns}
              selectedSign={selectedSign}
              onSelectSign={(s) => setSelectedSignId(s.id)}
              masteredIds={progress[prefs.activeLanguageId] ?? []}
              categoryFilter={categoryFilter}
              onChangeCategory={setCategoryFilter}
              searchQuery={searchQuery}
              onChangeSearch={setSearchQuery}
            />
          </div>
        )}

        {activeView === 'atlas' && (
          <WorldAtlasView
            uiLang={prefs.uiLang}
            customSigns={customSigns}
            onPracticeLanguage={handlePracticeLanguageFromAtlas}
            onRecordLanguage={handleRecordLanguageFromAtlas}
          />
        )}

        {activeView === 'studio' && (
          <StudioRecorderView
            uiLang={prefs.uiLang}
            defaultLanguageId={studioTargetLanguageId}
            customSigns={customSigns}
            onSaveSign={handleSaveCustomSign}
            onDeleteSign={handleDeleteCustomSign}
            onImportComplete={() => setCustomSigns(loadCustomSigns())}
            onPracticeSign={handlePracticeCustomSign}
          />
        )}
      </main>
    </div>
  );
}

export default App;
