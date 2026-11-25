import { describe, expect, it } from 'vitest';
import { BUILT_IN_SIGNS } from '../../data';
import { WORLD_SIGN_LANGUAGES } from '../../data/worldLanguages';
import type { SignDefinition } from '../../data/types';
import { sampleSignAnimation, synthesizeHandLandmarks } from '../poseSynthesizer';
import { computePathSimilarity, DynamicMotionTracker, evaluateStaticSign } from '../signRecognizer';

describe('HandSaid data packs', () => {
  it('contains 32 world sign languages with unique IDs and bilingual notes', () => {
    expect(WORLD_SIGN_LANGUAGES.length).toBe(32);
    const ids = new Set(WORLD_SIGN_LANGUAGES.map((l) => l.id));
    expect(ids.size).toBe(32);
    for (const lang of WORLD_SIGN_LANGUAGES) {
      expect(lang.nameEn.trim().length).toBeGreaterThan(0);
      expect(lang.nameBm.trim().length).toBeGreaterThan(0);
      expect(lang.noteEn.trim().length).toBeGreaterThan(0);
      expect(lang.noteBm.trim().length).toBeGreaterThan(0);
    }
  });

  it('contains 76 BIM signs and 76 ASL signs with unique IDs and valid bilingual metadata', () => {
    const bim = BUILT_IN_SIGNS.filter((s) => s.languageId === 'bim');
    const asl = BUILT_IN_SIGNS.filter((s) => s.languageId === 'asl');
    expect(bim.length).toBe(76);
    expect(asl.length).toBe(76);
    const allIds = new Set(BUILT_IN_SIGNS.map((s) => s.id));
    expect(allIds.size).toBe(152);

    for (const sign of BUILT_IN_SIGNS) {
      expect(sign.title.trim().length).toBeGreaterThan(0);
      expect(sign.glossEn.trim().length).toBeGreaterThan(0);
      expect(sign.glossBm.trim().length).toBeGreaterThan(0);
      expect(sign.descriptionEn.trim().length).toBeGreaterThan(0);
      expect(sign.descriptionBm.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('Pose synthesis and animation sampling', () => {
  it('produces 21 finite 3D landmarks at t = 0, 0.5, 1 for every built-in sign', () => {
    for (const sign of BUILT_IN_SIGNS) {
      for (const t of [0, 0.5, 1]) {
        const sampled = sampleSignAnimation(sign, t);
        expect(sampled.primary).toHaveLength(21);
        for (const pt of sampled.primary) {
          expect(Number.isFinite(pt.x)).toBe(true);
          expect(Number.isFinite(pt.y)).toBe(true);
          expect(Number.isFinite(pt.z)).toBe(true);
        }
        if (sampled.secondary) {
          expect(sampled.secondary).toHaveLength(21);
        }
      }
    }
  });
});

describe('Static sign recognizer discrimination', () => {
  const staticTargets = [
    'bim-alphabet-a',
    'bim-alphabet-b',
    'bim-alphabet-c',
    'bim-alphabet-d',
    'bim-alphabet-f',
    'bim-alphabet-i',
    'bim-alphabet-l',
    'bim-alphabet-o',
    'bim-alphabet-v',
    'bim-alphabet-w',
    'bim-alphabet-y',
    'asl-everyday-ily'
  ];

  it('scores synthesized canonical poses >= 75 on their own sign', () => {
    for (const id of staticTargets) {
      const sign = BUILT_IN_SIGNS.find((s) => s.id === id);
      expect(sign).toBeDefined();
      const lm = synthesizeHandLandmarks(sign!.poseSpec!);
      const res = evaluateStaticSign(sign!, [lm], 'en');
      expect(res.score, `Self-score failed for ${id}: ${res.score} (${res.hint})`).toBeGreaterThanOrEqual(75);
      expect(res.matched).toBe(true);
    }
  });

  it('rejects mismatched handshapes cleanly (< 65)', () => {
    const pairs: Array<[string, string]> = [
      ['bim-alphabet-a', 'bim-alphabet-b'],
      ['bim-alphabet-b', 'bim-alphabet-l'],
      ['bim-alphabet-l', 'bim-alphabet-v'],
      ['bim-alphabet-v', 'bim-alphabet-y'],
      ['bim-alphabet-i', 'bim-alphabet-w'],
      ['bim-alphabet-f', 'bim-alphabet-a'],
      ['asl-everyday-ily', 'bim-alphabet-b']
    ];
    for (const [poseId, ruleId] of pairs) {
      const poseSign = BUILT_IN_SIGNS.find((s) => s.id === poseId)!;
      const ruleSign = BUILT_IN_SIGNS.find((s) => s.id === ruleId)!;
      const lm = synthesizeHandLandmarks(poseSign.poseSpec!);
      const res = evaluateStaticSign(ruleSign, [lm], 'en');
      expect(res.score, `Expected ${poseId} against ${ruleId} to score < 65, got ${res.score}`).toBeLessThan(65);
    }
  });
});

describe('Dynamic motion path & tracker', () => {
  it('scores matching trajectories high and stationary or opposite trajectories low', () => {
    const target: Array<[number, number]> = [
      [0, 0],
      [0.12, 0.08],
      [0.24, 0.18]
    ];
    const matching: Array<[number, number]> = [
      [0.4, 0.3],
      [0.5, 0.37],
      [0.6, 0.45]
    ];
    const stationary: Array<[number, number]> = [
      [0.5, 0.5],
      [0.502, 0.501],
      [0.501, 0.502]
    ];
    const opposite: Array<[number, number]> = [
      [0.6, 0.5],
      [0.5, 0.43],
      [0.4, 0.35]
    ];

    expect(computePathSimilarity(matching, target, 0.08)).toBeGreaterThanOrEqual(75);
    expect(computePathSimilarity(stationary, target, 0.08)).toBeLessThan(50);
    expect(computePathSimilarity(opposite, target, 0.08)).toBeLessThan(50);
  });

  it('tracks a full dynamic sign sequence through DynamicMotionTracker', () => {
    const thankYou = BUILT_IN_SIGNS.find((s) => s.id === 'bim-everyday-terima-kasih')!;
    const tracker = new DynamicMotionTracker();
    let lastScore = 0;
    let matched = false;
    for (let i = 0; i <= 15; i += 1) {
      const t = i / 15;
      const sampled = sampleSignAnimation(thankYou, t);
      const res = tracker.update(thankYou, [sampled.primary], 1000 + i * 70, 'bm');
      lastScore = res.score;
      if (res.matched) matched = true;
    }
    expect(lastScore).toBeGreaterThanOrEqual(72);
    expect(matched).toBe(true);
  });
});

describe('Custom recorded sign recognition', () => {
  it('matches a recorded landmark pose >= 90 and rejects a different handshape < 65', () => {
    const signA = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-a')!;
    const signB = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-b')!;
    const lmA = synthesizeHandLandmarks(signA.poseSpec!, [0.5, 0.55], 0.25);
    const lmAShifted = synthesizeHandLandmarks(signA.poseSpec!, [0.38, 0.46], 0.31);
    const lmB = synthesizeHandLandmarks(signB.poseSpec!, [0.5, 0.55], 0.25);

    const customSign: SignDefinition = {
      id: 'custom-test-1',
      languageId: 'jsl',
      category: 'custom',
      mode: 'static',
      hands: 1,
      title: 'Test A',
      glossEn: 'Test A',
      glossBm: 'Uji A',
      descriptionEn: 'Recorded test',
      descriptionBm: 'Ujian rakaman',
      facialCueEn: 'Calm',
      facialCueBm: 'Tenang',
      difficulty: 1,
      recordedFrames: [{ t: 0, landmarks: lmA }],
      isCustom: true
    };

    const selfRes = evaluateStaticSign(customSign, [lmAShifted], 'en');
    const diffRes = evaluateStaticSign(customSign, [lmB], 'en');
    expect(selfRes.score).toBeGreaterThanOrEqual(90);
    expect(diffRes.score).toBeLessThan(65);
  });
});
