import type { Point3D, SignDefinition, UiLang } from '../data/types';
import { extractHandFeatures, normalizeLandmarkVector } from './handFeatures';
import {
  computePathSimilarity,
  evaluateHandAgainstRule,
  evaluateStaticSign
} from './signRecognizer';

export type FreeCamScope = 'words' | 'alphanum' | 'all';

export interface FreeCamCandidate {
  sign: SignDefinition;
  score: number;
  mode: 'static' | 'dynamic';
}

export interface FreeCamUpdateResult {
  candidates: FreeCamCandidate[];
  activeSign: SignDefinition | null;
  activeScore: number;
  lockProgress: number;
  committedSign: SignDefinition | null;
  isMoving: boolean;
  handsDetected: number;
}

export type StatementToken = SignDefinition | { space: true };

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function scoreNormalizedVectors(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  if (len === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < len; i += 1) {
    const diff = a[i] - b[i];
    sumSq += diff * diff;
  }
  const rms = Math.sqrt(sumSq / (len / 3));
  return clamp(Math.round(100 * Math.exp(-rms * rms * 2.3)), 0, 100);
}

export function filterSignsByScope(
  signs: SignDefinition[],
  scope: FreeCamScope
): SignDefinition[] {
  if (scope === 'alphanum') {
    return signs.filter((s) => s.category === 'alphabet' || s.category === 'number');
  }
  if (scope === 'words') {
    return signs.filter(
      (s) =>
        s.category === 'everyday' ||
        s.category === 'people' ||
        s.category === 'feelings' ||
        s.category === 'custom'
    );
  }
  return signs;
}

interface MotionSample {
  timestamp: number;
  anchor: [number, number];
  vector: number[];
}

function computeTravel(samples: MotionSample[]): number {
  if (samples.length < 2) return 0;
  const start = samples[0].anchor;
  let maxDisp = 0;
  let pathLen = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const p = samples[i].anchor;
    maxDisp = Math.max(maxDisp, Math.hypot(p[0] - start[0], p[1] - start[1]));
    if (i > 0) {
      const prev = samples[i - 1].anchor;
      pathLen += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    }
  }
  return Math.max(maxDisp, pathLen * 0.45);
}

/**
 * Continuous multi-sign recognizer for Free Camera mode.
 * Classifies static poses and dynamic trajectories across the active language pack
 * and locks in high-confidence signs with stability debouncing.
 */
export class ContinuousSignRecognizer {
  private buffer: MotionSample[] = [];
  private readonly maxWindowMs = 2200;
  private candidateId: string | null = null;
  private holdMs = 0;
  private lastTimestamp = 0;
  private lastCommittedId: string | null = null;
  private lastCommittedAt = 0;
  private noHandSince: number | null = null;

  public reset(): void {
    this.buffer = [];
    this.candidateId = null;
    this.holdMs = 0;
    this.lastTimestamp = 0;
    this.lastCommittedId = null;
    this.lastCommittedAt = 0;
    this.noHandSince = null;
  }

