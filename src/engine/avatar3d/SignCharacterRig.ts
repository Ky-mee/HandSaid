import * as THREE from 'three';
import type { SignDefinition } from '../../data/types';
import { clampHeadExpression, constrainWristQuaternion } from './anatomyLimits';
import { solveAnatomicalArmIK } from './armIK';
import { HandRig3D } from './HandRig3D';
import type { CharacterPose3D, FacialExpression3D, Vec3 } from './types3d';

const UPPER_ARM_LEN = 0.255;
const FOREARM_LEN = 0.245;
const MOUTH_NODE_COUNT = 9;

function toVec3(v: Vec3): THREE.Vector3 {
  return new THREE.Vector3(v[0], v[1], v[2]);
}

function orientSegment(
  mesh: THREE.Object3D,
  start: THREE.Vector3,
  end: THREE.Vector3
): void {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const len = dir.length();
  mesh.position.copy(mid);
  if (len > 1e-5) {
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  }
}

/**
 * Sleek stylized upper-body 3D signing character with sculpted LatheGeometry torso,
 * cuffed sleeve-to-skin forearm transition, layered hair, expressive curved smile/brows,
 * anatomical 2-bone IK with anti-clipping limits, forearm-constrained wrists, and 3D motion trails.
 */
export class SignCharacterRig {
  public readonly root = new THREE.Group();

  private readonly headGroup = new THREE.Group();
  private readonly leftEye = new THREE.Group();
  private readonly rightEye = new THREE.Group();
  private readonly leftBrow: THREE.Mesh;
  private readonly rightBrow: THREE.Mesh;
  private readonly mouthBeads: THREE.Mesh[] = [];
  private readonly mouthInner: THREE.Mesh;

  private readonly rightShoulderCap: THREE.Mesh;
  private readonly rightUpperArm: THREE.Mesh;
  private readonly rightElbow: THREE.Mesh;
  private readonly rightForearm: THREE.Group;

  private readonly leftShoulderCap: THREE.Mesh;
  private readonly leftUpperArm: THREE.Mesh;
  private readonly leftElbow: THREE.Mesh;
  private readonly leftForearm: THREE.Group;

  private readonly rightHand: HandRig3D;
  private readonly leftHand: HandRig3D;

