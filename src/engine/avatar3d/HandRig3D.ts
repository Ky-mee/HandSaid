import * as THREE from 'three';
import type { FingerName, HandPoseSpec } from '../../data/types';
import { clamp, clampFingerAngles, clampThumbAngles } from './anatomyLimits';

type NonThumbFinger = Exclude<FingerName, 'thumb'>;

interface FingerChain {
  mcp: THREE.Group;
  pip: THREE.Group;
  dip: THREE.Group;
}

interface ThumbChain {
  cmc: THREE.Group;
  mcp: THREE.Group;
  ip: THREE.Group;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Sleek, anatomically proportioned, articulated 3D hand rig with contoured bevelled palm,
 * tapered phalanges, smooth knuckle joints, oval dorsal nails, and strict human joint limits.
 *
 * Local coordinate convention (before wrist rotation):
 * - Wrist origin at (0, 0, 0)
 * - Fingers point upward along +Y
 * - Palm faces +Z (viewer), back of hand faces -Z
 * - Thumb sits on +X for right hand, -X for left hand
 */
export class HandRig3D {
  public readonly group = new THREE.Group();
  private readonly sideSign: 1 | -1;
  private readonly fingers: Record<NonThumbFinger, FingerChain>;
  private readonly thumb: ThumbChain;

  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];

  constructor(side: 'right' | 'left') {
    this.sideSign = side === 'right' ? 1 : -1;
    this.group.rotation.order = 'YXZ';

    const dorsalSkinMat = new THREE.MeshStandardMaterial({
      color: 0xe6b38f,
      roughness: 0.56,
      metalness: 0.02
    });
    const palmSkinMat = new THREE.MeshStandardMaterial({
      color: 0xf4cfb4,
      roughness: 0.62,
      metalness: 0.01
    });
    const nailMat = new THREE.MeshStandardMaterial({
      color: 0xfceee5,
      roughness: 0.24,
      metalness: 0.05
    });
    const creaseMat = new THREE.MeshStandardMaterial({
      color: 0xd9a17b,
      roughness: 0.6,
      metalness: 0.02
    });
    this.materials.push(dorsalSkinMat, palmSkinMat, nailMat, creaseMat);

    this.buildPalm(dorsalSkinMat, palmSkinMat, creaseMat);

    const fingerConfigs: Array<{
      name: NonThumbFinger;
      x: number;
      y: number;
      lengths: [number, number, number];
      radius: number;
    }> = [
      { name: 'index', x: 0.0245 * this.sideSign, y: 0.088, lengths: [0.036, 0.024, 0.019], radius: 0.0082 },
      { name: 'middle', x: 0.0075 * this.sideSign, y: 0.092, lengths: [0.041, 0.027, 0.020], radius: 0.0085 },
      { name: 'ring', x: -0.010 * this.sideSign, y: 0.089, lengths: [0.038, 0.025, 0.019], radius: 0.0080 },
      { name: 'pinky', x: -0.0265 * this.sideSign, y: 0.081, lengths: [0.030, 0.020, 0.017], radius: 0.0070 }
    ];

    const fingerMap = {} as Record<NonThumbFinger, FingerChain>;
    for (const cfg of fingerConfigs) {
      fingerMap[cfg.name] = this.buildFinger(cfg, dorsalSkinMat, palmSkinMat, nailMat);
    }
    this.fingers = fingerMap;
    this.thumb = this.buildThumb(dorsalSkinMat, palmSkinMat, nailMat);
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private buildPalm(
    dorsalMat: THREE.Material,
    palmMat: THREE.Material,
    creaseMat: THREE.Material
  ): void {
    const s = this.sideSign;

    // Smooth wrist blend collar
    const wristGeo = this.trackGeo(new THREE.SphereGeometry(0.022, 16, 14));
    wristGeo.scale(1.12, 0.72, 0.64);
    const wrist = new THREE.Mesh(wristGeo, creaseMat);
    wrist.position.set(0, 0.005, 0);
    this.group.add(wrist);

    // Contoured bevelled palm silhouette (tapered wrist -> wider metacarpal arch)
    const shape = new THREE.Shape();
    shape.moveTo(-0.023 * s, 0.006);
    shape.quadraticCurveTo(-0.034 * s, 0.044, -0.032 * s, 0.079);
    shape.quadraticCurveTo(-0.014 * s, 0.090, 0.008 * s, 0.091);
    shape.quadraticCurveTo(0.028 * s, 0.089, 0.034 * s, 0.078);
    shape.quadraticCurveTo(0.036 * s, 0.042, 0.023 * s, 0.006);
    shape.closePath();

    const palmGeo = this.trackGeo(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.012,
        bevelEnabled: true,
        bevelThickness: 0.0055,
        bevelSize: 0.0045,
        bevelSegments: 4,
        curveSegments: 16
      })
    );
    palmGeo.translate(0, 0, -0.007);
    const palm = new THREE.Mesh(palmGeo, dorsalMat);
    this.group.add(palm);

