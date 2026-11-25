import * as THREE from 'three';
import type { FingerName, HandPoseSpec } from '../../data/types';

type NonThumbFinger = Exclude<FingerName, 'thumb'>;

interface FingerChain {
  mcp: THREE.Group;
  pip: THREE.Group;
  dip: THREE.Group;
  baseX: number;
  baseSplayZ: number;
}

interface ThumbChain {
  cmc: THREE.Group;
  mcp: THREE.Group;
  ip: THREE.Group;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Anatomically proportioned, articulated 3D hand rig with distinct dorsal/palm skin tones,
 * fingernails for unmistakable orientation, 3-phalanx fingers, and an opposable thumb.
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
      color: 0xe7b490,
      roughness: 0.62,
      metalness: 0.02
    });
    const palmSkinMat = new THREE.MeshStandardMaterial({
      color: 0xf4ceb2,
      roughness: 0.68,
      metalness: 0.01
    });
    const nailMat = new THREE.MeshStandardMaterial({
      color: 0xfbeae0,
      roughness: 0.3,
      metalness: 0.04
    });
    const creaseMat = new THREE.MeshStandardMaterial({
      color: 0xd89f79,
      roughness: 0.65,
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
      baseSplay: number;
    }> = [
      { name: 'index', x: 0.0245 * this.sideSign, y: 0.088, lengths: [0.036, 0.024, 0.019], radius: 0.0082, baseSplay: -0.04 },
      { name: 'middle', x: 0.0075 * this.sideSign, y: 0.092, lengths: [0.041, 0.027, 0.020], radius: 0.0085, baseSplay: 0.0 },
      { name: 'ring', x: -0.010 * this.sideSign, y: 0.089, lengths: [0.038, 0.025, 0.019], radius: 0.0080, baseSplay: 0.03 },
      { name: 'pinky', x: -0.0265 * this.sideSign, y: 0.082, lengths: [0.030, 0.020, 0.017], radius: 0.0070, baseSplay: 0.07 }
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
    // Wrist base joint
    const wristGeo = this.trackGeo(new THREE.SphereGeometry(0.023, 14, 12));
    wristGeo.scale(1.15, 0.72, 0.65);
    const wrist = new THREE.Mesh(wristGeo, creaseMat);
    wrist.position.set(0, 0.006, 0);
    this.group.add(wrist);

    // Main palm body (dorsal)
    const palmGeo = this.trackGeo(new THREE.BoxGeometry(0.068, 0.078, 0.022));
    const palm = new THREE.Mesh(palmGeo, dorsalMat);
    palm.position.set(0, 0.048, -0.002);
    this.group.add(palm);

    // Rounded palm pad on +Z (lighter warm tone for instant front/back clarity)
    const padGeo = this.trackGeo(new THREE.SphereGeometry(0.036, 16, 14));
    padGeo.scale(0.95, 1.05, 0.34);
    const palmPad = new THREE.Mesh(padGeo, palmMat);
    palmPad.position.set(0, 0.049, 0.007);
    this.group.add(palmPad);

    // Thenar eminence (fleshy thumb base mound on palm)
    const thenarGeo = this.trackGeo(new THREE.SphereGeometry(0.019, 12, 10));
    thenarGeo.scale(0.85, 1.25, 0.68);
    const thenar = new THREE.Mesh(thenarGeo, palmMat);
    thenar.position.set(0.020 * this.sideSign, 0.034, 0.009);
    thenar.rotation.z = -0.35 * this.sideSign;
    this.group.add(thenar);

    // Knuckle ridge across top of palm
    const ridgeGeo = this.trackGeo(new THREE.CapsuleGeometry(0.011, 0.052, 6, 12));
    ridgeGeo.rotateZ(Math.PI / 2);
    const ridge = new THREE.Mesh(ridgeGeo, dorsalMat);
    ridge.position.set(-0.001 * this.sideSign, 0.084, -0.001);
    this.group.add(ridge);
  }

  private buildFinger(
    cfg: {
      name: NonThumbFinger;
      x: number;
      y: number;
      lengths: [number, number, number];
      radius: number;
      baseSplay: number;
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

    // Proximal phalanx
    const proxMesh = this.createPhalanx(l1, r, dorsalMat, palmMat);
    mcp.add(proxMesh);

    const pip = new THREE.Group();
    pip.position.set(0, l1, 0);
    mcp.add(pip);

    // Middle phalanx
    const midMesh = this.createPhalanx(l2, r * 0.9, dorsalMat, palmMat);
    pip.add(midMesh);

    const dip = new THREE.Group();
    dip.position.set(0, l2, 0);
    pip.add(dip);

    // Distal phalanx + dorsal fingernail
    const distMesh = this.createPhalanx(l3, r * 0.82, dorsalMat, palmMat);
    dip.add(distMesh);

    const nailGeo = this.trackGeo(new THREE.BoxGeometry(r * 1.15, l3 * 0.56, r * 0.35));
    const nail = new THREE.Mesh(nailGeo, nailMat);
    nail.position.set(0, l3 * 0.62, -r * 0.72);
    dip.add(nail);

    return { mcp, pip, dip, baseX: cfg.x, baseSplayZ: cfg.baseSplay };
  }

  private createPhalanx(
    length: number,
    radius: number,
    dorsalMat: THREE.Material,
    palmMat: THREE.Material
  ): THREE.Group {
    const g = new THREE.Group();
    const cylLen = Math.max(0.004, length - radius * 0.6);
    const bodyGeo = this.trackGeo(new THREE.CapsuleGeometry(radius, cylLen, 6, 10));
    const body = new THREE.Mesh(bodyGeo, dorsalMat);
    body.position.set(0, length * 0.5, 0);
    g.add(body);

    // Subtle palm-side pad so finger pads also catch light differently
    const padGeo = this.trackGeo(new THREE.CapsuleGeometry(radius * 0.68, cylLen * 0.72, 4, 8));
    const pad = new THREE.Mesh(padGeo, palmMat);
    pad.position.set(0, length * 0.5, radius * 0.36);
    g.add(pad);

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
    const metaMesh = this.createPhalanx(metaLen, 0.010, dorsalMat, palmMat);
    cmc.add(metaMesh);

    const mcp = new THREE.Group();
    mcp.position.set(0, metaLen, 0);
    cmc.add(mcp);

    const proxLen = 0.025;
    const proxMesh = this.createPhalanx(proxLen, 0.0092, dorsalMat, palmMat);
    mcp.add(proxMesh);

    const ip = new THREE.Group();
    ip.position.set(0, proxLen, 0);
    mcp.add(ip);

    const distLen = 0.021;
    const distMesh = this.createPhalanx(distLen, 0.0085, dorsalMat, palmMat);
    ip.add(distMesh);

    const nailGeo = this.trackGeo(new THREE.BoxGeometry(0.010, 0.011, 0.003));
    const nail = new THREE.Mesh(nailGeo, nailMat);
    nail.position.set(0, distLen * 0.62, -0.0064);
    ip.add(nail);

    return { cmc, mcp, ip };
  }

  /**
   * Apply a HandPoseSpec to the 3D articulated finger joints.
   */
  public applyPose(spec: HandPoseSpec): void {
    const s = this.sideSign;
    const spreadIM = spec.spreads?.indexMiddle ?? 0.12;
    const spreadMR = spec.spreads?.middleRing ?? 0.1;
    const spreadRP = spec.spreads?.ringPinky ?? 0.1;
    const thumbSpread = spec.spreads?.thumb ?? 0.35;

    // 1. Four fingers (positive X rotation flexes fingers forward toward +Z palm)
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

      // Adjust pinch target finger slightly so thumb tip meets fingertip smoothly
      if (spec.pinchTo === name) {
        curl = Math.max(curl, 0.56);
      }

      // Biomechanical joint flexion distribution
      let mcpFlex = curl * 1.48;
      let pipFlex = curl * 1.78;
      let dipFlex = curl * 1.25;

      // For thumb-tuck signs (M, N, T), slightly soften MCP & increase PIP so fingers drape over thumb
      if (spec.thumbTuckIndex && (name === 'index' || (name === 'middle' && spec.thumbTuckIndex >= 2) || (name === 'ring' && spec.thumbTuckIndex >= 3))) {
        mcpFlex = 1.18;
        pipFlex = 1.48;
        dipFlex = 1.05;
      }

      let splayZ = -fingerSplay[name] * s;
      let zOffset = 0;

      // Crossed middle over index (Letter R)
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

      chain.mcp.position.z = zOffset;
      chain.mcp.rotation.set(mcpFlex, 0, splayZ);
      chain.pip.rotation.set(pipFlex, 0, 0);
      chain.dip.rotation.set(dipFlex, 0, 0);
    }

    // 2. Thumb articulation (opposable CMC -> MCP -> IP)
    const tCurl = clamp(spec.curls.thumb, 0, 1);

    if (spec.pinchTo) {
      // Swing thumb across palm in opposition toward pinched fingertip
      const pinchTargetIndex: Record<NonThumbFinger, number> = {
        index: 0,
        middle: 1,
        ring: 2,
        pinky: 3
      };
      const targetIdx = pinchTargetIndex[spec.pinchTo];
      const acrossAngle = lerp(0.55, 1.08, targetIdx / 3);
      this.thumb.cmc.rotation.set(0.75 + targetIdx * 0.08, -acrossAngle * s, -0.32 * s);
      this.thumb.mcp.rotation.set(0.35 + tCurl * 0.28, 0, 0.28 * s);
      this.thumb.ip.rotation.set(0.45 + tCurl * 0.35, 0, 0);
    } else if (spec.thumbAcross) {
      const tuck = spec.thumbTuckIndex ?? 0;
      const acrossReach = tuck > 0 ? lerp(0.52, 0.96, tuck / 3) : lerp(0.45, 0.85, tCurl);
      this.thumb.cmc.rotation.set(0.62, -0.95 * s, -0.45 * s);
      this.thumb.mcp.rotation.set(0.35, 0, acrossReach * 0.55 * s);
      this.thumb.ip.rotation.set(0.32 + tCurl * 0.48, 0, 0);
    } else {
      // Abducted / relaxed thumb outward along radial edge
      const abduct = (0.46 + thumbSpread * 0.45 - tCurl * 0.25) * s;
      this.thumb.cmc.rotation.set(0.18 + tCurl * 0.35, -0.25 * s, -abduct);
      this.thumb.mcp.rotation.set(0.12 + tCurl * 0.55, 0, 0.1 * s);
      this.thumb.ip.rotation.set(0.1 + tCurl * 0.65, 0, 0);
    }
  }

  public dispose(): void {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
  }
}
