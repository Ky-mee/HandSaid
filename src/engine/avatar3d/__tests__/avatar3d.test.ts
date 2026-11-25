import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { BUILT_IN_SIGNS } from '../../../data';
import type { SignDefinition } from '../../../data/types';
import { synthesizeHandLandmarks } from '../../poseSynthesizer';
import {
  HUMAN_ANATOMY_LIMITS,
  clampFingerAngles,
  clampThumbAngles,
  constrainWristQuaternion
} from '../anatomyLimits';
import { solveAnatomicalArmIK, solveTwoBoneIK } from '../armIK';
import { sampleCharacterPose3D } from '../signChoreography3d';
import type { Vec3 } from '../types3d';

function dist3(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function assertFiniteVec3(v: Vec3): void {
  expect(Number.isFinite(v[0])).toBe(true);
  expect(Number.isFinite(v[1])).toBe(true);
  expect(Number.isFinite(v[2])).toBe(true);
}

describe('3D Avatar Inverse Kinematics & Human Anatomy Limits', () => {
  it('maintains exact upper and lower arm lengths across reachable, near, and extended targets', () => {
    const shoulder: Vec3 = [-0.215, 0.155, 0.01];
    const upperLen = 0.255;
    const lowerLen = 0.245;
    const pole: Vec3 = [-0.36, -0.06, -0.14];

    const targets: Vec3[] = [
      [-0.15, 0.17, 0.31],
      [-0.08, 0.45, 0.22],
      [-0.215, 0.155, 0.01],
      [-0.215, 0.99, 0.01],
      [0.12, 0.05, 0.45]
    ];

    for (const target of targets) {
      const { elbow, wrist } = solveTwoBoneIK(shoulder, target, upperLen, lowerLen, pole);
      assertFiniteVec3(elbow);
      assertFiniteVec3(wrist);
      expect(dist3(shoulder, elbow)).toBeCloseTo(upperLen, 3);
      expect(dist3(elbow, wrist)).toBeCloseTo(lowerLen, 3);
    }
  });

  it('enforces physiological elbow flexion (12°-142°) and torso/head anti-clipping', () => {
    const upperLen = 0.255;
    const lowerLen = 0.245;

    const extremeTargets: Vec3[] = [
      [0.0, 0.02, 0.01], // inside torso center
      [0.0, 0.37, 0.02], // inside head center
      [-0.9, 0.9, 0.9], // far beyond arm reach
      [-0.21, 0.16, 0.05] // collapsed near shoulder
    ];

    for (const target of extremeTargets) {
      const { shoulder, elbow, wrist } = solveAnatomicalArmIK('right', target, upperLen, lowerLen);
      assertFiniteVec3(shoulder);
      assertFiniteVec3(elbow);
      assertFiniteVec3(wrist);

      expect(dist3(shoulder, elbow)).toBeCloseTo(upperLen, 3);
      expect(dist3(elbow, wrist)).toBeCloseTo(lowerLen, 3);

      // Elbow flexion angle via law of cosines
      const d = dist3(shoulder, wrist);
      const cosInternal = Math.max(
        -1,
        Math.min(1, (upperLen * upperLen + lowerLen * lowerLen - d * d) / (2 * upperLen * lowerLen))
      );
      const flexRad = Math.PI - Math.acos(cosInternal);
      expect(flexRad).toBeGreaterThanOrEqual(HUMAN_ANATOMY_LIMITS.elbowMinFlexRad - 0.02);
      expect(flexRad).toBeLessThanOrEqual(HUMAN_ANATOMY_LIMITS.elbowMaxFlexRad + 0.02);

      // Verify wrist stays outside torso keep-out core
      const torsoNorm = Math.hypot(
        wrist[0] / 0.16,
        (wrist[1] + 0.02) / 0.24,
        (wrist[2] - 0.01) / 0.11
      );
      expect(torsoNorm).toBeGreaterThanOrEqual(0.99);
    }
  });

  it('constrains wrist orientation within physiological bend cone from forearm axis', () => {
    const forearmDir = new THREE.Vector3(0.1, 0.9, 0.4).normalize();
    const extremeEulers = [
      new THREE.Euler(Math.PI, 0, 0, 'YXZ'),
      new THREE.Euler(-Math.PI * 0.9, Math.PI * 0.5, 0, 'YXZ'),
      new THREE.Euler(0, 0, Math.PI * 0.85, 'YXZ')
    ];

    for (const euler of extremeEulers) {
      const desired = new THREE.Quaternion().setFromEuler(euler);
      const constrained = constrainWristQuaternion(forearmDir, desired);
      const handUp = new THREE.Vector3(0, 1, 0).applyQuaternion(constrained).normalize();
      const angle = Math.acos(Math.max(-1, Math.min(1, handUp.dot(forearmDir))));
      expect(angle).toBeLessThanOrEqual(HUMAN_ANATOMY_LIMITS.wristMaxBendFromForearmRad + 1e-3);
    }
  });

  it('clamps finger and thumb joint angles with coupled DIP flexion and splay attenuation', () => {
    const hyperextended = clampFingerAngles(-0.8, -0.5, -0.5, 0.9);
    expect(hyperextended.mcpFlex).toBeGreaterThanOrEqual(HUMAN_ANATOMY_LIMITS.mcpFlexRange[0]);
    expect(hyperextended.pipFlex).toBeGreaterThanOrEqual(0);
    expect(hyperextended.dipFlex).toBeGreaterThanOrEqual(0);
    expect(hyperextended.splayZ).toBeLessThanOrEqual(HUMAN_ANATOMY_LIMITS.maxFingerSplayRad);

    const openSplay = clampFingerAngles(0.0, 0.0, 0.0, 0.5);
    const curledSplay = clampFingerAngles(1.5, 1.8, 1.3, 0.5);
    expect(curledSplay.splayZ).toBeLessThan(openSplay.splayZ);

    const thumb = clampThumbAngles(2.5, 3.0, -2.5, -1.0, 2.5);
    expect(thumb.cmcFlex).toBeLessThanOrEqual(HUMAN_ANATOMY_LIMITS.thumbCmcFlexRange[1]);
    expect(thumb.cmcOppose).toBeLessThanOrEqual(HUMAN_ANATOMY_LIMITS.thumbCmcOpposeRange[1]);
    expect(thumb.cmcAbduct).toBeGreaterThanOrEqual(HUMAN_ANATOMY_LIMITS.thumbCmcAbductRange[0]);
    expect(thumb.mcpFlex).toBeGreaterThanOrEqual(HUMAN_ANATOMY_LIMITS.thumbMcpFlexRange[0]);
    expect(thumb.ipFlex).toBeLessThanOrEqual(HUMAN_ANATOMY_LIMITS.thumbIpFlexRange[1]);
  });
});

describe('3D Character Choreography across all signs', () => {
  it('samples finite 3D hand targets, rotations, trails, and expressions for all 152 built-in signs', () => {
    expect(BUILT_IN_SIGNS).toHaveLength(152);
    for (const sign of BUILT_IN_SIGNS) {
      for (const t of [0, 0.25, 0.5, 0.75, 1]) {
        const pose = sampleCharacterPose3D(sign, t);
        assertFiniteVec3(pose.rightHand.position);
        assertFiniteVec3(pose.rightHand.rotationEuler);
        assertFiniteVec3(pose.leftHand.position);
        assertFiniteVec3(pose.leftHand.rotationEuler);
        assertFiniteVec3(pose.focusCenter);
        assertFiniteVec3(pose.currentRightAnchor);

        expect(pose.rightHand.active).toBe(true);
        expect(pose.leftHand.active).toBe(sign.hands === 2);

        expect(Number.isFinite(pose.expression.smile)).toBe(true);
        expect(Number.isFinite(pose.expression.browLift)).toBe(true);
        expect(Number.isFinite(pose.expression.headPitch)).toBe(true);
        expect(Number.isFinite(pose.expression.headYaw)).toBe(true);
        expect(Number.isFinite(pose.expression.headRoll)).toBe(true);
        expect(Number.isFinite(pose.expression.mouthOpen)).toBe(true);

        for (const pt of pose.trailRight) assertFiniteVec3(pt);
        for (const pt of pose.trailLeft) assertFiniteVec3(pt);
      }
    }
  });

  it('anchors everyday, people, and feelings signs to distinct 3D body zones', () => {
    const hello = BUILT_IN_SIGNS.find((s) => s.id === 'asl-everyday-hello')!;
    const terimaKasih = BUILT_IN_SIGNS.find((s) => s.id === 'bim-everyday-terima-kasih')!;
    const maaf = BUILT_IN_SIGNS.find((s) => s.id === 'bim-everyday-maaf')!;
    const letterR = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-r')!;
    const letterM = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-m')!;
    const ibu = BUILT_IN_SIGNS.find((s) => s.id === 'bim-people-ibu')!;
    const father = BUILT_IN_SIGNS.find((s) => s.id === 'asl-people-father')!;
    const gembira = BUILT_IN_SIGNS.find((s) => s.id === 'bim-feelings-gembira')!;
    const understand = BUILT_IN_SIGNS.find((s) => s.id === 'asl-feelings-understand')!;

    const helloStart = sampleCharacterPose3D(hello, 0);
    expect(helloStart.rightHand.position[1]).toBeGreaterThan(0.38);

    const tkStart = sampleCharacterPose3D(terimaKasih, 0);
    const tkEnd = sampleCharacterPose3D(terimaKasih, 1);
    expect(tkEnd.rightHand.position[2]).toBeGreaterThan(tkStart.rightHand.position[2] + 0.12);

    const maafStart = sampleCharacterPose3D(maaf, 0);
    const maafMid = sampleCharacterPose3D(maaf, 0.5);
    expect(maafStart.rightHand.position[1]).toBeGreaterThan(maafMid.rightHand.position[1]);
    expect(maaf.mode === 'dynamic' && maafStart.trailRight.length).toBeGreaterThan(10);

    expect(sampleCharacterPose3D(letterR, 0).rightHand.pose.crossIndexMiddle).toBe(true);
    expect(sampleCharacterPose3D(letterM, 0).rightHand.pose.thumbTuckIndex).toBe(3);

    // New signs checks
    const ibuMid = sampleCharacterPose3D(ibu, 0.5);
    expect(ibuMid.rightHand.position[1]).toBeGreaterThan(0.24);
    expect(ibuMid.rightHand.position[1]).toBeLessThan(0.34);

    const fatherMid = sampleCharacterPose3D(father, 0.5);
    expect(fatherMid.rightHand.position[1]).toBeGreaterThan(0.40);

    const gembiraStart = sampleCharacterPose3D(gembira, 0);
    const gembiraMid = sampleCharacterPose3D(gembira, 0.5);
    expect(gembiraMid.rightHand.position[1]).toBeGreaterThan(gembiraStart.rightHand.position[1]);
    expect(gembiraMid.leftHand.active).toBe(true);

    const understandStart = sampleCharacterPose3D(understand, 0);
    const understandEnd = sampleCharacterPose3D(understand, 1);
    expect(understandStart.rightHand.pose.curls.index).toBeGreaterThan(0.8);
    expect(understandEnd.rightHand.pose.curls.index).toBeLessThan(0.15);
  });

  it('retargets custom Studio recordedFrames into finite 3D poses and trails', () => {
    const signA = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-a')!;
    const signB = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-b')!;
    const lm0 = synthesizeHandLandmarks(signA.poseSpec!, [0.45, 0.55], 0.25);
    const lm1 = synthesizeHandLandmarks(signB.poseSpec!, [0.6, 0.42], 0.25);

    const customDynamic: SignDefinition = {
      id: 'custom-3d-test',
      languageId: 'bim',
      category: 'custom',
      mode: 'dynamic',
      hands: 1,
      title: 'Custom Test',
      glossEn: 'Custom Test',
      glossBm: 'Ujian Tersuai',
      descriptionEn: 'Custom test sign',
      descriptionBm: 'Isyarat ujian',
      facialCueEn: 'Smile',
      facialCueBm: 'Senyum',
      difficulty: 1,
      recordedFrames: [
        { t: 0, landmarks: lm0 },
        { t: 1, landmarks: lm1 }
      ],
      isCustom: true
    };

    const p0 = sampleCharacterPose3D(customDynamic, 0);
    const p1 = sampleCharacterPose3D(customDynamic, 1);
    assertFiniteVec3(p0.rightHand.position);
    assertFiniteVec3(p1.rightHand.position);
    expect(p0.trailRight).toHaveLength(2);
    expect(p1.rightHand.position[1]).toBeGreaterThan(p0.rightHand.position[1]);
  });
});
