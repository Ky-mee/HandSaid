import { useEffect, useRef, useState } from 'react';
import { Eye, Pause, Play, Rotate3d } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { UI_STRINGS } from '../data/i18n';
import type { SignDefinition, UiLang } from '../data/types';
import { SignCharacterRig } from '../engine/avatar3d/SignCharacterRig';
import { sampleCharacterPose3D } from '../engine/avatar3d/signChoreography3d';
import type { CameraPreset3D, Vec3 } from '../engine/avatar3d/types3d';

interface SignAvatar3DProps {
  sign: SignDefinition;
  uiLang: UiLang;
  loopProgressRef: React.MutableRefObject<number>;
  showTrail: boolean;
  compact?: boolean;
  paused: boolean;
  onTogglePaused: () => void;
}

function getDefaultPresetForSign(sign: SignDefinition): CameraPreset3D {
  return sign.category === 'alphabet' || sign.category === 'number' ? 'closeup' : 'character';
}

function computePresetView(
  preset: CameraPreset3D,
  focusCenter: Vec3
): { pos: [number, number, number]; target: [number, number, number] } {
  switch (preset) {
    case 'closeup':
      return {
        pos: [focusCenter[0] - 0.08, focusCenter[1] + 0.05, focusCenter[2] + 0.62],
        target: [focusCenter[0], focusCenter[1], focusCenter[2]]
      };
    case 'side':
      return {
        pos: [0.82, 0.25, 0.92],
        target: [0, 0.16, 0.18]
      };
    case 'pov':
      return {
        pos: [-0.28, 0.43, -0.34],
        target: [-0.08, 0.14, 0.36]
      };
    case 'character':
    default:
      return {
        pos: [0.06, 0.24, 1.30],
        target: [0, 0.16, 0.12]
      };
  }
}

