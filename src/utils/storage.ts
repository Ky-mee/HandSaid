import type {
  AppPreferences,
  Point3D,
  PracticeActivity,
  RecordedFrame,
  SignDefinition,
  TestSessionRecord
} from '../data/types';

const PROGRESS_KEY = 'handsaid.progress.v1';
const LEGACY_PROGRESS_KEY = 'isyarat.progress.v1';
const CUSTOM_SIGNS_KEY = 'handsaid.customSigns.v1';
const LEGACY_CUSTOM_SIGNS_KEY = 'isyarat.customSigns.v1';
const PREFS_KEY = 'handsaid.prefs.v1';
const LEGACY_PREFS_KEY = 'isyarat.prefs.v1';
const TEST_HISTORY_KEY = 'handsaid.testHistory.v1';
const ACTIVITY_KEY = 'handsaid.activity.v1';

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

export function loadTestHistory(): TestSessionRecord[] {
  try {
    const raw = localStorage.getItem(TEST_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r): r is TestSessionRecord => {
      if (!r || typeof r !== 'object') return false;
      const obj = r as Record<string, unknown>;
      return (
        typeof obj.id === 'string' &&
        typeof obj.languageId === 'string' &&
        (obj.mode === 'camera-quiz' || obj.mode === 'visual-quiz' || obj.mode === 'statement') &&
        typeof obj.dateIso === 'string' &&
        typeof obj.totalQuestions === 'number' &&
        typeof obj.correctCount === 'number' &&
        typeof obj.accuracyPct === 'number' &&
        typeof obj.durationSec === 'number'
      );
    });
  } catch {
    return [];
  }
}

export function saveTestSession(record: TestSessionRecord): TestSessionRecord[] {
  const existing = loadTestHistory().filter((r) => r.id !== record.id);
  const next = [record, ...existing].slice(0, 30);
  try {
    localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota issues
  }
  return next;
}

const DEFAULT_ACTIVITY: PracticeActivity = {
  datesActive: [],
  totalSignedCount: 0,
  statementsBuilt: 0,
  recentSignIds: []
};

export function getLocalDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadActivity(): PracticeActivity {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return DEFAULT_ACTIVITY;
    const parsed = JSON.parse(raw) as Partial<PracticeActivity>;
    return {
      datesActive: Array.isArray(parsed.datesActive)
        ? parsed.datesActive.filter((d): d is string => typeof d === 'string')
        : [],
      totalSignedCount: typeof parsed.totalSignedCount === 'number' ? parsed.totalSignedCount : 0,
      statementsBuilt: typeof parsed.statementsBuilt === 'number' ? parsed.statementsBuilt : 0,
      recentSignIds: Array.isArray(parsed.recentSignIds) ? parsed.recentSignIds.slice(0, 12) : []
    };
  } catch {
    return DEFAULT_ACTIVITY;
  }
}

function saveActivity(activity: PracticeActivity): PracticeActivity {
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
  } catch {
    // Ignore storage quota issues
  }
  return activity;
}

export function recordSignActivity(languageId: string, signId: string): PracticeActivity {
  const cur = loadActivity();
  const today = getLocalDateKey();
  const datesActive = cur.datesActive.includes(today) ? cur.datesActive : [...cur.datesActive, today];
  const filteredRecent = cur.recentSignIds.filter(
    (item) => !(item.languageId === languageId && item.signId === signId)
  );
  return saveActivity({
    datesActive,
    totalSignedCount: cur.totalSignedCount + 1,
    statementsBuilt: cur.statementsBuilt,
    recentSignIds: [{ languageId, signId, at: new Date().toISOString() }, ...filteredRecent].slice(0, 12)
  });
}

export function recordStatementBuilt(): PracticeActivity {
  const cur = loadActivity();
  const today = getLocalDateKey();
  const datesActive = cur.datesActive.includes(today) ? cur.datesActive : [...cur.datesActive, today];
  return saveActivity({
    datesActive,
    totalSignedCount: cur.totalSignedCount,
    statementsBuilt: cur.statementsBuilt + 1,
    recentSignIds: cur.recentSignIds
  });
}

/**
 * Compute consecutive active days ending today (or yesterday if today hasn't had activity yet).
 */
export function computeStreakDays(datesActive: string[], todayKey = getLocalDateKey()): number {
  if (datesActive.length === 0) return 0;
  const set = new Set(datesActive);

  const shiftDate = (isoDate: string, deltaDays: number): string => {
    const [y, m, d] = isoDate.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, (d || 1) + deltaDays);
    return getLocalDateKey(dt);
  };

  let cursor = set.has(todayKey) ? todayKey : shiftDate(todayKey, -1);
  if (!set.has(cursor)) return 0;

  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}
