import type { FingerName, MatcherRule, Point3D, SignDefinition, UiLang } from '../data/types';
import { extractHandFeatures, normalizeLandmarkVector, type HandFeatures } from './handFeatures';

export interface StaticEvaluationResult {
  score: number;
  matched: boolean;
  fingerStatus: Record<FingerName, 'match' | 'adjust'>;
  hint: string;
}

export interface DynamicEvaluationResult {
  score: number;
  shapeScore: number;
  pathScore: number;
  matched: boolean;
  progress: number;
  fingerStatus: Record<FingerName, 'match' | 'adjust'>;
  hint: string;
}

const FINGERS: FingerName[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];

const FINGER_NAMES_EN: Record<FingerName, string> = {
  thumb: 'thumb',
  index: 'index finger',
  middle: 'middle finger',
  ring: 'ring finger',
  pinky: 'pinky finger'
};

const FINGER_NAMES_BM: Record<FingerName, string> = {
  thumb: 'ibu jari',
  index: 'jari telunjuk',
  middle: 'jari tengah',
  ring: 'jari manis',
  pinky: 'jari kelingking'
};

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function wrapAngleDiffDeg(a: number, b: number): number {
  let d = ((a - b + 180) % 360) - 180;
  if (d < -180) d += 360;
  return Math.abs(d);
}

function defaultFingerStatus(status: 'match' | 'adjust' = 'adjust'): Record<FingerName, 'match' | 'adjust'> {
  return {
    thumb: status,
    index: status,
    middle: status,
    ring: status,
    pinky: status
  };
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
  // rms ~0 -> 100, rms ~0.55 -> 50, rms >= 1.1 -> 0
  return clamp(Math.round(100 * Math.exp(-rms * rms * 2.3)), 0, 100);
}

