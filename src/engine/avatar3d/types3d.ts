import type { HandPoseSpec } from '../../data/types';

export type Vec3 = [number, number, number];

export type CameraPreset3D = 'character' | 'closeup' | 'side' | 'pov';

export interface HandTarget3D {
  position: Vec3;
  rotationEuler: Vec3;
  pose: HandPoseSpec;
  active: boolean;
}

export interface FacialExpression3D {
  /** -0.5 apologetic/concerned to +1 warm smile */
  smile: number;
  /** -0.6 furrowed to +1 raised questioning */
  browLift: number;
  /** Radians: positive = nod down, negative = chin lift */
  headPitch: number;
  /** Radians: positive = turn left, negative = turn right */
  headYaw: number;
  /** Radians: side head tilt */
  headRoll: number;
  /** 0..1 subtle mouth openness */
  mouthOpen: number;
}

export interface CharacterPose3D {
  rightHand: HandTarget3D;
  leftHand: HandTarget3D;
  expression: FacialExpression3D;
  trailRight: Vec3[];
  trailLeft: Vec3[];
  currentRightAnchor: Vec3;
  focusCenter: Vec3;
}

export interface Keyframe3D {
  t: number;
  rightPos: Vec3;
  rightRot: Vec3;
  rightPose: HandPoseSpec;
  leftPos?: Vec3;
  leftRot?: Vec3;
  leftPose?: HandPoseSpec;
  expression?: Partial<FacialExpression3D>;
}

export interface Choreography3D {
  twoHands: boolean;
  baseExpression?: Partial<FacialExpression3D>;
  keyframes: Keyframe3D[];
}
