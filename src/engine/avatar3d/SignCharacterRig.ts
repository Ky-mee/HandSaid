import * as THREE from 'three';
import type { SignDefinition } from '../../data/types';
import { solveTwoBoneIK } from './armIK';
import { HandRig3D } from './HandRig3D';
import type { CharacterPose3D, FacialExpression3D, Vec3 } from './types3d';

const RIGHT_SHOULDER: Vec3 = [-0.215, 0.155, 0.01];
const LEFT_SHOULDER: Vec3 = [0.215, 0.155, 0.01];
const UPPER_ARM_LEN = 0.255;
const FOREARM_LEN = 0.245;

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
 * Full stylized upper-body 3D signing character with expressive head, dual 2-bone IK arms,
 * articulated left/right 3D hands, and cached 3D amber motion trail ribbons.
 */
export class SignCharacterRig {
  public readonly root = new THREE.Group();

  private readonly headGroup = new THREE.Group();
  private readonly leftEye = new THREE.Group();
  private readonly rightEye = new THREE.Group();
  private readonly leftBrow: THREE.Mesh;
  private readonly rightBrow: THREE.Mesh;
  private readonly mouthMesh: THREE.Mesh;

  private readonly rightUpperArm: THREE.Mesh;
  private readonly rightElbow: THREE.Mesh;
  private readonly rightForearm: THREE.Mesh;
  private readonly leftUpperArm: THREE.Mesh;
  private readonly leftElbow: THREE.Mesh;
  private readonly leftForearm: THREE.Mesh;

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