export function evaluateHandAgainstRule(
  features: HandFeatures,
  rule: MatcherRule,
  uiLang: UiLang
): StaticEvaluationResult {
  const fingerStatus = defaultFingerStatus('match');
  let curlScoreSum = 0;
  let worstFinger: FingerName | null = null;
  let worstDelta = 0;
  let worstTarget = 0;
  let worstActual = 0;

  for (const finger of FINGERS) {
    const target = rule.curls[finger];
    const actual = features.curls[finger];
    const tol = rule.curlTolerance?.[finger] ?? 0.28;
    const err = Math.abs(actual - target);
    const normalizedErr = err / Math.max(0.15, tol);
    const fScore = clamp(1 - Math.max(0, normalizedErr - 0.18) * 0.72, 0, 1);
    curlScoreSum += fScore;

    if (err > tol * 0.95) {
      fingerStatus[finger] = 'adjust';
    }
    if (normalizedErr > worstDelta) {
      worstDelta = normalizedErr;
      worstFinger = finger;
      worstTarget = target;
      worstActual = actual;
    }
  }

  let score = (curlScoreSum / FINGERS.length) * 100;
  let hint = '';

  // Pinch requirement (F, O, D, 6, 7, 8, 9)
  if (rule.pinchTo) {
    const pinchDist = features.pinchDistances[rule.pinchTo];
    const pinchFactor = pinchDist < 0.45 ? 1 : clamp(1 - (pinchDist - 0.45) * 0.9, 0.25, 1);
    score *= pinchFactor;
    if (pinchDist >= 0.48) {
      fingerStatus.thumb = 'adjust';
      fingerStatus[rule.pinchTo] = 'adjust';
      hint =
        uiLang === 'bm'
          ? `Temukan hujung ibu jari dengan ${FINGER_NAMES_BM[rule.pinchTo]}`
          : `Touch your thumb tip to your ${FINGER_NAMES_EN[rule.pinchTo]}`;
    }
  }

  // Spread checks (V vs U, 4 vs B, K)
  if (rule.minIndexMiddleSpread !== undefined && features.indexMiddleSpread < rule.minIndexMiddleSpread) {
    const ratio = features.indexMiddleSpread / rule.minIndexMiddleSpread;
    score *= clamp(0.45 + ratio * 0.55, 0.45, 1);
    fingerStatus.index = 'adjust';
    fingerStatus.middle = 'adjust';
    if (!hint) {
      hint =
        uiLang === 'bm'
          ? 'Buka jari telunjuk dan jari tengah lebih luas'
          : 'Spread your index and middle fingers wider apart';
    }
  }

  if (rule.maxIndexMiddleSpread !== undefined && features.indexMiddleSpread > rule.maxIndexMiddleSpread) {
    const excess = (features.indexMiddleSpread - rule.maxIndexMiddleSpread) / 0.35;
    score *= clamp(1 - excess * 0.55, 0.4, 1);
    fingerStatus.index = 'adjust';
    fingerStatus.middle = 'adjust';
    if (!hint) {
      hint =
        uiLang === 'bm'
          ? 'Rapatkan jari telunjuk dan jari tengah bersama'
          : 'Press your index and middle fingers together';
    }
  }

  // Thumb tucked across check (B, E, S, 4)
  if (rule.requireThumbAcross && !features.thumbAcross) {
    score *= 0.72;
    fingerStatus.thumb = 'adjust';
    if (!hint) {
      hint =
        uiLang === 'bm'
          ? 'Lipat ibu jari merentasi tapak tangan'
          : 'Tuck your thumb across the palm';
    }
  }

  // Crossed fingers check (R)
  if (rule.requireCrossIndexMiddle && !features.indexMiddleCrossed) {
    score *= 0.55;
    fingerStatus.index = 'adjust';
    fingerStatus.middle = 'adjust';
    if (!hint) {
      hint =
        uiLang === 'bm'
          ? 'Silangkan jari tengah di atas jari telunjuk'
          : 'Cross your middle finger over your index finger';
    }
  }

  // Orientation tilt check (G, H, P, Q vs upright)
  if (rule.targetTiltDeg !== undefined) {
    const tiltTol = rule.tiltToleranceDeg ?? 45;
    const diff = wrapAngleDiffDeg(features.handTiltDeg, rule.targetTiltDeg);
    if (diff > tiltTol) {
      const penalty = clamp(1 - ((diff - tiltTol) / 90) * 0.65, 0.35, 1);
      score *= penalty;
      if (!hint) {
        hint =
          Math.abs(rule.targetTiltDeg) > 120
            ? uiLang === 'bm'
              ? 'Halakan jari ke bawah'
              : 'Angle your fingers downward'
            : Math.abs(rule.targetTiltDeg) > 55
              ? uiLang === 'bm'
                ? 'Pusingkan tangan ke sisi secara mendatar'
                : 'Point your hand horizontally to the side'
              : uiLang === 'bm'
                ? 'Tegakkan tangan anda ke atas'
                : 'Hold your hand upright';
      }
    }
  }

  if (!hint && worstFinger && worstDelta > 0.95) {
    const shouldExtend = worstActual > worstTarget;
    hint =
      uiLang === 'bm'
        ? shouldExtend
          ? `Luruskan ${FINGER_NAMES_BM[worstFinger]} anda`
          : `Bengkokkan ${FINGER_NAMES_BM[worstFinger]} anda`
        : shouldExtend
          ? `Extend your ${FINGER_NAMES_EN[worstFinger]}`
          : `Curl your ${FINGER_NAMES_EN[worstFinger]} in`;
  }

  const finalScore = clamp(Math.round(score), 0, 100);
  const matched = finalScore >= 75;
  if (matched && !hint) {
    hint = uiLang === 'bm' ? 'Bentuk tepat — kekalkan seketika' : 'Great shape — hold steady';
  }

  return {
    score: finalScore,
    matched,
    fingerStatus,
    hint
  };
}