export function SignAvatar3D({
  sign,
  uiLang,
  loopProgressRef,
  showTrail,
  compact = false,
  paused,
  onTogglePaused
}: SignAvatar3DProps) {
  const t = UI_STRINGS[uiLang];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const signRef = useRef(sign);
  const showTrailRef = useRef(showTrail);
  const presetRef = useRef<CameraPreset3D>(getDefaultPresetForSign(sign));
  const userPinnedPresetRef = useRef(false);
  const transitionRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(0.06, 0.24, 1.30),
    target: new THREE.Vector3(0, 0.16, 0.12)
  });

  const [preset, setPreset] = useState<CameraPreset3D>(() => getDefaultPresetForSign(sign));
  const [hasOrbited, setHasOrbited] = useState(false);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    signRef.current = sign;
    const nextPreset = userPinnedPresetRef.current ? presetRef.current : getDefaultPresetForSign(sign);
    presetRef.current = nextPreset;
    setPreset(nextPreset);
    const sampled = sampleCharacterPose3D(sign, 0);
    const view = computePresetView(nextPreset, sampled.focusCenter);
    transitionRef.current.pos.set(...view.pos);
    transitionRef.current.target.set(...view.target);
    transitionRef.current.active = true;
  }, [sign]);

  useEffect(() => {
    showTrailRef.current = showTrail;
  }, [showTrail]);

  const handleSelectPreset = (next: CameraPreset3D) => {
    userPinnedPresetRef.current = true;
    presetRef.current = next;
    setPreset(next);
    const sampled = sampleCharacterPose3D(signRef.current, loopProgressRef.current);
    const view = computePresetView(next, sampled.focusCenter);
    transitionRef.current.pos.set(...view.pos);
    transitionRef.current.target.set(...view.target);
    transitionRef.current.active = true;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = 'avatar-3d-canvas';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101b29);

    const initialW = Math.max(240, container.clientWidth);
    const initialH = Math.max(200, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(36, initialW / initialH, 0.08, 25);

    const initPose = sampleCharacterPose3D(signRef.current, 0);
    const initView = computePresetView(presetRef.current, initPose.focusCenter);
    camera.position.set(...initView.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 0.34;
    controls.maxDistance = 2.4;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.64;
    controls.target.set(...initView.target);
    controls.update();

    const onControlStart = () => {
      transitionRef.current.active = false;
      setHasOrbited(true);
    };
    controls.addEventListener('start', onControlStart);

    // 3-point studio lighting so palm, thumb, and finger depths separate crisply
    const hemiLight = new THREE.HemisphereLight(0xf6f9fc, 0x162436, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.85);
    keyLight.position.set(1.4, 2.0, 2.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.75);
    fillLight.position.set(-1.6, 0.9, 1.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x45d6bd, 0.95);
    rimLight.position.set(-1.2, 1.4, -1.6);
    scene.add(rimLight);

    // Subtle studio floor grid disc for spatial depth
    const floorGeo = new THREE.CircleGeometry(0.92, 48);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x152538,
      roughness: 0.92,
      metalness: 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.34, 0.08);
    scene.add(floorMesh);

    const gridRingGeo = new THREE.RingGeometry(0.46, 0.472, 48);
    gridRingGeo.rotateX(-Math.PI / 2);
    const gridRingMat = new THREE.MeshBasicMaterial({
      color: 0xe08e1b,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const gridRing = new THREE.Mesh(gridRingGeo, gridRingMat);
    gridRing.position.set(0, -0.338, 0.08);
    scene.add(gridRing);

    const rig = new SignCharacterRig();
    scene.add(rig.root);

    const updateSize = () => {
      const w = Math.max(240, container.clientWidth);
      const h = Math.max(200, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    let rafId = 0;
    let lastNow = performance.now();
    const startNow = lastNow;

    const animate = (now: number) => {
      const dtSec = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      const elapsedSec = (now - startNow) / 1000;

      const curSign = signRef.current;
      const pose = sampleCharacterPose3D(curSign, loopProgressRef.current);
      rig.setSignTrails(curSign, pose.trailRight, pose.trailLeft);
      rig.updatePose(pose, elapsedSec, showTrailRef.current);

      if (transitionRef.current.active) {
        const blend = 1 - Math.exp(-8 * dtSec);
        camera.position.lerp(transitionRef.current.pos, blend);
        controls.target.lerp(transitionRef.current.target, blend);
        if (
          camera.position.distanceTo(transitionRef.current.pos) < 0.004 &&
          controls.target.distanceTo(transitionRef.current.target) < 0.004
        ) {
          camera.position.copy(transitionRef.current.pos);
          controls.target.copy(transitionRef.current.target);
          transitionRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      rig.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      gridRingGeo.dispose();
      gridRingMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [loopProgressRef]);

  const presets: Array<{ id: CameraPreset3D; label: string }> = [
    { id: 'character', label: t.viewCharacter },
    { id: 'closeup', label: t.viewCloseup },
    { id: 'side', label: t.viewSide },
    { id: 'pov', label: t.viewPov }
  ];

  return (
    <div ref={containerRef} className={`avatar-3d-wrap ${compact ? 'is-compact' : ''}`}>
      {webglError && (
        <div className="avatar-webgl-fallback">
          <Eye size={22} />
          <span>3D WebGL preview is unavailable on this browser. Start the camera to use the live guide.</span>
        </div>
      )}

      {!webglError && (
        <>
          <div className="avatar-top-actions">
            {!hasOrbited && !compact && (
              <span className="avatar-orbit-hint">
                <Rotate3d size={14} />
                <span>{t.dragToRotateHint}</span>
              </span>
            )}
            <button
              type="button"
              className="avatar-play-btn"
              onClick={onTogglePaused}
              aria-label={paused ? t.playGuide : t.pauseGuide}
              title={paused ? t.playGuide : t.pauseGuide}
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}
              {!compact && <span>{paused ? t.playGuide : t.pauseGuide}</span>}
            </button>
          </div>

          <div className="avatar-preset-bar" role="group" aria-label="3D camera angle">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`avatar-preset-btn ${preset === p.id ? 'is-active' : ''}`}
                onClick={() => handleSelectPreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