  public update(
    signs: SignDefinition[],
    hands: Point3D[][],
    timestamp: number,
    scope: FreeCamScope,
    uiLang: UiLang
  ): FreeCamUpdateResult {
    const dt = this.lastTimestamp ? Math.min(80, Math.max(0, timestamp - this.lastTimestamp)) : 16;
    this.lastTimestamp = timestamp;

    if (hands.length === 0) {
      if (this.noHandSince === null) {
        this.noHandSince = timestamp;
      } else if (timestamp - this.noHandSince >= 450) {
        this.lastCommittedId = null;
      }
      this.holdMs = Math.max(0, this.holdMs - dt * 2);
      if (this.holdMs === 0) this.candidateId = null;
      return {
        candidates: [],
        activeSign: null,
        activeScore: 0,
        lockProgress: 0,
        committedSign: null,
        isMoving: false,
        handsDetected: 0
      };
    }

    this.noHandSince = null;
    const primaryHand = hands[0];
    const primaryFeatures = extractHandFeatures(primaryHand);
    const primaryVector = normalizeLandmarkVector(primaryHand);

    this.buffer.push({
      timestamp,
      anchor: primaryFeatures.palmCenter,
      vector: primaryVector
    });
    this.buffer = this.buffer.filter((s) => timestamp - s.timestamp <= this.maxWindowMs);

    const recentSamples = this.buffer.filter((s) => timestamp - s.timestamp <= 700);
    const isMoving = computeTravel(recentSamples) >= 0.065;

    const eligible = filterSignsByScope(signs, scope).filter(
      (s) => s.hands === 1 || hands.length >= 2
    );

    const scored: FreeCamCandidate[] = [];

    for (const sign of eligible) {
      if (sign.mode === 'static') {
        const res = evaluateStaticSign(sign, hands, uiLang);
        const adjusted = isMoving ? Math.round(res.score * 0.78) : res.score;
        scored.push({ sign, score: adjusted, mode: 'static' });
        continue;
      }

      // Dynamic sign evaluation
      let shapeScore = 0;
      if (sign.recordedFrames && sign.recordedFrames.length > 0) {
        shapeScore = Math.max(
          ...sign.recordedFrames.map((f) =>
            scoreNormalizedVectors(primaryVector, normalizeLandmarkVector(f.landmarks))
          )
        );
      } else if (sign.matcherRule) {
        const evals = hands.map((h) =>
          evaluateHandAgainstRule(extractHandFeatures(h), sign.matcherRule!, uiLang)
        );
        evals.sort((a, b) => b.score - a.score);
        shapeScore = evals[0]?.score ?? 0;
      }

      if (!isMoving || this.buffer.length < 4) {
        scored.push({ sign, score: Math.round(shapeScore * 0.35), mode: 'dynamic' });
        continue;
      }

      let targetWaypoints: Array<[number, number]> = sign.matcherRule?.pathWaypoints ?? [];
      if (targetWaypoints.length < 2 && sign.recordedFrames && sign.recordedFrames.length > 2) {
        targetWaypoints = sign.recordedFrames.map((f) => {
          const lm = f.landmarks[9] ?? f.landmarks[0];
          return [lm.x, lm.y];
        });
      }

      let bestPathScore = 0;
      if (targetWaypoints.length >= 2) {
        const minDisp = sign.matcherRule?.minDisplacement ?? 0.06;
        for (const dur of [650, 1050, 1550]) {
          const sub = this.buffer.filter((s) => timestamp - s.timestamp <= dur);
          if (sub.length >= 4) {
            const pScore = computePathSimilarity(
              sub.map((s) => s.anchor),
              targetWaypoints,
              minDisp
            );
            if (pScore > bestPathScore) bestPathScore = pScore;
          }
        }
      } else {
        bestPathScore = shapeScore;
      }

      let total = Math.round(shapeScore * 0.48 + bestPathScore * 0.52);
      if (sign.hands === 2 && hands.length >= 2 && total >= 55) {
        total = Math.min(100, total + 5);
      }
      scored.push({ sign, score: total, mode: 'dynamic' });
    }

    scored.sort((a, b) => b.score - a.score);
    const candidates = scored.slice(0, 3);
    const top = candidates[0] ?? null;

    let committedSign: SignDefinition | null = null;
    let lockProgress = 0;

    if (top) {
      const threshold = top.mode === 'dynamic' ? 72 : 77;
      const requiredHoldMs = top.mode === 'dynamic' ? 240 : 520;
      const inCooldown =
        this.lastCommittedId === top.sign.id && timestamp - this.lastCommittedAt < 1400;

      if (top.score >= threshold && !inCooldown) {
        if (this.candidateId === top.sign.id) {
          this.holdMs = Math.min(requiredHoldMs, this.holdMs + dt);
        } else {
          this.candidateId = top.sign.id;
          this.holdMs = dt;
        }

        lockProgress = clamp(this.holdMs / requiredHoldMs, 0, 1);
        if (this.holdMs >= requiredHoldMs) {
          committedSign = top.sign;
          this.lastCommittedId = top.sign.id;
          this.lastCommittedAt = timestamp;
          this.holdMs = 0;
          this.candidateId = null;
          lockProgress = 1;
        }
      } else {
        this.holdMs = Math.max(0, this.holdMs - dt * 1.5);
        if (this.holdMs === 0) this.candidateId = null;
      }
    }

    return {
      candidates,
      activeSign: top?.sign ?? null,
      activeScore: top?.score ?? 0,
      lockProgress,
      committedSign,
      isMoving,
      handsDetected: hands.length
    };
  }
}

function isSingleCharToken(sign: SignDefinition): boolean {
  return (
    (sign.category === 'alphabet' || sign.category === 'number') &&
    sign.title.trim().length === 1
  );
}

/**
 * Format a sequence of recognized signs & explicit spaces into a readable statement
 * (joining consecutive fingerspelled letters/digits into words).
 */
export function formatStatementFromSigns(
  tokens: StatementToken[],
  uiLang: UiLang
): { text: string; translation: string } {
  const words: string[] = [];
  const glosses: string[] = [];
  let spellBuffer = '';

  const flushSpell = () => {
    if (spellBuffer) {
      words.push(spellBuffer);
      glosses.push(spellBuffer);
      spellBuffer = '';
    }
  };

  for (const tok of tokens) {
    if ('space' in tok) {
      flushSpell();
      continue;
    }
    if (isSingleCharToken(tok)) {
      spellBuffer += tok.title.trim();
    } else {
      flushSpell();
      words.push(tok.title.trim());
      glosses.push((uiLang === 'bm' ? tok.glossBm : tok.glossEn).trim());
    }
  }
  flushSpell();

  return {
    text: words.join(' '),
    translation: glosses.join(' · ')
  };
}
