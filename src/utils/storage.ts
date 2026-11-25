import type { AppPreferences, Point3D, RecordedFrame, SignDefinition } from '../data/types';

const PROGRESS_KEY = 'handsaid.progress.v1';
const LEGACY_PROGRESS_KEY = 'isyarat.progress.v1';
const CUSTOM_SIGNS_KEY = 'handsaid.customSigns.v1';
const LEGACY_CUSTOM_SIGNS_KEY = 'isyarat.customSigns.v1';
const PREFS_KEY = 'handsaid.prefs.v1';
const LEGACY_PREFS_KEY = 'isyarat.prefs.v1';

export type MasteryProgress = Record<string, string[]>;

const DEFAULT_PREFS: AppPreferences = {
  uiLang: 'en',
  activeLanguageId: 'bim',
  showGhost: true,
  mirrorCamera: true,
  playbackSpeed: 1,
  soundEnabled: true,
  autoAdvance: true
};

export function loadProgress(): MasteryProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY) ?? localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    const clean: MasteryProgress = {};
    for (const [lang, ids] of Object.entries(parsed)) {
      if (Array.isArray(ids)) {
        clean[lang] = ids.filter((id): id is string => typeof id === 'string');
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function markSignMastered(languageId: string, signId: string): MasteryProgress {
  const current = loadProgress();
  const list = current[languageId] ?? [];
  if (!list.includes(signId)) {
    current[languageId] = [...list, signId];
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(current));
    } catch {
      // Ignore storage quota issues
    }
  }
  return current;
}

export function loadPrefs(): AppPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY) ?? localStorage.getItem(LEGACY_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<AppPreferences>;
    return {
      uiLang: parsed.uiLang === 'bm' ? 'bm' : 'en',
      activeLanguageId: typeof parsed.activeLanguageId === 'string' ? parsed.activeLanguageId : 'bim',
      showGhost: typeof parsed.showGhost === 'boolean' ? parsed.showGhost : true,
      mirrorCamera: typeof parsed.mirrorCamera === 'boolean' ? parsed.mirrorCamera : true,
      playbackSpeed: parsed.playbackSpeed === 0.5 ? 0.5 : 1,
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      autoAdvance: typeof parsed.autoAdvance === 'boolean' ? parsed.autoAdvance : true
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: AppPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota issues
  }
}

function isPoint3D(v: unknown): v is Point3D {
  if (!v || typeof v !== 'object') return false;
  const p = v as Record<string, unknown>;
  return typeof p.x === 'number' && typeof p.y === 'number' && typeof p.z === 'number';
}

function isValidRecordedFrame(v: unknown): v is RecordedFrame {
  if (!v || typeof v !== 'object') return false;
  const f = v as Record<string, unknown>;
  if (typeof f.t !== 'number' || !Array.isArray(f.landmarks) || f.landmarks.length !== 21) return false;
  if (!f.landmarks.every(isPoint3D)) return false;
  if (f.secondLandmarks !== undefined) {
    if (!Array.isArray(f.secondLandmarks) || f.secondLandmarks.length !== 21 || !f.secondLandmarks.every(isPoint3D)) {
      return false;
    }
  }
  return true;
}

export function isValidCustomSign(v: unknown): v is SignDefinition {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  if (
    typeof s.id !== 'string' ||
    typeof s.languageId !== 'string' ||
    typeof s.title !== 'string' ||
    !s.title.trim() ||
    (s.mode !== 'static' && s.mode !== 'dynamic') ||
    (s.hands !== 1 && s.hands !== 2)
  ) {
    return false;
  }
  if (!Array.isArray(s.recordedFrames) || s.recordedFrames.length === 0) return false;
  return s.recordedFrames.every(isValidRecordedFrame);
}

export function loadCustomSigns(): SignDefinition[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SIGNS_KEY) ?? localStorage.getItem(LEGACY_CUSTOM_SIGNS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCustomSign).map((s) => ({ ...s, isCustom: true }));
  } catch {
    return [];
  }
}

export function saveCustomSign(sign: SignDefinition): SignDefinition[] {
  const existing = loadCustomSigns().filter((s) => s.id !== sign.id);
  const next = [{ ...sign, isCustom: true }, ...existing];
  try {
    localStorage.setItem(CUSTOM_SIGNS_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota issues
  }
  return next;
}

export function deleteCustomSign(signId: string): SignDefinition[] {
  const next = loadCustomSigns().filter((s) => s.id !== signId);
  try {
    localStorage.setItem(CUSTOM_SIGNS_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota issues
  }
  return next;
}

export interface ExportedLanguagePack {
  format: 'handsaid-pack-v1';
  languageId: string;
  exportedAt: string;
  signs: SignDefinition[];
}

export function exportLanguagePackJson(languageId: string, signs: SignDefinition[]): string {
  const payload: ExportedLanguagePack = {
    format: 'handsaid-pack-v1',
    languageId,
    exportedAt: new Date().toISOString(),
    signs: signs.filter((s) => s.languageId === languageId)
  };
  return JSON.stringify(payload, null, 2);
}

export function importLanguagePackJson(rawJson: string): SignDefinition[] {
  const parsed = JSON.parse(rawJson) as unknown;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON structure');
  }
  const obj = parsed as Record<string, unknown>;
  if ((obj.format !== 'handsaid-pack-v1' && obj.format !== 'isyarat-pack-v1') || !Array.isArray(obj.signs)) {
    throw new Error('Unsupported pack format');
  }

  const valid = obj.signs.filter(isValidCustomSign).map((s) => ({ ...s, isCustom: true }));
  if (valid.length === 0) {
    throw new Error('No valid signs in pack');
  }

  const existing = loadCustomSigns();
  const byId = new Map(existing.map((s) => [s.id, s]));
  for (const s of valid) {
    byId.set(s.id, s);
  }
  const merged = Array.from(byId.values());
  localStorage.setItem(CUSTOM_SIGNS_KEY, JSON.stringify(merged));
  return valid;
}