  constructor() {
    const sweaterMat = new THREE.MeshStandardMaterial({
      color: 0x0e6b5e,
      roughness: 0.78,
      metalness: 0.04
    });
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xeaf1ee,
      roughness: 0.7,
      metalness: 0.02
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xe7b490,
      roughness: 0.62,
      metalness: 0.02
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1b2b3f,
      roughness: 0.75,
      metalness: 0.05
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x132238,
      roughness: 0.25,
      metalness: 0.1
    });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const browMat = new THREE.MeshStandardMaterial({
      color: 0x1b2b3f,
      roughness: 0.7
    });
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0xa8554b,
      roughness: 0.55
    });
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xf7b94b,
      emissive: 0xe08e1b,
      emissiveIntensity: 0.65,
      roughness: 0.25
    });

    this.materials.push(
      sweaterMat,
      collarMat,
      skinMat,
      hairMat,
      eyeMat,
      glintMat,
      browMat,
      mouthMat,
      beadMat
    );

    // 1. Upper Torso & Shoulders
    const torsoGeo = this.trackGeo(new THREE.CylinderGeometry(0.175, 0.145, 0.46, 24));
    torsoGeo.scale(1.12, 1, 0.72);
    const torso = new THREE.Mesh(torsoGeo, sweaterMat);
    torso.position.set(0, -0.02, 0);
    this.root.add(torso);

    // Rounded chest/shoulder bridge
    const chestBridgeGeo = this.trackGeo(new THREE.CapsuleGeometry(0.105, 0.23, 8, 16));
    chestBridgeGeo.rotateZ(Math.PI / 2);
    chestBridgeGeo.scale(1, 0.88, 0.82);
    const chestBridge = new THREE.Mesh(chestBridgeGeo, sweaterMat);
    chestBridge.position.set(0, 0.145, 0.005);
    this.root.add(chestBridge);

    // Collar ring
    const collarGeo = this.trackGeo(new THREE.TorusGeometry(0.072, 0.016, 10, 22));
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 0.215, 0.01);
    this.root.add(collar);

    // Subtle chest emblem pin (visual anchor for chest-centered signs)
    const pinGeo = this.trackGeo(new THREE.CircleGeometry(0.018, 16));
    const pin = new THREE.Mesh(pinGeo, collarMat);
    pin.position.set(0.09, 0.11, 0.125);
    this.root.add(pin);

    // Neck
    const neckGeo = this.trackGeo(new THREE.CylinderGeometry(0.052, 0.06, 0.095, 16));
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 0.25, 0.008);
    this.root.add(neck);

    // 2. Expressive Head
    this.headGroup.position.set(0, 0.37, 0.015);
    this.root.add(this.headGroup);

    const craniumGeo = this.trackGeo(new THREE.SphereGeometry(0.118, 24, 20));
    craniumGeo.scale(0.92, 1.12, 0.96);
    const cranium = new THREE.Mesh(craniumGeo, skinMat);
    this.headGroup.add(cranium);

    // Subtle jawline / chin contour for chin-touching signs (Terima Kasih, Water, Good)
    const chinGeo = this.trackGeo(new THREE.SphereGeometry(0.054, 16, 14));
    chinGeo.scale(0.95, 0.8, 0.9);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.078, 0.044);
    this.headGroup.add(chin);

    // Hair cap
    const hairGeo = this.trackGeo(
      new THREE.SphereGeometry(0.122, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.56)
    );
    hairGeo.scale(0.94, 1.08, 0.98);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.018, -0.008);
    hair.rotation.x = -0.22;
    this.headGroup.add(hair);

    // Subtle ears
    const earGeo = this.trackGeo(new THREE.SphereGeometry(0.024, 10, 10));
    earGeo.scale(0.45, 0.9, 0.65);
    const rEar = new THREE.Mesh(earGeo, skinMat);
    rEar.position.set(-0.108, -0.005, 0);
    const lEar = new THREE.Mesh(earGeo, skinMat);
    lEar.position.set(0.108, -0.005, 0);
    this.headGroup.add(rEar, lEar);

    // Nose bridge
    const noseGeo = this.trackGeo(new THREE.CapsuleGeometry(0.010, 0.022, 4, 8));
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.position.set(0, -0.005, 0.112);
    nose.rotation.x = -0.22;
    this.headGroup.add(nose);

    // Eyes with catchlight glints
    const eyeBallGeo = this.trackGeo(new THREE.SphereGeometry(0.013, 12, 10));
    const glintGeo = this.trackGeo(new THREE.SphereGeometry(0.0042, 8, 8));

    const rEyeMesh = new THREE.Mesh(eyeBallGeo, eyeMat);
    const rGlint = new THREE.Mesh(glintGeo, glintMat);
    rGlint.position.set(0.004, 0.004, 0.011);
    this.rightEye.add(rEyeMesh, rGlint);
    this.rightEye.position.set(-0.041, 0.022, 0.099);

    const lEyeMesh = new THREE.Mesh(eyeBallGeo, eyeMat);
    const lGlint = new THREE.Mesh(glintGeo, glintMat);
    lGlint.position.set(0.004, 0.004, 0.011);
    this.leftEye.add(lEyeMesh, lGlint);
    this.leftEye.position.set(0.041, 0.022, 0.099);
    this.headGroup.add(this.rightEye, this.leftEye);

    // Articulated eyebrows
    const browGeo = this.trackGeo(new THREE.CapsuleGeometry(0.0042, 0.026, 4, 8));
    browGeo.rotateZ(Math.PI / 2);
    this.rightBrow = new THREE.Mesh(browGeo, browMat);
    this.rightBrow.position.set(-0.041, 0.048, 0.101);
    this.leftBrow = new THREE.Mesh(browGeo, browMat);
    this.leftBrow.position.set(0.041, 0.048, 0.101);
    this.headGroup.add(this.rightBrow, this.leftBrow);

    // Articulated mouth
    const mouthGeo = this.trackGeo(new THREE.CapsuleGeometry(0.0055, 0.028, 4, 8));
    mouthGeo.rotateZ(Math.PI / 2);
    this.mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    this.mouthMesh.position.set(0, -0.048, 0.102);
    this.headGroup.add(this.mouthMesh);

    // 3. Articulated Arms + Hands
    const upperGeo = this.trackGeo(new THREE.CylinderGeometry(0.044, 0.036, UPPER_ARM_LEN, 14));
    const elbowGeo = this.trackGeo(new THREE.SphereGeometry(0.037, 12, 10));
    const forearmGeo = this.trackGeo(new THREE.CylinderGeometry(0.035, 0.025, FOREARM_LEN, 14));

    this.rightUpperArm = new THREE.Mesh(upperGeo, sweaterMat);
    this.rightElbow = new THREE.Mesh(elbowGeo, sweaterMat);
    this.rightForearm = new THREE.Mesh(forearmGeo, sweaterMat);
    this.leftUpperArm = new THREE.Mesh(upperGeo, sweaterMat);
    this.leftElbow = new THREE.Mesh(elbowGeo, sweaterMat);
    this.leftForearm = new THREE.Mesh(forearmGeo, sweaterMat);

    // Shoulder caps
    const shoulderGeo = this.trackGeo(new THREE.SphereGeometry(0.048, 12, 12));
    const rShoulderCap = new THREE.Mesh(shoulderGeo, sweaterMat);
    rShoulderCap.position.set(...RIGHT_SHOULDER);
    const lShoulderCap = new THREE.Mesh(shoulderGeo, sweaterMat);
    lShoulderCap.position.set(...LEFT_SHOULDER);

    this.root.add(
      rShoulderCap,
      lShoulderCap,
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
    const beadGeo = this.trackGeo(new THREE.SphereGeometry(0.017, 14, 12));
    this.rightBead = new THREE.Mesh(beadGeo, beadMat);
    this.leftBead = new THREE.Mesh(beadGeo, beadMat);
    this.rightBead.visible = false;
    this.leftBead.visible = false;
    this.trailGroup.add(this.rightBead, this.leftBead);
    this.root.add(this.trailGroup);
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private clearCachedTrails(): void {
    // Remove all children except the two reusable bead meshes
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
    // Filter out consecutive near-duplicate points for clean CatmullRom spline
    const unique: THREE.Vector3[] = [];
    for (const p of points) {
      const v = toVec3(p);
      if (unique.length === 0 || unique[unique.length - 1].distanceTo(v) > 0.008) {
        unique.push(v);
      }
    }
    if (unique.length < 2) return;

    const curve = new THREE.CatmullRomCurve3(unique, false, 'centripetal', 0.4);
    const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.0065, 8, false);
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

    // Directional cones at 50% and 95% along path
    const coneGeo = new THREE.ConeGeometry(0.015, 0.036, 10);
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

  private applyExpression(expr: FacialExpression3D, elapsedSec: number): void {
    this.headGroup.rotation.set(expr.headPitch, expr.headYaw, expr.headRoll);

    // Gentle periodic eye blink every ~3.6 seconds
    const blinkCycle = elapsedSec % 3.6;
    const blinkScale = blinkCycle > 3.45 ? Math.max(0.12, Math.abs(Math.cos(((blinkCycle - 3.45) / 0.15) * Math.PI))) : 1;
    this.rightEye.scale.y = blinkScale;
    this.leftEye.scale.y = blinkScale;

    // Eyebrows
    const browY = 0.048 + expr.browLift * 0.011;
    this.rightBrow.position.y = browY;
    this.leftBrow.position.y = browY;
    const browTilt = expr.browLift * 0.14;
    this.rightBrow.rotation.z = -browTilt;
    this.leftBrow.rotation.z = browTilt;

    // Mouth scale & smile tilt
    this.mouthMesh.scale.set(
      1 + Math.max(0, expr.smile) * 0.24,
      1 + expr.mouthOpen * 1.4,
      1
    );
    this.mouthMesh.position.y = -0.048 + expr.smile * 0.004;
  }

  public updatePose(pose: CharacterPose3D, elapsedSec: number, showTrail: boolean): void {
    // 1. Facial expression & subtle idle breathing
    const breathY = Math.sin(elapsedSec * 1.8) * 0.003;
    this.root.position.y = breathY;
    this.applyExpression(pose.expression, elapsedSec);

    // 2. Right arm IK + hand
    const rIK = solveTwoBoneIK(
      RIGHT_SHOULDER,
      pose.rightHand.position,
      UPPER_ARM_LEN,
      FOREARM_LEN,
      [-0.36, -0.06, -0.14]
    );
    const rSh = toVec3(RIGHT_SHOULDER);
    const rEl = toVec3(rIK.elbow);
    const rWr = toVec3(rIK.wrist);
    orientSegment(this.rightUpperArm, rSh, rEl);
    orientSegment(this.rightForearm, rEl, rWr);
    this.rightElbow.position.copy(rEl);
    this.rightHand.group.position.copy(rWr);
    this.rightHand.group.rotation.set(
      pose.rightHand.rotationEuler[0],
      pose.rightHand.rotationEuler[1],
      pose.rightHand.rotationEuler[2]
    );
    this.rightHand.applyPose(pose.rightHand.pose);

    // 3. Left arm IK + hand
    const lIK = solveTwoBoneIK(
      LEFT_SHOULDER,
      pose.leftHand.position,
      UPPER_ARM_LEN,
      FOREARM_LEN,
      [0.36, -0.06, -0.14]
    );
    const lSh = toVec3(LEFT_SHOULDER);
    const lEl = toVec3(lIK.elbow);
    const lWr = toVec3(lIK.wrist);
    orientSegment(this.leftUpperArm, lSh, lEl);
    orientSegment(this.leftForearm, lEl, lWr);
    this.leftElbow.position.copy(lEl);
    this.leftHand.group.position.copy(lWr);
    this.leftHand.group.rotation.set(
      pose.leftHand.rotationEuler[0],
      pose.leftHand.rotationEuler[1],
      pose.leftHand.rotationEuler[2]
    );
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
