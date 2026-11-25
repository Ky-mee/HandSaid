import { describe, expect, it } from 'vitest';
import { BUILT_IN_SIGNS } from '../../data';
import { BUILT_IN_STATEMENTS } from '../../data/statements';
import { computeStreakDays } from '../../utils/storage';
import {
  ContinuousSignRecognizer,
  formatStatementFromSigns
} from '../freeCameraRecognizer';
import { sampleSignAnimation, synthesizeHandLandmarks } from '../poseSynthesizer';

describe('Built-in statements catalog', () => {
  it('contains 16 valid statements whose signIds all exist with matching languageId', () => {
    expect(BUILT_IN_STATEMENTS).toHaveLength(16);
    const byId = new Map(BUILT_IN_SIGNS.map((s) => [s.id, s]));

    for (const stmt of BUILT_IN_STATEMENTS) {
      expect(stmt.signIds.length).toBeGreaterThanOrEqual(2);
      for (const id of stmt.signIds) {
        const sign = byId.get(id);
        expect(sign, `Missing sign ${id} in statement ${stmt.id}`).toBeDefined();
        expect(sign?.languageId).toBe(stmt.languageId);
      }
    }
  });
});

describe('ContinuousSignRecognizer for Free Camera', () => {
  it('locks onto static signs after stability hold, debounces duplicates, and resets on hand exit', () => {
    const recognizer = new ContinuousSignRecognizer();
    const bimSigns = BUILT_IN_SIGNS.filter((s) => s.languageId === 'bim');
    const signV = bimSigns.find((s) => s.id === 'bim-alphabet-v')!;
    const lmV = synthesizeHandLandmarks(signV.poseSpec!);

    let committedTitle = '';
    for (let i = 0; i < 12; i += 1) {
      const res = recognizer.update(bimSigns, [lmV], 1000 + i * 60, 'alphanum', 'en');
      if (res.committedSign) {
        committedTitle = res.committedSign.title;
      }
    }
    expect(committedTitle).toBe('V');

    // Cooldown should prevent immediate duplicate commit while hand stays steady
    const immediateFollow = recognizer.update(bimSigns, [lmV], 1800, 'alphanum', 'en');
    expect(immediateFollow.committedSign).toBeNull();

    // Hand leaves frame >= 500ms -> cooldown clears cleanly
    recognizer.update(bimSigns, [], 1900, 'alphanum', 'en');
    recognizer.update(bimSigns, [], 2450, 'alphanum', 'en');
    const afterExit = recognizer.update(bimSigns, [lmV], 2500, 'alphanum', 'en');
    expect(afterExit.candidates[0]?.sign.id).toBe('bim-alphabet-v');
  });

  it('recognizes dynamic word motion in words scope', () => {
    const recognizer = new ContinuousSignRecognizer();
    const bimSigns = BUILT_IN_SIGNS.filter((s) => s.languageId === 'bim');
    const thankYou = bimSigns.find((s) => s.id === 'bim-everyday-terima-kasih')!;

    let lockedId: string | null = null;
    for (let i = 0; i <= 18; i += 1) {
      const t = i / 18;
      const sampled = sampleSignAnimation(thankYou, t);
      const res = recognizer.update(bimSigns, [sampled.primary], 1000 + i * 65, 'words', 'bm');
      if (res.committedSign) {
        lockedId = res.committedSign.id;
      }
    }
    expect(lockedId).toBe('bim-everyday-terima-kasih');
  });
});

describe('Statement formatting & streak calculation', () => {
  it('merges fingerspelled characters into words and spaces multi-word statements', () => {
    const h = BUILT_IN_SIGNS.find((s) => s.id === 'asl-alphabet-h')!;
    const i = BUILT_IN_SIGNS.find((s) => s.id === 'asl-alphabet-i')!;
    const friend = BUILT_IN_SIGNS.find((s) => s.id === 'asl-everyday-friend')!;

    const formatted = formatStatementFromSigns([h, i, { space: true }, friend], 'en');
    expect(formatted.text).toBe('HI Friend');
  });

  it('computes consecutive daily streaks accurately', () => {
    expect(computeStreakDays([], '2026-11-25')).toBe(0);
    expect(computeStreakDays(['2026-11-25'], '2026-11-25')).toBe(1);
    expect(
      computeStreakDays(['2026-11-23', '2026-11-24', '2026-11-25'], '2026-11-25')
    ).toBe(3);
    // Yesterday active still preserves streak mid-day today
    expect(computeStreakDays(['2026-11-23', '2026-11-24'], '2026-11-25')).toBe(2);
    // Gap breaks streak
    expect(computeStreakDays(['2026-11-22'], '2026-11-25')).toBe(0);
  });
});
