import * as THREE from 'three';
import type { FacialExpression3D, Vec3 } from './types3d';

export const HUMAN_ANATOMY_LIMITS = {
  /** Minimum ~12 deg and maximum ~142 deg physiological elbow flexion */
  elbowMinFlexRad: 0.21,
  elbowMaxFlexRad: 2.48,
  /** Maximum wrist deviation from forearm axis (~78 deg) */
  wristMaxBendFromForearmRad: 1.36,
  /** Finger joint physiological ranges (radians) */
  mcpFlexRange: [-0.12, 1.52] as const,
  pipFlexRange: [0, 1.83] as const,
  dipFlexRange: [0, 1.35] as const,
  maxFingerSplayRad: 0.30,
  /** Thumb joint physiological ranges (radians) */
  thumbCmcFlexRange: [-0.25, 1.05] as const,
  thumbCmcOpposeRange: [-0.15, 1.25] as const,
  thumbCmcAbductRange: [-0.95, 0.25] as const,
  thumbMcpFlexRange: [0, 0.98] as const,
  thumbIpFlexRange: [-0.10, 1.35] as const,
  /** Cervical head rotation limits (radians) */
  headPitchRange: [-0.35, 0.42] as const,
  headYawRange: [-0.52, 0.52] as const,
  headRollRange: [-0.28, 0.28] as const
} as const;

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function pushOutOfEllipsoid(
  point: Vec3,
  center: Vec3,
  radii: Vec3
): Vec3 {
  const dx = point[0] - center[0];
  const dy = point[1] - center[1];
  const dz = point[2] - center[2];

  const nx = dx / radii[0];
  const ny = dy / radii[1];
  const nz = dz / radii[2];
  const norm = Math.hypot(nx, ny, nz);

  if (norm >= 1) return point;

  if (norm < 1e-4) {
    return [center[0], center[1], center[2] + radii[2] * 1.02];
  }

  // Bias forward slightly if point is near front chest/face plane so hands stay visible in front
  const forwardBias = dz >= -0.04 ? Math.max(0, 0.18 * (1 - norm)) : 0;
  const scale = 1.015 / norm;
  return [
    center[0] + nx * scale * radii[0],
    center[1] + ny * scale * radii[1],
    center[2] + (nz * scale + forwardBias) * radii[2]
  ];
}

/**
 * Prevent wrists and elbows from penetrating the character's torso or head volumes.
 */
export function clampPointOutsideBody(point: Vec3, margin = 0.025): Vec3 {
  let out = pushOutOfEllipsoid(
    point,
    [0, -0.02, 0.01],
    [0.16 + margin, 0.24 + margin, 0.11 + margin]
  );
  out = pushOutOfEllipsoid(
    out,
    [0, 0.37, 0.015],
    [0.11 + margin, 0.13 + margin, 0.115 + margin]
  );
  return out;
}

/**
 * Natural clavicular/scapular shoulder elevation and forward protraction
 * when the signing hand rises or reaches across the midline.
 */
export function computeDynamicShoulder(side: 'right' | 'left', targetWrist: Vec3): Vec3 {
  const sideSign = side === 'right' ? -1 : 1;
  const baseX = 0.205 * sideSign;
  const baseY = 0.155;
  const baseZ = 0.01;

  const liftFactor = clamp((targetWrist[1] - 0.20) / 0.28, 0, 1);
  const crossReach =
    side === 'right'
      ? clamp((targetWrist[0] + 0.06) / 0.24, 0, 1)
      : clamp((0.06 - targetWrist[0]) / 0.24, 0, 1);
  const forwardReach = clamp((targetWrist[2] - 0.26) / 0.22, 0, 1);

  return [
    baseX - sideSign * (crossReach * 0.016),
    baseY + liftFactor * 0.032,
    baseZ + Math.max(crossReach * 0.020, forwardReach * 0.022)
  ];
}

/**
 * Adaptive elbow pole target that naturally lowers the elbow at chest height
 * and lifts/opens it slightly when signing near the forehead or across the torso.
 */
export function computeAnatomicalElbowPole(side: 'right' | 'left', targetWrist: Vec3): Vec3 {
  const sideSign = side === 'right' ? -1 : 1;
  const liftFactor = clamp((targetWrist[1] - 0.16) / 0.32, 0, 1);
  const forwardFactor = clamp((targetWrist[2] - 0.25) / 0.20, 0, 1);

  return [
    sideSign * (0.34 + liftFactor * 0.06),
    -0.15 + liftFactor * 0.22,
    -0.07 + forwardFactor * 0.08 + liftFactor * 0.04
  ];
}

/**
 * Constrain desired hand orientation so the wrist never bends past physiological
 * limits relative to the forearm direction.
 */