export function evaluateStaticSign(
  sign: SignDefinition,
  hands: Point3D[][],
  uiLang: UiLang
): StaticEvaluationResult {
  if (hands.length === 0) {
    return {
      score: 0,
      matched: false,
      fingerStatus: defaultFingerStatus('adjust'),
      hint: uiLang === 'bm' ? 'Tunjukkan tangan anda di kamera' : 'Raise your hand into the camera view'
    };
  }

  if (sign.hands === 2 && hands.length < 2) {
    return {
      score: 35,
      matched: false,
      fingerStatus: defaultFingerStatus('adjust'),
      hint: uiLang === 'bm' ? 'Tunjukkan kedua-dua tangan di kamera' : 'Show both hands in view for this sign'
    };
  }

  // Recorded template matching
  if (sign.recordedFrames && sign.recordedFrames.length > 0) {
    const targetVec = normalizeLandmarkVector(sign.recordedFrames[0].landmarks);
    const scores = hands.map((h) => scoreNormalizedVectors(normalizeLandmarkVector(h), targetVec));
    const best = Math.max(...scores);
    const matched = best >= 74;
    return {
      score: best,
      matched,
      fingerStatus: defaultFingerStatus(matched ? 'match' : 'adjust'),
      hint: matched
        ? uiLang === 'bm'
          ? 'Bentuk tepat — kekalkan seketika'
          : 'Great match — hold steady'
        : uiLang === 'bm'
          ? 'Padankan bentuk tangan anda dengan panduan bayang'
          : 'Align your handshape with the amber ghost guide'
    };
  }

  if (!sign.matcherRule) {
    return {
      score: 0,
      matched: false,
      fingerStatus: defaultFingerStatus('adjust'),
      hint: ''
    };
  }

  const evaluations = hands.map((lm) => evaluateHandAgainstRule(extractHandFeatures(lm), sign.matcherRule!, uiLang));
  evaluations.sort((a, b) => b.score - a.score);
  return evaluations[0];
}

function resamplePath(points: Array<[number, number]>, count: number): Array<[number, number]> {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: count }, () => [points[0][0], points[0][1]]);

  const cumLen: number[] = [0];
  for (let i = 1; i < points.length; i += 1) {
    const d = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    cumLen.push(cumLen[i - 1] + d);
  }
  const total = cumLen[cumLen.length - 1];
  if (total < 1e-6) {
    return Array.from({ length: count }, () => [points[0][0], points[0][1]]);
  }

  const resampled: Array<[number, number]> = [];
  for (let k = 0; k < count; k += 1) {
    const targetDist = (k / (count - 1)) * total;
    let segIdx = 0;
    while (segIdx < cumLen.length - 2 && cumLen[segIdx + 1] < targetDist) {
      segIdx += 1;
    }
    const segLen = Math.max(1e-6, cumLen[segIdx + 1] - cumLen[segIdx]);
    const alpha = (targetDist - cumLen[segIdx]) / segLen;
    resampled.push([
      points[segIdx][0] + (points[segIdx + 1][0] - points[segIdx][0]) * alpha,
      points[segIdx][1] + (points[segIdx + 1][1] - points[segIdx][1]) * alpha
    ]);
  }
  return resampled;
}

function normalizePath(points: Array<[number, number]>): { pts: Array<[number, number]>; span: number } {
  const origin = points[0];
  let maxDist = 0;
  for (const p of points) {
    const d = Math.hypot(p[0] - origin[0], p[1] - origin[1]);
    if (d > maxDist) maxDist = d;
  }
  // Compute total path length too for looping paths (circles, taps)
  let pathLen = 0;
  for (let i = 1; i < points.length; i += 1) {
    pathLen += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  const span = Math.max(maxDist, pathLen * 0.42);
  if (span < 1e-5) {
    return { pts: points.map(() => [0, 0]), span: 0 };
  }
  const pts = points.map(([x, y]): [number, number] => [(x - origin[0]) / span, (y - origin[1]) / span]);
  return { pts, span };
}

function computeDtwDistance(a: Array<[number, number]>, b: Array<[number, number]>): number {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(Infinity));
  dp[0][0] = 0;
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      const cost = Math.hypot(a[i - 1][0] - b[j - 1][0], a[i - 1][1] - b[j - 1][1]);
      dp[i][j] = cost + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[n][m] / (n + m);
}