    // Soft convex inner palm pad on +Z
    const padGeo = this.trackGeo(new THREE.SphereGeometry(0.034, 18, 14));
    padGeo.scale(0.95, 1.06, 0.32);
    const palmPad = new THREE.Mesh(padGeo, palmMat);
    palmPad.position.set(0, 0.050, 0.0065);
    this.group.add(palmPad);

    // Sculpted thenar eminence (fleshy thumb base mound)
    const thenarGeo = this.trackGeo(new THREE.SphereGeometry(0.019, 14, 12));
    thenarGeo.scale(0.85, 1.28, 0.68);
    const thenar = new THREE.Mesh(thenarGeo, palmMat);
    thenar.position.set(0.020 * s, 0.034, 0.0085);
    thenar.rotation.z = -0.34 * s;
    this.group.add(thenar);

    // Subtle hypothenar cushion along pinky edge
    const hypoGeo = this.trackGeo(new THREE.SphereGeometry(0.014, 12, 10));
    hypoGeo.scale(0.68, 1.75, 0.55);
    const hypo = new THREE.Mesh(hypoGeo, palmMat);
    hypo.position.set(-0.025 * s, 0.042, 0.005);
    this.group.add(hypo);

    // Rounded metacarpal knuckle arch
    const ridgeGeo = this.trackGeo(new THREE.CapsuleGeometry(0.010, 0.048, 6, 12));
    ridgeGeo.rotateZ(Math.PI / 2);
    const ridge = new THREE.Mesh(ridgeGeo, dorsalMat);
    ridge.position.set(-0.001 * s, 0.083, -0.001);
    this.group.add(ridge);
  }

  private buildFinger(
    cfg: {
      name: NonThumbFinger;
      x: number;
      y: number;
      lengths: [number, number, number];
      radius: number;
    },
    dorsalMat: THREE.Material,
    palmMat: THREE.Material,
    nailMat: THREE.Material
  ): FingerChain {
    const mcp = new THREE.Group();
    mcp.position.set(cfg.x, cfg.y, 0);
    this.group.add(mcp);

    const [l1, l2, l3] = cfg.lengths;
    const r = cfg.radius;

    // Smooth knuckle sphere + tapered proximal phalanx
    const proxMesh = this.createTaperedPhalanx(l1, r, r * 0.88, dorsalMat, palmMat, false);
    mcp.add(proxMesh);

    const pip = new THREE.Group();
    pip.position.set(0, l1, 0);
    mcp.add(pip);

    // Tapered middle phalanx
    const midMesh = this.createTaperedPhalanx(l2, r * 0.88, r * 0.78, dorsalMat, palmMat, false);
    pip.add(midMesh);

    const dip = new THREE.Group();
    dip.position.set(0, l2, 0);
    pip.add(dip);

    // Tapered distal phalanx with rounded tip + sleek oval fingernail
    const distMesh = this.createTaperedPhalanx(l3, r * 0.78, r * 0.64, dorsalMat, palmMat, true);
    dip.add(distMesh);

    const nailGeo = this.trackGeo(new THREE.SphereGeometry(r * 0.62, 12, 10));
    nailGeo.scale(0.95, 1.38, 0.28);
    const nail = new THREE.Mesh(nailGeo, nailMat);
    nail.position.set(0, l3 * 0.68, -r * 0.62);
    dip.add(nail);

    return { mcp, pip, dip };
  }

  private createTaperedPhalanx(
    length: number,
    baseRadius: number,
    tipRadius: number,
    dorsalMat: THREE.Material,
    palmMat: THREE.Material,
    roundTip: boolean
  ): THREE.Group {
    const g = new THREE.Group();

    // Joint sphere at proximal origin so bends never expose seams
    const jointGeo = this.trackGeo(new THREE.SphereGeometry(baseRadius * 0.98, 12, 10));
    const joint = new THREE.Mesh(jointGeo, dorsalMat);
    g.add(joint);

    // Tapered anatomical phalanx shaft
    const shaftGeo = this.trackGeo(
      new THREE.CylinderGeometry(tipRadius, baseRadius, length, 12, 1)
    );
    const shaft = new THREE.Mesh(shaftGeo, dorsalMat);
    shaft.position.set(0, length * 0.5, 0);
    g.add(shaft);

    // Soft volar pad on +Z palm side
    const padGeo = this.trackGeo(
      new THREE.CapsuleGeometry(tipRadius * 0.72, Math.max(0.002, length * 0.58), 4, 8)
    );
    const pad = new THREE.Mesh(padGeo, palmMat);
    pad.position.set(0, length * 0.52, baseRadius * 0.30);
    g.add(pad);

    if (roundTip) {
      const tipGeo = this.trackGeo(new THREE.SphereGeometry(tipRadius * 0.98, 12, 10));
      const tip = new THREE.Mesh(tipGeo, dorsalMat);
      tip.position.set(0, length, 0);
      g.add(tip);
    }

    return g;
  }

  private buildThumb(
    dorsalMat: THREE.Material,
    palmMat: THREE.Material,
    nailMat: THREE.Material
  ): ThumbChain {
    const cmc = new THREE.Group();
    cmc.position.set(0.031 * this.sideSign, 0.025, 0.007);
    this.group.add(cmc);

    const metaLen = 0.030;
    const metaMesh = this.createTaperedPhalanx(metaLen, 0.0102, 0.0094, dorsalMat, palmMat, false);
    cmc.add(metaMesh);

    const mcp = new THREE.Group();
    mcp.position.set(0, metaLen, 0);
    cmc.add(mcp);

    const proxLen = 0.025;
    const proxMesh = this.createTaperedPhalanx(proxLen, 0.0094, 0.0086, dorsalMat, palmMat, false);
    mcp.add(proxMesh);

    const ip = new THREE.Group();
    ip.position.set(0, proxLen, 0);
    mcp.add(ip);

    const distLen = 0.021;
    const distMesh = this.createTaperedPhalanx(distLen, 0.0086, 0.0072, dorsalMat, palmMat, true);
    ip.add(distMesh);

    const nailGeo = this.trackGeo(new THREE.SphereGeometry(0.0056, 12, 10));
    nailGeo.scale(0.95, 1.32, 0.28);
    const nail = new THREE.Mesh(nailGeo, nailMat);
    nail.position.set(0, distLen * 0.66, -0.0062);
    ip.add(nail);

    return { cmc, mcp, ip };
  }

  /**
   * Apply a HandPoseSpec to the 3D articulated finger joints with biomechanical limits.
   */
  public applyPose(spec: HandPoseSpec): void {
    const s = this.sideSign;
    const spreadIM = spec.spreads?.indexMiddle ?? 0.12;
    const spreadMR = spec.spreads?.middleRing ?? 0.1;
    const spreadRP = spec.spreads?.ringPinky ?? 0.1;
    const thumbSpread = spec.spreads?.thumb ?? 0.35;

    // 1. Four fingers (with anatomical range clamps, DIP coupling & splay attenuation)
    const fingerSplay: Record<NonThumbFinger, number> = {
      index: -0.06 - spreadIM * 0.24,
      middle: 0.04 * (spreadIM - spreadMR),
      ring: 0.05 + spreadMR * 0.22,
      pinky: 0.10 + (spreadMR + spreadRP) * 0.22
    };

    const order: NonThumbFinger[] = ['index', 'middle', 'ring', 'pinky'];
    for (const name of order) {
      const chain = this.fingers[name];
      let curl = clamp(spec.curls[name], 0, 1);

      if (spec.pinchTo === name) {
        curl = Math.max(curl, 0.56);
      }

      let mcpFlex = curl * 1.48;
      let pipFlex = curl * 1.78;
      let dipFlex = curl * 1.25;

      if (
        spec.thumbTuckIndex &&
        (name === 'index' ||
          (name === 'middle' && spec.thumbTuckIndex >= 2) ||
          (name === 'ring' && spec.thumbTuckIndex >= 3))
      ) {
        mcpFlex = 1.18;
        pipFlex = 1.48;
        dipFlex = 1.05;
      }

      let splayZ = -fingerSplay[name] * s;
      let zOffset = 0;

      if (spec.crossIndexMiddle) {
        if (name === 'index') {
          splayZ = 0.09 * s;
          mcpFlex = 0.12;
          zOffset = -0.002;
        } else if (name === 'middle') {
          splayZ = -0.17 * s;
          mcpFlex = 0.22;
          pipFlex = 0.28;
          zOffset = 0.005;
        }
      }

      const clamped = clampFingerAngles(mcpFlex, pipFlex, dipFlex, splayZ);
      chain.mcp.position.z = zOffset;
      chain.mcp.rotation.set(clamped.mcpFlex, 0, clamped.splayZ);
      chain.pip.rotation.set(clamped.pipFlex, 0, 0);
      chain.dip.rotation.set(clamped.dipFlex, 0, 0);
    }

    // 2. Thumb articulation (canonical right-hand limits before side mirroring)
    const tCurl = clamp(spec.curls.thumb, 0, 1);

    let cmcFlex = 0;
    let cmcOppose = 0;
    let cmcAbduct = 0;
    let mcpFlex = 0;
    let mcpSpread = 0;
    let ipFlex = 0;

    if (spec.pinchTo) {
      const pinchTargetIndex: Record<NonThumbFinger, number> = {
        index: 0,
        middle: 1,
        ring: 2,
        pinky: 3
      };
      const targetIdx = pinchTargetIndex[spec.pinchTo];
      const acrossAngle = lerp(0.55, 1.08, targetIdx / 3);
      cmcFlex = 0.75 + targetIdx * 0.08;
      cmcOppose = acrossAngle;
      cmcAbduct = -0.32;
      mcpFlex = 0.35 + tCurl * 0.28;
      mcpSpread = 0.28;
      ipFlex = 0.45 + tCurl * 0.35;
    } else if (spec.thumbAcross) {
      const tuck = spec.thumbTuckIndex ?? 0;
      const acrossReach = tuck > 0 ? lerp(0.52, 0.96, tuck / 3) : lerp(0.45, 0.85, tCurl);
      cmcFlex = 0.62;
      cmcOppose = 0.95;
      cmcAbduct = -0.45;
      mcpFlex = 0.35;
      mcpSpread = acrossReach * 0.55;
      ipFlex = 0.32 + tCurl * 0.48;
    } else {
      const abduct = 0.46 + thumbSpread * 0.45 - tCurl * 0.25;
      cmcFlex = 0.18 + tCurl * 0.35;
      cmcOppose = 0.25;
      cmcAbduct = -abduct;
      mcpFlex = 0.12 + tCurl * 0.55;
      mcpSpread = 0.1;
      ipFlex = 0.1 + tCurl * 0.65;
    }

    const clampedThumb = clampThumbAngles(cmcFlex, cmcOppose, cmcAbduct, mcpFlex, ipFlex);
    this.thumb.cmc.rotation.set(
      clampedThumb.cmcFlex,
      -clampedThumb.cmcOppose * s,
      clampedThumb.cmcAbduct * s
    );
    this.thumb.mcp.rotation.set(clampedThumb.mcpFlex, 0, mcpSpread * s);
    this.thumb.ip.rotation.set(clampedThumb.ipFlex, 0, 0);
  }

  public dispose(): void {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
  }
}