export function constrainWristQuaternion(
  forearmDir: THREE.Vector3,
  desiredQuat: THREE.Quaternion
): THREE.Quaternion {
  const fDir = forearmDir.clone();
  if (fDir.lengthSq() < 1e-8) return desiredQuat.clone();
  fDir.normalize();

  const handUp = new THREE.Vector3(0, 1, 0).applyQuaternion(desiredQuat).normalize();
  const dot = clamp(handUp.dot(fDir), -1, 1);
  const angle = Math.acos(dot);

  if (angle <= HUMAN_ANATOMY_LIMITS.wristMaxBendFromForearmRad) {
    return desiredQuat.clone();
  }

  const excess = angle - HUMAN_ANATOMY_LIMITS.wristMaxBendFromForearmRad;
  const axis = new THREE.Vector3().crossVectors(handUp, fDir);
  if (axis.lengthSq() < 1e-8) {
    axis.set(1, 0, 0).cross(fDir);
    if (axis.lengthSq() < 1e-8) {
      axis.set(0, 0, 1).cross(fDir);
    }
  }
  axis.normalize();

  const swing = new THREE.Quaternion().setFromAxisAngle(axis, excess);
  return swing.multiply(desiredQuat.clone());
}

/**
 * Enforce physiological flexion, natural DIP-PIP coupling, and splay attenuation.
 */
export function clampFingerAngles(
  mcpFlex: number,
  pipFlex: number,
  dipFlex: number,
  splayZ: number
): { mcpFlex: number; pipFlex: number; dipFlex: number; splayZ: number } {
  const mcp = clamp(mcpFlex, HUMAN_ANATOMY_LIMITS.mcpFlexRange[0], HUMAN_ANATOMY_LIMITS.mcpFlexRange[1]);
  const pip = clamp(pipFlex, HUMAN_ANATOMY_LIMITS.pipFlexRange[0], HUMAN_ANATOMY_LIMITS.pipFlexRange[1]);
  const maxDipFromPip = clamp(pip * 0.85 + 0.14, 0, HUMAN_ANATOMY_LIMITS.dipFlexRange[1]);
  const dip = clamp(dipFlex, HUMAN_ANATOMY_LIMITS.dipFlexRange[0], maxDipFromPip);

  const splayAtten = 1 - 0.65 * clamp(mcp / HUMAN_ANATOMY_LIMITS.mcpFlexRange[1], 0, 1);
  const maxSplay = HUMAN_ANATOMY_LIMITS.maxFingerSplayRad * splayAtten;
  const splay = clamp(splayZ, -maxSplay, maxSplay);

  return { mcpFlex: mcp, pipFlex: pip, dipFlex: dip, splayZ: splay };
}

/**
 * Enforce physiological thumb CMC, MCP, and IP joint angles.
 */
export function clampThumbAngles(
  cmcFlex: number,
  cmcOppose: number,
  cmcAbduct: number,
  mcpFlex: number,
  ipFlex: number
): {
  cmcFlex: number;
  cmcOppose: number;
  cmcAbduct: number;
  mcpFlex: number;
  ipFlex: number;
} {
  return {
    cmcFlex: clamp(cmcFlex, HUMAN_ANATOMY_LIMITS.thumbCmcFlexRange[0], HUMAN_ANATOMY_LIMITS.thumbCmcFlexRange[1]),
    cmcOppose: clamp(cmcOppose, HUMAN_ANATOMY_LIMITS.thumbCmcOpposeRange[0], HUMAN_ANATOMY_LIMITS.thumbCmcOpposeRange[1]),
    cmcAbduct: clamp(cmcAbduct, HUMAN_ANATOMY_LIMITS.thumbCmcAbductRange[0], HUMAN_ANATOMY_LIMITS.thumbCmcAbductRange[1]),
    mcpFlex: clamp(mcpFlex, HUMAN_ANATOMY_LIMITS.thumbMcpFlexRange[0], HUMAN_ANATOMY_LIMITS.thumbMcpFlexRange[1]),
    ipFlex: clamp(ipFlex, HUMAN_ANATOMY_LIMITS.thumbIpFlexRange[0], HUMAN_ANATOMY_LIMITS.thumbIpFlexRange[1])
  };
}

/**
 * Enforce natural cervical spine and facial expression bounds.
 */
export function clampHeadExpression(expr: FacialExpression3D): FacialExpression3D {
  return {
    smile: clamp(expr.smile, -0.6, 1),
    browLift: clamp(expr.browLift, -0.7, 1),
    headPitch: clamp(expr.headPitch, HUMAN_ANATOMY_LIMITS.headPitchRange[0], HUMAN_ANATOMY_LIMITS.headPitchRange[1]),
    headYaw: clamp(expr.headYaw, HUMAN_ANATOMY_LIMITS.headYawRange[0], HUMAN_ANATOMY_LIMITS.headYawRange[1]),
    headRoll: clamp(expr.headRoll, HUMAN_ANATOMY_LIMITS.headRollRange[0], HUMAN_ANATOMY_LIMITS.headRollRange[1]),
    mouthOpen: clamp(expr.mouthOpen, 0, 1)
  };
}