  private readonly trailGroup = new THREE.Group();
  private readonly rightBead: THREE.Mesh;
  private readonly leftBead: THREE.Mesh;
  private cachedTrailKey = '';
  private hasRightTrail = false;
  private hasLeftTrail = false;

  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];
  private readonly trailDisposables: Array<THREE.BufferGeometry | THREE.Material> = [];
  private readonly tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  private readonly tempQuat = new THREE.Quaternion();
  private readonly tempDir = new THREE.Vector3();

  constructor() {
    const sweaterMat = new THREE.MeshStandardMaterial({
      color: 0x0f6e61,
      roughness: 0.72,
      metalness: 0.04
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x0a4f46,
      roughness: 0.68,
      metalness: 0.05
    });
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xedf3f0,
      roughness: 0.64,
      metalness: 0.02
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xe6b38f,
      roughness: 0.56,
      metalness: 0.02
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1b2b40,
      roughness: 0.64,
      metalness: 0.06
    });
    const scleraMat = new THREE.MeshStandardMaterial({
      color: 0xf9fbfc,
      roughness: 0.25
    });
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x263a52,
      roughness: 0.22,
      metalness: 0.08
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0e1622 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const browMat = new THREE.MeshStandardMaterial({
      color: 0x1b2b40,
      roughness: 0.65
    });
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0xb15950,
      roughness: 0.48
    });
    const mouthInnerMat = new THREE.MeshStandardMaterial({
      color: 0x612725,
      roughness: 0.7
    });
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xf7b94b,
      emissive: 0xe08e1b,
      emissiveIntensity: 0.7,
      roughness: 0.24
    });

    this.materials.push(
      sweaterMat,
      trimMat,
      collarMat,
      skinMat,
      hairMat,
      scleraMat,
      irisMat,
      pupilMat,
      glintMat,
      browMat,
      mouthMat,
      mouthInnerMat,
      beadMat
    );

    // 1. Sleek Sculpted Lathe Torso + Shoulders + Layered Collar
    const torsoProfile = [
      new THREE.Vector2(0.0, -0.255),
      new THREE.Vector2(0.118, -0.255),
      new THREE.Vector2(0.130, -0.17),
      new THREE.Vector2(0.146, -0.06),
      new THREE.Vector2(0.165, 0.06),
      new THREE.Vector2(0.160, 0.14),
      new THREE.Vector2(0.118, 0.185),
      new THREE.Vector2(0.072, 0.212),
      new THREE.Vector2(0.0, 0.212)
    ];
    const torsoGeo = this.trackGeo(new THREE.LatheGeometry(torsoProfile, 28));
    torsoGeo.scale(1.14, 1, 0.72);
    const torso = new THREE.Mesh(torsoGeo, sweaterMat);
    this.root.add(torso);

    // Shoulder yoke curve
    const yokeGeo = this.trackGeo(new THREE.CapsuleGeometry(0.088, 0.24, 8, 18));
    yokeGeo.rotateZ(Math.PI / 2);
    yokeGeo.scale(1, 0.82, 0.78);
    const yoke = new THREE.Mesh(yokeGeo, sweaterMat);
    yoke.position.set(0, 0.148, 0.005);
    this.root.add(yoke);

    // Layered inner collar + outer sweater ribbing
    const collarTrimGeo = this.trackGeo(new THREE.TorusGeometry(0.074, 0.015, 12, 26));
    collarTrimGeo.rotateX(Math.PI / 2);
    const collarTrim = new THREE.Mesh(collarTrimGeo, trimMat);
    collarTrim.position.set(0, 0.210, 0.01);
    this.root.add(collarTrim);

    const innerCollarGeo = this.trackGeo(new THREE.TorusGeometry(0.064, 0.013, 12, 24));
    innerCollarGeo.rotateX(Math.PI / 2);
    const innerCollar = new THREE.Mesh(innerCollarGeo, collarMat);
    innerCollar.position.set(0, 0.220, 0.01);
    this.root.add(innerCollar);

    // Subtle chest emblem badge (visual anchor for chest-centered signs)
    const pinOuterGeo = this.trackGeo(new THREE.CylinderGeometry(0.017, 0.017, 0.005, 18));
    pinOuterGeo.rotateX(Math.PI / 2);
    const pinOuter = new THREE.Mesh(pinOuterGeo, collarMat);
    pinOuter.position.set(0.088, 0.105, 0.119);
    const pinCoreGeo = this.trackGeo(new THREE.CylinderGeometry(0.009, 0.009, 0.006, 16));
    pinCoreGeo.rotateX(Math.PI / 2);
    const pinCore = new THREE.Mesh(pinCoreGeo, beadMat);
    pinCore.position.set(0.088, 0.105, 0.120);
    this.root.add(pinOuter, pinCore);

    // Tapered anatomical neck
    const neckGeo = this.trackGeo(new THREE.CylinderGeometry(0.048, 0.058, 0.10, 18));
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 0.255, 0.008);
    this.root.add(neck);

    // 2. Refined Expressive Head + Modern Layered Hair
    this.headGroup.position.set(0, 0.37, 0.015);
    this.root.add(this.headGroup);

    const craniumGeo = this.trackGeo(new THREE.SphereGeometry(0.114, 28, 22));
    craniumGeo.scale(0.91, 1.10, 0.95);
    const cranium = new THREE.Mesh(craniumGeo, skinMat);
    this.headGroup.add(cranium);

    // Sculpted jaw & chin for clear chin/cheek sign landmarks
    const chinGeo = this.trackGeo(new THREE.SphereGeometry(0.050, 18, 14));
    chinGeo.scale(0.92, 0.78, 0.88);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.078, 0.044);
    this.headGroup.add(chin);

    // Layered modern hair crown + front wave + side tapers
    const hairCrownGeo = this.trackGeo(
      new THREE.SphereGeometry(0.120, 26, 20, 0, Math.PI * 2, 0, Math.PI * 0.54)
    );
    hairCrownGeo.scale(0.94, 1.06, 0.98);
    const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
    hairCrown.position.set(0, 0.022, -0.008);
    hairCrown.rotation.x = -0.25;
    this.headGroup.add(hairCrown);

    const waveGeo = this.trackGeo(new THREE.CapsuleGeometry(0.032, 0.095, 8, 14));
    waveGeo.rotateZ(Math.PI / 2);
    waveGeo.scale(1.0, 0.65, 0.85);
    const frontWave = new THREE.Mesh(waveGeo, hairMat);
    frontWave.position.set(0.015, 0.092, 0.062);
    frontWave.rotation.set(0.28, -0.12, -0.14);
    this.headGroup.add(frontWave);

    const sideHairGeo = this.trackGeo(new THREE.CapsuleGeometry(0.018, 0.048, 6, 10));
    const rSideHair = new THREE.Mesh(sideHairGeo, hairMat);
    rSideHair.position.set(-0.096, 0.032, 0.008);
    rSideHair.rotation.z = 0.08;
    const lSideHair = new THREE.Mesh(sideHairGeo, hairMat);
    lSideHair.position.set(0.096, 0.032, 0.008);
    lSideHair.rotation.z = -0.08;
    this.headGroup.add(rSideHair, lSideHair);

    // Subtle ears
    const earGeo = this.trackGeo(new THREE.SphereGeometry(0.022, 12, 10));
    earGeo.scale(0.42, 0.88, 0.62);
    const rEar = new THREE.Mesh(earGeo, skinMat);
    rEar.position.set(-0.104, -0.005, 0);
    const lEar = new THREE.Mesh(earGeo, skinMat);
    lEar.position.set(0.104, -0.005, 0);
    this.headGroup.add(rEar, lEar);

    // Sleek nose bridge
    const noseGeo = this.trackGeo(new THREE.CapsuleGeometry(0.0085, 0.022, 4, 10));
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.position.set(0, -0.006, 0.108);
    nose.rotation.x = -0.22;
    this.headGroup.add(nose);

    // Refined eyes (sclera + iris + pupil + specular catchlight)
    const scleraGeo = this.trackGeo(new THREE.SphereGeometry(0.0145, 14, 12));
    scleraGeo.scale(1.12, 0.94, 0.72);
    const irisGeo = this.trackGeo(new THREE.SphereGeometry(0.0095, 12, 10));
    irisGeo.scale(1, 1, 0.5);
    const pupilGeo = this.trackGeo(new THREE.SphereGeometry(0.0052, 10, 8));
    pupilGeo.scale(1, 1, 0.45);
    const glintGeo = this.trackGeo(new THREE.SphereGeometry(0.0028, 8, 8));

    for (const [eyeGrp, ex] of [
      [this.rightEye, -0.039],
      [this.leftEye, 0.039]
    ] as const) {
      const sclera = new THREE.Mesh(scleraGeo, scleraMat);
      const iris = new THREE.Mesh(irisGeo, irisMat);
      iris.position.set(0, 0, 0.0075);
      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(0, 0, 0.0102);
      const glint = new THREE.Mesh(glintGeo, glintMat);
      glint.position.set(0.0032, 0.0032, 0.0118);
      eyeGrp.add(sclera, iris, pupil, glint);
      eyeGrp.position.set(ex, 0.020, 0.095);
      this.headGroup.add(eyeGrp);
    }

    // Curved arched eyebrows
    const browCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.016, -0.002, 0),
      new THREE.Vector3(0, 0.004, 0.003),
      new THREE.Vector3(0.016, -0.002, 0)
    );
    const browGeo = this.trackGeo(new THREE.TubeGeometry(browCurve, 12, 0.0034, 8, false));
    this.rightBrow = new THREE.Mesh(browGeo, browMat);
    this.rightBrow.position.set(-0.039, 0.044, 0.098);
    this.leftBrow = new THREE.Mesh(browGeo, browMat);
    this.leftBrow.position.set(0.039, 0.044, 0.098);
    this.headGroup.add(this.rightBrow, this.leftBrow);

    // Dynamic curved 3D smile arc (9 smooth nodes) + subtle open-mouth backing
    const mouthNodeGeo = this.trackGeo(new THREE.SphereGeometry(0.0042, 10, 8));
    for (let i = 0; i < MOUTH_NODE_COUNT; i += 1) {
      const node = new THREE.Mesh(mouthNodeGeo, mouthMat);
      this.mouthBeads.push(node);
      this.headGroup.add(node);
    }
    const mouthInnerGeo = this.trackGeo(new THREE.SphereGeometry(0.012, 12, 10));
    mouthInnerGeo.scale(1.3, 0.7, 0.35);
    this.mouthInner = new THREE.Mesh(mouthInnerGeo, mouthInnerMat);
    this.mouthInner.position.set(0, -0.050, 0.097);
    this.mouthInner.visible = false;
    this.headGroup.add(this.mouthInner);

    // 3. Sleek Tapered Arms with Rolled-Sleeve Cuff -> Skin Wrist Transition
    const upperGeo = this.trackGeo(new THREE.CylinderGeometry(0.044, 0.035, UPPER_ARM_LEN, 16));
    const elbowGeo = this.trackGeo(new THREE.SphereGeometry(0.035, 14, 12));
    const shoulderGeo = this.trackGeo(new THREE.SphereGeometry(0.046, 14, 12));

    this.rightShoulderCap = new THREE.Mesh(shoulderGeo, sweaterMat);
    this.rightUpperArm = new THREE.Mesh(upperGeo, sweaterMat);
    this.rightElbow = new THREE.Mesh(elbowGeo, sweaterMat);
    this.rightForearm = this.createCuffedForearm(sweaterMat, trimMat, skinMat);

    this.leftShoulderCap = new THREE.Mesh(shoulderGeo, sweaterMat);
    this.leftUpperArm = new THREE.Mesh(upperGeo, sweaterMat);
    this.leftElbow = new THREE.Mesh(elbowGeo, sweaterMat);
    this.leftForearm = this.createCuffedForearm(sweaterMat, trimMat, skinMat);

    this.root.add(
      this.rightShoulderCap,
      this.leftShoulderCap,
      this.rightUpperArm,
      this.rightElbow,
      this.rightForearm,
      this.leftUpperArm,
      this.leftElbow,
      this.leftForearm
    );

    this.rightHand = new HandRig3D('right');
    this.leftHand = new HandRig3D('left');
    this.root.add(this.rightHand.group, this.leftHand.group);

    // 4. 3D Motion Trails & Animated Target Beads
    const beadGeo = this.trackGeo(new THREE.SphereGeometry(0.016, 14, 12));
    this.rightBead = new THREE.Mesh(beadGeo, beadMat);
    this.leftBead = new THREE.Mesh(beadGeo, beadMat);
    this.rightBead.visible = false;
    this.leftBead.visible = false;
    this.trailGroup.add(this.rightBead, this.leftBead);
    this.root.add(this.trailGroup);
  }

  private createCuffedForearm(
    sleeveMat: THREE.Material,
    cuffMat: THREE.Material,
    skinMat: THREE.Material
  ): THREE.Group {
    const g = new THREE.Group();
    const sleeveLen = FOREARM_LEN * 0.56;
    const skinLen = FOREARM_LEN * 0.44;

    const sleeveGeo = this.trackGeo(new THREE.CylinderGeometry(0.029, 0.035, sleeveLen, 16));
    const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeve.position.set(0, -FOREARM_LEN * 0.5 + sleeveLen * 0.5, 0);
    g.add(sleeve);

    const cuffGeo = this.trackGeo(new THREE.TorusGeometry(0.0295, 0.0052, 10, 20));
    cuffGeo.rotateX(Math.PI / 2);
    const cuff = new THREE.Mesh(cuffGeo, cuffMat);
    cuff.position.set(0, -FOREARM_LEN * 0.5 + sleeveLen, 0);
    g.add(cuff);

    const skinForearmGeo = this.trackGeo(new THREE.CylinderGeometry(0.021, 0.027, skinLen, 16));
    const skinForearm = new THREE.Mesh(skinForearmGeo, skinMat);
    skinForearm.position.set(0, FOREARM_LEN * 0.5 - skinLen * 0.5, 0);
    g.add(skinForearm);

    return g;
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private clearCachedTrails(): void {
    for (let i = this.trailGroup.children.length - 1; i >= 0; i -= 1) {
      const child = this.trailGroup.children[i];
      if (child !== this.rightBead && child !== this.leftBead) {
        this.trailGroup.remove(child);
      }
    }
    for (const item of this.trailDisposables) {
      item.dispose();
    }
    this.trailDisposables.length = 0;
  }

  private addTrailTube(points: Vec3[], opacity = 0.72): void {
    if (points.length < 2) return;
    const unique: THREE.Vector3[] = [];
    for (const p of points) {
      const v = toVec3(p);
      if (unique.length === 0 || unique[unique.length - 1].distanceTo(v) > 0.008) {
        unique.push(v);
      }
    }
    if (unique.length < 2) return;

    const curve = new THREE.CatmullRomCurve3(unique, false, 'centripetal', 0.4);
    const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.006, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xe08e1b,
      emissive: 0xe08e1b,
      emissiveIntensity: 0.42,
      transparent: true,
      opacity,
      roughness: 0.35
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    this.trailGroup.add(tube);
    this.trailDisposables.push(tubeGeo, tubeMat);

    const coneGeo = new THREE.ConeGeometry(0.014, 0.034, 10);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0xf6b64d,
      emissive: 0xe08e1b,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });
    this.trailDisposables.push(coneGeo, coneMat);

    for (const frac of [0.5, 0.96]) {
      const pt = curve.getPointAt(frac);
      const tan = curve.getTangentAt(frac).normalize();
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(pt);
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
      this.trailGroup.add(cone);
    }
  }

  /**
   * Build 3D trail ribbons only when the selected sign changes.
   */
  public setSignTrails(sign: SignDefinition, trailRight: Vec3[], trailLeft: Vec3[]): void {
    const key = `${sign.id}:${sign.recordedFrames?.length ?? 0}`;
    if (this.cachedTrailKey === key) return;
    this.cachedTrailKey = key;
    this.clearCachedTrails();

    this.hasRightTrail = trailRight.length >= 2;
    this.hasLeftTrail = trailLeft.length >= 2;

    if (this.hasRightTrail) {
      this.addTrailTube(trailRight, 0.78);
    }
    if (this.hasLeftTrail) {
      this.addTrailTube(trailLeft, 0.56);
    }
  }

  private applyExpression(rawExpr: FacialExpression3D, elapsedSec: number): void {
    const expr = clampHeadExpression(rawExpr);
    this.headGroup.rotation.set(expr.headPitch, expr.headYaw, expr.headRoll);

    // Smooth periodic eye blink every ~3.6 seconds
    const blinkCycle = elapsedSec % 3.6;
    const blinkScale =
      blinkCycle > 3.45
        ? Math.max(0.12, Math.abs(Math.cos(((blinkCycle - 3.45) / 0.15) * Math.PI)))
        : 1;
    this.rightEye.scale.y = blinkScale;
    this.leftEye.scale.y = blinkScale;

    // Eyebrows
    const browY = 0.044 + expr.browLift * 0.010;
    this.rightBrow.position.y = browY;
    this.leftBrow.position.y = browY;
    const browTilt = expr.browLift * 0.14;
    this.rightBrow.rotation.z = -browTilt;
    this.leftBrow.rotation.z = browTilt;

    // Curved 3D smile arc
    const halfW = 0.018 + Math.max(0, expr.smile) * 0.005;
    const cornerLift = expr.smile * 0.0085;
    for (let i = 0; i < MOUTH_NODE_COUNT; i += 1) {
      const u = (i / (MOUTH_NODE_COUNT - 1)) * 2 - 1; // -1..+1
      const x = u * halfW;
      const y = -0.051 + cornerLift * (u * u) - expr.mouthOpen * 0.003 * (1 - u * u);
      const z = 0.100 - u * u * 0.004;
      const node = this.mouthBeads[i];
      node.position.set(x, y, z);
      const thickness = 1 - Math.abs(u) * 0.25;
      node.scale.set(1, thickness, 0.85);
    }

    if (expr.mouthOpen > 0.08) {
      this.mouthInner.visible = true;
      this.mouthInner.scale.set(0.85, 0.45 + expr.mouthOpen * 0.9, 1);
    } else {
      this.mouthInner.visible = false;
    }
  }

  private applyWristOrientation(
    hand: HandRig3D,
    elbow: THREE.Vector3,
    wrist: THREE.Vector3,
    rotationEuler: Vec3
  ): void {
    this.tempDir.copy(wrist).sub(elbow).normalize();
    this.tempEuler.set(rotationEuler[0], rotationEuler[1], rotationEuler[2], 'YXZ');
    this.tempQuat.setFromEuler(this.tempEuler);
    const safeQuat = constrainWristQuaternion(this.tempDir, this.tempQuat);
    hand.group.quaternion.copy(safeQuat);
  }

  public updatePose(pose: CharacterPose3D, elapsedSec: number, showTrail: boolean): void {
    // 1. Facial expression & subtle idle breathing
    const breathY = Math.sin(elapsedSec * 1.8) * 0.003;
    this.root.position.y = breathY;
    this.applyExpression(pose.expression, elapsedSec);

    // 2. Right arm anatomical IK + forearm-constrained wrist
    const rIK = solveAnatomicalArmIK('right', pose.rightHand.position, UPPER_ARM_LEN, FOREARM_LEN);
    const rSh = toVec3(rIK.shoulder);
    const rEl = toVec3(rIK.elbow);
    const rWr = toVec3(rIK.wrist);
    this.rightShoulderCap.position.copy(rSh);
    orientSegment(this.rightUpperArm, rSh, rEl);
    orientSegment(this.rightForearm, rEl, rWr);
    this.rightElbow.position.copy(rEl);
    this.rightHand.group.position.copy(rWr);
    this.applyWristOrientation(this.rightHand, rEl, rWr, pose.rightHand.rotationEuler);
    this.rightHand.applyPose(pose.rightHand.pose);

    // 3. Left arm anatomical IK + forearm-constrained wrist
    const lIK = solveAnatomicalArmIK('left', pose.leftHand.position, UPPER_ARM_LEN, FOREARM_LEN);
    const lSh = toVec3(lIK.shoulder);
    const lEl = toVec3(lIK.elbow);
    const lWr = toVec3(lIK.wrist);
    this.leftShoulderCap.position.copy(lSh);
    orientSegment(this.leftUpperArm, lSh, lEl);
    orientSegment(this.leftForearm, lEl, lWr);
    this.leftElbow.position.copy(lEl);
    this.leftHand.group.position.copy(lWr);
    this.applyWristOrientation(this.leftHand, lEl, lWr, pose.leftHand.rotationEuler);
    this.leftHand.applyPose(pose.leftHand.pose);

    // 4. 3D motion trail visibility & bead tracking
    this.trailGroup.visible = showTrail;
    this.rightBead.visible = showTrail && this.hasRightTrail;
    if (this.rightBead.visible) {
      this.rightBead.position.set(...pose.currentRightAnchor);
    }
    this.leftBead.visible = showTrail && this.hasLeftTrail && pose.leftHand.active;
    if (this.leftBead.visible) {
      this.leftBead.position.set(...pose.leftHand.position);
    }
  }

  public dispose(): void {
    this.rightHand.dispose();
    this.leftHand.dispose();
    this.clearCachedTrails();
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
  }
}
