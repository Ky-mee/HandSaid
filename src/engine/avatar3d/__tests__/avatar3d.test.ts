import { describe, expect, it } from 'vitest';
import { BUILT_IN_SIGNS } from '../../../data';
import type { SignDefinition } from '../../../data/types';
import { synthesizeHandLandmarks } from '../../poseSynthesizer';
import { solveTwoBoneIK } from '../armIK';
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

describe('3D Avatar Inverse Kinematics', () => {
  it('maintains exact upper and lower arm lengths across reachable, near, and extended targets', () => {
    const shoulder: Vec3 = [-0.215, 0.155, 0.01];
    const upperLen = 0.255;
    const lowerLen = 0.245;
    const pole: Vec3 = [-0.36, -0.06, -0.14];

    const targets: Vec3[] = [
      [-0.15, 0.17, 0.31], // normal chest-front signing space
      [-0.08, 0.45, 0.22], // forehead salute
      [-0.215, 0.155, 0.01], // degenerate target at shoulder
      [-0.215, 0.99, 0.01], // over-extended straight up
      [0.12, 0.05, 0.45] // cross-body reach
    ];

    for (const target of targets) {
      const { elbow, wrist } = solveTwoBoneIK(shoulder, target, upperLen, lowerLen, pole);
      assertFiniteVec3(elbow);
      assertFiniteVec3(wrist);
      expect(dist3(shoulder, elbow)).toBeCloseTo(upperLen, 3);
      expect(dist3(elbow, wrist)).toBeCloseTo(lowerLen, 3);
    }
  });
});

describe('3D Character Choreography across all signs', () => {
  it('samples finite 3D hand targets, rotations, trails, and expressions for all 108 built-in signs', () => {
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

  it('anchors everyday signs to distinct 3D body zones and preserves finger details', () => {
    const hello = BUILT_IN_SIGNS.find((s) => s.id === 'asl-everyday-hello')!;
    const terimaKasih = BUILT_IN_SIGNS.find((s) => s.id === 'bim-everyday-terima-kasih')!;
    const maaf = BUILT_IN_SIGNS.find((s) => s.id === 'bim-everyday-maaf')!;
    const letterR = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-r')!;
    const letterM = BUILT_IN_SIGNS.find((s) => s.id === 'bim-alphabet-m')!;

    const helloStart = sampleCharacterPose3D(hello, 0);
    expect(helloStart.rightHand.position[1]).toBeGreaterThan(0.38);

    const tkStart = sampleCharacterPose3D(terimaKasih, 0);
    const tkEnd = sampleCharacterPose3D(terimaKasih, 1);
    expect(tkEnd.rightHand.position[2]).toBeGreaterThan(tkStart.rightHand.position[2] + 0.12);

    const maafStart = sampleCharacterPose3D(maaf, 0);
    const maafMid = sampleCharacterPose3D(maaf, 0.5);
    expect(maafStart.rightHand.position[1]).toBeGreaterThan(maafMid.rightHand.position[1]);
    expect(maaf.mode === 'dynamic' && maafStart.trailRight.length).toBeGreaterThan(10);

    const rPose = sampleCharacterPose3D(letterR, 0);
    expect(rPose.rightHand.pose.crossIndexMiddle).toBe(true);

    const mPose = sampleCharacterPose3D(letterM, 0);
    expect(mPose.rightHand.pose.thumbTuckIndex).toBe(3);
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