/**
 * Compares observed 2D movement trajectory against target waypoints using scale-invariant DTW.
 */
export function computePathSimilarity(
  observedPath: Array<[number, number]>,
  targetWaypoints: Array<[number, number]>,
  minDisplacement = 0.06
): number {
  if (observedPath.length < 3 || targetWaypoints.length < 2) return 0;

  // Measure raw displacement / path travel
  let obsPathLen = 0;
  let obsMaxDisp = 0;
  const start = observedPath[0];
  for (let i = 0; i < observedPath.length; i += 1) {
    obsMaxDisp = Math.max(obsMaxDisp, Math.hypot(observedPath[i][0] - start[0], observedPath[i][1] - start[1]));
    if (i > 0) {
      obsPathLen += Math.hypot(
        observedPath[i][0] - observedPath[i - 1][0],
        observedPath[i][1] - observedPath[i - 1][1]
      );
    }
  }
  const effectiveTravel = Math.max(obsMaxDisp, obsPathLen * 0.45);
  if (effectiveTravel < minDisplacement) {
    return clamp(Math.round((effectiveTravel / minDisplacement) * 35), 0, 35);
  }

  const N = 16;
  const obsResampled = normalizePath(resamplePath(observedPath, N));
  const tgtResampled = normalizePath(resamplePath(targetWaypoints, N));
  if (obsResampled.span === 0 || tgtResampled.span === 0) return 0;

  const dtw = computeDtwDistance(obsResampled.pts, tgtResampled.pts);
  // Also verify net displacement direction if target has clear net displacement
  const tgtNet = [
    tgtResampled.pts[N - 1][0] - tgtResampled.pts[0][0],
    tgtResampled.pts[N - 1][1] - tgtResampled.pts[0][1]
  ];
  const obsNet = [
    obsResampled.pts[N - 1][0] - obsResampled.pts[0][0],
    obsResampled.pts[N - 1][1] - obsResampled.pts[0][1]
  ];
  const tgtNetMag = Math.hypot(tgtNet[0], tgtNet[1]);
  const obsNetMag = Math.hypot(obsNet[0], obsNet[1]);

  let dirFactor = 1;
  if (tgtNetMag > 0.35 && obsNetMag > 0.1) {
    const cos = (tgtNet[0] * obsNet[0] + tgtNet[1] * obsNet[1]) / (tgtNetMag * obsNetMag);
    // Penalize opposite direction strongly
    dirFactor = cos >= 0 ? 0.78 + cos * 0.22 : clamp(0.45 + cos * 0.45, 0.1, 0.45);
  }

  const rawScore = 100 * Math.exp(-dtw * dtw * 3.8) * dirFactor;
  return clamp(Math.round(rawScore), 0, 100);
}

interface MotionSample {
  timestamp: number;
  anchor: [number, number];
  vector: number[];
}

export class DynamicMotionTracker {
  private buffer: MotionSample[] = [];
  private readonly maxWindowMs = 2400;

  reset(): void {
    this.buffer = [];
  }

