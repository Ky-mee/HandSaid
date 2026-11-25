import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import type { Point3D } from '../data/types';

export interface TrackedHandsFrame {
  hands: Point3D[][];
  handedness: Array<'Left' | 'Right'>;
}

const LOCAL_WASM_ROOT = '/mediapipe/wasm';
const CDN_WASM_ROOT = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
const HAND_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export class MediaPipeHandTracker {
  private landmarker: HandLandmarker | null = null;
  private initPromise: Promise<HandLandmarker> | null = null;
  private lastVideoTime = -1;

  async init(): Promise<HandLandmarker> {
    if (this.landmarker) return this.landmarker;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      let vision;
      try {
        vision = await FilesetResolver.forVisionTasks(LOCAL_WASM_ROOT);
      } catch {
        vision = await FilesetResolver.forVisionTasks(CDN_WASM_ROOT);
      }

      try {
        this.landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_MODEL_URL,
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.55,
          minHandPresenceConfidence: 0.55,
          minTrackingConfidence: 0.55
        });
      } catch {
        this.landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_MODEL_URL,
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.55,
          minHandPresenceConfidence: 0.55,
          minTrackingConfidence: 0.55
        });
      }

      return this.landmarker;
    })();

    try {
      return await this.initPromise;
    } catch (err) {
      this.initPromise = null;
      throw err;
    }
  }

  detect(video: HTMLVideoElement, timestampMs: number, mirrorX: boolean): TrackedHandsFrame | null {
    if (!this.landmarker || video.readyState < 2) return null;
    if (video.currentTime === this.lastVideoTime) return null;
    this.lastVideoTime = video.currentTime;

    const result = this.landmarker.detectForVideo(video, timestampMs);
    const hands = (result.landmarks ?? []).map((hand) =>
      hand.map((lm) => ({
        x: mirrorX ? 1 - lm.x : lm.x,
        y: lm.y,
        z: lm.z
      }))
    );

    const handedness = (result.handednesses ?? []).map((cats) => {
      const cat = cats[0]?.categoryName;
      return cat === 'Left' ? 'Left' : 'Right';
    });

    return { hands, handedness };
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
    this.initPromise = null;
    this.lastVideoTime = -1;
  }
}
