export type UiLang = 'en' | 'bm';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export interface HandPoseSpec {
  /** 0 = straight extended, 1 = tightly curled into palm */
  curls: Record<FingerName, number>;
  spreads?: {
    thumb?: number;
    indexMiddle?: number;
    middleRing?: number;
    ringPinky?: number;
  };
  thumbAcross?: boolean;
  thumbTuckIndex?: number;
  pinchTo?: 'index' | 'middle' | 'ring' | 'pinky';
  crossIndexMiddle?: boolean;
  /** Degrees in screen space: 0 upright, -90 pointing sideways, 180 downward */
  rotationZ?: number;
  palmFacing?: 'camera' | 'inward' | 'side' | 'up' | 'down';
}

export interface MotionKeyframe {
  /** Normalized loop position 0..1 */
  t: number;
  /** Normalized canvas anchor [x, y] in 0..1 */
  anchor: [number, number];
  pose: HandPoseSpec;
  secondHand?: {
    anchor: [number, number];
    pose: HandPoseSpec;
  };
}

export interface MatcherRule {
  curls: Record<FingerName, number>;
  curlTolerance?: Partial<Record<FingerName, number>>;
  pinchTo?: 'index' | 'middle' | 'ring' | 'pinky';
  minIndexMiddleSpread?: number;
  maxIndexMiddleSpread?: number;
  requireThumbAcross?: boolean;
  requireCrossIndexMiddle?: boolean;
  targetTiltDeg?: number;
  tiltToleranceDeg?: number;
  /** Relative waypoints for dynamic motion signs (first point [0,0] or normalized arc) */
  pathWaypoints?: Array<[number, number]>;
  minDisplacement?: number;
}

export interface RecordedFrame {
  t: number;
  landmarks: Point3D[];
  secondLandmarks?: Point3D[];
}

export type SignCategory = 'alphabet' | 'number' | 'everyday' | 'people' | 'feelings' | 'custom';

export interface SignDefinition {
  id: string;
  languageId: string;
  category: SignCategory;
  mode: 'static' | 'dynamic';
  hands: 1 | 2;
  title: string;
  glossEn: string;
  glossBm: string;
  descriptionEn: string;
  descriptionBm: string;
  facialCueEn: string;
  facialCueBm: string;
  difficulty: 1 | 2 | 3;
  poseSpec?: HandPoseSpec;
  secondHandPose?: HandPoseSpec;
  motionKeyframes?: MotionKeyframe[];
  matcherRule?: MatcherRule;
  recordedFrames?: RecordedFrame[];
  isCustom?: boolean;
}

export type WorldRegion =
  | 'Southeast Asia'
  | 'East Asia'
  | 'South Asia'
  | 'Americas'
  | 'Europe'
  | 'Oceania'
  | 'Middle East & Africa';

export interface SignLanguageInfo {
  id: string;
  isoCode: string;
  nameEn: string;
  nameBm: string;
  nativeName: string;
  region: WorldRegion;
  countryOrArea: string;
  alphabetSystem: 'one-handed' | 'two-handed' | 'syllabic' | 'mixed';
  family: string;
  hasBuiltInPack: boolean;
  noteEn: string;
  noteBm: string;
}

export type AppView = 'learn' | 'atlas' | 'studio';

export interface AppPreferences {
  uiLang: UiLang;
  activeLanguageId: string;
  showGhost: boolean;
  mirrorCamera: boolean;
  playbackSpeed: 0.5 | 1;
  soundEnabled: boolean;
  autoAdvance: boolean;
}