  update(sign: SignDefinition, hands: Point3D[][], timestamp: number, uiLang: UiLang): DynamicEvaluationResult {
    if (hands.length === 0) {
      return {
        score: 0,
        shapeScore: 0,
        pathScore: 0,
        matched: false,
        progress: 0,
        fingerStatus: defaultFingerStatus('adjust'),
        hint: uiLang === 'bm' ? 'Tunjukkan tangan anda di kamera' : 'Raise your hand into the camera view'
      };
    }

    if (sign.hands === 2 && hands.length < 2) {
      return {
        score: 30,
        shapeScore: 45,
        pathScore: 0,
        matched: false,
        progress: 0.15,
        fingerStatus: defaultFingerStatus('adjust'),
        hint: uiLang === 'bm' ? 'Tunjukkan kedua-dua tangan di kamera' : 'Show both hands in view for this sign'
      };
    }

    const primaryHand = hands[0];
    const features = extractHandFeatures(primaryHand);
    this.buffer.push({
      timestamp,
      anchor: features.palmCenter,
      vector: normalizeLandmarkVector(primaryHand)
    });
    this.buffer = this.buffer.filter((s) => timestamp - s.timestamp <= this.maxWindowMs);

    // Shape evaluation
    let shapeEval: StaticEvaluationResult;
    if (sign.recordedFrames && sign.recordedFrames.length > 0) {
      const vec = this.buffer[this.buffer.length - 1].vector;
      const bestTemplateScore = Math.max(
        ...sign.recordedFrames.map((f) => scoreNormalizedVectors(vec, normalizeLandmarkVector(f.landmarks)))
      );
      shapeEval = {
        score: bestTemplateScore,
        matched: bestTemplateScore >= 72,
        fingerStatus: defaultFingerStatus(bestTemplateScore >= 72 ? 'match' : 'adjust'),
        hint: ''
      };
    } else if (sign.matcherRule) {
      const evals = hands.map((h) => evaluateHandAgainstRule(extractHandFeatures(h), sign.matcherRule!, uiLang));
      evals.sort((a, b) => b.score - a.score);
      shapeEval = evals[0];
    } else {
      shapeEval = {
        score: 75,
        matched: true,
        fingerStatus: defaultFingerStatus('match'),
        hint: ''
      };
    }

    // Target waypoints (from matcherRule or extracted from recordedFrames)
    let targetWaypoints: Array<[number, number]> = sign.matcherRule?.pathWaypoints ?? [];
    if (targetWaypoints.length < 2 && sign.recordedFrames && sign.recordedFrames.length > 2) {
      targetWaypoints = sign.recordedFrames.map((f) => {
        const lm = f.landmarks[9] ?? f.landmarks[0];
        return [lm.x, lm.y];
      });
    }

    let bestPathScore = 0;
    if (targetWaypoints.length >= 2 && this.buffer.length >= 5) {
      const minDisp = sign.matcherRule?.minDisplacement ?? 0.06;
      const windowDurations = [650, 1000, 1450, 2000];
      for (const dur of windowDurations) {
        const sub = this.buffer.filter((s) => timestamp - s.timestamp <= dur);
        if (sub.length >= 4) {
          const path = sub.map((s) => s.anchor);
          const s = computePathSimilarity(path, targetWaypoints, minDisp);
          if (s > bestPathScore) bestPathScore = s;
        }
      }
    } else if (targetWaypoints.length < 2) {
      bestPathScore = shapeEval.score;
    }

    const totalScore = clamp(Math.round(shapeEval.score * 0.5 + bestPathScore * 0.5), 0, 100);
    const matched = shapeEval.score >= 62 && bestPathScore >= 68 && totalScore >= 72;

    let hint = shapeEval.hint;
    if (shapeEval.score >= 65 && bestPathScore < 68) {
      hint =
        uiLang === 'bm'
          ? 'Bentuk tangan bagus — ikut laluan gerakan ambar'
          : 'Good handshape — follow the amber motion path smoothly';
    } else if (matched) {
      hint = uiLang === 'bm' ? 'Gerakan tepat!' : 'Great movement!';
    }

    return {
      score: totalScore,
      shapeScore: shapeEval.score,
      pathScore: bestPathScore,
      matched,
      progress: clamp(bestPathScore / 100, 0, 1),
      fingerStatus: shapeEval.fingerStatus,
      hint
    };
  }
}
